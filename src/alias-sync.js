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
export const ALIASES_KEY = 'dsh-codex-ui/model-aliases';

/** The stored map, read defensively: a broken entry must not take the panel down. */
export function readAliases() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ALIASES_KEY) ?? '{}');
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
