// Regression test for the stylesheet-owner guard.
//
// A hot reload mounts the new bundle before the old one is torn down, and the old bundle's one-second
// repair timer keeps running (it is deliberately not cleared with the plugin). Before the guard, the
// two builds rewrote the same `<style>` once a second with their own CSS, and every control whose
// palette differed between builds repainted at 1 Hz — the mode-coloured bolt visibly flashed purple
// and gold. This test mounts two builds into one page and proves the retired one can no longer write.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createReactShim } from './react-shim.mjs';

const source = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');

function makeElement(tag) {
  return {
    tagName: tag, children: [], attributes: {}, dataset: {}, style: { setProperty() {} },
    textContent: '', className: '',
    appendChild(node) { this.children.push(node); return node; },
    setAttribute(name, value) { this.attributes[name] = value; },
    getAttribute(name) { return this.attributes[name] ?? null; },
    hasAttribute(name) { return Object.hasOwn(this.attributes, name); },
    addEventListener() {}, removeEventListener() {},
    querySelector() { return null; }, querySelectorAll() { return []; },
    matches() { return false; }, contains() { return false; },
  };
}

const styleEl = makeElement('style');
styleEl.id = 'dsh-model-gear-style';
const documentStub = {
  nodeType: 1,
  documentElement: makeElement('html'),
  head: makeElement('head'),
  body: makeElement('body'),
  createElement: makeElement,
  getElementById: id => (id === 'dsh-model-gear-style' ? styleEl : null),
  addEventListener() {}, removeEventListener() {},
};
const windowStub = {
  document: documentStub,
  localStorage: { getItem: () => null, setItem() {} },
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  location: { href: 'http://127.0.0.1/' },
};
const slotsApi = { inject() {}, register() { return { dispose() {} }; }, entries: () => [], entriesOfSlot: () => [] };
const scope = {
  slots: slotsApi,
  modelDirectories: { directoryFor: () => ({ store: { subscribe() {}, getSnapshot() { return {}; } }, load() {}, select() {} }) },
  sessions: { subagentAddress: () => undefined },
  remote: {},
  connection: { rpc: { call: async () => ({ ok: true, value: { mode: 'off' } }) } },
};
const ctx = {
  slots: slotsApi,
  effect(fn) { fn(); },
  inject(_services, cb) { cb(scope); },
  on() { return () => {}; },
  logger: { info() {}, warn() {} },
};

/** Mount one build; returns the callbacks its repair timer would run. */
function mount(mutate = code => code) {
  const code0 = mutate(source);
  const timers = [];
  const realSetInterval = globalThis.setInterval;
  let api = null;
  windowStub.__ModuleLoader__ = { load({ factory }) { api = factory(name => (name === 'react' ? createReactShim() : null)); } };
  globalThis.setInterval = (fn) => { timers.push(fn); return { unref() {} }; };
  try {
    new Function('window', 'document', 'localStorage', 'MutationObserver', 'requestAnimationFrame', 'console', code0)(
      windowStub, documentStub, windowStub.localStorage, class { observe() {} disconnect() {} },
      fn => { try { fn(0); } catch { /* host work */ } return 1; }, console,
    );
    api.apply(ctx);
  } finally {
    globalThis.setInterval = realSetInterval;
  }
  return timers;
}

// The retired build carries a distinguishable CSS value, so the two sheets cannot be confused.
const retiredTimers = mount(code => code.replace('--cg-fast-ink: #8a4ff0', '--cg-fast-ink: #ff0000'));
const retiredText = styleEl.textContent;
const currentTimers = mount();
const currentText = styleEl.textContent;

assert.ok(retiredText.length > 1000, 'the first build installed a sheet');
assert.ok(retiredText.includes('#ff0000'), 'the retired build wrote its own CSS');
assert.ok(!currentText.includes('#ff0000'), 'the current build replaced it');

for (const tick of retiredTimers) tick();
assert.equal(styleEl.textContent, currentText, 'a retired instance can no longer overwrite the sheet');

for (const tick of currentTimers) tick();
assert.equal(styleEl.textContent, currentText, 'the owner keeps writing its own sheet');

console.log('style-owner ok: retired instance wrote nothing,', currentText.length, 'bytes kept');
