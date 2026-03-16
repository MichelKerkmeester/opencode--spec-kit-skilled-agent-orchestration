---
title: "Tasks: manual-testing-per-playbook discovery phase [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "discovery tasks"
  - "phase 003 tasks"
  - "manual discovery tasks"
  - "tasks core"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook discovery phase

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

- [x] T001 Extract discovery prompts, commands, and pass criteria from `../../manual_testing_playbook/manual_testing_playbook.md`
- [x] T002 Confirm feature links for EX-011, EX-012, and EX-013 in `../../feature_catalog/03--discovery/`
- [ ] T003 [P] Identify target spec folder path for EX-011 pagination and confirm indexed corpus is stable before execution
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Draft `spec.md` with metadata, scope table, and three playbook-derived requirements
- [x] T005 Draft `plan.md` with readiness gates, execution phases, and testing strategy table
- [x] T006 Draft `tasks.md` with phase breakdown and cross-references
- [x] T007 Draft `checklist.md` with verification protocol and P0/P1/P2 items
- [ ] T008 Add evidence references and verdict outcomes after manual execution
- [ ] T009 [P] Resolve open questions for EX-011 spec folder target and EX-013 alias-conflict corpus
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the three Phase 003 scenarios following `plan.md`
- [x] T011 Validate documentation structure and required anchors
- [ ] T012 Update `implementation-summary.md` when execution and verification are complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
