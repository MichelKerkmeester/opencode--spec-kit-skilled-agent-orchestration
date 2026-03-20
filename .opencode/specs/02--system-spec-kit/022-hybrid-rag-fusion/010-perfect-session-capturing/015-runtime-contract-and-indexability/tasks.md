---
title: "Tasks: Runtime Contract and Indexability"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 015"
  - "tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Runtime Contract And Indexability

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

- [x] T001 Confirm the write/index policy gaps from the audit baseline.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add rule metadata helpers in `scripts/memory/validate-memory-quality.ts`.
- [x] T003 Update workflow indexing decisions in `scripts/core/workflow.ts`.
- [x] T004 Add policy-aware indexing status handling in `scripts/core/memory-indexer.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Add rule metadata and workflow E2E coverage.
- [x] T006 Run the focused scripts lane and `npm run build`.
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
