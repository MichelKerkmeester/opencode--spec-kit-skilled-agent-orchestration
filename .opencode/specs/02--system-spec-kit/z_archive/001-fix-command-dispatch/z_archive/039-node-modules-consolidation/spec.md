---
title: "Node Modules [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/039-node-modules-consolidation/spec]"
description: "id: 039-node-modules-consolidation"
trigger_phrases:
  - "node"
  - "modules"
  - "consolidation"
  - "spec"
  - "039"
importance_tier: "important"
contextType: "planning"
created: 2025-12-25
id: 039-node-modules-consolidation
level: 2
status: Complete
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Node Modules Consolidation

<!-- ANCHOR:metadata -->
## Problem Statement

The `system-spec-kit` skill has **duplicate node_modules directories** consuming ~1.9GB:

| Location | Size | Packages | Purpose |
|----------|------|----------|---------|
| `scripts/node_modules/` | 911MB | 79 | CLI tools (generate-context.js) |
| `mcp_server/node_modules/` | 967MB | 178 | MCP server (context-server.js) |

**Key finding:** All 79 packages in `scripts/` are duplicated in `mcp_server/` (100% overlap).

<!-- /ANCHOR:metadata -->
## Current State

### scripts/package.json (3 dependencies)
```json
{
  "type": "commonjs",
  "dependencies": {
    "@huggingface/transformers": "^3.8.1",
    "better-sqlite3": "^12.5.0",
    "sqlite-vec": "^0.1.7-alpha.2"
  }
}
```

### mcp_server/package.json (6 dependencies)
```json
{
  "dependencies": {
    "@huggingface/transformers": "^3.0.0",
    "@modelcontextprotocol/sdk": "^1.24.3",
    "better-sqlite3": "^11.0.0",
    "chokidar": "^3.6.0",
    "lru-cache": "^11.2.4",
    "sqlite-vec": "^0.1.0"
  }
}
```

### Version Discrepancies
| Package | scripts/ | mcp_server/ | Action |
|---------|----------|-------------|--------|
| @huggingface/transformers | ^3.8.1 | ^3.0.0 | Use ^3.8.1 (newer) |
| better-sqlite3 | ^12.5.0 | ^11.0.0 | Use ^12.5.0 (newer) |
| sqlite-vec | ^0.1.7-alpha.2 | ^0.1.0 | Use ^0.1.7-alpha.2 (newer) |

## Solution: npm Workspaces

Use npm workspaces to share a single node_modules at the root level.

### Target Structure
```
.opencode/skill/system-spec-kit/
├── package.json          # NEW: Root workspace config
├── node_modules/         # NEW: Shared dependencies (~967MB)
├── mcp_server/
│   ├── package.json      # Workspace member (no node_modules)
│   └── ...
├── scripts/
│   ├── package.json      # Workspace member (no node_modules)
│   └── ...
└── ...
```

### Benefits
- **~911MB disk savings** (eliminate duplicate)
- **Single npm install** at root level
- **Consistent versions** across both packages
- **Proper npm/node resolution** (no symlink hacks)

## Constraints

1. **No breaking changes** - Both systems must work after consolidation
2. **OpenCode compatibility** - MCP server must start correctly
3. **CLI compatibility** - generate-context.js must work standalone
4. **Version alignment** - Use newest compatible versions

<!-- ANCHOR:success-criteria -->
## Success Criteria

- [ ] Single node_modules at system-spec-kit root
- [ ] `npm install` works from root
- [ ] MCP server starts: `node mcp_server/context-server.js`
- [ ] CLI works: `node scripts/generate-context.js --help`
- [ ] All 14 MCP tools functional
- [ ] ~900MB disk savings verified
<!-- /ANCHOR:success-criteria -->

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Native module compatibility | Medium | High | Test better-sqlite3 thoroughly |
| ESM/CJS conflicts | Low | Medium | Keep commonjs type |
| OpenCode MCP resolution | Low | High | Test MCP server startup |

## References

- npm workspaces docs: https://docs.npmjs.com/cli/v10/using-npm/workspaces
- Previous refinement context: see the 035-040 post-merge refinement series in this archive.
