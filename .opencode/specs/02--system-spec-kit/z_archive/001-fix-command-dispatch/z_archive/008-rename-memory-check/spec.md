---
title: "Spec: Rename /memory Command to /memory:check [008-rename-memory-check/spec]"
description: "Rename the unified memory dashboard command from /memory to /memory:check and update all references across the codebase."
trigger_phrases:
  - "spec"
  - "rename"
  - "memory"
  - "command"
  - "008"
importance_tier: "important"
contextType: "decision"
---
# Spec: Rename `/memory` Command to `/memory:check`

## Overview
Rename the unified memory dashboard command from `/memory` to `/memory:check` and update all references across the codebase.

## User Story
As a developer, I want the memory dashboard command renamed from `/memory` to `/memory:check` so that the command naming is more explicit and distinguishable from other memory-related commands.

## Requirements

### Primary Changes
1. **File Rename**: `.opencode/command/memory/memory.md` → `.opencode/command/memory/check.md`
2. **Reference Updates**: All invocations of `/memory` (dashboard) must become `/memory:check`

### Scope
| Category | Files | Change Type |
|----------|-------|-------------|
| Primary Rename | 1 | File rename + internal updates |
| Command Folder | 2 | Reference updates |
| Skills Folder | 1-2 | Reference updates |
| MCP Server Docs | 2 | Reference updates |

### Constraints

**MUST PRESERVE (unchanged):**
- `/memory:save` - Separate command
- `/memory:checkpoint` - Separate command
- `memory_search()`, `memory_save()` - MCP tool names
- `specs/*/memory/*.md` - File paths
- `.opencode/memory/` - Directory paths

**MUST UPDATE:**
- `/memory` → `/memory:check`
- `/memory "query"` → `/memory:check "query"`
- `/memory cleanup` → `/memory:check cleanup`
- `/memory triggers` → `/memory:check triggers`
- `/memory --tier:X` → `/memory:check --tier:X`

## Acceptance Criteria
- [ ] File successfully renamed to `check.md`
- [ ] All dashboard references updated (~150 line changes)
- [ ] No stale `/memory` dashboard references remain
- [ ] `/memory:save` and `/memory:checkpoint` remain unchanged
- [ ] MCP tool names remain unchanged

## Files Affected
1. `.opencode/command/memory/memory.md` → `check.md`
2. `.opencode/command/memory/save.md`
3. `.opencode/command/memory/checkpoint.md`
4. `.opencode/skills/workflows-memory/SKILL.md`
5. `.opencode/memory/mcp_server/README.md`
6. `.opencode/memory/mcp_server/INSTALL_GUIDE.md`
