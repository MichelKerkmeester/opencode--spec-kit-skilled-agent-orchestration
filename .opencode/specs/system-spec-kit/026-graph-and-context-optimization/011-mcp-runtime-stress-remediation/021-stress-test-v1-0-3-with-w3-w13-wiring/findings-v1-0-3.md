# Findings - Stress-Test v1.0.3 with W3-W13 Wiring

> **Status**: complete as of 2026-04-29T05:20Z.
>
> **Evidence artifacts**:
> - `measurements/v1-0-3-envelopes.jsonl` - 12 SearchDecisionEnvelope samples.
> - `measurements/v1-0-3-audit-log-sample.jsonl` - 12 decision-audit rows.
> - `measurements/v1-0-3-shadow-sink-sample.jsonl` - 12 shadow sink rows.
> - `measurements/v1-0-3-summary.json` - aggregate metrics, SLA panel, W4 trigger counts.
> - `findings-rubric-v1-0-3.json` - machine-readable sidecar.

## Executive Summary

**Overall verdict: CONDITIONAL.** The W3-W13 modules and focused tests are wired and observable, and the packet-local stress run produced populated envelope, audit, and shadow artifacts. The condition is that the full live `memory_search` handler path could not be captured in this session: MCP calls returned `user cancelled MCP tool call`, and a direct `handleMemorySearch` probe hit `Embedding model not ready after 30s timeout` before a live handler envelope emitted.

The harness/module evidence is positive: W3, W4, W5, and W6 improve over their Phase E baseline cells; W7 holds at ceiling; W8/W10/W11/W12/W13 are proven by packet samples plus focused tests. W4 now fires real trigger names: `complex-query`, `high-authority`, `weak-evidence`, and `multi-channel-weak-margin`, with no `flag_disabled` or `unknown` trigger in the sample.

## Methodology

- Used the existing search-quality corpus and `runMeasurement()` fixture harness. No harness files were modified.
- Built 12 packet-local SearchDecisionEnvelope samples from production modules: `routeQuery`, `decideConditionalRerank`, `calibrateCocoIndexOverfetch`, `buildSearchDecisionEnvelope`, `recordSearchDecision`, and `recordShadowDelta`.
- Compared W3-W7 metrics against Phase E measurement JSONs under `000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/measurements/`.
- Compared v1.0.3 directionally against v1.0.2. The v1.0.2 score is a 30-cell CLI-model rubric; v1.0.3 is a deterministic harness telemetry rubric, so the comparison is not a like-for-like percentage.

## Aggregate Metrics

| Metric | Phase E all-baseline | v1.0.3 all-variant | Delta |
|--------|----------------------|--------------------|-------|
| precision@3 | 0.458 | 0.597 | +0.139 |
| recall@3 | 0.625 | 0.667 | +0.042 |
| p50 latency | 0.010ms | 0.003ms | -0.007ms |
| p95 latency | 0.109ms | 0.009ms | -0.100ms |
| p99 latency | 0.109ms | 0.009ms | -0.100ms |
| refusal-survival | 1.000 | 1.000 | 0.000 |
| citation-quality | 0.583 | 0.750 | +0.167 |

## SLA Panel

| SLA Metric | v1.0.3 |
|------------|--------|
| envelope count | 12 |
| decision-audit rows | 12 |
| shadow sink rows | 12 |
| rerank trigger rate | 100% |
| refusal rate | 8.3% |
| decision distribution | degraded: 5, trusted: 7 |
| average latency | 58.5ms |
| p95 latency | 97ms |
| stage1 avg / p95 | 6.5ms / 12ms |
| stage2 avg / p95 | 7.5ms / 13ms |
| stage3 avg / p95 | 8.5ms / 14ms |
| stage4 avg / p95 | 1ms / 1ms |
| total pipeline avg / p95 | 23.5ms / 40ms |

## W4 Trigger Firings

| Trigger | Count |
|---------|-------|
| `complex-query` | 6 |
| `high-authority` | 5 |
| `weak-evidence` | 6 |
| `multi-channel-weak-margin` | 4 |
| `disagreement:advisor-memory-divergence` | 1 |
| `flag_disabled` | 0 |
| `unknown` | 0 |

The source trigger logic is real, not placeholder logic: `rerank-gate.ts` collects `complex-query`, `high-authority`, `multi-channel-weak-margin`, `weak-evidence`, and disagreement triggers at `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:57`.

## Per-W Verdict

| W | v1.0.3 Verdict | vs v1.0.2 | vs Phase E Baseline | Evidence |
|---|----------------|-----------|---------------------|----------|
| W3 trust tree | PROVEN | Newer telemetry layer; no v1.0.2 equivalent cell. | precision +0.334, recall +0.500, citation +1.000 on W3. | Trust tree composes response policy, code graph, advisor, CocoIndex, and causal signals at `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:65`. |
| W4 conditional rerank | PROVEN | Closes the pre-G "flag only" concern. | precision +0.667 on W4; latency not worse. | Stage 3 passes real `queryPlan` into rerank at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:151`; trigger logic at `rerank-gate.ts:57`. |
| W5 shadow weights | PROVEN | Newer telemetry layer; no v1.0.2 equivalent cell. | citation +1.000 on W5. | Advisor output includes `_shadow` and calls `recordShadowDelta` at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:271`; sink appends JSONL at `skill_advisor/lib/shadow/shadow-sink.ts:39`. |
| W6 CocoIndex calibration | PROVEN | Extends v1.0.2 CocoIndex fork telemetry into envelope form. | precision +0.667 on W6. | Calibration computes duplicate density, effective limit, path classes, and scope at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:44`. |
| W7 degraded readiness | NEUTRAL-CEILING | Improves confidence over v1.0.2 packet 005 NEUTRAL by exercising degraded-readiness artifacts. | precision/recall/citation/refusal all held at 1.000. | W10 integration captures real code_graph_query degraded readiness into an envelope at `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts:23`. |
| W8 SearchDecisionEnvelope | PROVEN | New in Phase G. | 12/12 samples had all requested fields populated. | Envelope contract fields are defined at `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts:44`; builder attaches trust tree, rerank, shadow, calibration, and degraded readiness at `search-decision-envelope.ts:78`. |
| W9 shadow JSONL sink | PROVEN with handler-gap caveat | New in Phase G. | 12 shadow rows captured. | Sink appends JSONL at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/shadow/shadow-sink.ts:39`; advisor handler calls it at `advisor-recommend.ts:281`. The search-quality harness does not itself invoke `advisor_recommend`. |
| W10 degraded integration | PROVEN | New in Phase G. | Focused test verifies actual code_graph_query empty-state fallback. | `handleCodeGraphQuery` degraded result and envelope mapping are tested at `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts:29`. |
| W11 CocoIndex runtime consumer | PROVEN | New in Phase G. | 12/12 envelopes carried calibration telemetry. | `memory_search` builds `cocoindexCalibration` and passes it into the envelope at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1170`; W11 focused test checks recommended multiplier at `w11-cocoindex-calibration-telemetry.vitest.ts:21`. |
| W12 QueryPlan to Stage 3 | PROVEN | New in Phase G. | W4 trigger evidence depends on real QueryPlan. | `memory_search` places `queryPlan` in `PipelineConfig` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:969`; Stage 3 forwards it to rerank at `stage3-rerank.ts:151`. |
| W13 decision audit + SLA | PROVEN | New in Phase G. | 12 audit rows captured; SLA metrics computed. | `recordSearchDecision` appends JSONL at `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts:43`; SLA metrics are computed at `decision-audit.ts:62`; handler calls the audit at `memory-search.ts:1410`. |

## Wiring-Active Confirmation

| Signal | Production Trace Confirmed? | File:line Evidence | Artifact Evidence |
|--------|-----------------------------|--------------------|-------------------|
| `queryPlan` | Y at module/source; live handler probe blocked | `memory-search.ts:969`, `stage3-rerank.ts:151` | 12/12 envelopes include `queryPlan`. |
| `trustTree` | Y | `search-decision-envelope.ts:91`, `trust-tree.ts:65` | 12/12 envelopes include `trustTree`. |
| `rerankGateDecision` | Y | `rerank-gate.ts:31`, `stage3-rerank.ts:163` | 12/12 envelopes include `rerankGateDecision`; trigger rate 100%. |
| `shadowDeltas` | Y at sink/builder; advisor handler source-confirmed | `search-decision-envelope.ts:126`, `advisor-recommend.ts:281`, `shadow-sink.ts:39` | 12/12 envelopes include `shadowDeltas`; 12 shadow JSONL rows. |
| `cocoindexCalibration` | Y | `cocoindex-calibration.ts:44`, `memory-search.ts:1185` | 12/12 envelopes include calibration. |
| `degradedReadiness` | Y | `search-decision-envelope.ts:152`, `w10-degraded-readiness-integration.vitest.ts:47` | 12/12 envelopes include degraded readiness; W7 cells carry degraded states. |
| `tenantId` / `userId` / `agentId` | Y | `search-decision-envelope.ts:82`, `memory-search.ts:1171` | 12/12 envelopes include tenant/user/agent IDs. |
| `latencyMs` | Y | `search-decision-envelope.ts:87`, `decision-audit.ts:65` | 12/12 envelopes include latency; SLA p95 = 97ms. |
| `recordSearchDecision` firing | Y at audit function and packet run; live handler probe blocked | `decision-audit.ts:43`, `memory-search.ts:1410` | 12 audit JSONL rows. |

## Surprises

1. **P1 - Live handler end-to-end telemetry could not be captured.** MCP `memory_search` and `memory_context` calls returned `user cancelled MCP tool call`; a direct `handleMemorySearch` probe timed out at the embedding readiness gate after 30 seconds. The handler source clearly wires envelope and audit calls, but this run did not produce a live handler envelope.
2. **The search-quality harness is still fixture-driven.** It is useful for metric deltas, but it does not naturally emit SearchDecisionEnvelope, audit, or shadow sink samples. The packet-local runner had to compose production modules around the corpus.
3. **Vitest discovery ran the packet-local runner alongside adjacent matching tests.** Final JSONL artifacts were deduplicated to 12 unique rows after the runner execution.

## Recommendations

1. **P1 - Add a first-class telemetry export mode to the search-quality harness.** The harness should return SearchDecisionEnvelope, audit, and shadow records without requiring a packet-local wrapper.
2. **P1 - Add an embedding-ready bypass or seeded fixture for live `memory_search` telemetry tests.** The handler probe should be able to reach envelope emission deterministically.
3. **P2 - Keep W4 trigger count checks in focused tests.** The current W4 test proves complex/high triggers; the v1.0.3 stress run adds weak-evidence and weak-margin visibility.

## Limitations

- The v1.0.3 aggregate harness percent in the rubric sidecar is not directly comparable to the v1.0.2 30-cell CLI model score of 83.8%.
- Packet-local telemetry samples use real production builders/sinks but controlled corpus inputs.
- No runtime or harness code was modified.
