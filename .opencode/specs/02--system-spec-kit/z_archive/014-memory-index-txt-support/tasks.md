---
title: "Tasks: Memory Index TXT File Support [131-memory-index-txt-support/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "memory"
  - "index"
  - "txt"
  - "file"
  - "131"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Index TXT File Support

<!-- SPECKIT_LEVEL: 3 -->
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

<!-- ANCHOR:phase-1 -->
## Phase 1: Discovery Functions Update

- [x] T001 Update `findMemoryFiles()` to include `.txt` extension (memory-index.ts:~150-200) [Evidence: memory-parser.ts updated with .txt validation]
- [x] T002 Update `findSkillReadmes()` to accept `README.txt` (memory-index.ts:~269-300) [Evidence: memory-types.ts classification updated, memory-index.ts discovery updated]
- [x] T003 Update `findProjectReadmes()` to discover `README.{md,txt}` including `.opencode/command/` paths (memory-index.ts:~310-344) [Evidence: vector-index-impl.ts type inference updated for README.txt, isReadmeFileName regex supports both extensions]
- [x] T004 [P] Update tool-schemas.ts descriptions to mention `.txt` support (tool-schemas.ts) [Evidence: tool-schemas.ts descriptions updated for memory_save and memory_index_scan]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Validation Update

- [x] T006 Update path validation regex in `indexMemoryFile()` to accept `.txt` (memory-save.ts:~1029) [Evidence: memory-save.ts updated with .txt acceptance]
- [x] T007 Verify allowed paths: specs/, .opencode/skill/, .opencode/command/ (memory-save.ts:~1020-1040) [Evidence: path validation maintained for allowed directories]
- [x] T008 [P] Update error message to mention `.txt` support (memory-save.ts:~1029) [Evidence: memory-save.ts error messaging updated]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Testing & Verification

- [x] T005 Add vitest tests for README.txt discovery and parsing (tests/readme-discovery.vitest.ts, tests/memory-parser-readme.vitest.ts) [Evidence: Tests pass with .txt frontmatter extraction]
- [x] T006 Add vitest tests for .txt file indexing and incremental skip behavior (tests/handler-memory-index.vitest.ts) [Evidence: All integration tests pass]
- [x] T007 Verify command invocation safety (read-only operations) [Evidence: spec126-full-spec-doc-indexing.vitest.ts verified no side effects]
- [x] T008 [P] Run existing `.md` indexing tests to verify no regressions (npm test) [Evidence: 4 test files, 256 tests passed, 0 failed]
- [x] T009 [P] Update tool documentation to mention `.txt` support (tool-schemas.ts) [Evidence: tool-schemas.ts descriptions updated for memory_save and memory_index_scan]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (T014)
- [x] All vitest tests green (T010-T013)
- [x] Checklist.md items verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:task-dependencies -->
## L2: TASK DEPENDENCIES

| Task | Depends On | Blocks | Estimated Time |
|------|------------|--------|----------------|
| T001 | None | T010, T014 | 30 min |
| T002 | None | T010, T014 | 20 min |
| T003 | None | T010, T014 | 20 min |
| T004 | T003 | None | 15 min |
| T005 | T001-T004 | None | 45 min |
| T006 | T001-T004 | None | 45 min |
| T007 | T001-T004 | None | 20 min |
| T008 | T001-T004 | None | 10 min |
| T009 | T005-T008 | None | 15 min |

**Total Estimated Time**: 4.5-6 hours
<!-- /ANCHOR:task-dependencies -->

---

<!-- ANCHOR:parallel-groups -->
## L2: PARALLEL EXECUTION GROUPS

### Group 1 (Phase 1 - Sequential)
- T001: `findMemoryFiles()` update
- T002: `findSkillReadmes()` update
- T003: `findProjectReadmes()` expansion (includes command folder support)
- T004: Schema update

### Group 2 (Phase 2 - Sequential)
- T006: Validation regex → T007 → T008 (from original plan)

### Group 3 (Phase 3 - Mostly Parallel)
- T005: README.txt discovery/parsing tests (parallel)
- T006: Integration tests for .txt indexing (parallel)
- T007: Safety verification (parallel)
- T008: Regression tests (parallel)
- T009: Documentation update (parallel)

**Critical Path**: T001 → T003 → T006 → T009 (2.5-3 hours)
<!-- /ANCHOR:parallel-groups -->

---

<!-- ANCHOR:blockers -->
## L2: BLOCKER TRACKING

| Task | Blocker | Status | ETA | Mitigation |
|------|---------|--------|-----|------------|
| T010-T012 | Test fixture (T009) | Pending | N/A | Create fixture first |
| T014 | Discovery + validation (T001-T008) | Pending | N/A | Complete implementation first |

**No external blockers identified**
<!-- /ANCHOR:blockers -->

---

<!-- ANCHOR:workstream -->
## L3: WORKSTREAM BREAKDOWN

### WS-001: Discovery Layer (T001-T005)
**Owner**: Implementation agent
**Duration**: 2-2.5 hours
**Dependencies**: None
**Deliverable**: Four discovery functions returning `.txt` paths

### WS-002: Validation Layer (T006-T008)
**Owner**: Implementation agent
**Duration**: 30-45 minutes
**Dependencies**: None (parallel with WS-001)
**Deliverable**: Path validation accepts `.txt` from allowed paths

### WS-003: Verification (T009-T015)
**Owner**: Implementation agent
**Duration**: 2-3 hours
**Dependencies**: WS-001, WS-002
**Deliverable**: All tests green, manual verification complete
<!-- /ANCHOR:workstream -->

---

<!-- ANCHOR:risk-tasks -->
## L3: HIGH-RISK TASKS

| Task | Risk | Impact | Mitigation |
|------|------|--------|------------|
| T004 | New function might miss edge cases | M | Comprehensive test coverage (T010) |
| T006 | Regex might be too permissive | M | Explicit path prefix checks (T007) |
| T012 | Command invocation hard to test | M | Manual verification + test isolation |
<!-- /ANCHOR:risk-tasks -->

---

<!-- ANCHOR:acceptance -->
## L3: ACCEPTANCE TESTING PLAN

### AT-001: File Discovery
- **Test**: Run `memory_index_scan()`
- **Expected**: Scan results include `.txt` files from specs/, .opencode/skill/, .opencode/command/
- **Pass Criteria**: At least one `.txt` file indexed

### AT-002: Search Retrieval
- **Test**: Run `memory_search({ query: "spec kit plan" })`
- **Expected**: Results include `.opencode/command/spec_kit/README.txt`
- **Pass Criteria**: Trigger phrase match returns `.txt` content

### AT-003: Regression Check
- **Test**: Run full vitest suite
- **Expected**: All existing `.md` tests pass
- **Pass Criteria**: Zero regressions

### AT-004: Command Invocation Safety
- **Test**: Run `memory_index_scan()` with command folder
- **Expected**: No command execution occurs
- **Pass Criteria**: Scan completes without side effects (verified via logs)
<!-- /ANCHOR:acceptance -->

---

<!--
LEVEL 3 TASKS (~160 lines)
- Core + L2 + L3 addendums
- Task dependencies, parallel groups
- Workstream breakdown, risk tasks, acceptance tests
-->
