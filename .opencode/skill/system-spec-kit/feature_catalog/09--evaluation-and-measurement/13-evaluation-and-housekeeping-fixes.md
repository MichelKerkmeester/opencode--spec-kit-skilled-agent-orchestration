# Evaluation and housekeeping fixes

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)
- [6. PLAYBOOK COVERAGE](#6--playbook-coverage)

## 1. OVERVIEW
Covers six fixes addressing evaluation framework reliability and protocol-boundary safety, including ablation recallK, evalRunId persistence and exit handler cleanup.

## 2. CURRENT REALITY
Six fixes addressed evaluation framework reliability and protocol-boundary safety:

- **Ablation recallK (#33):** Ablation search limit uses `recallK` parameter instead of hardcoded 20.
- **evalRunId persistence (#34):** `_evalRunCounter` lazy-initializes from `MAX(eval_run_id)` in the eval DB on first call, surviving server restarts.
- **Postflight re-correction (#35):** `task_postflight` SELECT now matches `phase IN ('preflight', 'complete')` so re-posting updates the existing record instead of failing.
- **parseArgs guard (#36):** `parseArgs<T>()` returns `{} as T` for null/undefined/non-object input at the protocol boundary.
- **128-bit dedup hash (#37):** Session dedup hash extended from `.slice(0, 16)` (64-bit) to `.slice(0, 32)` (128-bit) to reduce collision probability.
- **Exit handler cleanup (#38):** `_exitFlushHandler` reference stored. `cleanupExitHandlers()` now calls `process.removeListener()` for `beforeExit`, `SIGTERM` and `SIGINT`.

---

## 3. IN SIMPLE TERMS
These are six small but important fixes for the testing and bookkeeping systems. They address issues like counters that reset when the system restarts, clean-up routines that did not run properly and safety guards for unexpected input. Think of it as tightening loose bolts: none were causing a breakdown yet, but leaving them loose would eventually cause trouble.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
| `mcp_server/lib/eval/eval-logger.ts` | Lib | Evaluation event logger |
| `mcp_server/lib/eval/reporting-dashboard.ts` | Lib | Reporting dashboard |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |
| `mcp_server/tests/eval-logger.vitest.ts` | Eval logger tests |
| `mcp_server/tests/reporting-dashboard.vitest.ts` | Dashboard reporting tests |

## 5. SOURCE METADATA
- Group: Opus review remediation (Phase 017)
- Source feature title: Evaluation and housekeeping fixes
- Current reality source: feature_catalog.md

## 6. PLAYBOOK COVERAGE
- Mapped to manual testing playbook scenario NEW-082

