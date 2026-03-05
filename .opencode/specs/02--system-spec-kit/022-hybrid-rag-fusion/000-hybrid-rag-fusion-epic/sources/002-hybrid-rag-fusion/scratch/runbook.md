# Production Runbook: Hybrid RAG Fusion + Unified Graph Intelligence

> **Spec:** 138-hybrid-rag-fusion | **Component:** system-spec-kit MCP server
> **Last updated:** 2026-02-20

---

## 1. Feature Flag Configuration

Three environment variable flags control the graph-enhanced search pipeline. All default to `false` (strict `=== 'true'` check in `graph-flags.ts`).

| Flag | Controls | Source |
|------|----------|--------|
| `SPECKIT_GRAPH_UNIFIED` | Enables the unified graph search channel (causal edges + SGQS skill graph) in the hybrid search pipeline | `isGraphUnifiedEnabled()` |
| `SPECKIT_GRAPH_MMR` | Enables Graph-Guided MMR diversity reranking (Phase 2+) | `isGraphMMREnabled()` |
| `SPECKIT_GRAPH_AUTHORITY` | Enables Structural Authority Propagation scoring (Phase 2+) | `isGraphAuthorityEnabled()` |

### Recommended Activation Order

1. **SPECKIT_GRAPH_UNIFIED=true** -- Enable the graph channel first. This wires `createUnifiedGraphSearchFn()` into the hybrid pipeline. Monitor `graphHitRate` and `totalQueries` for 24h before proceeding.
2. **SPECKIT_GRAPH_MMR=true** -- Enable MMR diversity reranking. This affects result ordering but not which results appear. Verify result quality hasn't degraded.
3. **SPECKIT_GRAPH_AUTHORITY=true** -- Enable authority propagation last. This adjusts scoring weights based on inbound link counts. Most impactful on ranking.

### How to Set

```bash
# In MCP server environment (e.g., .env, process env, or shell)
export SPECKIT_GRAPH_UNIFIED=true
export SPECKIT_GRAPH_MMR=true
export SPECKIT_GRAPH_AUTHORITY=true
```

Any value other than the exact string `'true'` (including `'TRUE'`, `'1'`, `'yes'`) is treated as disabled.

---

## 2. Rollback Procedure

### Disable All Graph Features

```bash
unset SPECKIT_GRAPH_UNIFIED
unset SPECKIT_GRAPH_MMR
unset SPECKIT_GRAPH_AUTHORITY
```

Or explicitly set to any non-`'true'` value:

```bash
export SPECKIT_GRAPH_UNIFIED=false
export SPECKIT_GRAPH_MMR=false
export SPECKIT_GRAPH_AUTHORITY=false
```

### What Happens to In-Flight Queries

- Flag checks occur at query time (per-request evaluation in `graph-flags.ts`).
- No warm-up or cooldown period. Toggling a flag takes effect on the next query immediately.
- In-flight queries that already entered the graph code path will complete normally; subsequent queries will skip it.

### Data Safety Guarantees

- **No data mutations.** The graph channel is read-only: it queries the existing `causal_edges` SQLite table and the in-memory SGQS skill graph cache. No writes occur.
- **No schema changes.** Zero new tables/columns introduced (verified by CHK-001).
- **No data loss on rollback.** Disabling flags restores pure vector + FTS5 search. The 18 regression tests in `graph-regression-flag-off.vitest.ts` verify the flag-off baseline is unchanged.

---

## 3. Health Monitoring

### Graph Metrics API

Call `getGraphMetrics()` (exposed via the `memory_stats` MCP interface) to retrieve:

| Metric | Description | Healthy Range |
|--------|-------------|---------------|
| `graphHitRate` | Percentage of queries where the graph channel returned at least 1 result | > 30% when flag is on; 0% when off |
| `totalQueries` | Total queries processed since server start | Monotonically increasing |
| `cacheAge` | Age of the SGQS skill graph cache (ms) | < 300000 (5-min TTL) |
| `cacheSize` | Number of nodes in the cached skill graph | > 0 when skills are indexed |

### Alert Thresholds

| Condition | Severity | Action |
|-----------|----------|--------|
| `graphHitRate` drops below 10% with flag on | Warning | Check if SGQS cache is stale or skill graph files are missing |
| `graphHitRate` is 0% with `SPECKIT_GRAPH_UNIFIED=true` | Critical | Cache may have failed to load. Check logs for SGQS parse errors |
| `totalQueries` flatlines for > 10 minutes | Warning | MCP server may be unresponsive. Check process health |
| `cacheAge` exceeds 600000 (10 min) | Warning | Cache refresh may be blocked. Restart triggers fresh load |

---

## 4. Troubleshooting

### SGQS Cache Cold Start

- **Symptom:** First query after server start takes ~100-150ms longer than subsequent queries.
- **Cause:** `SkillGraphCacheManager` (singleton) performs filesystem scan of all skill roots on first access.
- **Resolution:** Expected behavior. The cache is populated on first query and reused for 5 minutes (TTL). No action required.

### Stale Cache

- **Symptom:** Newly added skill graph nodes don't appear in search results.
- **Cause:** SGQS skill graph cache has a 5-minute TTL. Changes to skill files won't be visible until the cache expires.
- **Resolution:** Wait for cache expiry (up to 5 minutes), or restart the MCP server process for immediate refresh.

### Zero Graph Hits When Flag Is Off

- **Symptom:** `graphHitRate` is 0%.
- **Cause:** `SPECKIT_GRAPH_UNIFIED` is not set to `'true'`. The graph search function is not wired into the pipeline.
- **Resolution:** This is expected when the flag is off. Set `SPECKIT_GRAPH_UNIFIED=true` to enable.

### Graph Channel Returns Results But Ranking Seems Off

- **Symptom:** Graph results appear but don't seem relevant.
- **Cause:** Intent-to-subgraph routing (`getSubgraphWeights()`) may be misclassifying query intent, sending wrong weight balance between causal and SGQS channels.
- **Resolution:** Check query intent classification. Decision/cause queries should weight causal (0.8/0.2); spec/procedure queries should weight SGQS (0.2/0.8); others balanced (0.5/0.5).

### MMR Reranker Slow on Large Result Sets

- **Symptom:** Latency spike when MMR is enabled.
- **Cause:** MMR has O(N^2) complexity but is hardcapped at N=20 candidates (`DEFAULT_MAX_CANDIDATES=20` in `mmr-reranker.ts`).
- **Resolution:** If latency exceeds 2ms for MMR, check that the candidate pool is not bypassing the hardcap. The `candidates.slice(0, maxCandidates)` guard at line 172 should prevent this.

---

## 5. Performance Baselines

### Component Budgets (p95 targets)

| Component | Budget | Notes |
|-----------|--------|-------|
| MMR reranking | < 2ms | For N=20 candidate pool (hardcapped) |
| FTS5 BM25 search | < 5ms | SQLite FTS5 with `bm25(10.0, 5.0, 1.0, 2.0)` weights |
| Graph channel (unified) | < 15ms | Includes causal edge query + SGQS lookup |
| SGQS cache hit | < 1ms | In-memory graph traversal after initial load |
| SGQS cache cold start | ~100-150ms | One-time cost on first query after server start |
| RRF fusion | < 2ms | Cross-channel rank fusion with convergence bonus |
| **Total pipeline p95** | **< 120ms** | End-to-end `mode="auto"` retrieval path |

### Benchmark Reference

- 41 benchmark tests in `graph-channel-benchmark.vitest.ts` verify component budgets.
- 18 regression tests in `graph-regression-flag-off.vitest.ts` verify flag-off baseline is unchanged.
- Full test suite: 159 files, ~4770 tests.

---

## Appendix: File References

| File | Purpose |
|------|---------|
| `lib/search/graph-flags.ts` | Feature flag definitions (3 flags) |
| `lib/search/graph-search-fn.ts` | Unified graph search function (causal + SGQS) |
| `lib/search/skill-graph-cache.ts` | SGQS SkillGraphCacheManager (singleton, 5-min TTL) |
| `lib/search/hybrid-search.ts` | Hybrid search pipeline (vector + FTS + graph channels) |
| `lib/search/adaptive-fusion.ts` | Adaptive RRF fusion with graph weight profiles |
| `lib/search/mmr-reranker.ts` | MMR diversity reranker (N=20 hardcap) |
| `context-server.ts` | MCP server entry point (graph wiring at line ~566) |
| `tests/graph-regression-flag-off.vitest.ts` | Regression guard (18 tests, flag-off baseline) |
