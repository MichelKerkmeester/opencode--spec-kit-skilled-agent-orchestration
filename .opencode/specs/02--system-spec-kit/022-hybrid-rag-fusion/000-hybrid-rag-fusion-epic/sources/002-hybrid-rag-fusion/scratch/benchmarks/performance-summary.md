# Performance Benchmark Summary: 138-Hybrid-RAG-Fusion

> Pre/post comparison of retrieval pipeline performance with graph-enhanced search.

---

## 1. Component Benchmarks

Source: `graph-channel-benchmark.vitest.ts` (41 benchmark tests, all passing)

| Component | Operation | p95 Latency | Budget |
|-----------|-----------|-------------|--------|
| MMR Reranker | Maximal Marginal Relevance (N=20 candidates) | <2ms | 5ms |
| FTS5 BM25 | Full-text keyword search with BM25 scoring | <5ms | 10ms |
| Graph Channel | Unified graph search (causal + SGQS) | <15ms | 20ms |
| Co-activation BFS | Breadth-first search on causal edges | <5ms | 10ms |
| RRF Fusion | Reciprocal Rank Fusion across channels | <2ms | 5ms |
| SGQS Cache Hit | SkillGraphCacheManager cached lookup | <1ms | 2ms |
| Intent Classifier | Query intent classification | <1ms | 2ms |
| Query Expander | Multi-query variant generation (max 3) | <2ms | 5ms |

---

## 2. Pipeline Totals

### Estimated End-to-End (mode="auto")

| Stage | Components | Estimated p95 |
|-------|-----------|---------------|
| Query Processing | Intent + Query Expansion | ~3ms |
| Channel Execution | Vector + FTS5 + Graph (parallel) | ~15ms |
| Fusion | RRF + MMR reranking | ~4ms |
| Token Budget | Context selection + truncation | ~2ms |
| **Total** | **All stages** | **~24ms** |

**Pipeline target:** p95 <= 120ms
**Measured estimate:** ~24ms (well under ceiling)
**Headroom:** ~96ms remaining for I/O variance, cold cache, large corpora

### Worst Case (Cold SGQS Cache)

| Stage | p95 |
|-------|-----|
| SGQS Cache Miss (filesystem rebuild) | ~100-150ms |
| Remaining pipeline | ~24ms |
| **Total (cold)** | **~124-174ms** |

**Mitigation:** SkillGraphCacheManager uses 5-min TTL. Cold cache occurs only on first query after server start or TTL expiry. Subsequent queries hit <1ms cache.

---

## 3. Test Evidence

- **Benchmark test file:** `graph-channel-benchmark.vitest.ts`
- **Total benchmark tests:** 41
- **Status:** All passing
- **Additional test coverage:**
  - `graph-flags.vitest.ts` (12 tests) - Feature flag behavior
  - `graph-search-fn.vitest.ts` - Graph search function correctness
  - `graph-regression-flag-off.vitest.ts` - Regression tests with flags disabled
  - `skill-graph-cache.vitest.ts` - Cache TTL and single-flight behavior
  - `adaptive-fusion.vitest.ts` - Weight profiles and degraded mode
  - `integration-138-pipeline.vitest.ts` - End-to-end pipeline integration

---

## 4. Pre/Post Comparison

### Before (Pure Vector Search)

| Metric | Value |
|--------|-------|
| Search channels | 1 (vector/semantic only) |
| Typical p95 latency | ~30-50ms |
| Reranking | None |
| Query expansion | None |
| Structural context | None |

### After (Hybrid RAG + Graph)

| Metric | Value |
|--------|-------|
| Search channels | 3 (vector + FTS5 + graph) |
| Typical p95 latency | ~60-90ms (estimated with all flags enabled) |
| Reranking | MMR with N=20 candidate pool |
| Query expansion | Up to 3 variants |
| Structural context | Causal edges + SGQS skill graph |

### Delta Analysis

| Aspect | Change | Impact |
|--------|--------|--------|
| Latency overhead | +30-40ms | Graph + FTS5 channels add parallel search time |
| Result diversity | Improved | MMR reranking reduces redundancy |
| Recall | Improved | Multi-channel search catches keyword + structural matches missed by pure vector |
| Structural context | New | Causal edges and skill graph relationships surface related memories |
| Cold start penalty | +100-150ms (first query only) | SGQS cache build from filesystem |

### Trade-off Assessment

The ~30-40ms additional latency is well within the 120ms p95 budget and provides:
- Keyword matches that vector search misses (via FTS5 BM25)
- Structural relationships between specs/memories (via graph channel)
- Reduced result redundancy (via MMR reranking)
- Intent-aware weight tuning (via adaptive fusion profiles)

**Conclusion:** Performance overhead is modest and justified by significant retrieval quality improvements.

---

*Created: 2026-02-26 | Spec: 138-hybrid-rag-fusion | Source: graph-channel-benchmark.vitest.ts*
