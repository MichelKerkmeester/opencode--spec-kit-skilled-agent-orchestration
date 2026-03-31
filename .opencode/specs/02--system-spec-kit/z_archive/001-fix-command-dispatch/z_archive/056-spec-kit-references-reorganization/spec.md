---
title: "system-sp [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/056-spec-kit-references-reorganization/spec]"
description: "The system-spec-kit skill's references/ folder currently has a flat structure with all reference files at the root level. This makes navigation difficult, slows down discovery o..."
trigger_phrases:
  - "system"
  - "spec"
  - "kit"
  - "references"
  - "reorganization"
  - "056"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# system-spec-kit References Reorganization

<!-- ANCHOR:metadata -->
## Problem Statement

The `system-spec-kit` skill's `references/` folder currently has a flat structure with all reference files at the root level. This makes navigation difficult, slows down discovery of relevant documentation, and creates inconsistency with other skills like `workflows-code` that use organized sub-folder structures.

<!-- /ANCHOR:metadata -->
## Goals

1. **Organize references into logical sub-folders** - Group related files by domain/purpose
2. **Improve SKILL.md routing** - Update routing section with clearer navigation to organized resources
3. **Apply consistent patterns** - Follow the same organizational approach used in workflows-code skill improvement
4. **Enhance discoverability** - Make it easier to find relevant documentation quickly

<!-- ANCHOR:scope -->
## Scope

### In Scope

- Reorganizing `references/` files into logical sub-folders
- Updating SKILL.md routing section with new paths
- Updating any internal path references within moved files
- Documenting the new structure

### Out of Scope

- Modifying core skill functionality
- Changing scripts/ folder organization
- Altering templates/ folder structure
- Modifying the skill's constitutional files
<!-- /ANCHOR:scope -->

<!-- ANCHOR:success-criteria -->
## Success Criteria

1. All reference files organized into logical sub-folders
2. SKILL.md routing updated with accurate paths to all resources
3. No broken links after reorganization
4. Clear, intuitive sub-folder naming that reflects content domains
5. Consistent with patterns established in workflows-code skill
<!-- /ANCHOR:success-criteria -->

## Technical Context

**Target Skill:** `.opencode/skill/system-spec-kit/`

**Current Structure:** Flat `references/` folder with multiple markdown files

**Pattern Reference:** `workflows-code` skill reorganization (spec 001-workflows-code-codebase-alignment)

## Dependencies

- None - self-contained reorganization within system-spec-kit skill

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Broken SKILL.md links | Medium | High | Systematic path update verification |
| Missed file references | Low | Medium | Grep for old paths after reorganization |
| User confusion during transition | Low | Low | Clear documentation of new structure |
