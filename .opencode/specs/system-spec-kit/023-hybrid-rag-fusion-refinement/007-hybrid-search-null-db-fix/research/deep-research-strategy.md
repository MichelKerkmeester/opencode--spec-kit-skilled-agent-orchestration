# Deep Research Strategy: Memory Search Pipeline Optimization

## Research Goal
Investigate and document optimization opportunities for the Spec Kit Memory search pipeline, focusing on search result quality, pipeline efficiency, and the root causes behind the state filtering and scope enforcement bugs that caused 0-result searches.

## Key Questions
1. Why do ALL memories have UNKNOWN state? What's the memoryState lifecycle design vs implementation gap?
2. What other filtering/scoring bugs might silently discard valid results?
3. How effective is the RRF fusion across vector/FTS5/BM25/graph channels?
4. What is the impact of 536 deprecated-tier memories on search quality?
5. How does the active_memory_projection table interact with search — are there orphaned or missing projections?
6. What quality_score distribution exists and how does filterByMinQualityScore affect recall?
7. Is the embedding expansion (R12) actually improving recall or just adding latency?
8. What is the state of the TRM (Tiered Recall Management) system — designed but not implemented?

## Source Files (Priority Order)
- `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` — candidate generation
- `mcp_server/lib/search/pipeline/stage2-fusion.ts` — signal integration
- `mcp_server/lib/search/pipeline/stage3-rerank.ts` — reranking
- `mcp_server/lib/search/pipeline/stage4-filter.ts` — state filtering, TRM
- `mcp_server/lib/search/hybrid-search.ts` — hybrid search channels
- `mcp_server/lib/governance/scope-governance.ts` — scope enforcement
- `mcp_server/lib/search/sqlite-fts.ts` — FTS5 BM25 search
- `mcp_server/lib/search/vector-index-queries.ts` — vector search SQL
- `mcp_server/lib/search/bm25-index.ts` — in-memory BM25
- `mcp_server/lib/search/search-flags.ts` — feature flags
- `mcp_server/lib/cognitive/rollout-policy.ts` — feature flag governance
- `mcp_server/handlers/memory-search.ts` — search handler
- `mcp_server/handlers/memory-context.ts` — context handler

## Convergence Criteria
- All 8 key questions answered with evidence
- At least 3 concrete optimization recommendations with file:line citations
- New information ratio drops below 0.15
