# Tasks — 016 Tooling and Scripts

## Summary

| Priority | Count |
|----------|-------|
| P0       | 5     |
| P1       | 5     |
| P2       | 2     |
| **Total** | **12** |

---

## P0 — FAIL (Immediate Fix)

### T-01: Repoint tree thinning feature mapping to actual consolidation code
- **Priority:** P0
- **Feature:** F-01 Tree thinning for spec folder consolidation
- **Status:** TODO
- **Source:** `feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md:5-7`; `mcp_server/lib/chunking/anchor-chunker.ts:4-7`; `mcp_server/lib/chunking/chunk-thinning.ts:4-7,41,113-153`
- **Issue:** Listed implementation files are chunk-indexing utilities, not spec-folder tree consolidation. Documented token-threshold merge flow (`<200`, `<500`, `applyTreeThinning`) is not present in the listed implementation.
- **Fix:** Repoint implementation table to actual tree-thinning workflow code that performs bottom-up tree consolidation in workflow context loading.

### T-02: Add tree thinning token-threshold merge tests
- **Priority:** P0
- **Feature:** F-01 Tree thinning for spec folder consolidation
- **Status:** TODO
- **Source:** `mcp_server/lib/chunking/chunk-thinning.ts:41,113-153`
- **Issue:** `chunk-thinning.vitest.ts` validates chunk scoring/thinning, not tree-consolidation token thresholds or merge stats described in Current Reality.
- **Fix:** Add tests for token-threshold merge/content-as-summary rules and saved-token counters.

### T-03: Fix architecture boundary checker path and harden import parsing
- **Priority:** P0
- **Feature:** F-02 Architecture boundary enforcement
- **Status:** TODO
- **Source:** `feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md:17`; `scripts/evals/check-architecture-boundaries.ts:72-83,127-154,181-186`
- **Issue:** Listed implementation path `mcp_server/lib/architecture/check-architecture-boundaries.ts` does not exist. Actual checker at `scripts/evals/` uses line-based import parsing that misses multiline declarations and wrapper checks that allow comment/string false positives.
- **Fix:** Update source table to actual checker path. Harden import parsing for multiline declarations and wrapper-rule bypass cases.

### T-04: Add boundary violation tests for architecture checker
- **Priority:** P0
- **Feature:** F-02 Architecture boundary enforcement
- **Status:** TODO
- **Source:** `mcp_server/tests/layer-definitions.vitest.ts`
- **Issue:** Listed test validates layer metadata only and does not execute GAP A/GAP B boundary checks.
- **Fix:** Add dedicated tests for boundary violations, multiline imports, and wrapper-rule bypass cases.

### T-05: Correct progressive validation script path and populate test table
- **Priority:** P0
- **Feature:** F-03 Progressive validation for spec documents
- **Status:** TODO
- **Source:** `feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md:17`; `scripts/spec/progressive-validate.sh:6-21,88-93,249-740`
- **Issue:** Listed implementation path `scripts/progressive-validate.sh` does not exist. Actual script is at `scripts/spec/progressive-validate.sh`. Feature test table is empty despite a dedicated test suite existing at `mcp_server/tests/progressive-validation.vitest.ts`.
- **Fix:** Correct script path in source table. Add existing progressive-validation test suite to the feature test table and map scenarios.

### T-06: Export getWatcherMetrics and add metrics tests
- **Priority:** P0
- **Feature:** F-06 Real-time filesystem watching with chokidar
- **Status:** TODO
- **Source:** `mcp_server/lib/ops/file-watcher.ts:32-41,350-355`; `feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md:5`
- **Issue:** `getWatcherMetrics()` is defined but not exported (module exports only `startFileWatcher` and `__testables`), contradicting Current Reality. Metrics counters are process-global with no reset API for per-watcher isolation.
- **Fix:** Export `getWatcherMetrics` (and optionally a reset helper). Add tests for metric increments/averaging and emitted timing logs.

---

## P1 — WARN with Behavior Mismatch or Significant Code Issues

### T-07: Add auditable evidence for dead code removal claims
- **Priority:** P1
- **Feature:** F-04 Dead code removal
- **Status:** TODO
- **Source:** `feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md:19`; `mcp_server/lib/search/fsrs.ts:39,62`
- **Issue:** Feature provides no concrete implementation files, so removal claims are not fully auditable. Spot-check confirms preserved functions still exist, but full claimed removal set cannot be validated feature-locally.
- **Fix:** Add concrete source-file references (or commit refs) for each removed code category. Attach regression tests for removed-path non-regression.

### T-08: Add file-level evidence for code standards alignment claims
- **Priority:** P1
- **Feature:** F-05 Code standards alignment
- **Status:** TODO
- **Source:** `feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md:11`
- **Issue:** Feature lists no implementation files, so the claimed 45 standards fixes cannot be verified per-file. Standards-remediation claims are not tied to concrete file evidence.
- **Fix:** Add representative changed files and rule-by-rule evidence for the claimed fixes. Link lint/check outputs used to validate alignment.

### T-09: Decide and document checkpoint-before-delete safety contract
- **Priority:** P1
- **Feature:** F-07 Standalone admin CLI
- **Status:** TODO
- **Source:** `mcp_server/cli.ts:271-288`; `feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md:5`
- **Issue:** Bulk-delete proceeds when checkpoint creation fails, weakening the "checkpoint before bulk-delete" safety expectation in Current Reality. Checkpoint-before-delete is best-effort, not strict.
- **Fix:** Decide and document whether checkpoint creation failure should block deletion. Align feature doc with chosen behavior.

### T-10: Add CLI integration tests for admin commands
- **Priority:** P1
- **Feature:** F-07 Standalone admin CLI
- **Status:** TODO
- **Source:** `mcp_server/cli.ts`
- **Issue:** Listed tests (`checkpoints-storage.vitest.ts`, `checkpoints-extended.vitest.ts`, `mutation-ledger.vitest.ts`) validate storage primitives but not CLI command parsing/dispatch or `schema-downgrade` command behavior.
- **Fix:** Add CLI integration tests for `stats`, `bulk-delete`, `reindex`, and `schema-downgrade`.

### T-11: Add rename integration and debounce stress tests for file watcher
- **Priority:** P1
- **Feature:** F-08 Watcher delete/rename cleanup
- **Status:** TODO
- **Source:** `mcp_server/lib/ops/file-watcher.ts:295-323`; `mcp_server/tests/file-watcher.vitest.ts:187-207`
- **Issue:** Delete cleanup path is implemented, but rename handling is implicit via event sequence with no explicit rename-path assertion in tests. No test asserts debounce-collapse behavior for rename bursts.
- **Fix:** Add rename integration tests validating old-path removal and new-path reindex. Add rapid-rename debounce stress test.

---

## P2 — WARN with Documentation/Test Gaps Only

### T-12: Add regression tests for dead code removal
- **Priority:** P2
- **Feature:** F-04 Dead code removal
- **Status:** TODO
- **Source:** `feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md:19`
- **Issue:** No test files are listed for regression validation of removed branches/functions.
- **Fix:** Add regression tests confirming removed code paths remain absent and do not regress.

### T-13: Link lint/check outputs for standards alignment verification
- **Priority:** P2
- **Feature:** F-05 Code standards alignment
- **Status:** TODO
- **Source:** `feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md:11`
- **Issue:** No tests listed for standards-alignment verification outcomes. Audit traceability gap exists.
- **Fix:** Link lint or check outputs used to validate alignment so outcomes remain verifiable over time.
