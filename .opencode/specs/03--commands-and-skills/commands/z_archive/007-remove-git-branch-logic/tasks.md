---
title: "Tasks: Remove Git Branch Logic from YAML Commands [007-remove-git-branch-logic/tasks]"
description: "Files: spec_kit_complete_auto.yaml, spec_kit_complete_confirm.yaml"
trigger_phrases:
  - "tasks"
  - "remove"
  - "git"
  - "branch"
  - "logic"
  - "007"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Tasks: Remove Git Branch Logic from YAML Commands

<!-- ANCHOR:notation -->
## Task List

- [x] TASK-001: Remove git branch logic from spec_kit_complete_*.yaml (Agent 1)
- [x] TASK-002: Remove git branch logic from spec_kit_plan_*.yaml (Agent 2)
- [x] TASK-003: Remove git branch logic from spec_kit_research_*.yaml (Agent 3)
- [x] TASK-004: Remove git branch logic from spec_kit_implement_*.yaml (Agent 4)
- [x] TASK-005: Verify all git_branch and feature_branch references removed
- [x] TASK-006: Create implementation-summary.md
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Task Details

### TASK-001: spec_kit_complete_*.yaml
**Files:** spec_kit_complete_auto.yaml, spec_kit_complete_confirm.yaml
**Remove:**
- `git_branch` user input (full block)
- `git_branch_empty` default
- `git_branch` step reference
- Branch-related activities (3 lines)
- `feature_branch: created` output
- `feature_branch_name` from summary sections

### TASK-002: spec_kit_plan_*.yaml
**Files:** spec_kit_plan_auto.yaml, spec_kit_plan_confirm.yaml
**Remove:**
- `git_branch` user input (full block)
- `git_branch_empty` default
- Branch-related activities (2 lines)
- `feature_branch: created` output

### TASK-003: spec_kit_research_*.yaml
**Files:** spec_kit_research_auto.yaml, spec_kit_research_confirm.yaml
**Remove:**
- `git_branch` user input (full block)
- `git_branch_empty` default

### TASK-004: spec_kit_implement_*.yaml
**Files:** spec_kit_implement_auto.yaml, spec_kit_implement_confirm.yaml
**Remove:**
- `git_branch` user input (full block)
- `git_branch_empty` default
- `feature_branch_name` from summary sections
<!-- /ANCHOR:phase-1 -->
