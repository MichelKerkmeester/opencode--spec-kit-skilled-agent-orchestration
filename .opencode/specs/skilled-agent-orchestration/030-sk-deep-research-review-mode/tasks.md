---
title: "Tasks: sk-deep-research Review Mode [03--commands-and-skills/030-sk-deep-research-review-mode/tasks]"
description: "Task ledger for restoring packet compliance and preserving the review-mode implementation context."
trigger_phrases:
  - "030"
  - "review mode tasks"
  - "deep research review tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: sk-deep-research Review Mode

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

- [x] T001 Repair `spec.md` to match the template structure
- [x] T002 Create the missing `plan.md`
- [x] T003 Create the missing `tasks.md`
- [x] T004 Repair broken markdown paths in `handover.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Verify the shared review doctrine paths under `.opencode/skill/sk-code-review/`
- [ ] T006 Verify the review-mode command entrypoint under `.opencode/command/spec_kit/deep-research.md`
- [ ] T007 Verify the review-mode skill docs under `.opencode/skill/sk-deep-research/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the verbose spec validator on this folder
- [ ] T009 Review the packet for remaining broken cross-references
- [ ] T010 Record any residual runtime follow-up work outside this repair packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All required packet docs present
- [ ] No `[B]` blocked tasks remaining
- [ ] Validator exits without hard errors
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Handover**: See `handover.md`
<!-- /ANCHOR:cross-refs -->

---
