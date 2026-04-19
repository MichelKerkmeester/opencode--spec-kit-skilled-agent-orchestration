# Iteration 13: Handover Versus Drop Heuristic Collision

## Focus
Identify the exact regexes and score floors that cause legitimate handover content to be treated as `drop`.

## Findings
1. The `drop` heuristic currently mixes hard wrapper signals with soft operational command signals in the same cue bucket. The regex block includes transcript wrappers and boilerplate (`conversation transcript`, `tool telemetry`, `table of contents`) alongside command-oriented phrases like `git diff`, `list memories`, and `force re-index`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369]
2. That mixed bucket is amplified by an unconditional `0.92` drop floor whenever `assistant:`, `user:`, `tool:`, `recovery scenarios`, `table of contents`, or `git diff` appears. Handover, by contrast, only gets a `0.84` floor for `recent action`, `next safe action`, `current state`, or `resume`. In a mixed chunk containing both `resume` and `git diff`, `drop` wins numerically before Tier2 or Tier3 can help. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:868] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:877]
3. The hard-negative extraction step reinforces that shape. `extractHardNegativeFlags()` only tags transcript-like, boilerplate, and metadata-like language, but the final natural-decision ladder only treats those as `mixed_signals` when the winning Tier1 category is not already `drop`. If `drop` wins first, the chunk skips that disambiguation path entirely. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:892] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:904]
4. Phase `002-fix-handover-drop-confusion` should therefore split the drop heuristic into two classes: hard wrapper evidence that still deserves the `0.92` floor, and soft operational commands that should either score much lower or defer to handover when strong stop-state cues (`current state`, `next session`, `resume`, `blocker`) are also present. That is the smallest change that matches the phase scope without touching downstream handover handling. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/002-fix-handover-drop-confusion/spec.md:10] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369]

## Ruled Out
- Treating every command mention inside a handover chunk as proof that the content is generic operator boilerplate.

## Dead Ends
- Keeping `git diff` in the same severity class as transcript wrappers and table-of-contents scaffolding.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:868`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:892`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/002-fix-handover-drop-confusion/spec.md:10`

## Assessment
- New information ratio: 0.71
- Questions addressed: RQ-8
- Questions answered: none

## Reflection
- What worked and why: Reading the score floors and the trigger-reason ladder together made the `drop` dominance obvious.
- What did not work and why: Looking only at the cue text missed how the numeric floor prevents later recovery.
- What I would do differently: Always compare category floor values when analyzing routing conflicts, not just regex contents.

## Recommended Next Focus
Check whether the handover and drop prototype sets reinforce or soften this heuristic collision, and identify which examples should guide the implementation-phase regression tests.
