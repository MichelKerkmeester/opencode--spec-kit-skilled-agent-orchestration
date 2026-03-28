---
title: "Hybrid search pipeline"
description: "Covers the multi-channel retrieval engine with five search channels, adaptive fusion and tiered fallback."
---

# Hybrid search pipeline

## 1. OVERVIEW

Covers the multi-channel retrieval engine with five search channels, adaptive fusion and tiered fallback.

When you search for something, the system looks in several places at once, like checking both the index and the shelves in a library. It then combines all the results and ranks them by relevance so the best match shows up first. If the first search comes back empty, the system automatically widens its net and tries again with looser criteria so you almost never get zero results.

---

## 2. CURRENT REALITY

The engine under the hood. `handlers/memory-search.ts` is the runtime entry point, and Stage 1 delegates candidate generation into `lib/search/hybrid-search.ts` plus the supporting pipeline stages. `hybrid-search.ts` still owns the multi-channel retrieval, adaptive fusion inputs, diversity reranking, and fallback chain, but it now operates as the candidate-generation engine inside the four-stage runtime pipeline rather than as a standalone top-level MCP entry point.

Five channels feed the pipeline. Vector search (cosine similarity via sqlite-vec, base weight 1.0) is the primary semantic signal. FTS5 (SQLite full-text search with weighted BM25, base weight 0.3) captures keyword matches the embedding might miss. In-memory BM25 (base weight 0.6, gated by `ENABLE_BM25`, default ON) provides broader coverage with a different tokenization approach. Graph search (causal edge traversal, base weight 0.5) finds structurally related memories through the causal graph. Degree search (connectivity scoring, base weight 0.4, gated by `SPECKIT_DEGREE_BOOST`, default ON) re-ranks by hub score via `computeDegreeScores()` with logarithmic normalization and a hard cap of 50.

Adaptive fusion replaces hardcoded channel weights with intent-aware profiles. The `hybridAdaptiveFuse()` function selects weights based on the detected query intent, so a "fix_bug" query weights channels differently than a "find_spec" query. Results from all channels merge through `fuseResultsMulti()` using Reciprocal Rank Fusion.

Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25 and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking. RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).

After these stages, Maximal Marginal Relevance reranking promotes result diversity using intent-specific lambda values (from `INTENT_LAMBDA_MAP`, default 0.7). Co-activation spreading takes the top 5 results, traverses the co-activation graph and applies a 0.25x boost to returned activation scores. Those boosts now synchronize all live score aliases (`score`, `rrfScore`, `intentAdjustedScore`) before the reranked list is resorted, so downstream consumers see the same boosted number. Session boost likewise preserves the original working-memory `attentionScore` signal and records the boosted ranking value separately in `sessionBoostScore`. A fan-effect divisor helper exists in `co-activation.ts`, but the Stage 2 hot path currently applies the spread score directly.

The fallback chain (`searchWithFallback()`) provides resilience. When `SPECKIT_SEARCH_FALLBACK` is enabled, the default path is a three-tier degradation flow: Tier 1 primary retrieval (default minimum similarity 0.3), Tier 2 widened retrieval at 0.1, and Tier 3 structural SQL search as last resort. Tier 2 no longer overrides caller intent by blindly re-enabling every channel. Stage 1 computes an allowed-channel set first, then Tier 2 widens only inside that set, so explicit disables such as `useGraph:false` still suppress graph-derived signals and the degree channel. The structural fallback also only runs lexical channels that remain allowed, using the same normalized lexical query preparation as the main FTS5 and BM25 paths. Tier 3 excludes archived rows unless `includeArchived=true`, closing the fallback-only leak that could reintroduce archived memories after earlier stages had filtered them. When `SPECKIT_SEARCH_FALLBACK` is disabled, the legacy two-pass path is used (0.3 then 0.17). The system is designed to avoid empty returns except on hard failures.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel search orchestration: 5-channel retrieval, adaptive fusion, MMR diversity reranking, tiered fallback |
| `mcp_server/lib/search/bm25-index.ts` | Lib | In-memory BM25 index management |
| `mcp_server/lib/search/sqlite-fts.ts` | Lib | SQLite FTS5 interface for full-text search channel |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring with logarithmic normalization |
| `mcp_server/lib/search/query-router.ts` | Lib | Channel routing based on query complexity |
| `mcp_server/lib/search/query-classifier.ts` | Lib | Query complexity classification (simple/moderate/complex) |
| `mcp_server/lib/search/intent-classifier.ts` | Lib | Intent detection for adaptive fusion weights |
| `mcp_server/lib/search/channel-enforcement.ts` | Lib | Channel min-representation enforcement |
| `mcp_server/lib/search/confidence-truncation.ts` | Lib | Confidence-based tail truncation |
| `mcp_server/lib/search/dynamic-token-budget.ts` | Lib | Tier-aware token budget computation |
| `mcp_server/lib/search/folder-relevance.ts` | Lib | Folder relevance scoring and two-phase retrieval |
| `mcp_server/lib/search/folder-discovery.ts` | Lib | Spec folder description cache for folder-scoped search |
| `mcp_server/lib/search/local-reranker.ts` | Lib | Local GGUF reranker |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry for all channel and stage toggles |
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading (0.25x boost, top 5) |
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk-to-memory aggregation and reassembly |
| `mcp_server/lib/search/vector-index.ts` | Lib | Vector index facade for cosine similarity search |
| `shared/algorithms/rrf-fusion.ts` | Shared | Reciprocal Rank Fusion algorithm |
| `shared/algorithms/adaptive-fusion.ts` | Shared | Adaptive intent-aware fusion |
| `shared/algorithms/mmr-reranker.ts` | Shared | MMR diversity reranking algorithm |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration |
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/hybrid-search-context-headers.vitest.ts` | Context header injection |
| `mcp_server/tests/search-fallback-tiered.vitest.ts` | Tiered fallback chain |
| `mcp_server/tests/search-extended.vitest.ts` | Search extended scenarios |
| `mcp_server/tests/channel-enforcement.vitest.ts` | Channel enforcement tests |
| `mcp_server/tests/channel-representation.vitest.ts` | Channel representation tests |
| `mcp_server/tests/confidence-truncation.vitest.ts` | Truncation behavior |
| `mcp_server/tests/dynamic-token-budget.vitest.ts` | Token budget computation |
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
| `mcp_server/tests/adaptive-fusion.vitest.ts` | Adaptive fusion tests |
| `mcp_server/tests/mmr-reranker.vitest.ts` | MMR reranker tests |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Source feature title: Hybrid search pipeline
- Current reality source: FEATURE_CATALOG.md
- Source list updated 2026-03-26 per audit remediation
