---
title: "Tasks: Memory Overhaul & Agent Upgrade Release [130-memory-overhaul-and-agent-upgrade-release/tasks]"
description: "Task Format: T### [P?] Description (folder path)"
trigger_phrases:
  - "tasks"
  - "memory"
  - "overhaul"
  - "agent"
  - "upgrade"
  - "130"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Overhaul & Agent Upgrade Release

<!-- SPECKIT_LEVEL: 3+ -->
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

**Task Format**: `T### [P?] Description (folder path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Root Documentation

- [x] T001 Create root plan.md (this folder)
- [x] T002 Create root tasks.md (this folder)
- [x] T003 Create root checklist.md (this folder)
- [x] T004 Create root decision-record.md (this folder)
- [x] T005 Create root implementation-summary.md (this folder)
- [x] T006 Update root README.md with task summaries (this folder)
- [x] T007 Verify root spec.md completeness (this folder)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Parallel Task Specifications

- [x] T008 [P] Create Task 01 complete Level 3+ docs (task-01-readme-alignment/) — Wave1: changes.md populated with 69 file updates
- [x] T009 [P] Create Task 02 complete Level 3+ docs (task-02-skill-speckit-alignment/) — Wave1: changes.md populated with 8 file updates
- [x] T010 [P] Create Task 03 complete Level 3+ docs (task-03-command-alignment/) — Wave1: changes.md populated with 11 file updates
- [x] T011 [P] Create Task 04 complete Level 3+ docs (task-04-agent-alignment/) — Wave1: changes.md populated with 25 file updates

### T008-T011 Subtasks (Per Task Folder)
Each task folder requires:
- Upgrade spec.md from Level 3 to Level 3+ (governance sections) — COMPLETED
- Upgrade checklist.md to explicit P0/P1/P2 marking — COMPLETED
- Create plan.md (technical approach for that audit) — COMPLETED
- Create tasks.md (breakdown of audit work) — COMPLETED
- Create decision-record.md (audit scope decisions) — COMPLETED
- Create implementation-summary.md (template for implementer) — COMPLETED
- Clean changes.md of any placeholder tokens — COMPLETED
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Sequential Task Specifications

- [x] T012 Create Task 05 complete Level 3+ docs (task-05-changelog-updates/) — Completed: 3 changelog entries created and checklist verified
- [x] T013 Create Task 06 complete Level 3+ docs (task-06-global-readme-update/) — Completed: 11 README changes documented with evidence (commit ff21d305)
- [B] T014 Track Task 07 publication readiness (task-07-github-release/) — Prepared: release notes finalized; publication blocked on clean release commit, tag, and release creation

### T012-T014 Subtasks (Per Task Folder)
Each task folder requires (same as Phase 2):
- Upgrade spec.md from Level 3 to Level 3+
- Upgrade checklist.md to explicit P0/P1/P2
- Create plan.md, tasks.md, decision-record.md, implementation-summary.md
- Clean changes.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [x] T015 Run validate.sh on entire spec folder — Completed: validate.sh passed (0 errors, 0 warnings)
- [x] T016 Check for placeholder tokens (\[placeholder\], \[TODO\]) — Completed: validator PLACEHOLDER_FILLED check passed
- [ ] T017 Verify all cross-references resolve
- [ ] T018 Verify task specs are self-contained
- [ ] T019 Verify dependency graph consistent across all docs
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 19 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] validate.sh exits with code 0 or 1 (not 2)
- [ ] grep finds no placeholder tokens
- [ ] All 8 spec folders have complete Level 3+ file sets
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
Root-level tasks for 130 umbrella spec
19 tasks across 4 phases
Tasks 08-11 parallelizable, 12-14 sequential
-->
