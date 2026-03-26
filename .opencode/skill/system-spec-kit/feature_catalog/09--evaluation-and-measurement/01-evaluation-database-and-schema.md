---
title: "Evaluation database and schema"
description: "Describes the dedicated SQLite evaluation database, its five-table schema and the fail-safe logging hooks that capture retrieval quality data without affecting production query flow."
---

# Evaluation database and schema

## 1. OVERVIEW

Describes the dedicated SQLite evaluation database, its five-table schema and the fail-safe logging hooks that capture retrieval quality data without affecting production query flow.

When you want to know how well your search results are performing, you need a safe place to store that measurement data. This feature keeps all quality-tracking records in a separate storage area so they never mix with or interfere with the actual search results you rely on. If the measurement process ever hits a problem, your searches keep working normally as if nothing happened.

---

## 2. CURRENT REALITY

A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.

Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database schema, table creation, and query helpers |
| `mcp_server/lib/eval/eval-logger.ts` | Lib | Fail-safe logging hooks that write query, per-channel, and final-result rows to the eval database |
| `mcp_server/lib/telemetry/eval-channel-tracking.ts` | Lib | Collects per-channel attribution payloads and graph-walk diagnostics emitted into eval logging |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |

---

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Evaluation database and schema
- Current reality source: FEATURE_CATALOG.md
- Source list updated 2026-03-25 per deep review

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 005
