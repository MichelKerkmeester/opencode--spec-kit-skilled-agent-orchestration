---
title: "Tasks: MCP Server Rename [040-mcp-server-rename/tasks]"
description: "tasks document for 040-mcp-server-rename."
trigger_phrases:
  - "tasks"
  - "mcp"
  - "server"
  - "rename"
  - "040"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: MCP Server Rename

## Task List

### T1: Update opencode.json
- Change MCP server name from "semantic_memory" to "spec_kit_memory"
- Status: pending

### T2: Update AGENTS.md
- Replace all semantic_memory references with spec_kit_memory
- Update tool function names in documentation
- Status: pending

### T3: Update AGENTS (UNIVERSAL).md
- Replace all semantic_memory references with spec_kit_memory
- Update tool function names in documentation
- Status: pending

### T4: Update Install Guides
- Update MCP - Spec Kit Memory.md
- Update README.md
- Status: pending

### T5: Update system-spec-kit Skill
- Update SKILL.md
- Update files in references/
- Update files in assets/
- Update files in scripts/
- Status: pending

### T6: Update .opencode/scripts
- Update any scripts referencing semantic_memory
- Status: pending

### T7: Final Verification
- Grep for remaining occurrences
- Verify no broken references
- Status: pending
