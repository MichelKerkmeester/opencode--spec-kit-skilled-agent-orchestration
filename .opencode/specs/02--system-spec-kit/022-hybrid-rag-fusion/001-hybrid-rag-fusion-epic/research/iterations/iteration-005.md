# Iteration 5: Fusion Strategy Deep Dive

## Focus
Deep investigation of the RRF fusion algorithm, adaptive fusion layer, query routing integration, and channel weighting to answer Q1 (pipeline improvement opportunities) with the full architecture picture now established from iterations 1-4.

## Findings

### F1: RRF Formula and K Parameter
The core RRF formula is standard SIGIR 2009: `score = weight * 1/(K + rank + 1)` where K defaults to 60. The K value has three-level precedence: (1) caller-provided, (2) `SPECKIT_RRF_K` env override, (3) DEFAULT_K=60. K validation allows zero (explicit support for k=0 noted in code) but rejects negative values. This is well-implemented with clear documentation.
[SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:36,129-143]

### F2: Channel Weight Architecture — Three Conflicting Weight Systems
There are **three separate channel weight systems** that interact in non-obvious ways:

1. **RRF-level weights** (in hybrid-search.ts): vector=1.0, fts=0.8, bm25=0.6, graph=0.5, degree=unweighted(derived)
2. **RRF graph boost** (in rrf-fusion.ts): `GRAPH_WEIGHT_BOOST=1.5` applied when no explicit weight is given for graph source
3. **Adaptive fusion weights** (in adaptive-fusion.ts): 7 intent-specific weight profiles mapping semantic/keyword/recency/graph/causalBias dimensions

The conflict: hybrid-search.ts passes `weight: 0.5` for graph results, which **overrides** the 1.5x graph boost in rrf-fusion.ts (the boost only applies when `weight` is undefined). So the graph boost constant `GRAPH_WEIGHT_BOOST=1.5` is effectively dead for the main hybrid-search pipeline.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:658-661]
[SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:243]

### F3: Convergence Bonus Mechanism
A +0.10 convergence bonus is applied when a result appears in 2+ channels. In `fuseResultsMulti`, the bonus scales linearly: `bonus = 0.10 * (uniqueSourceCount - 1)`. So a result in 3 channels gets +0.20, in 5 channels gets +0.40. This is significant -- a result in all 5 channels gets a 0.40 bonus on top of its RRF scores, which could dominate over rank-based scoring for lower-ranked items.
[SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:266-276]

### F4: Cross-Variant Fusion (Multi-Query RAG)
`fuseResultsCrossVariant` supports multi-dimensional fusion: multiple query variants each produce multiple channel lists. It fuses per-variant first, then merges across variants with an additional cross-variant convergence bonus. This is a sophisticated multi-query RAG pattern (C138-P3). The implementation correctly avoids double-counting the convergence bonus by resetting it during merge.
[SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:366-447]

### F5: Adaptive Fusion is Default-ON but Only Uses 2 of 5 Channels
The `hybridAdaptiveFuse` function only accepts `semanticResults` and `keywordResults` (2 inputs), not all 5 channels. The adaptive weights map to: semantic->vector, keyword->keyword, with recency as a post-fusion boost. **Graph, BM25, FTS, and degree channels are not part of adaptive fusion.** The adaptive layer has separate `graphWeight` and `graphCausalBias` fields in its weight profiles, but these are never consumed by `adaptiveFuse()` -- they exist in the interface but are unused in the fusion function itself.
[SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:191-238]
[SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:17-28]

### F6: Adaptive Fusion FusionWeights.graphWeight is Declared but Unused
The `FusionWeights` interface declares `graphWeight?: number` and `graphCausalBias?: number`, and all 7 intent profiles set values for these (ranging from 0.10 to 0.50 for graphWeight). However, the `adaptiveFuse()` function only processes `semanticWeight` and `keywordWeight` lists. The graphWeight values are computed and returned in the result but never applied to any channel scoring. This is a significant design gap -- the intent-specific graph weights have no effect on fusion.
[SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60-68,196-217]

### F7: Query Router Channel Pruning Strategy
The query router maps complexity tiers to channel subsets with a clear graduated approach:
- **simple**: vector + fts (2 channels, fastest)
- **moderate**: vector + fts + bm25 (3 channels)
- **complex**: all 5 channels (full pipeline)

This is governed by `SPECKIT_COMPLEXITY_ROUTER` feature flag. When disabled, all 5 channels always run. There's a 2-channel minimum invariant with vector+fts fallback. The router integrates cleanly into hybrid-search.ts at line 561-565, converting the channel list to a Set for O(1) gating.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:57-61,119-142]

### F8: Ablation Override Correctly Intersects with Router
The ablation framework can force-disable channels via `useVector/useBm25/useFts=false` options. This was a bug fix (BUG-1): previously, the ablation framework's channel disable was a no-op because only routeQuery() controlled activeChannels. The fix deletes channels from the activeChannels set after routing.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:567-573]

### F9: Score Normalization is Default-ON
Min-max normalization of RRF scores to [0,1] is applied by default (unless `SPECKIT_SCORE_NORMALIZATION=false`). This happens in both `fuseResultsMulti` and `fuseResultsCrossVariant`. The implementation handles edge cases: NaN/Infinity scores are sanitized to 0, equal scores normalize to 1.0, and the large-array stack overflow risk from `Math.max(...spread)` is avoided via a loop.
[SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:462-511]

### F10: Pipeline Improvement Opportunity — Weight Coherence Gap (Q1)
The biggest architectural improvement opportunity is **weight coherence**. Currently:
- hybrid-search.ts sets hardcoded channel weights (1.0/0.8/0.6/0.5)
- adaptive-fusion.ts has intent-specific weight profiles that only apply to 2 channels
- rrf-fusion.ts has a graph boost (1.5x) that's overridden by hybrid-search's explicit weight
- The convergence bonus (0.10 per extra source) is not intent-aware

A unified weight system that passes all 5 channel weights through the adaptive fusion layer, informed by query intent, would eliminate the current inconsistency where simple queries get the same channel weights as complex queries regardless of intent.
[INFERENCE: based on F2, F5, F6, F7 combined analysis]

### F11: Dark-Run Mode for A/B Comparison
Adaptive fusion includes a dark-run mode that computes both standard and adaptive results, calculates an `orderDifferences` diff, and tracks whether the top result changed. This is production-ready A/B infrastructure but relies on the caller passing `darkRun: true` -- there's no automatic dark-run sampling.
[SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:300-328,406-413]

## Sources Consulted
- `.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts` (full file, 540 lines)
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts` (full file, 430 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts` (full file, 167 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` (lines 1-120, 550-700)

## Assessment
- New information ratio: 0.82
- Questions addressed: Q1
- Questions answered: Q1 (partially — improvement opportunities identified but more areas remain)

Calculation: 11 findings total. F1 (partially new, adds detail to known K=60 fact = 0.5), F2 (new = 1.0), F3 (partially new, convergence bonus was mentioned but scaling detail is new = 0.5), F4 (new = 1.0), F5 (new = 1.0), F6 (new = 1.0), F7 (partially new, routing tiers were known but detail is new = 0.5), F8 (new = 1.0), F9 (partially new, normalization mentioned but implementation detail new = 0.5), F10 (new synthesis = 1.0), F11 (new = 1.0). Total new value = 9.0 / 11 = 0.82.

## Reflection
- What worked and why: Reading rrf-fusion.ts and adaptive-fusion.ts in full in a single pass gave complete fusion algorithm understanding. The key discovery (F2/F5/F6) came from cross-referencing the weight systems across three files -- no single file reveals the incoherence.
- What did not work: N/A -- all planned research actions succeeded.
- What I would do differently: Would prioritize reading hybrid-search.ts's channel weight assignments alongside rrf-fusion.ts from the start, since the hardcoded weights in hybrid-search.ts override the configurable weights in rrf-fusion.ts.

## Recommended Next Focus
Iteration 6: Error handling and edge cases. Investigate how pipeline failures cascade (what happens when vector search returns 0 results? when all channels fail?). Also examine the RSF fusion path and whether it has similar weight incoherence. Begin investigating Q3 (automation opportunities) by looking at the feature flag governance system -- how many flags exist, is there a registry, could flag management be automated?
