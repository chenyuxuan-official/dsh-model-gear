window.__ModuleLoader__.load({id:'dsh-model-gear',factory:(require)=>{const STYLE="/* dsh-model-gear: the model-gear panel only, extracted from dsh-codex-ui (MIT).\n   Classes: 59; rules: 289; media blocks: 7; keyframes: 6. */\n/* Theme tokens. Upstream declares these on `html[data-chatgpt-ui]` and\n   `body[data-ds-dark-theme]` — attribute selectors, which the class-name extraction\n   dropped, leaving `background: var(--cg-page)` unresolvable and the popover\n   see-through. They are restored here, restricted to the tokens the panel uses. */\nhtml[data-chatgpt-ui] {\n  --cg-page: #ffffff;\n  --cg-text: #2f3134;\n  --cg-muted: #82848a;\n  --cg-hover: #f0f0f0;\n}\n\nbody[data-ds-dark-theme] {\n  --cg-page: #212121;\n  --cg-text: #ececec;\n  --cg-muted: #929292;\n  --cg-hover: #303030;\n}\n\n.cg-model-root { position: relative; min-width: 0; color: var(--cg-text); }\n\n/* The two orchestration inks as custom properties, so the component can paint a bolt inline without\n   having to know which theme is active. An inline colour is the one declaration no attribute-keyed\n   rule and no stylesheet swap can undo, which is what the collapsed trigger's bolt needed: keyed\n   only through the cascade, it fell back to purple for any frame where a `data-*` rule had not\n   landed, and that read as a purple/gold flicker. */\n.cg-model-root { --cg-fast-ink: #8a4ff0; --cg-tree-ink: #e8a317; }\nbody[data-ds-dark-theme] .cg-model-root { --cg-fast-ink: #bb74ff; --cg-tree-ink: #f0b429; }\n\n.cg-model-trigger { display: inline-flex; align-items: center; gap: 4px; max-width: min(300px,38vw); height: 28px; padding: 0 5px; border: 0; border-radius: 8px; background: transparent; color: var(--cg-text); cursor: pointer; font-size: 12px; white-space: nowrap; }\n\n.cg-model-trigger:hover { background: var(--cg-hover); }\n\n.cg-model-trigger:disabled { opacity: .5; cursor: default; }\n\n.cg-model-trigger-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; }\n\n.cg-model-trigger-effort { color: var(--cg-muted); }\n\n.cg-model-trigger-effort[data-ultra=\"true\"] { color: #9b50ff; }\n\n/* Max's label takes the light purple end of the ramp — in the composer label and in the\n\n   popover's headline. Only the text: the other accents keep their own colour roles. */\n\n.cg-model-root[data-effort=\"xhigh\"] .cg-model-trigger-effort,\n\n.cg-model-root[data-effort=\"max\"] .cg-model-trigger-effort,\n\n.cg-model-popover[data-effort=\"xhigh\"] .cg-model-summary strong,\n\n.cg-model-popover[data-effort=\"max\"] .cg-model-summary strong { color: #a273f2; }\n\nbody[data-ds-dark-theme] .cg-model-root[data-effort=\"xhigh\"] .cg-model-trigger-effort,\n\nbody[data-ds-dark-theme] .cg-model-root[data-effort=\"max\"] .cg-model-trigger-effort,\n\nbody[data-ds-dark-theme] .cg-model-popover[data-effort=\"xhigh\"] .cg-model-summary strong,\n\nbody[data-ds-dark-theme] .cg-model-popover[data-effort=\"max\"] .cg-model-summary strong { color: #c9aaff; }\n\n.cg-model-trigger svg { color: var(--cg-muted); width: 12px; height: 12px; flex: none; }\n\n.cg-model-popover { --cg-effort-color: #3982fa; color: var(--cg-text); box-sizing: border-box; width: 256px; position: absolute; z-index: 60; right: 0; bottom: calc(100% + 10px); padding: 11px 12px 12px; border: 1px solid #e6e6e6; border-radius: 19px; background: var(--cg-page); box-shadow: 0 6px 14px #0000000c; }\n\n.cg-model-popover[data-ultra=\"true\"] { --cg-effort-color: #9b50ff; }\n\n/* A model row is a selector plus its rename affordance. The button is a sibling of the selector (a\n\n   button inside a button is invalid markup) and stays out of the way: its box is always reserved so\n\n   nothing shifts, but it only becomes visible under the pointer. It carries no colour of its own —\n\n   an accent tinted by the current effort tier looked like it belonged to a different surface — so it\n\n   is the row's muted tone, and the row's own text tone under the pointer. */\n\n.cg-model-row { display: flex; align-items: center; gap: 2px; }\n\n.cg-model-row .cg-model-option { flex: 1 1 auto; min-width: 0; }\n\n.cg-model-rename { display: flex; flex: none; width: 20px; height: 20px; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 6px; background: transparent; opacity: 0; color: var(--cg-muted); cursor: pointer; transition: opacity 120ms ease; }\n\n.cg-model-row:hover .cg-model-rename, .cg-model-rename:focus-visible { opacity: .45; }\n\n.cg-model-rename:hover, .cg-model-rename:focus-visible { opacity: .9; color: var(--cg-text); }\n\n/* The rename field takes the name's own place inside the row: no frame, the row's type, and it\n\n   wraps — a long name makes the box taller instead of running off the edge. The two glyphs at its\n\n   ends are the row's muted tone with no fill, so they read as part of the row, not as a form. */\n\n.cg-model-row-editing { gap: 2px; align-items: flex-start; }\n\n.cg-model-alias-input { box-sizing: border-box; flex: 1 1 auto; min-width: 0; margin: 0 2px; padding: 2px 2px 3px; border: 0; border-bottom: 1px solid var(--cg-effort-color); border-radius: 0; background: transparent; color: var(--cg-text); font: inherit; font-size: 13px; line-height: 18px; /* No height cap at all: a long name keeps making the field taller, which is what \"no limit\" has to mean. The list around it is the only thing that scrolls. */ overflow: hidden; resize: none; white-space: pre-wrap; overflow-wrap: anywhere; }\n\n.cg-model-alias-input:focus { outline: none; }\n\n.cg-model-alias-input::placeholder { color: var(--cg-muted); }\n\n/* The two glyphs are the same weight and the same tone: a bright tick next to a dim cross read as\n\n   two different kinds of control, which is what made the pair look foreign in a list of names. */\n\n.cg-model-alias-save, .cg-model-alias-cancel { display: flex; flex: none; width: 20px; height: 20px; margin-top: 1px; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--cg-muted); opacity: .75; cursor: pointer; }\n\n.cg-model-alias-save:hover, .cg-model-alias-cancel:hover { color: var(--cg-text); opacity: 1; }\n\n/* The bolt and the reset are absolute in this row, but the summary is centred between them. At the\n   summary's 190px max it starts 20px from the content edge, which is 6px under the bolt's 26px box,\n   and the model name then starts 2px from the bolt — inside its 5px glow. The side padding reserves\n   the bolt's lane so the name never reaches it, while the summary stays centred. */\n\n.cg-model-top { position: relative; display: flex; justify-content: center; align-items: center; min-height: 20px; padding: 0 28px; color: var(--cg-effort-color); }\n\n/* Reaching Ultra stands the three controls down for a moment and puts the cost notice in\n\n   their row — the same exchange the original client makes. They fade rather than unmount so\n\n   the popover keeps its height and nothing jumps when the notice arrives or leaves. */\n\n.cg-model-ultra-notice {\n\n  position: absolute; inset: 0; display: grid; place-items: center;\n\n  color: #a273f2; font-size: 12px; letter-spacing: .2px; white-space: nowrap;\n\n  opacity: 0; visibility: hidden; pointer-events: none;\n\n  transition: opacity 180ms ease, visibility 0s linear 180ms;\n\n}\n\n.cg-model-popover[data-notice=\"true\"] .cg-model-ultra-notice {\n\n  opacity: 1; visibility: visible;\n\n  transition: opacity 180ms ease, visibility 0s linear 0s;\n\n}\n\n.cg-model-popover[data-notice=\"true\"] .cg-model-zap,\n\n.cg-model-popover[data-notice=\"true\"] .cg-model-summary,\n\n.cg-model-popover[data-notice=\"true\"] .cg-model-reset {\n\n  opacity: 0; visibility: hidden;\n\n  transition: opacity 180ms ease, visibility 0s linear 180ms;\n\n}\n\n.cg-model-popover .cg-model-zap,\n\n.cg-model-popover .cg-model-summary,\n\n.cg-model-popover .cg-model-reset { transition: opacity 180ms ease, visibility 0s linear 0s; }\n\nbody[data-ds-dark-theme] .cg-model-ultra-notice { color: #c9aaff; }\n\n.cg-model-top strong { font-size: 14px; font-weight: 600; }\n\n.cg-model-zap { position: absolute; left: 0; top: 1px; width: 16px; height: 16px; color: var(--cg-effort-color); }\n\n.cg-model-reset { position: absolute; right: -2px; top: -2px; display: grid; place-items: center; width: 24px; height: 24px; padding: 4px; border: 0; border-radius: 50%; background: transparent; color: var(--cg-muted); cursor: pointer; }\n\n.cg-model-reset:hover { background: var(--cg-hover); }\n\n.cg-model-reset svg { width: 16px; height: 16px; }\n\n.cg-model-choice { display: flex; justify-content: center; align-items: center; gap: 2px; width: 100%; height: 20px; padding: 0; margin: 0 0 10px; border: 0; background: none; color: var(--cg-muted); font-size: 12px; cursor: pointer; }\n\n.cg-model-choice svg { width: 11px; height: 11px; }\n\n.cg-model-slider-shell { position: relative; height: 28px; margin: 0; border-radius: 20px; background: #e8e6e8; box-shadow: inset 0 0 0 1px #00000004; }\n\n/* The pill is deliberately thinner than the shell: the knob (24px) has to overhang it, or a circle and a\n\n   24px track of the same height read as one flush shape rather than a circle on a track. */\n\n.cg-model-slider-fill { position: absolute; left: 0; top: 4px; height: 20px; border-radius: 10px; pointer-events: none; background: var(--cg-effort-color); }\n\n.cg-model-popover[data-ultra=\"true\"] .cg-model-slider-fill { background: linear-gradient(95deg,#5055f5,#bb74ff); }\n\n.cg-model-slider-dots { position: absolute; inset: 0 12px; display: flex; justify-content: space-between; align-items: center; pointer-events: none; z-index: 2; }\n\n.cg-model-slider-dots span { width: 4px; height: 4px; border-radius: 50%; background: #b7b4b7; }\n\n/* The input is the drag surface and keeps the keyboard behaviour, but it is not the *painted* control:\n\n   the plugin draws the track, the fill, the tier dots and the round knob itself.\n\n   `opacity: 0` rather than styling the thumb pseudo-element, because that is the only way that does not\n\n   depend on the browser honouring `appearance: none` on `::-webkit-slider-thumb`. In the owner's build\n\n   it did not: the native widget kept painting a white rounded square at the value position while\n\n   ignoring `background: transparent` on that pseudo-element. Opacity affects the whole native widget,\n\n   whatever it decides to draw, and it does not affect hit testing — the slider still drags and still\n\n   takes arrow keys. Every white box this plugin owns is circular by construction (`.cg-model-thumb` is\n\n   24x24 with `border-radius: 50%`), so the square was never ours to round.\n\n   The focus ring moves to the shell, since an invisible input cannot show one. */\n\n.cg-model-slider { appearance: none; -webkit-appearance: none; box-sizing: border-box; position: relative; width: 100%; height: 28px; margin: 0; background: transparent; cursor: pointer; display: block; border: 0; padding: 0; opacity: 0; }\n\n.cg-model-slider-shell:has(.cg-model-slider:focus-visible) { outline: 2px solid #3982fa; outline-offset: 4px; }\n\n/* The plugin draws its own knob (`.cg-model-thumb`), so the input's own thumb is made *invisible*\n\n   rather than styled. Reason, observed: with `appearance: none` only declared unprefixed, some WebKit\n\n   builds never apply it to the `::-webkit-slider-thumb` pseudo-element, and the native control kept\n\n   painting a small white rounded square on top of our round knob — the \"white square\" the owner asked\n\n   about. `border-radius` could never have fixed that, because the square was not our element. The\n\n   knob itself is still rendered whenever the slider is, so nothing becomes invisible by accident. */\n\n.cg-model-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border: 0; border-radius: 50%; background: transparent; box-shadow: none; }\n\n.cg-model-slider::-moz-range-thumb { width: 24px; height: 24px; border: 0; border-radius: 50%; background: transparent; box-shadow: none; }\n\n.cg-model-slider:disabled { cursor: default; opacity: .6; }\n\n.cg-model-catalog { display: flex; flex-direction: column; max-height: 260px; overflow: auto; gap: 3px; padding: 2px 0 0; }\n\n.cg-model-provider { color: var(--cg-muted); font-size: 11px; padding: 6px 4px; }\n\n.cg-model-option { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 8px 7px; border: 0; border-radius: 8px; background: none; color: var(--cg-text); font-size: 12px; text-align: left; cursor: pointer; }\n\n.cg-model-option:hover,.cg-model-option:focus-visible { background: var(--cg-hover); }\n\n.cg-model-option svg { width: 14px; height: 14px; flex: none; }\n\n.cg-model-error { font-size: 11px; color: #c54545; line-height: 16px; margin: 8px 0 0; }\n\n.cg-model-message { font-size: 12px; color: var(--cg-muted); text-align: center; margin: 8px 0; }\n\nbody[data-ds-dark-theme] .cg-model-popover { border-color: #444; }\n\nbody[data-ds-dark-theme] .cg-model-slider-shell { background: #494649; }\n\n.cg-model-search { box-sizing: border-box; width: 100%; font-size: 12px; padding: 8px; margin: 4px 0; color: var(--cg-text); background: var(--cg-page); border: 1px solid #ddd; border-radius: 8px; }\n\n.cg-model-top { min-height: 40px; margin-bottom: 10px; }\n\n.cg-model-summary { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; min-width: 102px; max-width: 190px; height: 40px; padding: 3px 8px; border: 0; border-radius: 7px; background: transparent; color: var(--cg-effort-color); cursor: pointer; }\n\n.cg-model-summary:hover,.cg-model-summary:focus-visible { background: #f1f1f3; }\n\n.cg-model-summary-name { display: flex; align-items: center; justify-content: center; max-width: 100%; color: #6b6b6b; font-size: 12px; line-height: 16px; white-space: nowrap; }\n\n.cg-model-summary-name svg { width: 11px; height: 11px; flex: none; }\n\n.cg-model-reset { border-radius: 7px; }\n\n.cg-model-reset:hover,.cg-model-reset:focus-visible { background: var(--cg-hover); }\n\n.cg-model-tooltip { display: none; position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); padding: 7px 12px; border-radius: 13px; background: #f2f4f7; color: #33353b; font-size: 12px; line-height: 16px; white-space: nowrap; box-shadow: 0 5px 14px #0002; pointer-events: none; }\n\n.cg-model-reset:hover .cg-model-tooltip,.cg-model-reset:focus-visible .cg-model-tooltip { display: block; }\n\nbody[data-ds-dark-theme] .cg-model-summary:hover,body[data-ds-dark-theme] .cg-model-summary:focus-visible,body[data-ds-dark-theme] .cg-model-reset:hover,body[data-ds-dark-theme] .cg-model-reset:focus-visible { background: #404043; }\n\n.cg-model-root:has(.cg-model-popover) { z-index: 100; }\n\n.cg-model-popover { padding-bottom: 16px; background-color: var(--cg-page); isolation: isolate; }\n\n.cg-model-reset { box-sizing: border-box; padding: 4px; }\n\n.cg-model-reset svg { display: block; flex: none; width: 16px; height: 16px; overflow: visible; }\n\n.cg-model-slider-shell { margin-bottom: 2px; }\n\n/* The knob is positioned with `translate: calc((100cqw - 24px) * ratio)`, so this element has to be the\n\n   container those `cqw` units resolve against. Without `container-type` the unit falls back to the\n\n   *viewport* width: the knob then travels one screen-width to the right and leaves the popover entirely —\n\n   the \"圆点飞到哪里去了\" report. `inline-size` (not `size`) because only the width is queried, and a\n\n   `size` container would have to be given an explicit block size here. */\n\n.cg-model-slider-shell { container-type: inline-size; }\n\n/* Neutralize native/global range tracks; the shell draws the sole visible track. */\n\n.cg-model-slider::-webkit-slider-runnable-track { appearance: none; height: 28px; border: 0; border-radius: 20px; background: transparent !important; box-shadow: none !important; }\n\n.cg-model-slider::-webkit-slider-thumb { margin-top: -2px; }\n\n.cg-model-slider::-moz-range-track { height: 28px; border: 0; background: transparent !important; box-shadow: none !important; }\n\n.cg-model-slider::-moz-range-progress { background: transparent !important; border: 0; box-shadow: none !important; }\n\n.cg-model-slider { background: transparent !important; box-shadow: none !important; outline: none; }\n\n/* First pass: both visible track ends stop at the thumb center, including minimum (`inset: 0 14px`,\n\n   fill `left: 14px`). The full-width override further down replaces both declarations, so the track\n\n   that actually paints runs edge to edge. */\n\n.cg-model-slider-shell { background: transparent !important; box-shadow: none; }\n\n.cg-model-slider-shell::before { content: ''; position: absolute; inset: 0 14px; border-radius: 20px; background: #e8e6e8; }\n\n.cg-model-slider-fill { left: 14px; }\n\nbody[data-ds-dark-theme] .cg-model-slider-shell::before { background: #494649; }\n\n/* Full-width track and an independent thumb with two-pixel end overlap. */\n\n.cg-model-slider-shell::before { inset: 4px 0; }\n\n.cg-model-slider-fill { left: 0; }\n\n/* The knob, taken from the reference plugin the owner pointed at (lemonorangeapple/dsh-effort-switcher):\n\n   24px over a thinner track so it overhangs ✓ `corner-shape: round` for a true circle ✓ a centred box\n\n   offset (`margin-left`) instead of `translateX(-50%)` — a percentage plus a half-transform lands the edges\n\n   on fractional device pixels at this display's 1.25 ratio — and no border and no shadow at all. */\n\n.cg-model-thumb { position: absolute; top: 2px; margin-left: -12px; box-sizing: border-box; width: 24px; height: 24px; border: 0; border-radius: 50%; corner-shape: round; background: #fff; box-shadow: none; pointer-events: none; z-index: 3; }\n\n/* The knob grows only while the pointer is over it, and never larger than this.\n\n   It carries `pointer-events: none`, so the \"over\" state is decided geometrically in the component (the\n\n   knob cannot be hit-tested without swallowing the press that the native range needs to start a drag).\n\n   There used to be a second, larger step while the track was `:active` — that is the step the owner saw as\n\n   the knob growing and being cut off when they dragged it to either end, so it is gone: dragging keeps the\n\n   same 1.08 as hovering, and the ends look like a click-selected tier. */\n\n.cg-model-thumb { transform-origin: 50% 50%; }\n\n.cg-model-thumb[data-over=\"true\"] { transform: scale(1.08); }\n\n/* While the pointer is pressed the knob goes back to its resting size. Hovering and dragging are the same\n\n   pointer-on-knob situation, so without this the drag inherits the hover growth: at either end of the travel\n\n   (centre 12px from the edge) a 1.08 knob overhangs the track by about a pixel, and that is the \"it grows\n\n   and sticks to the edge when I drag it\" the owner photographed. Dragging now looks exactly like a tier\n\n   that was selected by a click. */\n\n.cg-model-slider-shell:active .cg-model-thumb { transform: none; }\n\n.cg-model-slider::-webkit-slider-thumb { background: transparent; border-color: transparent; box-shadow: none; }\n\n.cg-model-slider::-moz-range-thumb { background: transparent; border-color: transparent; box-shadow: none; }\n\n/* Reference: pill track and a clean maximum-effort gradient. */\n\n.cg-model-slider-shell { border-radius: 14px; }\n\n.cg-model-slider-shell::before, .cg-model-slider-fill { border-radius: 10px; }\n\n.cg-model-slider-shell[data-max=\"true\"] .cg-model-slider-dots { visibility: hidden; }\n\n/* The reference knob is a plain white circle: no outline, just a soft shadow. The plugin already drew a\n\n   circle, but with a 1px grey border that read as a framed square at this size. */\n\n.cg-model-thumb { border: 0; border-radius: 50%; box-shadow: 0 1px 3px #00000026; }\n\n.cg-model-popover[data-ultra=\"true\"] .cg-model-slider-fill { background: linear-gradient(95deg, #5055f5 0%, #bb74ff 58%, #793af5 100%); }\n\n/* Depth ramp. The fill deepens with the tier instead of only changing at Ultra: six stops\n\n   are shared by every model, so three-tier and five-tier effort lists both move\n\n   monotonically, and the top tier — Max — runs into purple. The shower is no longer an Ultra\n\n   privilege: it runs at every tier, clipped to the fill (see the meteor section further down).\n\n   Low starts on a clean light blue: mixing the grey Off stop into it reads as dirty, and\n\n   nothing here lowers opacity — every stop is an opaque colour.\n\n   Declared on the popover, not on `.cg-model-slider-shell` where these are consumed. A custom\n\n   property is inherited downwards only: the popover is the shell's *ancestor*, so a stop declared\n\n   on the shell was invisible to `--cg-glow: var(--cg-e2)` on the popover, and that made the whole\n\n   non-superfast glow invalid. The shell inherits these values unchanged. */\n\n.cg-model-popover {\n\n  --cg-e1: #b3cdff; /* Low: a real blue — a paler tone sat at the track's own lightness\n\n                       and read as grey-blue mud */\n\n  --cg-e2: #86acff;\n\n  --cg-e3: #6488f5; /* Medium */\n\n  --cg-e4: #4a63d8; /* High */\n\n  --cg-e5: #8a4ff0; /* Max -> purple */\n\n}\n\nbody[data-ds-dark-theme] .cg-model-popover {\n\n  --cg-e1: #7fa3f5;\n\n  --cg-e2: #6b91ee;\n\n  --cg-e3: #5b80ea;\n\n  --cg-e4: #4f6ae0;\n\n  --cg-e5: #9a5cf5;\n\n}\n\n/* An unknown level id falls back to its bucketed position ... */\n\n.cg-model-slider-shell[data-depth=\"0\"] .cg-model-slider-fill { background: transparent; }\n\n.cg-model-slider-shell[data-depth=\"1\"] .cg-model-slider-fill { background: var(--cg-e1); }\n\n.cg-model-slider-shell[data-depth=\"2\"] .cg-model-slider-fill { background: var(--cg-e2); }\n\n.cg-model-slider-shell[data-depth=\"3\"] .cg-model-slider-fill { background: var(--cg-e3); }\n\n.cg-model-slider-shell[data-depth=\"4\"] .cg-model-slider-fill { background: var(--cg-e4); }\n\n/* ... while an id the ramp knows wins, because it is the tier the model itself names.\n\n   Off fills nothing: a grey stub against a grey track only looked like a stray artefact. */\n\n.cg-model-slider-shell[data-effort=\"off\"] .cg-model-slider-fill { background: transparent; }\n\n.cg-model-slider-shell[data-effort=\"none\"] .cg-model-slider-fill { background: transparent; }\n\n.cg-model-slider-shell[data-effort=\"minimal\"] .cg-model-slider-fill { background: linear-gradient(90deg, var(--cg-e1), var(--cg-e2)); }\n\n.cg-model-slider-shell[data-effort=\"low\"] .cg-model-slider-fill { background: linear-gradient(90deg, var(--cg-e1), var(--cg-e2)); }\n\n.cg-model-slider-shell[data-effort=\"medium\"] .cg-model-slider-fill { background: linear-gradient(90deg, var(--cg-e2), var(--cg-e3)); }\n\n.cg-model-slider-shell[data-effort=\"high\"] .cg-model-slider-fill { background: linear-gradient(90deg, var(--cg-e3), var(--cg-e4)); }\n\n.cg-model-slider-shell[data-effort=\"xhigh\"] .cg-model-slider-fill,\n\n.cg-model-slider-shell[data-effort=\"max\"] .cg-model-slider-fill { background: linear-gradient(90deg, var(--cg-e4), var(--cg-e5)); }\n\n/* Ultra must be declared here, after the depth buckets: the top position is depth 4, so a\n\n   bucket rule placed later silently outranks the gradient and leaves the whole bar blue —\n\n   which is exactly how the purple went missing.\n\n   Shape: a short blue lead-in and a bright purple right end stay put, while a soft deep\n\n   purple shade drifts slowly across the purple middle.\n\n   The shade is its own element rather than a sized background layer: a layer narrower than\n\n   the bar ends mid-falloff, and that cut-off painted a visible seam down each side. As an\n\n   element whose radial radii are exactly half its box, the falloff reaches zero before any\n\n   edge, and only the transform moves. */\n\n.cg-model-slider-shell[data-effort=\"ultra\"] .cg-model-slider-fill {\n\n  background: linear-gradient(90deg, #3f57c4 0%, #6f5ff2 12%, #8a4ff0 42%, #a855f7 74%, #bb74ff 100%);\n\n}\n\n.cg-model-slider-shell[data-effort=\"ultra\"] .cg-model-slider-fill::after {\n\n  content: '';\n\n  position: absolute;\n\n  top: -70%; bottom: -70%; left: 0; width: 62%;\n\n  z-index: 0;\n\n  pointer-events: none;\n\n  background: radial-gradient(ellipse 50% 50% at 50% 50%, #4c1d95e6 0%, #4c1d9545 45%, #4c1d9500 100%);\n\n  animation: cg-model-ultra-drift 12s ease-in-out infinite alternate;\n\n}\n\n/* Max reads purple at the rim. The rim keys on the tier, not on the top position: when a\n\n   virtual Ultra step was still appended, Max was the last real tier and was deliberately not\n\n   the maximum position. The shower no longer tells the two apart — it runs at every tier. */\n\n.cg-model-slider-shell[data-effort=\"xhigh\"]:not([data-ultra=\"true\"])::before,\n\n.cg-model-slider-shell[data-effort=\"max\"]:not([data-ultra=\"true\"])::before { box-shadow: inset 0 0 0 1px #8a4ff04d; }\n\n/* Deliberately ungated and deliberately not theme-varied: this dot marks a position the fill has\n\n   not reached on a plain rail, so it is the same neutral in both themes — giving it a dark-mode\n\n   value would make it read as a marker that carries meaning. Both properties are stated so the\n\n   purple ultra glow from the `[data-ultra=\"true\"]` rule cannot leak in while the shell's ultra\n\n   state is off. */\n\n.cg-model-slider-shell:not([data-ultra=\"true\"]) .cg-model-slider-dots span[data-ultra=\"true\"] { background: #b7b4b7; box-shadow: none; }\n\n/* The shower used to be the Ultra tier's tell: the shell hid it whenever `[data-ultra=\"true\"]` was\n   absent. The panel no longer has an Ultra tier at all (the top position is the model's own highest\n   real level), and the owner asked for the flow at every tier — so the layer is always on where the\n   track has a fill, and the tier keeps expressing itself through the fill colour, exactly as before. */\n.cg-model-meteors { display: block; }\n\n/* Nothing to animate when the position is unknown: the track draws no fill and lights no dot there,\n   so a moving highlight would be the only thing claiming a tier the panel does not know. That stop is\n   not stated here: 超快 re-asserts `display: block` on this layer further down with a deeper selector,\n   so it is folded into the hard off/none/unknown rule next to the sheen, where it can win. */\n\n/* The dots carry the fill, not a fixed grey: a dot the fill has reached turns white with a\n\n   dark hairline so it stays legible on the pale Low blue as well as on the deep tiers, and\n\n   a dot still ahead stays the track marker. */\n\n.cg-model-slider-dots span[data-on=\"true\"] { background: #fff; box-shadow: 0 0 0 1px #0000002e; }\n\nbody[data-ds-dark-theme] .cg-model-slider-dots span { background: #8b8992; }\n\nbody[data-ds-dark-theme] .cg-model-slider-dots span[data-on=\"true\"] { background: #fff; box-shadow: 0 0 0 1px #00000052; }\n\n/* The knob travels by `translate`, so that is what animates. This used to name `left`, which the component\n\n   no longer writes — the transition therefore matched nothing and the knob jumped between tiers instead of\n\n   sliding. */\n\n.cg-model-thumb { transition: translate 100ms ease-out, transform 150ms cubic-bezier(.22,.8,.28,1); }\n\n/* The transient Ultra cost notice is longer than any tier name, so it gets its own fit\n\n   instead of stretching the summary pill. */\n\n.cg-model-summary strong[data-notice=\"true\"], .cg-model-trigger-effort[data-notice=\"true\"] { font-size: 11px; letter-spacing: .2px; white-space: nowrap; }\n\n.cg-model-slider-fill { transition: width 100ms ease-out; }\n\n.cg-model-popover { animation: cg-model-enter 120ms ease-out; transform-origin: bottom right; }\n\n/* Model catalog follows the reference's compact menu spacing. */\n\n.cg-model-popover[data-pane=\"model\"] { padding: 4px; border-radius: 16px; box-shadow: 0 6px 14px #0000000c; }\n\n.cg-model-catalog-title { margin: 4px 8px 8px; color: var(--cg-muted); font-size: 12px; line-height: 20px; }\n\n.cg-model-catalog-default { padding: 0 8px; color: var(--cg-text); font-size: 12px; line-height: 18px; }\n\n.cg-model-popover[data-pane=\"model\"] .cg-model-catalog { max-height: min(440px, 72vh); gap: 0; padding: 0; }\n\n.cg-model-popover[data-pane=\"model\"] .cg-model-provider { padding: 0 8px 3px; font-size: 12px; line-height: 18px; }\n\n.cg-model-popover[data-pane=\"model\"] .cg-model-option { box-sizing: border-box; min-height: 29px; padding: 4px 8px; line-height: 21px; border-radius: 10px; }\n\n.cg-model-popover[data-pane=\"model\"] .cg-model-option[aria-checked=\"true\"] { background: #f1f1f1; color: var(--cg-text); }\n\n.cg-model-popover[data-pane=\"model\"] .cg-model-option:hover { background: var(--cg-hover); }\n\n.cg-model-trigger { padding: 0 9px; border-radius: 999px; }\n\n.cg-model-trigger[aria-expanded=\"true\"] { background: #f1f1f1; }\n\nbody[data-ds-dark-theme] .cg-model-option[aria-checked=\"true\"],\n\nbody[data-ds-dark-theme] .cg-model-trigger[aria-expanded=\"true\"] { background: #404043; }\n\n/* Lightning orchestrator switch: a real button. Armed, the glyph paints itself with the\n\n   shared deep purple gradient and carries its sparkles, so no colour override is needed. */\n\n.cg-model-zap {\n\n  box-sizing: border-box; display: grid; place-items: center; width: 26px; height: 26px;\n\n  padding: 3px; border: 0; border-radius: 8px; background: transparent;\n\n  color: #b9b8bb; cursor: pointer; transition: color 140ms ease, background 140ms ease;\n\n}\n\n.cg-model-zap:hover:not(:disabled) { background: #f1f1f3; color: #6f6f73; }\n\n.cg-model-zap:focus-visible { outline: 2px solid #3982fa; outline-offset: 1px; }\n\n.cg-model-zap:disabled { cursor: default; opacity: .45; }\n\n.cg-model-zap-glyph { flex: none; transition: filter 160ms ease; }\n\n.cg-model-zap[data-on=\"true\"] { color: #8a4ff0; }\n\n.cg-model-zap[data-on=\"true\"] .cg-model-zap-glyph { filter: drop-shadow(0 0 5px #8a4ff08c); }\n\n.cg-model-zap[data-on=\"true\"]:hover { background: #f3ebff; }\n\n/* Tree keeps the old superfast gold, but keyed on the button's own `data-mode`. The original plugin\n   gated the gold on `[data-superfast=\"true\"]` on the root; the panel no longer writes that flag on\n   purpose (the rail's colours stay put), so the root-keyed rules never fire. Keying on the button\n   makes the colour describe the button's own state instead of a panel-wide mode. */\n\n.cg-model-zap[data-on=\"true\"][data-mode=\"tree\"] { color: #e8a317; }\n\n.cg-model-zap[data-on=\"true\"][data-mode=\"tree\"] .cg-model-zap-glyph { filter: drop-shadow(0 0 5px #f7c9488c); }\n\n.cg-model-zap[data-on=\"true\"][data-mode=\"tree\"]:hover { background: #fdf3dc; }\n\nbody[data-ds-dark-theme] .cg-model-zap[data-on=\"true\"][data-mode=\"tree\"] { color: #f0b429; }\n\nbody[data-ds-dark-theme] .cg-model-zap[data-on=\"true\"][data-mode=\"tree\"]:hover { background: #3a2f14; }\n\n/* The sparkles breathe out of phase; they are stars around the bolt, not a streak. */\n\n.cg-bolt-star { transform-box: fill-box; transform-origin: center; animation: cg-bolt-twinkle 2.2s ease-in-out infinite; }\n\nbody[data-ds-dark-theme] .cg-model-zap:hover:not(:disabled) { background: #404043; color: #d6d6d8; }\n\nbody[data-ds-dark-theme] .cg-model-zap[data-on=\"true\"] { color: #bb8dff; }\n\nbody[data-ds-dark-theme] .cg-model-zap[data-on=\"true\"]:hover { background: #362a4d; }\n\nbody[data-ds-dark-theme] .cg-model-zap[data-on=\"true\"]:hover { background: #2c3852; }\n\n/* No gear reading means no mode: the button carries `data-mode=\"unknown\"` and `data-on=\"false\"`.\n   It has to read as present but not armed, so it stays dim and neutral in both themes. The hover\n   restates the plain grey tint on purpose — nothing here may borrow the armed purple. These rules\n   sit after every armed-state rule so a stale `data-on` cannot win the tie and tint it. */\n\n.cg-model-zap[data-mode=\"unknown\"] { opacity: .55; color: #b9b8bb; }\n\n.cg-model-zap[data-mode=\"unknown\"]:hover:not(:disabled) { background: #f1f1f3; color: #6f6f73; }\n\nbody[data-ds-dark-theme] .cg-model-zap[data-mode=\"unknown\"] { color: #b9b8bb; }\n\nbody[data-ds-dark-theme] .cg-model-zap[data-mode=\"unknown\"]:hover:not(:disabled) { background: #404043; color: #d6d6d8; }\n\n/* Armed-state marker in the collapsed trigger, so the mode is visible with the\n\n   popover closed. */\n\n.cg-model-trigger-bolt { display: inline-flex; align-items: center; flex: none; color: #6f5bc4; }\n\n.cg-model-trigger-bolt svg { width: 14px; height: 14px; color: currentColor; }\n\nbody[data-ds-dark-theme] .cg-model-trigger-bolt { color: #bb8dff; }\n\n/* The meteor shower. Each meteor is a gradient streak with a bright leading point; the eleven of\n\n   them run on negative delays, so the field is full from the first painted frame instead of filling\n\n   in over two seconds. It used to be Ultra-only; it now runs at every tier, but only inside the part\n\n   of the rail the fill has reached — the layer is a band `--cg-fill-width` wide, so the streaks stop\n\n   at the knob instead of crossing the whole track. `--cg-meteor-travel` is the pixel distance they\n\n   translate across; the component writes it, and this value is only the fallback for the frames\n\n   before that measurement lands. It is a pixel distance on purpose: `translateX` resolves a\n\n   percentage against the meteor's own width (14-42px), so `calc(100% + 36px)` here let every streak\n\n   die less than a third of the way along the rail. A sheen sweeps the same band at every tier, and\n\n   the whole shower collapses to a static sheen under reduced motion. */\n\n/* No `overflow: hidden` on the shell any more. It used to clip the meteors, but it also clipped the knob:\n\n   while dragging, the knob grows to 1.08× and at either end of the travel it stuck out past the shell and\n\n   was sliced — which is what the owner sees as \"pulling it to the end does not line up\". The clip now lives\n\n   on the meteor layer alone (`.cg-model-meteors`), which is what the reference plugin does: its groove\n\n   clips, its knob is a sibling and may overhang. */\n\n.cg-model-slider-shell { --cg-meteor-travel: 420px; }\n\n/* One extra px of room each side, not four: the halo below is painted inside this box, so whatever\n\n   the box refuses to show is what gets clipped. At `inset: 4px` the visible height was 20px against\n\n   streaks sitting at y=3…18, which left no streak enough clearance for a 7px halo — it was painted\n\n   and then cut off. This buys 26px without letting the streaks touch the shell edge. */\n\n/* The band. `--cg-fill-width` is the fill's own inline width — `calc(24px + (100% - 24px) * ratio)`,\n\n   or `0px` when the position is unknown — so the layer starts at the track's left edge and ends at\n\n   the knob's right edge. The cut is therefore under the 24px thumb and never reads as a wall: the\n\n   knob is the only thing that has to cover it. `left`/`right` are stated individually rather than as\n\n   an `inset` shorthand because the band is one-sided; `top`/`bottom` stay at 1px for the halo\n\n   clearance measured above. Off / none / unknown paint no fill, and hide this layer outright next\n\n   to the sheen. The `var()` fallback is `0px` on purpose: a shell that has not been measured yet\n\n   shows an empty band, never a full-track shower. `container-type` also lives here rather than on\n\n   the shell: this element's inline size *is* the band width, so the density queries below track the\n\n   fill, not the track. */\n\n.cg-model-meteors { position: absolute; left: 0; right: auto; top: 1px; bottom: 1px; width: var(--cg-fill-width, 0px); overflow: hidden; z-index: 1; border-radius: inherit; pointer-events: none; container-type: inline-size; container-name: cg-meteor-band; }\n\n/* A screen blend used to sit on this container, and it is gone on purpose. It bought +20% to +35%\n\n   relative luminance across the tail — genuinely the cheapest brightness per *painted* pixel — but it\n\n   was not cheap per *frame*: a blended element cannot be composited on its own, it has to be recomposited\n\n   against its backdrop every time either side changes, and this layer's own content changes on every\n\n   frame because eleven streaks translate across it. The cost therefore scaled with frames, not with\n\n   paint: the layer fell off the GPU fast path and every streak's transform dragged a full re-blend of\n\n   the 26px band behind it. The brightness is bought back in the places that cost nothing per frame —\n\n   the tail's own gradient alphas below and the halo's alpha in `.cg-model-meteor` — because a static\n\n   gradient is rasterised once and then only translated. Dark theme lost the most, so the compensation\n\n   lives on the dark branch and the light branch keeps its own saturated values. */\n\n.cg-model-meteor {\n\n  position: absolute; top: var(--cg-meteor-y); left: 0; display: block;\n\n  width: var(--cg-meteor-len); height: var(--cg-meteor-thick);\n\n  transform-origin: left center;\n\n  /* This box paints nothing, and it carries no clip. The streak and the taper live one box down, on\n\n     `::before`, for one measured reason: `clip-path` clips the element *and its pseudo-elements* and\n\n     the filter result with them (Masking 1 §2 — filter, then clip, then mask, then opacity). With the\n\n     clip on this box the drop-shadows were painted from the pill and then thrown away: sampled in\n\n     Chrome, every halo pixel outside the box measured 0, and only 1.5% of the shadow pixels survived,\n\n     all of them inside the box. That is the \"怎么不发光了\": the streak lost its light, not its motion.\n\n     The tail keeps its own colour ramp — only the leading point was ever recoloured, because a\n\n     purple head on a warm tail reads as a stray dot rather than the tip of the streak. The head\n\n     below is a soft translucent white instead of an opaque one, so it sits inside the tail's\n\n     brightest stop rather than stamping a hard dot onto it.\n\n     White, and now actually white. The streak's `::before` paints two background layers — a white ramp\n\n     over a tier-coloured one — and the colour layer used to sit at 34/62/74%, which read as a purple\n\n     (Ultra) or gold (超快) bar with white laid on top, not as the white blocks the owner asked for. It\n\n     sits at 10–18% now: a trace of air in the tail, not a tint. Nothing about the glow is lost, because\n\n     the glow never came from that layer — it is the drop-shadow on `.cg-model-meteor` and the head below.\n\n     The reference version the owner remembers is a field of small white light blocks crossing the rail —\n\n     short, bright — and a long ramp of purple-to-gold reads as tape next to it. The mode colour lives in\n\n     the head, which is where it belongs: the streak is light, the tip is the tier. */\n\n  background: none;\n\n  /* One halo, painted from `::before`'s *clipped* silhouette, so it follows the taper and fades with\n\n     the tail instead of ringing a rectangle — the same shape the old bloom band had, which is why the\n\n     band could go. It used to be two stacked drop-shadows (a 3px white one under a 5px mode-coloured\n\n     one); that pair is the expensive half of this element, because the head below pulses inside this\n\n     filter, so the filter re-runs whenever the head does, and eleven streaks then cost twenty-two blur\n\n     rasterisations per frame. One pass at the intermediate radius costs eleven and reads the same at 3px\n\n     thickness. The colour is the old pair collapsed into one: mostly white with the tier colour mixed\n\n     in, at an alpha a little above the 0.685 the two translucent layers stacked to — that is the\n\n     compensation for the screen blend this layer no longer gets, see the note above this block.\n\n     Radius stays small on purpose: the layer is only 26px tall and its overflow clips whatever a bigger\n\n     blur spreads past it, so a wide radius would be painted and then thrown away. */\n\n  filter: drop-shadow(0 0 4px color-mix(in srgb, var(--cg-glow, #ffffff) 38%, #ffffffa6));\n\n  opacity: 0; animation: cg-model-meteor var(--cg-meteor-dur) linear var(--cg-meteor-delay) infinite; animation-duration: calc(var(--cg-meteor-dur) * 1);\n\n}\n\n/* The leading point: brighter, round, and slightly ahead of the tail. Its full rule — geometry,\n\n   colour and the four-shadow halo — is stated once below, after the streak it sits on. */\n\n\n\n/* ── The streak, and the bloom it now carries inside itself ────────────────────────────────────\n\n   The streak is a white bar: full thickness at the leading (right) end, about two thirds of it at\n\n   the tail. Tapered, not a cylinder — a true point would read as a comet rather than the short bar\n\n   of light this is meant to be, so the tail only thins; reading right-to-left, the streak narrows a\n\n   little the further you get from the tip. Done with clip-path rather than a height change because\n\n   the height comes from a data variable.\n\n   The clip lives here and nowhere else. This box *is* the shape, so clipping it costs nothing else:\n\n   the element above stays unclipped and can still paint the halo, which is the arrangement that was\n\n   missing before. Everything this box draws is inside the trapezoid, so the bloom that used to be a\n\n   band 2px/6px outside the box is now the second background layer, under the bar — it colours the\n\n   thin tail instead of haloing it, and the halo itself is the element's drop-shadow. */\n\n.cg-model-meteor::before {\n\n  content: ''; position: absolute; inset: 0; border-radius: 999px;\n\n  clip-path: polygon(0% 17%, 100% 0%, 100% 100%, 0% 83%);\n\n  /* Two layers, and the second one is a trace rather than a tint. The owner's picture is a field of\n\n     white light blocks, so the streak's body has to read as white; the tier colour belongs to the head\n\n     below and to the drop-shadow on `.cg-model-meteor`, which is where the glow actually comes from.\n\n     The colour layer stays at 10–18% for the faint air it gives the tail and nothing more. At the\n\n     34/62/74% it used to carry, the streak read as a purple (Ultra) or gold (超快) bar with white laid\n\n     over it — never the white the request asked for. Dark branch only: the light branch restates this\n\n     whole list below with its own values. */\n\n  background-image:\n\n    linear-gradient(90deg, #ffffff00, #ffffff8f 20%, #fffffff0 70%, #ffffff),\n\n    linear-gradient(90deg,\n\n      #ffffff00 0%,\n\n      color-mix(in srgb, var(--cg-glow, #c9b4f0) 10%, transparent) 38%,\n\n      color-mix(in srgb, var(--cg-glow, #c9b4f0) 14%, transparent) 78%,\n\n      color-mix(in srgb, var(--cg-glow, #c9b4f0) 18%, transparent) 100%);\n\n}\n\n/* Head: a flare plus a slow breath. The point stays 2px on purpose — at that size a 2px offset inside a\n\n   3px blur overlaps into one soft cross, which is the look a star wants; a conic gradient would need a\n\n   bigger box, and enlarging the box is what turns a tip into a shape.\n\n   Four layers, not six. The two that went are the vertical arms at 38% — the weakest pair, and the shaft\n\n   they would add is the direction the streak already travels in, so on a 2px dot they were doing the least\n\n   work of anything here while still costing two more blurred shadows per head. The 58% ring came up to 62%\n\n   to hold the head's overall light after the layer blend was removed. Everything rides --cg-glow, so 超快\n\n   keeps its gold head and the Ultra tiers their purple with no second rule. */\n\n/* The head, in full and in one place. It used to be split across two blocks — geometry and a\n\n   single-shadow halo up in the streak section, then four shadows down here — and the second block's\n\n   box-shadow silently replaced the first one's, leaving a dead declaration behind. Merged.\n\n   The head wears the mode's own colour: --cg-glow is the tier glow this panel already breathes in,\n\n   #f7c948 gold under superfast and #bb74ff purple at the top non-superfast stop. Mixed toward white so\n\n   it stays a soft tip instead of a saturated dot; the plain declaration in front is the fallback for a\n\n   browser without color-mix, matching how the popover halo degrades. Every var() carries #ffffffb3 as\n\n   its fallback because this rule also runs where --cg-glow has no tier (off / none) and must stay white\n\n   rather than losing the declaration. */\n\n.cg-model-meteor::after {\n\n  content: ''; position: absolute; right: -1px; top: 50%; width: 2px; height: 2px;\n\n  margin-top: -1px; border-radius: 50%;\n\n  background: var(--cg-glow, #ffffffb3);\n\n  background: color-mix(in srgb, var(--cg-glow, #ffffffb3) 45%, #ffffff);\n\n  box-shadow:\n\n    0 0 5px 0         color-mix(in srgb, var(--cg-glow, #ffffffb3) 62%, transparent),\n\n    0 0 2px 0         color-mix(in srgb, var(--cg-glow, #ffffffb3) 46%, #ffffff),\n\n    2px 0 2px -.5px   color-mix(in srgb, var(--cg-glow, #ffffffb3) 46%, transparent),\n\n    -2px 0 2px -.5px  color-mix(in srgb, var(--cg-glow, #ffffffb3) 46%, transparent);\n\n  animation: cg-model-meteor-head 1.15s ease-in-out infinite;\n\n}\n\n/* Light theme: the rail is near-white (#e8e6e8), where added white is nothing, so the flare and the\n\n   bloom lean on the mode colour instead. Both background layers are restated: a background-image\n\n   override replaces the whole list, and dropping the first one would make the streak itself vanish in\n\n   the light theme. The colour layer carries the same low alpha as the dark branch — the streak has to\n\n   read as white in both themes, and on this rail that means the white ramp does the work. */\n\nbody:not([data-ds-dark-theme]) .cg-model-meteor::before {\n\n  background-image:\n\n    linear-gradient(90deg, #ffffff00, #ffffff80 20%, #ffffffe6 70%, #ffffff),\n\n    linear-gradient(90deg,\n\n      #ffffff00 0%,\n\n      color-mix(in srgb, var(--cg-glow, #8f74d6) 8%, transparent) 38%,\n\n      color-mix(in srgb, var(--cg-glow, #8f74d6) 12%, transparent) 78%,\n\n      color-mix(in srgb, var(--cg-glow, #8f74d6) 16%, transparent) 100%);\n\n}\n\n/* The shared halo leans white so it survives on the dark rail; on the light rail a near-white blur is\n\n   nothing, so light keeps the mode colour the way its flare does. Same single pass, same radius. */\n\nbody:not([data-ds-dark-theme]) .cg-model-meteor {\n\n  filter: drop-shadow(0 0 4px color-mix(in srgb, var(--cg-glow, #8f74d6) 58%, transparent));\n\n}\n\nbody:not([data-ds-dark-theme]) .cg-model-meteor::after {\n\n  box-shadow:\n\n    0 0 7px 1px       color-mix(in srgb, var(--cg-glow, #8f74d6) 74%, transparent),\n\n    0 0 2px 0         var(--cg-glow, #8f74d6),\n\n    2px 0 3px -.5px   color-mix(in srgb, var(--cg-glow, #8f74d6) 54%, transparent),\n\n    -2px 0 3px -.5px  color-mix(in srgb, var(--cg-glow, #8f74d6) 54%, transparent);\n\n}\n\n/* Eleven streaks, every gap under ~0.4s and none of the periods a multiple of another, so\n\n   the field never falls into a visible rhythm; the short ones read as fast dust and the long ones as\n\n   the occasional real meteor. Lengths run 15/16/18/20/23/24/26/28/30/32/34px — a 2.27× spread end to end,\n\n   scattered across the lanes rather than sorted, so adjacent streaks never pair up at the same size.\n\n   What a streak is graded against is not L/T but the straight edge it keeps: `border-radius: 999px` eats\n\n   T/2 at each end, so the flat run is L − T, and the ratio that decides \"bar or dot\" is (L − T) / T ≥ 4 —\n\n   equivalently L ≥ 5T. L/T = 4 is not enough: 12/3 clears it and still leaves 9/3 = 3.00 of straight edge,\n\n   which is the \"豆\" the owner reported. Measured at DPR 1.25 against a rasterised box, the straight edge\n\n   covers 0.77–0.87 of the length at L/T = 4 but only 0.57–0.63 at 2, so the gap is real.\n\n   All eleven now satisfy L ≥ 5T (15/3 leaves 4.00 straight, 34/4 leaves 7.50), and the short ones carry\n\n   the thinner body so the field still reads as one system rather than eleven unrelated sizes.\n\n   Thickness is integer only: measured, 3.5px rasterises as 3px plus one 38%-coverage edge row, while\n\n   4px fills that row to 79% — a 2.5/3.5 split would be invisible. Two body sizes, length does the grading.\n\n   34px is the ceiling: past that a streak stops reading as a short bar of light and turns back into the\n\n   long coloured tape that was already rejected once.\n\n   Duration, delay and lane are untouched — that rhythm was accepted. */\n\n.cg-model-meteor:nth-child(1) { --cg-meteor-y: 3px; --cg-meteor-delay: -0.1s; --cg-meteor-dur: 1.5s; --cg-meteor-len: 32px; --cg-meteor-thick: 4px; }\n\n.cg-model-meteor:nth-child(2) { --cg-meteor-y: 8px; --cg-meteor-delay: -0.5s; --cg-meteor-dur: 1.9s; --cg-meteor-len: 26px; --cg-meteor-thick: 4px; }\n\n.cg-model-meteor:nth-child(3) { --cg-meteor-y: 13px; --cg-meteor-delay: -0.88s; --cg-meteor-dur: 2.1s; --cg-meteor-len: 20px; --cg-meteor-thick: 3px; }\n\n.cg-model-meteor:nth-child(4) { --cg-meteor-y: 18px; --cg-meteor-delay: -1.26s; --cg-meteor-dur: 1.7s; --cg-meteor-len: 34px; --cg-meteor-thick: 4px; }\n\n.cg-model-meteor:nth-child(5) { --cg-meteor-y: 17px; --cg-meteor-delay: -1.62s; --cg-meteor-dur: 2.3s; --cg-meteor-len: 23px; --cg-meteor-thick: 4px; }\n\n.cg-model-meteor:nth-child(6) { --cg-meteor-y: 6px; --cg-meteor-delay: -1.98s; --cg-meteor-dur: 2.6s; --cg-meteor-len: 16px; --cg-meteor-thick: 3px; }\n\n.cg-model-meteor:nth-child(7) { --cg-meteor-y: 11px; --cg-meteor-delay: -0.3s; --cg-meteor-dur: 1.6s; --cg-meteor-len: 28px; --cg-meteor-thick: 4px; }\n\n.cg-model-meteor:nth-child(8) { --cg-meteor-y: 15px; --cg-meteor-delay: -1.14s; --cg-meteor-dur: 2s; --cg-meteor-len: 24px; --cg-meteor-thick: 4px; }\n\n.cg-model-meteor:nth-child(9) { --cg-meteor-y: 15px; --cg-meteor-delay: -0.68s; --cg-meteor-dur: 1.8s; --cg-meteor-len: 18px; --cg-meteor-thick: 3px; }\n\n.cg-model-meteor:nth-child(10) { --cg-meteor-y: 5px; --cg-meteor-delay: -1.44s; --cg-meteor-dur: 2.2s; --cg-meteor-len: 30px; --cg-meteor-thick: 4px; }\n\n.cg-model-meteor:nth-child(11) { --cg-meteor-y: 9px; --cg-meteor-delay: -0.22s; --cg-meteor-dur: 2.45s; --cg-meteor-len: 15px; --cg-meteor-thick: 3px; }\n\n/* Density follows the band, not the track. Eleven streaks were tuned for the full 230px groove — one\n   every ~21px. The band is shorter at every lower tier (a three-tier model gives 24 / 127 / 230px),\n   so eleven of them inside a 127px band is a smear. The layer itself is the query container: its\n   inline size is `--cg-fill-width`, so these breakpoints measure the fill. A query on the shell\n   would only see the track's width, which does not change with the tier, so it could not express\n   this. Counts hold the same ~20-25px spacing across the breakpoints: 1 / 4 / 6 / 8 / 11. The\n   streaks that stay are the head of the list, in their existing order and colours; only `display`\n   changes, and a browser without container queries keeps all eleven inside the band instead of\n   losing any. */\n@container cg-meteor-band (max-width: 184px) {\n  .cg-model-meteor:nth-child(9), .cg-model-meteor:nth-child(10), .cg-model-meteor:nth-child(11) { display: none; }\n}\n@container cg-meteor-band (max-width: 136px) {\n  .cg-model-meteor:nth-child(7), .cg-model-meteor:nth-child(8) { display: none; }\n}\n@container cg-meteor-band (max-width: 96px) {\n  .cg-model-meteor:nth-child(5), .cg-model-meteor:nth-child(6) { display: none; }\n}\n@container cg-meteor-band (max-width: 48px) {\n  .cg-model-meteor:nth-child(2), .cg-model-meteor:nth-child(3), .cg-model-meteor:nth-child(4) { display: none; }\n}\n\n/* A wide glare sweeps the track once every few seconds, so the field reads as moving\n\n   even between meteors. Carried by ::after, which the star field does not need.\n\n   Its screen blend is gone too, for the same reason as the meteor layer's: the sweep is the\n\n   one thing in this panel that repaints its whole width on every frame, and blending made that repaint\n\n   recomposite against the rail as well. The gradient's two light stops carry the ~12% more alpha the\n\n   blend was contributing. What is left is a plain repaint of a static gradient, which is the cheapest\n\n   form this sweep has short of rebuilding it as a translated layer. */\n\n.cg-model-slider-shell[data-ultra=\"true\"]::after {\n\n  content: ''; position: absolute; inset: 0; z-index: 1; border-radius: inherit; pointer-events: none;\n\n  background: linear-gradient(105deg, #ffffff00 44%, #c9b4f08f 50%, #d9c8ff9e 56%, #ffffff00 62%);\n\n  background-size: 220% 100%;\n\n  animation: cg-model-glare 3.4s ease-in-out infinite; opacity: 0;\n\n}\n\n/* The same sweep for every tier. The `[data-ultra=\"true\"]` rules above are left where they are —\n   they simply never match now that the panel has no Ultra tier — and this is that selector with the\n   gate dropped: the shell itself carries the sweep. It is clipped to the fill's width and, unlike\n   the old full-shell version, to the fill's own 4px..24px band, so the glare never paints the bare\n   rail above or below the bar. The tint comes from the tier instead of the fixed lavender:\n   `--cg-glow` is the per-tier colour the halo and the meteor heads already wear (gold under 超快, by\n   its own rules), with `--cg-effort-color` as the fallback for a shell outside the popover. The two\n   light stops stay in the old sweep's alpha range; the fill's per-tier backgrounds are untouched. */\n.cg-model-slider-shell::after {\n\n  content: ''; position: absolute; left: 0; right: auto; top: 4px; bottom: 4px;\n\n  width: var(--cg-fill-width, 0px); z-index: 1; border-radius: 10px; pointer-events: none;\n\n  /* Longhand, because the sweep is a 220%-wide layer moved by `background-position`: the `background`\n     shorthand would reset the size and the glare could only pulse in place. */\n  background-image: linear-gradient(105deg, #ffffff00 44%,\n    color-mix(in srgb, var(--cg-glow, var(--cg-effort-color, #c9b4f0)) 45%, transparent) 50%,\n    #ffffffa6 56%,\n    #ffffff00 62%);\n\n  background-size: 220% 100%;\n\n  background-repeat: no-repeat;\n\n  animation: cg-model-glare 3.4s ease-in-out infinite; opacity: 0;\n\n}\n\n/* Light theme: the same sweep with its alphas roughly halved. A near-white glare on a pale fill is\n   the one place this effect gets loud; the tier tint stays, because the colour is what ties the\n   sweep to the bar. Only the image is restated — size, repeat and the animation come from above. */\nbody:not([data-ds-dark-theme]) .cg-model-slider-shell::after {\n\n  background-image: linear-gradient(105deg, #ffffff00 44%,\n    color-mix(in srgb, var(--cg-glow, var(--cg-effort-color, #c9b4f0)) 22%, transparent) 50%,\n    #ffffff59 56%,\n    #ffffff00 62%);\n\n}\n\n/* Off, none and unknown are hard stops, not modes: Off paints no fill at all, and an unknown position\n   has no width to put a band in. Both the shower and the sheen go, and the layer's `display` is\n   `!important` because 超快 re-asserts `display: block` on it further down with a deeper selector — a\n   hard state has to win over a mode. This also folds in the `[data-unknown=\"true\"]` stop that used to\n   sit with the base `.cg-model-meteors` rule. */\n.cg-model-slider-shell[data-effort=\"off\"] .cg-model-meteors,\n.cg-model-slider-shell[data-effort=\"none\"] .cg-model-meteors,\n.cg-model-slider-shell[data-unknown=\"true\"] .cg-model-meteors,\n.cg-model-slider-shell[data-effort=\"off\"]::after,\n.cg-model-slider-shell[data-effort=\"none\"]::after,\n.cg-model-slider-shell[data-unknown=\"true\"]::after { display: none !important; }\n\n/* Star field rides the meteor layer's own pseudo-element-free element list, so the\n\n   twinkle is drawn by a dedicated overlay instead of competing with the glare. */\n\n.cg-model-meteors::before {\n\n  content: ''; position: absolute; inset: 3px 8px; border-radius: inherit;\n\n  background-image:\n\n    radial-gradient(1.5px 1.5px at 8% 30%, #cbb4ff88, transparent),\n\n    radial-gradient(1.2px 1.2px at 20% 68%, #f2ebffcc, transparent),\n\n    radial-gradient(1.2px 1.2px at 28% 72%, #e5d9ffcc, transparent),\n\n    radial-gradient(1.8px 1.8px at 39% 22%, #cbb4ff77, transparent),\n\n    radial-gradient(1.2px 1.2px at 47% 26%, #cbb4ff77, transparent),\n\n    radial-gradient(1.1px 1.1px at 55% 74%, #cbb4ffcc, transparent),\n\n    radial-gradient(1.2px 1.2px at 66% 66%, #d9c8ffee, transparent),\n\n    radial-gradient(1.4px 1.4px at 74% 34%, #cbb4ff88, transparent),\n\n    radial-gradient(1.5px 1.5px at 84% 38%, #cbb4ff88, transparent),\n\n    radial-gradient(1.1px 1.1px at 93% 74%, #cbb4ffcc, transparent);\n\n  animation: cg-model-twinkle 2.6s ease-in-out infinite alternate;\n\n}\n\n.cg-model-slider-shell[data-ultra=\"true\"] .cg-model-thumb {\n\n  border-color: #d3b6ff;\n\n  box-shadow: 0 0 6px #a066ff99, 0 0 16px #8b5cf68c, 0 0 0 1px #ffffff99 inset;\n\n}\n\n.cg-model-slider-shell[data-ultra=\"true\"][data-max=\"true\"] .cg-model-thumb {\n\n  animation: none;\n\n}\n\n.cg-model-popover[data-ultra=\"true\"] .cg-model-slider-shell::before { box-shadow: inset 0 0 0 1px #bb74ff3d; }\n\n/* The appended Ultra position is drawn darker: it is a mode, not a real tier. */\n\n.cg-model-slider-dots span[data-ultra=\"true\"] { background: #9b50ff; box-shadow: 0 0 5px #9b50ff99; }\n\n/* ---- Motion: the panels and rows cross over instead of snapping --------------------------------\n\n   The house curve is cubic-bezier(.22,.8,.28,1) at 140-180ms: quick enough to feel like a response\n\n   rather than a wait, and eased so nothing starts or stops abruptly. Everything here is decoration —\n\n   the reduced-motion block at the end switches all of it off. */\n\n.cg-model-pane { color: var(--cg-text); animation: cg-soft-in 170ms cubic-bezier(.22, .8, .28, 1); }\n\n.cg-model-editor { display: flex; flex: 1 1 auto; min-width: 0; align-items: flex-start; gap: 2px; animation: cg-soft-in 140ms cubic-bezier(.22, .8, .28, 1); }\n\n.cg-model-viewer { display: flex; flex: 1 1 auto; min-width: 0; align-items: center; gap: 2px; animation: cg-soft-in 140ms cubic-bezier(.22, .8, .28, 1); }\n\n.cg-button, .cg-model-option, .cg-model-rename, .cg-model-alias-save, .cg-model-alias-cancel,\n\n.cg-model-summary, .cg-model-zap, .cg-model-reset, .cg-model-choice, .cg-rail-item, .cg-task-menu .cg-button {\n\n  transition: background-color 140ms cubic-bezier(.22, .8, .28, 1), color 140ms cubic-bezier(.22, .8, .28, 1),\n\n    opacity 140ms cubic-bezier(.22, .8, .28, 1), border-color 140ms cubic-bezier(.22, .8, .28, 1);\n\n}\n\n.cg-model-sync-warn { color: #c0392b; }\n\n.cg-model-sync-warn { color: #c0392b; }\n\n/* ---------------------------------------------------------------------------------------------\n\n   提供商参考清单（模型面板标题旁那个按钮打开的第二页）。\n\n   用原生 <details>/<summary> 做折叠：展开状态由浏览器维护，不需要插件再加一个 state——面板里的\n\n   每一个 useState 都被测试垫片的槽位表盯着，能不加就不加。\n\n   --------------------------------------------------------------------------------------------- */\n\nhtml[data-chatgpt-ui] .cg-model-catalog-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }\n\nhtml[data-chatgpt-ui] .cg-model-providers-button {\n\n  flex: none; height: 24px; padding: 0 10px; border: 1px solid var(--cg-line, #e8e8e8); border-radius: 999px;\n\n  background: var(--cg-page, #fff); color: var(--cg-muted, #6b6b6b); font-size: 12px; line-height: 22px; cursor: pointer;\n\n}\n\nhtml[data-chatgpt-ui] .cg-model-providers-button:hover { background: var(--cg-hover, #f2f2f2); color: var(--cg-text, #1a1a1a); }\n\nbody[data-ds-dark-theme] .cg-model-providers-button { border-color: #383838; background: #292929; color: #a8a8a8; }\n\nbody[data-ds-dark-theme] .cg-model-providers-button:hover { background: #333; color: #ececec; }\n\nhtml[data-chatgpt-ui] .cg-model-provider-note { margin: 6px 2px 8px; color: var(--cg-muted, #6b6b6b); font-size: 11px; line-height: 15px; }\n\nhtml[data-chatgpt-ui] .cg-model-providers { max-height: 320px; overflow-y: auto; overscroll-behavior: contain; padding-right: 2px; }\n\nhtml[data-chatgpt-ui] .cg-model-provider-region { margin: 8px 2px 4px; color: var(--cg-muted, #6b6b6b); font-size: 11px; font-weight: 600; letter-spacing: .4px; }\n\nhtml[data-chatgpt-ui] .cg-model-provider { border-bottom: 1px solid var(--cg-line, #f0f0f0); }\n\nbody[data-ds-dark-theme] .cg-model-provider { border-bottom-color: #2f2f2f; }\n\nhtml[data-chatgpt-ui] .cg-model-provider-name {\n\n  display: flex; align-items: center; justify-content: space-between; gap: 8px;\n\n  padding: 7px 6px; color: var(--cg-text, #1a1a1a); font-size: 13px; line-height: 18px; cursor: pointer; list-style: none;\n\n}\n\nhtml[data-chatgpt-ui] .cg-model-provider-name::-webkit-details-marker { display: none; }\n\nhtml[data-chatgpt-ui] .cg-model-provider-name:hover { background: var(--cg-hover, #f5f5f5); }\n\nbody[data-ds-dark-theme] .cg-model-provider-name:hover { background: #2f2f2f; }\n\nhtml[data-chatgpt-ui] .cg-model-provider-name::before { content: '›'; flex: none; width: 10px; color: var(--cg-muted, #8a8a8a); transition: transform 150ms cubic-bezier(.22,.8,.28,1); }\n\nhtml[data-chatgpt-ui] .cg-model-provider[open] > .cg-model-provider-name::before { transform: rotate(90deg); }\n\nhtml[data-chatgpt-ui] .cg-model-provider-name > span:first-of-type { flex: 1; min-width: 0; }\n\nhtml[data-chatgpt-ui] .cg-model-provider-count { flex: none; color: var(--cg-muted, #9a9a9a); font-size: 11px; font-weight: 400; }\n\nhtml[data-chatgpt-ui] .cg-model-provider-models { margin: 0 0 6px; padding: 0 0 0 18px; color: var(--cg-muted, #5f5f5f); font-size: 12px; line-height: 18px; }\n\nbody[data-ds-dark-theme] .cg-model-provider-models { color: #a0a0a0; }\n\nhtml[data-chatgpt-ui] .cg-model-provider-site { display: inline-block; margin: 0 0 8px 18px; color: var(--cg-muted, #6b6b6b); font-size: 11px; text-decoration: none; }\n\nhtml[data-chatgpt-ui] .cg-model-provider-site:hover { text-decoration: underline; }\n\n/* The two modes opened by the zap button. They reuse the popover's geometry and the menu idiom already used\n\n   by the agent picker (`role=\"menuitemradio\"` + `aria-checked`), so the panel needs no new interaction\n\n   machinery: Escape and outside-click already close the popover. */\n\n.cg-model-modes { display: flex; flex-direction: column; gap: 4px; padding: 4px 2px 2px; }\n\n.cg-model-mode { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; padding: 10px 12px; border: 1px solid transparent; border-radius: 12px; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; transition: background-color 120ms ease, border-color 120ms ease; }\n\n/* Hover must not erase the selected row's tint: `.cg-model-mode:hover` is (0,2,0) and the selected\n   rule below is also (0,2,0), so the later rule would only win while the pointer is elsewhere. The\n   `:not([data-on=\"true\"])` keeps the checked row visibly checked under the cursor. */\n.cg-model-mode:hover:not(:disabled):not([data-on=\"true\"]), .cg-model-mode:focus-visible:not([data-on=\"true\"]) { background: #0000000a; border-color: #00000012; }\n\n.cg-model-mode[data-on=\"true\"] { border-color: #7b5cf04d; background: #7b5cf014; }\n\n.cg-model-mode:disabled { opacity: 0.5; cursor: default; }\n\n.cg-model-mode-check { flex: none; display: inline-grid; place-items: center; width: 18px; height: 18px; color: var(--cg-effort-color); }\n\n.cg-model-mode-text { color: var(--cg-text); display: flex; flex-direction: column; gap: 2px; min-width: 0; }\n\n.cg-model-mode-text > strong { font-size: 14px; font-weight: 600; letter-spacing: 0.1px; }\n\n.cg-model-mode-text > span { font-size: 12px; color: var(--cg-muted); }\n\n.cg-model-trigger-bolt[data-tree=\"true\"] { width: 20px; }\n\n.cg-model-popover[data-superfast=\"true\"] { --cg-effort-color: #e8a317; }\n\n/* The tier name on the collapsed trigger is set by an explicit purple rule, so inheriting the mode colour is not\n\n   enough for it; at the time of writing it was the last purple left on screen while 超快 was on. The root holds\n\n   both the trigger and the popover, which is why the mode rides there as well. */\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-ultra=\"true\"] { color: #e8a317; }\n\n.cg-model-popover[data-superfast=\"true\"] .cg-model-slider-fill { background: linear-gradient(90deg, #dcb273 0%, #eed3a8 18%, #fdf6e4 38%, #ffe6a8 62%, #f7c948 82%, #e8a317 100%); }\n\n.cg-model-popover[data-superfast=\"true\"] .cg-model-slider-shell::before { box-shadow: inset 0 0 0 1px #f7c9483d; }\n\n.cg-model-popover[data-superfast=\"true\"] .cg-model-slider-shell .cg-model-meteors { display: block; }\n\n/* 超快 keeps the base streak ramp on ::before and only overrides the halo: a `background` on the element\n\n   would paint the unclipped rectangle behind the tapered smear and flatten the taper away. */\n\n.cg-model-popover[data-superfast=\"true\"] .cg-model-meteor { filter: drop-shadow(0 0 4px color-mix(in srgb, var(--cg-glow, #ffffff) 45%, #ffffffb8)); }\n\n.cg-model-popover[data-superfast=\"true\"] .cg-model-meteors::before { background-image:\n\n    radial-gradient(1.5px 1.5px at 8% 30%, #ffe6a8cc, transparent),\n\n    radial-gradient(1.2px 1.2px at 20% 68%, #ffedbc, transparent),\n\n    radial-gradient(1.2px 1.2px at 28% 72%, #ffe6a8cc, transparent),\n\n    radial-gradient(1.8px 1.8px at 39% 22%, #f7c94899, transparent),\n\n    radial-gradient(1.2px 1.2px at 47% 26%, #f7c94899, transparent),\n\n    radial-gradient(1.1px 1.1px at 55% 74%, #f7c948cc, transparent),\n\n    radial-gradient(1.2px 1.2px at 66% 66%, #ffe6a8ee, transparent),\n\n    radial-gradient(1.4px 1.4px at 74% 34%, #ffe6a8cc, transparent),\n\n    radial-gradient(1.5px 1.5px at 84% 38%, #ffe6a8cc, transparent),\n\n    radial-gradient(1.1px 1.1px at 93% 74%, #f7c948cc, transparent); }\n\n.cg-model-popover[data-superfast=\"true\"] .cg-model-slider-shell[data-effort] .cg-model-slider-fill::after { background: radial-gradient(ellipse 50% 50% at 50% 50%, #8a4d0de6 0%, #8a4d0d45 45%, #8a4d0d00 100%); }\n\n/* 超快's palette. Every rule is keyed on the root, which carries data-superfast for the trigger and the popover\n\n   alike. Selectors are one class deeper than the rules they must beat — the fill's depth buckets are (0,3,0) and\n\n   the tier-name rules are explicit colours, so neither can be reached by inheritance. Ultra keeps its own purple\n\n   ramp, untouched, because these only apply while 超快 is the chosen mode. */\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover { --cg-effort-color: #e8a317; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell .cg-model-slider-fill { background: linear-gradient(90deg, #dcb273 0%, #eed3a8 18%, #fdf6e4 38%, #ffe6a8 62%, #f7c948 82%, #e8a317 100%); }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-ultra=\"true\"] { color: #e8a317; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"max\"] .cg-model-summary strong,\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"xhigh\"] .cg-model-summary strong { color: #e8a317; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-ultra-notice { color: #e8a317; }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-ultra-notice { color: #f7ad31; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell::before { box-shadow: inset 0 0 0 1px #f7c9483d; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-ultra=\"true\"] .cg-model-slider-dots span[data-ultra=\"true\"] { background: #e8a317; box-shadow: 0 0 5px #e8a31799; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-ultra=\"true\"] .cg-model-thumb { border-color: #ffe8a8; box-shadow: 0 0 6px #e8a31799, 0 0 16px #c8860d8c, 0 0 0 1px #ffffff99 inset; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-max=\"true\"][data-ultra=\"true\"] .cg-model-thumb { animation: none; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell .cg-model-meteors { display: block; }\n\n/* Same for the root-scoped 超快 branch. */\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-meteor { filter: drop-shadow(0 0 4px color-mix(in srgb, var(--cg-glow, #ffffff) 45%, #ffffffb8)); }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-meteors::before { background-image:\n\n    radial-gradient(1.5px 1.5px at 8% 30%, #ffffffdd, transparent),\n\n    radial-gradient(1.2px 1.2px at 20% 68%, #ffedbc, transparent),\n\n    radial-gradient(1.2px 1.2px at 28% 72%, #ffe6a8cc, transparent),\n\n    radial-gradient(1.8px 1.8px at 39% 22%, #ffffffcc, transparent),\n\n    radial-gradient(1.2px 1.2px at 47% 26%, #ffffffcc, transparent),\n\n    radial-gradient(1.1px 1.1px at 55% 74%, #f7c948cc, transparent),\n\n    radial-gradient(1.2px 1.2px at 66% 66%, #ffe6a8ee, transparent),\n\n    radial-gradient(1.4px 1.4px at 74% 34%, #ffffffdd, transparent),\n\n    radial-gradient(1.5px 1.5px at 84% 38%, #ffffffdd, transparent),\n\n    radial-gradient(1.1px 1.1px at 93% 74%, #f7c948cc, transparent); }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell .cg-model-slider-fill::after { background: radial-gradient(ellipse 50% 50% at 50% 50%, #8a4d0de6 0%, #8a4d0d45 45%, #8a4d0d00 100%); }\n\n/* The dark theme carries its own, deeper selectors for the tier names and the glyph colour, so the light-only\n\n   rules above are not enough: the owner's panel is dark, which is why the first attempt looked like a no-op. */\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-popover { --cg-effort-color: #f0b429; }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-ultra=\"true\"],\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"max\"] .cg-model-summary strong,\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"xhigh\"] .cg-model-summary strong { color: #f0b429; }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-trigger-bolt { color: #f0b429; }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-zap[data-on=\"true\"] { color: #f0b429; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-zap[data-on=\"true\"] .cg-model-zap-glyph { filter: drop-shadow(0 0 5px #f7c9488c); }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-ultra=\"true\"] .cg-model-slider-dots span[data-ultra=\"true\"] { background: #f0b429; box-shadow: 0 0 5px #f0b42999; }\n\n/* Longhand on purpose: the `background` shorthand resets `background-size`, and the glare is a 220%-wide layer\n\n   that sweeps by moving its position — with the size reset it could only pulse in place. */\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-ultra=\"true\"]::after { background-size: 220% 100%; background-repeat: no-repeat; background-image: linear-gradient(105deg, #ffffff00 44%, #f0d9a88f 50%, #ffe9b09e 56%, #ffffff00 62%); }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"max\"],\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"xhigh\"],\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"max\"],\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"xhigh\"] { color: #f0b429; }\n\n/* 超快: one fill colour per tier, except Max, which runs a wide amber ramp — bright gold on the left falling to\n\n   muted amber on the right — so it reads as a gradient at a glance instead of as one flat tone, and the ramp\n\n   passes through xhigh's flat #d9a534 rather than ending on it, which is what keeps the two distinguishable.\n\n   Medium is deliberately left on the shared six-stop ramp, since the brief named only Low, High, Max and Ultra.\n\n   That ramp used to run blue→gold; it is now warm end to end, because 超快 must not show blue at any tier. The\n\n   lightness arc is unchanged — mid camel → pale camel → cream → warm cream → gold → deep gold — so the bar still\n\n   reads as a gradient rather than a flat tone. */\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"low\"] .cg-model-slider-fill { background: #e6cb97; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"minimal\"] .cg-model-slider-fill { background: #e6cb97; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"high\"] .cg-model-slider-fill { background: #dfb662; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"xhigh\"] .cg-model-slider-fill { background: #d9a534; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"max\"] .cg-model-slider-fill { background: linear-gradient(90deg, #f7c948 0%, #d9a534 52%, #c08d28 100%); }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"ultra\"] .cg-model-slider-fill { background: linear-gradient(90deg, #dfb662 0%, #dcae55 12%, #d9a534 42%, #e8b622 74%, #f7c948 100%); }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"low\"] .cg-model-slider-fill { background: #e8d09f; }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"minimal\"] .cg-model-slider-fill { background: #e8d09f; }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"high\"] .cg-model-slider-fill { background: #e0b766; }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"xhigh\"] .cg-model-slider-fill { background: #d9a534; }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"max\"] .cg-model-slider-fill { background: linear-gradient(90deg, #ffd45e 0%, #d9a534 52%, #c08d28 100%); }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"ultra\"] .cg-model-slider-fill { background: linear-gradient(90deg, #e0b766 0%, #ddb258 12%, #d9a534 42%, #eab820 74%, #f7c948 100%); }\n\n/* 超快 must not paint the empty tier. The superfast base fill rule is (0,4,0), one class deeper than the shared\n\n   transparent rules at (0,3,0), so without this the Off position showed a warm gold bar. */\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"off\"] .cg-model-slider-fill,\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"none\"] .cg-model-slider-fill { background: transparent; }\n\n/* 超快: at Off / Low / High the tier name takes High's own fill colour, so label and bar match. Max and the top tier\n\n   are untouched — they keep the mode's gold. */\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"off\"] .cg-model-summary strong,\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"off\"],\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"none\"] .cg-model-summary strong,\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"none\"],\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"low\"] .cg-model-summary strong,\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"low\"],\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"minimal\"] .cg-model-summary strong,\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"minimal\"],\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"high\"] .cg-model-summary strong,\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"high\"] { color: #dfb662; }\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"off\"] .cg-model-summary strong,\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"off\"],\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"none\"] .cg-model-summary strong,\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"none\"],\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"low\"] .cg-model-summary strong,\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"low\"],\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"minimal\"] .cg-model-summary strong,\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"minimal\"],\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"high\"] .cg-model-summary strong,\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-trigger-effort[data-effort=\"high\"] { color: #e0b766; }\n\n/* Orchestration on: the whole effort panel glows in its tier colour — border plus halo, not just the track.\n\n   Colour comes from --cg-glow (tier colour by default, gold under superfast).\n\n   The halo itself lives on ::before, not on the popover. A keyframed box-shadow on the panel repaints the\n\n   whole surface on every frame and re-runs the eleven meteors' filters with it; painted once as a static\n\n   shadow and breathed with opacity only, the glow is composited and costs nothing per frame. The popover\n\n   keeps no colour shadow of its own any more, so the neutral drop shadow from the theme rules further down\n\n   survives untouched — which is also what leaves the off tier with an ordinary shadow instead of none. */\n\n.cg-model-root[data-lightning=\"true\"] .cg-model-popover,\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover {\n\n  /* Full-saturation first, then the softened value: a browser without color-mix keeps the stronger one instead of\n\n     losing the declaration, and everyone else gets the quiet version. */\n\n  border-color: var(--cg-glow);\n\n  border-color: color-mix(in srgb, var(--cg-glow) 42%, transparent);\n\n  /* No `animation` here on purpose. The entrance is declared on the base `.cg-model-popover` rule (0,1,0);\n\n     re-declaring it at (0,3,0) outranks the reduced-motion stop — a media query adds no specificity — and\n\n     that is what used to re-open the entrance for lightning/superfast under reduced motion.\n\n     The breathing moved to ::before, next to the shadow it animates. */\n\n}\n\n/* The halo. `inset: 0` covers the whole panel and a positioned box paints above in-flow content, so\n\n   `pointer-events: none` is mandatory: without it the pseudo-element swallows every click meant for the\n\n   options, the search box and the buttons (measured with elementFromPoint — the static controls resolve to\n\n   the pseudo-element). `z-index: -1` is a second guard: it puts the halo under the panel's own content\n\n   while staying above the panel background, inside the stacking context that `z-index: 60` already gives\n\n   the popover. `border-radius: inherit` follows both the 19px default and the 16px model pane, no second\n\n   rule needed. `inset: 0` resolves against the padding box, so the halo starts 1px inside the border; at a\n\n   16px blur that offset is not visible.\n\n   Geometry is the midpoint of the old 12px/20px sweep: `0 0 16px 1px`. Alpha is the old 50% peak and\n\n   opacity runs .68 → 1 — exactly the 34% → 50% alpha the box-shadow keyframes used to animate. */\n\n.cg-model-root[data-lightning=\"true\"] .cg-model-popover::before,\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover::before {\n\n  content: '';\n\n  position: absolute;\n\n  inset: 0;\n\n  z-index: -1;\n\n  border-radius: inherit;\n\n  pointer-events: none;\n\n  box-shadow: 0 0 16px 1px color-mix(in srgb, var(--cg-glow) 50%, transparent);\n\n  opacity: .68;\n\n  animation: cg-model-halo-breathe 2.6s ease-in-out 120ms infinite;\n\n}\n\n/* --cg-glow is read by the border above and by the halo. Every tier assigns it below; these two are the\n\n   neutral fallbacks for a tier this file does not name — off / none, or an id the host's effort catalogue\n\n   adds later. Without them the border would fall back to currentColor (near-black in the light theme,\n\n   near-white in the dark one) and the halo's box-shadow would become `none`, losing the neutral drop shadow\n\n   along with it. Neutral, never gold: gold belongs to 超快 alone. */\n\n.cg-model-popover { --cg-glow: #e6e6e6; }\n\nbody[data-ds-dark-theme] .cg-model-popover { --cg-glow: #444; }\n\n.cg-model-root:not([data-superfast=\"true\"]) .cg-model-popover[data-effort=\"minimal\"] { --cg-glow: var(--cg-e2); }\n\n.cg-model-root:not([data-superfast=\"true\"]) .cg-model-popover[data-effort=\"low\"] { --cg-glow: var(--cg-e2); }\n\n.cg-model-root:not([data-superfast=\"true\"]) .cg-model-popover[data-effort=\"medium\"] { --cg-glow: var(--cg-e3); }\n\n.cg-model-root:not([data-superfast=\"true\"]) .cg-model-popover[data-effort=\"high\"] { --cg-glow: var(--cg-e4); }\n\n.cg-model-root:not([data-superfast=\"true\"]) .cg-model-popover[data-effort=\"xhigh\"] { --cg-glow: var(--cg-e5); }\n\n.cg-model-root:not([data-superfast=\"true\"]) .cg-model-popover[data-effort=\"max\"] { --cg-glow: var(--cg-e5); }\n\n.cg-model-root:not([data-superfast=\"true\"]) .cg-model-popover[data-effort=\"ultra\"],\n\n.cg-model-root:not([data-superfast=\"true\"]) .cg-model-popover[data-max=\"true\"] { --cg-glow: #bb74ff; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"off\"] { --cg-glow: #e0b766; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"none\"] { --cg-glow: #e0b766; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"minimal\"] { --cg-glow: #e0b766; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"low\"] { --cg-glow: #e0b766; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"medium\"] { --cg-glow: #dfb662; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"high\"] { --cg-glow: #dfb662; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"xhigh\"] { --cg-glow: #d9a534; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"max\"] { --cg-glow: #d9a534; }\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-effort=\"ultra\"],\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover[data-max=\"true\"] { --cg-glow: #f7c948; }\n\n/* Only the halo is left to stop. The panel's entrance is declared on the base `.cg-model-popover` rule\n\n   alone (0,1,0), so the equal-specificity stop in the reduced-motion block above already cancels it for\n\n   every tier and both themes. Nothing may re-open it here: a (0,3,0) animation declaration in this block\n\n   is exactly the regression that made lightning/superfast keep the 120ms entrance under reduced motion.\n\n   ::before does need its own clause — a rule on the popover cannot reach its pseudo-element's animation. */\n\n@media (prefers-reduced-motion: reduce) {\n\n  .cg-model-root[data-lightning=\"true\"] .cg-model-popover::before,\n\n  .cg-model-root[data-superfast=\"true\"] .cg-model-popover::before { animation: none; }\n\n}\n\n/* Dark-mode overrides for the panels that now default to their light appearance.\n\n   They are appended last so they win on specificity ties against the single-class rules above. */\n\nbody[data-ds-dark-theme] .cg-model-tooltip { background: #1c1e20; color: #fff; box-shadow: 0 5px 14px #00000052; }\n\n/* Light-mode glow policy: on a white panel a coloured halo reads as a ring painted onto the\n\n   surface, and the popover's halo breathes every 2.6s. Keep the state colour, drop the glow;\n\n   dark keeps its original values (all selectors below are light-only, so the dark rules above\n\n   are untouched). */\n\nbody:not([data-ds-dark-theme]) .cg-model-zap[data-on=\"true\"] .cg-model-zap-glyph { filter: none; }\n\nbody:not([data-ds-dark-theme]) .cg-model-root[data-superfast=\"true\"] .cg-model-zap[data-on=\"true\"] .cg-model-zap-glyph { filter: none; }\n\n/* Gold is the one armed glow the light panel keeps. The blanket light rule above is (0,4,1);\n   the general tree glyph rule is (0,4,0), so without this restatement the light theme would drop\n   the gold halo and tree would be left with only its hue — which is what tells it apart from fast. */\n\nbody:not([data-ds-dark-theme]) .cg-model-zap[data-on=\"true\"][data-mode=\"tree\"] .cg-model-zap-glyph { filter: drop-shadow(0 0 5px #f7c9488c); }\n\n/* No `animation` here on purpose. This selector is (0,2,1) and the reduced-motion stop on\n\n   `.cg-model-popover` is (0,1,0) — a media query adds no specificity — so an entrance animation\n\n   declared here kept playing in light + reduced motion while dark stayed still. The entrance comes\n\n   from the base `.cg-model-popover` rule above; the reduced-motion block cancels it for both themes. */\n\nbody:not([data-ds-dark-theme]) .cg-model-popover { border-color: #e6e6e6; box-shadow: 0 6px 14px #0000000f, 0 0 0 1px #00000008; }\n\nbody:not([data-ds-dark-theme]) .cg-model-slider-shell[data-ultra=\"true\"] .cg-model-thumb { box-shadow: 0 0 0 1px #0000000f; }\n\nbody:not([data-ds-dark-theme]) .cg-model-ultra-notice { color: #7a5cc4; }\n\nbody:not([data-ds-dark-theme]) .cg-model-root[data-superfast=\"true\"] .cg-model-ultra-notice { color: #b8860b; }\n\nbody:not([data-ds-dark-theme]) .cg-model-popover[data-ultra=\"true\"] .cg-model-slider-shell::before,\n\nbody:not([data-ds-dark-theme]) .cg-model-popover[data-superfast=\"true\"] .cg-model-slider-shell::before,\n\nbody:not([data-ds-dark-theme]) .cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell::before,\n\nbody:not([data-ds-dark-theme]) .cg-model-slider-shell[data-effort=\"max\"]:not([data-ultra=\"true\"])::before { box-shadow: none; }\n\nbody:not([data-ds-dark-theme]) .cg-model-popover[data-superfast=\"true\"] .cg-model-slider-dots span[data-ultra=\"true\"] { box-shadow: none; }\n\nbody[data-ds-dark-theme] .cg-model-popover { background-color: var(--cg-page); border-color: #444; box-shadow: 0 6px 14px #00000059; }\n\nbody[data-ds-dark-theme] .cg-model-popover[data-pane=\"model\"] { background-color: var(--cg-page); }\n\nbody[data-ds-dark-theme] .cg-model-popover[data-pane=\"model\"] .cg-model-option[aria-checked=\"true\"] { background: #404043; color: #ececec; }\n\nbody[data-ds-dark-theme] .cg-model-trigger[aria-expanded=\"true\"] { background: #404043; }\n\n/* ------------------------------------------------------------------------------------------------\n   Orchestration modes own the whole rail.\n\n   The panel writes `data-lightning` and `data-superfast` on the root and repeats them on the popover.\n   Only `=\"true\"` matches: the standard mode writes `\"false\"` on both, so every rule in this block drops\n   out and the per-tier ramp above is left exactly as it was.\n\n   The fill selectors are keyed on the shell instead of a tier id, which puts them one class above the\n   tier rules (0,3,0) and lets an id this file has never seen — or one a model invents — take the mode\n   colour instead of falling back to blue. Off/none keep painting nothing: the transparent stops at\n   (0,3,0) are still outranked by these, so the empty tiers are restated at the end of the block.\n\n   The gold side already exists above for every named tier. What it did not cover is a tier it does not\n   name: that id kept the neutral --cg-glow, so the halo, the sweep and the meteor heads lost their gold.\n   The base rule at the end of this block fills that one hole; the named rules are one class deeper and\n   still pick their own depth. */\n\n/* Fast wears upstream Ultra's purple. The light fill is upstream's own three-stop value; the dark\n   version lifts every stop instead of reusing the light one, because the same purple over #212121\n   reads as a dark bruise rather than as the mode's colour. */\n.cg-model-root[data-lightning=\"true\"] .cg-model-slider-shell .cg-model-slider-fill {\n  background: linear-gradient(95deg, #5055f5 0%, #bb74ff 58%, #793af5 100%);\n}\n\nbody[data-ds-dark-theme] .cg-model-root[data-lightning=\"true\"] .cg-model-slider-shell .cg-model-slider-fill {\n  background: linear-gradient(95deg, #6f74ff 0%, #c98cff 58%, #8f49ff 100%);\n}\n\n/* --cg-effort-color paints the headline, the bolt and the summary; --cg-glow paints the popover\n   border, the halo, the sweep and the meteor heads. Both live on the popover because that is where\n   this file declares them and where the per-tier values are set. `[data-effort]` on the glow rule is\n   not a tier test: the attribute is always there, and one extra class is what lets this value beat\n   the per-tier glow rules above instead of tying with them and losing on order. */\n.cg-model-root[data-lightning=\"true\"] .cg-model-popover { --cg-effort-color: #8a4ff0; }\n.cg-model-root[data-lightning=\"true\"] .cg-model-popover[data-effort] { --cg-glow: #bb74ff; }\n\nbody[data-ds-dark-theme] .cg-model-root[data-lightning=\"true\"] .cg-model-popover { --cg-effort-color: #bb74ff; }\nbody[data-ds-dark-theme] .cg-model-root[data-lightning=\"true\"] .cg-model-popover[data-effort] { --cg-glow: #c98cff; }\n\n/* The collapsed trigger carries the same bolt, so it has to carry the same two colours: purple while\n   Fast is armed and gold for the tree. The base rule's #6f5bc4 is the standard-mode bolt. */\n.cg-model-root[data-lightning=\"true\"] .cg-model-trigger-bolt { color: #8a4ff0; }\n.cg-model-root[data-superfast=\"true\"] .cg-model-trigger-bolt { color: #e8a317; }\n\n/* Reached dots and the knob wear the same colour as the bar, so the mode reads as one object. Their\n   shapes and sizes are untouched; only the hairline and the glow change. The light theme follows the\n   file's existing policy and keeps a coloured hairline without the coloured halo, while the dark\n   theme keeps the soft glow the tier rules already use there. */\n.cg-model-root[data-lightning=\"true\"] .cg-model-slider-dots span[data-on=\"true\"] {\n  background: #f3eaff;\n  box-shadow: 0 0 0 1px #8a4ff066;\n}\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-dots span[data-on=\"true\"] {\n  background: #fff8e6;\n  box-shadow: 0 0 0 1px #e8a31766;\n}\n\n.cg-model-root[data-lightning=\"true\"] .cg-model-slider-shell .cg-model-thumb {\n  box-shadow: 0 0 0 1px #8a4ff099, 0 1px 3px #00000026;\n}\n\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell .cg-model-thumb {\n  box-shadow: 0 0 0 1px #e8a31799, 0 1px 3px #00000026;\n}\n\nbody[data-ds-dark-theme] .cg-model-root[data-lightning=\"true\"] .cg-model-slider-dots span[data-on=\"true\"] {\n  background: #f6efff;\n  box-shadow: 0 0 0 1px #8a4ff099, 0 0 5px #bb74ff80;\n}\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-slider-dots span[data-on=\"true\"] {\n  background: #fff3cf;\n  box-shadow: 0 0 0 1px #e8a31799, 0 0 5px #f7c94880;\n}\n\nbody[data-ds-dark-theme] .cg-model-root[data-lightning=\"true\"] .cg-model-slider-shell .cg-model-thumb {\n  box-shadow: 0 0 0 1px #bb74ffcc, 0 0 9px #a066ffb3, 0 0 18px #8b5cf680, 0 1px 3px #00000040;\n}\n\nbody[data-ds-dark-theme] .cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell .cg-model-thumb {\n  box-shadow: 0 0 0 1px #f0b429cc, 0 0 9px #f7c948a6, 0 0 18px #c8860d80, 0 1px 3px #00000040;\n}\n\n/* The hairline around the track. Light gets the quiet version: the existing light rules drop the\n   coloured rim for the tiers that had one, so the new mode should not reintroduce a loud ring. Dark\n   keeps the soft rim the other orchestration states already wear. */\n.cg-model-root[data-lightning=\"true\"] .cg-model-slider-shell::before {\n  box-shadow: inset 0 0 0 1px #8a4ff04d;\n}\n\nbody:not([data-ds-dark-theme]) .cg-model-root[data-lightning=\"true\"] .cg-model-slider-shell::before {\n  box-shadow: inset 0 0 0 1px #8a4ff02e;\n}\n\nbody[data-ds-dark-theme] .cg-model-root[data-lightning=\"true\"] .cg-model-slider-shell::before {\n  box-shadow: inset 0 0 0 1px #bb74ff5c;\n}\n\n/* The gold glow for an id the per-tier list above does not name. Three classes, deliberately below\n   the named rules' four, so those keep their own depth and only the unknown id lands here. One shared\n   value for both themes: a `body[data-ds-dark-theme]` version would add an element and an attribute,\n   outrank the named rules, and flatten every tier to one glow (observed before this comment existed). */\n.cg-model-root[data-superfast=\"true\"] .cg-model-popover { --cg-glow: #e0b766; }\n\n/* Off and none stay empty in both modes. The mode fill rules are (0,4,0), the shared transparent\n   stops are (0,3,0), so without these a gold/purple bar would appear at a tier that has no fill. */\n.cg-model-root[data-lightning=\"true\"] .cg-model-slider-shell[data-effort=\"off\"] .cg-model-slider-fill,\n.cg-model-root[data-lightning=\"true\"] .cg-model-slider-shell[data-effort=\"none\"] .cg-model-slider-fill,\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"off\"] .cg-model-slider-fill,\n.cg-model-root[data-superfast=\"true\"] .cg-model-slider-shell[data-effort=\"none\"] .cg-model-slider-fill { background: transparent; }\n\n/* The dark Fast fill is one class heavier than the light one (it has to beat the light rule), so the\n   transparent stops above tie with it instead of outranking it. Restating the stops under the same\n   `body[...]` prefix keeps Off empty in the dark theme as well. */\nbody[data-ds-dark-theme] .cg-model-root[data-lightning=\"true\"] .cg-model-slider-shell[data-effort=\"off\"] .cg-model-slider-fill,\nbody[data-ds-dark-theme] .cg-model-root[data-lightning=\"true\"] .cg-model-slider-shell[data-effort=\"none\"] .cg-model-slider-fill { background: transparent; }\n\n@media (prefers-reduced-motion: reduce) {\n.cg-model-ultra-notice,\n\n  .cg-model-popover .cg-model-zap,\n\n  .cg-model-popover .cg-model-summary,\n\n  .cg-model-popover .cg-model-reset { transition: none; }\n}\n\n@media(max-width: 720px) {\n.cg-model-popover { width: min(256px,calc(100vw - 80px)); }\n.cg-model-trigger { max-width: 40vw; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n.cg-model-thumb, .cg-model-slider-fill { transition: none; }\n.cg-model-popover { animation: none; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n.cg-model-meteor, .cg-model-meteors::before,\n\n  .cg-model-slider-shell[data-ultra=\"true\"]::after,\n\n  .cg-model-slider-shell::after,\n\n  .cg-model-slider-shell[data-ultra=\"true\"][data-max=\"true\"] .cg-model-thumb { animation: none; }\n.cg-model-meteor { opacity: .45; }\n.cg-model-slider-shell[data-ultra=\"true\"]::after { opacity: .35; background-position: 50% 0; }\n/* The new sweep parks at its bright midpoint, exactly like the old Ultra rule it replaces, instead\n   of running across the band. The streaks above stay as the static lit field. */\n.cg-model-slider-shell::after { opacity: .35; background-position: 50% 0; }\n/* The drifting deep purple parks in the middle instead of moving, and the bolt's sparkles\n\n     hold a steady glow. */\n\n  .cg-model-slider-shell[data-effort=\"ultra\"] .cg-model-slider-fill::after { animation: none; transform: translateX(30%); }\n.cg-bolt-star { animation: none; opacity: .85; transform: none; }\n.cg-model-zap, .cg-model-zap-glyph { transition: none; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n.cg-model-pane, .cg-model-editor, .cg-model-viewer, .cg-menu, .cg-task-menu { animation: none; }\n.cg-button, .cg-model-option, .cg-model-rename, .cg-model-alias-save, .cg-model-alias-cancel,\n\n  .cg-model-summary, .cg-model-zap, .cg-model-reset, .cg-model-choice, .cg-rail-item,\n\n  .cg-task-menu .cg-button, .cg-task-row .cg-pinned-row { transition: none; }\n}\n\n@media (prefers-reduced-motion: reduce) {\nhtml[data-chatgpt-ui] .cg-model-provider-name::before { transition: none; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n.cg-model-mode { transition: none; }\n}\n\n@keyframes cg-model-enter { from { opacity: 0; transform: translateY(3px) scale(.985); } to { opacity: 1; transform: translateY(0) scale(1); } }\n\n@keyframes cg-bolt-twinkle {\n\n  0%, 100% { opacity: .35; transform: scale(.7); }\n\n  45% { opacity: 1; transform: scale(1.15); }\n\n}\n\n@keyframes cg-model-meteor {\n\n  0% { transform: translateX(-44px); opacity: 0; }\n\n  10% { opacity: 1; }\n\n  72% { opacity: .9; }\n\n  100% { transform: translateX(var(--cg-meteor-travel)); opacity: 0; }\n\n}\n\n@keyframes cg-model-glare {\n\n  0% { background-position: 150% 0; opacity: 0; }\n\n  18% { opacity: .9; }\n\n  70% { opacity: .9; }\n\n  100% { background-position: -60% 0; opacity: 0; }\n\n}\n\n@keyframes cg-model-twinkle { from { opacity: .3; } to { opacity: .6; } }\n\n@keyframes cg-soft-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n";
const React = require('react');
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

const inject = [];

function apply(ctx) {
  // Stylesheet first: a slot registration that throws must not leave the page
  // without the sheet that positions the panel it did manage to mount.
  startStyleWatch();
  registerModelUI(ctx);
}
/**
 * A reference catalogue of model providers, for the picker's "提供商" view.
 *
 * This is **not** a routing table: it does not make a provider available, and nothing here is consulted
 * when a request is sent. It answers one question a reader can have while picking a model — "who makes
 * what, and what did they release?" — so the entries stay at family level on purpose. Exact point
 * releases move every few weeks and a stale number in a reference list is worse than no number, so the
 * list names families and well-known lines, and the view says out loud that it may lag.
 *
 * The list is broad, not exhaustive: it covers the labs whose models a reader actually meets (chat apps,
 * public APIs, open weights) and stops there. Research previews that were never released, in-house-only
 * systems and this month's fine-tune of someone else's weights are deliberately out — as is any entry
 * whose model names could not be stated without guessing.
 *
 * `region` is the two-way split the reader asked for: 国内 / 国外.
 */
const PROVIDER_CATALOG = [
  // ---------------------------------------------------------------- 国内
  {
    id: 'deepseek', name: 'DeepSeek（深度求索）', region: '国内', site: 'https://www.deepseek.com',
    // Verified against the official API docs on 2026-10-10: the current API models are `deepseek-flash`
    // (DeepSeek-V4.1-Flash) and `deepseek-v4-pro` (DeepSeek-V4-Pro-0813); `deepseek-v4-flash` and
    // `deepseek-v4-flash-vision-exp` are retired. This is the one entry verified against a primary source
    // rather than remembered, and the view marks it as such.
    verified: '2026-10-10',
    models: ['deepseek-flash（DeepSeek-V4.1-Flash，当前默认）', 'deepseek-v4-pro（DeepSeek-V4-Pro-0813）', 'DeepSeek-V3 系列（历史版本）', 'DeepSeek-R1 系列（推理，历史版本）', 'DeepSeek-Coder / DeepSeek-VL（专项与多模态）'],
  },
  {
    id: 'alibaba', name: '阿里云 · 通义千问（Qwen）', region: '国内', site: 'https://tongyi.aliyun.com',
    models: ['Qwen3 / Qwen2.5 开源系列', 'Qwen-Max / Plus / Turbo（商用档位）', 'QwQ（推理）', 'Qwen-Coder（代码）', 'Qwen-VL / Qwen-Audio（多模态）', '通义万相（图像与视频生成）'],
  },
  {
    id: 'moonshot', name: '月之暗面（Kimi）', region: '国内', site: 'https://www.moonshot.cn',
    models: ['Kimi K2 系列', 'Kimi K1.5（推理）', 'moonshot-v1（历史版本）', 'Kimi 视觉与长文本能力'],
  },
  {
    id: 'zhipu', name: '智谱 AI（GLM）', region: '国内', site: 'https://www.zhipuai.cn',
    models: ['GLM-4.5 / GLM-4 系列', 'GLM-Z1（推理）', 'GLM-4V（多模态）', 'CogVLM / CogView（视觉理解与生成）', 'CogVideo（视频生成）'],
  },
  {
    id: 'bytedance', name: '字节跳动 · 豆包（Doubao）', region: '国内', site: 'https://www.volcengine.com/product/doubao',
    models: ['Doubao-pro / Doubao-lite（档位）', 'Doubao-1.5 系列', 'Seed 系列（研究与开源）', '豆包视觉与语音模型', '即梦 / Seedance（图像与视频生成）'],
  },
  {
    id: 'baidu', name: '百度 · 文心（ERNIE）', region: '国内', site: 'https://yiyan.baidu.com',
    models: ['ERNIE 4.5 / ERNIE 4 系列', 'ERNIE Speed / Lite（轻量档）', 'ERNIE 3.5（历史版本）', '文心一格（图像生成）'],
  },
  {
    id: 'tencent', name: '腾讯 · 混元（Hunyuan）', region: '国内', site: 'https://hunyuan.tencent.com',
    models: ['Hunyuan-Large / Turbo / Pro', 'Hunyuan-Vision（多模态）', '混元图像与视频生成', 'Hunyuan 开源系列'],
  },
  {
    id: 'minimax', name: 'MiniMax', region: '国内', site: 'https://www.minimax.io',
    models: ['MiniMax-Text 系列', 'MiniMax M1 / M2（推理）', 'abab 系列（历史版本）', '海螺语音与视频生成'],
  },
  {
    id: 'stepfun', name: '阶跃星辰（Step）', region: '国内', site: 'https://www.stepfun.com',
    models: ['Step-2 / Step-1 系列', 'Step-1V / Step-1X（多模态）', 'Step-Audio（语音）', 'Step-Video（视频生成）'],
  },
  {
    id: '01ai', name: '零一万物（Yi）', region: '国内', site: 'https://www.lingyiwanwu.com',
    models: ['Yi-Large / Yi-Medium（商用）', 'Yi-34B / Yi-6B（开源）', 'Yi-VL（多模态）'],
  },
  {
    id: 'huawei', name: '华为 · 盘古（Pangu）', region: '国内', site: 'https://www.huaweicloud.com/product/pangu.html',
    models: ['盘古大模型系列', '盘古 NLP 与多模态', '盘古气象与科学计算', '昇腾上的行业模型'],
  },
  {
    id: 'shanghai-ai', name: '上海人工智能实验室 · 书生（InternLM）', region: '国内', site: 'https://internlm.intern-ai.org.cn',
    models: ['InternLM 系列（开源）', 'InternLM-XComposer（多模态）', 'InternVL 视觉语言系列', '书生·浦语与科学模型'],
  },
  {
    id: 'modelbest', name: '面壁智能 · MiniCPM', region: '国内', site: 'https://www.modelbest.cn',
    models: ['MiniCPM 系列（端侧）', 'MiniCPM-V（多模态）', 'MiniCPM-o（全模态）'],
  },
  {
    id: 'baichuan', name: '百川智能（Baichuan）', region: '国内', site: 'https://www.baichuan-ai.com',
    models: ['Baichuan 4 系列', 'Baichuan 2 / 3（开源历史版本）', '百川医疗增强模型'],
  },
  {
    id: 'ant', name: '蚂蚁集团 · 百灵（Ling）', region: '国内', site: 'https://www.antgroup.com',
    models: ['Ling / Ring 系列（开源）', '百灵大模型', '蚂蚁多模态与代码模型'],
  },
  {
    id: '360', name: '360 · 智脑', region: '国内', site: 'https://ai.360.com',
    models: ['360 智脑系列', '360 多模态与安全模型'],
  },
  {
    id: 'sensetime', name: '商汤 · 日日新（SenseNova）', region: '国内', site: 'https://www.sensetime.com',
    models: ['SenseChat 系列', '日日新 5.x 系列', '商量多模态与视觉模型', '如影 / 秒画（数字人与生成）'],
  },
  {
    id: 'iflytek', name: '科大讯飞 · 星火（Spark）', region: '国内', site: 'https://xinghuo.xfyun.cn',
    models: ['星火 4.0 / 3.5 系列', 'Spark Lite / Pro / Max（档位）', '星火语音与多模态'],
  },
  {
    id: 'kunlun', name: '昆仑万维 · 天工（Skywork）', region: '国内', site: 'https://www.tiangong.cn',
    models: ['天工 3.0 / 2.0 系列', 'Skywork 开源系列', '天工音乐与视频生成'],
  },
  {
    id: 'xverse', name: '元象 · XVERSE', region: '国内', site: 'https://www.xverse.cn',
    models: ['XVERSE 系列（开源）', 'XVERSE-V（多模态）', 'XVERSE-MoE'],
  },
  {
    id: 'meituan', name: '美团 · LongCat', region: '国内', site: 'https://www.meituan.com',
    models: ['LongCat 系列（开源）', '美团行业场景模型'],
  },
  {
    id: 'vivo', name: 'vivo · 蓝心（BlueLM）', region: '国内', site: 'https://www.vivo.com',
    models: ['BlueLM 系列（端侧）', '蓝心大模型云端版', '蓝心多模态'],
  },
  {
    id: 'xiaomi', name: '小米 · MiLM', region: '国内', site: 'https://www.mi.com',
    models: ['MiLM 系列（端侧）', '小米多模态与语音'],
  },
  {
    id: 'oppo', name: 'OPPO · AndesGPT', region: '国内', site: 'https://www.oppo.com',
    models: ['AndesGPT 系列（端侧）', 'OPPO 多模态'],
  },
  {
    id: 'cas', name: '中科院 · 紫东太初', region: '国内', site: 'https://www.ia.ac.cn',
    models: ['紫东太初系列（多模态）', '紫东太初开放平台'],
  },
  {
    id: 'netease', name: '网易 · 伏羲 / 玉言', region: '国内', site: 'https://fuxi.163.com',
    models: ['玉言系列（开源）', '伏羲行业模型与数字人'],
  },
  {
    id: 'jd', name: '京东 · 言犀', region: '国内', site: 'https://www.jd.com',
    models: ['言犀系列', '京东零售与供应链场景模型'],
  },
  {
    id: 'kuaishou', name: '快手 · 快意 / 可灵', region: '国内', site: 'https://www.kuaishou.com',
    models: ['KwaiYii（快意）语言模型', '可灵 Kling（视频生成）', '快手多模态模型'],
  },
  {
    id: 'mobvoi', name: '出门问问 · 序列猴子', region: '国内', site: 'https://www.mobvoi.com',
    models: ['序列猴子系列', '出门问问语音与生成模型'],
  },
  {
    id: 'langboat', name: '澜舟科技 · 孟子', region: '国内', site: 'https://www.langboat.com',
    models: ['孟子系列（开源与商用）', '澜舟金融与文档模型'],
  },
  {
    id: 'baai', name: '智源研究院 · Aquila / Emu', region: '国内', site: 'https://www.baai.ac.cn',
    models: ['Aquila 系列（开源）', 'Emu 多模态系列', '悟道系列（历史版本）'],
  },
  {
    id: 'intellif', name: '云天励飞 · 云天天书', region: '国内', site: 'https://www.intellif.com',
    models: ['云天天书系列', '边缘视觉与多模态模型'],
  },

  // ---------------------------------------------------------------- 国外
  {
    id: 'openai', name: 'OpenAI', region: '国外', site: 'https://openai.com',
    models: ['GPT-5 系列', 'GPT-4.1 / GPT-4o', 'o 系列（推理）', 'Codex（编码）', 'GPT-3.5（历史版本）', 'Whisper（语音）', 'DALL·E / Sora（生成）'],
  },
  {
    id: 'anthropic', name: 'Anthropic · Claude', region: '国外', site: 'https://www.anthropic.com',
    models: ['Claude Opus 系列', 'Claude Sonnet 系列', 'Claude Haiku 系列（轻量）', 'Claude 3.x / 2（历史版本）'],
  },
  {
    id: 'google', name: 'Google · Gemini', region: '国外', site: 'https://deepmind.google/models/gemini/',
    models: ['Gemini 2.5 Pro / Flash', 'Gemini 2.0 系列', 'Gemma（开源）', 'PaLM 2（历史版本）', 'Imagen / Veo（生成）'],
  },
  {
    id: 'meta', name: 'Meta · Llama', region: '国外', site: 'https://www.llama.com',
    models: ['Llama 4 系列', 'Llama 3.x 系列', 'Llama 2（历史版本）', 'Code Llama'],
  },
  {
    id: 'mistral', name: 'Mistral AI', region: '国外', site: 'https://mistral.ai',
    models: ['Mistral Large / Medium / Small', 'Magistral（推理）', 'Codestral / Devstral（代码）', 'Pixtral（多模态）'],
  },
  {
    id: 'xai', name: 'xAI · Grok', region: '国外', site: 'https://x.ai',
    models: ['Grok 4 系列', 'Grok 3 系列', 'Grok 2（历史版本）', 'Grok 视觉与图像生成'],
  },
  {
    id: 'cohere', name: 'Cohere', region: '国外', site: 'https://cohere.com',
    models: ['Command A', 'Command R+ / R', 'Embed / Rerank（检索配套）', 'Aya（开源多语）'],
  },
  {
    id: 'amazon', name: 'Amazon · Nova', region: '国外', site: 'https://aws.amazon.com/ai/generative-ai/nova/',
    models: ['Nova Premier / Pro', 'Nova Lite / Micro', 'Nova Canvas / Reel（生成）', 'Titan（历史版本）'],
  },
  {
    id: 'microsoft', name: 'Microsoft · Phi', region: '国外', site: 'https://azure.microsoft.com/products/ai-foundry',
    models: ['Phi-4 系列', 'Phi-3 系列', 'Azure OpenAI 上的 OpenAI 模型'],
  },
  {
    id: 'ai21', name: 'AI21 Labs', region: '国外', site: 'https://www.ai21.com',
    models: ['Jamba 系列', 'Jurassic（历史版本）'],
  },
  {
    id: 'nvidia', name: 'NVIDIA · Nemotron', region: '国外', site: 'https://build.nvidia.com',
    models: ['Nemotron 系列', 'NeMo 微调与工具链', 'NIM 推理微服务'],
  },
  {
    id: 'allenai', name: 'Allen Institute · OLMo', region: '国外', site: 'https://allenai.org',
    models: ['OLMo 2 系列（完全开源）', 'Tülu（指令微调）', 'Molmo（多模态）'],
  },
  {
    id: 'perplexity', name: 'Perplexity', region: '国外', site: 'https://www.perplexity.ai',
    models: ['Sonar 系列（联网检索）', '基于第三方模型的在线问答'],
  },
  {
    id: 'tii', name: 'TII · Falcon', region: '国外', site: 'https://falconllm.tii.ae',
    models: ['Falcon 系列（开源）', 'Falcon-H1 / Falcon 2', 'Falcon 视觉与嵌入模型'],
  },
  {
    id: 'databricks', name: 'Databricks · DBRX', region: '国外', site: 'https://www.databricks.com',
    models: ['DBRX（开源 MoE）', 'Mosaic 训练栈', 'Databricks 上的第三方模型'],
  },
  {
    id: 'ibm', name: 'IBM · Granite', region: '国外', site: 'https://www.ibm.com/granite',
    models: ['Granite 系列（开源）', 'Granite Code（代码）', 'watsonx 上的企业模型'],
  },
  {
    id: 'snowflake', name: 'Snowflake · Arctic', region: '国外', site: 'https://www.snowflake.com',
    models: ['Arctic 系列（开源）', 'Cortex 上的第三方模型'],
  },
  {
    id: 'reka', name: 'Reka AI', region: '国外', site: 'https://www.reka.ai',
    models: ['Reka Core / Flash / Edge', 'Reka 多模态系列'],
  },
  {
    id: 'aleph-alpha', name: 'Aleph Alpha', region: '国外', site: 'https://www.aleph-alpha.com',
    models: ['Luminous 系列', 'Pharia 系列'],
  },
  {
    id: 'naver', name: 'Naver · HyperCLOVA X', region: '国外', site: 'https://clova.ai',
    models: ['HyperCLOVA X 系列', 'CLOVA 语音与视觉'],
  },
  {
    id: 'yandex', name: 'Yandex · YandexGPT', region: '国外', site: 'https://ya.ru/ai',
    models: ['YandexGPT 系列', 'Yandex 视觉与语音模型'],
  },
  {
    id: 'samsung', name: 'Samsung · Gauss', region: '国外', site: 'https://www.samsung.com',
    models: ['Gauss 系列（端侧与云端）', 'Samsung 多模态'],
  },
  {
    id: 'apple', name: 'Apple · Apple Intelligence', region: '国外', site: 'https://www.apple.com/apple-intelligence/',
    models: ['Apple Intelligence 基础模型（端侧与云端）', 'OpenELM（开源）', 'Apple 视觉与语音模型'],
  },
  {
    id: 'stability', name: 'Stability AI', region: '国外', site: 'https://stability.ai',
    models: ['StableLM 系列', 'Stable Diffusion 系列', 'Stable Audio / Video'],
  },
  {
    id: 'inflection', name: 'Inflection AI', region: '国外', site: 'https://inflection.ai',
    models: ['Inflection 系列', 'Pi 助手'],
  },
  {
    id: 'writer', name: 'Writer · Palmyra', region: '国外', site: 'https://writer.com',
    models: ['Palmyra 系列', 'Writer 企业知识模型'],
  },
  {
    id: 'liquid', name: 'Liquid AI · LFM', region: '国外', site: 'https://www.liquid.ai',
    models: ['LFM 系列（端侧）', 'Liquid 基础模型'],
  },
  {
    id: 'together', name: 'Together AI', region: '国外', site: 'https://www.together.ai',
    models: ['开源模型的托管与微调', '自研推理栈'],
  },
];

/** Regions in display order, so the view can group without hardcoding the split twice. */
const PROVIDER_REGIONS = ['国内', '国外'];

/** The catalogue, grouped by region and in the order above. */
function providerGroups(catalog = PROVIDER_CATALOG) {
  return PROVIDER_REGIONS
    .map(region => ({ region, providers: catalog.filter(provider => provider.region === region) }))
    .filter(group => group.providers.length > 0);
}

/**
 * Display names, kept in this browser.
 *
 * The panel used to publish these names to the Host so a prompt section could name the model; that
 * host half is gone, so this module is now storage only. A name changes what the list paints, and
 * nothing else — the model actually in use is always the one the host directory reports.
 *
 * Keyed `provider/model`: two accounts can offer the same model id, and one account's name must not
 * rename the other's model.
 */
const ALIASES_KEY = 'dsh-codex-ui/model-aliases';

/** The stored map, read defensively: a broken entry must not take the panel down. */
function readAliases() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ALIASES_KEY) ?? '{}');
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}


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

  function ModelControl({ locked, available, directory, load, select, sessionId, gear: gearApi, renderSlot }) {
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

    // Official model labels live in the `conversation.input.model.label` slot — the "1017" release badge
    // is one such contribution. This panel replaces the whole composer control, so it has to render that
    // slot itself; otherwise every decoration the platform adds next to a model name silently disappears.
    // A user-defined display name still wins: it is this panel's own feature, and the label slot only
    // knows the catalog name. `renderSlot` is a standard prop of a slot component; tests pass none.
    const labelFor = (group, model, placement, selected = false) => {
      const own = aliases?.[aliasKey(group.id, model.id)];
      if (own) return own;
      if (typeof renderSlot !== 'function') return model.name;
      try {
        const node = renderSlot(
          'conversation.input.model.label',
          { provider: group, model, placement, selected },
          { fallback: model.name },
        );
        return node ?? model.name;
      } catch {
        return model.name;
      }
    };
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
          h('span', null, [labelFor(group, model, 'option', isCurrent)]),
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
          h('span', null, [labelFor(group, model, 'option', isCurrent)]),
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
          h('span', { className: 'cg-model-summary-name' }, [chosen ? labelFor(chosen.group, chosen.model, 'menu') : modelName, h(Icon, { name: 'chevron', size: 11 })])
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
        h('span', { className: 'cg-model-trigger-name' }, [chosen ? labelFor(chosen.group, chosen.model, 'trigger') : modelName]),
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

const safeApply=(ctx)=>{try{return apply(ctx);}catch(error){console.error("dsh-model-gear activation:",error);throw error;}};return {apply:safeApply,inject,registerModelUI};}});
