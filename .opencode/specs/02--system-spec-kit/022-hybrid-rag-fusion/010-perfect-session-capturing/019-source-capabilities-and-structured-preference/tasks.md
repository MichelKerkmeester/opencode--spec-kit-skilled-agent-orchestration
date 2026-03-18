---
title: "Tasks: Source Capabilities And Structured Preference [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 019"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Source Capabilities And Structured Preference

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

- [x] T001 Read the shipped capability policy and save-path guidance.
- [x] T002 Define the phase scope around source capabilities and structured preference.

---

## Phase 2: Implementation

- [x] T003 Document the capability registry.
- [x] T004 Document the capability-driven contamination behavior.
- [x] T005 Document the preferred structured-input path and direct fallback path.

---

## Phase 3: Verification

- [x] T006 Link this phase to the feature catalog and playbook.
- [x] T007 Keep retained live proof deferred to phase `020`.

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Phase scope documented truthfully

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
