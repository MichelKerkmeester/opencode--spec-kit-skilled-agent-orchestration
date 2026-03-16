---
title: "Tasks: manual-testing-per-playbook memory quality and indexing phase [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory quality tasks"
  - "phase 013 tasks"
  - "memory indexing tasks"
  - "tasks core memory"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook memory quality and indexing phase

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

- [x] T001 Extract prompts, command sequences, and pass criteria for all 25 Phase 013 scenarios from `../../manual_testing_playbook/manual_testing_playbook.md`
- [x] T002 [P] Confirm feature catalog links for NEW-039 through NEW-048 in `../../feature_catalog/13--memory-quality-and-indexing/`
- [x] T003 [P] Confirm feature catalog links for NEW-069, NEW-073, NEW-111, NEW-119, NEW-131, NEW-132, and NEW-133 in `../../feature_catalog/13--memory-quality-and-indexing/`
- [x] T004 [P] Confirm nearest-category and direct mappings for M-001 through M-008 including cross-category M-008 link to `../../feature_catalog/02--mutation/10-per-memory-history-log.md`
- [x] T005 Identify destructive scenarios (NEW-042, NEW-043, NEW-044, NEW-111, NEW-119, NEW-132, M-003, M-005, M-006, M-007, M-008) requiring sandbox or checkpoint isolation
- [ ] T006 [P] Prepare disposable sandbox spec folders and `/tmp` artifacts before any write, corruption, or collision scenario begins
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Draft `spec.md` with metadata, scope table for all 25 test IDs, 25 requirements (REQ-001 through REQ-025), success criteria, and risks
- [x] T008 Draft `plan.md` with readiness gates, architecture, four execution phases, testing strategy table, dependencies, and rollback plan
- [x] T009 Draft `tasks.md` with setup, implementation, verification, and completion anchors covering all 25 scenarios
- [x] T010 Draft `checklist.md` with P0/P1/P2 items covering documentation structure, scenario quality, execution, security, and file organization
- [ ] T011 [P] Add evidence references and verdict outcomes for non-destructive scenarios after execution (NEW-039, NEW-040, NEW-041, NEW-045, NEW-046, NEW-047, NEW-048, NEW-069, NEW-073, NEW-131, NEW-133, M-001, M-002, M-004)
- [ ] T012 [P] Add evidence references and verdict outcomes for destructive scenarios after sandboxed execution (NEW-042, NEW-043, NEW-044, NEW-111, NEW-119, NEW-132, M-003, M-005, M-006, M-007, M-008)
- [ ] T013 Resolve open question: identify canonical sandbox spec folder for description.json corruption, filename collision, and dry-run save scenarios
- [ ] T014 Resolve open question: confirm whether M-001 through M-004 remain on nearest-category mappings or receive dedicated feature-catalog backfill entries
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Execute non-destructive Phase 2 scenarios following `plan.md` Phase 2 execution order: NEW-039, NEW-040, NEW-041, NEW-045, NEW-046, NEW-047, NEW-048, NEW-069, NEW-073, NEW-131, NEW-133, M-001, M-002, M-004
- [ ] T016 [B] Execute destructive Phase 3 scenarios in isolated sandboxes following `plan.md` Phase 3 order: NEW-042, NEW-043, NEW-044, NEW-111, NEW-119, NEW-132, M-003, M-005, M-006, M-007, M-008 (blocked until T006 sandbox setup is confirmed)
- [ ] T017 Assign PASS, PARTIAL, or FAIL verdict to each of the 25 scenarios using review-protocol acceptance rules
- [ ] T018 Confirm phase coverage: 25/25 scenarios executed with no skipped test IDs and no blocked scenarios remaining
- [x] T019 Validate documentation structure and required ANCHOR blocks in spec.md, plan.md, tasks.md, and checklist.md
- [ ] T020 Update `implementation-summary.md` when all 25 scenarios are executed, verdicted, and verified
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 25 scenarios have PASS, PARTIAL, or FAIL verdicts with supporting evidence
- [ ] Phase coverage confirmed at 25/25 with no omitted test IDs
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
