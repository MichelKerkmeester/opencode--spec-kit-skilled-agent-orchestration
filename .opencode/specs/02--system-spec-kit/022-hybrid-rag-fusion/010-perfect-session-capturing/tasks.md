---
title: "Tasks: Perfect Session Capturing [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path); current scope is the documentation-only roadmap extension through phases 018-020."
trigger_phrases:
  - "tasks"
  - "perfect session capturing"
  - "roadmap phases 018 019 020"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Perfect Session Capturing

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace the documentation-only roadmap update.

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

- [x] T001 Create `018-runtime-contract-and-indexability/`.
- [x] T002 Create `019-source-capabilities-and-structured-preference/`.
- [x] T003 Create `020-live-proof-and-parity-hardening/`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Populate phase `018` `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`.
- [x] T005 Populate phase `019` `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`.
- [x] T006 Populate phase `020` `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`.
- [x] T007 Extend the parent `spec.md` phase map from `017` to `020`.
- [x] T008 Rewrite the parent `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` to conservative roadmap language.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `validate.sh --strict --recursive` on the parent pack.
- [ ] T010 Run `check-completion.sh --strict` if completion evidence is needed.
- [x] T011 Confirm the new parent docs and child phase docs are free of `[PLACEHOLDER]` content.
- [ ] T012 Refresh retained live artifacts only in future phase-020 implementation work.
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
