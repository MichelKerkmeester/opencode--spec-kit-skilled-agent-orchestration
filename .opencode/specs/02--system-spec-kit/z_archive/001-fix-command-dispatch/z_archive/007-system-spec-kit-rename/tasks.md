---
title: "Tasks: workflows-spec-kit → system-spec-kit Rename [007-system-spec-kit-rename/tasks]"
description: "tasks document for 007-system-spec-kit-rename."
trigger_phrases:
  - "tasks"
  - "workflows"
  - "spec"
  - "kit"
  - "system"
  - "007"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: workflows-spec-kit → system-spec-kit Rename

<!-- ANCHOR:notation -->
## Overview

| Field | Value |
|-------|-------|
| **Spec Reference** | [spec.md](./spec.md) |
| **Plan Reference** | [plan.md](./plan.md) |
| **Total Tasks** | 37 |

---

<!-- /ANCHOR:notation -->
## Phase 1: Directory Rename

### Task 1.1: Rename Skill Folder
- **Command**: `mv .opencode/skills/workflows-spec-kit .opencode/skills/system-spec-kit`
- **Verification**: `ls .opencode/skills/ | grep spec-kit`
- **Expected**: Only `system-spec-kit` exists
- **Status**: [ ] Pending

### Task 1.2: Verify Directory Contents
- **Command**: `ls -la .opencode/skills/system-spec-kit/`
- **Expected**: All 30 files present (SKILL.md, assets/, checklists/, checklist-evidence/, references/, scripts/, templates/)
- **Status**: [ ] Pending

---

## Phase 2: Internal Skill Updates

### Task 2.1: Update SKILL.md
- **File**: `.opencode/skills/system-spec-kit/SKILL.md`
- **References**: 14
- **Changes**:
  - [ ] Line 2: `name: workflows-spec-kit` → `name: system-spec-kit`
  - [ ] Line 52: Template path
  - [ ] Lines 217-268: Template references
  - [ ] Line 286: Assets path
  - [ ] Line 358: Templates location
  - [ ] Lines 636, 685, 756: Copy instructions
- **Status**: [ ] Pending

### Task 2.2: Update references/template_guide.md
- **File**: `.opencode/skills/system-spec-kit/references/template_guide.md`
- **References**: 18
- **Pattern**: `.opencode/skills/workflows-spec-kit/templates/` → `.opencode/skills/system-spec-kit/templates/`
- **Lines**: 20, 50-52, 100, 137, 142-143, 278, 338, 380, 406, 433, 464, 498, 513, 539, 689
- **Status**: [ ] Pending

### Task 2.3: Update references/level_specifications.md
- **File**: `.opencode/skills/system-spec-kit/references/level_specifications.md`
- **References**: 14
- **Lines**: 85-88, 158-162, 235-241
- **Status**: [ ] Pending

### Task 2.4: Update references/quick_reference.md
- **File**: `.opencode/skills/system-spec-kit/references/quick_reference.md`
- **References**: 12
- **Lines**: 38-65, 266, 310, 355-358, 396-417
- **Status**: [ ] Pending

### Task 2.5: Update references/path_scoped_rules.md
- **File**: `.opencode/skills/system-spec-kit/references/path_scoped_rules.md`
- **References**: 2
- **Lines**: 48, 111
- **Status**: [ ] Pending

### Task 2.6: Update assets/template_mapping.md
- **File**: `.opencode/skills/system-spec-kit/assets/template_mapping.md`
- **References**: 17
- **Lines**: 9-50, 175, 208-223
- **Status**: [ ] Pending

### Task 2.7: Update assets/level_decision_matrix.md
- **File**: `.opencode/skills/system-spec-kit/assets/level_decision_matrix.md`
- **References**: Check for any refs
- **Status**: [ ] Pending

### Task 2.8: Update scripts/create-spec-folder.sh
- **File**: `.opencode/skills/system-spec-kit/scripts/create-spec-folder.sh`
- **References**: 2
- **Line 321**: `TEMPLATES_DIR="$REPO_ROOT/.opencode/skills/workflows-spec-kit/templates"` → `TEMPLATES_DIR="$REPO_ROOT/.opencode/skills/system-spec-kit/templates"`
- **Status**: [ ] Pending

### Task 2.9: Update templates/spec.md
- **File**: `.opencode/skills/system-spec-kit/templates/spec.md`
- **References**: Check for self-references
- **Status**: [ ] Pending

### Task 2.10: Update templates/plan.md
- **File**: `.opencode/skills/system-spec-kit/templates/plan.md`
- **References**: Line 348
- **Status**: [ ] Pending

### Task 2.11: Update templates/tasks.md
- **File**: `.opencode/skills/system-spec-kit/templates/tasks.md`
- **References**: Line 298
- **Status**: [ ] Pending

### Task 2.12: Update templates/checklist.md
- **File**: `.opencode/skills/system-spec-kit/templates/checklist.md`
- **References**: Check for copy command examples
- **Status**: [ ] Pending

### Task 2.13: Update remaining templates
- **Files**: decision-record.md, research.md, research-spike.md, handover.md, debug-delegation.md
- **References**: Check each for path references
- **Status**: [ ] Pending

---

## Phase 3: External References

### Task 3.1: Update AGENTS.md
- **File**: `AGENTS.md`
- **References**: 13
- **Changes**:
  - [ ] Line 225: Skill reference
  - [ ] Line 268: Full details reference
  - [ ] Lines 341, 352, 370: Path references
  - [ ] Lines 809-812: Skills XML block
- **Status**: [ ] Pending

### Task 3.2: Update AGENTS (Universal).md
- **File**: `AGENTS (Universal).md`
- **References**: 17
- **Changes**:
  - [ ] Lines 240, 311, 322, 339: Path references
  - [ ] Lines 712-715: Skills XML block
- **Status**: [ ] Pending

### Task 3.3: Update spec_kit_complete_auto.yaml
- **File**: `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- **References**: 15
- **Lines**: 149-161, 637, 668, 710, 848, 850, 937
- **Status**: [ ] Pending

### Task 3.4: Update spec_kit_complete_confirm.yaml
- **File**: `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`
- **References**: 13
- **Lines**: 119-131, 517, 604, 727, 801
- **Status**: [ ] Pending

### Task 3.5: Update spec_kit_plan_auto.yaml
- **File**: `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
- **References**: 12
- **Lines**: 118-130, 414, 478, 593
- **Status**: [ ] Pending

### Task 3.6: Update spec_kit_plan_confirm.yaml
- **File**: `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`
- **References**: 12
- **Lines**: 118-130, 439, 517, 636
- **Status**: [ ] Pending

### Task 3.7: Update spec_kit_research_auto.yaml
- **File**: `.opencode/command/spec_kit/assets/spec_kit_research_auto.yaml`
- **References**: 10
- **Lines**: 118-128, 585, 627, 651
- **Status**: [ ] Pending

### Task 3.8: Update spec_kit_research_confirm.yaml
- **File**: `.opencode/command/spec_kit/assets/spec_kit_research_confirm.yaml`
- **References**: 10
- **Lines**: 118-128, 646, 693, 727
- **Status**: [ ] Pending

### Task 3.9: Update spec_kit_implement_auto.yaml
- **File**: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **References**: 5
- **Lines**: 138-143, 352
- **Status**: [ ] Pending

### Task 3.10: Update spec_kit_implement_confirm.yaml
- **File**: `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml`
- **References**: 5
- **Lines**: 138-143, 385
- **Status**: [ ] Pending

### Task 3.11: Update spec_kit_resume_auto.yaml
- **File**: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`
- **References**: 1 (command reference, not path - may not need change)
- **Status**: [ ] Pending

### Task 3.12: Update spec_kit_resume_confirm.yaml
- **File**: `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml`
- **References**: 1 (command reference, not path - may not need change)
- **Status**: [ ] Pending

### Task 3.13: Update create_skill.yaml
- **File**: `.opencode/command/create/assets/create_skill.yaml`
- **References**: 2
- **Lines**: 231-232
- **Status**: [ ] Pending

### Task 3.14: Update create_folder_readme.yaml
- **File**: `.opencode/command/create/assets/create_folder_readme.yaml`
- **References**: 1
- **Line**: 195
- **Status**: [ ] Pending

### Task 3.15: Update workflows-memory/SKILL.md
- **File**: `.opencode/skills/workflows-memory/SKILL.md`
- **References**: 1
- **Line**: 739 (Related Skills table)
- **Status**: [ ] Pending

### Task 3.16: Update workflows-memory/references/*.md
- **Files**:
  - `spec_folder_detection.md` (lines 147, 338)
  - `semantic_memory.md` (line 596)
  - `alignment_scoring.md` (line 203)
  - `troubleshooting.md` (line 356)
- **References**: 6
- **Status**: [ ] Pending

### Task 3.17: Update sk-doc files
- **Files**:
  - `SKILL.md` (line 449)
  - `references/quick_reference.md` (line 188)
  - `assets/command_template.md` (line 295)
- **References**: 3
- **Status**: [ ] Pending

### Task 3.18: Update cli-codex/SKILL.md
- **File**: `.opencode/skills/cli-codex/SKILL.md`
- **References**: 2
- **Lines**: 584-587
- **Status**: [ ] Pending

### Task 3.19: Update cli-gemini/SKILL.md
- **File**: `.opencode/skills/cli-gemini/SKILL.md`
- **References**: 2
- **Lines**: 478-481
- **Status**: [ ] Pending

### Task 3.20: Update install guide
- **File**: `z_install_guides/PLUGIN - Opencode Skills.md`
- **References**: 1
- **Line**: 370
- **Status**: [ ] Pending

---

## Phase 4: Verification

### Task 4.1: Grep verification - .opencode/skills/
- **Command**: `grep -r "workflows-spec-kit" .opencode/skills/`
- **Expected**: Zero matches
- **Status**: [ ] Pending

### Task 4.2: Grep verification - AGENTS files
- **Command**: `grep -r "workflows-spec-kit" AGENTS*.md`
- **Expected**: Zero matches
- **Status**: [ ] Pending

### Task 4.3: Grep verification - Command YAMLs
- **Command**: `grep -r "workflows-spec-kit" .opencode/command/`
- **Expected**: Zero matches
- **Status**: [ ] Pending

### Task 4.4: Grep verification - Install guides
- **Command**: `grep -r "workflows-spec-kit" z_install_guides/`
- **Expected**: Zero matches
- **Status**: [ ] Pending

### Task 4.5: Functional test - Skill invocation
- **Test**: `openskills read system-spec-kit`
- **Expected**: Skill content loads successfully
- **Status**: [ ] Pending

### Task 4.6: Functional test - Template access
- **Test**: Read all 9 templates from `.opencode/skills/system-spec-kit/templates/`
- **Expected**: All templates accessible
- **Status**: [ ] Pending

### Task 4.7: Functional test - Script execution
- **Test**: `bash .opencode/skills/system-spec-kit/scripts/create-spec-folder.sh --help`
- **Expected**: Help text displays without errors
- **Status**: [ ] Pending

---

## Phase 5: Cleanup

### Task 5.1: Save context
- **Action**: Use `/memory:save` or save context manually
- **Location**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/007-system-spec-kit-rename/memory`
- **Status**: [ ] Pending

### Task 5.2: Document completion
- **Action**: Update tasks.md with completion status
- **Status**: [ ] Pending

---

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Directory Rename | 2 | Pending |
| Phase 2: Internal Skill Updates | 13 | Pending |
| Phase 3: External References | 20 | Pending |
| Phase 4: Verification | 7 | Pending |
| Phase 5: Cleanup | 2 | Pending |
| **TOTAL** | **44** | **Pending** |
