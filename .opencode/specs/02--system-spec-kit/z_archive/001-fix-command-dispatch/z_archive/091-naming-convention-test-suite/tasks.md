---
title: "Tasks: Naming Convention Test Suite [091-naming-convention-test-suite/tasks]"
description: "tasks document for 091-naming-convention-test-suite."
trigger_phrases:
  - "tasks"
  - "naming"
  - "convention"
  - "test"
  - "suite"
  - "091"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Naming Convention Test Suite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

---

## Phase 1: Test Infrastructure

- [x] T001 Create `test-naming-migration.js` scaffold (test runner, helpers, file discovery)
- [x] T002 Implement T1: Syntax validation (node --check on 200 JS, bash -n on 28 shell)
- [x] T003 Implement T2: MCP module import chain (require() 98 non-test files)
- [x] T004 Implement T9: Scripts module imports (require() 43 non-test files)
- [x] T005 Implement T10: Naming compliance sweep (regex scan for remaining snake_case)
- [x] T006 Implement T7: Cross-reference integrity (scan for orphaned snake_case calls)

---

## Phase 2: Export Contracts

- [x] T010 Create `test-export-contracts.js` scaffold (source-level analysis, no DB deps)
- [x] T011 Define export maps for handlers/ (9 handler files, handle* functions)
- [x] T012-T015 Lib modules tested via runtime require() in T2 (non-empty exports verified)
- [x] T016 Define export maps for scripts/ barrel index files (6 modules)
- [x] T017 Implement T6: Backward-compat alias verification for handler exports

---

## Phase 3: Bug Regressions

- [x] T020 Create `test-bug-regressions.js` scaffold (source-level pattern analysis)
- [x] T021 Bug 1 regression: memory-context.js:299 normalizedInput
- [x] T022 Bug 2 regression: memory-parser.js:348,351 causalLinks/causalBlockMatch
- [x] T023 Bug 3 regression: causal-edges.js:561 stats.source_count

---

## Phase 4: Validation

- [x] T030 Run full test suite
- [x] T031 Fix false positives (memory-save.js minHandleFuncs adjusted, tests/ excluded from import)
- [x] T032 Verify clean output (all 3 test files produce clear pass/fail with counts)
- [x] T033 Update checklist.md with evidence

---

## Phase 5: Completion

- [x] T040 Create implementation-summary.md
- [ ] T041 Save memory context

---

## Completion Criteria

- [x] All tasks marked `[x]` (except T041)
- [x] No `[B]` blocked tasks remaining
- [x] Test suite runs with clear output (pre-migration failures expected)
- [x] 3 bug regressions verified (all 3 correctly detected)
