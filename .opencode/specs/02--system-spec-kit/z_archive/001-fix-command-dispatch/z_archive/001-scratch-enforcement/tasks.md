---
title: "Tasks: SpecKit Scratch Enforcement - Implementation Breakdown [001-scratch-enforcement/tasks]"
description: "Task list for scratch folder enforcement implementation - documentation-based enforcement for OpenCode compatibility."
trigger_phrases:
  - "tasks"
  - "speckit"
  - "scratch"
  - "enforcement"
  - "implementation"
  - "001"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: SpecKit Scratch Enforcement - Implementation Breakdown

Task list for scratch folder enforcement implementation - documentation-based enforcement for OpenCode compatibility.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.1 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: speckit, scratch-enforcement, documentation
- **Priority**: P1-high - core functionality improvement

### Input
Analysis from parallel sub-agents + spec.md requirements

### Prerequisites
- **Required**: `plan.md`, `spec.md`
- **Optional**: Existing AGENTS.md, templates, commands

### Organization
Tasks grouped by documentation layer (4-layer enforcement strategy).

---

## 2. CONVENTIONS

### Task Format
```text
- [x] T### [P?] Description | Status: Done | Evidence: [file]
```

### Commit Message Hint
```text
tasks(004-speckit): scratch enforcement implementation
```

---

## WORKING FILES LOCATION

**IMPORTANT:** During implementation, use appropriate directories:

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test data, draft code | Temporary (git-ignored) |
| `memory/` | Context to preserve across sessions | Permanent (git-tracked) |
| Root | Final documentation only | Permanent (git-tracked) |

---

## 3. TASK GROUPS BY PHASE

### Phase 1: Analysis (Completed)

**Purpose**: Understand current state and gaps

- [x] T001 Dispatch 8 parallel analysis agents | Status: Done | Evidence: Session output
- [x] T002 Identify enforcement gaps in AGENTS.md | Status: Done | Evidence: spec.md Section 5
- [x] T003 Audit root folder for violations | Status: Done | Evidence: Root clean
- [x] T004 Review template scratch references | Status: Done | Evidence: Only plan.md had scratch

**Checkpoint**: Analysis complete - identified 4-layer enforcement strategy

---

### Phase 2: P0 - AGENTS.md Updates (Completed)

**Purpose**: Primary enforcement layer - agents read at session start

- [x] T005 [P0] Add critical rule about scratch folders (after line 139) | Status: Done | Evidence: AGENTS.md:140
- [x] T006 [P0] Add failure pattern #15 "Root Folder Pollution" | Status: Done | Evidence: AGENTS.md:253
- [x] T007 [P0] Add mandatory rules block after "scratch/ Best Practices" | Status: Done | Evidence: AGENTS.md:412-418

**Checkpoint**: AGENTS.md enforcement complete

---

### Phase 3: P1 - Template Updates (Completed)

**Purpose**: Explicit guidance in all templates

- [x] T008 [P1] Add "12. WORKING FILES" section to spec.md template | Status: Done | Evidence: .opencode/speckit/templates/spec.md
- [x] T009 [P1] Add "WORKING FILES LOCATION" section to tasks.md template | Status: Done | Evidence: .opencode/speckit/templates/tasks.md
- [x] T010 [P1] Add "FILE ORGANIZATION" section to research.md template | Status: Done | Evidence: .opencode/speckit/templates/research.md
- [x] T011 [P1] Add CHK036-038 items to checklist.md template | Status: Done | Evidence: .opencode/speckit/templates/checklist.md

**Checkpoint**: Template guidance complete

---

### Phase 4: P2 - Command Updates (Completed)

**Purpose**: Reinforce in slash command outputs

- [x] T012 [P2] Add scratch guidance to complete.md command | Status: Done | Evidence: .opencode/commands/spec_kit/complete.md
- [x] T013 [P2] Add scratch guidance to implement.md command | Status: Done | Evidence: .opencode/commands/spec_kit/implement.md
- [x] T014 [P2] Add scratch guidance to research.md command | Status: Done | Evidence: .opencode/commands/spec_kit/research.md

**Checkpoint**: Command guidance complete

---

### Phase 5: Skill Updates (Completed)

**Purpose**: Update workflows-spec-kit SKILL.md

- [x] T015 [P1] Add enforcement rules to scratch directory section | Status: Done | Evidence: SKILL.md:379-392
- [x] T016 [P1] Add ALWAYS rule #11 (scratch placement) | Status: Done | Evidence: SKILL.md:633-637
- [x] T017 [P1] Add NEVER rule #8 (no root temp files) | Status: Done | Evidence: SKILL.md:671-675

**Checkpoint**: Skill documentation complete

---

### Phase 6: Spec Folder Completion (Completed)

**Purpose**: Complete spec folder documentation

- [x] T018 Create tasks.md | Status: Done | Evidence: This file
- [x] T019 Create checklist.md with verification items | Status: Done | Evidence: .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/001-scratch-enforcement/checklist.md
- [x] T020 Create memory summary file | Status: Done | Evidence: .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/001-scratch-enforcement/memory/

---

## 4. VALIDATION CHECKLIST

### Code Quality
- [x] All changes follow existing patterns
- [x] No breaking changes to existing functionality
- [x] Clear and consistent formatting

### Documentation
- [x] AGENTS.md updated with 3 additions
- [x] 4 templates updated with scratch guidance
- [x] 3 commands updated with scratch notes
- [x] SKILL.md updated with enforcement rules

### Review & Sign-off
- [x] Final review of all changes | Status: Done | Evidence: 8-agent parallel verification
- [x] Verify CHK036-038 appear in checklist template | Status: Done | Evidence: .opencode/speckit/templates/checklist.md:97-105
- [x] Confirm OpenCode compatibility notes present | Status: Done | Evidence: 27 OpenCode mentions verified

---

## 5. SUMMARY

**Total Tasks**: 20
**Completed**: 20
**Remaining**: 0

**Files Modified**:
- AGENTS.md (3 additions)
- .opencode/speckit/templates/spec.md
- .opencode/speckit/templates/tasks.md
- .opencode/speckit/templates/research.md
- .opencode/speckit/templates/checklist.md
- .opencode/commands/spec_kit/complete.md
- .opencode/commands/spec_kit/implement.md
- .opencode/commands/spec_kit/research.md
- .opencode/skills/workflows-spec-kit/SKILL.md
