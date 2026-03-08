# Full reporting and ablation study framework

## Current Reality

The ablation study framework disables one retrieval channel at a time (vector, BM25, FTS5, graph or trigger) and measures Recall@20 delta against a full-pipeline baseline. "What happens if we turn off the graph channel?" is now a question with a measured answer rather than speculation.

The framework uses dependency injection for the search function, making it testable without the full pipeline. Statistical significance is assessed via a sign test using log-space binomial coefficient computation (preventing overflow for n>50, fixed in Sprint 8). Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results). Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation data. Runs behind the `SPECKIT_ABLATION` flag.

The reporting dashboard aggregates per-sprint metric summaries (mean, min, max, latest, count) and per-channel performance views (hit count, average latency, query count) from the evaluation database. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON. A `isHigherBetter()` helper correctly interprets trend direction for different metric types. Both the ablation runner and the dashboard are exposed as new MCP tools: `eval_run_ablation` and `eval_reporting_dashboard`.

## Source Files

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

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Full reporting and ablation study framework
- Current reality source: feature_catalog.md
