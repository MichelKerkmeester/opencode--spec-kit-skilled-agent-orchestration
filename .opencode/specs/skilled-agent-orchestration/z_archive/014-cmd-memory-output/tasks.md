---
title: "Tasks: Memory Command Dashboard Visual Design System [03--commands-and-skills/014-cmd-memory-output/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "memory"
  - "command"
  - "dashboard"
  - "013"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Command Dashboard Visual Design System

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

---

---
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Audit the active packet for stale references to removed memory command docs
- [x] T002 Confirm the live memory command surface in `.opencode/command/memory/`
- [x] T003 [P] Identify where `/memory:manage shared` must be treated as nested under the live `/memory:manage` surface

---

---
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update `spec.md` to describe the current `/memory:search`, `/memory:save`, `/memory:manage`, and `/memory:learn` surface
- [x] T005 Update `plan.md` to remove deleted-command implementation references and reflect `/memory:manage shared`
- [x] T006 Update `checklist.md` and `implementation-summary.md` so they no longer point to removed command docs
- [x] T007 Add the missing `tasks.md` required for a Level 2 packet

---

---
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase 3: Verification

### Phase 3: Verification

- [ ] T008 Run packet-level stale-string checks against the active docs
- [ ] T009 Run `validate.sh --strict` for `.opencode/specs/03--commands-and-skills/014-cmd-memory-output`
- [ ] T010 Record the validation result and any remaining limitations in the packet summary

---

---
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed

---

---
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

---

---
<!-- /ANCHOR:cross-refs -->

---
