---
title: "Tasks: manual-testing-per-playbook maintenance phase [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "maintenance tasks"
  - "phase 004 tasks"
  - "index scan testing tasks"
  - "startup guard testing tasks"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook maintenance phase

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Extract maintenance prompts, commands, and pass criteria from `../../manual_testing_playbook/manual_testing_playbook.md`
- [x] T002 Confirm feature links for EX-014 and EX-035 in `../../feature_catalog/04--maintenance/`
- [x] T003 [P] Prepare sandbox spec folder with known changed files for EX-014 and verify Node/npm toolchain for EX-035
- [x] T013 Confirm feature context for NEW-100 in `../../feature_catalog/04--maintenance/02-startup-runtime-compatibility-guards.md` and NEW-101 in `../../feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Draft `spec.md` with metadata, scope table, and four playbook-derived requirements (EX-014, EX-035, NEW-100, NEW-101)
- [x] T005 Draft `plan.md` with readiness gates, execution phases, and testing strategy table
- [x] T006 Draft `tasks.md` with phase breakdown and cross-references
- [x] T007 Draft `checklist.md` with pre-implementation, code quality, testing, security, docs, and file organization sections
- [x] T008 Add evidence references and verdict outcomes after manual execution
- [x] T009 [P] Resolve open questions for EX-014 sandbox target and EX-035 mismatch simulation scope
- [x] T014 Execute NEW-100 code analysis of `context-server.ts` shutdown logic and capture evidence
- [x] T015 Execute NEW-101 `memory_delete` confirm schema validation via MCP and capture evidence
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the four Phase 004 scenarios following `plan.md`
- [x] T016 Assign PASS/PARTIAL/FAIL verdicts for all four scenarios per review protocol
- [x] T011 Validate documentation structure and required anchors
- [x] T012 Update `implementation-summary.md` when execution and verification are complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
