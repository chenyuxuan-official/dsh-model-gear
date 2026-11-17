// Effort repair for a profile patch file: add the tiers a model is missing, and remove the keys the
// loader cannot accept.
//
// The plugin never owns the model catalog: the profile does, and the DSH model directory is what the
// panel reads. This module is the narrow exception that lets the panel *propose* a fix — and it edits
// text, never YAML:
//
//   · the target file is an existing `cordis.patch.yml`, found by locating the `- id: <model>` row;
//   · only the `reasoningEfforts:` block of that one row is touched;
//   · every other byte, including the user's provider config, is left alone;
//   · a timestamped copy is written before the change, so a bad edit is restorable;
//   · nothing is written unless the caller asked for `apply`.
//
// Why the validity check exists: `dsh-llm-pi-ai` validates `reasoningEfforts` with
// `z.dict(..., z.union(THINKING_LEVELS))`, so a key outside that set is a *schema* error. In a deferred
// read the whole provider is dropped with a diagnostic — every model of that provider disappears from
// the picker, which looks nothing like "one tier is misspelled". A repair that only ever added keys
// would therefore ship the bug it is supposed to fix, so removal is part of the plan.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/** Model ids are file-content keys here, so the shape is validated before it becomes a regex. */
const MODEL_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/**
 * The only tier keys this DSH build accepts, in escalation order.
 *
 * Mirrors `THINKING_LEVELS` in `@deepseek-ai/dsh-llm-pi-ai`. Anything else — `ultra` included — is a
 * schema violation that removes the provider, not an unknown-but-harmless extra level.
 */
export const THINKING_LEVELS = ['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'];
const VALID = new Set(THINKING_LEVELS);

/**
 * The tiers each model family is normally configured with. Every entry is a legal key: a proposal may
 * never reintroduce a level the loader would reject.
 */
const FAMILIES = [
  { test: id => id.startsWith('gpt-image-'), tiers: [] },
  { test: id => id.startsWith('gpt-') || id.startsWith('codex-'), tiers: ['low', 'medium', 'high', 'xhigh', 'max'] },
  { test: id => id.startsWith('deepseek') || id.startsWith('ds-'), tiers: ['low', 'medium', 'high', 'max'] },
  { test: id => id.startsWith('kimi') || id.startsWith('moonshot'), tiers: ['low', 'high', 'max'] },
  { test: id => id.startsWith('glm') || id.startsWith('qwen') || id.startsWith('spark'), tiers: ['low', 'medium', 'high'] },
  { test: () => true, tiers: ['low', 'medium', 'high'] },
];

function dshHome() {
  const configured = process.env.DSH_HOME;
  return typeof configured === 'string' && configured.trim() !== '' ? configured : join(homedir(), '.dsh');
}

/**
 * Every profile patch file this machine could be using, most specific first.
 *
 * `DSH_PROFILE_DIR` is set by a profile-launched Harness, which is the authoritative answer. The
 * remaining candidates cover a host started without that variable: the active profile name, then the
 * conventional `~/.dsh/profiles/<name>/cordis.patch.yml` for every profile present.
 */
export function profilePatchCandidates() {
  const files = [];
  const profileDir = process.env.DSH_PROFILE_DIR;
  if (typeof profileDir === 'string' && profileDir.trim() !== '') {
    files.push(join(profileDir.trim(), 'cordis.patch.yml'));
  }
  const profilesRoot = join(dshHome(), 'profiles');
  const profileName = process.env.DSH_PROFILE;
  if (typeof profileName === 'string' && profileName.trim() !== '') {
    files.push(join(profilesRoot, profileName.trim(), 'cordis.patch.yml'));
  }
  for (const name of ['desktop', 'default']) files.push(join(profilesRoot, name, 'cordis.patch.yml'));
  return [...new Set(files)];
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function indentOf(line) {
  return line.match(/^(\s*)/)[1].length;
}

/**
 * Locate the `- id: <model>` row that owns this model.
 *
 * The block ends at the next row at the same or a shallower indent, which is exactly how the loader
 * patch dialect nests a model under `models:`.
 */
function findModelBlock(lines, modelId) {
  const row = new RegExp(`^(\\s*)-\\s+id:\\s*['"]?${escapeRegExp(modelId)}['"]?\\s*$`);
  for (let start = 0; start < lines.length; start += 1) {
    const match = row.exec(lines[start]);
    if (!match) continue;
    const indent = match[1].length;
    let end = lines.length;
    for (let index = start + 1; index < lines.length; index += 1) {
      const line = lines[index];
      if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
      const next = indentOf(line);
      if (next < indent) { end = index; break; }
      if (next === indent && /^\s*-\s/.test(line)) { end = index; break; }
    }
    return { start, end, indent };
  }
  return null;
}

/** The declared tier lines of one model block, with the legal ones separated from the fatal ones. */
function inspectBlock(lines, block) {
  for (let index = block.start + 1; index < block.end; index += 1) {
    const match = /^(\s*)reasoningEfforts:\s*(.*)$/.exec(lines[index]);
    if (!match) continue;
    const effortsIndent = match[1].length;
    const value = match[2].trim();
    if (value !== '' && !value.startsWith('#')) {
      // `reasoningEfforts: false` (image models) declares nothing; the row is still the owner row.
      return { line: index, effortsIndent, disabled: true, tiers: [], invalid: [], lines: [], lastTier: index };
    }
    const tiers = [];
    const invalid = [];
    const tierLines = [];
    let lastTier = index;
    for (let cursor = index + 1; cursor < block.end; cursor += 1) {
      const line = lines[cursor];
      if (line.trim() === '') continue;
      if (line.trimStart().startsWith('#')) continue;
      if (indentOf(line) <= effortsIndent) break;
      const tier = /^\s*([A-Za-z0-9][A-Za-z0-9._-]*)\s*:/.exec(line);
      if (!tier) continue;
      tierLines.push(cursor);
      if (VALID.has(tier[1])) {
        tiers.push(tier[1]);
        lastTier = cursor;
      } else {
        invalid.push(tier[1]);
      }
    }
    return { line: index, effortsIndent, disabled: false, tiers, invalid, lines: tierLines, lastTier };
  }
  return null;
}

function ladderFor(modelId) {
  return (FAMILIES.find(family => family.test(modelId.toLowerCase())) ?? FAMILIES.at(-1)).tiers;
}

/**
 * What a repair would do: which legal tiers are missing, and which declared keys have to go before the
 * provider can load at all.
 */
function planFor(lines, modelId) {
  const block = findModelBlock(lines, modelId);
  if (!block) return { ok: false };
  const state = inspectBlock(lines, block);
  const ladder = ladderFor(modelId);
  const declared = state?.tiers ?? [];
  const add = ladder.filter(tier => !declared.includes(tier));
  const remove = state?.invalid ?? [];
  return { ok: true, block, state, declared, add, remove, ladder };
}

/** Where a fix would land, and what it would change, without writing anything. */
export function previewEfforts({ modelId, file } = {}) {
  if (typeof modelId !== 'string' || !MODEL_ID.test(modelId)) {
    return { ok: false, error: { code: 'efforts/invalid-model', message: '模型 ID 参数无效。' } };
  }
  const candidates = typeof file === 'string' && file.trim() ? [file.trim()] : profilePatchCandidates();
  const searched = [];
  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    let text;
    try {
      text = readFileSync(candidate, 'utf8');
    } catch {
      continue;
    }
    const plan = planFor(text.split(/\r?\n/), modelId);
    if (!plan.ok) { searched.push(candidate); continue; }
    return {
      ok: true,
      value: {
        file: candidate,
        modelId,
        declared: plan.declared,
        add: plan.add,
        remove: plan.remove,
        ladder: plan.ladder,
        needsRestart: plan.add.length > 0 || plan.remove.length > 0,
      },
    };
  }
  return {
    ok: false,
    error: {
      code: 'efforts/profile-not-found',
      message: `没有在 profile 配置里找到模型 ${modelId} 的条目。`,
      details: { candidates, searched },
    },
  };
}

/**
 * Apply the previewed change.
 *
 * Fatal keys are dropped first, because leaving one in place would keep the provider out of the
 * catalog no matter how many legal tiers were added beside it. The backup is written before the edit
 * and its failure aborts the change, so a half-applied patch is not a reachable state.
 */
export function applyEfforts({ modelId, file } = {}) {
  const preview = previewEfforts({ modelId, file });
  if (!preview.ok) return preview;
  const { add, remove } = preview.value;
  if (add.length === 0 && remove.length === 0) {
    return { ok: true, value: { ...preview.value, backup: undefined, written: false } };
  }

  const target = preview.value.file;
  const original = readFileSync(target, 'utf8');
  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  const lines = original.split(/\r?\n/);
  const plan = planFor(lines, modelId);
  if (!plan.ok) return preview;

  const state = plan.state;
  const pad = ' '.repeat((state?.effortsIndent ?? plan.block.indent + 2) + 2);
  const tierLines = add.map(tier => `${pad}${tier}: ${tier}`);

  let next;
  if (state == null) {
    // No `reasoningEfforts:` row at all: add one at the end of the model block, then the tiers.
    const headerPad = ' '.repeat(plan.block.indent + 2);
    next = [...lines];
    next.splice(plan.block.end, 0, `${headerPad}reasoningEfforts:`, ...tierLines);
  } else if (state.disabled) {
    // `reasoningEfforts: false` becomes a real block in place, keeping the same indentation.
    next = [...lines];
    next.splice(state.line, 1, `${' '.repeat(state.effortsIndent)}reasoningEfforts:`, ...tierLines);
  } else {
    // Drop every illegal tier line, then insert the missing ones after the last surviving tier (or
    // directly under the header when nothing legal is left).
    const doomed = new Set(state.lines.filter(index => {
      const key = /^\s*([A-Za-z0-9][A-Za-z0-9._-]*)\s*:/.exec(lines[index])?.[1];
      return key !== undefined && !VALID.has(key);
    }));
    const anchor = state.lastTier;
    next = [];
    for (let index = 0; index < lines.length; index += 1) {
      if (doomed.has(index)) continue;
      next.push(lines[index]);
      if (tierLines.length > 0 && index === anchor) next.push(...tierLines);
    }
  }

  const backup = `${target}.bak-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  copyFileSync(target, backup);
  writeFileSync(target, next.join(eol), 'utf8');
  return {
    ok: true,
    value: { ...preview.value, backup, written: true, added: add, removed: remove },
  };
}
