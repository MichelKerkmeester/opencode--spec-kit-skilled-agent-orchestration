---
title: "Tasks: Integration Testing [template:level_1/tasks.md]"
---
# Tasks: Integration Testing

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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Review existing heavily-mocked tests for coverage baseline (`scripts/tests/task-enrichment.vitest.ts`, `scripts/tests/memory-render-fixture.vitest.ts`)
- [ ] T002 Review legacy integration test to understand current coverage (`scripts/tests/test-integration.js`)
- [ ] T003 Identify workflow orchestrator entry point for direct import in E2E tests (`scripts/core/workflow.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Temp Repo Factory (REQ-001)

- [ ] T004 Create `workflow-e2e.vitest.ts` with `createTempRepo()` factory function (`scripts/tests/workflow-e2e.vitest.ts`)
- [ ] T005 Factory creates: temp dir, `.opencode/` marker, spec folder with `spec.md`, seed `description.json` (`scripts/tests/workflow-e2e.vitest.ts`)
- [ ] T006 Factory returns: `{ tempDir, specFolder, descriptionPath, cleanup() }` (`scripts/tests/workflow-e2e.vitest.ts`)
- [ ] T007 Wire `beforeEach`/`afterEach` for automatic setup and teardown with `fs.rm(tempDir, { recursive: true, force: true })` (`scripts/tests/workflow-e2e.vitest.ts`)

### Fixture Data (REQ-001)

- [ ] T008 [P] Create `tests/fixtures/` directory (`scripts/tests/fixtures/`)
- [ ] T009 [P] Add minimal spec folder template with required frontmatter and ANCHOR blocks (`scripts/tests/fixtures/`)
- [ ] T010 [P] Add JSON input fixture for happy-path scenario (rich content, correct spec affinity) (`scripts/tests/fixtures/`)
- [ ] T011 [P] Add JSON input fixture for wrong-affinity scenario (`scripts/tests/fixtures/`)
- [ ] T012 [P] Add JSON input fixture for duplicate scenario (identical to happy-path) (`scripts/tests/fixtures/`)

### Test Case Implementation (REQ-002, REQ-003, REQ-004, REQ-005)

- [ ] T013 Test case 1 -- happy-path save: invoke workflow, assert memory file exists, `description.json` has new entry, sequence incremented (`scripts/tests/workflow-e2e.vitest.ts`)
- [ ] T014 Test case 2 -- alignment block: invoke workflow with wrong-affinity input, assert `ALIGNMENT_BLOCK` rejection, no memory file, `description.json` unchanged (`scripts/tests/workflow-e2e.vitest.ts`)
- [ ] T015 Test case 3 -- duplicate dedup: run happy-path first, invoke again with identical content, assert no second memory file, sequence not double-incremented (`scripts/tests/workflow-e2e.vitest.ts`)
- [ ] T016 Post-write bookkeeping verification in each test case: read `description.json`, check filesystem, compare sequence numbers (`scripts/tests/workflow-e2e.vitest.ts`)

### CI Integration (REQ-001)

- [ ] T017 Ensure `workflow-e2e.vitest.ts` is discovered by existing Vitest config
- [ ] T018 Set appropriate timeout for real I/O operations (e.g., 30s per test)
- [ ] T019 Verify cleanup: no temp artifacts left after test run
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Run full test suite (`npm test`) and confirm all 3 E2E test cases pass
- [ ] T021 Confirm no interference with existing unit and integration tests
- [ ] T022 Verify real gate chain exercised without mocks on critical path (no mock on file writer, quality scorer, or sufficiency evaluator)
- [ ] T023 [P] Consider light-touch migration of `test-integration.js` to Vitest (REQ-006, P1 deferrable)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
