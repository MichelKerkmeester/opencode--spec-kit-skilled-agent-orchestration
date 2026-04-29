# W3-W7 Verification and Expansion Research Report

Session: `020-w3-w7-verification-and-expansion-research`  
Status: Complete  
Stop reason: max iteration 10 reached; convergence did not trigger.

## 1. Executive Summary

Verdict: **trigger Phase G remediation, telemetry-first**. W3-W7 are valuable measured artifacts, but only W4 is clearly in a production runtime path today, and even W4 is underfed because Stage 3 recreates an unknown empty QueryPlan instead of consuming the actual query-plan telemetry.

The high-confidence shape is one request-scoped search decision envelope that records QueryPlan, trust tree, rerank gate decision, advisor shadow deltas, CocoIndex calibration telemetry, and degraded-readiness state. Ship that as audit and trace metadata first; promote behavior only after measurement proves it.

Top actionable findings:

1. **P1: W3 trust tree has zero production consumers.** `buildTrustTree` is exported and tested, but caller search found only the module itself and the W3 test (`.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:65`, `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w3-trust-tree.vitest.ts:3`).
2. **P1: W4 is wired but underfed.** Stage 3 invokes `decideConditionalRerank`, but with an empty plan set to `complexity: 'unknown'`, so rich QueryPlan triggers cannot fire (`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:327`, `:328`).
3. **P1: W5 shadow diagnostics have no durable learning sink.** `_shadow` is emitted from advisor output, but the legacy CLI translation drops it and no advisor-specific sink was found (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:270`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:373`).
4. **P1: W6 calibration is test-only.** The helper computes duplicate-density telemetry, but no production consumer imports it (`.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:36`, `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w6-cocoindex-calibration.vitest.ts:3`).
5. **P1: W7 stress cells are static harness fixtures.** The W7 tests call static measurement runners, not real degraded graph states (`.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:155`, `:172`).

## 2. Research Questions Answered

### RQ1 - W3 trust tree wiring

Answer: **HIGH evidence**. W3 has zero production consumers. The module composes response policy, code graph, advisor, CocoIndex, and causal signals (`trust-tree.ts:65`), then decides mixed/degraded/unavailable/trusted (`trust-tree.ts:205`). The only outside import found was the search-quality test (`w3-trust-tree.vitest.ts:3`). This is a P1 wiring gap because W3 cannot influence runtime trust decisions.

### RQ2 - W4 rerank gate after default-on flip

Answer: **HIGH evidence**. Commit `74b6ef6b8` removed the conditional-rerank env guard and made W4 default-on inside the rerank path. `memory_search` defaults `rerank = true` (`memory-search.ts:643`), builds the V2 pipeline (`memory-search.ts:912`), and executes it (`memory-search.ts:949`). Stage 3 calls `decideConditionalRerank` (`stage3-rerank.ts:327`), but passes an unknown empty QueryPlan (`stage3-rerank.ts:328`) and only local result signals (`stage3-rerank.ts:332`). So W4 runs on eligible memory-search pipeline calls, but does not consume full query-plan context.

### RQ3 - W5 shadow weights data path

Answer: **HIGH evidence**. W5 is output-only. Live and shadow weights are separated in the lane registry (`lane-registry.ts:5`), shadow-only lanes have live `weightedScore: 0` (`fusion.ts:276`), and advisor output emits `_shadow` (`advisor-recommend.ts:270`). The compatibility CLI only translates normal recommendations (`skill_advisor.py:360`, `:373`), so `_shadow` is discarded there. No advisor-specific durable shadow sink was found.

### RQ4 - W6 promotion candidacy

Answer: **HIGH evidence**. Do not promote W6 to default-on yet. The helper applies multiplier `4` when the env flag is enabled and duplicate density is at least `0.35` (`cocoindex-calibration.ts:39`, `:41`). Tests prove the helper behavior (`w6-cocoindex-calibration.vitest.ts:7`), but runtime code currently only preserves CocoIndex telemetry as additive metadata (`seed-resolver.ts:27`, `:131`; `code_graph/handlers/context.ts:242`). There is no production consumer of `calibrateCocoIndexOverfetch`.

### RQ5 - W7 coverage gaps

Answer: **HIGH evidence**. W7 tests are static harness cells. Each W7 file calls `runMeasurement` and checks fixture cases (`w7-degraded-stale.vitest.ts:7`, `w7-degraded-empty.vitest.ts:7`, `w7-degraded-full-scan.vitest.ts:7`, `w7-degraded-unavailable.vitest.ts:7`). The measurement runner maps `code_graph_query` to `staticOutput` (`measurement-fixtures.ts:155`). Real handler coverage exists elsewhere with mocks (`code-graph-degraded-readiness-envelope-parity.vitest.ts:127`), but W7 does not exercise real stale/empty/unavailable graph states.

### RQ6 - Cross-W composition

Answer: **MEDIUM-HIGH evidence**. W3 can feed W4 because the trust tree emits degraded/mixed/unavailable decisions and reasons (`trust-tree.ts:52`, `:205`), while W4 already accepts weak evidence and disagreement reasons (`rerank-gate.ts:66`, `:69`). W5 can feed W3 because `_shadow` exposes deltas and dominant lanes (`advisor-recommend.ts:176`, `:270`). This is not wired today, but the contracts align.

### RQ7 - Adjacent pipelines

Answer: **HIGH evidence**. `memory_search` touches W4 through the pipeline (`memory-search.ts:912`, `:949`). `memory_context` has separate query-intent and code-graph branches (`memory-context.ts:1414`, `:1439`, `:1454`) and logs eval metadata (`memory-context.ts:1476`). `memory_save` uses a separate fixed overfetch multiplier for reconsolidation (`memory-save.ts:2439`; `reconsolidation-bridge.ts:351`, `:546`). These adjacent paths do not yet share W3-W7 decision metadata.

### RQ8 - Empty/dead folder audit

Answer: **HIGH evidence**. The requested `find` audit, excluding `node_modules` and `dist`, found two concrete empty directory deletion candidates:

- `.opencode/skill/system-spec-kit/mcp_server/tmp-test-fixtures/specs`
- `.opencode/skill/system-spec-kit/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/measurements`

Placeholder-only directories were also found, but they look intentional: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/out`, `.opencode/skill/system-spec-kit/scripts/test-fixtures/001-empty-folder`, and `.opencode/skill/system-spec-kit/scripts/test-fixtures/012-anchors-empty-memory/memory`.

### RQ9 - Enterprise readiness

Answer: **MEDIUM-HIGH evidence**. Scope identity exists upstream: `PipelineConfig` carries `tenantId`, `userId`, and `agentId` (`types.ts:129`), `memory_search` forwards them (`memory-search.ts:921`), and session state stores/checks them (`session-manager.ts:92`, `:361`). W3, W4, and W6 helper inputs do not carry identity scope (`trust-tree.ts:25`, `rerank-gate.ts:15`, `cocoindex-calibration.ts:14`). Advisor metrics and alerts exist (`metrics.ts:267`, `:478`), but W3-W7 lack unified decision audit rows and SLA metrics.

### RQ10 - Expansion candidates

Answer: **HIGH evidence**. Best next features are W8 SearchDecisionEnvelope, W9 advisor shadow sink, W10 real degraded-readiness integration harness, W11 CocoIndex runtime calibration wiring, W12 QueryPlan-to-rerank-gate wiring, and W13 enterprise decision audit/metrics.

## 3. Top Workstreams

1. **W8 SearchDecisionEnvelope**  
   Leverage: Very high. Feasibility: High.  
   Create a request-scoped telemetry object carrying QueryPlan, trust tree, rerank gate decision, W5 shadow deltas, W6 calibration telemetry, and W7 degraded-readiness state.

2. **W12 QueryPlan-to-W4 Stage 3 wiring**  
   Leverage: High. Feasibility: High.  
   Pass actual QueryPlan/routing metadata into Stage 3 so complex-query, high-authority, weak-evidence, and disagreement triggers can fire as designed.

3. **W9 Advisor shadow sink**  
   Leverage: High. Feasibility: High.  
   Persist `_shadow` records with prompt, chosen recommendation, live score, shadow score, delta, and later outcome/override.

4. **W10 Real degraded-readiness integration harness**  
   Leverage: High. Feasibility: Medium.  
   Build an ephemeral graph DB harness that drives actual code graph handlers through stale, empty, full-scan-required, and unavailable states.

5. **W11 CocoIndex runtime calibration wiring**  
   Leverage: Medium-high. Feasibility: Medium.  
   Wire duplicate-density telemetry at the real candidate acquisition boundary; keep behavior opt-in until cost/quality data is real.

6. **W13 Enterprise decision audit and metrics**  
   Leverage: Medium-high. Feasibility: Medium.  
   Add tenant-scoped decision audit rows, SLA labels, metrics, dashboards, and alert thresholds for W3-W7 decisions.

## 4. Cross-System Integration Insights

The stack already has the ingredients for a composed decision path. W3 can represent trust, W4 can trigger rerank from uncertainty, W5 can expose learned-weight disagreement without altering live scores, W6 can describe duplicate-heavy search conditions, and W7 can describe degraded graph readiness.

The integration problem is shape, not raw capability. Without a common envelope, each subsystem emits local metadata and loses it at the next boundary. That is why W3 and W6 remain test-only, W5 remains response-only, and W4 cannot see the richer QueryPlan context.

Recommended integration order:

1. Trace-only envelope.
2. Durable audit sink.
3. Tests proving envelope population across healthy and degraded paths.
4. Measurement runs proving quality/cost changes.
5. Behavior promotion only after evidence.

## 5. Active Findings Registry

### F-W3-001 - P1 - W3 trust tree has zero production consumers

Hunter: caller audit found only `buildTrustTree` itself and the W3 test import.  
Skeptic: Phase E intentionally described W3 as an additive helper.  
Referee: still P1 because this research charter asks for production wiring; no runtime path can benefit from W3 today.

Concrete fix: wire W3 into a trace-only `SearchDecisionEnvelope` first.

### F-W4-001 - P1 - W4 gate is wired but underfed

Hunter: Stage 3 invokes the gate, but builds an unknown empty QueryPlan.  
Skeptic: local result signals can still trigger multi-channel weak-margin rerank.  
Referee: partial value exists, but QueryPlan-derived triggers are structurally disabled in the live path.

Concrete fix: pass real QueryPlan/routing metadata into Stage 3 and emit gate decisions.

### F-W5-001 - P1 - W5 shadow diagnostics lack a durable sink

Hunter: `_shadow` is emitted but not persisted; compatibility CLI drops it.  
Skeptic: prompt cache temporarily stores parsed MCP output.  
Referee: cache is not a learning/audit pipeline. W5 cannot support offline learned-weight promotion without durable records.

Concrete fix: add advisor shadow audit rows or append-only JSONL, and preserve shadow data in CLI output behind an opt-in compatibility field.

### F-W6-001 - P1 - W6 calibration telemetry is test-only

Hunter: `calibrateCocoIndexOverfetch` has no production import.  
Skeptic: additive telemetry passthrough already exists for CocoIndex seeds.  
Referee: telemetry passthrough is not calibration. Promotion to default-on is premature until the helper fires in live candidate acquisition.

Concrete fix: wire W6 in trace-only mode, then measure duplicate-density/cost effects.

### F-W7-001 - P1 - W7 stress files are static fixtures

Hunter: all W7 files use static measurement runners.  
Skeptic: separate handler tests validate degraded envelopes with mocks.  
Referee: W7 covers harness representation, not runtime degraded-state behavior.

Concrete fix: add real or ephemeral DB integration tests for code graph degraded readiness.

### F-EMPTY-001 - P2 - Two empty deletion candidates exist

Candidates:

- `.opencode/skill/system-spec-kit/mcp_server/tmp-test-fixtures/specs`
- `.opencode/skill/system-spec-kit/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/measurements`

Do not delete in this packet; Phase G or cleanup can remove after owner confirmation.

### F-XW-001 - P2 - Unified decision envelope opportunity

W3-W7 contracts align for a telemetry-first shared envelope. This is the highest-leverage expansion because it turns isolated workstreams into a measurable runtime surface.

### F-ENT-001 - P2 - W decisions are not tenant-aware

Identity scope is carried by upstream search/session layers, but W3/W4/W6 helper inputs do not include scope. Add identity to audit metadata before any tenant-sensitive behavior changes.

### F-ENT-002 - P2 - Audit and SLA metrics are fragmented

Advisor metrics exist, and mutation audit exists elsewhere, but W3-W7 decisions lack a durable, query-scoped audit row and SLA labels.

## 6. Planning Packet

```json
{
  "triggered": true,
  "verdict": "Trigger Phase G remediation: telemetry-first runtime wiring and audit before ranking/refusal promotion.",
  "recommendedRemediationPhases": [
    {
      "id": "G1",
      "name": "SearchDecisionEnvelope trace contract",
      "scope": "Define and populate a request-scoped envelope carrying QueryPlan, W3 trust tree, W4 gate decision, W5 shadow deltas, W6 calibration telemetry, and W7 degraded-readiness state."
    },
    {
      "id": "G2",
      "name": "W4 real QueryPlan wiring",
      "scope": "Pass actual query-plan/routing metadata into Stage 3 and expose skip/apply reasons in metadata."
    },
    {
      "id": "G3",
      "name": "W5 shadow persistence",
      "scope": "Persist advisor shadow deltas to an audit/learning sink and optionally preserve them in the CLI compatibility surface."
    },
    {
      "id": "G4",
      "name": "W6 trace-only runtime calibration",
      "scope": "Call duplicate-density calibration in live CocoIndex candidate acquisition, emit telemetry, and keep multiplier opt-in."
    },
    {
      "id": "G5",
      "name": "W7 real degraded-readiness tests",
      "scope": "Add integration tests for real code graph stale, empty, full-scan-required, and unavailable states."
    },
    {
      "id": "G6",
      "name": "Enterprise audit and metrics",
      "scope": "Add tenant-scoped audit rows, SLA/cost metrics, alert thresholds, and dashboard-ready labels for W3-W7 decisions."
    }
  ],
  "specSeed": {
    "title": "Phase G - W3-W7 Runtime Wiring and Search Decision Envelope",
    "problem": "W3-W7 shipped as measured local artifacts, but W3/W6 are test-only, W5 is response-only, W7 is fixture-only, and W4 lacks real QueryPlan context.",
    "goals": [
      "Make W3-W7 decisions observable in one request-scoped envelope.",
      "Wire W4 to real QueryPlan metadata.",
      "Persist W5 shadow diagnostics for offline learning.",
      "Wire W6 telemetry in trace-only mode.",
      "Add real degraded-readiness tests for W7."
    ],
    "nonGoals": [
      "No immediate default-on promotion for W6.",
      "No live learned-weight promotion for W5.",
      "No ranking or refusal behavior change without measurement evidence."
    ]
  },
  "planSeed": [
    "Define SearchDecisionEnvelope contract and metadata placement.",
    "Wire W3 buildTrustTree into trace-only envelope population.",
    "Pass actual QueryPlan into Stage 3 rerank gate.",
    "Add advisor shadow sink and CLI compatibility preservation.",
    "Wire W6 duplicate-density telemetry at live candidate acquisition boundary without changing effective limit by default.",
    "Build W7 degraded-readiness integration harness.",
    "Add enterprise audit/metrics labels and validation."
  ]
}
```

## 7. Convergence Audit

| Iter | Focus | newInfoRatio |
|------|-------|--------------|
| 1 | W3 trust tree wiring | 0.92 |
| 2 | W4 conditional rerank wiring | 0.84 |
| 3 | W5 shadow data pipeline | 0.78 |
| 4 | W6 calibration promotion | 0.69 |
| 5 | W7 coverage gaps | 0.62 |
| 6 | Cross-W composition | 0.49 |
| 7 | Adjacent pipelines | 0.39 |
| 8 | Empty folder audit | 0.30 |
| 9 | Enterprise readiness | 0.22 |
| 10 | Expansion synthesis | 0.14 |

Stop reason: max iteration 10 reached. Convergence threshold was `<= 0.10` for two consecutive iterations; the sequence never crossed that threshold.

## 8. Sources Reviewed

- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/deep-research-strategy.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/019-search-query-rag-optimization-research/research/research-report.md:7`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/019-search-query-rag-optimization-research/research/research-report.md:21`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/implementation-summary.md:56`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/implementation-summary.md:57`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/implementation-summary.md:58`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/implementation-summary.md:59`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/implementation-summary.md:60`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/implementation-summary.md:66`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/implementation-summary.md:67`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/implementation-summary.md:68`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/implementation-summary.md:69`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/implementation-summary.md:70`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:25`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:52`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:65`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:205`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:253`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w3-trust-tree.vitest.ts:3`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w3-trust-tree.vitest.ts:7`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:15`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:26`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:57`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:60`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:63`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:66`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:69`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:327`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:328`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:332`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:643`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:912`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:921`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:949`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1101`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1128`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:99`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lane-registry.ts:5`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lane-registry.ts:10`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:270`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:276`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:176`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:270`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:280`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:281`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:79`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:360`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:373`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:14`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:31`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:36`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:39`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:41`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:76`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w6-cocoindex-calibration.vitest.ts:3`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w6-cocoindex-calibration.vitest.ts:7`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:27`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:131`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:62`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:163`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:214`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:242`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:151`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:166`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w7-degraded-stale.vitest.ts:7`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w7-degraded-empty.vitest.ts:7`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w7-degraded-full-scan.vitest.ts:7`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w7-degraded-unavailable.vitest.ts:7`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:139`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:155`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/measurement-fixtures.ts:172`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts:127`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1414`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1439`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1454`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1476`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1551`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2439`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:342`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:351`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:546`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:129`
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:92`
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:361`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:288`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts:152`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts:267`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts:478`
- `find .opencode/skill/system-spec-kit -type d -empty -not -path '*/node_modules/*' -not -path '*/dist/*'`
- `find .opencode/skill/system-spec-kit/mcp_server -type d -empty -not -path '*/node_modules/*' -not -path '*/dist/*'`
- `rg "import .*trust-tree|from .*trust-tree|buildTrustTree|calibrateCocoIndexOverfetch|cocoindex-calibration" .opencode/skill/system-spec-kit/mcp_server`

## 9. Open Questions / Deferred

- Where should the canonical `SearchDecisionEnvelope` live: shared contracts, search pipeline types, or a new `lib/search/decision-envelope.ts`?
- Should W5 `_shadow` persistence go into the advisor database, generic governance audit, or a JSONL-first learning sink?
- Which runtime boundary owns W6 calibration: CocoIndex MCP, code graph seed resolver, or memory search channel acquisition?
- Should W7 real degraded tests use an ephemeral SQLite graph DB, mocked filesystem/git state, or a fixture repository?
- Do the two empty directory candidates have external tooling expectations not visible from file contents?
- What operator policy should govern W6 default-on promotion after trace-only data is collected?
