---
title: "Reporting dashboard (eval_reporting_dashboard)"
description: "Covers the read-only reporting dashboard that aggregates sprint-level and channel-level evaluation metrics."
---

# Reporting dashboard (eval_reporting_dashboard)

## 1. OVERVIEW

Covers the reporting dashboard that aggregates sprint-level and channel-level evaluation metrics from the eval database.

This is a performance report that shows how well the search system has been working over time. It tracks metrics across different work periods and search channels so you can see whether things are getting better or worse. Aside from idempotent eval-database initialization on first use, it reads and aggregates stored evaluation data without mutating evaluation results.

---

## 2. CURRENT REALITY

Generates a sprint-level and channel-level metric dashboard from stored evaluation runs. You can filter by sprint, channel and metric, and choose between text (plain fixed-width) or JSON output.

The dashboard aggregates per-sprint metric summaries (mean, min, max, latest, count) and per-channel performance views (hit count, average latency, query count) from the `eval_metric_snapshots` and `eval_channel_results` tables. Sprint labels are read from metric-snapshot metadata (`sprint` or `sprintLabel`) and fall back to `run-{eval_run_id}` when metadata is absent. Trend analysis compares consecutive sprint groups using each metric's latest value, with `isHigherBetter()` treating latency-style and inversion-style metrics as lower-is-better and most other metrics as higher-is-better. The ablation/reporting handler that feeds these tables now attributes chunk-backed hits to `parentMemoryId ?? row.id`, so trend rows stay attached to canonical parent memories instead of transient chunk IDs.

Runtime behavior is read-only after initialization. The dashboard path queries the eval database and produces reports without mutating stored eval rows, but its first call can trigger initialization if no eval DB has been selected yet. The accessor now tries `getEvalDb()` before falling back to `initEvalDb()`, so dashboard generation keeps using an already-selected non-default or test eval DB instead of silently switching back to the default one. Two different limits apply: the request `limit` keeps only the most recent sprint groups after grouping, using each group's `lastSeen` timestamp for recency, while `SPECKIT_DASHBOARD_LIMIT` caps dashboard SQL reads. Returned reports still render sprint groups chronologically and preserve the per-channel breakdown for every kept sprint group. Snapshot rows are still fetched directly, but channel data is grouped per included eval-run/channel pair before sprint aggregation so large per-query histories do not starve the kept sprint groups.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/core/db-state.ts` | Core | Database refresh before dashboard generation |
| `mcp_server/handlers/eval-reporting.ts` | Handler | Eval reporting handler |
| `mcp_server/handlers/types.ts` | Handler | Type definitions |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
| `mcp_server/lib/eval/reporting-dashboard.ts` | Lib | Reporting dashboard |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `mcp_server/tool-schemas.ts` | Schema | Public MCP schema for dashboard filters and output format |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Strict Zod validation for dashboard arguments |

### Routing And Registry

| File | Layer | Role |
|------|-------|------|
| `mcp_server/tools/lifecycle-tools.ts` | Routing | Validates and dispatches `eval_reporting_dashboard` tool calls |
| `mcp_server/tools/types.ts` | Routing | Shared typed arg shapes used by lifecycle dispatch |
| `mcp_server/handlers/index.ts` | Registry | Re-exports the eval handlers for tool modules |
| `mcp_server/lib/architecture/layer-definitions.ts` | Registry | Registers `eval_reporting_dashboard` as an L6 analysis tool |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/reporting-dashboard.vitest.ts` | Dashboard reporting tests |
| `mcp_server/tests/handler-eval-reporting.vitest.ts` | Handler-level eval reporting tests |

---

## 4. SOURCE METADATA

- Group: Evaluation
- Source feature title: Reporting dashboard (eval_reporting_dashboard)
- Current reality source: FEATURE_CATALOG.md
