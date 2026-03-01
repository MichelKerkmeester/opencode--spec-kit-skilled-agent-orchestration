# Agent 5: 001 Task Gap Assessment & Root 138 Checklist Sync

**Date:** 2026-02-20
**Scope:** Compare 001/tasks.md against 003 implementation; assess root 138 checklist markability

---

## Task A: 001 Phase-by-Phase Gap Matrix

### Phase 0: Activate Assets (4 tasks)

| Task | Status | Evidence |
|------|--------|----------|
| Refactor `hybridSearchEnhanced()` to use `hybridAdaptiveFuse(intent)` | **DONE** | `hybrid-search.ts:453-464` — calls `hybridAdaptiveFuse(semanticResults, keywordResults, intent)` and applies adaptive weights to fusion lists |
| Activate Graph Routing (`useGraph: true` default) | **DONE** | `hybrid-search.ts:267` — `useGraph = true` default in `HybridSearchOptions` destructure; `hybrid-search.ts:418-437` — graph channel queried and added to fusion lists |
| Activate Co-Activation (`spreadActivation` post-RRF) | **DONE** | `hybrid-search.ts:482-502` — `spreadActivation(topIds)` called after RRF fusion, boosts scores by `boost * 0.1` |
| Implement Adaptive Fallback (two-pass retry at 0.17) | **DONE** | `hybrid-search.ts:522-559` — `searchWithFallback()` implements two-pass with PRIMARY_THRESHOLD=0.3, FALLBACK_THRESHOLD=0.17, tags `fallbackRetry=true` |

**Phase 0 Summary: 4/4 DONE**

### Phase 1: Diversity and Confidence (4 tasks)

| Task | Status | Evidence |
|------|--------|----------|
| MMR Algorithm (`applyMMR` with cosine similarity) | **DONE** | `mmr-reranker.ts:155-233` — full MMR with `computeCosine()`, greedy selection, O(N^2) bounded by `maxCandidates=20`. Enhanced with Graph-Guided MMR (003/T012) |
| Intent-Mapped Lambdas (`understand`=0.5, `fix_bug`=0.85) | **PARTIALLY DONE** | `adaptive-fusion.ts:57-64` has intent weight profiles but lambda values are per-channel weights (semanticWeight, keywordWeight), not MMR lambda params. MMR is called with hardcoded `lambda: 0.7` in `hybrid-search.ts:477`. Intent-to-MMR-lambda mapping NOT implemented. |
| TRM Confidence Check (`detectEvidenceGap`) | **DONE** | `evidence-gap-detector.ts:147-174` — Z-score check with threshold 1.5, handles empty/single/identical score edge cases. Enhanced with `predictGraphCoverage()` (003/T014) |
| Warning Injection (markdown formatter) | **PARTIALLY DONE** | `evidence-gap-detector.ts:187-189` — `formatEvidenceGapWarning()` generates the markdown. BUT not wired into `memory-search.ts` handler (no import/call found in pipeline). The formatter exists but the injection into the MCP response is not connected. |

**Phase 1 Summary: 2/4 DONE, 2/4 PARTIALLY DONE**

### Phase 2: Graph & Weights (2 tasks)

| Task | Status | Evidence |
|------|--------|----------|
| FTS5 BM25 weighted SQL (`bm25(memory_fts, 10.0, 5.0, 1.0, 2.0)`) | **NOT DONE** | `hybrid-search.ts:197-206` uses basic `WHERE memory_fts MATCH ?` with `ORDER BY rank`. No `bm25()` scorer function. Standard FTS5 ranking only. |
| Graph Weights CTE (supersedes=1.5, contradicts=0.8 multipliers) | **NOT DONE** | `graph-search-fn.ts:167-198` — `queryCausalEdges()` uses plain `ORDER BY ce.strength DESC`. No recursive CTE with relation-based multipliers. |

**Phase 2 Summary: 0/2 DONE, 2/2 NOT DONE**

### Phase 3: Multi-Query RAG Fusion (3 tasks)

| Task | Status | Evidence |
|------|--------|----------|
| Synonym Utility (`expandQuery`) | **DONE** | `query-expander.ts:69-84` — splits by word boundary regex, looks up `DOMAIN_VOCABULARY_MAP`, max 3 variants. Enhanced with `buildSemanticBridgeMap()` (003/T010) |
| Scatter-Gather Execution (mode="deep") | **NOT DONE** | `expandQuery()` exists but is not called anywhere in `hybrid-search.ts` or `handlers/memory-search.ts`. No multi-variant scatter-gather loop. |
| Cross-Variant RRF (+0.10 convergence bonus) | **NOT DONE** | `rrf-fusion.ts` not modified for multi-dimensional arrays. No convergence bonus logic. |

**Phase 3 Summary: 1/3 DONE, 2/3 NOT DONE**

### Phase 4: Indexing Quality & Cognitive Layer (5 tasks)

| Task | Status | Evidence |
|------|--------|----------|
| AST Parsing (remark + remark-gfm chunking) | **NOT DONE** | No `structure-aware-chunker.ts` file exists. No remark integration. |
| Batch PageRank | **NOT DONE** | No `pagerank.ts` file exists. No PageRank SQL. |
| Embedding Centroids for intent-classifier | **NOT DONE** | No centroid embedding logic. Intent classifier still uses regex/rule-based approach. |
| Tier Decay Modulation (FSRS with TIER_MULTIPLIER) | **PARTIALLY DONE** | `fsrs.ts` has `computeStructuralFreshness(stability, centrality)` which modulates decay via graph centrality. But formula differs from spec: uses `stability * centrality` rather than `old_stability * (1.0 - (decay_rate * TIER_MULTIPLIER[tier]))`. The tier-specific multiplier map is not implemented. |
| Read-Time Prediction Error (`prediction-error-gate.ts`) | **NOT DONE** | No `prediction-error-gate.ts` file found. |

**Phase 4 Summary: 0/5 DONE, 1/5 PARTIALLY DONE, 4/5 NOT DONE**

### Phase 5: Test Coverage (16 tasks)

| Category | Status | Notes |
|----------|--------|-------|
| Phase 0 Tests (4 tasks) | **PARTIALLY DONE** | `adaptive-fusion.vitest.ts` exists (003 added graph tests). `co-activation.vitest.ts` not checked. `adaptive-fallback.vitest.ts` NOT created. |
| Phase 1 Tests (4 tasks) | **PARTIALLY DONE** | `graph-flags.vitest.ts`, `graph-search-fn.vitest.ts` exist from 003. Dedicated `mmr-reranker.vitest.ts` and `evidence-gap-detector.vitest.ts` NOT found as standalone files (tested within 003 suites). |
| Phase 2 Tests (2 tasks) | **NOT DONE** | BM25 weighted SQL and CTE multiplier tests not created (features not implemented). |
| Phase 3 Tests (3 tasks) | **NOT DONE** | `query-expander.vitest.ts` NOT found as standalone. Multi-query RRF tests not created. |
| Phase 4 Tests (3 tasks) | **NOT DONE** | All Phase 4 features are not implemented. |
| Integration Tests (2 tasks) | **NOT DONE** | `integration-138-pipeline.vitest.ts` NOT created yet (Task B of this agent). |

**Phase 5 Summary: 2/16 PARTIALLY DONE, 14/16 NOT DONE**

---

## Consolidated Gap Summary

| Phase | Total Tasks | DONE | PARTIALLY DONE | NOT DONE |
|-------|------------|------|----------------|----------|
| Phase 0: Activate Assets | 4 | 4 | 0 | 0 |
| Phase 1: Diversity & Confidence | 4 | 2 | 2 | 0 |
| Phase 2: Graph & Weights | 2 | 0 | 0 | 2 |
| Phase 3: Multi-Query RAG Fusion | 3 | 1 | 0 | 2 |
| Phase 4: Indexing & Cognitive | 5 | 0 | 1 | 4 |
| Phase 5: Test Coverage | 16 | 0 | 2 | 14 |
| **TOTAL** | **34** | **7** | **5** | **22** |

**Key Finding:** 003 (Unified Graph Intelligence) fully satisfied Phase 0 and most of Phase 1. Phases 2-4 remain largely unimplemented. Phase 5 tests are blocked on the unimplemented features.

---

## Task C: Root 138 Checklist Assessment

### Currently Verified: 32/55

### Items Assessable for Marking (with evidence from codebase):

**CHK-006 [P0] [W:RAG] Feature flags default to `false`:**
- `graph-flags.ts:11,18,27` — all three flags (`SPECKIT_GRAPH_UNIFIED`, `SPECKIT_GRAPH_MMR`, `SPECKIT_GRAPH_AUTHORITY`) default `false`, require explicit `=== 'true'` env var
- `adaptive-fusion.ts:78-82` — `SPECKIT_ADAPTIVE_FUSION` gated via `isFeatureEnabled()` (rollout-policy)
- **ASSESSMENT: PARTIALLY MARKABLE** — Graph flags are correct. But `ENABLE_HYBRID_SEARCH`, `ENABLE_MMR`, `ENABLE_MULTI_QUERY` (the specific names in CHK-121) are not found. The actual flag names differ from what checklist expects. Leave unmarked until naming is reconciled.

**CHK-009 [P0] [W:RAG] Spec.md scope frozen:**
- Cannot verify from codebase alone. Requires confirmation that no post-approval changes were made. **Leave unmarked.**

**CHK-011 [P1] [W:RAG] MMR N=20 hardcap:**
- `mmr-reranker.ts:18` — `DEFAULT_MAX_CANDIDATES = 20`
- `mmr-reranker.ts:172` — `pool = candidates.slice(0, maxCandidates)`
- **CAN MARK** with evidence: "mmr-reranker.ts:18,172 — DEFAULT_MAX_CANDIDATES=20, pool capped before O(N^2) loop"

**CHK-013 [P1] [W:RAG] Multi-query max 3 variants:**
- `query-expander.ts:26` — `MAX_VARIANTS = 3`
- `query-expander.ts:74,83` — enforced in both `expandQuery()` and `expandQueryWithBridges()`
- **CAN MARK** with evidence: "query-expander.ts:26,74,83 — MAX_VARIANTS=3 enforced in expandQuery() and expandQueryWithBridges()"

**CHK-021 [P2] [W:INTEG] Cross-skill SGQS traversal:**
- `graph-search-fn.ts:267-329` — `createUnifiedGraphSearchFn()` queries both causal edges and SGQS skill graph. SGQS channel searches across all skills via `querySkillGraph()`.
- **CAN MARK** with evidence: "graph-search-fn.ts:267-329 — createUnifiedGraphSearchFn() queries both causal and SGQS channels, SGQS queries all skills via SkillGraphCacheManager"

### Items That Should Remain Unmarked (W:RAG implementation pending):

- CHK-002 (120ms latency) — needs benchmark proof
- CHK-007 (2000-token limit) — context-budget.ts exists but not wired into pipeline
- CHK-012 (TRM Z-score validated against real data) — needs real-world test
- CHK-014 (FTS5 BM25 balance) — BM25 weighted SQL not implemented
- CHK-110 (p95 latency target) — needs benchmark
- CHK-111 (throughput target) — needs benchmark
- CHK-120 (rollback procedure) — not documented
- CHK-121 (feature flag config) — flag names don't match checklist expectations
- CHK-122, 123, 124 (deploy items) — not created
- CHK-130 (security review) — not performed
- CHK-140 (docs synchronized) — spec docs not yet final

### Net Markable Items: +3 (from 32 to 35)

| Item | Can Mark? | Evidence Summary |
|------|-----------|------------------|
| CHK-011 | YES | mmr-reranker.ts N=20 hardcap |
| CHK-013 | YES | query-expander.ts MAX_VARIANTS=3 |
| CHK-021 | YES | graph-search-fn.ts cross-skill SGQS traversal |
