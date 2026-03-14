# Reporting dashboard (eval_reporting_dashboard)

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
Covers the read-only reporting dashboard that aggregates sprint-level and channel-level evaluation metrics.

## 2. CURRENT REALITY
Generates a sprint-level and channel-level metric dashboard from stored evaluation runs. You can filter by sprint, channel and metric, and choose between text (markdown-formatted) or JSON output.

The dashboard aggregates per-sprint metric summaries (mean, min, max, latest, count) and per-channel performance views (hit count, average latency, query count) from the `eval_metric_snapshots` and `eval_channel_results` tables. Sprint labels are read from metric-snapshot metadata (`sprint` or `sprintLabel`) and fall back to `run-{eval_run_id}` when metadata is absent. Trend analysis compares consecutive sprint groups using each metric's latest value, with `isHigherBetter()` treating latency-style and inversion-style metrics as lower-is-better and most other metrics as higher-is-better.

This is a read-only module. It queries the eval database and produces reports with no writes or mutation side effects. Two different limits apply: the request `limit` keeps only the most recent sprint groups after grouping, while `SPECKIT_DASHBOARD_LIMIT` caps dashboard SQL reads. Snapshot rows are still fetched directly, but channel data is grouped per included eval-run/channel pair before sprint aggregation so large per-query histories do not starve the kept sprint groups.

---

## 3. IN SIMPLE TERMS
This is a performance report that shows how well the search system has been working over time. It tracks metrics across different work periods and search channels so you can see whether things are getting better or worse. It only reads data and never changes anything, making it safe to run at any time.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/core/db-state.ts` | Core | Database refresh before dashboard generation |
| `mcp_server/handlers/eval-reporting.ts` | Handler | Eval reporting handler |
| `mcp_server/handlers/types.ts` | Handler | Type definitions |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
| `mcp_server/lib/eval/reporting-dashboard.ts` | Lib | Reporting dashboard |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `mcp_server/tests/reporting-dashboard.vitest.ts` | Test | Dashboard aggregation and formatting coverage |
| `mcp_server/tests/handler-eval-reporting.vitest.ts` | Test | Handler response coverage |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/reporting-dashboard.vitest.ts` | Dashboard reporting tests |
| `mcp_server/tests/handler-eval-reporting.vitest.ts` | Handler-level eval reporting tests |

## 5. SOURCE METADATA
- Group: Evaluation
- Source feature title: Reporting dashboard (eval_reporting_dashboard)
- Current reality source: feature_catalog.md

