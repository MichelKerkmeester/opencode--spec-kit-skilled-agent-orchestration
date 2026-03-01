# Spec 002 Historical Surface for 006 Planning

## Delivered vs Planned Matrix
| Item | Plan (002) | Delivery / Notes |
|---|---|---|
| Phase 0 – scatter/gather + graph/co-activation | Activate graph channel (`useGraph: true`), wire `hybridAdaptiveFuse(intent)`, inject BFS co-activation + adaptive fallback | `hybrid-search.ts` now defaults `useGraph`, calls `createUnifiedGraphSearchFn` (per `graph-flags`), fires `spreadActivation()`, and retries at 0.17 when zero results. Testing: `co-activation.vitest.ts`, `adaptive-fallback.vitest.ts`. |
| Phase 1 – TRM/MMR | MMR reranker plus Transparent Reasoning Module (Z-score warning) to protect the 2k token budget | `mmr-reranker.ts` and `evidence-gap-detector.ts` are new modules, plugged into `hybrid-search.ts` and `memory-search.ts`, and verified by dedicated vitests plus `[EVIDENCE GAP DETECTED]` handler tests. |
| Phase 2/3 – field weights + query expansion | Weighted BM25 (`bm25-index.ts`), causal multipliers, and deep-mode multi-query expansion | Weighted BM25 and causal multipliers were added; query expansion exists in `memory-search.ts` for deep mode, while variant results are merged by first-seen ID (no post-merge re-fusion), which remains a carry-forward quality seam. |
| Phase 4 – indexing/cognitive modules | AST chunker, PageRank authority, read-time gating, legacy chunker replacement | Modules exist (`pagerank.ts`, `structure-aware-chunker.ts`, and plan to pipe `prediction-error-gate.ts` at read time) but are *not yet wired into the ingest or retrieval pipeline*; these remain Phase 4 work (per implementation summary limitations). |
| Phase 5 – verification | Tests for every new/updated module plus integration latency guard | 11 new vitests + updates to existing suites; integration run 4,546 pass; `integration-138-pipeline.vitest.ts` validates latency mathematically but needs real SQLite verification. |

### Evidence Pointers
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/plan.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`

## Carry-Forward Backlog for 006
1. Wire `mcp_server/lib/manage/pagerank.ts` into `memory_manage` so scores land in `memory_index.pagerank_score` and participate in the graph RRF signal (requires `remark`/`remark-gfm` dependency and ingest hook per limitation #2). 
2. Replace the character-boundary chunker in `generate-context.js` with `scripts/lib/structure-aware-chunker.ts` plus AST parsing and `remark-gfm` to keep tables/code atomic (limitation #3). 
3. Route retrieved payloads through `prediction-error-gate.ts` at read-time to flag contradictions alongside the TRM warning (limitation #4). 
4. Measure the 120ms ceiling against a populated production SQLite dataset with `console.time()` instrumentation for each stage; the current verification is architectural/budget-only (limitation #1). 
5. Harden MMR coverage for memories lacking `Float32Array` embeddings—consider backfilling vectors or providing a fallback reranker so ancient data still benefits (limitation #5). 
6. Expand `DOMAIN_VOCABULARY_MAP` (query-expander) into other domains (ML, infra, mobile) and track synonyms in a maintainable JSON or data-driven store (limitation #6). 
7. Keep the graph channel cache/pre-warm (per research R-138-003) healthy: maintain the SGQS cache TTL, pre-warm in startup, and log when the 5-minute TTL triggers heavy rebuilds so the first cold query stays under budget.

## Critical Lessons for 006 Logic Work
- Always confirm a feature is “wired” end-to-end: 002 showed a live `useGraph` flag but no `graphSearchFn` until `createUnifiedGraphSearchFn` was added; 006 must validate not only flags but actual data pipelines. 
- Newly added modules need immediate telemetry/instrumentation (MMR timing, graph fusion latency, evidence-gap frequency) before assuming they stay within tight budgets—mock proof is helpful but real SQLite profiling must follow. 
- Keep deferred enhancements visible in the backlog so successive specs (like 006) can prioritize wiring new modules instead of re-deriving the same gap analysis.
