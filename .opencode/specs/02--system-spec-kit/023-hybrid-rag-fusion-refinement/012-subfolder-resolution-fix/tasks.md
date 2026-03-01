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

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks completed
- [x] All 3 previously-failing inputs now succeed
<!-- /ANCHOR:completion -->
