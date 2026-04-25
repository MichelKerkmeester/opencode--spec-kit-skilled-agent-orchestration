# Iteration 6: RQ-06 close (query telemetry + cache telemetry) + RQ-02 groundwork (lane topology)

## Focus

Close RQ-06 from source by separating code-graph query telemetry from adjacent advisor-cache telemetry, then ground RQ-02 by reading the scorer fusion and weights code in full and checking whether ablation coverage actually exists.

## Actions Taken

1. Grepped `.opencode/skill/system-spec-kit/mcp_server/code-graph/{handlers,lib}` for `performance.now`, `process.hrtime`, `console.time`, `Date.now`, `durationMs`, and `parseDurationMs`.
2. Read `code-graph` tests to see whether latency or percentile assertions exist, rather than assuming from fixture names alone.
3. Read `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts`, and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts` to trace advisor cache hit/miss instrumentation.
4. Read `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/{fusion.ts,weights-config.ts,ablation.ts}` plus the parity and bench files to map lane topology, effective weight diversity, and ablation coverage.

## Findings

### F28 — RQ-06: `code_graph_query` has no query-latency timers and no query-result cache telemetry

`handleCodeGraphQuery()` performs a readiness precheck and then immediately executes the query branches (`outline`, `blast_radius`, or relationship traversal) without capturing per-query start/end timestamps, elapsed execution time, or percentile-ready telemetry fields in the payload. The only cache-like behavior in this path is `ensureCodeGraphReady()`'s 5-second debounce keyed by `rootDir + allowInlineIndex + allowInlineFullScan`; that cache is for readiness checks, not query results, so it cannot produce a query-result hit ratio or explain near-duplicate query misses. This closes the source audit portion of RQ-06: today the code-graph query surface has neither P50/P95/P99 telemetry nor result-cache hit/miss accounting. Sources: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:757-771`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:785-920`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:255-294`

### F29 — RQ-06: telemetry exists today, but it lives on adjacent surfaces rather than in `code_graph_query`

The repository does contain timing/cache telemetry, just not for `code_graph_query`. The scan/parser path records `parseDurationMs` per parsed file and `durationMs` for a scan response, while the advisor-brief path marks `metrics.cacheHit` on cache hits and derives `rollingCacheHitRate` plus cache-hit-only `rollingP95Ms` from durable diagnostic records. By contrast, `prompt-cache.ts` is only the in-memory TTL/eviction store: it defines keying, `get`, `set`, invalidation, and size management, but no hit counter, miss counter, histogram, or ratio surface by itself. The practical recommendation is to mirror the advisor observability pattern on the code-graph side: add `total_ms`, `readiness_ms`, `resolve_subject_ms`, and `execution_ms` timers at the handler boundary, emit per-operation counters, and add histograms for P50/P95/P99 before considering a result cache. Sources: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:622-676`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:129-254`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:82-180`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:441-460`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:357-372`

### F30 — RQ-02: the scorer is a locked 5-lane system with weights `0.45 / 0.30 / 0.15 / 0.10 / 0.00`

`weights-config.ts` hard-locks the scorer to five named lanes: `explicit_author=0.45`, `lexical=0.30`, `graph_causal=0.15`, `derived_generated=0.10`, and `semantic_shadow=0.00`. The native scorer tests explicitly assert both the locked constant set and the fact that semantic-shadow can produce raw score while contributing zero live fusion weight. So the lane vocabulary is stable, but one lane is intentionally shadow-only in the live scorer. Sources: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:8-28`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts:47-55`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts:95-110`

### F31 — RQ-02: effective live lane diversity is lower than the 5-lane label suggests

`buildLaneScores()` computes `graph_causal` from the already-produced `explicit_author`, `lexical`, and `derived_generated` matches, so `graph_causal` is not an independent evidence family; it is a derivative re-projection over earlier lanes. Separately, live metrics exclude `semantic_shadow` from the live lane count, and contribution weighting sets semantic-shadow `weightedScore` to zero even when it has raw evidence. Operationally, that means the scorer has five named lanes, four live-weighted lanes, but only three independent primary evidence families carrying 0.85 of the live weight (`explicit_author + lexical + derived_generated`), with the remaining 0.15 assigned to the derivative `graph_causal` lane. Sources: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:114-127`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:223-230`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:303-306`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:44-48`

### F32 — RQ-02: a full lane-ablation harness exists, but shipped assertion coverage is thin

The codebase does include a generic lane-ablation harness: `runLaneAblation()` evaluates the baseline and then disables each lane in `SCORER_LANES` one by one. However, the parity suite currently asserts only that disabling the `lexical` lane reduces corpus accuracy; it does not make equivalent assertions for `explicit_author`, `graph_causal`, `derived_generated`, or `semantic_shadow`. The bench harness under `bench/scorer-bench.ts` measures end-to-end scorer latency (`cacheHitP95Ms`, `uncachedP95Ms`) rather than lane-ablation behavior, so it does not close the remaining bias/calibration question by itself. Sources: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/ablation.ts:54-74`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:169-179`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/scorer-bench.ts:42-61`

## Questions Answered

- **RQ-06 resolved:** the repository has scan/parser timing and advisor cache telemetry, but `code_graph_query` itself has no percentile latency telemetry, no result-cache keying, and no query-surface hit ratio. Near-duplicate query misses are currently unobservable because there is no query-result cache to miss against. Sources: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:757-771`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:255-294`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:441-460`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts:357-372`
- **RQ-02 groundwork advanced:** lane topology, locked weights, shadow-only semantic behavior, and current ablation/bench coverage are now source-anchored. What remains unresolved is the empirical calibration/bias question against corpus labels. Sources: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts:8-28`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:114-127`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/ablation.ts:54-74`

## Questions Remaining

- **RQ-02:** run the evaluator/ablation workflow against the real corpus so we can quantify whether explicit/lexical/derived dominance translates into systematic bias or confidence miscalibration.
- **RQ-09 spillover:** decide whether the absence of code-graph query percentile tests and the thin lane-ablation assertions should be recorded as benchmark/observability debt separate from the primary research questions.

## Next Focus

1. Run the corpus-backed lane-ablation / reporting workflow for RQ-02 rather than inferring bias from code structure alone.
2. If implementation is pursued later, instrument `handleCodeGraphQuery()` with split timers (`readiness_ms`, `resolve_subject_ms`, `execution_ms`, `total_ms`) and operation-tagged histograms/counters.
3. If a query-result cache is ever added, key it on normalized query shape plus workspace state instead of reusing the current readiness debounce key, which only captures workspace/options state.
