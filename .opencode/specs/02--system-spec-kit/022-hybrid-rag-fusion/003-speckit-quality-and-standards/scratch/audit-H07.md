# H07 TypeScript Standards Audit

- Timestamp: 2026-03-08T15:29:33.682783Z
- Scope: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval` (15 files)
- Checks: P0 (5), P1 (5)

## Per-file Results

| File | Status | Findings |
|---|---|---|
| `ablation-framework.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P1.2 exported function runAblation uses inline object param type |
| `bm25-baseline.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P1.2 exported function runBM25Baseline uses inline object param type |
| `channel-attribution.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P1.2 exported function attributeChannels uses inline object param type; P1.3 non-null assertion lacks justification comment near line 111 |
| `edge-density.ts` | **FAIL** | P0.1 header block not exact required 3-line format |
| `eval-ceiling.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P0.2 exported function/interface/type uses any |
| `eval-db.ts` | **FAIL** | P0.1 header block not exact required 3-line format |
| `eval-logger.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P1.5 catch for _error lacks instanceof narrowing |
| `eval-metrics.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P1.2 exported function computeImportanceWeightedRecall uses inline object param type |
| `eval-quality-proxy.ts` | **FAIL** | P0.1 header block not exact required 3-line format |
| `ground-truth-data.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P1.4 missing TSDoc for exported declaration: interface GroundTruthQuery { |
| `ground-truth-feedback.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P1.2 exported function recordUserSelection uses inline object param type |
| `ground-truth-generator.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P1.2 exported function loadGroundTruth uses inline object param type |
| `k-value-analysis.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P1.3 non-null assertion lacks justification comment near line 66 |
| `reporting-dashboard.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P1.2 exported function generateDashboardReport uses inline object param type; P1.3 non-null assertion lacks justification comment near line 290; P1.5 catch for _error lacks instanceof narrowing |
| `shadow-scoring.ts` | **FAIL** | P0.1 header block not exact required 3-line format; P1.2 exported function getShadowStats uses inline object param type; P1.3 non-null assertion lacks justification comment near line 288 |

## Summary

- PASS: **0**
- FAIL: **15**
- Frequent failure categories:
  - P0.1 header block not exact required 3-line format
  - P1.2 exported function runAblation uses inline object param type
  - P1.2 exported function runBM25Baseline uses inline object param type
  - P1.2 exported function attributeChannels uses inline object param type
  - P1.3 non-null assertion lacks justification comment near line 111
  - P0.2 exported function/interface/type uses any
  - P1.5 catch for _error lacks instanceof narrowing
  - P1.2 exported function computeImportanceWeightedRecall uses inline object param type
  - P1.4 missing TSDoc for exported declaration: interface GroundTruthQuery {
  - P1.2 exported function recordUserSelection uses inline object param type
  - P1.2 exported function loadGroundTruth uses inline object param type
  - P1.3 non-null assertion lacks justification comment near line 66
