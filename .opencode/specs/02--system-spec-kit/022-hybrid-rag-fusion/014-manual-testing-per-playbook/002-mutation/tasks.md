---
title: "Tasks: manual-testing-per-playbook mutation phase [template:level_2/tasks.md]"
description: "Task tracker for 9 mutation playbook scenarios. One task per scenario, all PENDING."
trigger_phrases:
  - "mutation tasks"
  - "phase 002 tasks"
  - "manual mutation testing tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: manual-testing-per-playbook mutation phase

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

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Verify playbook files accessible at `../../manual_testing_playbook/02--mutation/`
- [ ] T002 Confirm feature catalog accessible at `../../feature_catalog/02--mutation/`
- [ ] T003 Load review protocol from `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] T004 Verify MCP runtime healthy — all mutation tools and checkpoint tools respond
- [ ] T005 [P] Prepare disposable sandbox spec folder with fixture memories for EX-008, EX-009, and 110
- [ ] T006 [P] Confirm no active checkpoints conflict with planned names (pre-ex008-delete, pre-ex009-bulk-delete)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Scenario Tasks

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T010 | EX-006 | Memory indexing (memory_save) | PENDING | — |
| T011 | EX-007 | Memory metadata update (memory_update) | PENDING | — |
| T012 | M-008 | Feature 09 Direct Manual Scenario (Per-memory History Log) | PENDING | — |
| T013 | EX-008 | Single and folder delete (memory_delete) — DESTRUCTIVE | PENDING | — |
| T014 | EX-009 | Tier-based bulk deletion (memory_bulk_delete) — DESTRUCTIVE | PENDING | — |
| T015 | EX-010 | Validation feedback (memory_validate) | PENDING | — |
| T016 | 085 | Transaction wrappers on mutation handlers | PENDING | — |
| T017 | 101 | memory_delete confirm schema tightening | PENDING | — |
| T018 | 110 | Prediction-error save arbitration | PENDING | — |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Record verdict for each scenario (PASS, PARTIAL, or FAIL) with rationale
- [ ] T031 Confirm 9/9 scenarios executed with no skipped test IDs
- [ ] T032 Update checklist.md with evidence references for all P0 items
- [ ] T033 Complete implementation-summary.md with aggregate results
- [ ] T034 Verify sandbox isolation maintained for EX-008 and EX-009 (operations scoped to sandbox folder)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 9 scenario tasks (T010-T018) marked complete
- [ ] All verification tasks (T030-T034) complete
- [ ] No `[B]` blocked tasks remaining without documented reason
- [ ] Destructive tests executed only with named checkpoints confirmed in advance
- [ ] Manual verification passed per review protocol
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
