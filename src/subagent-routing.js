import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROUTING_MARKER = '<!-- dsh-model-gear:routes-v1 -->';
const MAX_ROUTING_BYTES = 256 * 1024;
const MAX_SEARCH_LEVELS = 12;
const MAX_ROUTES = 16;
const MAX_PROMPT_BYTES = 2000;

function routeKey(route) {
  return `${route.provider}\0${route.model}`;
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

function normalizeMatch(value) {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const keys = Object.keys(value);
  if (keys.some(key => key !== 'taskType' && key !== 'keywords')) return undefined;
  const taskType = value.taskType === undefined ? undefined : nonEmptyString(value.taskType);
  const keywords = value.keywords === undefined ? undefined
    : Array.isArray(value.keywords) && value.keywords.every(item => nonEmptyString(item))
      ? value.keywords.map(item => item.trim()).slice(0, 16)
      : undefined;
  if (value.taskType !== undefined && taskType === undefined) return undefined;
  if (value.keywords !== undefined && keywords === undefined) return undefined;
  if (taskType === undefined && keywords === undefined) return undefined;
  return { ...(taskType ? { taskType } : {}), ...(keywords ? { keywords } : {}) };
}

function normalizeRoutingConfig(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  if (Object.keys(value).some(key => key !== 'version' && key !== 'routes')) return undefined;
  if (value.version !== 1 || !Array.isArray(value.routes)) return undefined;
  const routes = [];
  for (const rule of value.routes.slice(0, MAX_ROUTES)) {
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) continue;
    if (Object.keys(rule).some(key => !['id', 'match', 'target', 'effort', 'priority'].includes(key))) continue;
    const id = nonEmptyString(rule.id);
    const match = normalizeMatch(rule.match);
    const target = rule.target;
    const provider = nonEmptyString(target?.provider);
    const model = nonEmptyString(target?.model);
    if (!id || !match || !provider || !model) continue;
    const item = { id, match, target: { provider, model } };
    const effort = nonEmptyString(rule.effort);
    if (rule.effort !== undefined && !effort) continue;
    if (effort) item.effort = effort;
    if (rule.priority !== undefined && (!Number.isSafeInteger(rule.priority) || rule.priority < 0)) continue;
    if (rule.priority !== undefined) item.priority = rule.priority;
    routes.push(item);
  }
  if (routes.length === 0) return undefined;
  routes.sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0));
  return { version: 1, routes };
}

/**
 * Parse only the explicit marker + JSON fenced block owned by this plugin.
 * Ordinary AGENTS.md prose, YAML front matter, and arbitrary JSON are ignored.
 */
export function parseRoutingBlock(text) {
  if (typeof text !== 'string') return undefined;
  const marker = text.indexOf(ROUTING_MARKER);
  if (marker < 0) return undefined;
  const tail = text.slice(marker + ROUTING_MARKER.length);
  const fenced = /^\s*```json\s*([\s\S]*?)\s*```/i.exec(tail);
  if (!fenced) return undefined;
  try {
    return normalizeRoutingConfig(JSON.parse(fenced[1]));
  } catch {
    return undefined;
  }
}

function candidateFiles(cwd) {
  if (typeof cwd !== 'string' || !cwd.trim()) return [];
  let current = resolve(cwd);
  const files = [];
  for (let index = 0; index < MAX_SEARCH_LEVELS; index += 1) {
    // Both names are accepted only when the explicit marker/schema is present.
    files.push(join(current, 'agents.md'), join(current, 'AGENTS.md'));
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return files;
}

/** Find the nearest explicit routing block, most-specific first. */
export function loadRoutingConfig(cwd, warn = () => {}) {
  for (const file of candidateFiles(cwd)) {
    try {
      if (!existsSync(file)) continue;
      const source = readFileSync(file, 'utf8');
      if (Buffer.byteLength(source, 'utf8') > MAX_ROUTING_BYTES) continue;
      const config = parseRoutingBlock(source);
      if (config) return { ...config, file };
    } catch (error) {
      try { warn(`[dsh-model-gear] routing metadata unreadable: ${String(error)}`); } catch {}
    }
  }
  return undefined;
}

function validRoute(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && nonEmptyString(value.provider) && nonEmptyString(value.model);
}

/** Feature-detect the official settings service without making it a dependency. */
export function readOfficialModelSelection(ctx) {
  let settings;
  try { settings = ctx?.get?.('subagentModelSelection'); } catch { return undefined; }
  if (!settings || typeof settings.current !== 'function') return undefined;
  let current;
  try { current = settings.current(); } catch { return undefined; }
  if (current && typeof current.then === 'function') return undefined;
  if (!current || current.enabled !== true || !Array.isArray(current.allowedModels)) return undefined;
  const seen = new Set();
  const routes = current.allowedModels.filter(validRoute).map(route => ({
    provider: route.provider.trim(),
    model: route.model.trim(),
  })).filter(route => !seen.has(routeKey(route)) && seen.add(routeKey(route)));
  // An enabled empty allowlist is still an official enabled state. The host tool
  // owns the resulting behavior; the advisory simply reports that no explicit
  // model route is available.
  return { routes };
}

/** Keep explicit assignments that the official allowlist can actually accept. */
export function compatibleRouting(official, routing) {
  if (!official || !routing?.routes) return undefined;
  const allowed = new Set(official.routes.map(routeKey));
  const routes = routing.routes.map(route => {
    const key = routeKey(route.target);
    return {
      ...route,
      available: allowed.has(key),
      ...(!allowed.has(key) ? { availabilityReason: 'unavailable under the official allowlist' } : {}),
    };
  });
  return routes.length > 0 ? { version: 1, routes, file: routing.file } : undefined;
}

function matchText(match) {
  const parts = [];
  if (match?.taskType) parts.push(`taskType=${match.taskType}`);
  if (match?.keywords?.length) parts.push(`keywords=${match.keywords.join('|')}`);
  return parts.join(', ');
}

/** Render a model-visible advisory; it never claims to enforce host routing. */
export function routingNotice(official, routing) {
  if (!official) return undefined;
  const lines = [
    '## Subagent model selection (advisory)',
    'Source: official subagentModelSelection',
    'Enabled: true',
    'Enforcement: host/tool-subagent; this plugin only reminds and does not enforce.',
    'Available official models (actual host selection surface):',
    ...(official.routes.length > 0 ? official.routes.map(route => {
      return `- ${route.provider}/${route.model}: available`;
    }) : ['- (none)']),
  ];
  if (routing?.routes?.length) {
    lines.push('Recommended dsh-model-gear routing assignments (advisory; choose one only when its match fits the task):');
    for (const route of routing.routes) {
      const state = route.available ? 'available' : `unavailable${route.availabilityReason ? ` (${route.availabilityReason})` : ''}`;
      lines.push(`- ${route.id} [${matchText(route.match)}] → ${route.target.provider}/${route.target.model}${route.effort ? ` (${route.effort})` : ''}: recommended; ${state}`);
    }
  }
  return lines.join('\n').slice(0, MAX_PROMPT_BYTES);
}

export const ROUTING_BLOCK_EXAMPLE = `${ROUTING_MARKER}\n\`\`\`json\n{\n  "version": 1,\n  "routes": [{\n    "id": "implementation",\n    "match": { "taskType": "implementation" },\n    "target": { "provider": "cpa", "model": "gpt-6.1-terra" },\n    "effort": "high",\n    "priority": 10\n  }]\n}\n\`\`\``;
