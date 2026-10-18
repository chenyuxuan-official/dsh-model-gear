// Host-half integration test, runnable with `node tests/host.mjs`.
//
// This is deliberately a fake-host test: it captures the connection route and the `agent/pre-step`
// listener that `apply(ctx)` registers, then drives both with the exact envelopes and payloads the
// real host uses. No DSH installation, browser or built artifact is involved.
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  CHILD_NOTE_ONE,
  CHILD_NOTE_TWO,
  LIGHTNING_POLICY,
  OFF_NOTICE,
  TREE_POLICY,
  fastNudge,
} from '../src/orchestration-policy.js';

const originalHome = process.env.DSH_HOME;
const home = mkdtempSync(join(tmpdir(), 'dsh-model-gear-host-'));
process.env.DSH_HOME = home;

let rpcSequence = 0;

function makeContext({ withConnection = true, withInject = true } = {}) {
  const handlers = {};
  let capturedRoute;
  const ctx = {
    logger: { info() {}, warn() {} },
    on(name, fn) {
      handlers[name] = fn;
      return () => {};
    },
  };
  if (withInject) {
    ctx.inject = (services, callback) => {
      assert.deepEqual(services, ['connection'], 'the route is registered against the connection service');
      callback(withConnection
        ? { connection: { fetch: { register(route) { capturedRoute = route; return () => {}; } } } }
        : {});
    };
  }
  return { ctx, handlers, route: () => capturedRoute };
}

function requestEnvelope(payload, rpcId) {
  return { type: 'client-request', rpcId, method: 'dsh-model-gear/orchestration', payload };
}

async function post(route, payload) {
  const rpcId = `rpc-${++rpcSequence}`;
  const response = await route.fetch({ json: async () => requestEnvelope(payload, rpcId) });
  const body = await response.json();
  assert.equal(response.status, 200, 'application errors use the normal response envelope');
  assert.equal(body.type, 'server-response');
  assert.equal(body.rpcId, rpcId, 'rpcId is echoed untouched');
  return body;
}

async function updateMode(route, sessionId, mode) {
  const body = await post(route, { action: 'update', sessionId, mode });
  assert.deepEqual(body.result, { ok: true, value: { mode } });
}

async function readMode(route, sessionId) {
  const body = await post(route, { action: 'read', sessionId });
  assert.equal(body.result.ok, true);
  return body.result.value.mode;
}

function parentPayload({ id = 'session-fast', turn = 1, step = 1, deriveMessages } = {}) {
  return {
    agent: {
      id,
      session: { header: {}, ...(deriveMessages ? { deriveMessages } : {}) },
      inbox: {},
    },
    turn,
    step,
  };
}

function enter(messages = []) {
  return { kind: 'enter', messages };
}

function textsOf(result) {
  return (result?.messages ?? [])
    .filter(message => message?.source?.kind === 'plugin:dsh-model-gear')
    .map(message => message.content.map(block => block.text).join(''));
}

const { apply } = await import('../src/host.js');

try {
  const host = makeContext();
  apply(host.ctx);

  // 1. Route contract and registration.
  const route = host.route();
  assert.ok(route, 'the route was registered');
  assert.equal(route.path, '/api/dsh-model-gear/orchestration');
  assert.deepEqual(route.methods, ['POST']);
  assert.equal(route.requestBody, 'buffered');
  assert.equal(typeof host.handlers['agent/pre-step'], 'function');

  // 2. Update fast, then read it back. The response uses the exact client contract.
  await updateMode(route, 'session-fast', 'fast');
  assert.equal(await readMode(route, 'session-fast'), 'fast');
  const persisted = JSON.parse(readFileSync(join(home, 'storages', 'dsh-model-gear-orchestration.json'), 'utf8'));
  assert.equal(persisted.sessions['session-fast'].mode, 'fast', 'the row is persisted best-effort');

  // 3. The first fast step injects the contract; repeating that same step injects no copy.
  const handler = host.handlers['agent/pre-step'];
  const first = await handler(parentPayload(), async () => enter());
  const firstTexts = textsOf(first);
  assert.ok(firstTexts.includes(LIGHTNING_POLICY), 'the Lightning contract is injected');
  assert.ok(firstTexts.includes(fastNudge(1, 1)), 'step 1 also carries the reminder');
  assert.equal(firstTexts.length, 2, 'one step receives at most the contract and one nudge');

  const repeated = await handler(
    parentPayload({ deriveMessages: () => first.messages }),
    async () => enter(),
  );
  assert.deepEqual(textsOf(repeated), [], 'a committed step does not get a second copy of the contract or nudge');

  // A decision dropped before the loop appended it (abort between the waterfall and `step/start`) must
  // not silence the contract: nothing is remembered in-process, so the next attempt restates it.
  const retried = await handler(parentPayload(), async () => enter());
  assert.ok(textsOf(retried).includes(LIGHTNING_POLICY), 'a dropped decision is retried from the log, not from memory');

  // 4. Step 2 gets a fresh nudge but not a second contract.
  const second = await handler(
    parentPayload({ step: 2, deriveMessages: () => first.messages }),
    async () => enter(),
  );
  assert.deepEqual(textsOf(second), [fastNudge(1, 2)], 'step 2 appends only the step-2 reminder');
  assert.match(textsOf(second)[0], /turn 1/);
  assert.match(textsOf(second)[0], /step 2/);

  // 5. Switching to off retracts the contract once.
  await updateMode(route, 'session-fast', 'off');
  const off = await handler(
    parentPayload({ turn: 2, step: 1, deriveMessages: () => first.messages }),
    async () => enter(),
  );
  assert.deepEqual(textsOf(off), [OFF_NOTICE], 'turning off injects exactly one off notice');
  const offAgain = await handler(
    parentPayload({ turn: 2, step: 1, deriveMessages: () => off.messages }),
    async () => enter(),
  );
  assert.deepEqual(textsOf(offAgain), [], 'the off notice is one-shot');

  // 6. A tree-mode parent receives the combined contract, and its child gets only the tier-1 note.
  await updateMode(route, 'session-tree', 'tree');
  const treeParent = await handler(parentPayload({ id: 'session-tree' }), async () => enter());
  assert.ok(textsOf(treeParent).includes(TREE_POLICY), 'the tree contract is the Lightning + Superfast text');
  await updateMode(route, 'child-1', 'tree');
  const childPayload = {
    agent: {
      id: 'child-1',
      session: {
        header: { origin: 'subagent', delegationDepth: 1 },
        deriveMessages: () => [{
          id: 'first-user',
          role: 'user',
          content: [{ type: 'text', text: 'Tier: 1 of 2\nInvestigate the failing step.' }],
        }],
      },
      inbox: {},
    },
    turn: 1,
    step: 1,
  };
  const child = await handler(childPayload, async () => enter());
  assert.deepEqual(textsOf(child), [CHILD_NOTE_ONE]);
  assert.ok(!textsOf(child).includes(TREE_POLICY), 'the child never receives the parent contract');
  assert.ok(!textsOf(child).includes(fastNudge(1, 1)), 'the child never receives a parent nudge');
  const childAgain = await handler({
    ...childPayload,
    agent: {
      ...childPayload.agent,
      session: { ...childPayload.agent.session, deriveMessages: () => child.messages },
    },
  }, async () => enter());
  assert.deepEqual(textsOf(childAgain), [], 'the child note is de-duplicated once it is in the log');

  // On a child's very first step the task prompt is still in the claim, not in the log. The tier line
  // has to be read from there, or a child that answers in one step never receives its note.
  const childClaim = await handler({
    agent: { id: 'child-2', session: { header: { origin: 'subagent', delegationDepth: 1 }, deriveMessages: () => [] }, inbox: {} },
    turn: 1,
    step: 1,
    messages: [{ role: 'user', content: [{ type: 'text', text: 'Tier: 2 of 2\nDo the work yourself.' }] }],
  }, async () => enter());
  assert.deepEqual(textsOf(childClaim), [CHILD_NOTE_TWO], 'the tier line is read from the claim on the first step');

  // Switching fast -> tree restates the contract, even though the fast text is still in the log.
  await updateMode(route, 'session-fast', 'tree');
  const switched = await handler(
    parentPayload({ turn: 3, step: 1, deriveMessages: () => first.messages }),
    async () => enter(),
  );
  assert.ok(textsOf(switched).includes(TREE_POLICY), 'a mode switch restates the contract');
  await updateMode(route, 'session-fast', 'fast');
  const back = await handler(
    parentPayload({ turn: 4, step: 1, deriveMessages: () => switched.messages }),
    async () => enter(),
  );
  assert.ok(textsOf(back).includes(LIGHTNING_POLICY), 'switching back restates the Lightning contract');

  // A session armed by an earlier host process (no in-process memory of it) must still be retracted.
  const reboot = makeContext();
  apply(reboot.ctx);
  const offAfterRestart = await reboot.handlers['agent/pre-step']({
    agent: { id: 'session-restart', session: { header: {}, deriveMessages: () => first.messages }, inbox: {} },
    turn: 1,
    step: 1,
  }, async () => enter());
  assert.deepEqual(textsOf(offAfterRestart), [OFF_NOTICE], 'a contract from a previous process is retracted too');

  // 7. A host with no connection service, and a host with no inject at all, must not throw.
  const noConnection = makeContext({ withConnection: false });
  assert.doesNotThrow(() => apply(noConnection.ctx));
  assert.equal(noConnection.route(), undefined);
  assert.doesNotThrow(() => apply({ on() { return () => {}; }, logger: { info() {}, warn() {} } }));

  // Route-level validation, including Chinese user-facing copy and the 400 parse failure.
  const invalidMode = await post(route, { action: 'update', sessionId: 'session-fast', mode: 'ultra' });
  assert.equal(invalidMode.result.ok, false);
  assert.match(invalidMode.result.error.message, /档位参数无效/);
  // The client's response parser rejects a failure envelope whose `error.details` is not a record, so
  // a missing details field would turn every validation message into a TypeError before it is read.
  assert.deepEqual(invalidMode.result.error.details, {}, 'failure envelopes carry the details record the client requires');
  const invalidSession = await post(route, { action: 'read', sessionId: '' });
  assert.equal(invalidSession.result.ok, false);
  assert.match(invalidSession.result.error.message, /会话参数无效/);
  const badJson = await route.fetch({ json: async () => { throw new Error('not json'); } });
  assert.equal(badJson.status, 400);

  console.log('host ok: route, persistence, fast/tree injection, dedupe, off notice, child note, no-connection tolerance');
} finally {
  if (originalHome === undefined) delete process.env.DSH_HOME;
  else process.env.DSH_HOME = originalHome;
  rmSync(home, { recursive: true, force: true });
}
