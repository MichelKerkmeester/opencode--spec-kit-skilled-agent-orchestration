---
title: "Task Breakdown [039-node-modules-consolidation/tasks]"
description: "id: 039-node-modules-consolidation"
trigger_phrases:
  - "task"
  - "breakdown"
  - "tasks"
  - "039"
  - "node"
importance_tier: "normal"
contextType: "implementation"
id: 039-node-modules-consolidation
---
# Tasks

## Phase 1: Preparation

- [ ] **TASK-001**: Verify current systems work
  - Test MCP server startup
  - Test generate-context.js --help
  - Document current sizes

## Phase 2: Implementation

- [ ] **TASK-002**: Create root package.json
  - Workspace configuration
  - Engine requirements

- [ ] **TASK-003**: Update mcp_server/package.json
  - Add workspace name
  - Update to newest versions

- [ ] **TASK-004**: Update scripts/package.json
  - Add workspace name
  - Update to newest versions
  - Keep commonjs type

- [ ] **TASK-005**: Remove old node_modules
  - Delete scripts/node_modules (911MB)
  - Delete mcp_server/node_modules (967MB)
  - Delete old package-lock.json files

- [ ] **TASK-006**: Install from root
  - npm install at system-spec-kit level
  - Verify single node_modules created

## Phase 3: Verification

- [ ] **TASK-007**: Test MCP server
  - Server starts without errors
  - All 14 tools accessible

- [ ] **TASK-008**: Test CLI tools
  - generate-context.js works
  - Embeddings generation works

- [ ] **TASK-009**: Verify disk savings
  - Compare before/after sizes
  - Target: ~900MB savings

## Phase 4: Cleanup

- [ ] **TASK-010**: Update documentation
  - Note consolidation in relevant docs
  - Update any hardcoded paths

## Progress Tracking

| Phase | Total | Done | Remaining |
|-------|-------|------|-----------|
| Preparation | 1 | 0 | 1 |
| Implementation | 5 | 0 | 5 |
| Verification | 3 | 0 | 3 |
| Cleanup | 1 | 0 | 1 |
| **Total** | **10** | **0** | **10** |
