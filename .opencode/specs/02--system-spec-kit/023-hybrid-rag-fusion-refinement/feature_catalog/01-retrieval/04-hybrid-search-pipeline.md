# Hybrid search pipeline

## Current Reality

The engine under the hood. `hybrid-search.ts` orchestrates multi-channel retrieval with five search channels, adaptive fusion, diversity reranking and a multi-tier fallback chain. This pipeline provides the candidate generation and fusion components used by Stage 1 of the 4-stage pipeline (the sole runtime path since the legacy V1 path was removed in Phase 017).

Five channels feed the pipeline. Vector search (cosine similarity via sqlite-vec, base weight 1.0) is the primary semantic signal. FTS5 (SQLite full-text search with weighted BM25, base weight 0.8) captures keyword matches the embedding might miss. In-memory BM25 (base weight 0.6, gated by `ENABLE_BM25`, default ON) provides broader coverage with a different tokenization approach. Graph search (causal edge traversal, base weight 0.5) finds structurally related memories through the causal graph. Degree search (connectivity scoring, base weight 0.4, gated by `SPECKIT_DEGREE_BOOST`, default ON) re-ranks by hub score via `computeDegreeScores()` with logarithmic normalization and a hard cap of 50.

Adaptive fusion replaces hardcoded channel weights with intent-aware profiles. The `hybridAdaptiveFuse()` function selects weights based on the detected query intent, so a "fix_bug" query weights channels differently than a "find_spec" query. Results from all channels merge through `fuseResultsMulti()` using Reciprocal Rank Fusion.

Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking; RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).

After these stages, Maximal Marginal Relevance reranking promotes result diversity using intent-specific lambda values (from `INTENT_LAMBDA_MAP`, default 0.7). Co-activation spreading takes the top 5 results, traverses the co-activation graph and applies a 0.25x boost to returned activation scores. A fan-effect divisor helper exists in `co-activation.ts`, but the Stage 2 hot path currently applies the spread score directly.

The fallback chain (`searchWithFallback()`) provides resilience. When `SPECKIT_SEARCH_FALLBACK` is enabled, the default path is a three-tier degradation flow: Tier 1 primary retrieval (default minimum similarity 0.3), Tier 2 widened retrieval at 0.1 with all channels forced on, and Tier 3 structural SQL search as last resort. When `SPECKIT_SEARCH_FALLBACK` is disabled, the legacy two-pass path is used (0.3 then 0.17). The system is designed to avoid empty returns except on hard failures.

## Source Metadata

- Group: Retrieval
- Source feature title: Hybrid search pipeline
- Current reality source: feature_catalog.md
