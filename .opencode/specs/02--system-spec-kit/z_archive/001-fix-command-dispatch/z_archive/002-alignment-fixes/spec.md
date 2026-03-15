---
title: "Memory Command Alignment Fixes [002-alignment-fixes/spec]"
description: "This spec documents the alignment fixes applied to memory command files to ensure consistency with"
trigger_phrases:
  - "memory"
  - "command"
  - "alignment"
  - "fixes"
  - "spec"
  - "002"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: CORE -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Memory Command Alignment Fixes

<!-- ANCHOR:metadata -->
## Overview

This spec documents the alignment fixes applied to memory command files to ensure consistency with:
1. Single-line box characters (─┌┐│└┘) instead of double-line (═╔╗║╚╝)
2. HOME SCREEN dashboard as the default when `/memory:search` is called without arguments
3. MCP ENFORCEMENT MATRIX in each command file showing required tool calls
4. Native MCP tool calls replacing inline bash scripts where possible

<!-- /ANCHOR:metadata -->
## User Story

**As a** developer using the memory system  
**I want** consistent UI formatting and clear MCP tool requirements  
**So that** I have a reliable, well-documented interface for managing conversation memories

## Acceptance Criteria

- [x] All box drawings use single-line characters only
- [x] `/memory:search` (no args) shows HOME SCREEN with dashboard
- [x] Each command file has an MCP ENFORCEMENT MATRIX section
- [x] `status.md` uses `memory_stats` MCP instead of bash
- [x] `triggers.md` uses `memory_list` MCP instead of bash
- [x] `cleanup.md` has MCP matrix (bash retained for complex logic)
- [x] `SKILL.md` routing diagram updated with HOME SCREEN
- [x] `AGENTS.md` updated with `memory_list`, `memory_stats`

## Scope

### In Scope
- search.md
- status.md
- triggers.md
- cleanup.md
- SKILL.md (workflows-memory)
- AGENTS.md

### Out of Scope
- save.md (no changes needed)
- checkpoint.md (separate functionality)
- Actual MCP server implementation changes

## Technical Notes

### MCP Enforcement Pattern

Each command file now includes a matrix like:
```
┌─────────────────┬─────────────────────────────┬──────────┬─────────────────┐
│ SCREEN          │ REQUIRED MCP CALLS          │ MODE     │ ON FAILURE      │
├─────────────────┼─────────────────────────────┼──────────┼─────────────────┤
│ <screen_name>   │ <tool_name>                 │ <mode>   │ <fallback>      │
└─────────────────┴─────────────────────────────┴──────────┴─────────────────┘
```

### Native MCP Tool Calls

**CRITICAL:** All MCP tools must be called directly, NEVER through Code Mode:
- ✅ `mcp__semantic_memory__memory_stats({})`
- ❌ `call_tool_chain("semantic_memory.memory_stats()")`
