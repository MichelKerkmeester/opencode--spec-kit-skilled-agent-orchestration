# Evaluation database and schema

## Current Reality

A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.

Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows; `memory_match_triggers` emits query/final-result rows.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Evaluation database and schema
- Current reality source: feature_catalog.md
