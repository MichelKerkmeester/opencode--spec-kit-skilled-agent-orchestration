# Iteration 6: Continuity Query Mapping

## Focus
Map the discovered fusion controls onto continuity-oriented query behavior and determine whether `search-weights.json` can materially improve canonical continuity retrieval.

## Findings
1. Continuity-style queries align more closely with `find_spec` and `find_decision` than with the default profile, because those profiles keep recency low while materially increasing graph or source-of-truth bias. [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60] [INFERENCE: continuity asks for canonical packets, decision lineage, and spec docs rather than freshness]
2. The Stage 2 recency contribution is already low (`0.07`, cap `0.10`), so raising recency would move continuity search in the wrong direction; the stronger tuning lever is graph/spec weighting plus intent-specific K. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:125] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:139]
3. `search-weights.json` can still matter for vector-only smart ranking, but it is a secondary lever for this packet because hybrid fusion bypasses it. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:964] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/README.md:43]

## Ruled Out
- Using `search-weights.json` as the primary continuity tuning surface.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:125`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:964`
- `.opencode/skill/system-spec-kit/mcp_server/configs/README.md:43`

## Assessment
- New information ratio: 0.46
- Questions addressed: `RQ-1`
- Questions answered: `RQ-1`

## Reflection
- What worked and why: Separating vector-only ranking from hybrid fusion made the packet question answerable instead of ambiguous.
- What did not work and why: There is still no dedicated `continuity` intent profile in code, so the recommendation is a mapping rather than a direct existing flag.
- What I would do differently: Validate reranker quality and fallback behavior next so the later threshold advice has concrete support.

## Recommended Next Focus
Inspect provider fixture quality and fallback score behavior to calibrate reranking recommendations.
