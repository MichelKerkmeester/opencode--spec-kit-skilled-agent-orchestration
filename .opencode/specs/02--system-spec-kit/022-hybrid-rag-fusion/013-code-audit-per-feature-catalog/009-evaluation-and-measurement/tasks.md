# Tasks — 009 Evaluation and Measurement

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0       | 3     | FAIL-status correctness bugs and behavior mismatches |
| P1       | 7     | WARN-status behavior mismatches and significant code issues |
| P2       | 4     | WARN-status documentation/test gaps only |
| **Total**| **14**|  |

---

## P0 — FAIL (Immediate Fix Required)

### T-01: Deduplicate memory IDs in computeF1 precision path
- **Priority:** P0
- **Feature:** F-02 Core metric computation
- **Status:** TODO
- **Source:** `mcp_server/lib/eval/eval-metrics.ts:231-246`
- **Issue:** `computeF1()` double-counts duplicate memory IDs (no dedupe), unlike `computeRecall()` and `computeMAP()`, inflating the recall component and F1 for duplicate-heavy ranked lists. Additionally, docs say 11 metrics while `computeAllMetrics` exposes 12 (adds `map`), creating internal contract drift.
- **Fix:** Apply the same ID deduplication logic used in `computeRecall`/`computeMAP` to the precision/F1 path. Align metric-count docs/comments/feature text with the 12-metric implementation. Add duplicate-ID edge-case tests for precision/F1.

### T-02: Implement or correct p95 observer overhead health check
- **Priority:** P0
- **Feature:** F-03 Observer effect mitigation
- **Status:** TODO
- **Source:** `.../03-observer-effect-mitigation.md:5`, `mcp_server/lib/eval/shadow-scoring.ts:164-166`
- **Issue:** Current reality claims a p95 enabled-vs-disabled health check with >10% alerting, but no such mechanism exists in the listed implementation files. Silent catch in shadow schema ensure path also suppresses failures.
- **Fix:** Either implement the runtime overhead monitor in the listed source path, or correct the current-reality text to match actual behavior. Replace silent catch with non-fatal warning log. Update feature source/test tables to point at actual observer-mitigation code (e.g., `eval-logger.vitest.ts:355-447`).

### T-03: Replace placeholder channel attribution tests with real assertions
- **Priority:** P0
- **Feature:** F-11 Shadow scoring and channel attribution
- **Status:** TODO
- **Source:** `mcp_server/tests/channel.vitest.ts:6-7, 10-39`, `mcp_server/tests/scoring.vitest.ts:6-16`, `mcp_server/lib/eval/shadow-scoring.ts:164-166`
- **Issue:** `channel.vitest.ts` is a placeholder suite with commented-out module import and tautological assertions. `scoring.vitest.ts` is unrelated to channel attribution. Silent catch in schema ensure path also present.
- **Fix:** Replace placeholder tests with real assertions against `channel-attribution.ts`. Update feature test mapping to emphasize `shadow-scoring.vitest.ts` channel-attribution sections. Replace silent catch with non-fatal warning log.

---

## P1 — WARN with Behavior Mismatch or Significant Code Issues

### T-04: Replace silent catch in closeEvalDb and align feature mapping
- **Priority:** P1
- **Feature:** F-01 Evaluation database and schema
- **Status:** TODO
- **Source:** `mcp_server/lib/eval/eval-db.ts:168-172`
- **Issue:** Empty `catch {}` in `closeEvalDb()` swallows DB close failures without logging. Current reality mentions hook-level fail-safe logging behavior, but the listed implementation file is schema/init only. Tests validate schema/CRUD, not the handler-level logging behavior described in current reality.
- **Fix:** Replace silent catch with non-fatal warning log. Update feature catalog source/test mapping to include logger/handler files for hook behavior.

### T-05: Guard iterations input in computeBootstrapCI
- **Priority:** P1
- **Feature:** F-07 BM25-only baseline
- **Status:** TODO
- **Source:** `mcp_server/lib/eval/bm25-baseline.ts:321-359`
- **Issue:** `computeBootstrapCI()` does not guard `iterations <= 0`; percentile index math can underflow or produce undefined bounds. Feature narrative cites a fixed measured value (`MRR@5 = 0.2083`), but implementation is fully dynamic.
- **Fix:** Validate `iterations` input with a minimum threshold. Add an integration benchmark test or fixture for expected corpus baseline range.

### T-06: Add logging to consumption logger silent catches
- **Priority:** P1
- **Feature:** F-08 Agent consumption instrumentation
- **Status:** TODO
- **Source:** `mcp_server/lib/telemetry/consumption-logger.ts:165-167, 254-256, 395-397`
- **Issue:** Multiple fail-safe silent catches return defaults without logging. Most mechanics are tested via `forceLogConsumptionEvent()` bypass path, so production guarded path is only lightly validated.
- **Fix:** Add debug-level non-fatal logging in broad catch paths. Add explicit no-op-path assertions for `logConsumptionEvent()` under normal runtime path.

### T-07: Align scoring observability error behavior with docs
- **Priority:** P1
- **Feature:** F-09 Scoring observability
- **Status:** TODO
- **Source:** `.../09-scoring-observability.md:9`, `mcp_server/lib/telemetry/scoring-observability.ts:93, 149, 205`
- **Issue:** Current reality says failures are swallowed silently, but module emits `console.error` on failure. Additionally, novelty boost is hardcoded false at callsite but not enforced by observability module API itself.
- **Fix:** Align feature text with actual error-reporting behavior. If silent mode is required, gate console output behind debug flag and test both modes.

### T-08: Fix ablation baseline query-count edge case
- **Priority:** P1
- **Feature:** F-10 Full reporting and ablation study framework
- **Status:** TODO
- **Source:** `mcp_server/lib/eval/ablation-framework.ts:537-543`
- **Issue:** Baseline snapshot query-count uses `report.results[0]?.queryCount`; when all channels fail, baseline row can store `0` despite baseline evaluation occurring.
- **Fix:** Persist baseline query count from baseline loop state, not from the first channel result. Add regression test for the "all channels failed but baseline exists" persistence edge case.

### T-09: Fix eval run ID bootstrap to query all tables
- **Priority:** P1
- **Feature:** F-13 Evaluation and housekeeping fixes
- **Status:** TODO
- **Source:** `mcp_server/lib/eval/eval-logger.ts:54-56, 59`
- **Issue:** Restart persistence for eval run IDs initializes from `eval_channel_results` only; runs in `eval_final_results` are ignored. Silent initialization catch hides failures. Current reality lists six fixes, but listed source files do not cover all six. No listed test covers `SPECKIT_DASHBOARD_LIMIT` env parsing.
- **Fix:** Initialize `_evalRunCounter` from max across both final/channel tables. Add restart regression test seeding DB before process init. Expand source/test table to cover all fixes.

### T-10: Add per-CR-item source references for cross-AI validation
- **Priority:** P1
- **Feature:** F-14 Cross-AI validation fixes
- **Status:** TODO
- **Source:** `.../14-cross-ai-validation-fixes.md:5-23`
- **Issue:** Feature claims 14 cross-AI remediations but provides no source-file mapping, preventing direct verification from this catalog entry.
- **Fix:** Add per-CR-item source and test references (file:line). Attach evidence links (commit IDs/test artifacts) for each "verified" claim.

---

## P2 — WARN with Documentation/Test Gaps Only

### T-11: Add ceiling-quality test to feature catalog
- **Priority:** P2
- **Feature:** F-04 Full-context ceiling evaluation
- **Status:** TODO
- **Source:** `mcp_server/tests/ceiling-quality.vitest.ts:7-12, 49-120`
- **Issue:** Listed tests only include `eval-metrics.vitest.ts`; dedicated `ceiling-quality.vitest.ts` coverage exists but is missing from feature catalog.
- **Fix:** Add `ceiling-quality.vitest.ts` to this feature's test table. Keep scorer-path coverage explicit in catalog.

### T-12: Add quality-proxy test files to feature catalog
- **Priority:** P2
- **Feature:** F-05 Quality proxy formula
- **Status:** TODO
- **Source:** `mcp_server/tests/ceiling-quality.vitest.ts:14-18, 259+`, `mcp_server/tests/retrieval-telemetry.vitest.ts`
- **Issue:** Feature lists no tests, although dedicated tests exist, so catalog traceability is incomplete.
- **Fix:** Add existing quality-proxy test files to catalog. Add an explicit formula-regression assertion in listed tests.

### T-13: Add file-by-file mapping for test quality improvements
- **Priority:** P2
- **Feature:** F-12 Test quality improvements
- **Status:** TODO
- **Source:** `.../12-test-quality-improvements.md:19-22`
- **Issue:** Feature is cross-cutting with no source-file inventory; full claim set is not fully auditable from this catalog entry. Partial checks align (e.g., timeout `15000` and `/z_archive/` exclusion), but no listed implementation/test file table exists.
- **Fix:** Add explicit file-by-file mapping for each P2a-P2d and "additional fixes" item. Link each claim to a concrete file/line or commit.

### T-14: Add observer overhead tests to feature catalog
- **Priority:** P2
- **Feature:** F-03 Observer effect mitigation
- **Status:** TODO
- **Source:** `mcp_server/tests/eval-logger.vitest.ts:355-447`
- **Issue:** Overhead tests exist in `eval-logger.vitest.ts` but are not listed for this feature. Listed tests (`eval-db`, `scoring`, `shadow-scoring`) do not assert observer overhead behavior.
- **Fix:** Update feature source/test tables to include `eval-logger.vitest.ts` overhead tests.
