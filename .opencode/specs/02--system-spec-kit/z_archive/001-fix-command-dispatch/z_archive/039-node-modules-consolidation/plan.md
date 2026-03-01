---
title: "Implementation Plan [039-node-modules-consolidation/plan]"
description: "id: 039-node-modules-consolidation"
trigger_phrases:
  - "implementation"
  - "plan"
  - "039"
  - "node"
importance_tier: "important"
contextType: "decision"
id: 039-node-modules-consolidation
---
# Implementation Plan

## Phase 1: Preparation (Pre-flight)

### 1.1 Backup Current State
- [ ] Document current node_modules sizes
- [ ] Verify both systems work before changes
- [ ] Note current package-lock.json states

### 1.2 Version Analysis
- [ ] Identify version conflicts between package.json files
- [ ] Determine target versions (newest compatible)
- [ ] Check for peer dependency requirements

## Phase 2: Implementation

### 2.1 Create Root Workspace
```bash
# Create root package.json with workspaces
cd .opencode/skill/system-spec-kit/
```

Root package.json content:
```json
{
  "name": "system-spec-kit",
  "private": true,
  "workspaces": [
    "mcp_server",
    "scripts"
  ],
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2.2 Update Child package.json Files

**mcp_server/package.json** - Add name field, update versions:
```json
{
  "name": "@spec-kit/mcp-server",
  "version": "12.1.0",
  ...
}
```

**scripts/package.json** - Add name field:
```json
{
  "name": "@spec-kit/scripts",
  "type": "commonjs",
  ...
}
```

### 2.3 Align Dependency Versions

Target versions (newest from both):
- `@huggingface/transformers`: `^3.8.1`
- `better-sqlite3`: `^12.5.0`
- `sqlite-vec`: `^0.1.7-alpha.2`
- `@modelcontextprotocol/sdk`: `^1.24.3`
- `chokidar`: `^3.6.0`
- `lru-cache`: `^11.2.4`

### 2.4 Remove Old node_modules
```bash
rm -rf scripts/node_modules
rm -rf mcp_server/node_modules
rm -f scripts/package-lock.json
rm -f mcp_server/package-lock.json
```

### 2.5 Install from Root
```bash
cd .opencode/skill/system-spec-kit/
npm install
```

## Phase 3: Verification

### 3.1 Test MCP Server
```bash
# Should start without errors
node mcp_server/context-server.js &
sleep 2
kill %1
```

### 3.2 Test CLI Tools
```bash
# Should show help
node scripts/generate-context.js --help
```

### 3.3 Test Full Workflow
```bash
# Create test memory file and index it
# This tests embeddings, sqlite, vector operations
```

### 3.4 Verify Disk Savings
```bash
du -sh node_modules/
# Expected: ~967MB (vs previous 1.9GB total)
```

## Phase 4: Cleanup

### 4.1 Update Documentation
- [ ] Update SKILL.md if any paths changed
- [ ] Update any hardcoded paths in scripts
- [ ] Note consolidation in README.md

### 4.2 Final Verification
- [ ] Full MCP tool test (all 14 tools)
- [ ] OpenCode restart and MCP connection test

## Rollback Plan

If issues occur:
1. Delete root package.json and node_modules
2. Restore individual package-lock.json from git
3. Run `npm install` in each subdirectory separately

## Execution Order

```
1. Backup verification
2. Create root package.json
3. Update child package.json files (names, versions)
4. Delete old node_modules (both)
5. npm install from root
6. Test MCP server
7. Test CLI
8. Verify savings
9. Update docs
```

## Time Estimate

- Phase 1: 5 min (verification)
- Phase 2: 10 min (implementation)
- Phase 3: 10 min (testing)
- Phase 4: 5 min (cleanup)
- **Total: ~30 min**
