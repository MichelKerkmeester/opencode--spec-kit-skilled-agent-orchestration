---
title: "Tasks: Perfect Session Capturing [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/tasks]"
description: "Task Format: T### [P?] Description (file path); current scope is the authoritative phase-tree reference realignment pass."
trigger_phrases:
  - "tasks"
  - "perfect session capturing"
  - "roadmap phases 018 019"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Perfect Session Capturing

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace the phase-tree alignment repair.

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Build the old-to-new phase/path mapping table for the in-scope doc set.
- [x] T002 Confirm `memory/**` and `scratch/**` are out of scope.
- [x] T003 Confirm which reusable research docs actually act as current navigation.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the parent `spec.md` phase map to the actual direct-child layout.
- [x] T005 Rewrite the parent `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` to the current navigation story.
- [x] T006 Create `000-dynamic-capture-deprecation/spec.md`, `plan.md`, and `tasks.md`.
- [x] T007 Repair active root-child metadata and link fields.
- [x] T008 Repair moved branch-child metadata and current-navigation references.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `validate.sh --strict --recursive` on the parent pack.
- [x] T010 Run a targeted stale-reference sweep on in-scope docs.
- [x] T011 Confirm touched docs are free of `[PLACEHOLDER]` content.
- [x] T012 Confirm no files under `memory/**` or `scratch/**` were modified.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Recursive validation passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
