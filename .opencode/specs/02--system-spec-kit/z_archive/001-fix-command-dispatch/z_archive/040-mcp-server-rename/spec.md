---
title: "MCP Server Rename: semantic_memory → spec_kit_memory [040-mcp-server-rename/spec]"
description: "Rename the semantic memory MCP server from semantic_memory to spec_kit_memory across all configuration files, documentation, and code references."
trigger_phrases:
  - "mcp"
  - "server"
  - "rename"
  - "semantic"
  - "memory"
  - "spec"
  - "040"
importance_tier: "important"
contextType: "decision"
---
# MCP Server Rename: semantic_memory → spec_kit_memory

## Overview
Rename the semantic memory MCP server from `semantic_memory` to `spec_kit_memory` across all configuration files, documentation, and code references.

## Goals
1. Update MCP server name in opencode.json configuration
2. Update all documentation references
3. Update all code/script references
4. Ensure consistent naming across the entire codebase

## Scope
### In Scope
- opencode.json MCP configuration
- AGENTS.md and AGENTS (UNIVERSAL).md
- system-spec-kit skill files (SKILL.md, references/, assets/, scripts/)
- Install guides (MCP - Spec Kit Memory.md, README.md)
- Any scripts in .opencode/scripts/

### Out of Scope
- Actual MCP server implementation (external)
- Database schema changes
- Memory file content changes

## Success Criteria
- [ ] All occurrences of "semantic_memory" renamed to "spec_kit_memory"
- [ ] All tool function names updated (e.g., semantic_memory_memory_search → spec_kit_memory_memory_search)
- [ ] Documentation is consistent and accurate
- [ ] No broken references remain
