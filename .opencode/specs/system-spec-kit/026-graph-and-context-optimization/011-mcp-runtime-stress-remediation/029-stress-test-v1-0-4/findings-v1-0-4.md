# Findings - Stress-Test v1.0.4

> **Status**: complete as of 2026-04-29T12:55:00Z.
>
> **Stop reason**: all v1.0.3-layout cells scored; no live-handler wiring halt triggered.
>
> **Machine-readable sidecar**: `findings-rubric-v1-0-4.json`.
>
> **Evidence artifacts**:
> - `findings-rubric-v1-0-4.json` - scored cell sidecar.
> - `measurements/v1-0-4-summary.json` - aggregate metrics, SLA panel, caveat status, and comparison deltas.
> - `measurements/v1-0-4-envelopes.jsonl` - 16 live handler SearchDecisionEnvelope samples.
> - `measurements/v1-0-4-audit-log-sample.jsonl` - 16 decision-audit rows from `SPECKIT_SEARCH_DECISION_AUDIT_PATH`.
> - `measurements/v1-0-4-shadow-sink-sample.jsonl` - 16 harness-exported shadow rows.
> - `measurements/phase-k-v1-0-4-stress.test.ts` - packet-local runner.

## Executive Summary

**Overall verdict: PASS with hasAdvisories.** The three v1.0.3 caveats are resolved in this measurement posture: the live `handleMemorySearch` seam produced envelopes and audit rows, the search-quality harness emitted telemetry through `telemetryExportPath`, and every envelope carried `degradedReadiness.freshness`.

Headline numbers:

1. Scored rubric aggregate: `93/96 = 96.9%` (`measurements/v1-0-4-summary.json:92`).
2. Harness quality metric: `75.4%`, equal to v1.0.3 after one-decimal rounding (`measurements/v1-0-4-summary.json:282`).
3. v1.0.2 baseline: `83.8%`, not exact same-cell comparable because v1.0.2 used 30 CLI-model cells (`010-stress-test-rerun-v1-0-2/findings-rubric.json:65`).
4. Regression count: 0 v1.0.3 same-case drops (`measurements/v1-0-4-summary.json:92`).
5. Advisory: rates and percentiles are directional because this run has 12 corpus cases and 16 channel captures, below the 30-cell guard (`measurements/v1-0-4-summary.json:5`, `measurements/v1-0-4-summary.json:602`).

## Methodology

- **Corpus**: `SEARCH_QUALITY_EXTENDED_CORPUS`, version `007-search-rag-measurement-driven-implementation-v1`, 12 cases (`mcp_server/stress_test/search-quality/corpus.ts:192`).
- **Rubric**: correctness / robustness / telemetry / regression-safety, scale `0-2`, equal weights. This follows the generalized stress-cycle dimensions (`feature_catalog/14--stress-testing/01-stress-test-cycle.md:40`).
- **Measurement method**: PP-1 + PP-2 combined. The runner mocks `executePipeline` at the retrieval boundary while `handleMemorySearch` runs as production code, mirroring the PP-1 disclosure (`mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:1`). Harness telemetry export is the PP-2 path (`mcp_server/stress_test/search-quality/harness.ts:103`, `mcp_server/stress_test/search-quality/harness.ts:199`).
- **Comparison method**: same 12-case layout as v1.0.3 for telemetry comparability. v1.0.2 remains a directional baseline only because its sidecar is a 30-cell CLI-model rubric (`010-stress-test-rerun-v1-0-2/findings.md:28`, `010-stress-test-rerun-v1-0-2/findings-rubric.json:65`).
- **Known scorer limits**: single packet-local Vitest runner; retrieval is deterministic at the mocked pipeline boundary, so this validates handler/harness telemetry wiring more than live database ranking.

## Aggregate Metrics

| Metric | Phase E all-baseline | v1.0.3 | v1.0.4 | Delta vs Phase E | Delta vs v1.0.3 |
|--------|----------------------|--------|--------|------------------|-----------------|
| precision@3 | 0.458 | 0.597 | 0.597 | +0.139 | 0.000 |
| recall@3 | 0.625 | 0.667 | 0.667 | +0.042 | 0.000 |
| p50 latency | 0.010ms | 0.003ms | 1.447ms | +1.437ms | +1.444ms |
| p95 latency | 0.109ms | 0.009ms | 13.221ms | +13.112ms | +13.212ms |
| p99 latency | 0.109ms | 0.009ms | 13.221ms | +13.112ms | +13.212ms |
| refusal-survival | 1.000 | 1.000 | 1.000 | 0.000 | 0.000 |
| citation-quality | 0.583 | 0.750 | 0.750 | +0.167 | 0.000 |

Latency deltas are directional: v1.0.4 includes live handler response formatting and audit reads, while v1.0.3's harness metrics were fixture-only (`021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:20`).

## SLA Panel

| SLA Metric | v1.0.4 |
|------------|--------|
| envelope count | 16 |
| decision-audit rows | 16 |
| shadow sink rows | 16 |
| rerank trigger rate | 100% directional |
| refusal rate | 0% directional |
| decision distribution | degraded: 16 |
| average latency | 0.563ms |
| p95 latency | 3ms |
| stage1 avg / p95 | 9.125ms / 15ms |
| stage2 avg / p95 | 10.125ms / 16ms |
| stage3 avg / p95 | 11.125ms / 17ms |
| stage4 avg / p95 | 1ms / 1ms |
| total pipeline avg / p95 | 31.375ms / 49ms |

SLA source: `measurements/v1-0-4-summary.json:534`.

## W4 Trigger Firings

| Trigger | Count |
|---------|-------|
| `high-authority` | 11 |
| `multi-channel-weak-margin` | 12 |
| `weak-evidence` | 7 |
| `complex-query` | 10 |
| `disagreement:advisor-memory-divergence` | 2 |
| `flag_disabled` | 0 |
| `unknown` | 0 |

The trigger logic is the runtime helper, not a string fixture: `decideConditionalRerank` collects `complex-query`, `high-authority`, `multi-channel-weak-margin`, `weak-evidence`, and disagreement triggers at `mcp_server/lib/search/rerank-gate.ts:57`. The Phase K distribution is recorded at `measurements/v1-0-4-summary.json:566`.

## Per-W Verdict

| W | v1.0.4 Verdict | vs v1.0.3 | vs Phase E Baseline | Evidence |
|---|----------------|-----------|---------------------|----------|
| W3 trust tree | PROVEN | Metric total held at 0.917. | precision +0.334, recall +0.500, citation +1.000 inherited from v1.0.3 baseline delta. | Current score at `measurements/v1-0-4-summary.json:162`; envelope contract at `mcp_server/lib/search/search-decision-envelope.ts:44`. |
| W4 conditional rerank | PROVEN | Metric total held at 1.000. | precision +0.667 inherited from v1.0.3 delta. | Current score at `measurements/v1-0-4-summary.json:176`; trigger distribution at `measurements/v1-0-4-summary.json:566`. |
| W5 shadow weights | PROVEN | Metric total held at 0.875. | citation +1.000 inherited from v1.0.3 delta. | Current score at `measurements/v1-0-4-summary.json:190`; harness shadow export at `mcp_server/stress_test/search-quality/harness.ts:229`. |
| W6 CocoIndex calibration | PROVEN | Metric total held at 1.000. | precision +0.667 inherited from v1.0.3 delta. | Current score at `measurements/v1-0-4-summary.json:204`; handler passes calibration into envelope at `mcp_server/handlers/memory-search.ts:1145`. |
| W7 degraded readiness | PROVEN | Four W7 cells held at 1.000 and every envelope has freshness populated. | Phase E ceiling held on recall/refusal/citation. | Current W7 scores at `measurements/v1-0-4-summary.json:218`; mapper emits snapshot freshness at `mcp_server/lib/search/graph-readiness-mapper.ts:45`. |
| W8 SearchDecisionEnvelope | PROVEN | Closes v1.0.3 live-handler gap. | Newer telemetry layer; no Phase E equivalent. | Contract fields at `mcp_server/lib/search/search-decision-envelope.ts:44`; builder attaches optional telemetry at `search-decision-envelope.ts:78`. |
| W9 shadow JSONL sink | PROVEN with advisory | Harness export produced 16 shadow rows; memory_search itself does not call advisor. | Newer telemetry layer; no Phase E equivalent. | Shadow export rows counted at `measurements/v1-0-4-summary.json:302`; limitation at `measurements/v1-0-4-summary.json:605`. |
| W10 degraded integration | PROVEN | `fresh`, `empty`, `stale`, and `error` freshness values observed. | Newer telemetry layer; no Phase E equivalent. | Caveat status at `measurements/v1-0-4-summary.json:592`; handler maps snapshot at `mcp_server/handlers/memory-search.ts:1163`. |
| W11 CocoIndex runtime consumer | PROVEN | 16/16 envelopes carried calibration telemetry. | Newer telemetry layer; no Phase E equivalent. | Field completeness at `measurements/v1-0-4-summary.json:302`; handler calibration build at `mcp_server/handlers/memory-search.ts:1145`. |
| W12 QueryPlan to Stage 3 | PROVEN | W4 trigger evidence depends on query-plan-sensitive rerank decisions. | Newer telemetry layer; no Phase E equivalent. | Handler passes `queryPlan` into `PipelineConfig` at `mcp_server/handlers/memory-search.ts:929`; runner uses runtime `decideConditionalRerank` trigger helper at `mcp_server/lib/search/rerank-gate.ts:31`. |
| W13 decision audit + SLA | PROVEN | 16 audit rows captured and SLA metrics computed. | Newer telemetry layer; no Phase E equivalent. | `recordSearchDecision` writes JSONL at `mcp_server/lib/search/decision-audit.ts:43`; SLA helper at `decision-audit.ts:62`; handler calls audit at `mcp_server/handlers/memory-search.ts:1407`. |

## Wiring-Active Confirmation

| Signal | Production Trace Confirmed? | File:line Evidence | Artifact Evidence |
|--------|-----------------------------|--------------------|-------------------|
| `queryPlan` | Y | `mcp_server/handlers/memory-search.ts:791`, `mcp_server/handlers/memory-search.ts:963` | 16/16 envelopes complete (`measurements/v1-0-4-summary.json:302`). |
| `trustTree` | Y | `mcp_server/lib/search/search-decision-envelope.ts:91` | 16/16 field completeness true (`measurements/v1-0-4-summary.json:302`). |
| `rerankGateDecision` | Y | `mcp_server/lib/search/search-decision-envelope.ts:115` | Trigger counts non-placeholder (`measurements/v1-0-4-summary.json:566`). |
| `cocoindexCalibration` | Y | `mcp_server/handlers/memory-search.ts:1145`, `mcp_server/lib/search/search-decision-envelope.ts:137` | 16/16 field completeness true (`measurements/v1-0-4-summary.json:302`). |
| `degradedReadiness` | Y | `mcp_server/handlers/memory-search.ts:1163`, `mcp_server/lib/search/graph-readiness-mapper.ts:75` | Freshness values: `fresh`, `empty`, `stale`, `error` (`measurements/v1-0-4-summary.json:592`). |
| `recordSearchDecision` | Y | `mcp_server/handlers/memory-search.ts:1407`, `mcp_server/lib/search/decision-audit.ts:43` | 16 audit rows (`measurements/v1-0-4-summary.json:302`). |
| Harness telemetry export | Y | `mcp_server/stress_test/search-quality/harness.ts:199`, `mcp_server/stress_test/search-quality/harness.ts:229` | Export path and audit mirror count (`measurements/v1-0-4-summary.json:7`, `measurements/v1-0-4-summary.json:302`). |

## Caveat Resolution

| v1.0.3 Caveat | v1.0.4 Status | Evidence |
|---------------|---------------|----------|
| Live handler probe blocked by 30s readiness timeout | RESOLVED | v1.0.3 recorded the timeout caveat at `021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:14`; v1.0.4 captured 16 live handler envelopes and 16 audit rows (`measurements/v1-0-4-summary.json:583`). |
| Harness fixture-only telemetry | RESOLVED | v1.0.3 recommended first-class export mode at `021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:107`; v1.0.4 uses `telemetryExportPath` and records the export base (`measurements/v1-0-4-summary.json:7`). |
| `degradedReadiness` always undefined | RESOLVED | Handler now maps `getGraphReadinessSnapshot(process.cwd())` into the envelope (`mcp_server/handlers/memory-search.ts:1163`); all samples have non-undefined freshness (`measurements/v1-0-4-summary.json:592`). |

## Surprises

1. **All SearchDecisionEnvelope trust-tree decisions classified as `degraded`.** This is not a halt condition because the runner intentionally includes weak/degraded readiness fixtures and the envelope field path is active, but it means decision distribution is not a selectivity proof (`measurements/v1-0-4-summary.json:534`).
2. **Harness quality stayed exactly flat versus v1.0.3.** That is expected because the deterministic candidate layout is intentionally inherited; the value added by v1.0.4 is live-handler and export-path evidence, not retrieval-score movement (`measurements/v1-0-4-summary.json:282`).
3. **Shadow telemetry remains harness-exported, not advisor-invoked by memory_search.** This is a W9 advisory, not a regression, because memory_search does not own advisor dispatch in this seam (`measurements/v1-0-4-summary.json:605`).

## Adversarial Self-Check

No REGRESSION block was required. The v1.0.4 run has no v1.0.3 same-case metric drop (`measurements/v1-0-4-summary.json:92`), and there is no exact same-cell mapping to v1.0.2's 30-cell CLI matrix (`measurements/v1-0-4-summary.json:275`).

## Recommendations

1. **P1 - Add a larger-N live-handler stress pass.**
   - Evidence: this run has 12 corpus cases / 16 captures, so rates and percentiles are directional (`measurements/v1-0-4-summary.json:602`).
   - Recommended fix: run a v1.0.5+ N>=30 live-handler sample if SLA thresholds become release-blocking.
   - Owner: follow-up stress packet.

2. **P2 - Separate shadow-sink proof from memory_search proof.**
   - Evidence: v1.0.4 shadow rows are harness telemetry-export records; memory_search does not invoke advisor in this seam (`measurements/v1-0-4-summary.json:605`).
   - Recommended fix: keep W9 proven for PP-2 export, but use an advisor-owned live shadow test when validating advisor dispatch.
   - Owner: W9 follow-up or advisor packet.

3. **P2 - Treat W4 trigger rate as reachability, not selectivity.**
   - Evidence: trigger rate is 100% across 16 captures (`measurements/v1-0-4-summary.json:574`).
   - Recommended fix: add negative-control cells if the next cycle needs rerank selectivity evidence.
   - Owner: W4 follow-up.

## Limitations

- The v1.0.4 run follows v1.0.3's 12-case telemetry layout, not v1.0.2's 30-cell CLI-model matrix.
- Retrieval is mocked at `executePipeline`, following PP-1. This validates live handler formatting, envelope construction, degraded-readiness wiring, and audit emission, not live ranking quality.
- Rates and percentiles are directional because sample size is below 30.
- Shadow rows prove harness export, not live advisor invocation from memory_search.

## Artifacts

- `findings-v1-0-4.md`
- `findings-rubric-v1-0-4.json`
- `measurements/phase-k-v1-0-4-stress.test.ts`
- `measurements/vitest.phase-k.config.ts`
- `measurements/v1-0-4-envelopes.jsonl`
- `measurements/v1-0-4-audit-log-sample.jsonl`
- `measurements/v1-0-4-shadow-sink-sample.jsonl`
- `measurements/v1-0-4-summary.json`
