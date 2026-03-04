# Evaluation and housekeeping fixes

## Current Reality

Six fixes addressed evaluation framework reliability and protocol-boundary safety:

- **Ablation recallK (#33):** Ablation search limit uses `recallK` parameter instead of hardcoded 20.
- **evalRunId persistence (#34):** `_evalRunCounter` lazy-initializes from `MAX(eval_run_id)` in the eval DB on first call, surviving server restarts.
- **Postflight re-correction (#35):** `task_postflight` SELECT now matches `phase IN ('preflight', 'complete')` so re-posting updates the existing record instead of failing.
- **parseArgs guard (#36):** `parseArgs<T>()` returns `{} as T` for null/undefined/non-object input at the protocol boundary.
- **128-bit dedup hash (#37):** Session dedup hash extended from `.slice(0, 16)` (64-bit) to `.slice(0, 32)` (128-bit) to reduce collision probability.
- **Exit handler cleanup (#38):** `_exitFlushHandler` reference stored; `cleanupExitHandlers()` now calls `process.removeListener()` for `beforeExit`, `SIGTERM`, and `SIGINT`.

---

## Source Metadata

- Group: Opus review remediation (Phase 017)
- Source feature title: Evaluation and housekeeping fixes
- Summary match found: Yes
- Summary source feature title: Evaluation and housekeeping fixes
- Current reality source: feature_catalog.md
