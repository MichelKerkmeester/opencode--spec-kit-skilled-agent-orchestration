### C3-001: Attention Score Alias Overwrites the Attention Channel / High / Scoring magnitude mismatch / .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:167
Description
The pipeline treats `attentionScore` as a mutable alias of the current final ranking score instead of preserving it as an independent signal. That destroys the intended separation between session/attention signals and fused/composite/rerank scores.

Evidence
`withSyncedScoreAliases()` writes `attentionScore: clamped` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:167-176`, and `syncScoreAliasesInPlace()` repeats that overwrite at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:179-188`. The same pattern appears in causal injection at `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:95-105` and rerank remapping at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:320-331` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:377-389`. The formatter then exposes `scores.attention` from `rawResult.attentionScore` at `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:418-426`, while the real session-attention signal is sourced separately from `working_memory.attention_score` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:73-99`.

Impact
Trace output can no longer distinguish "attention" from final ranking, so channel-level calibration, audit attribution, and post-hoc debugging all read a fabricated magnitude. Any consumer using `scores.attention` is observing the final fused/reranked score, not the original attention signal.

Recommended Fix
Stop syncing `attentionScore` inside score-alias helpers. Preserve the raw attention/session signal in a dedicated field such as `rawAttentionScore` or `sessionAttentionScore`, and reserve `score`/`rrfScore`/`intentAdjustedScore` for ranking aliases only.

### C3-002: Community Injection Counter Cannot Increment / Medium / Dead code path / .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:674
Description
The metadata path intended to count community-injected rows is structurally unreachable: community injections are recorded with a zero delta, but the counter only counts non-zero deltas.

Evidence
When community boost injects a row, Stage 2 records it with `withGraphContribution(row, 'communityDelta', 0, 'community', true)` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:672-677`. Later, `metadata.graphContribution.communityInjected` is computed via `countGraphContribution(results, 'communityDelta')` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:799-804`. `countGraphContribution()` only counts rows where `Math.abs(graphContribution[key]) > 0` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:225-229`. A zero delta can therefore never contribute to the community-injected count.

Impact
Rollout telemetry under-reports community-channel behavior even when rows are injected into live rankings. That makes graph rollout analysis and audit evidence unreliable.

Recommended Fix
Track community injections with an explicit boolean or explicit counter field instead of inferring them from `communityDelta`. Alternatively, count `graphContribution.injected === true` combined with `sources.includes('community')`.

### C3-003: Flat-Score Normalization Promotes Zero-Signal Batches to Perfect Confidence / High / Incorrect normalization / .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:853
Description
The composite normalization path treats any all-equal batch as `1.0`, which turns flat or zero-signal result sets into perfect-confidence scores. The same policy is repeated in RSF and in the deprecated hybrid fallback normalizer, so channel magnitudes drift apart exactly when the system is least certain.

Evidence
`normalizeCompositeScores()` returns `1.0` whenever `range <= 0` at `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:853-876`. The current tests lock that behavior in for equal batches and singletons at `.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:347-363`. RSF repeats the same rule in `minMaxNormalize()` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:76-79`, and tests expect `minMaxNormalize(0, 0, 0) === 1.0` at `.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion.vitest.ts:500-503` and `.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:215-217`. The deprecated `hybridSearch()` fallback also maps same-score channel groups to `1.0` when `r.score > 0` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:524-529`, and enhanced search still falls back to that implementation at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1073-1078`.

Impact
Noise-only or tie-only batches can surface as maximally relevant in composite, RSF shadow metrics, and degraded hybrid fallback behavior. That makes RRF, composite, and graph-derived scores incomparable and causes fallback quality checks to overestimate confidence.

Recommended Fix
Handle flat distributions explicitly: return `0` for all-zero batches, preserve the raw score for singleton batches, and use a neutral midpoint only when the upstream stage explicitly marks an unresolved tie. Do not map "no separation" to "perfect relevance."

### C3-004: Graph FTS Results Use an Unbounded Raw Score Scale / Medium / Scoring magnitude mismatch / .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:164
Description
The graph FTS subchannel multiplies clamped edge strength by raw `-bm25(...)` output and returns that as `score` without normalization. Other graph-derived channels in the same pipeline use very different scales and caps, so the graph family does not share a common magnitude contract.

Evidence
`queryCausalEdgesFTS5()` calculates `score = edgeStrength * ftsScore` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:161-167`, where `ftsScore` is the raw `-bm25(...)` value selected at `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:143-154`. The hierarchy augmentation path instead clamps to `Math.max(0, Math.min(1, row.relevance * 0.75))` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:91-97`, while degree-channel normalization caps out at `0.15` in `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:337-344`. If enhanced search degrades, `hybridSearchEnhanced()` falls back to `hybridSearch()` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1073-1078`, and that fallback consumes raw graph scores numerically.

Impact
Graph result ordering becomes dependent on whichever graph subchannel produced the hit instead of a stable shared notion of relevance. Fallback ranking, diagnostics, and any future direct graph-score consumers become scale-sensitive and hard to calibrate.

Recommended Fix
Normalize graph FTS scores into the documented `[0, 1]` range before returning them. If raw BM25 magnitude is still useful for observability, store it in a separate field such as `rawGraphFtsScore`.

### C3-005: Degree Scoring Recomputes a Global Normalization Pass on Every Query / Medium / Performance bottleneck / .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:352
Description
The degree channel caches per-node scores, but it still recomputes the global maximum typed degree for every batch by scanning all graph nodes and recalculating their degrees. That makes the normalization denominator query-time work instead of mutation-time work.

Evidence
`computeMaxTypedDegree()` scans every unique node in `causal_edges` and calls `computeTypedDegree()` once per node at `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:352-375`. `computeDegreeScores()` invokes that full pass on every batch at `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:414-415`, even though only individual degree scores are cached in `degreeCache`.

Impact
As the graph grows, every query that enables the degree channel pays a graph-wide normalization tax. This adds avoidable latency and creates a non-linear hotspot in the search path.

Recommended Fix
Cache `maxDegree` alongside the per-node cache and invalidate both in `clearDegreeCache()`, or replace the per-node JS loop with a single SQL/materialized aggregation that is refreshed only on causal-edge mutations.

### C3-006: Result Formatter Accepts Corrupted IDs Without Validation / Medium / Missing validation / .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:394
Description
The formatter converts non-numeric IDs with `Number.parseInt()` and never checks the result. That silently accepts partial numeric prefixes and allows `NaN` to flow into the response envelope.

Evidence
`formatSearchResults()` assigns `id: typeof rawResult.id === 'number' ? rawResult.id : Number.parseInt(rawResult.id, 10)` at `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:392-406`. Unlike nearby fields such as `parentId`, `chunkIndex`, and `chunkCount`, it does not use `toNullableNumber()` or any integer validation. Inputs like `"12abc"` become `12`; non-numeric strings become `NaN`.

Impact
Malformed result IDs can corrupt downstream deduplication, trace attribution, and client parsing. JSON serialization will coerce `NaN` to `null`, which is especially dangerous because it looks like a legitimate missing value rather than a rejected bad ID.

Recommended Fix
Validate IDs with strict integer parsing before formatting. If an ID is not a finite integer, either drop the row with telemetry or return a formatter error instead of emitting a partially parsed or `NaN` ID.

### C3-007: Content Formatting Fans Out Unbounded File Reads / Medium / Performance bottleneck / .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:392
Description
When `includeContent` is enabled, the formatter launches one async task per result with `Promise.all()`, and each task may read from disk, parse anchors, and run token estimation. There is no concurrency limit or back-pressure.

Evidence
The formatter wraps the entire result mapping in `await Promise.all(results.map(async ...))` at `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:392-539`. Inside each task it may call `fs.promises.readFile()` at `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:450-456`, parse anchors at `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:463-503`, and estimate tokens multiple times at `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:467-503`. `memory-search` forwards full pipeline result sets straight into this formatter at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1049-1058`.

Impact
Large or content-heavy result sets can create bursty filesystem IO and memory pressure, especially on degraded paths where many results survive into formatting. This is a latency spike risk, not just a cosmetic inefficiency.

Recommended Fix
Limit content formatting concurrency with a small worker pool or `p-limit`, and short-circuit disk reads once the response budget or result limit has already been satisfied.
