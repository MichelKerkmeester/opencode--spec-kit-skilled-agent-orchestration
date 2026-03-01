---
title: "Plan: Remove Git Branch Logic from YAML Commands [007-remove-git-branch-logic/plan]"
description: "Dispatch 4 parallel Opus agents, each handling 2 YAML files (auto + confirm pairs)"
trigger_phrases:
  - "plan"
  - "remove"
  - "git"
  - "branch"
  - "logic"
  - "007"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Plan: Remove Git Branch Logic from YAML Commands

<!-- ANCHOR:summary -->
## Approach

Dispatch 4 parallel Opus agents, each handling 2 YAML files (auto + confirm pairs):

| Agent | Files | Scope |
|-------|-------|-------|
| 1 | spec_kit_complete_*.yaml | Full removal (inputs, defaults, activities, outputs, summary) |
| 2 | spec_kit_plan_*.yaml | Full removal (inputs, defaults, activities, outputs) |
| 3 | spec_kit_research_*.yaml | Partial removal (inputs, defaults only) |
| 4 | spec_kit_implement_*.yaml | Partial removal (inputs, defaults, summary) |
<!-- /ANCHOR:summary -->

<!-- ANCHOR:phases -->
## Patterns to Remove

### 1. User Inputs Section
```yaml
# REMOVE entire git_branch block:
  git_branch: |
    [GIT_BRANCH]
    Git branch name...
```

### 2. Defaults Section
```yaml
# REMOVE this line:
    git_branch_empty: "Auto-create feature-{NNN}..."
```

### 3. Activities (plan/complete only)
```yaml
# REMOVE these lines:
    - Generate concise short name for branch
    - Check for existing branches
    - Fetch all remote branches for latest information
```

### 4. Outputs (plan/complete only)
```yaml
# REMOVE this line:
    - feature_branch: created
```

### 5. Step References (complete only)
```yaml
# REMOVE this line:
    git_branch: "[GIT_BRANCH] → auto-create if empty"
```

### 6. Summary Sections (implement/complete only)
```yaml
# REMOVE this line from required_sections:
      - feature_branch_name
```
<!-- /ANCHOR:phases -->

## Verification

After edits:
1. `grep -r "git_branch" .opencode/command/spec_kit/assets/` = 0 matches
2. `grep -r "feature_branch" .opencode/command/spec_kit/assets/` = 0 matches
3. YAML syntax validation passes
