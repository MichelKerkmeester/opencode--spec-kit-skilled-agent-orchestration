---
title: "...09-perfect-session-capturing/000-dynamic-capture-deprecation/004-source-capabilities-and-structured-preference/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 019"
  - "tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Source Capabilities And Structured Preference

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the existing source taxonomy and the contamination downgrade boundary.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add `scripts/utils/source-capabilities.ts`.
- [x] T003 Update `scripts/extractors/contamination-filter.ts`.
- [x] T004 Update `scripts/memory/generate-context.ts`.
- [x] T005 Update the feature catalog and the playbook.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Update contamination and CLI authority tests.
- [x] T007 Re-run the focused scripts lane and build.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Focused verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
