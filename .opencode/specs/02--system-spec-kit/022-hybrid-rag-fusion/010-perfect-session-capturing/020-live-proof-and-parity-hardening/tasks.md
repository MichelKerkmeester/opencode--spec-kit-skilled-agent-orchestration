---
title: "Tasks: Live Proof And Parity Hardening [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 020"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Live Proof And Parity Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: Setup

- [x] T001 Define the live-proof closeout scope.
- [x] T002 Record the supported scenario families that still need retained artifacts.

---

## Phase 2: Implementation

- [ ] T003 Refresh retained live CLI artifacts.
- [ ] T004 Capture direct, `--stdin`, and `--json` live/manual proof where applicable.
- [ ] T005 Reconfirm same-minute repeated-save expectations.

---

## Phase 3: Verification

- [ ] T006 Update the parent proof boundary only after retained artifacts exist.
- [ ] T007 Rerun parent recursive validation and completion checks.

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Retained live-proof artifacts refreshed

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
