---
title: "Tasks: sk-prompt-improver Initial Creation"
---
# Tasks: sk-prompt-improver Initial Creation

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

---

<!-- /ANCHOR:notation -->
## Phase 1: Setup

- [x] T001 Create skill directory structure (.opencode/skill/sk-prompt-improver/)
- [x] T002 Create references/ subdirectory
- [x] T003 [P] Review source Prompt Improver knowledge base documents

---

## Phase 2: Core Implementation

- [x] T004 Create SKILL.md with all required sections (.opencode/skill/sk-prompt-improver/SKILL.md)
- [x] T005 [P] Create references/system_prompt.md (adapted from System Prompt v0.200)
- [x] T006 [P] Create references/depth_framework.md (adapted from DEPTH Framework v0.200)
- [x] T007 [P] Create references/patterns_evaluation.md (adapted from Patterns v0.201)
- [x] T008 [P] Create references/interactive_mode.md (adapted from Interactive Mode v0.700)
- [x] T009 [P] Create references/visual_mode.md (adapted from Visual Mode v0.200)
- [x] T010 [P] Create references/image_mode.md (adapted from Image Mode v0.121)
- [x] T011 [P] Create references/video_mode.md (adapted from Video Mode v0.121)
- [x] T012 [P] Create references/format_guides.md (consolidated from 3 format guides)

---

## Phase 3: Integration

- [x] T013 Update skill_advisor.py with sk-prompt-improver intent boosters (.opencode/skill/scripts/skill_advisor.py)
- [x] T014 Validate skill with package_skill.py
- [x] T015 Test routing with skill_advisor.py

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] package_skill.py validation passes
- [x] skill_advisor.py returns correct routing

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
