# Iteration 2: Heuristic Cues, Targets, And Prototypes

## Focus
Map the non-hard Tier1 heuristics, the category-to-target mapping, and the Tier2 prototype library so later measurement can explain both predictions and merge destinations.

## Findings
1. Tier1 heuristic scoring is cue-driven and asymmetric: each cue regex adds `0.18`, but some categories also receive floor boosts, such as `narrative_progress` at `0.72`, `narrative_delivery` at `0.74`, `decision` at `0.76`, `task_update` at `0.90`, `handover_state` at `0.84`, `research_finding` at `0.80`, `metadata_only` at `0.93`, and `drop` at `0.92`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:340] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:842]
2. Target selection is deterministic by category: progress and delivery append paragraphs to `implementation-summary.md`, research and handover append sections, tasks update a phase anchor, metadata writes `_memory.continuity`, and `decision` switches between ADR insertion on `L3/L3+` and in-place summary updates on `L1/L2`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:918] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:92]
3. The Tier2 library is balanced structurally: five prototypes per category across all eight categories, with labels, tags, and negative hints. That makes prototype coverage broad enough for a synthetic corpus without inventing a separate labeling scheme. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:415]
4. Several prototype texts intentionally contain overlapping language such as "verification," "same-pass alignment," "research," or "current state," which means the library is designed to expose confusion pressure rather than remove it. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:47] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:173]

## Ruled Out
- Assuming the prototype library is sparse or skewed toward one category. It is balanced by count.

## Dead Ends
- Treating Tier2 as independent from target selection. The prototype scorer still inherits the same `buildTarget()` mapping as Tier1 and Tier3.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:340`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:842`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:918`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1`

## Assessment
- New information ratio: 0.88
- Questions addressed: RQ-1, RQ-3
- Questions answered: none yet

## Reflection
- What worked and why: Reading the cue table beside the target builder made it easy to see which mistakes would be classification errors versus merge-target errors.
- What did not work and why: Prototype labels alone were not enough; the negative hints and example phrasing matter for understanding likely confusions.
- What I would do differently: Check the Tier3 prompt and actual save-handler wiring next so the threshold discussion is grounded in the real runtime, not only the router contract.

## Recommended Next Focus
Inspect the Tier3 prompt contract, Tier3 cache conditions, and the memory-save integration path to determine whether the LLM tier is actually active in the canonical save flow.
