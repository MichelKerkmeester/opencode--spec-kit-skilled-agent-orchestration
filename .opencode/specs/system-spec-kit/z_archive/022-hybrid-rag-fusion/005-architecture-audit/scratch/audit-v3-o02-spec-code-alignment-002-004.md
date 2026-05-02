# Audit V3 — O2: Spec-to-Code Alignment (Phases 002-004)

**Agent**: O2 (Opus 4.6)
**Scope**: Verify spec claims match actual codebase for phases 002, 003, 004
**Date**: 2026-03-21
**Finding Count**: 8

---

## Phase 002: Indexing Normalization

### O2-001: Test Count Drift — Targeted Suite (52 claimed vs 62 actual)
- **Severity**: LOW
- **Category**: alignment
- **Location**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/tasks.md` (T002, T010)
- **Description**: The spec claims "52 tests" for the targeted suite (`memory-parser.vitest.ts` + `handler-memory-index.vitest.ts` + `importance-tiers.vitest.ts`). Running these files today yields 62 tests (25 + 20 + 17).
- **Evidence**: Spec task T002 says `PASS (52 tests)`. Actual run: `Tests 62 passed (62)`. The 10-test increase is due to tests added by subsequent phases (002 remediation pass added tests, and later phases may have added coverage to these shared files).
- **Impact**: Stale evidence numbers reduce trust in spec accuracy, but the tests all pass so functional correctness is unaffected.
- **Recommended Fix**: Update evidence strings in tasks.md and checklist.md to note that counts represent point-in-time snapshots and may grow as later phases add coverage. Alternatively, re-run and update the numbers.

### O2-002: Test Count Drift — Extended Suite (186 claimed vs 188 actual)
- **Severity**: LOW
- **Category**: alignment
- **Location**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/tasks.md` (T011), `checklist.md` (CHK-023)
- **Description**: The spec claims "186 tests" for the extended suite (`memory-parser-extended.vitest.ts` + `full-spec-doc-indexing.vitest.ts`). Running these files today yields 188 tests (46 + 142).
- **Evidence**: Spec says `PASS (186 tests)`. Actual run: `Tests 188 passed (188)`.
- **Impact**: Same as O2-001 — cosmetic drift, no functional issue.
- **Recommended Fix**: Same as O2-001.

### O2-003: All Claimed Implementation Code Verified Present
- **Severity**: N/A (PASS)
- **Category**: alignment
- **Location**: Multiple files in `.opencode/skill/system-spec-kit/mcp_server/`
- **Description**: All code artifacts claimed by Phase 002 spec exist and contain the expected functionality:
  - `lib/parsing/memory-parser.ts` — contains `getCanonicalPathKey`, `canonicalizeForSpecFolderExtraction`, `seenCanonicalRoots`, `seenCanonicalFiles` dedup logic
  - `handlers/memory-index.ts` — contains canonical dedup with `seenCanonicalFiles` set, `dedupDuplicatesSkipped` counter, diagnostic log output
  - `lib/scoring/importance-tiers.ts` — contains `normalizeTier()`, `DEFAULT_TIER`, valid tier validation
  - `lib/utils/canonical-path.ts` — dedicated canonical path utility module exists
  - `scripts/utils/input-normalizer.ts` — `safeString()` helper (BUG-001), `importanceTier` propagation (BUG-006), ACTION normalization (BUG-003) all present
  - `scripts/utils/spec-affinity.ts` — `containsWordBoundary()` function, stopword filtering present
  - `scripts/core/memory-indexer.ts` — 7 named constants (STD-014) confirmed at lines 51-57
  - `scripts/tests/input-normalizer-unit.vitest.ts` — exists
  - `scripts/tests/memory-indexer-weighting.vitest.ts` — exists
  - `sk-code-opencode/scripts/verify_alignment_drift.py` — `--fail-on-warn` flag confirmed
  - `scripts/dist/memory/backfill-frontmatter.js` — frontmatter migration tool exists
  - `scripts/tests/test-frontmatter-backfill.js`, `test-template-system.js`, `test-template-comprehensive.js` — all exist
- **Evidence**: Glob and Grep verification across all claimed paths.
- **Impact**: N/A — code is aligned with spec claims.
- **Recommended Fix**: None.

---

## Phase 003: Constitutional Learn Refactor

### O2-004: Test Count Claim "583" in Briefing vs "581" in Spec Docs
- **Severity**: LOW
- **Category**: alignment
- **Location**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/003-constitutional-learn-refactor/tasks.md` (T6), `checklist.md`, `implementation-summary.md`
- **Description**: The audit briefing mentioned "583 tests, full rewrite" but the actual spec documents consistently say "581/581". The briefing number appears to be a transcription error in the audit dispatch, not in the spec itself.
- **Evidence**: All three spec documents (tasks.md line 65, checklist.md line 39, implementation-summary.md line 101) consistently state `581/581`. No mention of `583` exists in any spec document.
- **Impact**: Minimal — the spec documents are internally consistent.
- **Recommended Fix**: None for the spec. The audit briefing should use the correct number.

### O2-005: Constitutional Learn Refactor — Full Rewrite Verified Complete
- **Severity**: N/A (PASS)
- **Category**: alignment
- **Location**: `.opencode/command/memory/learn.md`
- **Description**: The learn.md command file is confirmed rewritten as a constitutional memory manager:
  - Frontmatter describes "Create and manage constitutional memories"
  - Old learning types (pattern, mistake, insight, optimization) are absent — only one safe use of "constraint" in a qualification question remains, exactly as the checklist documents
  - Subcommands (list, edit, remove, budget) are present
  - File is 520 lines (spec claimed ~550, close enough)
  - Constitutional directory path `.opencode/skill/system-spec-kit/constitutional/` exists with `gate-enforcement.md` and `README.md`
  - Regression test `memory-learn-command-docs.vitest.ts` exists in `scripts/tests/`
- **Evidence**: Grep for old learning types returns 0 matches except safe "constraint" context. Constitutional directory exists with active files.
- **Impact**: N/A — refactor is complete as claimed.
- **Recommended Fix**: None.

---

## Phase 004: UX Hooks Automation

### O2-006: Test Isolation Failure — Duplicate-Content No-Op Test Fails in Multi-File Run
- **Severity**: HIGH
- **Category**: bug
- **Location**: `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:218`
- **Description**: The test "does not emit postMutationHooks for duplicate-content no-op saves" passes when run in isolation but **fails** when run as part of the 9-file combined suite. The test expects status `'duplicate'` but receives `'reinforced'`, indicating that DB state from other test files affects the content-hash dedup lookup.
- **Evidence**:
  - Isolated run: `Tests 8 passed (8)` — all pass
  - Combined 9-file run: `Tests 1 failed | 563 passed (564)` — this specific test fails with `AssertionError: expected 'reinforced' to be 'duplicate'`
  - The spec (checklist CHK-020, plan Phase 3 step 4) claimed "9 files / 525 tests" all passed. Either the test was not failing at that time or the combined run was not executed as documented.
- **Impact**: This is a real test isolation bug. The duplicate-content detection path behaves differently depending on prior DB state, which means the save handler's duplicate-vs-reinforced classification is order-dependent. The claimed "525 tests PASS" evidence is no longer reproducible.
- **Recommended Fix**: Fix test isolation by ensuring each test in `memory-save-ux-regressions.vitest.ts` starts with a clean DB (use `beforeEach` to reset or use unique in-memory DB per test). Alternatively, investigate whether the `reinforced` status is correct behavior and update the test expectation.

### O2-007: Test Count Drift — Combined Suite (525 claimed vs 564 actual)
- **Severity**: LOW
- **Category**: alignment
- **Location**: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/checklist.md` (CHK-020), `plan.md`, `tasks.md`
- **Description**: The spec claims "9 files / 525 tests" for the combined targeted Vitest rerun. Running the same 9 files today yields 564 tests (563 passing + 1 failing). The test count grew by 39 tests since evidence was captured, likely due to tests added by later phases (Phase 019 architecture remediation, Phase 002 remediation pass).
- **Evidence**: Spec says `525 tests`. Actual run: `564 tests`. The 39-test increase represents natural growth from subsequent work.
- **Impact**: Stale evidence numbers; cosmetic. The real issue is the 1 failing test (see O2-006).
- **Recommended Fix**: Same as O2-001/O2-002 — acknowledge point-in-time snapshots or update counts.

### O2-008: All Claimed UX Hook Implementation Code Verified Present
- **Severity**: N/A (PASS)
- **Category**: alignment
- **Location**: Multiple files in `.opencode/skill/system-spec-kit/mcp_server/`
- **Description**: All code artifacts claimed by Phase 004 spec exist and contain the expected functionality:
  - `hooks/mutation-feedback.ts` — `buildMutationHookFeedback()` function with operation, latency, cache-clear data
  - `hooks/response-hints.ts` — `appendAutoSurfaceHints()`, `syncEnvelopeTokenCount()`, `serializeEnvelopeWithTokenCount()` functions
  - `hooks/index.ts` — barrel exports both hook modules
  - `handlers/memory-crud-types.ts` — `MutationHookResult` interface with `latencyMs`, `triggerCacheCleared`, `constitutionalCacheCleared`, `graphSignalsCacheCleared`, `coactivationCacheCleared`, `toolCacheInvalidated`, `errors` fields
  - `handlers/mutation-hooks.ts` — `runPostMutationHooks()` with try/catch wrappers (5 blocks), `MutationHookResult` re-exported
  - `handlers/checkpoints.ts` — `confirmName` validation (lines 285-294) with exact-match enforcement
  - `handlers/memory-crud-health.ts` — `autoRepair` parameter handling, `sanitizeErrorForHint()` and `redactPath()` functions
  - `context-server.ts` — `appendAutoSurfaceHints()` called on success path (line 335), `runPostMutationHooks` wrapped in try/catch in file-watcher path
  - `postMutationHooks` data present in: `memory-save.ts`, `memory-crud-update.ts`, `memory-crud-delete.ts`, `memory-bulk-delete.ts`, `save/response-builder.ts`, `save/types.ts`
  - All 3 handler files (`memory-crud-update.ts`, `memory-crud-delete.ts`, `memory-bulk-delete.ts`) wrap `runPostMutationHooks` in try/catch with fallback `MutationHookResult` (Phase 4 review fix T025 verified)
  - `toolCache.invalidateOnWrite()` wrapped in try/catch in `mutation-hooks.ts` (Phase 4 review fix T022 verified)
  - All claimed test files exist: `hooks-ux-feedback.vitest.ts`, `context-server.vitest.ts`, `handler-checkpoints.vitest.ts`, `tool-input-schema.vitest.ts`, `mcp-input-validation.vitest.ts`, `memory-crud-extended.vitest.ts`, `memory-save-ux-regressions.vitest.ts`, `embeddings.vitest.ts`, `stdio-logging-safety.vitest.ts`
- **Evidence**: Grep and Read verification across all claimed paths and function signatures.
- **Impact**: N/A — implementation code is aligned with spec claims.
- **Recommended Fix**: None.

---

## Summary

| ID | Severity | Phase | Title |
|----|----------|-------|-------|
| O2-001 | LOW | 002 | Test count drift: targeted suite 52 -> 62 |
| O2-002 | LOW | 002 | Test count drift: extended suite 186 -> 188 |
| O2-003 | PASS | 002 | All implementation code verified present |
| O2-004 | LOW | 003 | Briefing transcription error (583 vs 581) |
| O2-005 | PASS | 003 | Constitutional learn refactor verified complete |
| O2-006 | HIGH | 004 | Test isolation failure: duplicate-content no-op test fails in combined run |
| O2-007 | LOW | 004 | Test count drift: combined suite 525 -> 564 |
| O2-008 | PASS | 004 | All UX hook implementation code verified present |

**Critical/High Findings**: 1 (O2-006)
**Medium Findings**: 0
**Low Findings**: 4 (O2-001, O2-002, O2-004, O2-007)
**Pass (No Issue)**: 3 (O2-003, O2-005, O2-008)

### Key Conclusions

1. **All claimed implementation code exists and is structurally correct** across all three phases. Canonical path dedup, tier normalization, constitutional learn refactor, mutation hooks, response hints, checkpoint safety, and auto-surface hints are all present at the claimed file paths with the claimed functionality.

2. **Test counts are stale** across all three phases. This is expected: later phases added tests to shared test files, incrementing the counts. The numbers in the specs represent accurate point-in-time snapshots. This is a documentation staleness pattern, not a functional issue.

3. **One real test isolation bug exists** (O2-006): the `memory-save-ux-regressions.vitest.ts` duplicate-content no-op test fails when run alongside other test files. The duplicate detection path produces `'reinforced'` instead of `'duplicate'` depending on prior DB state. This is the only finding that represents a genuine code defect rather than documentation drift.

4. **The "1,466 test executions" claim** from the audit briefing for Phase 004 is an aggregate across multiple verification runs (525 + 525 + 416 = 1,466). The spec documents accurately break this down but never claim 1,466 as a single-run count. This is valid accounting.
