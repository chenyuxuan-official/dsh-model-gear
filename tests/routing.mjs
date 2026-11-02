import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  compatibleRouting,
  parseRoutingBlock,
  readOfficialModelSelection,
  routingNotice,
} from '../src/subagent-routing.js';

const marker = '<!-- dsh-model-gear:routes-v1 -->';
const valid = `${marker}\n\`\`\`json\n${JSON.stringify({ version: 1, routes: [{ id: 'review', match: { taskType: 'review' }, target: { provider: 'cpa', model: 'gpt-6.1-terra' }, effort: 'high', priority: 10 }] })}\n\`\`\``;

assert.equal(parseRoutingBlock('Use model cpa/gpt-6.1-terra for reviews.'), undefined, 'ordinary prose is ignored');
assert.equal(parseRoutingBlock(`${marker}\nnot-json`), undefined, 'unfenced metadata is ignored');
const routing = parseRoutingBlock(valid);
assert.equal(routing.routes[0].id, 'review');
assert.equal(routing.routes[0].target.model, 'gpt-6.1-terra');
assert.equal(parseRoutingBlock(`${marker}\n\`\`\`json\n{"version":1,"routes":[{"id":"bad","match":{"taskType":"x"},"target":{"provider":"cpa"}}]}\n\`\`\``), undefined, 'invalid target is rejected');
assert.equal(parseRoutingBlock(`${marker}\n\`\`\`json\n{"version":1,"routes":[{"id":"bad","match":{"taskType":"x"},"target":{"provider":"cpa","model":"x"},"extra":true}]}\n\`\`\``), undefined, 'unknown fields are rejected');

const official = { current: () => ({ enabled: true, allowedModels: [
  { provider: 'cpa', model: 'gpt-6.1-terra' },
  { provider: 'cpa', model: 'gpt-6.1-terra' },
  { provider: '', model: 'bad' },
] }) };
const selection = readOfficialModelSelection({ get(name) { assert.equal(name, 'subagentModelSelection'); return official; } });
assert.deepEqual(selection.routes, [{ provider: 'cpa', model: 'gpt-6.1-terra' }]);
assert.equal(readOfficialModelSelection({ get() { return { current: () => Promise.resolve({ enabled: true, allowedModels: [] }) }; } }), undefined, 'async settings are ignored');
assert.equal(readOfficialModelSelection({ get() { throw new Error('missing'); } }), undefined, 'missing settings are tolerated');
const emptySelection = readOfficialModelSelection({ get() { return { current: () => ({ enabled: true, allowedModels: [] }) }; } });
assert.deepEqual(emptySelection.routes, [], 'enabled empty allowlist remains an official enabled state');

const compatible = compatibleRouting(selection, routing);
assert.equal(compatible.routes[0].available, true);
const unavailable = compatibleRouting({ routes: [{ provider: 'cpa', model: 'other' }] }, routing);
assert.equal(unavailable.routes[0].available, false);
assert.match(routingNotice(selection, unavailable), /recommended/);
assert.match(routingNotice(selection, unavailable), /Available official models/);
assert.match(routingNotice(selection, unavailable), /unavailable \(unavailable under the official allowlist\)/);

const root = mkdtempSync(join(tmpdir(), 'dsh-model-gear-routing-'));
try {
  writeFileSync(join(root, 'AGENTS.md'), 'Use cpa/gpt-6.1-terra.\n', 'utf8');
  writeFileSync(join(root, 'agents.md'), valid, 'utf8');
  const { loadRoutingConfig } = await import('../src/subagent-routing.js');
  const loaded = loadRoutingConfig(root);
  assert.equal(loaded.file, join(root, 'agents.md'), 'explicit lowercase routing file wins at the same directory');
} finally {
  rmSync(root, { recursive: true, force: true });
}

console.log('routing ok: explicit marker/schema, official allowlist normalization, advisory compatibility, fallback');
