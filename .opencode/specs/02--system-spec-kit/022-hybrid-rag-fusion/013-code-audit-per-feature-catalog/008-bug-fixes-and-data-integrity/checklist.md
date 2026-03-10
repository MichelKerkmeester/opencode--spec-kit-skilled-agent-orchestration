## F-01: Graph channel ID fix
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** EX-034
- **Recommended Fixes:** NONE

## F-02: Chunk collapse deduplication
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** Current reality describes `includeContent=false` dedup behavior, but the listed implementation files (`.../02-chunk-collapse-deduplication.md:13-16`) do not include the active dedup path in `mcp_server/handlers/memory-search.ts:376-423`.
- **Test Gaps:** Listed tests (`.../02-chunk-collapse-deduplication.md:21-22`) do not assert include-content-independent dedup; that assertion exists in unlisted `mcp_server/tests/handler-memory-search.vitest.ts:115-118`.
- **Playbook Coverage:** NEW-040 (partial)
- **Recommended Fixes:** 1. Add `mcp_server/handlers/memory-search.ts` to the implementation table. 2. Add `mcp_server/tests/handler-memory-search.vitest.ts` to the feature test table.

## F-03: Co-activation fan-effect divisor
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** Catalog scope is incomplete: Stage-2 hot-path boost behavior is in `mcp_server/lib/search/hybrid-search.ts:907-915`, but implementation table lists only `mcp_server/lib/cognitive/co-activation.ts` (`.../03-co-activation-fan-effect-divisor.md:15`).
- **Test Gaps:** Listed test `mcp_server/tests/co-activation.vitest.ts` validates `boostScore()` fan divisor (`:70-100`, `:213-226`) but not Stage-2 hot-path application.
- **Playbook Coverage:** NEW-041 (partial)
- **Recommended Fixes:** 1. Include `mcp_server/lib/search/hybrid-search.ts` in source table. 2. Add/point to tests that assert Stage-2 co-activation boost application.

## F-04: SHA-256 content-hash deduplication
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** Core behavior is implemented (`mcp_server/handlers/save/dedup.ts:50-58`, `mcp_server/handlers/memory-save.ts:178-183`), but test wiring is weak.
- **Test Gaps:** `mcp_server/tests/content-hash-dedup.vitest.ts` uses a local helper query (`:53-68`) instead of invoking production dedup functions (`mcp_server/handlers/save/dedup.ts:43-77`) through the save path.
- **Playbook Coverage:** NEW-042 (partial)
- **Recommended Fixes:** 1. Add integration test that calls save/index path and verifies duplicate short-circuits embedding. 2. Keep SQL-shape tests, but complement with production-path assertions.

## F-05: Database and schema safety
- **Status:** FAIL
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** Current reality explicitly references `reconsolidation.ts`, `checkpoints.ts`, `causal-edges.ts`, and `memory-save.ts` (`.../05-database-and-schema-safety.md:7-13`), but implementation table omits all four (`...:21-32`). Also, B4 claims `memory-save.ts` UPDATE `.changes > 0` guards, yet the save flow shown at `mcp_server/handlers/memory-save.ts:161-183` has no UPDATE path to validate that statement.
- **Test Gaps:** Listed tests (`.../05-database-and-schema-safety.md:38-54`) omit direct suites for these bug classes (e.g., reconsolidation/checkpoints/causal edge focused tests).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Correct implementation table to include the four referenced files. 2. Align B4 narrative with the actual module that enforces `.changes` guards. 3. Link dedicated tests for each B1-B4 bug.

## F-06: Guards and edge cases
- **Status:** FAIL
- **Code Issues:** 1. Catalog pathing is wrong for E2: fix exists in `mcp_server/lib/extraction/extraction-adapter.ts:183-206`, not in listed implementation files.
- **Standards Violations:** 1. `mcp_server/lib/errors/index.ts:4-5` uses barrel re-exports; this conflicts with strict explicit-import guidance in sk-code--opencode for this audit.
- **Behavior Mismatch:** Current reality points to `temporal-contiguity.ts` and `extraction-adapter.ts` (`.../06-guards-and-edge-cases.md:7-9`), but implementation table lists only error modules (`...:17-19`). E1 fix is in `mcp_server/lib/cognitive/temporal-contiguity.ts:69-71`.
- **Test Gaps:** Listed tests (`.../06-guards-and-edge-cases.md:25-36`) do not directly cover temporal contiguity or extraction-adapter fallback behavior.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Replace implementation/test tables with actual E1/E2 modules and tests. 2. Add explicit regressions for temporal pair double-counting and null-on-resolution-failure behavior.

## F-07: Canonical ID dedup hardening
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** Current reality cites `combinedLexicalSearch()` and legacy `hybridSearch()` (`.../07-canonical-id-dedup-hardening.md:5`), but implementation table omits `mcp_server/lib/search/hybrid-search.ts`, where canonical dedup is implemented (`:371-383`, `:507-510`, `:1155-1167`).
- **Test Gaps:** Listed tests (`.../07-canonical-id-dedup-hardening.md:30-42`) omit `mcp_server/tests/hybrid-search.vitest.ts`, which contains `T031-LEX-05` and `T031-BASIC-04` canonical-ID dedup assertions.
- **Playbook Coverage:** NEW-045 (partial)
- **Recommended Fixes:** 1. Add `hybrid-search.ts` to implementation table. 2. Add `hybrid-search.vitest.ts` to test table for direct T031 linkage.

## F-08: Math.max/min stack overflow elimination
- **Status:** FAIL
- **Code Issues:** 1. Unsafe spread max remains in listed implementation file: `shared/scoring/folder-scoring.ts:200` (`Math.max(...folderMemories.map(...))`). 2. Another spread max remains at `shared/scoring/folder-scoring.ts:267` (`Math.max(...timestamps)`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** Current reality says spread-based max/min patterns were eliminated (`.../08-mathmax-min-stack-overflow-elimination.md:5-14`), but listed code still contains spread max calls.
- **Test Gaps:** Listed tests do not include large-array/`RangeError` regression; they do not prove stack-overflow elimination for high-cardinality inputs.
- **Playbook Coverage:** NEW-046 (partial)
- **Recommended Fixes:** 1. Replace remaining spread max calls with reduce/loop-based min-max. 2. Add regression tests with >100k elements for folder scoring paths.

## F-09: Session-manager transaction gap fixes
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** Implementation correctly places `enforceEntryLimit()` inside transactions (`mcp_server/lib/session/session-manager.ts:415-418`, `:445-455`), but listed tests only verify trimming semantics (`mcp_server/tests/session-manager-extended.vitest.ts:613-681`) and do not exercise concurrent race scenarios.
- **Playbook Coverage:** NEW-047 (partial)
- **Recommended Fixes:** 1. Add concurrent write stress test validating cap is never exceeded under parallel inserts.

## F-10: Chunking orchestrator safe swap
- **Status:** WARN
- **Code Issues:** 1. `force` path still deletes existing parent+children before replacement indexing (`mcp_server/handlers/chunking-orchestrator.ts:166-169`). 2. Safe swap is only enabled for non-force updates (`:159-163`, `:216`), leaving a destructive edge path.
- **Standards Violations:** NONE
- **Behavior Mismatch:** Safe swap behavior is implemented for update path (`:298-301`, `:384-400`), but “old children remain intact on failure” is not true for force re-index path.
- **Test Gaps:** Catalog states no dedicated tests (`.../10-chunking-orchestrator-safe-swap.md:19`), and no direct regression exists for staged-swap rollback behavior.
- **Playbook Coverage:** NEW-048 (partial)
- **Recommended Fixes:** 1. Extend safe-swap semantics to force path or explicitly document force as destructive. 2. Add dedicated tests for staged swap success/failure and rollback.

## F-11: Working Memory Session Cleanup Timestamp Fix
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** Current reality text references `working_memory_sessions`; implementation executes on `working_memory` (`mcp_server/lib/cognitive/working-memory.ts:204`).
- **Test Gaps:** Listed test coverage (`mcp_server/tests/cognitive-gaps.vitest.ts:375-399`) does not explicitly recreate the mixed SQLite `CURRENT_TIMESTAMP` (`YYYY-MM-DD HH:MM:SS`) vs JS ISO lexicographic failure mode.
- **Playbook Coverage:** NEW-049 (partial)
- **Recommended Fixes:** 1. Add regression test with space-separated SQLite timestamp strings. 2. Update feature text to match actual table/module naming.
