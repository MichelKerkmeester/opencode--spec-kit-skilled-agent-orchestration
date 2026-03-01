---
title: "Tasks: SpecKit Template Optimization [073-speckit-template-optimization/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "speckit"
  - "template"
  - "optimization"
  - "073"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Tasks: SpecKit Template Optimization

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: Research & Analysis

- [x] T001 Analyze real spec folder usage patterns (9+ folders)
- [x] T002 [P] Identify always-used sections
- [x] T003 [P] Identify never/rarely-used sections
- [x] T004 Document findings in claude_analysis.md
- [x] T005 Create final_recommendations.md with architecture design

**Checkpoint**: Research complete - CORE + ADDENDUM architecture validated

---

## Phase 2: Core Template Creation

- [x] T010 Create templates/core/ directory
- [x] T011 Create spec-core.md (~93 lines)
  - Requirement: REQ-001
  - Files: templates/core/spec-core.md
- [x] T012 [P] Create plan-core.md (~101 lines)
  - Files: templates/core/plan-core.md
- [x] T013 [P] Create tasks-core.md (~66 lines)
  - Files: templates/core/tasks-core.md
- [x] T014 [P] Create impl-summary-core.md (~58 lines)
  - Files: templates/core/impl-summary-core.md

**Checkpoint**: Core foundation ready (318 LOC total)

---

## Phase 3: Level 2 Addendum Creation (+Verify)

- [x] T020 Create templates/addendum/level2-verify/ directory
- [x] T021 Create spec-level2.md (49 lines)
  - Requirement: REQ-002
  - Files: templates/addendum/level2-verify/spec-level2.md
- [x] T022 [P] Create plan-level2.md (51 lines)
  - Files: templates/addendum/level2-verify/plan-level2.md
- [x] T023 [P] Create checklist.md (84 lines)
  - Files: templates/addendum/level2-verify/checklist.md

**Checkpoint**: L2 verification addendum complete (184 LOC)

---

## Phase 4: Level 3 Addendum Creation (+Arch)

- [x] T030 Create templates/addendum/level3-arch/ directory
- [x] T031 Create spec-level3.md (67 lines)
  - Requirement: REQ-002
  - Files: templates/addendum/level3-arch/spec-level3.md
- [x] T032 [P] Create plan-level3.md (72 lines)
  - Files: templates/addendum/level3-arch/plan-level3.md
- [x] T033 [P] Create decision-record.md (81 lines)
  - Files: templates/addendum/level3-arch/decision-record.md

**Checkpoint**: L3 architecture addendum complete (220 LOC)

---

## Phase 5: Level 3+ Addendum Creation (+Govern)

- [x] T040 Create templates/addendum/level3plus-govern/ directory
- [x] T041 Create spec-level3plus.md (65 lines)
  - Requirement: REQ-002
  - Files: templates/addendum/level3plus-govern/spec-level3plus.md
- [x] T042 [P] Create plan-level3plus.md (65 lines)
  - Files: templates/addendum/level3plus-govern/plan-level3plus.md
- [x] T043 [P] Create checklist-extended.md (60 lines)
  - Files: templates/addendum/level3plus-govern/checklist-extended.md

**Checkpoint**: L3+ governance addendum complete (190 LOC)

---

## Phase 6: Template Composition

- [x] T050 Regenerate level_1/ templates (Core only)
  - Requirement: REQ-003
  - Files: templates/level_1/*.md (4 files, 332 LOC)
- [x] T051 [P] Regenerate level_2/ templates (Core + L2)
  - Files: templates/level_2/*.md (5 files, 523 LOC)
- [x] T052 [P] Regenerate level_3/ templates (Core + L2 + L3)
  - Files: templates/level_3/*.md (6 files, 767 LOC)
- [x] T053 [P] Regenerate level_3+/ templates (All addendums)
  - Files: templates/level_3+/*.md (6 files, 845 LOC)

**Checkpoint**: All composed templates verified

---

## Phase 7: Configuration Updates

- [x] T060 Update parallel_dispatch_config.md
  - Requirement: REQ-005, REQ-006
  - Files: assets/parallel_dispatch_config.md
  - Added: Workstream notation, tiered creation architecture
- [x] T061 [P] Update create.sh script documentation
  - Files: scripts/spec/create.sh
  - Added: CORE + ADDENDUM header, updated help text
- [x] T062 [P] Update SKILL.md to v1.8.0
  - Requirement: REQ-007
  - Files: SKILL.md
  - Added: Template architecture section, level value scaling
- [x] T063 [P] Update level_specifications.md
  - Requirement: REQ-008
  - Files: references/templates/level_specifications.md
  - Added: Template path updates, architecture overview

**Checkpoint**: Documentation complete

---

## Phase 8: Verification

- [x] T070 Verify core template line counts
  - Expected: ~270 LOC | Actual: 318 LOC
- [x] T071 [P] Verify level differentiation
  - L1≠L2≠L3≠L3+ confirmed
- [x] T072 [P] Verify composed template line counts
  - L1: 332 | L2: 523 | L3: 767 | L3+: 845

**Checkpoint**: Implementation verified

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Checklist.md items verified
- [x] Documentation synchronized

---

## Summary

| Phase | Tasks | Completed |
|-------|-------|-----------|
| 1 - Research | 5 | 5 |
| 2 - Core | 5 | 5 |
| 3 - L2 Addendum | 4 | 4 |
| 4 - L3 Addendum | 4 | 4 |
| 5 - L3+ Addendum | 4 | 4 |
| 6 - Composition | 4 | 4 |
| 7 - Configuration | 4 | 4 |
| 8 - Verification | 3 | 3 |
| **Total** | **33** | **33** |

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`
