import fs from 'node:fs';
import path from 'node:path';

const [srcCss, modelUi, out] = process.argv.slice(2);
const css = fs.readFileSync(srcCss, 'utf8');
const ui = fs.readFileSync(modelUi, 'utf8');

const used = new Set((ui.match(/cg-[a-z0-9-]+/g) ?? []).map((c) => c.toLowerCase()));
// classes the panel inherits from the popover shell it renders itself
used.add('cg-model-popover');

// Theme-token rules are attribute-only (`html[data-chatgpt-ui]`, `body[data-ds-dark-theme]`) or
// bare `:root`, so they carry no `.cg-*` class name and the class filter below would drop them.
// They define the variables every `.cg-*` rule paints with (`--cg-page`, `--cg-text`, …), and
// without them `background: var(--cg-page)` resolves to nothing and the popover renders
// see-through.
//
// The match is *exact*, and that is load-bearing. An "any selector mentioning the attribute"
// predicate also keeps upstream's shell rules — `html[data-chatgpt-ui] #root { padding: 4px 4px 4px
// 48px !important }`, `html[data-chatgpt-ui] body`, `[data-composer-card]`, global `button` rules —
// and this plugin does set that attribute on `<html>`, so regenerating the stylesheet would restyle
// the host shell and composer, not just the panel. Only a rule whose *whole* selector is one of the
// three token blocks is a token block.
const TOKEN_SELECTORS = new Set([':root', 'html[data-chatgpt-ui]', 'body[data-ds-dark-theme]']);
function isThemeTokenBlock(selector) {
  return TOKEN_SELECTORS.has(selector.replace(/\s+/g, ' ').trim());
}

function parse(text) {
  const nodes = [];
  let i = 0;
  let start = 0;
  const n = text.length;
  let depth = 0;
  let bodyStart = -1;
  const flushPrelude = (s, e) => text.slice(s, e);
  const stack = [];
  let bufStart = 0;

  while (i < n) {
    const ch = text[i];
    if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      i++;
      while (i < n && text[i] !== quote) {
        if (text[i] === '\\') i++;
        i++;
      }
      i++;
      continue;
    }
    if (ch === '{') {
      const prelude = text.slice(bufStart, i).trim();
      // find matching close
      let d = 1;
      let j = i + 1;
      while (j < n && d > 0) {
        const c = text[j];
        if (c === '/' && text[j + 1] === '*') { const e2 = text.indexOf('*/', j + 2); j = e2 === -1 ? n : e2 + 2; continue; }
        if (c === '"' || c === "'") { const q = c; j++; while (j < n && text[j] !== q) { if (text[j] === '\\') j++; j++; } j++; continue; }
        if (c === '{') d++;
        else if (c === '}') d--;
        j++;
      }
      const body = text.slice(i + 1, j - 1);
      nodes.push({ prelude, body });
      i = j;
      bufStart = j;
      continue;
    }
    if (ch === '}') { i++; bufStart = i; continue; }
    i++;
  }
  return nodes;
}

const nodes = parse(css);
const kept = [];
const atRules = [];
const keyframes = new Map();

for (const node of nodes) {
  const prelude = node.prelude.replace(/\s+/g, ' ').trim();
  if (prelude === '') continue;
  if (/^@keyframes/i.test(prelude)) {
    keyframes.set(prelude, node);
    continue;
  }
  if (/^@(media|supports|container|layer)/i.test(prelude)) {
    const inner = parse(node.body);
    const keptInner = inner.filter((child) => {
      const sel = child.prelude.replace(/\s+/g, ' ').trim();
      const classes = [...sel.matchAll(/\.([a-z0-9-]+)/gi)].map((m) => m[1].toLowerCase());
      return isThemeTokenBlock(sel) || classes.some((c) => used.has(c));
    });
    if (keptInner.length > 0) atRules.push({ prelude, inner: keptInner });
    continue;
  }
  const classes = [...prelude.matchAll(/\.([a-z0-9-]+)/gi)].map((m) => m[1].toLowerCase());
  if (isThemeTokenBlock(prelude) || classes.some((c) => used.has(c))) kept.push(node);
}

const bodyText = [
  ...kept.map((n) => `${n.prelude.trim()} {${n.body}}`),
  ...atRules.map((a) => `${a.prelude} {\n${a.inner.map((n) => `${n.prelude.trim()} {${n.body}}`).join('\n')}\n}`),
].join('\n\n');

const animations = new Set([...bodyText.matchAll(/animation(?:-name)?\s*:\s*([a-z0-9_-]+)/gi)].map((m) => m[1]));
const frames = [...keyframes.entries()]
  .filter(([prelude, node]) => {
    const name = prelude.replace(/^@keyframes\s+/i, '').trim();
    return animations.has(name) || [...bodyText.matchAll(/animation[^;]*?([a-z0-9_-]+)/gi)].some((m) => m[1] === name);
  })
  .map(([prelude, node]) => `${prelude} {${node.body}}`);

const header = `/* dsh-model-gear: the model-gear panel only, extracted from dsh-codex-ui (MIT).\n   Classes: ${used.size}; rules: ${kept.length}; media blocks: ${atRules.length}; keyframes: ${frames.length}. */\n`;
fs.writeFileSync(out, header + bodyText + '\n\n' + frames.join('\n\n') + '\n', 'utf8');

// Self-check: the theme tokens are the one thing whose absence makes the panel
// render incorrectly (a see-through popover), and a silent drop is exactly the bug
// this generator caused once. Read the file back instead of trusting the strings
// still in memory.
//
// The test is for a *declaration* (`--cg-page:`), not for the name: every panel rule
// that uses the variable contains `var(--cg-page)`, so a name-only test would pass on a
// file whose definitions had been dropped — the exact failure this guards.
const written = fs.readFileSync(out, 'utf8');
if (!/--cg-page\s*:/.test(written)) {
  console.error(`extract-css: ${out} is missing the --cg-page theme token declaration; aborting.`);
  process.exit(1);
}
console.log(`rules=${kept.length} media=${atRules.length} keyframes=${frames.length} bytes=${fs.statSync(out).size}`);
