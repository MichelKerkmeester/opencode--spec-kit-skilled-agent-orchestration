# Tasks — Phase 008: Bug Fixes and Data Integrity

## Summary

| Priority | Count | Description                                            |
| -------- | ----- | ------------------------------------------------------ |
| **P0**   | 5     | FAIL findings — correctness bugs, behavior mismatches  |
| **P1**   | 8     | WARN findings — behavior mismatch, significant gaps    |
| **P2**   | 1     | WARN findings — test gaps only                         |
| **Total**| 14    |                                                        |

---

## P0 — FAIL (Immediate Fix Required)

### T-01: Correct database safety implementation table and B4 claim
- **Priority:** P0
- **Feature:** F-05 Database and schema safety
- **Status:** TODO
- **Source:** `feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md:7-13,21-32,38-54`
- **Issue:** Current reality references `reconsolidation.ts`, `checkpoints.ts`, `causal-edges.ts`, and `memory-save.ts` but implementation table omits all four. B4 claims `memory-save.ts` UPDATE `.changes > 0` guards, yet the save flow at `handlers/memory-save.ts:161-183` has no UPDATE path.
- **Fix:** Correct implementation table to include the four referenced files; align B4 narrative with the actual module that enforces `.changes` guards; link dedicated tests for each B1-B4 bug.

### T-02: Fix guards and edge cases catalog pathing
- **Priority:** P0
- **Feature:** F-06 Guards and edge cases
- **Status:** TODO
- **Source:** `feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md:7-9,17-19,25-36`
- **Issue:** Catalog pathing is wrong for E2 (fix is in `lib/extraction/extraction-adapter.ts:183-206`, not listed files); implementation table lists only error modules instead of actual E1/E2 modules (`lib/cognitive/temporal-contiguity.ts:69-71` and `extraction-adapter.ts`).
- **Fix:** Replace implementation/test tables with actual E1/E2 modules and tests; add explicit regressions for temporal pair double-counting and null-on-resolution-failure behavior.

### T-03: Replace wildcard barrel exports in error modules
- **Priority:** P0
- **Feature:** F-06 Guards and edge cases
- **Status:** TODO
- **Source:** `lib/errors/index.ts:4-5`
- **Issue:** Barrel re-exports conflict with strict explicit-import guidance in the audit standards.
- **Fix:** Replace wildcard re-exports with explicit named exports in error modules.

### T-04: Replace remaining spread-based Math.max calls
- **Priority:** P0
- **Feature:** F-08 Math.max/min stack overflow elimination
- **Status:** TODO
- **Source:** `shared/scoring/folder-scoring.ts:200,267`
- **Issue:** Unsafe `Math.max(...folderMemories.map(...))` and `Math.max(...timestamps)` remain despite feature claiming all spread-based max/min patterns were eliminated. High-cardinality arrays will throw `RangeError`.
- **Fix:** Replace remaining spread max calls with reduce/loop-based min-max.

### T-05: Add large-array RangeError regression tests
- **Priority:** P0
- **Feature:** F-08 Math.max/min stack overflow elimination
- **Status:** TODO
- **Source:** `shared/scoring/folder-scoring.ts:200,267`
- **Issue:** Listed tests do not include large-array/`RangeError` regression; they do not prove stack-overflow elimination for high-cardinality inputs.
- **Fix:** Add regression tests with >100k elements for folder scoring paths to prove no `RangeError` is thrown.

---

## P1 — WARN (Behavior Mismatch / Significant Code Issues)

### T-06: Add active chunk dedup path to implementation table
- **Priority:** P1
- **Feature:** F-02 Chunk collapse deduplication
- **Status:** TODO
- **Source:** `feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md:13-16`
- **Issue:** Current reality describes `includeContent=false` dedup behavior, but implementation table omits the active dedup path in `handlers/memory-search.ts:376-423`.
- **Fix:** Add `handlers/memory-search.ts` to the implementation table; add `tests/handler-memory-search.vitest.ts` to the feature test table.

### T-07: Add include-content-independent dedup regression
- **Priority:** P1
- **Feature:** F-02 Chunk collapse deduplication
- **Status:** TODO
- **Source:** `tests/handler-memory-search.vitest.ts:115-118`, `feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md:21-22`
- **Issue:** Listed tests do not assert include-content-independent dedup; assertion exists in unlisted test file.
- **Fix:** Expand the handler test into an explicit include-content-independent dedup regression and list it in the feature test table.

### T-08: Add Stage-2 co-activation boost to implementation table
- **Priority:** P1
- **Feature:** F-03 Co-activation fan-effect divisor
- **Status:** TODO
- **Source:** `lib/search/hybrid-search.ts:907-915`, `feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md:15`
- **Issue:** Stage-2 hot-path boost behavior is in `hybrid-search.ts` but implementation table lists only `lib/cognitive/co-activation.ts`.
- **Fix:** Include `hybrid-search.ts` in source table; add/point to tests that assert Stage-2 co-activation boost application.

### T-09: Add production-path content-hash dedup integration test
- **Priority:** P1
- **Feature:** F-04 SHA-256 content-hash deduplication
- **Status:** TODO
- **Source:** `tests/content-hash-dedup.vitest.ts:53-68`, `handlers/save/dedup.ts:43-77`
- **Issue:** Content-hash dedup test uses a local helper query instead of invoking production dedup functions through the save path.
- **Fix:** Add integration test that calls save/index path and verifies duplicate short-circuits embedding; keep SQL-shape tests but complement with production-path assertions.

### T-10: Add canonical ID dedup sources to implementation table
- **Priority:** P1
- **Feature:** F-07 Canonical ID dedup hardening
- **Status:** TODO
- **Source:** `lib/search/hybrid-search.ts:371-383,507-510,1155-1167`, `feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md:30-42`
- **Issue:** Implementation table omits `hybrid-search.ts` where canonical dedup is implemented; test table omits `tests/hybrid-search.vitest.ts` which contains T031 canonical-ID dedup assertions.
- **Fix:** Add `hybrid-search.ts` to implementation table; add `hybrid-search.vitest.ts` to test table for direct T031 linkage.

### T-11: Extend safe-swap semantics to force path or document as destructive
- **Priority:** P1
- **Feature:** F-10 Chunking orchestrator safe swap
- **Status:** TODO
- **Source:** `handlers/chunking-orchestrator.ts:159-169,216,298-301,384-400`
- **Issue:** `force` path deletes existing parent+children before replacement indexing; safe swap is only enabled for non-force updates, leaving a destructive edge path. "Old children remain intact on failure" is not true for force re-index.
- **Fix:** Extend safe-swap semantics to force path or explicitly document force as destructive; add dedicated tests for staged swap success/failure and rollback.

### T-12: Add staged-swap rollback regression tests
- **Priority:** P1
- **Feature:** F-10 Chunking orchestrator safe swap
- **Status:** TODO
- **Source:** `feature_catalog/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md:19`
- **Issue:** No dedicated tests exist for staged-swap rollback behavior in either force or update paths.
- **Fix:** Add dedicated tests for staged swap success, failure, and rollback scenarios.

### T-13: Fix working-memory table name in feature text and add timestamp regression
- **Priority:** P1
- **Feature:** F-11 Working Memory Session Cleanup Timestamp Fix
- **Status:** TODO
- **Source:** `lib/cognitive/working-memory.ts:204`, `tests/cognitive-gaps.vitest.ts:375-399`
- **Issue:** Current reality text references `working_memory_sessions` but implementation executes on `working_memory` table; listed test coverage does not explicitly recreate the mixed SQLite `CURRENT_TIMESTAMP` vs JS ISO lexicographic failure mode.
- **Fix:** Update feature text to match actual table/module naming; add regression test with space-separated SQLite timestamp strings.

---

## P2 — WARN (Test Gaps Only)

### T-14: Add concurrent write stress test for session-manager entry limit
- **Priority:** P2
- **Feature:** F-09 Session-manager transaction gap fixes
- **Status:** TODO
- **Source:** `lib/session/session-manager.ts:415-418,445-455`, `tests/session-manager-extended.vitest.ts:613-681`
- **Issue:** Implementation correctly places `enforceEntryLimit()` inside transactions, but listed tests only verify trimming semantics and do not exercise concurrent race scenarios.
- **Fix:** Add concurrent write stress test validating cap is never exceeded under parallel inserts.
