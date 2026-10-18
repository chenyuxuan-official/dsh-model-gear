import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (name) => readFile(new URL(`src/${name}`, root), 'utf8');
const stripExports = (text) => text
  .replace(/^export (const|function|class) /gm, '$1 ')
  .replace(/^export \{[^}]*\};?\s*$/gm, '');

const body = (await read('client.js'))
  .replace("import React from 'react';", "const React = require('react');")
  .replace('export const inject', 'const inject')
  .replace('export function apply', 'function apply');

const providers = stripExports(await read('providers.js'));
const aliasSync = stripExports(await read('alias-sync.js'));
const modelUI = (await read('model-ui.js'))
  .replace(/^import \{[^}]*\} from '\.\/alias-sync\.js';\s*$/m, '')
  .replace(/^export \{ registerModelUI \};?\s*$/m, '');
const css = await read('style.css');

// The output is deterministic: same sources, same bytes. That is what lets the repository carry
// `lib/` and lets CI fail when it is stale.
await mkdir(new URL('lib/', root), { recursive: true });
await writeFile(new URL('lib/client.js', root), `window.__ModuleLoader__.load({id:'dsh-model-gear',factory:(require)=>{const STYLE=${JSON.stringify(css)};\n${body}\n${providers}\n${aliasSync}\n${modelUI}\nconst safeApply=(ctx)=>{try{return apply(ctx);}catch(error){console.error("dsh-model-gear activation:",error);throw error;}};return {apply:safeApply,inject,registerModelUI};}});\n`, 'utf8');
console.log('Built dsh-model-gear client bundle.');
