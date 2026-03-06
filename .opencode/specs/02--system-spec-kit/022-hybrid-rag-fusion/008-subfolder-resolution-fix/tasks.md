---
title: "Tasks: Subfolder Resolution Fix"
description: "Task Format: T### [P?] Description (file path)"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Subfolder Resolution Fix
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Code Fixes

- [x] T001 [P] Add `CATEGORY_FOLDER_PATTERN` + `isTraversableFolder` to `subfolder-utils.ts`
- [x] T002 [P] Rewrite `findChildFolderSync` with recursive search + aliased root dedup
- [x] T003 [P] Rewrite `findChildFolderAsync` with recursive search + aliased root dedup
- [x] T004 [P] Fix `parseArguments` multi-segment detection in `generate-context.ts`
- [x] T005 [P] Add filesystem fallback in `isValidSpecFolder` in `generate-context.ts`
- [x] T006 Export `CATEGORY_FOLDER_PATTERN` from `core/index.ts`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Test Fixes

- [x] T007 Move `02--system-spec-kit` from valid to invalid in `SPEC_FOLDER_PATTERN` + `BASIC_PATTERN` tests
- [x] T008 Update aliased-root test expectations (dedup now resolves instead of returning null)
- [x] T009 Rewrite ambiguity tests to use truly different parents in same specs root
- [x] T010 Add `CATEGORY_FOLDER_PATTERN` valid/invalid tests + deep nesting test
- [x] T011 Add `CATEGORY_FOLDER_PATTERN` to core/index re-exports test
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Build & Verify

- [x] T012 TypeScript compiles cleanly (0 errors)
- [x] T013 `test-subfolder-resolution.js`: 26/26 passed, 0 failed
- [x] T014 End-to-end: bare name and relative path both resolve
- [x] T015 `test-folder-detector-functional.js`: no new failures
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Post-Review Remediation (10-Agent Cross-AI Review)

- [x] T016 [P] `subfolder-utils.ts`: Replace `readdirSync` + `statSync` with `readdirSync({ withFileTypes: true })` (M5+m13)
- [x] T017 [P] `subfolder-utils.ts`: Upfront root dedup via `realpathSync` into `Map` before traversal (M6)
- [x] T018 [P] `subfolder-utils.ts`: Collect warnings from catch blocks; log depth-limit warning at MAX_DEPTH (M7+M8)
- [x] T019 [P] `subfolder-utils.ts`: Skip symlinks via `dirent.isSymbolicLink()`; add visited-set for cycle prevention (m4+m5)
- [x] T020 `subfolder-utils.ts`: Extract `SEARCH_MAX_DEPTH = 4` as module-level exported constant (m14)
- [x] T021 `subfolder-utils.ts`: Add `FindChildOptions` with `onAmbiguity` callback (m12)
- [x] T022 `generate-context.ts`: Fix `isUnderApprovedSpecsRoot` — `path.resolve()` + `.startsWith()` containment (M4+m6)
- [x] T023 `generate-context.ts`: Deep-match fallback searches inside category folders (m11)
- [x] T024 `folder-detector.ts`: Fix `=== 2` → `>= 2` at lines 812, 898 (m1)
- [x] T025 `core/index.ts`: Export `SEARCH_MAX_DEPTH` and `FindChildOptions`
- [x] T026 Tests: Add T-SF08a/b/c (SEARCH_MAX_DEPTH boundary), T-SF09a (multi-segment), T-SF10a (onAmbiguity callback)
- [x] T027 Tests: Tighten T-SF07a — remove permissive null acceptance for aliased roots (M3)
- [x] T028 Docs: Remove duplicate boilerplate from spec.md and plan.md (m8)
- [x] T029 Docs: Fix unchecked checklist items (m9)
- [x] T030 Docs: Add behavioral changes + post-review remediation to implementation-summary.md (m7+m10)
- [x] T031 Write cross-AI review report to `scratch/cross-ai-review-report.md`
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks completed (T001–T031)
- [x] All 3 previously-failing inputs now succeed
- [x] Cross-AI review: 8 Major + 14 Minor issues addressed
- [x] Tests: 31/31 passed, 0 failed, 0 skipped
<!-- /ANCHOR:completion -->
