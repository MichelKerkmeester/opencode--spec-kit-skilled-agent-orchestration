# Iteration 1: Router Constants And Tier1 Hard Rules

## Focus
Extract the router constants, category set, and hard Tier1 rule inventory before measuring anything else so later iterations can compare the spec's framing against the live implementation.

## Findings
1. The live router defines eight routing categories and four confidence-related constants: `0.70` for Tier1, `0.70` for Tier2, `0.50` for Tier3, and a `0.15` Tier2 fallback penalty. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:5] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/spec.md:12]
2. The code currently contains eight hard Tier1 rules, not seven: four structured routes (`decision`, `handover`, `research`, `task_update`), one structured metadata route, and three hard drops (`toolCalls`, transcript wrapper, placeholder boilerplate). [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:286] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:76]
3. The hard-rule library is ordered, so the first matching rule wins before any heuristic scoring or prototype similarity runs. That makes structured fields and transcript-like wrappers dominant over lexical cues. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:809] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:167]
4. The spec packet's RQ wording says "7 Tier1 rules," which is already stale against the current source and should be treated as a documentation mismatch, not an implementation bug. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/spec.md:28] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:286]

## Ruled Out
- Historical save-log mining. The packet scope and current memory model explicitly require synthetic payloads instead.

## Dead Ends
- Treating the spec's "7 rules" text as authoritative. The code clearly ships eight hard rules today.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:5`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:286`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:76`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/spec.md:12`

## Assessment
- New information ratio: 0.95
- Questions addressed: RQ-1, RQ-2
- Questions answered: none yet

## Reflection
- What worked and why: Direct source inspection worked because the constants, rule library, and tests are all explicit and colocated.
- What did not work and why: Relying on the spec wording did not work because the packet question text has already drifted from the implementation.
- What I would do differently: Move immediately from static rule inventory into heuristic and target mapping so the next pass can connect rules to downstream behavior.

## Recommended Next Focus
Extract the heuristic cue tables, target mapping, and Tier2 prototype library to understand what happens when the hard rules do not fire.
