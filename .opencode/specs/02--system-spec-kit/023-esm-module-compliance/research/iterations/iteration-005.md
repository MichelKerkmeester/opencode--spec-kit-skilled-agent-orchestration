# Iteration 5: Adaptive Fusion Refinement (Q9) and Code Graph/CocoIndex Integration (Q10)

## Focus
Investigate Q9 (adaptive fusion weights, scoring parameters, refinement opportunities) and Q10 (Code Graph and CocoIndex integration -- are they contributing meaningfully to search results?).

## Findings

### Q9: Adaptive Fusion Weights and Refinement

1. **7 intent-specific weight profiles are fully defined and normalized.** The `INTENT_WEIGHT_PROFILES` in `adaptive-fusion.ts` maps 7 intents to distinct 4-channel weights (semantic, keyword, recency, graph) plus `graphCausalBias`. All profiles sum to >1.0 raw (e.g., `understand`: 0.7+0.2+0.1+0.15=1.15) and are dynamically normalized to 1.0 via `getAdaptiveWeights()`. This normalization is correct and tested.
   [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60-76]

2. **Graph weight varies dramatically by intent: 0.10 to 0.50.** `fix_bug` gets lowest graphWeight (0.10), `find_decision` gets highest (0.50). `find_spec` gets 0.30. Default is 0.15. This variance is intentional -- decision-tracing queries lean heavily on the causal graph, while bug-fixing prioritizes keyword precision.
   [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:61-67]

3. **Document-type weight shifting uses a fixed +/-0.1 shift.** Three document types (decision, implementation, research) shift weights. The shift is additive/subtractive with min(1.0)/max(0) clamping but occurs BEFORE normalization. This means a `DOC_TYPE_WEIGHT_SHIFT=0.1` can cause up to ~8.7% effective weight change after normalization (0.1/1.15). The shift magnitude is reasonable but not configurable -- it's hardcoded.
   [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:82-84, 142-161]

4. **Recency boost uses exponential decay with a 365-day half-life.** The formula `freshness = exp(-ageDays / 365)` with `RECENCY_BOOST_SCALE = 0.1` means a 1-day-old memory gets +0.01 boost, a 30-day-old gets +0.0092, and a 365-day-old gets +0.0037. This is extremely conservative -- the maximum recency boost (for a just-created memory with recencyWeight=0.2) is only 0.02. Post-boost renormalization to [0,1] further compresses scores.
   [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:251-274]

5. **Adaptive fusion has a robust degraded-mode contract.** Three failure modes are handled: (a) adaptive fusion error falls back to standard RRF with confidenceImpact=0.3, (b) standard fusion error returns empty with confidenceImpact=1.0, (c) dark-run mode computes both and logs diff. The `DegradedModeContract` type enforces `retryRecommendation` guidance.
   [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:31-40, 386-423]

6. **The `graphWeight` is used as a 4th RRF channel weight in hybrid search.** In `hybrid-search.ts:1218-1221`, when adaptive fusion is enabled, the `graphWeight` from `getAdaptiveWeights()` is extracted and used alongside semantic and keyword weights. The graph channel contributes via `DEGREE_CHANNEL_WEIGHT = 0.15` (capped typed-degree boost) as a separate ranked list in the RRF fusion.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1218-1221, graph-search-fn.ts:52-55]

### Q10: Code Graph Integration

7. **Code Graph (structural code indexer) is SEPARATE from the causal memory graph.** The Code Graph (`lib/code-graph/code-graph-db.ts`) stores parsed code structure (functions, classes, imports, calls) in `code-graph.sqlite`. It has its own tables (`code_files`, `code_nodes`, `code_edges`). This is NOT the same as the causal memory graph used in the search pipeline (which uses `causal_edges` in the memory index DB).
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:20-81]

8. **Code Graph does NOT feed into memory search pipeline.** No imports or references to Code Graph exist in the `lib/search/pipeline/` directory. The Code Graph is exposed via separate MCP tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`) and serves a different purpose: structural code navigation (call graphs, import chains, symbol outlines) rather than memory retrieval.
   [SOURCE: Grep for "codeGraph|code_graph|code-graph" in lib/search/pipeline/ -- no matches; Grep for code_graph_context in lib/search/ -- no matches]

9. **CocoIndex is completely separate from memory search.** CocoIndex is an external semantic code search tool with its own MCP server (`cocoindex_code`). It does not feed results into the memory search pipeline at all. The `code_graph_context` tool can accept CocoIndex results as "seeds" (via `provider: "cocoindex"` in the seeds array), but this is a bridge for the Code Graph context tool, not the memory search system.
   [SOURCE: Grep for "cocoindex|CocoIndex" in lib/search/ -- zero matches]

10. **The memory search pipeline's "graph signals" come from the causal memory graph, not Code Graph.** In stage2-fusion.ts, graph signals are applied via four distinct mechanisms: (a) causal boost (2-hop traversal on causal_edges, line 795), (b) co-activation spreading (line 820), (c) community detection/injection (line 862), (d) graph signals N2a+N2b momentum+depth (line 908). All gated by `isGraphUnifiedEnabled()`. These read from `causal_edges` in the memory DB, not from `code-graph.sqlite`.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:793-933]

11. **Graph bonus is tightly capped at 0.03 per row in stage2.** The `STAGE2_GRAPH_BONUS_CAP = 0.03` in `ranking-contract.ts` means no single memory can gain more than +0.03 from graph signals in stage2. This is extremely conservative -- on a 0-1 score scale, the graph can only move a result by 3%. With additional graph calibration profile enabled, this may be further adjusted but the cap remains the hard upper bound.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts:14-25]

### Refinement Opportunities Identified

12. **Refinement R1: Recency boost is negligibly small.** Maximum effective recency contribution is ~0.02 (recencyWeight=0.2 * freshness=1.0 * scale=0.1). At this magnitude, recency is functionally decorative. Either increase `RECENCY_BOOST_SCALE` from 0.1 to ~0.5, or explicitly document that recency is intended to be a tiebreaker only.
   [INFERENCE: based on adaptive-fusion.ts:86,267 -- 0.2 * 1.0 * 0.1 = 0.02 max boost]

13. **Refinement R2: Stage2 graph bonus cap (0.03) may be too restrictive.** The graph channel receives adaptive fusion weight of 0.10-0.50 (depending on intent), but the stage2 additive cap is only 0.03. This means even for `find_decision` (graphWeight=0.50), the post-fusion graph influence is capped at 3% of total score. Consider whether `STAGE2_GRAPH_BONUS_CAP` should scale with the adaptive graphWeight for the active intent.
   [INFERENCE: based on ranking-contract.ts:14 and adaptive-fusion.ts:67 -- 0.50 weight but 0.03 cap creates mismatch]

14. **Refinement R3: `DOC_TYPE_WEIGHT_SHIFT` is not intent-aware.** The document-type shift always adds/subtracts 0.1 regardless of the intent profile. For `fix_bug` (keywordWeight=0.4), a +0.1 decision-doc shift makes keyword 0.5 (12.5% change). For `understand` (keywordWeight=0.2), the same +0.1 makes keyword 0.3 (50% change). The shift should be proportional to avoid disproportionate impact on low-weight channels.
   [INFERENCE: based on adaptive-fusion.ts:82-84, 142-161 -- flat shift with varying base weights]

## Ruled Out
- CocoIndex feeding into memory search -- confirmed architecturally separate
- Code Graph DB contributing to memory search fusion -- separate DB and tool surface

## Dead Ends
- None discovered this iteration

## Sources Consulted
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts` (full file, 433 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` (lines 860-980)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` (lines 1-120)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts` (grep results)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts` (lines 1-80)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` (lines 1-150)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` (grep results)
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts` (grep results)
- Grep across `lib/search/pipeline/` for graph/cocoindex references
- Grep across `lib/search/` for cocoindex references

## Assessment
- New information ratio: 0.89
- Questions addressed: Q9, Q10
- Questions answered: Q9 (adaptive fusion fully characterized with 3 refinement opportunities), Q10 (Code Graph and CocoIndex are separate systems; memory graph is the search-pipeline contributor)

## Reflection
- What worked and why: Reading the canonical `adaptive-fusion.ts` shared module gave the complete weight architecture in one file (433 lines). The Grep for graph/cocoindex across the pipeline directory conclusively proved separation of concerns.
- What did not work and why: N/A -- all approaches were productive this iteration.
- What I would do differently: Could have started with `adaptive-fusion.ts` alone, since it contains both the weight profiles and the normalization logic end-to-end.

## Recommended Next Focus
Address the 5 remaining Q3 improvement items from iteration 4 (naive keyword matching, snippet metadata, constitutional limit, unused session fields, no latency circuit-breaker) alongside the 3 new refinement opportunities (R1: recency boost magnitude, R2: graph bonus cap vs adaptive weight mismatch, R3: doc-type shift proportionality). Synthesize a prioritized refinement backlog.
