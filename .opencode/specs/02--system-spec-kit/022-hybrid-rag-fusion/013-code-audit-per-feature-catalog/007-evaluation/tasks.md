# Tasks — Phase 007: Evaluation

## Summary

| Priority | Count | Description                                            |
| -------- | ----- | ------------------------------------------------------ |
| **P0**   | 2     | FAIL findings — behavior mismatch, missing data source |
| **P1**   | 0     | —                                                      |
| **P2**   | 3     | WARN findings — test/doc gaps only                     |
| **Total**| 5     |                                                        |

---

## P0 — FAIL (Immediate Fix Required)

### T-01: Resolve eval_final_results data source mismatch
- **Priority:** P0
- **Feature:** F-02 Reporting dashboard (eval_reporting_dashboard)
- **Status:** TODO
- **Source:** `lib/eval/reporting-dashboard.ts:181-213,218-241`, `feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md:7`
- **Issue:** Feature catalog claims dashboard aggregation uses `eval_metric_snapshots`, `eval_channel_results`, and `eval_final_results`, but implementation queries only `eval_metric_snapshots` and `eval_channel_results`. `eval_final_results` has no query function or SQL statement anywhere in the codebase.
- **Fix:** Either implement `eval_final_results` querying in `reporting-dashboard.ts` or update the feature catalog to remove the `eval_final_results` claim and clarify the dashboard uses only snapshots and channel results.

### T-02: Add reporting dashboard handler-level tests
- **Priority:** P0
- **Feature:** F-02 Reporting dashboard (eval_reporting_dashboard)
- **Status:** TODO
- **Source:** `handlers/eval-reporting.ts:136-157`
- **Issue:** No focused handler-level tests validate `handleEvalReportingDashboard` request filtering/format selection and response envelope behavior. `sprintFilter`, `channelFilter`, `metricFilter`, `limit` pass-through, and `format` defaulting to `'text'` are untested at the handler level.
- **Fix:** Add handler-level tests for format/filter/limit behavior and the text vs JSON output path.

---

## P2 — WARN (Documentation / Test Gaps)

### T-03: Add ablation handler-level test coverage
- **Priority:** P2
- **Feature:** F-01 Ablation studies (eval_run_ablation)
- **Status:** TODO
- **Source:** `handlers/eval-reporting.ts:53-61,116-118`, `tests/mcp-tool-dispatch.vitest.ts:29-30`
- **Issue:** No focused handler-level tests validate `handleEvalRunAblation` argument normalization and disabled-flag error path; no tests for `storeResults=false` or `includeFormattedReport=false` paths.
- **Fix:** Add handler-level tests for disabled-flag `MemoryError` throw, invalid channels fallback to `ALL_CHANNELS`, `recallK` normalization (negative, zero, fractional), `storeResults=false` bypass, and `includeFormattedReport=false` omission.

### T-04: Remove stale retry.vitest.ts reference (F-01)
- **Priority:** P2
- **Feature:** F-01 Ablation studies (eval_run_ablation)
- **Status:** TODO
- **Source:** `feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:150`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature test inventory.

### T-05: Remove stale retry.vitest.ts reference (F-02)
- **Priority:** P2
- **Feature:** F-02 Reporting dashboard (eval_reporting_dashboard)
- **Status:** TODO
- **Source:** `feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md:152`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature test inventory.
