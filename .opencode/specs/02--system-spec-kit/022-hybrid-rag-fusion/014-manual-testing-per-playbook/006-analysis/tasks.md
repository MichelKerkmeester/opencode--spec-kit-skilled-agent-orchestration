---
title: "Tasks: manual-testing-per-playbook analysis phase [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "analysis tasks"
  - "phase 006 tasks"
  - "causal graph testing tasks"
  - "tasks core"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook analysis phase

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

- [x] T001 Extract analysis prompts, commands, and pass criteria from `../../manual_testing_playbook/manual_testing_playbook.md`
- [x] T002 Confirm feature links for EX-019, EX-020, EX-021, EX-022, EX-023, EX-024, and EX-025 in `../../feature_catalog/06--analysis/`
- [ ] T003 [P] Prepare sandbox checkpoint and agree on `specFolder`/`taskId` values for EX-023/EX-024 before execution
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Draft `spec.md` with metadata, scope table, and seven playbook-derived requirements
- [x] T005 Draft `plan.md` with readiness gates, execution phases, and testing strategy table
- [x] T006 Draft `tasks.md` with phase breakdown and completion criteria
- [x] T007 Draft `checklist.md` with P0/P1/P2 verification items for the analysis phase
- [ ] T008 Add evidence references and verdict outcomes after manual execution
- [ ] T009 [P] Resolve open questions for EX-021 sandbox target and EX-023/EX-024 shared taskId
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the seven Phase 006 scenarios following `plan.md`
- [x] T011 Validate documentation structure and required anchors
- [ ] T012 Update `implementation-summary.md` when execution and verification are complete
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

---
