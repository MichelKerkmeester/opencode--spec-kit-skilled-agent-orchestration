---
title: "Tasks: Level-Based Template Architecture [069-speckit-template-complexity/tasks]"
description: "Implementation task breakdown for complexity detection and level-based template folder system."
trigger_phrases:
  - "tasks"
  - "level"
  - "based"
  - "template"
  - "architecture"
  - "069"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Level-Based Template Architecture

Implementation task breakdown for complexity detection and level-based template folder system.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending task |
| `[x]` | Completed task |
| `[P]` | Can be done in parallel with other [P] tasks |
| `[B]` | Blocked - waiting on dependency |

---

<!-- /ANCHOR:notation -->
## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: spec-kit, complexity-detection, template-expansion
- **Priority**: P1

### Input
Design documents from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity`

### Prerequisites
- **Required**: `plan.md`, `spec.md`

---

## 2. TASK GROUPS BY PHASE

### Phase 1: Core Infrastructure Setup

**Purpose**: Create lib/complexity/ module with 5-dimension scoring

**Checkpoint**: Detection system can score task descriptions

- [ ] T001 Create config/complexity-config.jsonc with dimension weights and thresholds
- [ ] T002 Create lib/complexity/index.js with main exports
- [ ] T003 [P] Create lib/complexity/scorers/scope.js (files, LOC, systems)
- [ ] T004 [P] Create lib/complexity/scorers/risk.js (security, auth, breaking changes)
- [ ] T005 [P] Create lib/complexity/scorers/research.js (investigation, unknowns)
- [ ] T006 [P] Create lib/complexity/scorers/multi-agent.js (workstreams, coordination)
- [ ] T007 [P] Create lib/complexity/scorers/coordination.js (deps, blocking relationships)
- [ ] T008 Create lib/complexity/detector.js orchestrating all scorers (depends on T003-T007)
- [ ] T009 Create lib/complexity/classifier.js for score → level mapping
- [ ] T010 Create lib/complexity/features.js defining feature triggers

---

### Phase 2: Template Folder Selection System

**Purpose**: Create lib/expansion/ module for level-based folder selection

**Checkpoint**: Templates can be selected and copied from appropriate level folder

- [ ] T011 Create lib/expansion/index.js with main exports
- [ ] T012 Create lib/expansion/folder-selector.js for level → folder mapping
- [ ] T013 Create lib/expansion/preprocessor.js for optional variable substitution
- [ ] T014 Implement template copy utility with validation
- [ ] T015 Add fallback logic for missing level folders (use root templates)

---

### Phase 3: Level-Specific Template Creation

**Purpose**: Create pre-expanded templates for each level folder

**Checkpoint**: All level folders contain complete, valid templates

#### 3a. Level 1 Templates (Minimal)

- [ ] T016 [P] Create templates/level_1/spec.md (1-2 user stories)
- [ ] T017 [P] Create templates/level_1/plan.md (2-3 phases)
- [ ] T018 [P] Create templates/level_1/tasks.md (minimal task list)
- [ ] T019 [P] Create templates/level_1/implementation-summary.md

#### 3b. Level 2 Templates (Standard)

- [ ] T020 [P] Create templates/level_2/spec.md (2-4 user stories)
- [ ] T021 [P] Create templates/level_2/plan.md (3-5 phases)
- [ ] T022 [P] Create templates/level_2/tasks.md (standard task list)
- [ ] T023 [P] Create templates/level_2/checklist.md
- [ ] T024 [P] Create templates/level_2/implementation-summary.md

#### 3c. Level 3 Templates (Full)

- [ ] T025 [P] Create templates/level_3/spec.md (4-8 user stories)
- [ ] T026 [P] Create templates/level_3/plan.md (5-8 phases)
- [ ] T027 [P] Create templates/level_3/tasks.md (full task list)
- [ ] T028 [P] Create templates/level_3/checklist.md
- [ ] T029 [P] Create templates/level_3/decision-record.md
- [ ] T030 [P] Create templates/level_3/implementation-summary.md

#### 3d. Level 3+ Templates (Extended)

- [ ] T031 [P] Create templates/level_3+/spec.md (8-15 user stories, AI protocols)
- [ ] T032 [P] Create templates/level_3+/plan.md (8-12 phases, dependency DAG)
- [ ] T033 [P] Create templates/level_3+/tasks.md (workstreams, AI execution)
- [ ] T034 [P] Create templates/level_3+/checklist.md (extended)
- [ ] T035 [P] Create templates/level_3+/decision-record.md
- [ ] T036 [P] Create templates/level_3+/implementation-summary.md

---

### Phase 4: Validation Rules

**Purpose**: Implement level consistency validation

**Checkpoint**: All 4 validation rules working and registered

- [ ] T037 Create scripts/rules/check-complexity.sh (level consistent with content depth)
- [ ] T038 Create scripts/rules/check-section-counts.sh (section counts match level)
- [ ] T039 Create scripts/rules/check-ai-protocols.sh (AI protocol present for Level 3+)
- [ ] T040 Create scripts/rules/check-level-match.sh (level consistent across files)
- [ ] T041 Register new rules in scripts/validate-spec.sh

---

### Phase 5: CLI Tools & Integration

**Purpose**: Create CLI wrappers and integrate with existing scripts

**Checkpoint**: Full integration with create-spec-folder.sh and folder selection

- [ ] T042 Create scripts/detect-complexity.js CLI tool
- [ ] T043 Create scripts/expand-template.js CLI tool (folder selection + copy)
- [ ] T044 Add --complexity flag to scripts/create-spec-folder.sh with folder selection
- [ ] T045 Add SPECKIT_COMPLEXITY_DETECTION environment variable support
- [ ] T046 Update SKILL.md Gate 3 flow documentation

---

### Phase 6: Reference Documentation

**Purpose**: Complete documentation and testing

**Checkpoint**: All documentation complete, verification passed

- [ ] T047 Create references/templates/complexity_guide.md (with folder structure docs)
- [ ] T048 Update references/templates/level_specifications.md with Level 3+ and folder details
- [ ] T049 Create assets/complexity_decision_matrix.md
- [ ] T050 Create test fixtures in scripts/test-fixtures/069-complexity/
- [ ] T051 Run retrospective validation on specs 056-068

---

## 3. VALIDATION CHECKLIST

### Code Quality
- [ ] All JavaScript files pass linting
- [ ] Shell scripts pass shellcheck
- [ ] No console warnings or errors

### Documentation
- [ ] spec.md complete
- [ ] plan.md complete
- [ ] tasks.md complete (this file)
- [ ] checklist.md complete
- [ ] decision-record.md complete

### Review & Sign-off
- [ ] All tasks marked complete
- [ ] Retrospective validation passed (>= 85% accuracy)
- [ ] Backward compatibility verified

---

## 4. DEPENDENCY GRAPH

```
Phase 1 (Infrastructure)
  T001 ─────────────────────────────────┐
  T002 ─────────────────────────────────┤
  T003 ──┬──────────────────────────────┤
  T004 ──┤                              │
  T005 ──┤ (parallel scorers)           ├──▶ T008 ──▶ T009 ──▶ T010
  T006 ──┤                              │
  T007 ──┴──────────────────────────────┘

Phase 2 (Folder Selection)
  T011 ────────────────────────────────────┐
  T012 ────────────────────────────────────┤
  T013 ────────────────────────────────────┼──▶ T014 ──▶ T015
  └────────────────────────────────────────┘

Phase 3 (Templates) - depends on Phase 2
  Level 1: T016-T019 (parallel) ──┐
  Level 2: T020-T024 (parallel) ──┼──▶ All templates complete
  Level 3: T025-T030 (parallel) ──┤
  Level 3+: T031-T036 (parallel) ─┘

Phase 4 (Validation) - depends on Phase 3
  T037 ──┬── (parallel rules) ──┬──▶ T041
  T038 ──┤                      │
  T039 ──┤                      │
  T040 ──┴──────────────────────┘

Phase 5 (Integration) - depends on Phase 1, 2, 4
  T042 ──┬── (parallel CLI) ──┬──▶ T044 ──▶ T045 ──▶ T046
  T043 ──┴────────────────────┘

Phase 6 (Documentation) - depends on all
  T047 ──┬── (parallel docs) ──┬──▶ T050 ──▶ T051
  T048 ──┤                     │
  T049 ──┴─────────────────────┘
```

---

## 5. ESTIMATED EFFORT

| Phase | Tasks | Est. LOC | Priority |
|-------|-------|----------|----------|
| Phase 1 | T001-T010 | 600-800 | P0 |
| Phase 2 | T011-T015 | 200-300 | P0 |
| Phase 3 | T016-T036 | 1200-1800 | P1 |
| Phase 4 | T037-T041 | 200-300 | P1 |
| Phase 5 | T042-T046 | 300-400 | P1 |
| Phase 6 | T047-T051 | 200-300 | P2 |
| **Total** | **51 tasks** | **2700-3900** | |
