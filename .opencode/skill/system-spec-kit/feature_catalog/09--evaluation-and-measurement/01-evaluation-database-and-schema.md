# Evaluation database and schema

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. PLAYBOOK COVERAGE](#5--playbook-coverage)
- [6. IN SIMPLE TERMS](#6--in-simple-terms)

## 1. OVERVIEW

Describes the dedicated SQLite evaluation database, its five-table schema and the fail-safe logging hooks that capture retrieval quality data without affecting production query flow.

## 2. CURRENT REALITY

A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.

Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Evaluation database and schema
- Current reality source: feature_catalog.md

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario NEW-005

## 6. IN SIMPLE TERMS

When you want to know how well your search results are performing, you need a safe place to store that measurement data. This feature keeps all quality-tracking records in a separate storage area so they never mix with or interfere with the actual search results you rely on. If the measurement process ever hits a problem, your searches keep working normally as if nothing happened.
