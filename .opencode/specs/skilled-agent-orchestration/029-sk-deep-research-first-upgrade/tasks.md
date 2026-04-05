---
title: "Tasks: sk-deep-research First Upgrade [03--commands-and-skills/029-sk-deep-research-first-upgrade/tasks]"
description: "Task ledger for the comparative research packet and its documentation repair."
trigger_phrases:
  - "029"
  - "deep research tasks"
  - "first upgrade tasks"
importance_tier: "normal"
contextType: "research"
---
# Tasks: sk-deep-research First Upgrade

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

- [x] T001 Capture the external reference list (`external_reference.md`)
- [x] T002 Preserve session context in `memory/`
- [x] T003 Preserve research configuration and state in `research/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Analyze ResearcherSkill and autoresearch
- [x] T005 Synthesize the first-upgrade findings in `research/research.md`
- [x] T006 Record supporting notes in `scratch/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Create `spec.md` from the Level 1 template
- [x] T008 Create `plan.md` from the Level 1 template
- [x] T009 Create `tasks.md` from the Level 1 template
- [ ] T010 Re-run packet validation after the repair
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All repair tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Validation run recorded for the repaired packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->

---
