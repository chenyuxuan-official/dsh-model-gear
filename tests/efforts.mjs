// Profile effort repair, runnable with `node tests/efforts.mjs`.
//
// The module edits real text, so these tests always work on a throwaway profile directory: every
// assertion is about one of three things — the proposed tier list, the bytes that changed, and the
// bytes that did not.
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { applyEfforts, previewEfforts, profilePatchCandidates } from '../src/profile-efforts.js';

const dir = mkdtempSync(join(tmpdir(), 'dsh-model-gear-efforts-'));

function fixture(text, name = 'cordis.patch.yml') {
  const file = join(dir, name);
  writeFileSync(file, text, 'utf8');
  return file;
}

const baseModel = (tiers, { falseFlag = false } = {}) => `- id: llm-pi-ai
  name: "@deepseek-ai/dsh-llm-pi-ai"
  config:
    providers:
      cpa:
        models:
          - id: gpt-6.1-sol
            name: GPT-6.1 Sol
            contextWindow: 256000
            reasoningEfforts:${falseFlag ? ' false' : `
              ${tiers.join(': ' + tiers[0] + '\n              ')}: ${tiers.at(-1)}`}
          - id: kimi-k3
            name: Kimi K3
            reasoningEfforts:
              low: low
              high: high
              max: max
`;

// --------------------------------------------------------------------------- preview
{
  const file = fixture(baseModel(['low', 'medium', 'high', 'xhigh']));
  const preview = previewEfforts({ modelId: 'gpt-6.1-sol', file });
  assert.equal(preview.ok, true, 'a listed model previews');
  assert.deepEqual(preview.value.add, ['ultra'], 'only the missing tier is proposed');
  assert.deepEqual(preview.value.declared, ['low', 'medium', 'high', 'xhigh'], 'declared tiers are read in order');
  assert.equal(preview.value.needsRestart, true, 'a pending write asks for a restart');
  assert.equal(readFileSync(file, 'utf8').includes('ultra: ultra'), false, 'preview writes nothing');

  // apply
  const applied = applyEfforts({ modelId: 'gpt-6.1-sol', file });
  assert.equal(applied.ok, true);
  assert.equal(applied.value.written, true, 'apply reports the write');
  assert.deepEqual(applied.value.added, ['ultra']);
  const text = readFileSync(file, 'utf8');
  assert.ok(text.includes('              ultra: ultra\n'), 'the tier line lands at tier indentation');
  assert.ok(text.includes('              xhigh: xhigh'), 'existing tiers are preserved');
  assert.ok(text.includes('          - id: kimi-k3'), 'the neighbouring model is untouched');
  assert.ok(text.includes('            contextWindow: 256000'), 'other fields are untouched');

  const backups = readdirSync(dir).filter(name => name.startsWith('cordis.patch.yml.bak-'));
  assert.equal(backups.length, 1, 'exactly one backup is written');
  assert.ok(readFileSync(join(dir, backups[0]), 'utf8').includes('ultra: ultra') === false, 'the backup is the pre-change file');

  const again = previewEfforts({ modelId: 'gpt-6.1-sol', file });
  assert.deepEqual(again.value.add, [], 'a repaired model proposes nothing');
  const noop = applyEfforts({ modelId: 'gpt-6.1-sol', file });
  assert.equal(noop.value.written, false, 'a second apply writes nothing');
  assert.equal(readdirSync(dir).filter(name => name.startsWith('cordis.patch.yml.bak-')).length, 1, 'no backup for a no-op');
}

// --------------------------------------------------------------------------- missing block
{
  const file = fixture(`- id: llm-pi-ai
  config:
    providers:
      cpa:
        models:
          - id: gpt-6-luna
            name: GPT-6 Luna
          - id: claude-sonnet-4-6
            name: Claude Sonnet 4.6
`, 'no-block.yml');
  const applied = applyEfforts({ modelId: 'gpt-6-luna', file });
  assert.equal(applied.ok, true);
  const text = readFileSync(file, 'utf8');
  assert.ok(text.includes('            reasoningEfforts:\n              low: low\n'), 'a missing block is created at field indentation');
  assert.ok(text.includes('          - id: claude-sonnet-4-6'), 'the next model survives the insert');
  assert.deepEqual(applied.value.added, ['low', 'medium', 'high', 'xhigh', 'ultra'], 'the GPT ladder is proposed whole');
}

// --------------------------------------------------------------------------- false flag
{
  const file = fixture(`- id: llm-pi-ai
  config:
    providers:
      cpa:
        models:
          - id: gpt-image-2
            name: GPT Image 2
            reasoningEfforts: false
`, 'false-flag.yml');
  const preview = previewEfforts({ modelId: 'gpt-image-2', file });
  assert.deepEqual(preview.value.add, [], 'an image model proposes no tiers');

  const text = fixture(`- id: llm-pi-ai
  config:
    providers:
      cpa:
        models:
          - id: gpt-6.1-terra
            name: GPT-6.1 Terra
            reasoningEfforts: false
`, 'false-flag-2.yml');
  const applied = applyEfforts({ modelId: 'gpt-6.1-terra', file: text });
  assert.equal(applied.value.written, true);
  const patched = readFileSync(text, 'utf8');
  assert.ok(patched.includes('            reasoningEfforts:\n              low: low'), '`false` becomes a real block');
  assert.equal(patched.includes('reasoningEfforts: false'), false, 'the false flag is gone');
}

// --------------------------------------------------------------------------- errors
{
  const file = fixture(baseModel(['low', 'high']), 'errors.yml');
  const missing = previewEfforts({ modelId: 'not-a-model', file });
  assert.equal(missing.ok, false);
  assert.equal(missing.error.code, 'efforts/profile-not-found');

  const invalid = previewEfforts({ modelId: '../etc/passwd', file });
  assert.equal(invalid.ok, false);
  assert.equal(invalid.error.code, 'efforts/invalid-model');

  const absent = previewEfforts({ modelId: 'gpt-6.1-sol', file: join(dir, 'nope.yml') });
  assert.equal(absent.ok, false, 'a file that does not exist is reported, not created');
  assert.equal(existsSync(join(dir, 'nope.yml')), false, 'nothing is created on a failed preview');
}

// --------------------------------------------------------------------------- candidate order
{
  assert.ok(profilePatchCandidates().length > 0, 'at least one profile patch candidate exists');
  assert.ok(profilePatchCandidates().every(path => path.endsWith('cordis.patch.yml')), 'candidates are patch files');
}

rmSync(dir, { recursive: true, force: true });
console.log('efforts ok: preview, apply, backup, no-op, false flag, missing block, errors');
