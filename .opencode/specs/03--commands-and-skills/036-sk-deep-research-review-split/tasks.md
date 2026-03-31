---
title: "Tasks: Split sk-deep-research review mode [03--commands-and-skills/036-sk-deep-research-review-split/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "036 tasks"
  - "deep-review split tasks"
  - "review mode split task list"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Split sk-deep-research Review Mode into sk-deep-review

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Inventory review-mode entrypoints in `sk-deep-research`, runtime wrappers, and top-level docs
- [ ] T002 Create the standalone `sk-deep-review` skill package structure
- [ ] T003 [P] Create the `/spec_kit:deep-review` command and associated runtime wrapper surfaces
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Move review references, assets, and contract material into `sk-deep-review`
- [ ] T005 Remove review-mode guidance from `sk-deep-research` while keeping research behavior intact
- [ ] T006 Update skill advisor routing so review phrases resolve to `sk-deep-review`
- [ ] T007 Update YAML workflow assets and runtime wrappers to the new deep-review naming
- [ ] T008 Update root and package-local documentation to describe the split and new command name
- [ ] T009 Publish changelog and upgrade guidance for the breaking rename
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Read updated command, skill, wrapper, and top-level docs to confirm no stale review-mode routing remains
- [ ] T011 Verify research requests still point to `sk-deep-research` and review requests point to `sk-deep-review`
- [ ] T012 Verify release notes document `/spec_kit:deep-research:review` → `/spec_kit:deep-review`
- [ ] T013 Update spec-folder documentation and validate the folder structure
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
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
