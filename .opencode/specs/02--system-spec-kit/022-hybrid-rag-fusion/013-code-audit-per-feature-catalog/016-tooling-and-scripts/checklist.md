## F-01: Tree thinning for spec folder consolidation
- **Status:** FAIL
- **Code Issues:** 1) Listed implementation files are chunk-indexing utilities, not spec-folder tree consolidation (`mcp_server/lib/chunking/anchor-chunker.ts:4-7`, `mcp_server/lib/chunking/chunk-thinning.ts:4-7`). 2) Documented token-threshold merge flow (`<200`, `<500`, `applyTreeThinning`) from Current Reality (`16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md:5-7`) is not present in the listed implementation.
- **Standards Violations:** NONE
- **Behavior Mismatch:** Feature describes bottom-up tree consolidation in workflow context loading, but listed code performs pre-index chunk scoring/filtering with score threshold (`chunk-thinning.ts:41`, `chunk-thinning.ts:113-153`).
- **Test Gaps:** `chunk-thinning.vitest.ts` validates chunk scoring/thinning, not tree-consolidation token thresholds or merge stats.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Repoint implementation table to actual tree-thinning workflow code. 2) Add tests for token-threshold merge/content-as-summary rules and saved-token counters.

## F-02: Architecture boundary enforcement
- **Status:** FAIL
- **Code Issues:** 1) Listed implementation path is missing: `mcp_server/lib/architecture/check-architecture-boundaries.ts` does not exist. 2) Actual checker (`scripts/evals/check-architecture-boundaries.ts`) uses line-based import parsing (`72-83`, `127-154`) and can miss multiline import declarations. 3) Wrapper checks rely on substring presence (`181-186`), allowing comment/string false positives.
- **Standards Violations:** 1) Feature source mapping is stale (documented file path does not map to executable implementation).
- **Behavior Mismatch:** Enforcement logic exists at `scripts/evals/check-architecture-boundaries.ts`, not at the documented mcp_server path (`02-architecture-boundary-enforcement.md:17`).
- **Test Gaps:** Listed test (`mcp_server/tests/layer-definitions.vitest.ts`) validates layer metadata only and does not execute GAP A/GAP B boundary checks.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Update source table to actual checker path. 2) Add dedicated tests for boundary violations, multiline imports, and wrapper-rule bypass cases.

## F-03: Progressive validation for spec documents
- **Status:** FAIL
- **Code Issues:** 1) Listed implementation path is missing: `scripts/progressive-validate.sh` does not exist. Actual script is `scripts/spec/progressive-validate.sh` (implements levels/flags at lines 6-21, 88-93, 249-740). 2) Feature test table is empty even though a dedicated test suite exists (`mcp_server/tests/progressive-validation.vitest.ts`).
- **Standards Violations:** 1) Source/test traceability is incomplete in the feature catalog.
- **Behavior Mismatch:** Current Reality points to a script path that is not the implemented location (`03-progressive-validation-for-spec-documents.md:17`).
- **Test Gaps:** No tests are listed in the feature table, so documented coverage is missing.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Correct script path in source table. 2) Add existing progressive-validation test suite to the feature test table and map scenarios.

## F-04: Dead code removal
- **Status:** WARN
- **Code Issues:** 1) Feature provides no concrete implementation files (`04-dead-code-removal.md:19`), so removal claims are not fully auditable from this artifact. 2) Spot-check confirms preserved functions still exist (`mcp_server/lib/search/fsrs.ts:39`, `mcp_server/lib/search/fsrs.ts:62`), but full claimed removal set cannot be validated feature-locally.
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** No test files are listed for regression validation of removed branches/functions.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Add concrete source-file references (or commit refs) for each removed code category. 2) Attach regression tests for removed-path non-regression.

## F-05: Code standards alignment
- **Status:** WARN
- **Code Issues:** 1) Feature lists no implementation files (`05-code-standards-alignment.md:11`), so the claimed 45 standards fixes cannot be verified per-file.
- **Standards Violations:** 1) Audit traceability gap: standards-remediation claims are not tied to concrete file evidence.
- **Behavior Mismatch:** NONE
- **Test Gaps:** No tests listed for standards-alignment verification outcomes.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Add representative changed files and rule-by-rule evidence for the claimed fixes. 2) Link lint/check outputs used to validate alignment.

## F-06: Real-time filesystem watching with chokidar
- **Status:** FAIL
- **Code Issues:** 1) `getWatcherMetrics()` is defined (`mcp_server/lib/ops/file-watcher.ts:36-41`) but not exported (module exports only `startFileWatcher` and `__testables` at `350-355`), contradicting Current Reality (`06-real-time-filesystem-watching-with-chokidar.md:5`). 2) Metrics counters are process-global (`32-34`) with no reset API for per-watcher isolation.
- **Standards Violations:** NONE
- **Behavior Mismatch:** Claimed exported metrics API is not available to consumers.
- **Test Gaps:** `mcp_server/tests/file-watcher.vitest.ts` does not assert metrics API availability or metrics values.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Export `getWatcherMetrics` (and optionally a reset helper). 2) Add tests for metric increments/averaging and emitted timing logs.

## F-07: Standalone admin CLI
- **Status:** WARN
- **Code Issues:** 1) Bulk-delete proceeds when checkpoint creation fails (`mcp_server/cli.ts:271-288`), which weakens the "checkpoint before bulk-delete" safety expectation in Current Reality (`07-standalone-admin-cli.md:5`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** Checkpoint-before-delete is implemented as best-effort, not strict hard requirement.
- **Test Gaps:** Listed tests (`checkpoints-storage.vitest.ts`, `checkpoints-extended.vitest.ts`, `mutation-ledger.vitest.ts`) validate storage primitives but not CLI command parsing/dispatch (`mcp_server/cli.ts`) or `schema-downgrade` command behavior.
- **Playbook Coverage:** NEW-113 (partial)
- **Recommended Fixes:** 1) Decide and document whether checkpoint creation failure should block deletion. 2) Add CLI integration tests for `stats`, `bulk-delete`, `reindex`, and `schema-downgrade`.

## F-08: Watcher delete/rename cleanup
- **Status:** WARN
- **Code Issues:** 1) Delete cleanup path is implemented (`mcp_server/lib/ops/file-watcher.ts:295-323`), but rename handling is implicit via event sequence; there is no explicit rename-path assertion in tests.
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1) `file-watcher.vitest.ts` validates delete cleanup (`187-207`) but not explicit rename (`unlink` + `add`) correctness. 2) No test asserts debounce-collapse behavior specifically for rename bursts.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Add rename integration tests validating old-path removal and new-path reindex. 2) Add rapid-rename debounce stress test.
