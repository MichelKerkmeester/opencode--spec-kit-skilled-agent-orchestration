---
title: "Tasks: [NAME] [030-hero-flicker-debug/tasks]"
description: "Level 2 Tasks (+Verify) is appropriate when"
trigger_phrases:
  - "tasks"
  - "name"
  - "030"
  - "hero"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: [NAME]

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.0 -->

<!-- WHEN TO USE THIS TEMPLATE:
Level 2 Tasks (+Verify) is appropriate when:
- QA validation checklist exists (checklist.md)
- Task-to-checklist traceability needed
- Verification evidence must be documented
- Phase completion gates required

DO NOT use Level 2 Tasks if:
- Simple feature <100 LOC (use Level 1)
- No checklist.md exists (use Level 1)
-->

---

<!-- ANCHOR:task-notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [Priority] Description (file path) → CHK-###`
<!-- /ANCHOR:task-notation -->

---

<!-- ANCHOR:phase-1-setup -->
## Phase 1: Setup

- [ ] T001 [P0] Create project structure → CHK-001
- [ ] T002 [P0] Install dependencies → CHK-003
- [ ] T003 [P] [P1] Configure development tools

**Phase Gate**: All P0 tasks complete before proceeding
<!-- /ANCHOR:phase-1-setup -->

---

<!-- ANCHOR:phase-2-implementation -->
## Phase 2: Implementation

- [ ] T004 [P0] [Implement core feature 1] → CHK-020
- [ ] T005 [P0] [Implement core feature 2] → CHK-020
- [ ] T006 [P1] [Implement core feature 3]
- [ ] T007 [P0] [Add error handling] → CHK-012

**Phase Gate**: All P0 tasks complete, code passes lint → CHK-010
<!-- /ANCHOR:phase-2-implementation -->

---

<!-- ANCHOR:phase-3-verification -->
## Phase 3: Verification

- [ ] T008 [P0] Test happy path manually → CHK-021
- [ ] T009 [P1] Test edge cases → CHK-022
- [ ] T010 [P1] Update documentation → CHK-040

**Phase Gate**: All acceptance criteria verified → CHK-020
<!-- /ANCHOR:phase-3-verification -->

---

<!-- ANCHOR:completion-criteria -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] All P0 checklist items verified
<!-- /ANCHOR:completion-criteria -->

---

<!-- ANCHOR:cross-references -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-references -->

---


---

<!-- ANCHOR:task-checklist-mapping -->
## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001 | CHK-001 | P0 | [ ] |
| T002 | CHK-003 | P1 | [ ] |
| T004 | CHK-020 | P0 | [ ] |
| T007 | CHK-012 | P1 | [ ] |
| T008 | CHK-021 | P0 | [ ] |
<!-- /ANCHOR:task-checklist-mapping -->

---

<!-- ANCHOR:phase-completion-gates -->
## L2: PHASE COMPLETION GATES

### Gate 1: Setup Complete
- [ ] All P0 setup tasks done
- [ ] Dependencies verified working
- [ ] Ready for implementation

### Gate 2: Implementation Complete
- [ ] Core features functional
- [ ] Error handling in place
- [ ] Code quality checks pass (CHK-010, CHK-011)

### Gate 3: Verification Complete
- [ ] All acceptance criteria met (CHK-020)
- [ ] Edge cases documented (CHK-022)
- [ ] Security checklist passed (CHK-030, CHK-031)
<!-- /ANCHOR:phase-completion-gates -->

---

<!-- ANCHOR:blocked-task-tracking -->
## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| [T###] | [Description] | [High/Med/Low] | [Action needed] |
<!-- /ANCHOR:blocked-task-tracking -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Verification tracking
- Task-to-checklist traceability
- Phase completion gates
- Blocked task tracking
-->
