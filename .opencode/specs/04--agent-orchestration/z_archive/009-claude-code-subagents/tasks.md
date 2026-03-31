---
title: "Tasks: Claude Code Subagents [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "claude code subagents"
  - "archive"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Claude Code Subagents

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

- [x] T001 Review archived folder contents
- [x] T002 Confirm Level 1 template requirements
- [x] T003 [P] Identify validation-breaking markdown drift
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite spec.md as a concise archival record
- [x] T005 Rewrite plan.md with the archive-fix approach
- [x] T006 Rewrite implementation-summary.md for the completed normalization
- [x] T007 Refresh extra top-level markdown files as brief archival notes when present
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Validate structural compliance
- [x] T009 Confirm top-level markdown notes do not contain broken file references
- [x] T010 Re-run strict validation and keep the passing result
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
