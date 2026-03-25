---
title: "Tasks: manual-testing-per-playbook implement-and-remove-deprecated-features phase [template:level_2/tasks.md]"
description: "Task tracker for Phase 022 deprecated-feature scenarios PB-022-01 through PB-022-03."
trigger_phrases:
  - "phase 022 tasks"
  - "deprecated features tasks"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook implement-and-remove-deprecated-features phase

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

- [ ] T001 Read `spec.md` and the Phase 022 catalog packet before execution begins
- [ ] T002 Extract the exact PB-022-01 through PB-022-03 pass criteria from the playbook
- [ ] T003 Select one representative REMOVE target for PB-022-02
- [ ] T004 Record the baseline state of the selected target before any workflow steps
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Execute PB-022-01 and capture the current state of all six targets
- [ ] T006 Record PB-022-01 verdict and any target-state ambiguity
- [ ] T007 Execute PB-022-02 and capture pre-removal validation evidence for the selected target
- [ ] T008 Execute PB-022-02 post-removal or blocked-state verification and record the outcome
- [ ] T009 Record PB-022-02 verdict and note any rollback caveat
- [ ] T010 Execute PB-022-03 and capture grep results for runtime and documentation references
- [ ] T011 Record PB-022-03 verdict and any remaining reference gaps
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Update `checklist.md` with evidence references and verdicts
- [ ] T013 Update `implementation-summary.md` with phase coverage and current blocker status
- [ ] T014 Confirm `spec.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` stay synchronized
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 3 scenarios have verdicts recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

