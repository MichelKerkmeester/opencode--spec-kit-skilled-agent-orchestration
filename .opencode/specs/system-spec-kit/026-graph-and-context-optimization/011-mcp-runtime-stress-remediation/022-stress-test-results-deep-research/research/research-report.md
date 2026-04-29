# v1.0.3 Stress Test Results Deep Research Report

Session: `022-stress-test-results-deep-research`
Status: Complete
Stop reason: max iteration 5 reached; convergence did not trigger.

## 1. Executive Summary

Verdict: **CONDITIONAL evidence, actionable planning**. v1.0.3 is a meaningful telemetry step forward because it produced 12 `SearchDecisionEnvelope` rows, 12 decision-audit rows, 12 shadow rows, 100% non-placeholder W4 trigger firing in the stress sample, and a concrete SLA panel. It does not yet prove full live `memory_search` handler emission, because the handler probe stopped at embedding readiness and MCP calls were cancelled before a live envelope appeared (`findings-v1-0-3.md:14`, `findings-v1-0-3.md:101`).

The most important distinction is evidence layer. v1.0.3 used the search-quality corpus and packet-local runner to compose production modules around deterministic fixture outputs (`findings-v1-0-3.md:20`, `findings-v1-0-3.md:21`; `phase-h-stress.test.ts:45`, `phase-h-stress.test.ts:49`). That proves module contracts, sample artifact shape, and telemetry persistence paths. It leaves production selectivity, live-handler p95 latency, live audit emission, and long-run W4 trigger rates as directional only.

The strongest new finding is a W3 telemetry caveat. The packet-local runner attempts to add causal contradiction data via `causalEdges`, but the trust-tree contract expects `causal: { edges }` (`phase-h-stress.test.ts:190`, `trust-tree.ts:46`). The resulting W3 contradiction envelope has `hasContradiction:false` and empty causal arrays (`v1-0-3-envelopes.jsonl:5`). This is not a v1.0.3 regression against v1.0.2 or v1.0.1 because prior cycles did not have this envelope layer; it is an over-claim inside v1.0.3 evidence.

The Planning Packet should seed Phase K with two capture workstreams before Phase L hardening: first, a deterministic live-handler envelope capture seam; second, a native harness telemetry export mode. Production dashboards, shadow replay, retention policy, and W4 weighting should follow only after the capture path produces real handler rows.

Headline convergence: five iterations completed with newInfoRatio sequence `0.86, 0.72, 0.54, 0.38, 0.22`. No early-stop condition triggered because there were not two consecutive iterations below `0.10`.

## 2. Research Questions Answered

### RQ1 - What v1.0.3 Proves vs Leaves Unproven

**Proven by v1.0.3 artifacts:**

| Claim | Evidence | Strength |
|---|---|---|
| Packet-local run wrote 12 envelopes, 12 audit rows, and 12 shadow rows. | Evidence list and summary counts (`findings-v1-0-3.md:5`, `v1-0-3-summary.json:4061`). | High for artifact existence. |
| Envelope fields were populated in the sample. | Summary field completeness records `queryPlan`, `trustTree`, `rerankGateDecision`, `shadowDeltas`, `cocoindexCalibration`, `degradedReadiness`, `tenantId`, and `latencyMs` as populated (`v1-0-3-summary.json:4065`). | High for sample field presence. |
| W4 triggers are real names, not placeholders. | Trigger table records `flag_disabled:0` and `unknown:0` (`findings-v1-0-3.md:55`, `findings-v1-0-3.md:65`). | High for sample trigger names. |
| Source wiring exists for handler envelope and audit. | Handler builds the envelope and records the decision after pipeline execution (`memory-search.ts:1169`, `memory-search.ts:1191`, `memory-search.ts:1410`). | High for source wiring. |

**Left unproven or directional:**

| Claim | Evidence Gap | Consequence |
|---|---|---|
| Full live `memory_search` handler emitted an envelope. | MCP calls cancelled and direct handler probe timed out (`findings-v1-0-3.md:14`, `findings-v1-0-3.md:101`). | Must remain P1 gap. |
| v1.0.3 percentage beats v1.0.2 percentage. | v1.0.2 is a 30-cell CLI-model rubric; v1.0.3 is deterministic harness telemetry (`findings-v1-0-3.md:23`, `findings-rubric-v1-0-3.json:27`). | Compare directionally only. |
| Production p95 latency or long-run trigger/refusal rates. | Sample size is 12 (`v1-0-3-summary.json:5`, `v1-0-3-summary.json:4061`). | Sample-size guards active. |
| W3 causal contradiction envelope correctness. | Runner passes `causalEdges`, not `causal.edges` (`phase-h-stress.test.ts:190`, `trust-tree.ts:46`). | W3 causal sample is over-claimed. |

### RQ2 - Live Handler Embed-Readiness Gate

The block originates inside `handleMemorySearch` on cache miss. The handler imports `isEmbeddingModelReady` and `waitForEmbeddingModel` (`memory-search.ts:61`), checks readiness before building `PipelineConfig` (`memory-search.ts:927`), waits 30000ms (`memory-search.ts:928`), and throws `Embedding model not ready after 30s timeout. Try again later.` if readiness never flips (`memory-search.ts:930`). The readiness flag is a module-level boolean in `db-state.ts`, with `setEmbeddingModelReady` as the setter and a polling loop that returns false on timeout (`db-state.ts:559`, `db-state.ts:564`, `db-state.ts:569`, `db-state.ts:574`).

Smallest deterministic seam: add a live-handler telemetry test that calls `handleMemorySearch` with a seeded fixture and a test-only readiness bypass. Existing tests already mock readiness to true (`memory-search-integration.vitest.ts:22`, `memory-search-integration.vitest.ts:29`). A probe warmup is less deterministic because it still depends on external model initialization. A pure mock of the whole pipeline is too weak if the goal is "live handler"; the right seam is readiness bypass plus seeded DB/pipeline fixture, with `SPECKIT_SEARCH_DECISION_AUDIT_PATH` pointed at a temp file.

### RQ3 - Harness-vs-Handler Envelope Parity Gap

The search-quality harness is intentionally database-agnostic and result-oriented. `SearchQualityChannelOutput` only has candidates, refusal, citations, final answer, and latency (`harness.ts:29`), while `SearchQualityCaseResult` only records candidate maps, captures, relevance, citation/refusal policy, and latency (`harness.ts:46`). The harness loops through injectable channel runners and stores normalized captures (`harness.ts:84`, `harness.ts:113`, `harness.ts:143`). There is no native slot for `SearchDecisionEnvelope`, decision-audit rows, or shadow rows.

Smallest harness change: add optional telemetry-preservation fields without importing production runtime modules into the harness. Concretely:

- Extend `SearchQualityChannelOutput` with `telemetry?: { envelope?: SearchDecisionEnvelope; auditRows?: SearchDecisionEnvelope[]; shadowRows?: ShadowDeltaRecord[] }`.
- Extend `SearchQualityChannelCapture` and `SearchQualityCaseResult` to preserve those fields.
- Add an optional `options.telemetryBuilder` or `options.telemetryExportPath` so runner-supplied telemetry can be exported as JSONL.
- Add a baseline test proving current static runners still work and a telemetry-mode test proving one runner can return an envelope.

This keeps `corpus.ts`'s fixture-only design intact (`corpus.ts:4`) while eliminating packet-local wrapper duplication.

### RQ4 - W4 Trigger Distribution

Observed sample distribution: `complex-query`:6, `high-authority`:5, `weak-evidence`:6, `multi-channel-weak-margin`:4, and `disagreement:advisor-memory-divergence`:1 (`findings-v1-0-3.md:55`, `v1-0-3-summary.json:415`). Trigger rate is 100% across 12 rows (`findings-v1-0-3.md:44`, `findings-rubric-v1-0-3.json:391`).

What this reveals:

- Query population is intentionally skewed toward ambiguous, weak-evidence, high-authority, and degraded-readiness cases. The packet runner forces W4 cases to complex/high-authority and weak disagreement signals (`phase-h-stress.test.ts:213`, `phase-h-stress.test.ts:239`).
- Gate validity is proven at "trigger reachability" level, not "selectivity" level. The gate collects triggers centrally (`rerank-gate.ts:57`) and has a low candidate-count floor (`rerank-gate.ts:42`), but this run lacks negative controls.
- Tuning candidates are threshold tightening on `topScoreMargin <= 0.08`, trigger weighting, and multi-trigger backoff/cost caps (`rerank-gate.ts:68`, `rerank-gate.ts:71`). `speculation: true` until a larger negative-control corpus validates them.

### RQ5 - v1.0.1 -> v1.0.2 -> v1.0.3 Through-Line

| Cycle | Proved | Disproved | Left Open |
|---|---|---|---|
| v1.0.1 | A reproducible 9-scenario, 30-cell playbook can expose search/intelligence behavior (`001-scenario-design/spec.md:133`, `002-scenario-execution/findings.md:7`). | The MCP-equipped path is not automatically safer: opencode hallucinated under weak retrieval and copilot mutated the wrong folder (`002-scenario-execution/findings.md:14`, `002-scenario-execution/findings.md:15`). | N=1 variance, weak-retrieval guard, code-graph sparseness, vocabulary violations (`002-scenario-execution/findings.md:79`). |
| v1.0.2 | Remediation materially improved the matrix: 76.7% -> 83.8%, zero regressions, 6/7 packets proven (`010/findings.md:15`, `010/findings.md:16`, `010/findings-rubric.json:79`). | The v1.0.1 catastrophic I2/opencode behavior was not durable after response-policy remediation (`010/findings.md:17`, `010/findings.md:52`). | Packet 005 degraded graph path stayed neutral, copilot I1 remained unsafe, N=1 remained a limit (`010/findings.md:75`, `010/findings.md:103`, `010/findings.md:144`). |
| v1.0.3 | W3-W13 source/module contracts and packet-local telemetry samples exist; W4 real triggers fire; W8-W13 have envelope/audit/shadow shape (`021/findings-v1-0-3.md:69`, `021/findings-v1-0-3.md:85`). | Placeholder W4 trigger concern is closed for this sample: no `flag_disabled` or `unknown` triggers (`021/findings-v1-0-3.md:63`, `021/findings-v1-0-3.md:65`). | Live handler emission, harness-native telemetry export, production selectivity, and W3 causal contradiction sample correctness (`021/findings-v1-0-3.md:101`, `phase-h-stress.test.ts:190`). |

No RQ surfaces a confirmed v1.0.3 regression against v1.0.2 or v1.0.1. The W3 causal-edge mismatch is a new telemetry artifact gap, not a regression, because earlier cycles did not claim packet-local causal envelope correctness.

### RQ6 - Expansion Candidates Ranked by Leverage x Feasibility

| Rank | Candidate | Leverage | Feasibility | Rationale |
|---|---|---|---|---|
| 1 | Live-handler envelope capture seam | Very high | High | Removes the biggest v1.0.3 caveat by crossing readiness and proving handler audit emission (`memory-search.ts:927`, `memory-search.ts:1410`). |
| 2 | Harness telemetry export mode | Very high | High | Converts packet-local wrapper into reusable infrastructure (`harness.ts:29`, `findings-v1-0-3.md:107`). |
| 3 | Decision-audit SLA dashboard + drift detection | High | Medium | Audit/SLA metrics already exist but need real handler rows (`decision-audit.ts:23`, `decision-audit.ts:62`). |
| 4 | Shadow-sink replay harness | High | Medium | Shadow rows are persisted, but replay/outcome analysis is not first-class (`shadow-sink.ts:39`). |
| 5 | W4 trigger histogram + weighting/backoff experiment | Medium-high | Medium | Trigger collection is centralized, but selectivity data is missing (`rerank-gate.ts:57`). |
| 6 | Audit retention and rotation policy | Medium | High | Audit rotation exists at max bytes, but policy and operational retention are not yet a planning artifact (`decision-audit.ts:9`, `decision-audit.ts:113`). |
| 7 | CocoIndex calibration histogram alerting | Medium | Medium | v1.0.3 carries calibration telemetry, but alert thresholds need broader samples (`search-decision-envelope.ts:137`, `search-decision-envelope.ts:142`). |

## 3. Top Workstreams

| Workstream | v1.0.3 Confirmation | Remaining Gap |
|---|---|---|
| W3 trust tree | Builder composes trust signals (`trust-tree.ts:65`); samples include trustTree. | Packet-local W3 contradiction sample misses causal edge due `causalEdges` shape (`phase-h-stress.test.ts:190`). |
| W4 conditional rerank | Real trigger names fire, with no placeholders (`findings-v1-0-3.md:55`). | 100% trigger rate is stress-corpus skew, not production selectivity. |
| W5 shadow weights | Shadow sink writes JSONL (`shadow-sink.ts:39`); 12 shadow rows exist (`v1-0-3-summary.json:4061`). | No replay/outcome analysis yet. |
| W6 CocoIndex calibration | Envelope attaches calibration and recommended multiplier (`search-decision-envelope.ts:137`, `search-decision-envelope.ts:142`). | Packet runner uses controlled duplicate candidates (`phase-h-stress.test.ts:157`). |
| W7 degraded readiness | Degraded readiness fields appear in W7 sample rows (`v1-0-3-envelopes.jsonl:9`, `v1-0-3-envelopes.jsonl:12`). | Still fixture-driven, not live degraded graph state. |
| W8 SearchDecisionEnvelope | Contract defines QueryPlan, trustTree, rerank, shadow, calibration, degraded readiness, timing, timestamp, latency (`search-decision-envelope.ts:44`). | Needs live-handler capture. |
| W9 shadow JSONL sink | Sink append path works (`shadow-sink.ts:39`). | Handler/advisor replay not integrated into search-quality harness. |
| W10 degraded integration | v1.0.3 findings cite focused degraded integration proof (`findings-v1-0-3.md:80`). | Needs broader live degraded graph cases. |
| W11 CocoIndex runtime consumer | Handler builds calibration before envelope (`memory-search.ts:1151`, `memory-search.ts:1169`). | Needs handler run proof after readiness seam. |
| W12 QueryPlan to Stage 3 | Handler passes `queryPlan` to pipeline config (`memory-search.ts:969`), Stage 3 forwards it to rerank (`stage3-rerank.ts:151`). | Needs live telemetry row showing actual handler QueryPlan. |
| W13 decision audit + SLA | Audit writes JSONL and computes SLA metrics (`decision-audit.ts:43`, `decision-audit.ts:62`). | Needs retention, dashboard labels, drift detection, and real handler row population. |

## 4. Cross-System Insights

**Handler <-> harness <-> telemetry contract.** The handler has the right downstream shape, but the readiness gate blocks direct evidence before the envelope path (`memory-search.ts:927`, `memory-search.ts:1169`). The harness has the right deterministic corpus shape, but it cannot carry telemetry artifacts natively (`harness.ts:29`, `harness.ts:46`). Phase K should join these by adding a deterministic handler seam and harness telemetry export mode.

**Advisor <-> search <-> envelope.** Shadow deltas can be represented in the envelope (`search-decision-envelope.ts:126`) and persisted through the advisor shadow sink (`shadow-sink.ts:39`). v1.0.3 proves row shape, not learned-weight replay. A replay harness should consume both shadow rows and envelopes once live-handler capture exists.

**Decision audit <-> shadow sink <-> replay.** `recordSearchDecision` stores full envelopes as JSONL (`decision-audit.ts:43`, `decision-audit.ts:51`), while `recordShadowDelta` stores smaller shadow rows (`shadow-sink.ts:39`, `shadow-sink.ts:49`). The shared opportunity is a replayable trace bundle: envelope row + shadow row + final observed outcome.

## 5. Active Findings Registry

| ID | Severity | Finding | Evidence | Status |
|---|---|---|---|---|
| F-022-001 | P1 | Live handler end-to-end telemetry remains unproven. | MCP/direct probe caveat (`findings-v1-0-3.md:14`, `findings-v1-0-3.md:101`); readiness gate (`memory-search.ts:927`, `memory-search.ts:930`). | Open; Planning Packet PP-1. |
| F-022-002 | P1 | Harness cannot natively emit envelope/audit/shadow artifacts. | Harness output/result types lack telemetry fields (`harness.ts:29`, `harness.ts:46`). | Open; Planning Packet PP-2. |
| F-022-003 | P1 | W3 contradiction telemetry is over-claimed in packet-local envelopes. | Runner passes `causalEdges` (`phase-h-stress.test.ts:190`); contract expects `causal` (`trust-tree.ts:46`); sample has no contradiction (`v1-0-3-envelopes.jsonl:5`). | Open; not classified as cycle regression. |
| F-022-004 | P1 | 100% W4 trigger rate cannot validate production selectivity. | Trigger counts/rate (`findings-v1-0-3.md:55`, `findings-rubric-v1-0-3.json:391`); runner signal skew (`phase-h-stress.test.ts:239`). | Open; needs negative-control corpus. |
| F-022-005 | P2 | Sample-size guards downgrade p95/rate claims to directional. | N=12 (`v1-0-3-summary.json:5`, `v1-0-3-summary.json:4061`). | Active guardrail. |
| F-022-006 | P2 | W4 threshold tightening, trigger weighting, and multi-trigger backoff are plausible but unproven. `speculation: true`. | Gate trigger logic (`rerank-gate.ts:57`, `rerank-gate.ts:68`, `rerank-gate.ts:71`). | Candidate experiment only. |
| F-022-007 | P2 | Prior cycle implementation summaries are weaker source-of-truth than findings/rubrics. | v1.0.2 findings complete (`010/findings.md:3`) while implementation summary still says scaffold pending (`010/implementation-summary.md:39`). | Documentation hygiene candidate. |

## 6. Planning Packet

### PP-1 - Live Handler Envelope Capture Seam

- **Leverage**: Very high
- **Feasibility**: High
- **Owning packet number**: `023-live-handler-envelope-capture-seam`
- **Recommended Phase**: Phase K, stress cycle v1.0.4
- **Dependencies**: `handleMemorySearch`, core readiness setter/mock, seeded DB or pipeline fixture, temp `SPECKIT_SEARCH_DECISION_AUDIT_PATH`, one corpus case with deterministic candidates.
- **Acceptance criteria sketches**:
  - A behavioral test calls `handleMemorySearch` and reaches envelope construction without waiting on real embedding warmup.
  - Test writes at least one live handler audit JSONL row through `recordSearchDecision`.
  - Response metadata contains `searchDecisionEnvelope` and `search_decision_envelope`.
  - Test documents whether `executePipeline` is real, seeded, or mocked; "live handler" claim must match that layer.

### PP-2 - Harness Telemetry Export Mode

- **Leverage**: Very high
- **Feasibility**: High
- **Owning packet number**: `024-harness-telemetry-export-mode`
- **Recommended Phase**: Phase K, stress cycle v1.0.4
- **Dependencies**: `harness.ts` result types, `corpus.ts` fixture contract, optional telemetry builder/export options, baseline test update.
- **Acceptance criteria sketches**:
  - `SearchQualityChannelOutput` can carry optional envelope/audit/shadow telemetry.
  - `SearchQualityCaseResult` preserves per-case telemetry without changing existing quality metrics.
  - Baseline deterministic harness test still passes with no telemetry.
  - A new telemetry-mode test writes envelope, audit, and shadow JSONL without a packet-local wrapper.

### PP-3 - Decision Audit SLA Dashboard and Drift Detection

- **Leverage**: High
- **Feasibility**: Medium
- **Owning packet number**: `025-decision-audit-sla-dashboard`
- **Recommended Phase**: Phase L, production hardening
- **Dependencies**: PP-1 live handler rows, PP-2 harness export mode, audit retention policy, dashboard labels, W4 trigger histogram.
- **Acceptance criteria sketches**:
  - Dashboard-ready summary includes count, p50/p95/p99 latency, decision class, refusal rate, rerank trigger rate, stage latency, tenant/user/agent scope where present.
  - Drift detector flags trigger-rate, decision-class, and latency shifts against baseline windows.
  - Sample-size guard prevents alerts from firing below configured minimum N.
  - Retention/rotation policy is documented and tested.

## 7. Convergence Audit

| Iter | Focus | newInfoRatio | P0 | P1 | P2 | Signal |
|---|---|---:|---:|---:|---:|---|
| 1 | v1.0.3 evidence audit + sample-size implications | 0.86 | 0 | 3 | 1 | continue |
| 2 | Live handler gate + harness parity | 0.72 | 0 | 4 | 1 | continue |
| 3 | W4 trigger distribution + SLA | 0.54 | 0 | 2 | 2 | continue |
| 4 | Cross-cycle synthesis | 0.38 | 0 | 3 | 1 | approaching-convergence |
| 5 | Expansion ranking + Planning Packet | 0.22 | 0 | 3 | 1 | converged-by-max-iterations |

Stop reason: `max_iterations_reached`. Early-stop condition was not met because no two consecutive iterations had `newInfoRatio < 0.10`.

Sample-size guards activated: yes. Any p95, rate, or production-tail claim based on the 12-row v1.0.3 samples is treated as directional only.

Executor note: packet config requested `cli-codex` gpt-5.5 xhigh. This runtime is already Codex, and the `cli-codex` skill self-invocation guard prohibits recursive `codex exec`; artifacts were authored by the current Codex session while preserving the requested packet state shape.

## 8. Sources

- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/022-stress-test-results-deep-research/spec.md:1`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/022-stress-test-results-deep-research/research/deep-research-strategy.md:1`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:14`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:20`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:37`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:55`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:69`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:85`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:101`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md:111`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-rubric-v1-0-3.json:27`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-rubric-v1-0-3.json:371`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-rubric-v1-0-3.json:382`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/findings-rubric-v1-0-3.json:415`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-summary.json:5`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-summary.json:4041`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-summary.json:4052`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-summary.json:4061`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-envelopes.jsonl:1`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-envelopes.jsonl:5`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-envelopes.jsonl:6`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-envelopes.jsonl:9`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-envelopes.jsonl:12`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-shadow-sink-sample.jsonl:1`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:45`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:49`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:82`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:137`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:157`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:190`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:213`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/phase-h-stress.test.ts:239`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/spec.md:133`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:7`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:14`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:79`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:15`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:69`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings-rubric.json:65`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings-rubric.json:79`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/research-report.md:9`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/research-report.md:64`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/research-report.md:171`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:61`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:621`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:927`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:969`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1151`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1169`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1191`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1410`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:559`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:564`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:569`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:22`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/harness.ts:29`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/harness.ts:46`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/harness.ts:84`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/corpus.ts:4`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/metrics.ts:70`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:155`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:186`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w3-trust-tree.vitest.ts:29`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w13-decision-audit.vitest.ts:47`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts:44`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts:78`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts:126`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts:137`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts:23`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts:43`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts:62`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:31`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:42`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:57`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:68`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:151`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:46`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:65`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/shadow/shadow-sink.ts:39`

## 9. Open Questions

- Should Phase K split live-handler seam and harness export into two packets (`023`, `024`) or combine them to keep v1.0.4 setup smaller?
- What minimum N should promote rate/p95 claims from directional to decision-grade?
- Should W3 causal contradiction replay be a blocker for v1.0.4, or a P1 acceptance criterion inside the harness export packet?
- Should live-handler capture use a real seeded DB fixture, a mocked pipeline, or both as separate evidence layers?
- Which production-hardening path should Phase L prioritize after capture: SLA dashboards, shadow replay, or retention policy?
