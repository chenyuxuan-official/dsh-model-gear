// Host half of the Lightning orchestration switch.
//
// The panel owns the choice; this file owns the two things the choice actually needs: a tiny
// per-session record behind one connection route, and the `agent/pre-step` injections that make the
// contract real. Nothing here touches persona, Ultra, language, aliases or fact-checking.
//
// Two rules shape the implementation:
//   1. The in-memory Map is the authority for this process. Disk is read once at startup and written
//      best-effort after every change; a failed write must never change the answer or fail a step.
//   2. Every host-facing operation is an add-on. A route, a carrier, or a logger that throws is
//      contained here; it must never take down the request or the agent step it was decorating.
import { randomBytes, randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  CHILD_NOTE_ONE,
  CHILD_NOTE_TWO,
  LIGHTNING_POLICY,
  OFF_NOTICE,
  TREE_POLICY,
  fastNudge,
  treeNudge,
} from './orchestration-policy.js';

const ROUTE_PATH = '/api/dsh-model-gear/orchestration';
const CLIENT_METHOD = 'dsh-model-gear/orchestration';
const STATE_FILE = 'dsh-model-gear-orchestration.json';
/** Every message this plugin appends carries this source kind, which is also how it is de-duplicated. */
const INJECTED_KIND = 'plugin:dsh-model-gear';
const MODES = new Set(['off', 'fast', 'tree']);
const MAX_SESSIONS = 40;
const TIER_LINE = /^Tier:\s*(\d+)\s+of\s+2/m;

/**
 * The record path.
 *
 * Mirrors `@deepseek-ai/dsh-home-paths`, which resolves the harness home as `$DSH_HOME` or `~/.dsh`.
 * The fallback is load-bearing, not defensive: the desktop host does not export `DSH_HOME` in this
 * install, so a `$DSH_HOME`-only path silently wrote nowhere while the gear was being switched live.
 */
function stateFileForProcess() {
  const configured = process.env.DSH_HOME;
  const home = typeof configured === 'string' && configured.trim() !== '' ? configured : join(homedir(), '.dsh');
  return join(home, 'storages', STATE_FILE);
}

/** Logging is diagnostic only. A logger that throws is still not allowed to break the caller. */
function warn(ctx, message) {
  try {
    ctx?.logger?.warn?.(message);
  } catch {
    // There is no safe place to report a failed logger from here.
  }
}

/** Keep the newest rows, dropping the oldest first. `at` is the only ordering that matters. */
function pruneSessions(sessions) {
  if (sessions.size <= MAX_SESSIONS) return;
  const oldestFirst = [...sessions.entries()].sort((a, b) => (a[1]?.at ?? 0) - (b[1]?.at ?? 0));
  for (let index = 0; index < oldestFirst.length - MAX_SESSIONS; index += 1) {
    sessions.delete(oldestFirst[index][0]);
  }
}

/**
 * Read the record exactly once, at apply time.
 *
 * A missing or damaged file means "no session is armed", never a broken host. The file is parsed and
 * filtered instead of trusted: a hand-edit with `mode: "turbo"` or an empty id must not create a
 * state the injection path would later treat as a real mode.
 */
function loadSessions(file, ctx) {
  const sessions = new Map();
  if (!file) return sessions;
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    if (error?.code !== 'ENOENT') warn(ctx, `[dsh-model-gear] orchestration state unreadable: ${String(error)}`);
    return sessions;
  }
  const rows = parsed?.sessions;
  if (rows === null || typeof rows !== 'object' || Array.isArray(rows)) {
    warn(ctx, '[dsh-model-gear] orchestration state has no sessions object; starting with none');
    return sessions;
  }
  for (const [id, value] of Object.entries(rows)) {
    if (typeof id !== 'string' || id.length === 0 || id.length > 256) continue;
    if (!value || typeof value !== 'object') continue;
    if (value.mode !== 'fast' && value.mode !== 'tree') continue;
    sessions.set(id, { mode: value.mode, at: Number.isFinite(value.at) ? value.at : 0 });
  }
  pruneSessions(sessions);
  return sessions;
}

/** A whole-file snapshot: newest first, exact row shape, never more than the cap. */
function stateSnapshot(sessions) {
  const rows = [...sessions.entries()]
    .sort((a, b) => (b[1]?.at ?? 0) - (a[1]?.at ?? 0))
    .slice(0, MAX_SESSIONS)
    .map(([id, row]) => [id, { mode: row.mode, at: row.at }]);
  return { sessions: Object.fromEntries(rows) };
}

/**
 * Best-effort atomic write: temp file in the same directory, then rename.
 *
 * Synchronous on purpose. The file is tiny, and completing the attempt before answering the update
 * route means a returned `ok: true` cannot be followed by an unhandled write later. Failure changes
 * nothing: the in-memory row already returned to the caller stays in force for this process.
 */
function persistSessions(ctx, file, sessions) {
  if (!file) return;
  let temp;
  try {
    temp = `${file}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(temp, `${JSON.stringify(stateSnapshot(sessions), null, 2)}\n`, 'utf8');
    renameSync(temp, file);
  } catch (error) {
    warn(ctx, `[dsh-model-gear] orchestration state unwritable: ${String(error)}`);
    try {
      if (temp) unlinkSync(temp);
    } catch {
      // A stray temp file is less important than the failed write itself.
    }
  }
}

function modeOf(sessions, sessionId) {
  const mode = sessions.get(sessionId)?.mode;
  return mode === 'fast' || mode === 'tree' ? mode : 'off';
}

/** Content may be a string in a fixture; the real host uses a text-block array. */
function textOfMessage(message) {
  const content = message?.content;
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .filter(block => block?.type === 'text' && typeof block.text === 'string')
    .map(block => block.text)
    .join('');
}

/**
 * The text of the newest row this plugin owns in one message list.
 *
 * Only the newest row is returned because the de-duplication contract compares against the latest
 * plugin message in each carrier, not against every old policy row in the conversation.
 */
function newestPluginText(list) {
  if (!Array.isArray(list)) return undefined;
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const message = list[index];
    if (message?.source?.kind === INJECTED_KIND) return textOfMessage(message);
  }
  return undefined;
}

/** The exact row shape the host persists for every injected instruction. */
function injectedMessage(text) {
  return {
    id: randomUUID(),
    role: 'user',
    content: [{ type: 'text', text }],
    source: { kind: INJECTED_KIND, form: 'instructions' },
  };
}

/** Read the session log without letting a host-side getter break the step. */
function derivedMessages(agent) {
  try {
    return agent?.session?.deriveMessages?.();
  } catch {
    return undefined;
  }
}

function tierFromPrompt(messages) {
  if (!Array.isArray(messages)) return undefined;
  const firstUser = messages.find(message => message?.role === 'user');
  if (!firstUser) return undefined;
  const firstLine = textOfMessage(firstUser).split(/\r?\n/, 1)[0] ?? '';
  const match = TIER_LINE.exec(firstLine);
  if (!match) return undefined;
  const tier = Number(match[1]);
  return tier === 1 || tier === 2 ? tier : undefined;
}

/**
 * The whole injection path.
 *
 * The contract and the per-turn reminder live in one listener so `next()` is called exactly once per
 * step. A step can receive at most two rows: the contract (or the one-shot off notice) and a nudge.
 */
function createPreStepHandler(ctx, sessions) {
  /**
   * The two texts this plugin can arm a session with, and the newest one already in a list.
   *
   * Deliberately not "the newest plugin row": nudges share the source kind and arrive after the
   * contract, so the newest row is usually a nudge. The newest *contract* is what says which mode the
   * session is currently under, and it is what a mode switch has to contradict.
   */
  const CONTRACTS = new Set([LIGHTNING_POLICY, TREE_POLICY]);
  function newestContractText(list) {
    if (!Array.isArray(list)) return undefined;
    for (let index = list.length - 1; index >= 0; index -= 1) {
      const message = list[index];
      if (message?.source?.kind !== INJECTED_KIND) continue;
      const text = textOfMessage(message);
      if (CONTRACTS.has(text)) return text;
    }
    return undefined;
  }

  return async (payload, next) => {
    let decision;
    try {
      // Call first, always: the framework's own decision is the base this add-on decorates.
      decision = typeof next === 'function' ? await next() : undefined;
      if (payload?.signal?.aborted) return decision;
      if (decision?.kind !== 'enter' || !Array.isArray(decision.messages)) return decision;

      const agent = payload?.agent;
      const sessionId = agent?.id;
      if (typeof sessionId !== 'string' || sessionId.length === 0) return decision;

      // A child is identified by the session header, not by whitespace or prompt text. `origin` alone
      // is a navigation classification, so delegation depth is checked alongside it.
      const header = agent?.session?.header;
      const child = header?.origin === 'subagent' || (header?.delegationDepth ?? 0) > 0;
      const derived = derivedMessages(agent);

      // Every place a row could already be waiting: the decision being assembled, the session log,
      // and the two inbox queues the loop drains. `deriveMessages` is wrapped above because a host
      // getter may throw; when it does, that carrier simply does not participate.
      const carriers = new Set([
        newestPluginText(decision.messages),
        newestPluginText(derived),
        newestPluginText(agent?.inbox?.nextStep),
        newestPluginText(agent?.inbox?.nextTurn),
      ].filter(text => typeof text === 'string'));

      const appended = [];
      const append = text => {
        appended.push(injectedMessage(text));
      };
      const alreadyAppended = text => appended.some(message => textOfMessage(message) === text);

      // Every instruction this plugin already left in the log, by exact text: one pass, because up to
      // three different texts are asked about below. The log is the only carrier that cannot disagree
      // with what the model actually saw, so it replaces any in-process memory of "what was sent".
      const logged = new Set();
      if (Array.isArray(derived)) {
        for (const message of derived) {
          if (message?.source?.kind === INJECTED_KIND) logged.add(textOfMessage(message));
        }
      }
      const needs = text => !carriers.has(text) && !logged.has(text) && !alreadyAppended(text);

      if (child) {
        // The task prompt is still in the claim on a child's first step — the loop appends it after
        // `step/start` — so the log is empty exactly when its tier line matters most. The claimed
        // batch is the second source; `Tier: N of 2` must be the first line of that prompt.
        const tier = tierFromPrompt(derived) ?? tierFromPrompt(payload?.messages);
        if (tier === undefined) return decision;
        const note = tier === 1 ? CHILD_NOTE_ONE : CHILD_NOTE_TWO;
        if (needs(note)) append(note);
        return appended.length > 0 ? { ...decision, messages: [...decision.messages, ...appended] } : decision;
      }

      const mode = modeOf(sessions, sessionId);

      if (mode === 'off') {
        // The contract stays in the log after the switch is turned off, so one retraction is owed
        // whenever this plugin has left instructions behind and the newest of them is not already the
        // notice. Reading "newest" rather than the whole log is what lets a re-arm plus disarm produce
        // a second notice, and it also covers a session armed by an earlier host process.
        const hasHistory = carriers.size > 0 || logged.size > 0;
        if (hasHistory && !carriers.has(OFF_NOTICE) && !alreadyAppended(OFF_NOTICE)) append(OFF_NOTICE);
      } else {
        const contract = mode === 'tree' ? TREE_POLICY : LIGHTNING_POLICY;
        // The newest contract row, not the newest row: a mode switch must restate the contract even
        // though the previous mode's text is still somewhere in the log.
        const current = newestContractText(derived) ?? newestContractText(decision.messages);
        if (current !== contract && !alreadyAppended(contract)) append(contract);

        // Steps 1..3 of every turn. The opening reminder alone was not enough in the upstream
        // measurement: by the time the model answers, a single reminder is several tool results behind
        // it. The text carries turn and step, so a repeated step is impossible by construction.
        const step = payload?.step;
        if (Number.isInteger(step) && step >= 1 && step <= 3) {
          const nudge = mode === 'tree' ? treeNudge(payload?.turn, step) : fastNudge(payload?.turn, step);
          if (needs(nudge)) append(nudge);
        }
      }

      return appended.length > 0 ? { ...decision, messages: [...decision.messages, ...appended] } : decision;
    } catch (error) {
      warn(ctx, `[dsh-model-gear] orchestration injection skipped: ${String(error)}`);
      return decision;
    }
  };
}

/** One JSON server-response. `rpcId` is carried through untouched, including a malformed value. */
function serverResponse(rpcId, result) {
  return Response.json({ type: 'server-response', rpcId, result });
}

function routeHandler(ctx, sessions, file) {
  async function fetch(request) {
    let envelope;
    try {
      envelope = await request.json();
    } catch {
      return Response.json({ error: '请求体解析失败。' }, { status: 400 });
    }

    const rpcId = envelope?.rpcId;
    // `details` is not optional: the client's response parser rejects a failure envelope without a
    // details record (`connection: invalid server-response failure`), which would replace every
    // validation message below with a TypeError. An empty object is the whole contract.
    const fail = (code, message) => serverResponse(rpcId, { ok: false, error: { code, message, details: {} } });
    try {
      if (envelope?.type !== 'client-request' || envelope?.method !== CLIENT_METHOD) {
        return fail('orchestration/invalid-request', '请求参数无效。');
      }
      const payload = envelope?.payload;
      if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
        return fail('orchestration/invalid-request', '请求参数无效。');
      }
      if (typeof payload.sessionId !== 'string' || payload.sessionId.length === 0 || payload.sessionId.length > 256) {
        return fail('orchestration/invalid-session', '会话参数无效。');
      }

      if (payload.action === 'read') {
        return serverResponse(rpcId, { ok: true, value: { mode: modeOf(sessions, payload.sessionId) } });
      }

      if (payload.action === 'update') {
        if (!MODES.has(payload.mode)) return fail('orchestration/invalid-mode', '档位参数无效。');
        if (payload.mode === 'off') {
          sessions.delete(payload.sessionId);
        } else {
          sessions.set(payload.sessionId, { mode: payload.mode, at: Date.now() });
          pruneSessions(sessions);
        }
        persistSessions(ctx, file, sessions);
        return serverResponse(rpcId, { ok: true, value: { mode: payload.mode } });
      }

      return fail('orchestration/invalid-action', '操作参数无效。');
    } catch (error) {
      warn(ctx, `[dsh-model-gear] orchestration route failed: ${String(error)}`);
      return fail('orchestration/internal', '编排请求处理失败。');
    }
  }

  return { path: ROUTE_PATH, methods: ['POST'], requestBody: 'buffered', fetch };
}

/**
 * Install both halves against one plugin context.
 *
 * `connection` is a soft dependency: a host that composes no carrier still gets the pre-step
 * listener, and a host that composes neither simply runs without orchestration. Registration
 * failures are logged and contained, never thrown back into the plugin fiber.
 */
export function apply(ctx) {
  const file = stateFileForProcess();
  // Read once, as required: the Map below is authoritative for the rest of this process. The outer
  // guard is for disk APIs or parsers that throw outside their own try blocks; no record is worth
  // failing plugin startup over.
  let sessions;
  try {
    sessions = loadSessions(file, ctx);
  } catch (error) {
    warn(ctx, `[dsh-model-gear] orchestration state load failed: ${String(error)}`);
    sessions = new Map();
  }

  try {
    ctx?.inject?.(['connection'], scope => {
      try {
        return scope?.connection?.fetch?.register?.(routeHandler(ctx, sessions, file));
      } catch (error) {
        warn(ctx, `[dsh-model-gear] orchestration route could not be registered: ${String(error)}`);
        return undefined;
      }
    });
  } catch (error) {
    warn(ctx, `[dsh-model-gear] orchestration service injection failed: ${String(error)}`);
  }

  try {
    ctx?.on?.('agent/pre-step', createPreStepHandler(ctx, sessions));
  } catch (error) {
    warn(ctx, `[dsh-model-gear] orchestration pre-step listener could not be registered: ${String(error)}`);
  }
}
