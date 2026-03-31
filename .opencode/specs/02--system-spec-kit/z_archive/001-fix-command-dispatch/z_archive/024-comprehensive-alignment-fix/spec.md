---
title: "Spec-Kit Compreh [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/024-comprehensive-alignment-fix/spec]"
description: "A comprehensive audit identified 49 issues across the Spec-Kit command/skill ecosystem. These issues fall into categories of"
trigger_phrases:
  - "spec"
  - "kit"
  - "comprehensive"
  - "alignment"
  - "fix"
  - "024"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec-Kit Comprehensive Alignment Fix

<!-- ANCHOR:metadata -->
## Problem Statement

A comprehensive audit identified **49 issues** across the Spec-Kit command/skill ecosystem. These issues fall into categories of:

- Command definitions with syntax errors
- Scripts referenced at incorrect paths
- AGENTS.md containing outdated guidance
- Templates not matching actual structure
- Documentation contradictions

This spec addresses the **16 prioritized fixes** organized by severity:
- **P0 Critical**: 4 issues (blocking functionality)
- **P1 High**: 8 issues (significant impact)
- **P2 Medium**: 4 issues (quality improvements)

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:scope -->
## Scope

### In Scope

1. **P0 Critical Fixes**
   - YAML syntax errors in command definitions
   - Script path corrections
   - Missing command implementation
   - Documentation contradiction resolution

2. **P1 High Priority Fixes**
   - Bash version compatibility
   - JSON escaping issues
   - AGENTS.md section updates
   - Template alignment with actual structure
   - Command parameter type fixes
   - Skill reference updates
   - Error handling path corrections
   - Validation script fixes

3. **P2 Medium Priority Fixes**
   - Glob tool documentation updates
   - Obsolete template marker removal
   - Documentation cross-reference updates
   - Deprecated instruction cleanup

### Out of Scope

- New feature development
- Workflow additions or extensions
- Refactoring beyond what's needed for fixes
- Performance optimizations
- UI/UX improvements
<!-- /ANCHOR:scope -->

<!-- ANCHOR:success-criteria -->
## Success Criteria

- [ ] All 4 P0 issues resolved and verified
- [ ] All 8 P1 issues resolved and verified
- [ ] All 4 P2 issues resolved and verified
- [ ] Commands execute without errors
- [ ] AGENTS.md accurately reflects current system
- [ ] Templates match actual folder structures
- [ ] No documentation contradictions remain
<!-- /ANCHOR:success-criteria -->

## References

- Original audit: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/023-path-scoped-rules` (audit results)
- Command definitions: `.opencode/commands/`
- Skill definitions: `.opencode/skill/`
- AGENTS.md: Project root
