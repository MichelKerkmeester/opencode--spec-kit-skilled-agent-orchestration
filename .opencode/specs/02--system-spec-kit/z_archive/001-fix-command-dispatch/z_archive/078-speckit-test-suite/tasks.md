---
title: "Tasks: System Spec Kit v2.1.0 Test Suite [078-speckit-test-suite/tasks]"
description: "Task Format: T### [P?] [Priority] Description (file path) → CHK-###"
trigger_phrases:
  - "tasks"
  - "system"
  - "spec"
  - "kit"
  - "test"
  - "078"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: System Spec Kit v2.1.0 Test Suite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [Priority] Description (file path) → CHK-###`

---

## Phase 1: MCP Handler Tests (~900 LOC)

- [ ] T001 [P0] Implement test-session-learning.js (~400 LOC) → CHK-020
  - Location: `mcp_server/tests/test-session-learning.js`
  - Tests: Schema validation, preflight epistemics, postflight updates, history, errors
  - Dependencies: better-sqlite3, session-learning handler module

- [ ] T002 [P] [P0] Implement test-memory-handlers.js (~500 LOC) → CHK-020
  - Location: `mcp_server/tests/test-memory-handlers.js`
  - Tests: memory_save, memory_search, memory_match_triggers, anchors, errors
  - Dependencies: better-sqlite3, memory handler modules

**Phase Gate**: Both T001 and T002 complete before proceeding to Phase 2

---

## Phase 2: Integration Tests (~350 LOC)

- [ ] T003 [P0] Implement test-cognitive-integration.js (~350 LOC) → CHK-020
  - Location: `mcp_server/tests/test-cognitive-integration.js`
  - Tests: End-to-end workflows, attention decay, co-activation, working memory, tier classification
  - Dependencies: T001, T002 (handlers must be tested first)

**Phase Gate**: T003 complete, integration patterns validated → CHK-021

---

## Phase 3: Scripts Tests (~800 LOC)

- [ ] T004 [P] [P0] Implement test-validation-system.js (~400 LOC) → CHK-020
  - Location: `scripts/tests/test-validation-system.js`
  - Tests: validate-spec-folder.js, level detection, required files, template compliance, exit codes
  - Dependencies: None (can run in parallel with Phase 1)

- [ ] T005 [P] [P0] Implement test-extractors-loaders.js (~400 LOC) → CHK-020
  - Location: `scripts/tests/test-extractors-loaders.js`
  - Tests: decision-extractor, diagram-extractor, data-loader, collect-session-data, error handling
  - Dependencies: None (can run in parallel with T004)

**Phase Gate**: T004 and T005 complete → CHK-022

---

## Phase 4: Framework Tests (~650 LOC)

- [ ] T006 [P] [P0] Implement test-five-checks.js (~250 LOC) → CHK-020
  - Location: `scripts/tests/test-five-checks.js`
  - Tests: Five Checks documentation presence, template format, table structure, decision-record integration
  - Dependencies: None (can run in parallel with other phases)

- [ ] T007 [P] [P0] Implement test_dual_threshold.py (~400 LOC) → CHK-020
  - Location: `scripts/tests/test_dual_threshold.py`
  - Tests: calculate_uncertainty(), passes_dual_threshold(), boundaries, pytest.approx, AGENTS.md integration
  - Dependencies: Python 3.9+, pytest

**Phase Gate**: T006 and T007 complete, all framework logic validated → CHK-022

---

## Phase 5: Template Tests (~300 LOC)

- [ ] T008 [P0] Implement test-template-comprehensive.js (~300 LOC) → CHK-020
  - Location: `scripts/tests/test-template-comprehensive.js`
  - Tests: Level directories, CORE + ADDENDUM, compose.sh, placeholders, examples
  - Dependencies: T003, T004, T005, T006, T007 (all prior tests inform template requirements)

**Phase Gate**: All acceptance criteria verified → CHK-020

---

## Phase 6: Documentation & Verification

- [ ] T009 [P1] Update README.md with new test files → CHK-042
  - Add test file descriptions to testing section
  - Document pytest requirements for Python tests

- [ ] T010 [P0] Verify all tests pass in isolation → CHK-021
  - Run each test file individually
  - Confirm no shared state pollution

- [ ] T011 [P0] Verify all tests pass in aggregate → CHK-021
  - Run `npm test` to execute full suite
  - Confirm < 5 second total runtime

- [ ] T012 [P0] Sync test files to Public repo → CHK-020
  - Copy all 8 test files to Public repo location
  - Verify tests pass in Public repo context

**Phase Gate**: All tests passing in both repos, docs updated → CHK-040

---

## Completion Criteria

- [ ] All tasks T001-T012 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 8 test files implemented (~3,000 LOC total)
- [ ] All tests passing (JavaScript and Python)
- [ ] Tests synced to Public repo
- [ ] All P0 checklist items verified

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001 | CHK-020 | P0 | [ ] |
| T002 | CHK-020 | P0 | [ ] |
| T003 | CHK-020, CHK-021 | P0 | [ ] |
| T004 | CHK-020 | P0 | [ ] |
| T005 | CHK-020 | P0 | [ ] |
| T006 | CHK-020 | P0 | [ ] |
| T007 | CHK-020 | P0 | [ ] |
| T008 | CHK-020 | P0 | [ ] |
| T009 | CHK-042 | P1 | [ ] |
| T010 | CHK-021 | P0 | [ ] |
| T011 | CHK-021 | P0 | [ ] |
| T012 | CHK-020 | P0 | [ ] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: MCP Handlers Complete
- [ ] T001 test-session-learning.js implemented and passing
- [ ] T002 test-memory-handlers.js implemented and passing
- [ ] Handler tests cover all MCP tool entry points

### Gate 2: Integration Complete
- [ ] T003 test-cognitive-integration.js implemented and passing
- [ ] End-to-end workflows validated
- [ ] Cognitive memory patterns verified

### Gate 3: Scripts Complete
- [ ] T004 test-validation-system.js implemented and passing
- [ ] T005 test-extractors-loaders.js implemented and passing
- [ ] All script modules have test coverage

### Gate 4: Framework Complete
- [ ] T006 test-five-checks.js implemented and passing
- [ ] T007 test_dual_threshold.py implemented and passing (pytest)
- [ ] Framework algorithms validated

### Gate 5: Templates Complete
- [ ] T008 test-template-comprehensive.js implemented and passing
- [ ] Template composition verified
- [ ] All level directories validated

### Gate 6: Final Verification
- [ ] T009 README updated (P1)
- [ ] T010 Isolation tests pass
- [ ] T011 Aggregate tests pass < 5 seconds
- [ ] T012 Public repo sync complete

---

## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| - | - | - | No blocked tasks |

---

## L2: PARALLELIZATION OPPORTUNITIES

The following tasks can be executed in parallel:

**Parallel Group A** (Phase 1 + 3 + 4):
- T001: test-session-learning.js
- T002: test-memory-handlers.js
- T004: test-validation-system.js
- T005: test-extractors-loaders.js
- T006: test-five-checks.js
- T007: test_dual_threshold.py

**Sequential Dependencies**:
- T003 depends on T001, T002 (handler tests inform integration tests)
- T008 depends on T003-T007 (template tests use patterns from all other tests)
- T010-T012 depend on T001-T008 (verification after implementation)

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`

---
