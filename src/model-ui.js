import { ALIASES_KEY, readAliases } from './alias-sync.js';

// ---------------------------------------------------------------------------------------------
// The model-gear panel: the model directory, the reasoning-effort rail, and the orchestration gear.
//
// This file used to carry the whole Codex prompt surface: Ultra (a virtual top tier), a token-budget
// label, meteors, and the Lightning / Superfast switches. Those were removed with the host half that
// injected their prompt text. The gear is the one piece brought back: it is host state now — this
// panel only reads and writes the mode, and repeats the token multiple the contract discloses. The
// host applies it in `agent/pre-step`; the UI does not invent prompt text of its own.
//
// Everything else is still what the host renders or what this browser stores:
//   · the model directory (provider groups, the current selection, search);
//   · the reasoning-effort level list the directory advertises, written back through `select()`;
//   · display names, kept in this browser's localStorage — they paint the list and nothing else.
//
// Element children are always passed as arrays (`h('div', props, [a, b])`) so every call closes on
// the same line it opens; the panels below are deep enough that variadic children became unreadable.
// ---------------------------------------------------------------------------------------------

// No further imports here. `React`, `h`, `paths` and `Icon` come from client.js, `providerGroups` from
// providers.js, and `ALIASES_KEY` / `readAliases` from alias-sync.js: the build concatenates those
// modules into the same factory body *before* this one, which is why they are free symbols.

// One registration per context: the slot below is single-kind, and a second register throws from inside
// the fiber, where the failure reads as a vanished panel rather than a double mount.
//
// Keyed by ctx rather than a plain boolean, because a hot reload mounts the new instance before it
// disposes the old one: a shared flag would make the new instance skip its own registration and then be
// cleared by the old disposer, leaving the slot empty until something applied a third time.
const modelUiRegistered = new WeakSet();

// The 「默认」 group: the current model plus the ones actually picked here. Codex puts the models you
// use at the top of the list; this follows the same idea, and the data never leaves the machine
// (localStorage only, no host record).
const RECENT_MODELS = 'dsh-model-gear/recent-models';
const RECENT_LIMIT = 5;

function registerModelUI(ctx) {
  // Tier labels follow the model menu's own convention: an English word, a capital and the rest lower
  // case — Off / Low / Medium / High / Max. A model that advertises its own name for a level keeps it.
  const effortNames = { low: 'Low', medium: 'Medium', high: 'High', xhigh: 'Max', max: 'Max', ultra: 'Ultra', off: 'Off' };
  const effortLabel = level => effortNames[level?.id] || level?.name || level?.id || 'Off';
  const glyph = (kind, className) => h('svg', {
    className, width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true
  }, [h('path', { d: kind === 'reset' ? 'M3 10a9 9 0 1 1 2.7 8.4M3 4v6h6' : 'M12 5v14M5 12h14' })]);

  // The three orchestration gears, described the way upstream describes them: a speed, plus the token
  // multiple the injected contract itself states. `fast` is Lightning (about 1.5x), `tree` is Lightning
  // plus Superfast (about 2.5x, seven agent contexts).
  const GEARS = [
    { mode: 'off', name: '标准', detail: '默认速度' },
    { mode: 'fast', name: '快速', detail: '至少 1.5× 消耗 甚至更多' },
    { mode: 'tree', name: '超快', detail: '至少 2.5× token 消耗 甚至更多' },
  ];
  const gearName = mode => GEARS.find(entry => entry.mode === mode)?.name ?? '未同步';

  // Codex's lightning, redrawn in currentColor so the stylesheet owns every state colour. The three
  // sparkles exist only while the gear is armed. There is deliberately no SVG <defs>/<linearGradient>
  // here: upstream injected a gradient <svg> into document.body, and this panel must not leak nodes.
  const BOLT_PATH = 'M14.1 2.3 6.2 12.9c-.5.7 0 1.7.9 1.7h3.7l-1.3 6c-.2 1 1.1 1.6 1.7.8l7.9-10.6c.5-.7 0-1.7-.9-1.7h-3.7l1.3-6c.2-1-1.1-1.6-1.7-.8Z';
  const BOLT_STARS = [
    { d: 'M4.5 3.2 5.1 4.9 6.8 5.5 5.1 6.1 4.5 7.8 3.9 6.1 2.2 5.5 3.9 4.9Z', delay: '0s' },
    { d: 'M19.6 12.9 20.1 14.4 21.6 14.9 20.1 15.4 19.6 16.9 19.1 15.4 17.6 14.9 19.1 14.4Z', delay: '0.62s' },
    { d: 'M9.3 18.9 9.7 20 10.8 20.4 9.7 20.8 9.3 21.9 8.9 20.8 7.8 20.4 8.9 20Z', delay: '1.24s' },
  ];
  // `variant` is the caller's tree flag. The glyph itself never branches on it: the armed colour and
  // the tree accent live in CSS (`.cg-model-zap[data-on]`, `.cg-model-trigger-bolt[data-tree]`).
  const boltGlyph = (armed, variant) => h('svg', {
    className: 'cg-model-zap-glyph', width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': true,
    fill: armed ? 'currentColor' : 'none', stroke: 'currentColor',
    strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round'
  }, [
    h('path', { key: 'bolt', d: BOLT_PATH }),
    ...(armed ? BOLT_STARS.map((star, index) => h('path', {
      key: `star-${index}`, className: 'cg-bolt-star', d: star.d, stroke: 'none', style: { animationDelay: star.delay }
    })) : [])
  ]);

  // The host owns the orchestration mode; there is no local fallback, because a mode the host never
  // received would be a lie about what is running. `ctx.get` may throw when the service is absent and
  // the direct property is the older access shape, hence the two-way lookup.
  const connection = () => { try { return ctx.get?.('connection') ?? ctx.connection; } catch { return undefined; } };
  async function gearRequest(payload) {
    const rpc = connection()?.rpc;
    if (typeof rpc?.call !== 'function') throw new Error('未连接宿主，无法读取编排档位。');
    const result = await rpc.call('/api', 'dsh-model-gear/orchestration', payload);
    // `ok === false` is the host's explicit refusal. Anything else — including a plain value object
    // from a test stub — is treated as the value itself, so the panel stays tolerant of both shapes.
    if (result?.ok === false) throw new Error(result.error?.message || '编排档位写入失败。');
    return result?.value ?? result ?? {};
  }

  function readRecentModels() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(RECENT_MODELS) ?? '[]');
      return Array.isArray(parsed)
        ? parsed.filter(entry => typeof entry?.provider === 'string' && typeof entry?.model === 'string')
        : [];
    } catch {
      return [];
    }
  }

  function rememberRecentModel(provider, model) {
    if (!provider || !model) return;
    try {
      // Newest first, one row per provider/model pair.
      const next = [{ provider, model }, ...readRecentModels().filter(entry => entry.provider !== provider || entry.model !== model)].slice(0, RECENT_LIMIT);
      window.localStorage.setItem(RECENT_MODELS, JSON.stringify(next));
    } catch {
      // Storage may be unavailable; the shortcut list is then just shorter.
    }
  }

  // Display names are the owner's own business, keyed `provider/model` so two accounts offering the
  // same model id cannot rename each other. Stored in the browser only: the host is never told.
  const MODEL_ALIASES = ALIASES_KEY;

  function readModelAliases() {
    return readAliases();
  }

  function writeModelAliases(next) {
    try {
      window.localStorage.setItem(MODEL_ALIASES, JSON.stringify(next));
    } catch {
      // Display-only: a refused write costs the next page load, nothing else.
    }
  }

  function ModelControl({ locked, available, directory, load, select, sessionId, gear: gearApi }) {
    const subscribe = React.useCallback(listener => directory.subscribe(listener), [directory]);
    const snapshot = React.useCallback(() => directory.getSnapshot(), [directory]);
    const state = React.useSyncExternalStore(subscribe, snapshot);
    const [open, setOpen] = React.useState(false);
    const [pane, setPane] = React.useState('effort');
    // `null` means "not read yet" or "the host has no such route", never "off": an unknown gear must
    // disable the menu instead of claiming the standard mode is selected.
    const [gear, setGear] = React.useState(null);
    const [query, setQuery] = React.useState('');
    const [draftIndex, setDraftIndex] = React.useState(null);
    const [actionError, setActionError] = React.useState(null);
    const rootRef = React.useRef(null);
    const triggerRef = React.useRef(null);
    const popupRef = React.useRef(null);
    const focusPending = React.useRef(false);
    const effortQueue = React.useRef(null);
    const effortSaving = React.useRef(false);
    const effortTarget = React.useRef(null);
    // The rename field, measured so a long name makes the box taller instead of overflowing it.
    const aliasFieldRef = React.useRef(null);
    const [aliases, setAliases] = React.useState(readModelAliases);
    const [aliasEditor, setAliasEditor] = React.useState(null);
    // The slider track's own width. The hover hit-test reads it, and so does the shower's travel, which
    // is derived from it at render time: a tier change then moves the streaks without waiting for a
    // resize. (The knob's position itself is a container-unit calc, so the measurement is not load-bearing
    // for where the knob stands.)
    const [shellWidth, setShellWidth] = React.useState(0);
    const shellRectRef = React.useRef(null);
    const thumbRef = React.useRef(null);
    // The shower layer. Eleven streaks and their travel are placed by CSS; the ref stays on the layer
    // it names, while the shell carries the custom property the stylesheet reads.
    const meteorRef = React.useRef(null);

    const aliasKey = (providerId, modelId) => `${providerId}/${modelId}`;
    const aliasOf = (providerId, model) => aliases?.[aliasKey(providerId, model.id)] || model.name;
    const hasAlias = (providerId, model) => Boolean(aliases?.[aliasKey(providerId, model.id)]);
    const commitAlias = next => { setAliases(next); writeModelAliases(next); };

    // Storage is the truth whenever the panel opens: a name saved in another tab, or in a session whose
    // state was seeded before the write, must still show up in this list. Closing the panel also drops
    // a half-typed editor, so reopening never resumes a stale draft.
    React.useEffect(() => {
      if (!open) { setAliasEditor(null); return; }
      const stored = readModelAliases();
      setAliases(current => (JSON.stringify(current ?? {}) === JSON.stringify(stored) ? current : stored));
    }, [open]);

    // A layout effect, not a passive one: the field mounts with `rows: 1` and the stylesheet gives
    // `.cg-model-alias-input` `overflow: hidden`, so a passive effect would show one frame of the second
    // line cut off. The dependency is the editor *object*: reopening a row is always a dependency change
    // even when the draft is byte-identical.
    React.useLayoutEffect(() => {
      const field = aliasFieldRef.current;
      if (field == null || typeof field.style?.setProperty !== 'function') return;
      field.style.height = 'auto';
      const measured = field.scrollHeight;
      if (typeof measured === 'number' && measured > 0) field.style.height = `${measured}px`;
    }, [aliasEditor]);

    const choices = state.groups.flatMap(group => group.models.map(model => ({ group, model })));
    const chosen = choices.find(choice => choice.group.id === state.current?.provider && choice.model.id === state.current?.model);
    const reasoning = chosen?.model.reasoning;
    // The levels are the host's own list, in the host's order. No virtual tier is appended: a level the
    // model does not advertise is not a level this panel may claim.
    const steps = reasoning?.efforts || [];
    const maxIndex = Math.max(0, steps.length - 1);
    const effectiveValue = state.current?.reasoningEffort ?? reasoning?.defaultEffort;
    const effectiveIndex = steps.findIndex(step => step.id === effectiveValue);
    // `-1` is a state of its own, not tier 0: the directory's effort may not be one of the steps at all
    // (an `off` the model omits, a level the catalog has not listed). Every reader below used to clamp
    // it with `Math.max(0, ...)`, so the knob parked at the lowest tier while the text beside it printed
    // `state.retainedEffort` — two claims that cannot both be true.
    const indexUnknown = effectiveIndex < 0;
    const pinnedIndex = Math.max(0, effectiveIndex);
    const shownIndex = draftIndex !== null ? Math.min(draftIndex, maxIndex) : pinnedIndex;
    const displayLevel = draftIndex === null ? steps[shownIndex] : steps[draftIndex];
    const trackUnknown = draftIndex === null && indexUnknown;
    const label = trackUnknown ? state.retainedEffort || 'Off' : displayLevel ? effortLabel(displayLevel) : state.retainedEffort || 'Off';
    const effortTone = trackUnknown ? 'off' : steps[shownIndex]?.id ?? 'off';
    const modelName = chosen ? aliasOf(chosen.group.id, chosen.model) : state.current?.model || '选择模型';
    const busy = locked || state.pending !== null;

    const close = React.useCallback(() => { setOpen(false); setDraftIndex(null); triggerRef.current?.focus(); }, []);

    // Measured for the hover hit-test and the shower's travel; re-measured when the track mounts or
    // resizes. The dependency on `open` is load-bearing: the rail only mounts inside the popover.
    React.useLayoutEffect(() => {
      if (!open) return undefined;
      const shell = popupRef.current?.querySelector?.('.cg-model-slider-shell');
      if (!shell) return undefined;
      const measure = () => {
        const parsed = parseFloat(getComputedStyle(shell).width);
        const width = Number.isFinite(parsed) ? parsed : shell.clientWidth;
        setShellWidth(previous => (previous === width ? previous : width));
        shellRectRef.current = null;
      };
      measure();
      if (typeof ResizeObserver !== 'function') return undefined;
      const observer = new ResizeObserver(measure);
      observer.observe(shell);
      const forget = () => { shellRectRef.current = null; };
      window.addEventListener('scroll', forget, { capture: true, passive: true });
      return () => { observer.disconnect(); window.removeEventListener('scroll', forget, { capture: true }); };
    }, [open, steps.length]);

    // The knob travels the track on the compositor, not through layout. `100cqw` is the track's own
    // content width (the stylesheet makes the shell a size container), and the `12px` term is the knob's
    // half-width, which its `-12px` margin would otherwise double-count.
    const knobRatio = maxIndex > 0 ? shownIndex / maxIndex : 0;
    const knobTravel = `calc(12px + (100cqw - 24px) * ${knobRatio})`;
    const thumbX = Math.max(0, shellWidth - 24) * knobRatio;

    React.useEffect(() => { if (effortTarget.current === null || effortTarget.current === effectiveValue) setDraftIndex(null); }, [effectiveValue]);
    React.useEffect(() => { effortQueue.current = null; effortTarget.current = null; setDraftIndex(null); }, [state.current?.provider, state.current?.model]);
    React.useEffect(() => { if (locked || !available) setOpen(false); }, [locked, available]);

    // The gear is host state, so the first paint cannot know it. Read it once per session; a failed
    // read leaves `gear` null and surfaces the host's message — guessing "off" would claim a mode the
    // host may not be applying. The gear object is rebuilt by the slot, so the dependency is the
    // session alone; keying on the object would re-read after every host render.
    //
    // Two guards keep the icon from blinking through states while it is already correct: the mode is
    // only blanked when the session actually changes (not on every re-read), and a read that lands
    // after a newer one — or after the user picked a mode — is discarded instead of overwriting it.
    const gearReadSeq = React.useRef(0);
    const gearSession = React.useRef(null);
    const readGear = React.useCallback(() => {
      const seq = ++gearReadSeq.current;
      const read = typeof gearApi?.read === 'function' ? () => gearApi.read() : () => gearRequest({ action: 'read', sessionId });
      return Promise.resolve()
        .then(read)
        .then(value => {
          if (seq !== gearReadSeq.current) return;
          if (value?.mode !== undefined) setGear(value.mode);
        })
        .catch(error => {
          if (seq === gearReadSeq.current) setActionError(error?.message || String(error));
        });
    }, [sessionId, gearApi]);

    React.useEffect(() => {
      if (!sessionId) return undefined;
      if (gearSession.current !== sessionId) {
        // A new session must not inherit the previous one's gear while its own read is in flight.
        gearSession.current = sessionId;
        setGear(null);
      }
      void readGear();
      return () => { gearReadSeq.current += 1; };
    }, [sessionId, readGear]);

    // Opening the panel is also a chance to converge on the host: another window (or a host reload)
    // may have changed the mode since this instance mounted, and the local copy would otherwise keep
    // painting a mode that is no longer in force. It never blanks the current value first.
    React.useEffect(() => {
      if (!open || !sessionId) return;
      void readGear();
    }, [open, sessionId, readGear]);

    // The bolt's ink is written inline from the mode instead of through the selector chain below.
    // The trigger sits under several attribute-keyed rules (`data-effort`, `data-lightning`,
    // `data-superfast`); one frame where any of them has not landed repaints the icon with the
    // fallback purple, which is exactly the purple/gold flicker this replaced. The custom properties
    // keep the two themes apart; an inline declaration has no cascade to lose.
    const boltInk = gear === 'tree' ? 'var(--cg-tree-ink, #e8a317)' : 'var(--cg-fast-ink, #8a4ff0)';

    React.useEffect(() => {
      if (!open) return;
      const outside = event => { if (!rootRef.current?.contains(event.target)) { setOpen(false); setDraftIndex(null); } };
      // Esc walks one level out per press, innermost first. The listener is registered in the capture
      // phase on purpose: the rename field's own handler can never fire behind it, so the cancel has to
      // happen here too — otherwise Esc inside the field falls through and closes the whole popover.
      const escape = event => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        event.stopPropagation();
        const draftOnScreen = aliasEditor != null && pane === 'model';
        if (aliasEditor != null) setAliasEditor(null);
        if (draftOnScreen) return;
        // A sub-page steps back to the view it was opened from, so one Esc never throws away the panel.
        // The gear page needs this most: its bolt lives on the effort page, so without the step back
        // the only way out of the menu would be to close and reopen the whole popover.
        if (pane === 'gear') { setPane('effort'); focusPending.current = true; return; }
        if (pane === 'providers') { setPane('model'); focusPending.current = true; return; }
        if (pane === 'model' && state.current !== null) { setPane('effort'); focusPending.current = true; }
        else close();
      };
      document.addEventListener('pointerdown', outside);
      document.addEventListener('keydown', escape, true);
      return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape, true); };
    }, [open, pane, state.current, close, aliasEditor]);

    React.useEffect(() => {
      if (!open || !focusPending.current) return;
      focusPending.current = false;
      const handle = requestAnimationFrame(() => (popupRef.current?.querySelector(pane === 'model' ? 'input[type="search"]' : 'input[type="range"]:not(:disabled)') || popupRef.current?.querySelector('button:not(:disabled)'))?.focus());
      return () => cancelAnimationFrame(handle);
    }, [open, pane]);

    async function choose(selection) {
      if (locked || !available || directory.getSnapshot().pending !== null) return false;
      setActionError(null);
      try {
        const result = await select(selection);
        if (result?.ok) rememberRecentModel(selection.provider, selection.model);
        if (!result?.ok) {
          if (result) setActionError(result.error.code === 'session/writer-held' ? '当前会话已被占用，请退出其他正在运行的 DSH 后重试。' : `${result.error.code}: ${result.error.message}`);
          setDraftIndex(null);
          return false;
        }
        return true;
      } catch (error) {
        setActionError(error.message || String(error));
        setDraftIndex(null);
        return false;
      }
    }

    // One writer for the slider: a drag or a key press only records the target, and the loop below
    // collapses rapid input into the last position instead of one host call per pixel.
    const chooseLevel = async value => {
      const index = Number(value), step = steps[index];
      if (!state.current || !step || locked || !available) return;
      setDraftIndex(index);
      effortTarget.current = step.id;
      effortQueue.current = { provider: state.current.provider, model: state.current.model, reasoningEffort: step.id };
      if (effortSaving.current) return;
      effortSaving.current = true;
      setActionError(null);
      try {
        while (effortQueue.current) {
          const selection = effortQueue.current;
          effortQueue.current = null;
          const current = directory.getSnapshot().current;
          if (current?.reasoningEffort === selection.reasoningEffort) continue;
          const result = await select(selection);
          if (!result?.ok) throw new Error(result?.error?.message || '强度更新失败，请重试。');
        }
        const current = directory.getSnapshot().current;
        if (current?.reasoningEffort === effortTarget.current) setDraftIndex(null);
      } catch (error) {
        effortQueue.current = null;
        effortTarget.current = null;
        setDraftIndex(null);
        setActionError(error.message || String(error));
      } finally { effortSaving.current = false; }
    };

    // Optimistic write: the checked row and the trigger bolt move before the round trip. A failure
    // restores the previous mode, so the panel never keeps a gear the host rejected.
    const chooseGear = async mode => {
      if (busy || !sessionId || gear === null) return;
      const previous = gear;
      setGear(mode);
      setActionError(null);
      try {
        const value = typeof gearApi?.select === 'function'
          ? await gearApi.select(mode)
          : await gearRequest({ action: 'update', sessionId, mode });
        // The host is the authority: if it answers with another mode, show that instead of our guess.
        if (value?.mode !== undefined) setGear(value.mode);
      } catch (error) {
        setGear(previous);
        setActionError(error?.message || String(error));
      }
    };

    const show = () => {
      if (busy) return;
      setActionError(null);
      setQuery('');
      setPane(state.current === null ? 'model' : 'effort');
      setOpen(true);
      focusPending.current = true;
      load();
    };

    // Reset means "back to the model's own default effort" — the directory's own value, not a tier this
    // panel invents.
    const reset = () => {
      if (!state.current) return;
      setDraftIndex(null);
      choose({ provider: state.current.provider, model: state.current.model, ...(reasoning?.defaultEffort === undefined ? {} : { reasoningEffort: reasoning.defaultEffort }) });
    };

    if (!available) return null;
    const error = actionError || state.error;

    // Renaming is display-only, so the row says so. An empty draft (or the original name) clears it.
    const saveAlias = () => {
      const draft = String(aliasEditor?.draft ?? '').trim();
      const next = { ...aliases };
      delete next[aliasEditor?.modelId];
      if (draft === '' || draft === aliasEditor?.name) delete next[aliasEditor?.key];
      else next[aliasEditor.key] = draft;
      commitAlias(next);
      setAliasEditor(null);
    };

    // No dialog, no backdrop, no floating panel: the editor replaces the row it belongs to. A panel sized
    // and positioned by hand was clipped by its own popover, and clicking the pencil could leave the
    // reader with nothing on screen — the row itself cannot go missing.
    const filteredGroups = state.groups.map(group => ({
      ...group,
      models: group.models.filter(model => {
        // Coerced on purpose: a render can arrive with the search slot unset, and an unset slot must read
        // as "no query" instead of taking the panel down.
        const needle = String(query ?? '').trim().toLowerCase();
        // Search finds a model by either of its names: the real one, and the alias the user gave it.
        return model.name.toLowerCase().includes(needle) || String(aliases?.[aliasKey(group.id, model.id)] ?? '').toLowerCase().includes(needle);
      })
    })).filter(group => group.models.length);

    // 「默认」组：当前模型 + 最近选过的，最多 6 行。搜索时只留下仍匹配的条目；一行都没有时整组不渲染。
    const defaultRows = (() => {
      const seen = new Set();
      const rows = [];
      const push = (provider, modelId) => {
        const key = `${provider}/${modelId}`;
        if (seen.has(key)) return;
        const group = filteredGroups.find(candidate => candidate.id === provider);
        const model = group?.models.find(candidate => candidate.id === modelId);
        if (!group || !model) return;
        seen.add(key);
        rows.push({ group, model });
      };
      if (state.current) push(state.current.provider, state.current.model);
      for (const entry of readRecentModels()) push(entry.provider, entry.model);
      return rows.slice(0, RECENT_LIMIT + 1);
    })();

    const defaultRow = ({ group, model }) => {
      const isCurrent = state.current?.provider === group.id && state.current?.model === model.id;
      const pick = async () => {
        const effort = isCurrent ? state.current.reasoningEffort ?? model.reasoning?.defaultEffort : model.reasoning?.defaultEffort;
        if (await choose({ provider: group.id, model: model.id, ...(effort === undefined ? {} : { reasoningEffort: effort }) })) {
          setDraftIndex(null); setPane('effort'); focusPending.current = true;
        }
      };
      return h('div', { className: 'cg-model-viewer', key: `${group.id}/${model.id}` }, [
        h('button', {
          type: 'button', role: 'menuitemradio', 'aria-checked': isCurrent, className: 'cg-model-option', disabled: busy, onClick: pick
        }, [
          h('span', null, [aliasOf(group.id, model)]),
          isCurrent ? h(Icon, { name: 'check', size: 14 }) : null
        ])
      ]);
    };

    const defaultGroup = defaultRows.length === 0 ? null : h('div', { key: 'cg-default-group' }, [
      h('div', { className: 'cg-model-provider' }, ['默认']),
      ...defaultRows.map(defaultRow)
    ]);

    const catalogRow = (group, model) => {
      const rowHasAlias = hasAlias(group.id, model);
      // Compared by the full key, not by the model id: two accounts can offer the same model id, and
      // matching on the id put *both* of their rows into editing at once.
      const editing = aliasEditor != null && aliasEditor.key === aliasKey(group.id, model.id);
      const openEditor = () => setAliasEditor({
        key: aliasKey(group.id, model.id), modelId: model.id, name: model.name,
        draft: aliases?.[aliasKey(group.id, model.id)] ?? ''
      });
      const isCurrent = state.current?.provider === group.id && state.current?.model === model.id;
      const pick = async () => {
        const effort = isCurrent ? state.current.reasoningEffort ?? model.reasoning?.defaultEffort : model.reasoning?.defaultEffort;
        if (await choose({ provider: group.id, model: model.id, ...(effort === undefined ? {} : { reasoningEffort: effort }) })) {
          setDraftIndex(null); setPane('effort'); focusPending.current = true;
        }
      };

      // The name's own place becomes the field. It is a textarea so that a long name wraps and the box
      // grows downward; Enter still commits, because a display name is one line's worth of text.
      const editor = h('div', { className: 'cg-model-editor' }, [
        h('textarea', {
          className: 'cg-model-alias-input', ref: aliasFieldRef, rows: 1, autoFocus: true,
          value: aliasEditor?.draft ?? '', placeholder: model.name,
          'aria-label': `为 ${model.name} 输入显示名`,
          title: '回车保存；留空恢复原名；Esc 取消',
          onChange: event => setAliasEditor({ ...aliasEditor, draft: event.target.value }),
          onKeyDown: event => {
            if (event.key === 'Enter') { event.preventDefault?.(); saveAlias(); }
            if (event.key === 'Escape') setAliasEditor(null);
          }
        }),
        // Two glyphs, not a button bar: confirm and cancel on the ends of the field they belong to.
        h('button', { type: 'button', className: 'cg-model-alias-cancel', 'aria-label': '取消改名', title: '取消', onClick: () => setAliasEditor(null) }, [h(Icon, { name: 'close', size: 13 })]),
        h('button', { type: 'button', className: 'cg-model-alias-save', 'aria-label': `保存 ${model.name} 的显示名`, title: '保存', onClick: saveAlias }, [h(Icon, { name: 'check', size: 13 })])
      ]);

      // The rename affordance is its own control: a click on the row already means "use this model". It is
      // a sibling of the selector (a button inside a button is invalid markup) and only fades in under the
      // pointer.
      const viewer = h('div', { className: 'cg-model-viewer' }, [
        h('button', {
          type: 'button', role: 'menuitemradio', 'aria-checked': isCurrent,
          className: 'cg-model-option', disabled: busy,
          title: rowHasAlias ? `原名 ${model.name}` : undefined,
          onClick: pick
        }, [
          h('span', null, [aliasOf(group.id, model)]),
          isCurrent ? h(Icon, { name: 'check', size: 14 }) : null
        ]),
        h('button', {
          type: 'button', className: rowHasAlias ? 'cg-model-rename cg-model-alias-on' : 'cg-model-rename', disabled: busy,
          'aria-label': rowHasAlias ? `修改 ${aliasOf(group.id, model)} 的显示名（原名 ${model.name}）` : `自定义 ${model.name} 的显示名`,
          title: rowHasAlias ? `改名或清空以恢复原名 ${model.name}` : '自定义显示名（只影响这里显示的叫法）',
          onClick: () => { setPane('model'); openEditor(); }
        }, [h(Icon, { name: 'edit', size: 12 })])
      ]);

      return h('div', { key: model.id, className: editing ? 'cg-model-row cg-model-row-editing' : 'cg-model-row' }, [editing ? editor : viewer]);
    };

    const catalogGroups = filteredGroups.map(group => h('div', { key: group.id }, [
      h('div', { className: 'cg-model-provider' }, [
        filteredGroups.length === 1 ? '推荐模型集' : group.id === 'deepseek-account' ? 'DeepSeek 账号' : group.name
      ]),
      ...group.models.map(model => catalogRow(group, model))
    ]));

    // ---------------------------------------------------------------- panes
    const search = choices.length > 4 ? h('input', {
      type: 'search', className: 'cg-model-search', 'aria-label': '搜索模型', placeholder: '搜索模型…',
      value: query, onChange: event => setQuery(event.target.value), disabled: busy
    }) : null;

    const catalog = h('div', { className: 'cg-model-catalog', role: 'menu', 'aria-label': '可用模型' }, [
      defaultGroup,
      ...catalogGroups,
      state.status === 'loading' ? h('p', { className: 'cg-model-message', role: 'status' }, ['正在加载模型…']) : null,
      state.status !== 'loading' && !filteredGroups.length ? h('p', { className: 'cg-model-message' }, [query ? '没有匹配的模型。' : '暂无可用模型。']) : null
    ]);

    const modelPane = h('div', { className: 'cg-model-pane', key: 'model' }, [
      h('div', { className: 'cg-model-catalog-head' }, [
        h('div', { className: 'cg-model-catalog-title' }, ['选择模型']),
        h('button', {
          type: 'button', className: 'cg-model-providers-button', 'aria-expanded': false,
          title: '看看各家的模型（参考清单，可能滞后）', 'aria-label': '打开提供商与模型参考清单',
          onClick: () => { setPane('providers'); setQuery(''); }
        }, ['提供商'])
      ]),
      // The static 「默认」 line is gone: the default group below carries it, so a second label for the
      // same idea only pushed the list down.
      search,
      catalog,
      state.routable === false ? h('p', { className: 'cg-model-error' }, ['当前模型暂不可用，请选择可用模型。']) : null,
      ...state.failures.map(failure => h('p', { className: 'cg-model-error', key: failure.id }, [`${failure.name}: ${failure.message}`])),
      error ? h('p', { className: 'cg-model-error', role: 'alert' }, [error]) : null,
      state.status === 'error' ? h('button', { className: 'cg-model-choice', type: 'button', disabled: busy, onClick: () => { setActionError(null); load(); } }, ['重新加载']) : null
    ]);

    const localGroups = state.groups.map(group => h('details', { className: 'cg-model-provider', key: `local-${group.id}`, open: true }, [
      h('summary', { className: 'cg-model-provider-name' }, [
        h('span', null, [group.name ?? group.id]),
        h('span', { className: 'cg-model-provider-count' }, [`${group.models.length} 个模型`])
      ]),
      h('ul', { className: 'cg-model-provider-models' }, group.models.map(model => h('li', { key: model.id }, [
        hasAlias(group.id, model) ? `${aliasOf(group.id, model)}（${model.name}）` : model.name
      ])))
    ]));

    const referenceGroups = providerGroups().map(group => h('div', { className: 'cg-model-provider-group', key: group.region }, [
      h('div', { className: 'cg-model-provider-region' }, [group.region]),
      ...group.providers.map(provider => h('details', { className: 'cg-model-provider', key: provider.id }, [
        h('summary', { className: 'cg-model-provider-name' }, [
          h('span', null, [provider.name]),
          h('span', { className: 'cg-model-provider-count' }, [
            provider.verified === undefined ? `${provider.models.length} 个系列` : `${provider.models.length} 个系列 · 已核 ${provider.verified}`
          ])
        ]),
        h('ul', { className: 'cg-model-provider-models' }, provider.models.map(model => h('li', { key: model }, [model]))),
        provider.site ? h('a', { className: 'cg-model-provider-site', href: provider.site, target: '_blank', rel: 'noreferrer noopener' }, ['官网']) : null
      ]))
    ]));

    const providersPane = h('div', { className: 'cg-model-pane', key: 'providers' }, [
      h('div', { className: 'cg-model-catalog-head' }, [
        h('div', { className: 'cg-model-catalog-title' }, ['提供商与模型']),
        h('button', { type: 'button', className: 'cg-model-providers-button', title: '回到模型列表', 'aria-label': '回到模型列表', onClick: () => setPane('model') }, ['返回'])
      ]),
      h('p', { className: 'cg-model-provider-note' }, ['上半部分是本机模型列表里**已经有**的模型（含你改过的显示名）；下半部分是各家的公开系列参考，不代表这里就能选用，版本很多、可能滞后。']),
      h('div', { className: 'cg-model-providers', 'aria-label': '模型参考清单' }, [
        // Everything the picker can actually choose, first. The reference list below answers "who makes
        // what"; this answers "what is on this machine", which is what the reader is comparing against.
        h('div', { className: 'cg-model-provider-group' }, [
          h('div', { className: 'cg-model-provider-region' }, ['本机可用']),
          ...localGroups,
          state.groups.length === 0 ? h('p', { className: 'cg-model-message' }, ['模型列表还没加载。']) : null
        ]),
        ...referenceGroups
      ])
    ]);

    // The fill ends where the knob *ends*: `24px + (100% − 24px) × ratio` is the knob's right edge, so
    // the bar reaches the far side of the circle at every tier; at ratio 1 it is exactly 100%, so the top
    // tier cannot get shorter. A track with no known position draws no fill. The exact same string is
    // handed to the shell as `--cg-fill-width`, the band the stylesheet clips the shower to.
    const fillWidth = trackUnknown ? '0px' : `calc(24px + (100% - 24px) * ${knobRatio})`;
    const fill = h('div', {
      className: 'cg-model-slider-fill',
      style: { width: fillWidth }
    });

    // The shower's pixel extent: the fill's width at the measured shell width, plus a tail clearance for
    // the longest streak. It lives on the shell so the stylesheet can translate each streak, and it is
    // derived from `shellWidth` here (rather than written from the resize effect) so a tier change moves
    // it too.
    const meteorTravel = `${Math.round(24 + (shellWidth - 24) * knobRatio + 36)}px`;

    // A dot states whether the fill has reached it. With no known position no dot is lit — the bare tick
    // marks stay, so the track still reads as a slider.
    const dots = h('div', { className: 'cg-model-slider-dots', 'aria-hidden': true },
      steps.map((step, index) => h('span', { key: step.id, 'data-on': !trackUnknown && index <= shownIndex })));

    // The flowing shower. It only appears for a real tier: an `off` track is empty, and a track whose
    // position is unknown is not claiming a tier at all, so flow there would assert an effort nobody
    // selected. Eleven streaks are still positioned by CSS; the shell carries the travel distance.
    const showMeteors = steps.length > 0 && !trackUnknown && effortTone !== 'off' && effortTone !== 'none';
    const meteors = showMeteors ? h('span', { className: 'cg-model-meteors', ref: meteorRef, 'aria-hidden': true },
      Array.from({ length: 11 }, (_, index) => h('span', { key: index, className: 'cg-model-meteor' }))) : null;

    // Positioned by `translate` rather than `left`: `left` re-runs layout for the slider on every tier
    // change, while this property is compositor work. Not rendered at all while the position is unknown:
    // any place it could stand would be an assertion.
    const thumb = !trackUnknown ? h('span', {
      className: 'cg-model-thumb', 'aria-hidden': true, ref: thumbRef, style: { translate: `${knobTravel} 0 0` }
    }) : null;

    const slider = h('input', {
      className: 'cg-model-slider', type: 'range', min: 0, max: maxIndex, step: 1, value: shownIndex,
      disabled: locked || maxIndex < 1, 'aria-label': '推理强度', 'aria-valuetext': trackUnknown ? '未同步' : label,
      onChange: event => setDraftIndex(Number(event.target.value)),
      onPointerUp: event => chooseLevel(event.currentTarget.value),
      onKeyUp: event => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) chooseLevel(event.currentTarget.value); },
      onBlur: event => { if (draftIndex !== null) chooseLevel(event.currentTarget.value); }
    });

    // Grow the knob only when the pointer is over it. The knob cannot receive pointer events itself
    // (`pointer-events: none`, or it would swallow the press and the native range could not be dragged),
    // so the test is geometric; the attribute is written straight onto the node because a state update
    // here would re-render the popover on every mouse move.
    const shell = h('div', {
      className: 'cg-model-slider-shell', 'data-unknown': trackUnknown, 'data-effort': effortTone,
      // The stylesheet clips the shower to this band and walks the streaks across its width; both values
      // are lengths, so the per-tier fill paint is untouched.
      style: { '--cg-fill-width': fillWidth, '--cg-meteor-travel': meteorTravel },
      onPointerMove: event => {
        const node = thumbRef.current;
        if (!node) return;
        const box = shellRectRef.current || (shellRectRef.current = event.currentTarget.getBoundingClientRect());
        const alreadyOver = node.getAttribute('data-over') === 'true';
        const radius = alreadyOver ? 12 * 1.08 : 12;
        const dx = event.clientX - (box.left + 12 + thumbX);
        const dy = event.clientY - (box.top + 14);
        const over = Math.sqrt(dx * dx + dy * dy) <= radius + 2;
        if (over && !alreadyOver) node.setAttribute('data-over', 'true');
        else if (!over && alreadyOver) node.removeAttribute('data-over');
      },
      onPointerLeave: () => { shellRectRef.current = null; thumbRef.current?.removeAttribute('data-over'); }
    }, [fill, meteors, dots, thumb, slider]);

    const effortPane = h('div', { className: 'cg-model-pane', key: 'effort' }, [
      h('div', { className: 'cg-model-top' }, [
        // Top-left bolt: opens the gear page. `data-mode` stays `unknown` until the host answers, so
        // an unread state never looks like a selected mode. Its colour is entirely CSS.
        h('button', {
          className: 'cg-model-zap', type: 'button', 'data-on': gear === 'fast' || gear === 'tree',
          'data-mode': gear ?? 'unknown', 'aria-haspopup': 'menu', 'aria-expanded': pane === 'gear',
          'aria-label': `编排档位：${gearName(gear)}，点击${pane === 'gear' ? '返回' : '更换'}`,
          style: gear === 'fast' || gear === 'tree' ? { color: boltInk } : undefined,
          disabled: busy, onClick: () => setPane(pane === 'gear' ? 'effort' : 'gear')
        }, [boltGlyph(gear === 'fast' || gear === 'tree', gear === 'tree')]),
        // The tier name doubles as the way back to the model list; the reset control returns the effort
        // to the model's own default.
        h('button', {
          className: 'cg-model-summary', type: 'button', disabled: busy, 'aria-label': '更换模型',
          onClick: () => { setPane('model'); focusPending.current = true; }
        }, [
          h('strong', { 'aria-live': 'polite' }, [steps.length ? label : '选择模型']),
          h('span', { className: 'cg-model-summary-name' }, [modelName, h(Icon, { name: 'chevron', size: 11 })])
        ]),
        h('button', {
          className: 'cg-model-reset', type: 'button', 'aria-label': '恢复默认强度',
          disabled: busy || !reasoning || !state.current, onClick: reset
        }, [glyph('reset'), h('span', { className: 'cg-model-tooltip', role: 'tooltip' }, ['重置为默认'])])
      ]),
      steps.length > 0 ? shell : h('p', { className: 'cg-model-message' }, ['当前模型未提供推理强度设置。'])
    ]);

    // One row per gear, each spelling out how many subagents the host will start, so the choice is a
    // budget decision rather than a mysterious speed switch. Unreadable host state disables every row
    // and says why, instead of pretending "standard" is selected.
    const gearPane = h('div', { className: 'cg-model-pane', key: 'gear' }, [
      h('div', { className: 'cg-model-modes', role: 'menu', 'aria-label': '编排档位' }, GEARS.map(choice => h('button', {
        key: choice.mode, className: 'cg-model-mode', type: 'button', role: 'menuitemradio',
        'aria-checked': gear === choice.mode, 'data-on': gear === choice.mode, 'data-mode': choice.mode,
        disabled: busy || !sessionId || gear === null, onClick: () => chooseGear(choice.mode)
      }, [
        h('span', { className: 'cg-model-mode-text' }, [
          h('strong', null, [choice.name]),
          h('span', null, [choice.detail])
        ]),
        h('span', { className: 'cg-model-mode-check', 'aria-hidden': true }, [
          gear === choice.mode ? h(Icon, { name: 'check', size: 14 }) : null
        ])
      ]))),
      gear === null ? h('p', { className: 'cg-model-error' }, [actionError ? `未同步：${actionError}` : '未同步：读不到宿主编排接口（重启应用后可用）。']) : null,
      // The tree's second tier is a host policy, not a promise this panel can make on its own: DSH
      // caps delegation depth, so the two tier-1 children may be all that runs.
      gear === 'tree' ? h('p', { className: 'cg-model-message' }, ['第二层取决于宿主是否允许子代理再委派；不允许时两个 tier-1 会自己做完。']) : null
    ]);

    // The whole-rail colour is a pair of attributes: CSS paints the slider purple for `fast` and gold
    // for `tree`. The popover repeats the flags because it is where the rail's `--cg-effort-color` is
    // declared, so a value inherited from the root would not be enough.
    const popover = h('div', {
      className: 'cg-model-popover', ref: popupRef, role: 'dialog', 'aria-label': '模型与推理强度',
      'data-pane': pane, 'data-effort': effortTone,
      'data-lightning': gear === 'fast', 'data-superfast': gear === 'tree'
    }, [pane === 'gear' ? gearPane : pane === 'effort' ? effortPane : pane === 'providers' ? providersPane : modelPane]);

    return h('div', {
      className: 'cg-model-root', ref: rootRef, 'data-effort': effortTone,
      'data-lightning': gear === 'fast', 'data-superfast': gear === 'tree'
    }, [
      h('button', {
        className: 'cg-model-trigger', type: 'button', ref: triggerRef, disabled: busy,
        'aria-haspopup': 'dialog', 'aria-expanded': open,
        'aria-label': `选择模型，当前 ${modelName}${steps.length || state.retainedEffort ? `，推理强度 ${label}` : ''}`,
        onClick: () => (open ? close() : show())
      }, [
        h('span', { className: 'cg-model-trigger-name' }, [modelName]),
        steps.length > 0 || state.retainedEffort ? h('span', { className: 'cg-model-trigger-effort', 'data-effort': effortTone }, [label]) : null,
        // Armed gears stay visible while the popover is closed. The glyph is decorative and the mode
        // is already spoken by the zap and the menu, hence aria-hidden on the svg.
        gear === 'fast' || gear === 'tree' ? h('span', { className: 'cg-model-trigger-bolt', 'data-tree': gear === 'tree', style: { color: boltInk } }, [boltGlyph(true, gear === 'tree')]) : null,
        h(Icon, { name: 'down', size: 12 })
      ]),
      open ? popover : null
    ]);
  }

  // `conversation.input.model` is a single slot: registering it twice throws, and that throw happens
  // inside the fiber rather than at the call site, so it reads as "the panel vanished" instead of "you
  // mounted twice". The flag is reset by the disposer, so a reload re-registers as a fresh page would.
  if (modelUiRegistered.has(ctx)) return;
  modelUiRegistered.add(ctx);
  ctx.effect(() => {
    ctx.inject(['slots', 'modelDirectories', 'sessions', 'remote', 'remote.session'], scope => {
      const models = scope.modelDirectories;
      const sessions = scope.sessions;
      scope.slots.inject('conversation.input.model', () => scope.slots.register({
        name: 'conversation.input.model',
        priority: -10,
        inject: sessionId => {
          const directory = models.directoryFor(sessionId);
          const available = sessions.subagentAddress(sessionId) === undefined;
          return {
            available,
            directory: directory.store,
            load: () => { if (available) directory.load().catch(() => {}); },
            select: selection => (available ? directory.select(selection) : Promise.resolve(undefined)),
            // The gear goes through the host route only. Keeping the calls in the injected props means
            // the component never has to know how the Connection carrier is obtained.
            gear: {
              read: () => gearRequest({ action: 'read', sessionId }),
              select: mode => gearRequest({ action: 'update', sessionId, mode })
            }
          };
        }
      }, ModelControl));
    });
    return () => { modelUiRegistered.delete(ctx); };
  });
}

// Exported so the built artifact can be mounted by a test without running the whole client surface;
// the bundle's own `apply` calls it exactly as a plugin would.
export { registerModelUI };
