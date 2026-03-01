---
title: "Plan: MCP Server Rename [040-mcp-server-rename/plan]"
description: "plan document for 040-mcp-server-rename."
trigger_phrases:
  - "plan"
  - "mcp"
  - "server"
  - "rename"
  - "040"
importance_tier: "important"
contextType: "decision"
---
# Plan: MCP Server Rename

## Phase 1: Discovery (Complete)
- [x] Identify all files containing "semantic_memory" references
- [x] Document current state and occurrences

## Phase 2: Configuration Updates
- [ ] Update opencode.json MCP server name
- [ ] Verify MCP server restart behavior

## Phase 3: Documentation Updates
- [ ] Update AGENTS.md
- [ ] Update AGENTS (UNIVERSAL).md
- [ ] Update MCP - Spec Kit Memory.md install guide
- [ ] Update README.md in install_guides
- [ ] Update system-spec-kit SKILL.md

## Phase 4: Code/Script Updates
- [ ] Update references in .opencode/skill/system-spec-kit/references/
- [ ] Update references in .opencode/skill/system-spec-kit/assets/
- [ ] Update references in .opencode/skill/system-spec-kit/scripts/
- [ ] Update references in .opencode/scripts/

## Phase 5: Verification
- [ ] Search for any remaining "semantic_memory" references
- [ ] Test MCP tool invocations work with new names
