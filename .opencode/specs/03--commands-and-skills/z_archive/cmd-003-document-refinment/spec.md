---
title: "Command Document Refinement [003-command-document-refinment/spec]"
description: "The 21 command documentation files in .opencode/command/ have accumulated inconsistencies that reduce readability and maintainability"
trigger_phrases:
  - "command"
  - "document"
  - "refinement"
  - "spec"
  - "003"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Command Document Refinement

<!-- ANCHOR:problem -->
## Problem Statement

The 21 command documentation files in `.opencode/command/` have accumulated inconsistencies that reduce readability and maintainability:

1. **Half-step numbering**: 10 files use decimal sub-steps (1.5, 2.5, 3.1, 3.2) instead of full sequential steps
2. **Emoji inconsistency**: Same semantic purpose uses different emojis across namespaces (📋 vs 🎯 for PURPOSE)
3. **Structural variation**: Section order, heading levels, and numbering styles vary between files
4. **Template drift**: The command template doesn't reflect actual practice

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## Scope

### In Scope
- All 21 .md files in `.opencode/command/` and subdirectories
- The command template at `.opencode/skill/sk-doc/assets/command_template.md`
- Step numbering standardization
- Emoji vocabulary unification
- Layout/structure consistency

### Out of Scope
- Content changes (only formatting/structure)
- New command creation
- Workflow logic changes

<!-- /ANCHOR:scope -->

<!-- ANCHOR:success-criteria -->
## Success Criteria

1. All 21 command files use full integer steps only (1, 2, 3, 4...)
2. All files use unified emoji vocabulary (see plan.md)
3. All files follow standardized section structure
4. Template updated to enforce these standards
5. No regressions in command functionality

<!-- /ANCHOR:success-criteria -->

## Files Affected

| Namespace | Files | Issues |
|-----------|-------|--------|
| spec_kit/ | 8 | Half-steps, emoji variance |
| create/ | 5 | Half-steps, emoji variance |
| search/ | 3 | Structure variance |
| memory/ | 3 | Minor structure variance |
| prompt/ | 1 | Minor structure variance |
| Template | 1 | Needs update |

<!-- ANCHOR:risks -->
## Risk Assessment

- **Low risk**: Changes are formatting-only, no logic changes
- **Mitigation**: Validate each file after changes

<!-- /ANCHOR:risks -->
