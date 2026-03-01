---
title: "Spec 007: Remove Git Branch Logic from YAML Commands [007-remove-git-branch-logic/spec]"
description: "Remove all git branch management logic from spec_kit YAML command assets. The SpecKit workflow should focus on spec folder management only, not git branch creation/management."
trigger_phrases:
  - "spec"
  - "007"
  - "remove"
  - "git"
  - "branch"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 1 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Spec 007: Remove Git Branch Logic from YAML Commands

<!-- ANCHOR:metadata -->
## Overview

Remove all git branch management logic from spec_kit YAML command assets. The SpecKit workflow should focus on spec folder management only, not git branch creation/management.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:scope -->
## Scope

### In Scope
- Remove `git_branch` user input fields
- Remove `git_branch_empty` defaults
- Remove branch-related activities (create, check, fetch branches)
- Remove `feature_branch` outputs
- Remove `feature_branch_name` from implementation summary sections

### Out of Scope
- Flowchart "branch" references (decision tree branches, not git)
- Git commands in other contexts (commit, status, etc.)
- Files outside `.opencode/command/spec_kit/assets/`
<!-- /ANCHOR:scope -->

## Files to Modify

| File | Patterns to Remove |
|------|-------------------|
| spec_kit_complete_auto.yaml | git_branch input, defaults, activities, outputs, summary |
| spec_kit_complete_confirm.yaml | git_branch input, defaults, activities, outputs, summary |
| spec_kit_plan_auto.yaml | git_branch input, defaults, activities, outputs |
| spec_kit_plan_confirm.yaml | git_branch input, defaults, activities, outputs |
| spec_kit_research_auto.yaml | git_branch input, defaults |
| spec_kit_research_confirm.yaml | git_branch input, defaults |
| spec_kit_implement_auto.yaml | git_branch input, defaults, summary |
| spec_kit_implement_confirm.yaml | git_branch input, defaults, summary |

<!-- ANCHOR:success-criteria -->
## Success Criteria

1. No `git_branch` user input fields remain in spec_kit YAMLs
2. No `feature_branch` outputs or activities remain
3. YAML files remain syntactically valid
4. Flowchart "branch" references preserved (not git-related)
<!-- /ANCHOR:success-criteria -->

## Documentation Level

**Level 1** (Baseline) - Simple removal task, <100 LOC changes per file
