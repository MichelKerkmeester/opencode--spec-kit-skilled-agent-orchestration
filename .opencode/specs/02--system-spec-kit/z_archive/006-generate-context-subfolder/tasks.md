---
title: "Tasks: generate-context.ts Subfolder Support [123-generate-context-subfolder/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "generate"
  - "context"
  - "subfolder"
  - "support"
  - "123"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: generate-context.ts Subfolder Support

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

## Phase 0: Prerequisites

- [x] T001 Move memory files to 121-*/memory/ (file operations)
- [ ] T002 Create spec folder 123 (documentation)

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Core TypeScript Changes (generate-context.ts)

- [ ] T003 Modify `isValidSpecFolder()` for nested `parent/child` format (~15 LOC) (`generate-context.ts`)
- [ ] T004 Modify `parseArguments()` for nested prefix detection (~20 LOC) (`generate-context.ts`)
- [ ] T005 Modify `validateArguments()` for recursive 2-level scanning (~25 LOC) (`generate-context.ts`)
- [ ] T006 Add new `findChildFolder()` function with ambiguity detection (~30 LOC) (`generate-context.ts`)
- [ ] T013 [P] Update `--help` text with subfolder examples (~5 LOC) (`generate-context.ts`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Folder Detector Changes (folder-detector.ts)

- [ ] T007 Modify `detectSpecFolder()` Priority 1 (CLI) for nested path resolution (~15 LOC) (`folder-detector.ts`)
- [ ] T008 [P] Modify `detectSpecFolder()` Priority 2 (JSON) for nested path resolution (~15 LOC) (`folder-detector.ts`)
- [ ] T009 Modify `detectSpecFolder()` Priority 4 (Auto) for recursive scanning (~20 LOC) (`folder-detector.ts`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Build with `tsc --build` — zero errors
- [ ] T011 Test all 6 input formats resolve correctly
- [ ] T012 Test backward compatibility with flat folder inputs
- [ ] T017 Code review of all TypeScript changes
- [ ] T018 End-to-end verification (full workflow test)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Documentation

- [ ] T014 [P] Update SKILL.md memory save section with subfolder examples (~15 LOC)
- [ ] T015 [P] Update sub_folder_versioning.md with path resolution examples (~15 LOC)
- [ ] T016 [P] Update AGENTS.md memory save rule with subfolder examples (~10 LOC)

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: P1 Code Duplication Fix

- [x] T020 Create shared `scripts/core/subfolder-utils.ts` with `findChildFolderSync`, `findChildFolderAsync`, `SPEC_FOLDER_PATTERN`, `SPEC_FOLDER_BASIC_PATTERN` (~135 LOC)
- [x] T021 Refactor `generate-context.ts` — remove local patterns + `findChildFolder()`, import from shared utility (-46 LOC)
- [x] T022 Refactor `folder-detector.ts` — remove 2 inline bare-child-search implementations + local pattern, use `findChildFolderAsync` (-59 LOC)
- [x] T023 Update `core/index.ts` to re-export from subfolder-utils
- [x] T024 Build with `tsc --build` — zero errors, zero warnings after refactoring
- [x] T025 Run 27/27 folder-detector functional tests — all pass after refactoring

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Test Suite

- [x] T026 Create `scripts/tests/test-subfolder-resolution.js` (~410 LOC, 21 tests)
- [x] T027 Test coverage: SPEC_FOLDER_PATTERN, SPEC_FOLDER_BASIC_PATTERN, findChildFolderSync, findChildFolderAsync, core/index.js re-exports
- [x] T028 Run 21/21 subfolder resolution tests — all pass

<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: External Documentation

- [x] T029 Update `anobel.com/AGENTS.md` with subfolder support content (after line 225)
- [x] T030 Update `Barter/coder/AGENTS.md` with subfolder support content (after line 236)

<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8: Wrap-up

- [ ] T019 Save context to memory/

<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [x] All 6 input formats verified [Test: 7/7 test cases pass]
- [x] Flat folder backward compatibility confirmed [Test: Format 6 pass]
- [x] `tsc --build` clean [Build: 0 errors, 0 warnings]
- [x] Code duplication resolved (3 → 1 shared utility) [Phase 2b complete]
- [x] Test suite created (21 tests, all pass) [Phase 6 complete]

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
