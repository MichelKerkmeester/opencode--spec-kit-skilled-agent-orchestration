## F-01: Evaluation database and schema
- **Status:** WARN
- **Code Issues:** 1. Silent close-error swallow in `closeEvalDb()` can hide DB close failures (`mcp_server/lib/eval/eval-db.ts:168-172`).
- **Standards Violations:** 1. Empty `catch {}` without logging (`mcp_server/lib/eval/eval-db.ts:168-172`).
- **Behavior Mismatch:** 1. Current reality mentions hook-level fail-safe logging behavior, but listed implementation file is schema/init only (`.../01-evaluation-database-and-schema.md:5-7`, `mcp_server/lib/eval/eval-db.ts:39-142`).
- **Test Gaps:** 1. Listed tests validate schema/CRUD and singleton behavior, not handler-level logging behavior described in current reality (`mcp_server/tests/eval-db.vitest.ts:47-336`).
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Replace silent catch with non-fatal warning log in `closeEvalDb()`. 2. Update feature catalog source/test mapping to include logger/handler files for hook behavior.

## F-02: Core metric computation
- **Status:** FAIL
- **Code Issues:** 1. `computeF1()` double-counts duplicate memory IDs (no dedupe), unlike `computeRecall()` and `computeMAP()`, which can inflate recall component and F1 for duplicate-heavy ranked lists (`mcp_server/lib/eval/eval-metrics.ts:231-246` vs `193-203`, `276-288`).
- **Standards Violations:** 1. Internal contract drift: file/docs say 11 metrics while implementation exposes 12 in `computeAllMetrics` (`mcp_server/lib/eval/eval-metrics.ts:4-5`, `562-600`).
- **Behavior Mismatch:** 1. Feature narrative says eleven metrics; implementation returns twelve (adds `map`) (`mcp_server/lib/eval/eval-metrics.ts:587-600`, `mcp_server/tests/eval-metrics.vitest.ts:433-451`).
- **Test Gaps:** 1. No dedicated precision/F1 test blocks; file imports `computePrecision`/`computeF1` but coverage is indirect via key-presence/range checks (`mcp_server/tests/eval-metrics.vitest.ts:19-21`, `432-452`).
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Dedupe IDs in `computePrecision`/`computeF1` similarly to Recall/MAP. 2. Align metric-count docs/comments/feature text with implementation. 3. Add duplicate-ID edge-case tests for precision/F1.

## F-03: Observer effect mitigation
- **Status:** FAIL
- **Code Issues:** 1. Listed implementation set does not include any runtime p95 overhead check/alert path; no health-check code found in listed source files (`mcp_server/lib/eval/eval-db.ts`, `mcp_server/lib/eval/shadow-scoring.ts`).
- **Standards Violations:** 1. Additional silent catch in shadow schema ensure path (`mcp_server/lib/eval/shadow-scoring.ts:164-166`).
- **Behavior Mismatch:** 1. Current reality claims a p95 enabled-vs-disabled health check with >10% alerting, but that mechanism is not present in listed implementation files (`.../03-observer-effect-mitigation.md:5`).
- **Test Gaps:** 1. Listed tests (`eval-db`, `scoring`, `shadow-scoring`) do not assert observer overhead behavior; `scoring.vitest.ts` is composite-scoring focused (`mcp_server/tests/scoring.vitest.ts:6-16`). 2. Overhead tests exist in `eval-logger.vitest.ts` but are not listed for this feature (`mcp_server/tests/eval-logger.vitest.ts:355-447`).
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Implement/route runtime overhead monitor in listed source path, or adjust current-reality text. 2. Update feature source/test tables to point at actual observer-mitigation implementation/tests.

## F-04: Full-context ceiling evaluation
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Listed tests only include `eval-metrics.vitest.ts`; no listed direct test for `eval-ceiling.ts` behavior (`.../04-full-context-ceiling-evaluation.md:20`, `mcp_server/lib/eval/eval-ceiling.ts:186-323`). 2. Dedicated coverage exists in `ceiling-quality.vitest.ts` but is missing from feature catalog (`mcp_server/tests/ceiling-quality.vitest.ts:7-12`, `49-120`).
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add `ceiling-quality.vitest.ts` to this feature’s test table. 2. Keep scorer-path coverage explicit in catalog.

## F-05: Quality proxy formula
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Feature lists no tests, although dedicated tests exist (`ceiling-quality.vitest.ts`, `retrieval-telemetry.vitest.ts`), so catalog traceability is incomplete (`.../05-quality-proxy-formula.md:13-19`, `mcp_server/tests/ceiling-quality.vitest.ts:14-18`, `259+`).
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add existing quality-proxy test files to catalog. 2. Add an explicit formula-regression assertion in listed tests.

## F-06: Synthetic ground truth corpus
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** NONE

## F-07: BM25-only baseline
- **Status:** WARN
- **Code Issues:** 1. `computeBootstrapCI()` does not guard `iterations <= 0`; percentile index math can underflow/produce undefined bounds (`mcp_server/lib/eval/bm25-baseline.ts:321-359`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. Feature narrative cites fixed measured value (`MRR@5 = 0.2083`), but implementation is fully dynamic and does not encode/verify that benchmark (`.../07-bm25-only-baseline.md:5`, `mcp_server/lib/eval/bm25-baseline.ts:472-559`).
- **Test Gaps:** 1. Listed tests rely on mocked search functions; no real-corpus assertion for baseline floor outcome (`mcp_server/tests/bm25-baseline.vitest.ts:65-75`, `281-349`).
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Validate `iterations` input in `computeBootstrapCI()`. 2. Add integration benchmark test (or fixture) for expected corpus baseline range.

## F-08: Agent consumption instrumentation
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. Multiple fail-safe silent catches return defaults without logging (`mcp_server/lib/telemetry/consumption-logger.ts:165-167`, `254-256`, `395-397`).
- **Behavior Mismatch:** NONE (logger is intentionally inert via hardcoded false: `mcp_server/lib/telemetry/consumption-logger.ts:82-88`).
- **Test Gaps:** 1. Most mechanics are tested via `forceLogConsumptionEvent()` bypass path, so production guarded path is only lightly validated (`mcp_server/tests/consumption-logger.vitest.ts:8-10`, `23-25`, `40-65`).
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add explicit no-op-path assertions for `logConsumptionEvent()` under normal runtime path. 2. Consider debug-level non-fatal logging in broad catch paths.

## F-09: Scoring observability
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. Best-effort catches suppress failures after logging (acceptable for telemetry, but strict no-swallow policy not fully met) (`mcp_server/lib/telemetry/scoring-observability.ts:91-94`, `147-150`, `203-206`).
- **Behavior Mismatch:** 1. Current reality says failures are swallowed silently, but module emits `console.error` on failure (`.../09-scoring-observability.md:9`, `mcp_server/lib/telemetry/scoring-observability.ts:93`, `149`, `205`). 2. Current reality says novelty boost is hardcoded false/0 in hot path; that is true at callsite (`mcp_server/lib/scoring/composite-scoring.ts:527-529`) but not enforced by observability module API itself (`mcp_server/lib/telemetry/scoring-observability.ts:32-38`).
- **Test Gaps:** 1. Listed tests validate non-throw/fail-safe behavior but do not validate “silent” (no logging) behavior.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Align feature text with actual error-reporting behavior. 2. If silent mode is required, gate console output behind debug flag and test both modes.

## F-10: Full reporting and ablation study framework
- **Status:** WARN
- **Code Issues:** 1. Baseline snapshot query-count uses `report.results[0]?.queryCount`; when all channels fail, baseline row can store `0` despite baseline evaluation occurring (`mcp_server/lib/eval/ablation-framework.ts:537-543`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Listed tests do not explicitly cover the “all channels failed but baseline exists” persistence edge case.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Persist baseline query count from baseline loop state, not first channel result.

## F-11: Shadow scoring and channel attribution
- **Status:** FAIL
- **Code Issues:** NONE
- **Standards Violations:** 1. Silent catch in schema ensure path (`mcp_server/lib/eval/shadow-scoring.ts:164-166`).
- **Behavior Mismatch:** NONE (disabled shadow path behavior matches current reality).
- **Test Gaps:** 1. Listed `channel.vitest.ts` is a placeholder suite with commented-out module import and tautological assertions (`mcp_server/tests/channel.vitest.ts:6-7`, `10-39`). 2. Listed `scoring.vitest.ts` is unrelated to channel attribution (`mcp_server/tests/scoring.vitest.ts:6-16`).
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Replace placeholder channel tests with real assertions against `channel-attribution.ts`. 2. Update feature test mapping to emphasize `shadow-scoring.vitest.ts` channel-attribution sections.

## F-12: Test quality improvements
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. Feature is marked cross-cutting with no source-file inventory, so full claim set is not fully auditable from this catalog entry (`.../12-test-quality-improvements.md:19-22`). 2. Partial checks align with claims (e.g., timeout `15000` and `/z_archive/` exclusion) (`mcp_server/tests/memory-save-extended.vitest.ts:747`, `mcp_server/lib/parsing/memory-parser.ts:677`).
- **Test Gaps:** 1. No listed implementation/test file table for this feature; traceability for all claimed fixes is missing.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add explicit file-by-file mapping for each P2a–P2d and “additional fixes” item. 2. Link each claim to a concrete file/line or commit.

## F-13: Evaluation and housekeeping fixes
- **Status:** WARN
- **Code Issues:** 1. Restart persistence for eval run IDs initializes from `eval_channel_results` only; runs recorded only in `eval_final_results` are ignored during bootstrapping (`mcp_server/lib/eval/eval-logger.ts:54-56`).
- **Standards Violations:** 1. Silent initialization catch in `generateEvalRunId()` (`mcp_server/lib/eval/eval-logger.ts:59`).
- **Behavior Mismatch:** 1. Current reality says lazy-init from `MAX(eval_run_id)` “in the eval DB” broadly; implementation queries only one table (`.../13-evaluation-and-housekeeping-fixes.md:8`, `mcp_server/lib/eval/eval-logger.ts:54-56`). 2. Current reality lists six fixes, but listed source files do not directly cover all six items (e.g., parseArgs guard, dedup hash, exit-handler cleanup are outside this feature’s listed implementation table) (`.../13-evaluation-and-housekeeping-fixes.md:7-13`, `22-24`).
- **Test Gaps:** 1. No listed test asserts restart bootstrap from DB max across persisted rows; current tests check only per-process increment and same-run consistency (`mcp_server/tests/eval-logger.vitest.ts:268-304`). 2. No listed test explicitly covers `SPECKIT_DASHBOARD_LIMIT` env parsing behavior.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Initialize `_evalRunCounter` from max across both final/channel tables (or a unified run table). 2. Add restart regression test seeding DB before process init. 3. Expand source/test table to cover fixes #35–#38 or split into separate features.

## F-14: Cross-AI validation fixes
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. Feature claims 14 cross-AI remediations but provides no source-file mapping, preventing direct verification from this catalog entry (`.../14-cross-ai-validation-fixes.md:5-23`).
- **Test Gaps:** 1. No listed implementation files or tests for this feature, so traceability/auditability is incomplete (`.../14-cross-ai-validation-fixes.md:20-23`).
- **Playbook Coverage:** MISSING (phase-level `NEW-050..072` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add per-CR-item source and test references (file:line). 2. Attach evidence links (commit IDs/test artifacts) for each “verified” claim.
