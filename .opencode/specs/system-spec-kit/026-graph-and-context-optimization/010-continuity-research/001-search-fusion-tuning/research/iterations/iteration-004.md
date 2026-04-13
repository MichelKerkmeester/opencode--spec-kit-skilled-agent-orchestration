# Iteration 4: Adaptive Fusion Profile Analysis

## Focus
Identify the live fusion weights that shape hybrid retrieval for different intents and normalize them into continuity-relevant recommendations.

## Findings
1. Adaptive fusion ships with intent-specific profiles, not a single global weight set. Examples: `understand` starts at `0.7/0.2/0.1/0.15` (semantic/keyword/recency/graph), while `find_decision` starts at `0.3/0.2/0.1/0.5`. [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60]
2. The profiles are normalized whenever active weights sum above `1.0`, so the effective `understand` blend is approximately `semantic 0.6087 / keyword 0.1739 / recency 0.0870 / graph 0.1304`, and `find_spec` normalizes to `semantic 0.5385 / keyword 0.1538 / recency 0.0769 / graph 0.2308`. [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:82] [INFERENCE: packet-local normalization calculation from the declared profile sums]
3. `hybrid-search.ts` applies those adaptive weights directly when building fusion lists, setting vector and keyword weights explicitly and optionally overriding graph weight. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221]

## Ruled Out
- None this iteration.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60`
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:82`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221`

## Assessment
- New information ratio: 0.62
- Questions addressed: `RQ-1`
- Questions answered: none

## Reflection
- What worked and why: Reading the shared algorithm plus the hybrid caller showed the effective control path end to end.
- What did not work and why: The packet framing still overemphasizes JSON config even though the weight profiles are embedded in shared TypeScript.
- What I would do differently: Bring in the RRF K analysis next, because weights alone do not explain top-heaviness.

## Recommended Next Focus
Review the K-sensitivity analysis and intent-specific K optimization harness to map weight profiles onto rank-position sensitivity.
