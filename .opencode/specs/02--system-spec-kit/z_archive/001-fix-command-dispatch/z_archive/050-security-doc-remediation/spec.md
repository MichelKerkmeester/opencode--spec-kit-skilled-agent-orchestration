---
title: "Security & Documentation Remediation [050-security-doc-remediation/spec]"
description: "Security audit of system-spec-kit identified 4 medium-severity and 5 low-severity issues. Additionally, documentation gaps exist from changes made in 048-system-analysis and 049..."
trigger_phrases:
  - "security"
  - "documentation"
  - "remediation"
  - "spec"
  - "050"
importance_tier: "important"
contextType: "decision"
---
# Security & Documentation Remediation

## Metadata
- **Created:** 2024-12-31
- **Status:** In Progress
- **Level:** 2
- **Parent:** 003-memory-and-spec-kit

## Problem Statement

Security audit of system-spec-kit identified 4 medium-severity and 5 low-severity issues. Additionally, documentation gaps exist from changes made in 048-system-analysis and 049-system-analysis-bugs that need to be addressed.

## Scope

### Security Fixes (Phase 1)
1. **P0**: Path validation on CLI input in `generate-context.js`
2. **P1**: Path validation on DB-stored file paths in `context-server.js`
3. **P2**: Input length limits on MCP handler parameters

### Documentation Updates (Phase 2)
1. Update embedding dimension references (dynamic, not hardcoded 768)
2. Add `dryRun` parameter to `memory_delete` documentation
3. Add `includeConstitutional` parameter to `memory_index_scan` documentation
4. Add new validation rules to script inventories

## Files Affected

### Security
- `.opencode/skill/system-spec-kit/scripts/generate-context.js`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.js`

### Documentation
- `.opencode/skill/system-spec-kit/README.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/install_guides/MCP/MCP - Spec Kit Memory.md`

## Success Criteria

1. All security fixes pass verification
2. Existing functionality unaffected (memory_search, generate-context.js work correctly)
3. Documentation accurately reflects current feature set
4. No regression in MCP server operation
