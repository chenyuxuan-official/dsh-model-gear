// Smoke test: load the built artifact the way the client loader does, run `apply`
// against a scripted host context, and assert the model slot is claimed exactly once.
// It cannot render the panel (that needs the host), but it does catch a missing
// helper in the extracted bundle, which is the failure mode of this refactor.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createReactShim } from './react-shim.mjs';

const require = createRequire(import.meta.url);

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

const document = {
  nodeType: 1,
  documentElement: makeElement('html'),
  head: makeElement('head'),
  body: makeElement('body'),
  createElement: makeElement,
  getElementById: () => null,
  addEventListener() {}, removeEventListener() {},
};

const windowStub = { document, localStorage: { getItem: () => null, setItem() {} }, addEventListener() {}, removeEventListener() {}, location: { href: 'http://127.0.0.1/' } };

const registered = [];
const slotsApi = {
  inject(_name, fn) { fn(); },
  register(options) { registered.push(options.name); return { dispose() {} }; },
  entries: () => [],
  entriesOfSlot: () => [],
};
const scope = {
  slots: slotsApi,
  modelDirectories: { directoryFor: () => ({ store: {}, load: async () => {}, select: async () => {} }) },
  sessions: { subagentAddress: () => undefined },
  remote: {}, connection: { rpc: { call: async () => ({}) } },
};
const ctx = {
  slots: slotsApi,
  connection: { rpc: { call: async () => ({}) } },
  effect(fn) { fn(); },
  inject(_services, cb) { cb(scope); },
  on() { return () => {}; },
  logger: { info() {}, warn() {} },
};

let exportsRef = null;
globalThis.window = windowStub;
globalThis.document = document;
globalThis.localStorage = windowStub.localStorage;
globalThis.MutationObserver = class { observe() {} disconnect() {} };
globalThis.requestAnimationFrame = (fn) => { try { fn(0); } catch { /* the panel's scan is host work */ } return 1; };
windowStub.__ModuleLoader__ = { load({ id, factory }) { exportsRef = factory((name) => (name === 'react' ? createReactShim() : require(name))); assert.equal(id, 'dsh-model-gear'); } };

const code = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');
new Function('window', 'document', 'localStorage', 'MutationObserver', 'requestAnimationFrame', 'console', code)(windowStub, document, windowStub.localStorage, globalThis.MutationObserver, globalThis.requestAnimationFrame, console);

assert.ok(exportsRef, 'the artifact registered itself with the module loader');
assert.equal(typeof exportsRef.apply, 'function');
assert.ok(Array.isArray(exportsRef.inject), 'inject list is exported');
assert.deepEqual(exportsRef.inject, [], 'the client half declares no service dependency: it installs a stylesheet and registers one slot, and the slot declares its own services');

exportsRef.apply(ctx);

assert.deepEqual(registered, ['conversation.input.model'], 'exactly one slot is claimed');
assert.ok(document.head.children.some((node) => node.id === 'dsh-model-gear-style'), 'stylesheet installed');
console.log('smoke ok: slot registered once, stylesheet installed, inject =', exportsRef.inject.length, 'services');
