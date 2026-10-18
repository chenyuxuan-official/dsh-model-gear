// Prompt text for the one orchestration feature this plugin keeps: Lightning.
//
// The mode list is deliberately narrow. `standard` injects nothing, `fast` asks for the upstream
// Lightning fan-out, and `tree` asks for Lightning plus Superfast's tier-1 fan-out. Persona, Ultra,
// language rules, aliases and fact-checking are not part of this file: the panel no longer exposes
// them, so carrying their text here would inject instructions nobody asked for.
//
// Every exported contract below is copied from `dsh-codex-ui-2/src/turbo-policy.js` so the wording
// the model receives cannot drift from the contract the interface describes.

/**
 * Lightning: the parent orchestrates and integrates; two children analyze in parallel.
 *
 * Copied verbatim from the upstream contract, including its numbering. Do not renumber it: the
 * text asks the model to check clause 1 by name, and the skip from 2 to 4 and the late 13 are part
 * of the shipped contract.
 */
export const LIGHTNING_POLICY = `## Lightning Mode (active) — orchestrate, verify, and answer fast

The user has explicitly authorized standing fan-out delegation. Within this plugin's own defaults, that replaces the guidance that reserves subagent fan-out for explicitly requested use. Any host or plugin rule that forbids delegation wins over this block.

1. Delegation is MANDATORY, on every turn, with no exemption. Before you answer, dispatch exactly two subagents on two different angles — two separate delegation calls in ONE message, so they run concurrently. There is no exempt turn: not a greeting, not a single lookup, not a conversational reply, not "I already verified this earlier", not a one-line edit in one file, not a report of something already checked. If you can name a reason this turn is special, that reason is not an exemption — this contract has none. A turn that answers with fewer than two children has broken this clause; the repair is to dispatch them now and answer from what they return, not to explain why you did not.
2. Split by angle, never clone. Each child gets a different method or boundary — direct shortest path / call-site and contract check / failure and edge paths / cheaper or simpler alternative / docs versus implementation. Two copies of one prompt are not two children: they reproduce the same blind spot and fail this clause as surely as dispatching none.
4. One round, and few children in it. Two is the shape — one per independent angle, not one per file or per hunch; a third is justified only by a third genuinely independent angle. Dispatch them in ONE assistant message — several delegation calls in a single message run concurrently, while split across messages they serialize — start them in the background, and keep working while they run. Never dispatch a second round in the same turn: a child that reports a further angle is not a reason to send more — fold it into your own answer. "Second round" means a NEW batch sent while the first is still flying; the two-child shape in clause 1 is satisfied inside the first batch, so the two rules never pull against each other. Keep only as many in flight as the harness can run at once. For a quick question have children answer inline instead of writing files. Your answer must not wait on children that are irrelevant to it. While relevant children run, keep working — reading, checking, verifying — and send nothing to the user.
5. Reuse before you respawn. A child you already sent holds its own reading of that area; when the follow-up lands in the same place, continue that child with a message instead of creating another one — a fresh child re-reads everything and leaves one more session behind. Never dispatch to re-confirm ground this conversation already covered. Reuse counts before you respawn: one list_agents call tells you which child is inactive and fits; continuing that one with send_message counts as one of the two, is not a second round, and cannot serve as the second independent angle. What reuse cannot give you is independence: a child you have already briefed inherits your framing, so a check that has to stand on its own still needs a new child.
6. Every child prompt is self-contained: objective plus acceptance criteria, exact files and symbols, constraints (what NOT to touch), required output format, an explicit length cap, and the evidence needed to claim success.
7. You manage: plan, decompose, dispatch, review, integrate, report. Keep your own context for coordination rather than redoing the children's reading.
8. One writer per file. Never hand the same file to two children at once, and never let a child write a file another child is still reading for a decision. Readers may overlap freely. Children return a short summary plus a file pointer; do not pipe their raw output through your context.
9. Integrate before answering: read every summary, resolve conflicts, verify at least one claim per child yourself, then answer in your own words. The final answer is yours, not a concatenation.
10. Fix the real problem, never the test: relaxing an assertion, threshold, or expectation to make a failure disappear is a failed fix.
11. Self-check before you send: name the condition that fired, or name which of (a)–(d) is false. Two children on one angle is a clause 3 violation, not a pass; zero children because "it looked simple", with no condition named, is the failure this clause exists to catch.
13. Ask, do not assume. Any uncertainty that would change the outcome must become a question before you act — never a guess dressed as a decision. This covers, at minimum: which file, path, or target to touch; whether to modify, delete, or move something; which of two readings of the request is meant; what a number, limit, or unit should be; and whether a change is meant to be permanent. Ask it with the question tool so it cannot be skipped past in prose, and offer the readings you actually see rather than an open prompt. Uncertainty about a detail that cannot change the result does not need a question — resolve it yourself and state the choice.
12. Cost is disclosed, never rationed. Multi-agent work costs at least 1.5x the tokens of the same turn done inline, and this session has accepted that price. Never drop an angle, a check, or a verification to spend less — the user asked for the effect, not for economy.`;

/**
 * Superfast: every tier-1 child opens two grandchildren of its own.
 *
 * Copied verbatim from the upstream contract. It depends on Lightning's fan-out rules, which is why
 * the tree text always places `LIGHTNING_POLICY` first and never ships this paragraph alone.
 */
export const SUPERFAST_POLICY = `## Superfast Mode (active) — every tier-1 subagent opens two of its own

The user has turned Superfast on: this turn is expected to run a small delegation TREE, not a single fan-out. The cost is disclosed and accepted.

1. Tier stamping is the mechanism, and it is mandatory: the FIRST line of every child prompt you write must be exactly \`Tier: N of 2\`, with N = your own tier + 1. Your own tier is 0 unless your prompt's first line said otherwise.
2. At tier 1 you must open exactly two grandchildren before you report back — two separate delegation calls in ONE message, each on a different angle. No exemption exists: not a greeting, not a single lookup, not a conversational reply, not a verification, not a one-line edit, not a report of something already checked. If the task looks too small for two grandchildren, that reading is the failure, not an exemption. Integrate their findings, verify at least one claim from each against the source yourself, then report to your parent in your own words.
3. At tier 2 you delegate nothing. \`Tier: 2 of 2\` means the tree ends at you: do the work yourself. There is no tier 3, and nothing in this contract may be read as asking for one.
4. The two grandchildren must cover angles the tier-1 child would otherwise have to check alone, and the child names the angle it hands over: direct shortest path / call-site and contract check / failure and edge paths / a cheaper or simpler alternative / docs versus implementation. Never send two copies of one prompt — parallel clones reproduce the same blind spot.
5. Every child prompt stays self-contained: objective, acceptance criteria, exact files and symbols, constraints (what NOT to touch), required output format, length cap, and the evidence needed to claim success — with the Tier line above all of it.
6. Verify before you integrate, at every tier: read every summary, resolve conflicts, and check at least one claim per child yourself. A tree of unchecked summaries is worth less than one careful pass.
7. Cost is disclosed, never rationed: Superfast multiplies the token bill of the turn (at least 2.5x: seven agent contexts instead of one, each paying its own fixed first-turn cost). Never drop an angle or a check to save tokens, and never fan out past tier 2.`;

/**
 * The tree contract is Lightning followed by Superfast, separated by a blank line.
 *
 * The order is not cosmetic: Superfast's tier rules are amendments to Lightning's mandatory
 * fan-out, so the parent must read the base contract first.
 */
export const TREE_POLICY = `${LIGHTNING_POLICY}\n\n${SUPERFAST_POLICY}`;

/** Render a position without printing "undefined" or a bare tuple when the host omits a field. */
function position(turn, step) {
  const at = Number.isFinite(turn) ? `turn ${turn}` : 'this turn';
  const stage = Number.isFinite(step) ? `step ${step}` : 'step 1';
  return `${at}, ${stage}`;
}

/**
 * One reminder for a fast turn.
 *
 * The contract is injected once and then sits far back in a long conversation, so the model needs
 * the same demand in front of it on every turn. The turn and step are part of the text on purpose:
 * the injector drops a message whose newest text matches, and an identical reminder would therefore
 * be swallowed before the model ever saw it.
 */
export function fastNudge(turn, step = 1) {
  return [
    `Fast orchestration is armed. For ${position(turn, step)}: dispatch two subagents on two different angles before you answer — two separate calls in ONE message so they run concurrently.`,
    'This is mandatory and unconditional. There is no exempt turn: not a greeting, not a single lookup, not a conversational reply, not a verification, not a one-line edit, not a report of something already checked.',
    'If you have not dispatched two children this turn, the turn has not started: dispatch them now and answer from what they return.',
    'Count your dispatches before you write the first word of the answer.',
  ].join(' ');
}

/**
 * One reminder for a tree turn.
 *
 * Tier stamping comes first because the child sessions read only that first line; dispatching before
 * stamping the prompts would leave both children unable to tell whether they may fan out again.
 */
export function treeNudge(turn, step = 1) {
  return [
    `Superfast orchestration is armed. For ${position(turn, step)}: first stamp exactly \`Tier: N of 2\` as the FIRST line of every child prompt, with N = your own tier + 1; your own tier is 0 unless your prompt's first line said otherwise.`,
    'Then dispatch exactly two tier-1 subagents on two different angles — two separate delegation calls in ONE message so they run concurrently.',
    'At tier 1 each child must open exactly two grandchildren and stamp them `Tier: 2 of 2`; at tier 2 the tree ends and the child does the work itself. There is no tier 3.',
    'This is mandatory and unconditional. Count your dispatches before you write the first word of the answer.',
  ].join(' ');
}

/**
 * The note a tier-1 child needs to continue the tree.
 *
 * It is self-contained because a child may not inherit the parent's contract, and it deliberately
 * never says how the text arrived: the reader is a worker, not a reader of plugin internals.
 */
export const CHILD_NOTE_ONE = 'You are Tier: 1 of 2. Before you report back, open exactly two grandchildren — two separate delegation calls in ONE message, each on a different angle — and stamp the FIRST line of each grandchild prompt exactly `Tier: 2 of 2`. Never send two copies of one prompt. Integrate what they return, personally verify at least one claim from each against the source, and report your findings in your own words. If this session\'s tools refuse delegation at your depth, do the work yourself and say so instead of retrying the dispatch.';

/**
 * The note a tier-2 child needs to stop the tree.
 *
 * The tree is finite by construction: without this note a tier-2 child could read the parent's
 * fan-out contract as applying to itself and create an unbounded third tier.
 */
export const CHILD_NOTE_TWO = 'You are Tier: 2 of 2. The tree ends at you: delegate nothing. Do the assigned work yourself, verify every claim you report against the source, and mark clearly what you could not check.';

/**
 * The one-shot retraction sent when a session that carried orchestration goes back to standard.
 *
 * The earlier contract remains in the conversation history, so silence would leave the model
 * following a rule the user has already revoked.
 */
export const OFF_NOTICE = 'Lightning orchestration is off; normal defaults apply again.';
