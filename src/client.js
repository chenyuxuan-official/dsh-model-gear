import React from 'react';
const h = React.createElement;

const paths = {
  home: 'M2.7 10.3 11 3.4a1.6 1.6 0 0 1 2 0l8.3 6.9a1 1 0 0 1-.6 1.8H19v7.1a1.8 1.8 0 0 1-1.8 1.8H14v-6H10v6H6.8A1.8 1.8 0 0 1 5 19.2v-7.1H3.3a1 1 0 0 1-.6-1.8Z',
  files: 'm10 4 6-1a3 3 0 0 1 3.4 2.4l1 6a3 3 0 0 1-2.4 3.4l-1.2.2M5.7 6.4l6.8-.8a2.8 2.8 0 0 1 3.1 2.4l.9 9a2.8 2.8 0 0 1-2.4 3.1l-6.8.8a2.8 2.8 0 0 1-3.1-2.4l-.9-9a2.8 2.8 0 0 1 2.4-3.1ZM10 6l.4 3a1.8 1.8 0 0 0 2 1.6l3-.4',
  clock: 'M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  search: 'M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  edit: 'M11 4H6a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-5M13.5 5.5l5 5M8 16l1-4L18 3a1.4 1.4 0 0 1 2 0l1 1a1.4 1.4 0 0 1 0 2l-9 9-4 1Z',
  bell: 'M6 10a6 6 0 0 1 12 0v3.5l1.7 3a1 1 0 0 1-.9 1.5H5.2a1 1 0 0 1-.9-1.5l1.7-3V10ZM10 21a2.5 2.5 0 0 0 4 0',
  chevron: 'm9 5 7 7-7 7',
  down: 'm7 10 5 5 5-5',
  folder: 'M3 7h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2ZM3 9V5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v2',
  more: 'M4 12h.01M12 12h.01M20 12h.01',
  check: 'm5 12 4 4L19 5',
  settings: 'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  refresh: 'M20 7V3l-4 4M20 7a8 8 0 1 0 0 10M20 7h-5',
  help: 'M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  external: 'M14 3h7v7M21 3l-11 11M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5',
  chat: 'M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM7 9h10M7 13h7',
  trace: 'M9 5h12M9 12h12M9 19h12M3 3h3v4H3ZM3 10h3v4H3ZM3 17h3v4H3Z',
  target: 'M20 10a9 9 0 1 1-6-6M17 11a5 5 0 1 1-4-4M12 12l7-7M17 3v4h4',
  plus: 'M12 5v14M5 12h14',
  trash: 'M4 7h16M10 7V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V7M6.5 7l.9 12.1A2 2 0 0 0 9.4 21h5.2a2 2 0 0 0 2-1.9L17.5 7M10 11v6M14 11v6',
  at: 'M16 8v7a2 2 0 0 0 4 0v-3a8 8 0 1 0-3 6M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'
};
function Icon({ name, size = 16, active = false }) {
  const attrs = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: name === 'more' ? 3.6 : 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, 'data-icon': name };
  if (active && name === 'clock') return h('svg', attrs, h('circle', { cx: 12, cy: 12, r: 10, fill: 'currentColor', stroke: 'none' }), h('path', { d: 'M12 7v6l-3 2', stroke: 'var(--cg-rail-hand, white)', strokeWidth: 1.5 }));
  // Official static sidebar-tasks fallback NGr; retain selected treatment.
  if (name === 'clock') return h('svg', { ...attrs, viewBox: '0 0 20 20', strokeWidth: 1.33 }, h('circle', { cx: 10, cy: 10, r: 7.5 }), h('path', { d: 'M9.99996 5.8335V9.82757C9.99996 9.93808 9.95606 10.0441 9.87792 10.1222L7.91663 12.0835' }));
  if (name === 'home') return h('svg', { ...attrs, fill: active ? 'currentColor' : 'none' }, h('path', { d: paths.home }));
  // Official Space railIcons: WLa (default), VLa (selected).
  if (name === 'files') return h('svg', { ...attrs, viewBox: '0 0 20 20', stroke: 'none', fill: 'currentColor' },
    ...(active ? ["M8.28093 8.3185C8.37244 9.60284 9.48784 10.5709 10.7721 10.4796L14.1764 10.2365L14.6384 15.5177C14.7804 17.1432 13.5772 18.5763 11.9518 18.7189L5.10808 19.3175C3.48236 19.4596 2.04914 18.2567 1.90691 16.631L1.17546 8.26674C1.0334 6.64118 2.2355 5.20802 3.86101 5.06557L8.02214 4.70034L8.28093 8.3185Z","M7.01921 3.38784C7.47188 1.69984 9.20799 0.697271 10.8962 1.14955L16.9489 2.77162C18.6367 3.22417 19.6389 4.95967 19.1872 6.6476L17.2116 14.0216C17.0049 14.7926 16.5286 15.4178 15.9137 15.8292C15.9154 15.69 15.9115 15.549 15.8991 15.4074L15.3161 8.74819C15.2185 7.63342 14.682 6.60233 13.8249 5.88295L11.9704 4.32631C11.1133 3.60731 10.0048 3.25929 8.89031 3.35659L6.9821 3.5226L7.01921 3.38784Z","M9.34929 4.60756C10.0085 4.62836 10.6466 4.86781 11.1569 5.29604L13.0124 6.8517C13.6124 7.3554 13.988 8.07809 14.0563 8.85854L14.0602 8.9103L10.6774 9.15248C10.1259 9.19147 9.64655 8.77623 9.6071 8.22475L9.34929 4.60756Z"] : ["M7.01826 3.38781C7.47069 1.69958 9.20694 0.697366 10.8952 1.14953L16.9479 2.7716C18.6362 3.22397 19.6383 4.9593 19.1862 6.64757L17.2106 14.0216C16.8715 15.2866 15.8124 16.1623 14.5935 16.3341C14.3503 17.5978 13.2984 18.601 11.9528 18.7189L5.1081 19.3175C3.48242 19.4595 2.04916 18.2567 1.90693 16.631L1.17549 8.26672C1.03327 6.64107 2.23548 5.20804 3.86103 5.06554L6.63349 4.82238L7.01826 3.38781ZM3.97724 6.39074C3.08335 6.46908 2.42258 7.25658 2.50068 8.1505L3.23213 16.5148C3.31035 17.4088 4.0988 18.0705 4.99287 17.9923L11.8366 17.3937C12.7306 17.3154 13.3914 16.527 13.3132 15.6329L12.8444 10.2706L10.78 10.4523C9.49733 10.5643 8.3659 9.6148 8.25361 8.33214L8.05244 6.03332L3.97724 6.39074ZM10.5505 2.43468C9.57185 2.17269 8.56586 2.75305 8.30342 3.73156L8.04365 4.69836L8.9997 4.61535C9.78022 4.54706 10.5566 4.79156 11.1569 5.29504L13.0124 6.85168C13.6126 7.35543 13.988 8.07788 14.0563 8.85851L14.5915 14.9825C15.2198 14.8273 15.7464 14.3452 15.9255 13.6769L17.9011 6.30382C18.1633 5.32505 17.5829 4.31818 16.6042 4.05578L10.5505 2.43468ZM9.57881 8.21593C9.62702 8.76703 10.1136 9.17528 10.6647 9.12707L12.7272 8.9464C12.6834 8.52775 12.4799 8.14127 12.1569 7.87023L10.3024 6.31457C10.0402 6.09451 9.71672 5.96583 9.37959 5.94054L9.57881 8.21593Z"]).map((d, index) => h('path', { key: index, d, fillRule: 'evenodd', clipRule: 'evenodd' })));
  if (name === 'at') return h('svg', { ...attrs, viewBox: '0 0 20 20', strokeWidth: 1.33, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M4.38 6.236 C3.182 7.085 1.569 7.454 -0.001 7.454 C-4.651 7.454 -7.718 3.781 -7.418 -0.519 C-7.145 -4.416 -3.667 -7.454 0.313 -7.454 C4.865 -7.454 7.703 -3.928 7.418 0.159 C7.217 3.039 4.328 4.163 2.524 2.218', transform: 'translate(9.999 9.975)' }),
    h('path', { d: 'M-3.218 0.786 C-3.218 0.786 0.924 -3.201 0.924 -3.201 C1.008 -3.281 1.14 -3.278 1.22 -3.195 L2.523 -1.826 C3.749 -0.568 3.393 1.023 2.143 2.226 C0.894 3.429 -0.736 3.681 -1.92 2.45 L-3.224 1.08 C-3.303 0.997 -3.301 0.866 -3.218 0.786 Z', transform: 'translate(10.104 10.092)' }),
    h('path', { d: 'M0 .792 C0 .792 0 -.792 0 -.792', transform: 'translate(10.104 10.092) translate(-.43 -3.208) rotate(-43.907)' }),
    h('path', { d: 'M0 .792 C0 .792 0 -.792 0 -.792', transform: 'translate(10.104 10.092) translate(-3.181 -.561) rotate(-43.907)' }));
  // Official archive artwork, path-for-path from @deepseek-ai/dsh-client-ui-primitives
  // (IconArchiveOutlineRegular 16px box, IconUnarchiveOutlineRegular 20px box), so the session-row
  // action matches DSH's own sidebar button instead of a hand-drawn glyph.
  if (name === 'archive') return h('svg', { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, 'data-icon': name },
    h('path', { d: 'M13.5 2.5H2.5C1.94772 2.5 1.5 2.94772 1.5 3.5V4.5C1.5 5.05228 1.94772 5.5 2.5 5.5H13.5C14.0523 5.5 14.5 5.05228 14.5 4.5V3.5C14.5 2.94772 14.0523 2.5 13.5 2.5Z' }),
    h('path', { d: 'M2.5 5.5V13.5C2.5 13.7652 2.60536 14.0196 2.79289 14.2071C2.98043 14.3946 3.23478 14.5 3.5 14.5H12.5C12.7652 14.5 13.0196 14.3946 13.2071 14.2071C13.3946 14.0196 13.5 13.7652 13.5 13.5V5.5' }),
    h('path', { d: 'M6.5 9.5H9.5' }));
  if (name === 'unarchive') return h('svg', { width: size, height: size, viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, 'data-icon': name },
    h('path', { fillRule: 'evenodd', clipRule: 'evenodd', stroke: 'none', fill: 'currentColor', d: 'M15.8659 2.05975C17.2603 2.05995 18.3913 3.19096 18.3914 4.58527V5.4874C18.3914 6.02747 18.2192 6.52672 17.9303 6.93735C17.9336 6.96524 17.9388 6.99318 17.9388 7.02195V12.8884C17.9388 13.6345 17.9395 14.2379 17.8996 14.7254C17.8642 15.1593 17.7936 15.5499 17.6373 15.9141L17.5654 16.0685C17.278 16.6328 16.8405 17.1046 16.3038 17.434L16.0679 17.5661C15.66 17.7739 15.2196 17.8598 14.7237 17.9003C14.2362 17.9401 13.6327 17.9405 12.8867 17.9405H7.11122C6.36511 17.9405 5.76171 17.9401 5.27418 17.9003C4.84051 17.8649 4.44949 17.7952 4.08545 17.6391L3.93104 17.5661C3.36673 17.2785 2.89392 16.8414 2.56465 16.3044L2.43245 16.0685C2.22473 15.6608 2.13878 15.2211 2.09825 14.7254C2.05841 14.2379 2.05912 13.6345 2.05912 12.8884V7.02195C2.05912 6.99284 2.06422 6.96449 2.06758 6.93629C1.77931 6.52592 1.60858 6.02687 1.60858 5.4874V4.58527C1.60876 3.19084 2.73962 2.05975 4.1341 2.05975H15.8659ZM16.4984 7.92936C16.296 7.98169 16.0847 8.01288 15.8659 8.01291H4.1341C3.91478 8.01291 3.70246 7.98194 3.49955 7.92936V12.8884C3.49955 13.6582 3.50053 14.1927 3.53445 14.608C3.56769 15.0146 3.62923 15.244 3.71635 15.415L3.7925 15.5514C3.98339 15.8627 4.25749 16.1165 4.58464 16.2833L4.72529 16.3435C4.88095 16.3993 5.08638 16.4402 5.39158 16.4651C5.80685 16.4991 6.34138 16.5001 7.11122 16.5001H12.8867C13.6564 16.5001 14.1911 16.499 14.6063 16.4651C15.0128 16.432 15.2423 16.3703 15.4133 16.2833L15.5508 16.2061C15.8618 16.0152 16.116 15.7419 16.2827 15.415L16.3429 15.2732C16.3985 15.1177 16.4396 14.9128 16.4645 14.608C16.4985 14.1927 16.4984 13.6583 16.4984 12.8884V7.92936ZM4.1341 3.50019C3.53511 3.50019 3.0492 3.98631 3.04902 4.58527V5.4874C3.04902 6.08649 3.535 6.57248 4.1341 6.57248H15.8659C16.4648 6.57228 16.951 6.08638 16.951 5.4874V4.58527C16.9509 3.98644 16.4647 3.50038 15.8659 3.50019H4.1341Z' }),
    h('path', { d: 'M10 14.1V10.1M7.85 12.05L10 9.9L12.15 12.05' }));
  // Self-drawn pushpin: pinning had no glyph anywhere in the shipped icon set, and drawing it here
  // keeps the row action free of third-party artwork.
  if (name === 'pin') return h('svg', { ...attrs, viewBox: '0 0 20 20', fill: active ? 'currentColor' : 'none' },
    h('path', { d: 'M8 3H12V4.6L11 5.8V8.2L13 10V11.3H7V10L9 8.2V5.8L8 4.6V3Z' }),
    h('path', { d: 'M10 11.3V17' }));
  // A plain cross, for the cancel half of an inline editor. Drawn here for the same reason.
  if (name === 'close') return h('svg', { ...attrs, viewBox: '0 0 16 16', strokeWidth: 1.4 },
    h('path', { d: 'M4 4L12 12' }),
    h('path', { d: 'M12 4L4 12' }));
  return h('svg', attrs, h('path', { d: paths[name] || paths.more }));
}

// One stylesheet per page, kept installed by a watcher that outlives any single plugin instance.
// Nothing in this plugin removes the stylesheet or the root attribute any more: an earlier hot
// reload disposed the old instance (which removed both) without the replacement reinstalling them,
// leaving the panel rendered with no styles at all.
const STYLE_ID = 'dsh-model-gear-style';
// One writer per page. The last plugin instance to apply claims the sheet through a page-global token;
// an older instance's timer keeps running after a hot reload (it is deliberately never cleared), and
// without an owner both instances rewrite the sheet with their own CSS once a second — every control
// whose palette changed between the two builds then repaints at 1 Hz.
const STYLE_OWNER_KEY = '__dshModelGearStyleOwner';
const STYLE_OWNER = {};
let styleWatcher = null;
let styleTimer = null;
/** Handle of the one-shot token-colour sweep scheduled by startStyleWatch, so a re-entry replaces it
 *  instead of stacking another. */
let initialScanFrame = 0;

/** Whether this module instance is still the one that owns the stylesheet. */
function ownsStyle() {
  try {
    return window[STYLE_OWNER_KEY] === STYLE_OWNER;
  } catch {
    return true;
  }
}

/**
 * Install the stylesheet, and repair it when a previous build's copy is still in the document.
 *
 * Testing only for the element's absence was a real bug. A host that hot-reloaded an older build left
 * a `style#dsh-codex-ui-style` behind; the new build found the element, skipped the write, and the page
 * kept rendering with the old sheet — or with an empty one, if the earlier instance had been disposed
 * between clearing and refilling it. The symptom is easy to misread: all the markup is present and
 * completely unstyled, including this plugin's own chrome, which looks like a broken bundle rather than
 * a stale stylesheet.
 *
 * The element is therefore not treated as "already done". Its text is compared against the sheet this
 * build carries and replaced when they differ: a page can only ever hold one build's CSS, so a mismatch
 * means the document is stale, never that the new sheet should be skipped.
 */
function installStyle() {
  // A retired instance may still be running its repair timer; it must not write.
  if (!ownsStyle()) return;
  let style = document.getElementById(STYLE_ID);
  if (style === null) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    style.dataset.pluginCss = 'dsh-model-gear';
    (document.head ?? document.documentElement).appendChild(style);
  }
  if (style.textContent !== STYLE) style.textContent = STYLE;
  if (!document.documentElement.hasAttribute('data-chatgpt-ui')) document.documentElement.setAttribute('data-chatgpt-ui', '');
}

/**
 * Give shiki's token colours back.
 *
 * The host ships `.compact pre, .compact pre :is(code, span) { color: inherit !important }` in
 * `MarkdownText.module.css`. `pre` itself matches that rule, so its own inline
 * `color: var(--shiki-foreground)` is overridden to `inherit`, and every token span inherits that one
 * value. Redefining `--shiki-foreground` on `pre` therefore changes nothing — the variable is no longer
 * read once the declaration that reads it has lost the cascade. The block renders in
 * `--dsw-alias-label-tertiary`, which is the unreadable grey.
 *
 * No stylesheet can undo this: a declaration overridden by an author `!important` cannot be revived by
 * another author declaration of any specificity. One rule per token type would work only until shiki adds
 * a token type.
 *
 * An inline `!important` outranks every stylesheet `!important`, so the fix re-applies each span's own
 * declared colour through `style.setProperty(..., 'important')`. The original is still readable from
 * `span.style.color` — losing the cascade does not erase a declaration — so this restores exactly what
 * shiki wrote, for every token type, without knowing any of their names.
 */
function restoreTokenColors(root) {
  if (!root || root.nodeType !== 1) return;
  // The added node may itself be the span (streaming text arrives as individual runs).
  if (typeof root.matches === 'function' && root.matches('pre span[style]')) {
    reassertColor(root);
  }
  // Every other case is a subtree that may contain a block. Bailing when there is no <pre> keeps the
  // common mutation — a chat message with no code in it — down to one cheap query.
  if (typeof root.querySelector !== 'function' || root.querySelector('pre') === null) return;
  for (const span of root.querySelectorAll('pre span[style]')) reassertColor(span);
}
/** Re-apply one span's own declared colour at inline `!important` priority. */
function reassertColor(span) {
  const declared = span.style.color;
  if (declared === '' || span.style.getPropertyPriority('color') === 'important') return;
  span.style.setProperty('color', declared, 'important');
}
/** Re-attach to the live <head>/<html>: a replaced head would orphan an observer bound to the old one. */
function observeStyleTargets() {
  if (styleWatcher === null) return;
  styleWatcher.disconnect();
  styleWatcher.observe(document.documentElement, { childList: true, attributes: true, attributeFilter: ['data-chatgpt-ui'] });
  if (document.head !== null) styleWatcher.observe(document.head, { childList: true });
}
function startStyleWatch() {
  // Claim the sheet before the first write. A newer instance takes ownership from an older one that
  // may still be alive, so the older timer's next tick sees a foreign token and stops writing.
  try { window[STYLE_OWNER_KEY] = STYLE_OWNER; } catch { /* no window (node tests) */ }
  installStyle();
  if (styleWatcher !== null) return;
  styleWatcher = new MutationObserver(() => { observeStyleTargets(); installStyle(); });
  observeStyleTargets();
  // Belt and braces: one lookup per second also recovers when every observer target was torn down.
  styleTimer = setInterval(installStyle, 1000);
  // The bundle is also loaded outside a page (the node tests run `apply` against a stub document),
  // where a ref'd interval would keep the process alive after the assertions finish. A browser timer
  // is a number with no `unref`, so this line is a no-op in the page.
  if (typeof styleTimer === 'object' && typeof styleTimer?.unref === 'function') styleTimer.unref();
  // The transcript streams in and virtualisation recreates rows, so a one-shot pass would miss every
  // block that arrives after mount. Two decisions here, both measured:
  //
  // 1. Incremental, not a full sweep. A full `document.querySelectorAll('pre span[style]')` costs 12.8 ms
  //    of query time alone on a 45k-span transcript, and ~98 ms per pass once the per-span CSSOM reads
  //    are included — against a 16.7 ms frame budget that is 6-10 fps, paid on every frame while text
  //    streams. Consuming `addedNodes` instead brings a 50-span batch to 0.3 ms, because the common
  //    mutation is a message with no code in it at all.
  // 2. `attributes: ['style']` is watched too. React writes style through the IDL property, which resets
  //    the priority back to normal and silently undoes the fix; without this the colours would drop back
  //    to grey the first time a row re-renders.
  const pending = new Set();
  let frame = 0;
  const flush = () => {
    frame = 0;
    const roots = [...pending];
    pending.clear();
    for (const node of roots) restoreTokenColors(node.nodeType === 1 ? node : node.parentElement);
  };
  const schedule = node => {
    if (node) pending.add(node);
    if (frame !== 0) return;
    frame = requestAnimationFrame(flush);
  };
  const tokenObserver = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes') { schedule(record.target); continue; }
      for (const node of record.addedNodes) schedule(node);
    }
  });
  tokenObserver.observe(document.body ?? document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style'],
  });
  // One initial pass over what is already on screen — the observer only sees what arrives later.
  initialScanFrame = requestAnimationFrame(() => { initialScanFrame = 0; restoreTokenColors(document.body ?? document.documentElement); });
  // No disposer is returned on purpose. The only caller drops the value, so returning one would read as
  // "this gets cleaned up" while the observer in fact outlives the call — the same lifetime `styleWatcher`
  // and `styleTimer` above already have. A guard that looks like cleanup but never runs is worse than no
  // guard: the next reader would build on it.
}

// ---------------------------------------------------------------------------
// dsh-model-gear: the model-gear panel only.
//
// Extracted from dsh-codex-ui (MIT, MeteorNOX/jiangshen275-beep lineage) and then cut down to the
// panel itself. The original bundle mounted a whole skin next to it (sidebar, session list, settings,
// hero, overlays) and drove a set of prompt injections; both are deliberately absent here.
//
// `inject` is empty on purpose: this half only installs a stylesheet and registers one slot, and the
// slot declares its own service dependencies inside `registerModelUI`. Listing services here would
// mean a host that lacks any one of them silently never mounts the panel.
// ---------------------------------------------------------------------------

export const inject = [];

export function apply(ctx) {
  // Stylesheet first: a slot registration that throws must not leave the page
  // without the sheet that positions the panel it did manage to mount.
  startStyleWatch();
  registerModelUI(ctx);
}