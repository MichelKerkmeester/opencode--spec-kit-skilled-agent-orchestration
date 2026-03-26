---
title: "Full reporting and ablation study framework"
description: "Describes the ablation study framework that disables one retrieval channel at a time to measure Recall@20 impact, and the reporting dashboard that aggregates per-sprint metric summaries with trend analysis."
---

# Full reporting and ablation study framework

## 1. OVERVIEW

Describes the ablation study framework that disables one retrieval channel at a time to measure Recall@20 impact, and the reporting dashboard that aggregates per-sprint metric summaries with trend analysis.

Imagine a car with five engines and you want to know which ones actually help. This feature turns off one engine at a time and measures whether the car goes slower or faster. If removing an engine makes things worse, it is pulling its weight. If removing it makes things better, it was actually hurting. A dashboard then shows trends over time so you can spot problems early.

---

## 2. CURRENT REALITY

The ablation study framework disables one retrieval channel at a time (vector, BM25, FTS5, graph or trigger) and measures Recall@20 delta against a full-pipeline baseline. "What happens if we turn off the graph channel?" now has a measured answer rather than speculation.

The framework uses dependency injection for the search function, making it testable without the full pipeline. Statistical significance is assessed via a sign test using log-space binomial coefficient computation (preventing overflow for n>50, fixed in Sprint 8). Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results). Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation data. The framework runs behind the `SPECKIT_ABLATION` flag. Token-usage aggregation now filters to finite values greater than zero, so ablation reports stop emitting synthetic `0` token rows when `runAblation()` has no real token-usage samples to aggregate.

The reporting dashboard aggregates per-sprint metric summaries (mean, min, max, latest and count) and per-channel performance views (hit count, average latency and query count) from the evaluation database. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON. A `isHigherBetter()` helper correctly interprets trend direction for different metric types. The dashboard now calls `getEvalDb()` before falling back to `initEvalDb()`, which preserves an already-selected non-default or test eval DB instead of silently switching back to the default one. Its request `limit` is the number of sprint groups kept after grouping, not the number of raw eval runs fetched. Both the ablation runner and the dashboard are exposed as new MCP tools: `eval_run_ablation` and `eval_reporting_dashboard`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/ablation-framework.ts` | Lib | Ablation study framework |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |
| `mcp_server/lib/eval/ground-truth-data.ts` | Lib | Ground truth data |
| `mcp_server/lib/eval/reporting-dashboard.ts` | Lib | Reporting dashboard |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/ablation-framework.vitest.ts` | Ablation framework tests |
| `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |
| `mcp_server/tests/eval-metrics.vitest.ts` | Eval metrics computation |
| `mcp_server/tests/ground-truth.vitest.ts` | Ground truth tests |
| `mcp_server/tests/reporting-dashboard.vitest.ts` | Dashboard reporting tests |

---

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Full reporting and ablation study framework
- Current reality source: FEATURE_CATALOG.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 014
