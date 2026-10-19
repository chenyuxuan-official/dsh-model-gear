// Render-level smoke test for the model panel.
//
// The bundle is a `window.__ModuleLoader__.load({ id, factory })` call; the factory needs
// React and returns { apply, inject }. This runs `apply` against a scripted host context,
// captures the component registered into `conversation.input.model`, and renders it once
// with a deliberately permissive React shim (initial state values, no effects). What it
// catches: a render-time ReferenceError or a bad branch in the extracted panel — the
// failure mode `node --check` cannot see.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function element(type, props, ...children) {
  const flat = children.length <= 1 ? children[0] : children;
  const { key, ...rest } = props ?? {};
  return { __element: true, type, key: key ?? null, props: children.length === 0 ? { ...rest } : { ...rest, children: flat } };
}

let stateCursor = 0;
const stateOverrides = { 0: true, 1: 'model' };

const React = {
  Fragment: 'fragment',
  createElement: element,
  cloneElement: (el, props, ...kids) => ({ ...el, props: { ...el.props, ...(props ?? {}), ...(kids.length ? { children: kids.length === 1 ? kids[0] : kids } : {}) } }),
  isValidElement: (v) => Boolean(v && v.__element === true),
  Children: { map: (c, fn) => (Array.isArray(c) ? c.map(fn) : c ? [fn(c, 0)] : []) },
  useState: (init) => {
    // `overrides` scripts a hook position; everything else keeps its declared initial value,
    // which is what a first render without user interaction looks like.
    const index = stateCursor++;
    const value = Object.hasOwn(stateOverrides, index) ? stateOverrides[index] : (typeof init === 'function' ? init() : init);
    return [value, () => {}];
  },
  useRef: () => ({ current: null }),
  useEffect: () => {},
  useLayoutEffect: () => {},
  useMemo: (factory) => factory(),
  useCallback: (fn) => fn,
  useSyncExternalStore: (_sub, snap) => snap(),
};

const storage = new Map();
storage.set('dsh-model-gear/recent-models', JSON.stringify([{ provider: 'deepseek-account', model: 'deepseek-v4-pro' }]));

const documentStub = {
  nodeType: 1,
  documentElement: { setAttribute() {}, hasAttribute: () => false, appendChild() {}, querySelectorAll: () => [] },
  head: { appendChild() {}, querySelectorAll: () => [] },
  body: { querySelectorAll: () => [], appendChild() {} },
  createElement: () => ({ dataset: {}, style: {}, appendChild() {}, setAttribute() {} }),
  getElementById: () => null,
  addEventListener() {}, removeEventListener() {},
  querySelectorAll: () => [],
};

const windowStub = {
  document: documentStub,
  localStorage: { getItem: (k) => (storage.has(k) ? storage.get(k) : null), setItem: (k, v) => storage.set(k, String(v)), removeItem: (k) => storage.delete(k) },
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  location: { href: 'http://127.0.0.1/' },
};

globalThis.window = windowStub;
globalThis.document = documentStub;
globalThis.localStorage = windowStub.localStorage;
globalThis.MutationObserver = class { observe() {} disconnect() {} };
globalThis.requestAnimationFrame = (fn) => { try { fn(0); } catch { /* host work */ } return 1; };

// The directory reports the tier list as `reasoning.efforts` (the field the panel reads); the fixture
// used to call it `levels`, which left the effort pane showing its "no tier list" fallback and made the
// slider path untested.
const mods = {
  models: [
    { id: 'deepseek-v4-flash', name: 'DeepSeek-V4.1-Flash', reasoning: { defaultEffort: 'medium', efforts: [{ id: 'low' }, { id: 'medium' }, { id: 'high' }] } },
    { id: 'deepseek-v4-pro', name: 'DeepSeek-V4.1-Pro', reasoning: { defaultEffort: 'high', efforts: [{ id: 'low' }, { id: 'medium' }, { id: 'high' }, { id: 'xhigh' }] } },
  ],
};
const snapshot = {
  status: 'ready',
  groups: [{ id: 'deepseek-account', name: 'DeepSeek Account', models: mods.models }],
  current: { provider: 'deepseek-account', model: 'deepseek-v4-flash', reasoningEffort: 'medium' },
  pending: null, failures: [], routable: true, retainedEffort: 'medium',
};
const directory = { subscribe() {}, getSnapshot: () => snapshot, load: async () => {}, select: async () => ({ ok: true }) };

let captured = null;
const slotsApi = {
  inject(_name, fn) { fn(); },
  register(options, component) { captured = { options, component }; return { dispose() {} }; },
  entries: () => [], entriesOfSlot: () => [],
};
const scope = { slots: slotsApi, modelDirectories: { directoryFor: () => ({ store: directory, load: async () => {}, select: async () => ({ ok: true }) }) }, sessions: { subagentAddress: () => undefined }, remote: {}, connection: { rpc: { call: async () => ({ ok: true, value: { mode: 'off' } }) } } };
const ctx = {
  slots: slotsApi,
  connection: { rpc: { call: async () => ({ ok: true, value: { mode: 'off' } }) } },
  effect(fn) { fn(); },
  inject(_services, cb) { cb(scope); },
  on() { return () => {}; },
  logger: { info() {}, warn() {} },
};

let bundle = null;
windowStub.__ModuleLoader__ = { load({ id, factory }) { bundle = factory((name) => (name === 'react' ? React : null)); assert.equal(id, 'dsh-model-gear'); } };
new Function('window', 'document', 'localStorage', 'MutationObserver', 'requestAnimationFrame', 'console', readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'))(windowStub, documentStub, windowStub.localStorage, globalThis.MutationObserver, globalThis.requestAnimationFrame, console);

bundle.apply(ctx);
assert.ok(captured, 'the panel registered itself');

const injected = captured.options.inject('session-1');
const props = { ...injected, sessionId: 'session-1', useSessions: (selector) => selector({ byId: {} }) };
const tree = captured.component(props);

function textOf(node) {
  if (node == null || node === false || node === true) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join(' ');
  if (node.__element) return textOf(node.props?.children);
  return '';
}

function walk(node, visit) {
  if (node == null || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const child of node) walk(child, visit); return; }
  if (!node.__element) return;
  visit(node);
  walk(node.props?.children, visit);
}

function elementsWithClass(tree, className) {
  const found = [];
  walk(tree, (node) => { if (node.props?.className === className) found.push(node); });
  return found;
}

// The rail's colour is one boolean pair on both the root and the popover: the stylesheet paints the
// whole track from these flags, and the popover declares `--cg-effort-color` itself. Reading them
// together keeps a missing flag on either node a single failure.
function gearFlags(tree, className) {
  const node = elementsWithClass(tree, className)[0];
  assert.ok(node, `the ${className} node renders`);
  return [node.props['data-lightning'], node.props['data-superfast']];
}

const text = textOf(tree);
assert.ok(text.includes('DeepSeek-V4.1-Flash'), 'current model renders');
assert.ok(text.includes('默认'), 'default group header renders');
assert.ok(text.includes('DeepSeek-V4.1-Pro'), 'recent model from storage renders in the default group');

// The effort pane: the sliding track and its flowing shower exist at an ordinary tier, not only at the
// top one. Re-render with the pane scripted to `effort` (hook position 1) and the model at `medium`.
stateCursor = 0;
stateOverrides[0] = true;
stateOverrides[1] = 'effort';
const effortTree = captured.component(props);
assert.ok(textOf(effortTree).includes('Medium'), 'the current effort tier renders on the track');
assert.ok(JSON.stringify(effortTree).includes('cg-model-meteors'), 'the flowing shower is drawn on a real tier, not only the top one');

// The stylesheet's contract: the shell carries the fill's own length string, and the shower is exactly
// eleven streaks. `medium` is index 1 of a three-tier track, so the fill sits halfway.
const shells = elementsWithClass(effortTree, 'cg-model-slider-shell');
assert.equal(shells.length, 1, 'the slider shell renders at the medium tier');
const shellFillWidth = shells[0].props.style?.['--cg-fill-width'];
assert.equal(typeof shellFillWidth, 'string', 'the shell carries --cg-fill-width for the clipped shower band');
const fills = elementsWithClass(effortTree, 'cg-model-slider-fill');
assert.equal(fills.length, 1, 'the fill renders at the medium tier');
assert.equal(shellFillWidth, fills[0].props.style?.width, '--cg-fill-width is the same length string as the fill width');
assert.equal(elementsWithClass(effortTree, 'cg-model-meteor').length, 11, 'exactly eleven shower streaks render at the medium tier');

// An `off` track is empty, so it must not flow. Force the directory's current effort off, re-render, and
// restore it afterwards so the summary printed below is unchanged.
snapshot.current.reasoningEffort = 'off';
stateCursor = 0;
stateOverrides[0] = true;
stateOverrides[1] = 'effort';
const offTree = captured.component(props);
assert.equal(elementsWithClass(offTree, 'cg-model-slider-shell').length, 1, 'the slider shell still renders while off');
assert.ok(!JSON.stringify(offTree).includes('cg-model-meteors'), 'the flowing shower is not drawn on an off track');
snapshot.current.reasoningEffort = 'medium';

// The orchestration gear is back: the effort pane's top-left bolt exists, and the gear page lists all
// three modes with the subagent budget each one promises. The gear is host state, so it is unread by
// default (`null`); hook position 2 is the state slot the tests script.
assert.equal(elementsWithClass(effortTree, 'cg-model-zap').length, 1, 'the lightning button renders in the effort pane');

stateCursor = 0;
stateOverrides[0] = true;
stateOverrides[1] = 'gear';
stateOverrides[2] = 'fast';
const gearTree = captured.component(props);
const gearModes = elementsWithClass(gearTree, 'cg-model-mode');
assert.equal(gearModes.length, 3, 'the gear pane renders all three modes');
const gearText = textOf(gearTree);
for (const copy of ['标准', '快速', '超快', '默认速度', '至少 1.5× 消耗 甚至更多', '至少 2.5× token 消耗 甚至更多']) {
  assert.ok(gearText.includes(copy), `the gear pane states ${copy}`);
}
assert.equal(gearModes.filter(mode => mode.props['aria-checked'] === true).length, 1, 'exactly one gear is checked');
assert.equal(gearModes.find(mode => mode.props['data-mode'] === 'fast')?.props['data-on'], true, 'the selected gear row is marked on');

// A gear turns the whole rail one colour, so the mode reaches CSS through the root and the popover at
// once: `fast` is purple (data-lightning), `tree` gold (data-superfast), and the other flag is false.
for (const className of ['cg-model-root', 'cg-model-popover']) {
  assert.deepEqual(gearFlags(gearTree, className), [true, false], `fast sets only data-lightning on ${className}`);
}

stateCursor = 0;
stateOverrides[0] = true;
stateOverrides[1] = 'gear';
stateOverrides[2] = 'tree';
const treeGearTree = captured.component(props);
for (const className of ['cg-model-root', 'cg-model-popover']) {
  assert.deepEqual(gearFlags(treeGearTree, className), [false, true], `tree sets only data-superfast on ${className}`);
}

// Unread host state is its own branch: the rows exist but are disabled, so a click cannot claim a
// mode the host never confirmed, and the bolt reports `unknown` rather than guessing `off`.
stateCursor = 0;
stateOverrides[0] = true;
stateOverrides[1] = 'gear';
stateOverrides[2] = null;
const unsyncedTree = captured.component(props);
const unsyncedModes = elementsWithClass(unsyncedTree, 'cg-model-mode');
assert.equal(unsyncedModes.length, 3, 'the gear menu still renders while unsynced');
assert.ok(unsyncedModes.every(mode => mode.props.disabled === true), 'every gear row is disabled while unsynced');
assert.ok(textOf(unsyncedTree).includes('未同步'), 'the gear pane explains that host state is unavailable');
for (const className of ['cg-model-root', 'cg-model-popover']) {
  assert.deepEqual(gearFlags(unsyncedTree, className), [false, false], `an unread gear leaves ${className} flags off`);
}

stateCursor = 0;
stateOverrides[0] = true;
stateOverrides[1] = 'effort';
const unsyncedEffortTree = captured.component(props);
const unsyncedZap = elementsWithClass(unsyncedEffortTree, 'cg-model-zap')[0];
assert.equal(unsyncedZap?.props['data-mode'], 'unknown', 'the bolt says unknown instead of guessing a mode');
assert.equal(unsyncedZap?.props['data-on'], false, 'the unknown bolt is not armed');

// The platform decorates model names through `conversation.input.model.label` (the "1017" release badge
// is one contribution). This panel replaces the whole composer control, so it must render that slot
// itself — otherwise every such decoration silently disappears from the trigger and the model list.
stateCursor = 0;
stateOverrides[0] = true;
stateOverrides[1] = 'effort';
stateOverrides[2] = 'off';
const labelledTree = captured.component({
  ...props,
  renderSlot: (name, owner, options) => `${owner.model.name} [${options.fallback}]`,
});
assert.ok(textOf(labelledTree).includes('DeepSeek-V4.1-Flash [DeepSeek-V4.1-Flash]'), 'the panel renders the model-label slot for the trigger');

console.log('render ok:', text.replace(/\s+/g, ' ').slice(0, 160));
