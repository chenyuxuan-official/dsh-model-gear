// One-click effort repair for a profile patch file.
//
// The plugin never owns the model catalog: the profile does, and the DSH model directory is what the
// panel reads. This module is the narrow exception that lets the panel *propose* a fix when a model
// advertises fewer tiers than its family is known to support — and it edits text, never YAML:
//
//   · the target file is an existing `cordis.patch.yml`, found by locating the `- id: <model>` row;
//   · only the `reasoningEfforts:` block of that one row is touched, one key per missing tier;
//   · every other byte, including the user's provider config, is left alone;
//   · a timestamped copy is written before the change, so a bad edit is restorable;
//   · nothing is written unless the caller asked for `apply`.
//
// Reading and applying are separate calls on purpose. `preview` is what the panel shows; `apply` is
// what the reader confirmed. A file this module cannot parse is reported, never guessed at.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/** Model ids are file-content keys here, so the shape is validated before it becomes a regex. */
const MODEL_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/**
 * The tiers each model family is normally configured with.
 *
 * This is a *proposal*, not an entitlement check: it says "this family commonly exposes these
 * levels", so the panel can offer to add what is missing. Whether the upstream accepts a level is
 * still decided by the upstream at call time.
 */
const FAMILIES = [
  { test: id => id.startsWith('gpt-image-'), tiers: [] },
  { test: id => id.startsWith('gpt-') || id.startsWith('codex-'), tiers: ['low', 'medium', 'high', 'xhigh', 'ultra'] },
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

/** The declared tier keys of one model block, plus where its block sits. */
function inspectBlock(lines, block) {
  for (let index = block.start + 1; index < block.end; index += 1) {
    const match = /^(\s*)reasoningEfforts:\s*(.*)$/.exec(lines[index]);
    if (!match) continue;
    const effortsIndent = match[1].length;
    const value = match[2].trim();
    if (value !== '' && !value.startsWith('#')) {
      // `reasoningEfforts: false` (image models) declares nothing; the row is still the owner row.
      return { line: index, effortsIndent, disabled: true, tiers: [], lastTier: index };
    }
    const tiers = [];
    let lastTier = index;
    for (let cursor = index + 1; cursor < block.end; cursor += 1) {
      const line = lines[cursor];
      if (line.trim() === '') continue;
      if (line.trimStart().startsWith('#')) continue;
      if (indentOf(line) <= effortsIndent) break;
      const tier = /^\s*([A-Za-z0-9][A-Za-z0-9._-]*)\s*:/.exec(line);
      if (tier) {
        tiers.push(tier[1]);
        lastTier = cursor;
      }
    }
    return { line: index, effortsIndent, disabled: false, tiers, lastTier };
  }
  return null;
}

function planFor(lines, modelId) {
  const block = findModelBlock(lines, modelId);
  if (!block) return { ok: false, code: 'efforts/model-not-found' };
  const state = inspectBlock(lines, block);
  const ladder = (FAMILIES.find(family => family.test(modelId.toLowerCase())) ?? FAMILIES.at(-1)).tiers;
  const declared = state?.tiers ?? [];
  const add = ladder.filter(tier => !declared.includes(tier));
  return { ok: true, block, state, declared, add, ladder };
}

/** Where a fix would land, and what it would add, without writing anything. */
export function previewEfforts({ modelId, file } = {}) {
  if (typeof modelId !== 'string' || !MODEL_ID.test(modelId)) {
    return { ok: false, error: { code: 'efforts/invalid-model', message: '模型 ID 参数无效。' } };
  }
  const candidates = typeof file === 'string' && file.trim() ? [file.trim()] : profilePatchCandidates();
  const seen = [];
  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    let text;
    try {
      text = readFileSync(candidate, 'utf8');
    } catch {
      continue;
    }
    const lines = text.split(/\r?\n/);
    const plan = planFor(lines, modelId);
    if (!plan.ok) { seen.push(candidate); continue; }
    return {
      ok: true,
      value: {
        file: candidate,
        modelId,
        declared: plan.declared,
        add: plan.add,
        ladder: plan.ladder,
        needsRestart: plan.add.length > 0,
      },
    };
  }
  return {
    ok: false,
    error: {
      code: 'efforts/profile-not-found',
      message: `没有在 profile 配置里找到模型 ${modelId} 的条目。`,
      details: { candidates, searched: seen },
    },
  };
}

/**
 * Apply the previewed change: one line per missing tier, appended inside the existing block.
 *
 * `copyFileSync` runs before the write and its failure aborts the change, so a broken backup never
 * leaves a half-applied patch behind.
 */
export function applyEfforts({ modelId, file } = {}) {
  const preview = previewEfforts({ modelId, file });
  if (!preview.ok) return preview;
  const { add } = preview.value;
  if (add.length === 0) return { ok: true, value: { ...preview.value, backup: undefined, written: false } };

  const target = preview.value.file;
  const original = readFileSync(target, 'utf8');
  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  const lines = original.split(/\r?\n/);
  const plan = planFor(lines, modelId);
  if (!plan.ok) return preview;

  const pad = ' '.repeat((plan.state?.effortsIndent ?? plan.block.indent + 2) + 2);
  const tierLines = add.map(tier => `${pad}${tier}: ${tier}`);

  if (plan.state == null) {
    // No `reasoningEfforts:` row at all: add one at the end of the model block, then the tiers.
    const headerPad = ' '.repeat(plan.block.indent + 2);
    const insertAt = plan.block.end;
    lines.splice(insertAt, 0, `${headerPad}reasoningEfforts:`, ...tierLines);
  } else if (plan.state.disabled) {
    // `reasoningEfforts: false` becomes a real block in place, keeping the same indentation.
    lines.splice(plan.state.line, 1, `${' '.repeat(plan.state.effortsIndent)}reasoningEfforts:`, ...tierLines);
  } else {
    lines.splice(plan.state.lastTier + 1, 0, ...tierLines);
  }

  const backup = `${target}.bak-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  copyFileSync(target, backup);
  writeFileSync(target, lines.join(eol), 'utf8');
  return {
    ok: true,
    value: { ...preview.value, backup, written: true, added: add },
  };
}
