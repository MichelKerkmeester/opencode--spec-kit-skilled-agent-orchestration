---
title: "Memory Plugin Debugging - bun:sqlite Migration [003-memory-plugin-debugging/spec]"
description: "The semantic memory plugin fails to load memories into the AI context dashboard, showing \"Loaded 0 memories for dashboard\" despite 66+ memories existing in the database. This pr..."
trigger_phrases:
  - "memory"
  - "plugin"
  - "debugging"
  - "bun"
  - "sqlite"
  - "spec"
  - "003"
importance_tier: "important"
contextType: "decision"
---
# Memory Plugin Debugging - bun:sqlite Migration

## Problem Statement

The semantic memory plugin fails to load memories into the AI context dashboard, showing "Loaded 0 memories for dashboard" despite 66+ memories existing in the database. This prevents the AI from having automatic access to relevant context at session start.

### Root Cause

The plugin uses `better-sqlite3`, a native Node.js addon that is incompatible with Bun runtime. OpenCode runs plugins in-process using Bun, not as separate Node.js processes like MCP servers.

### Impact

- AI loses automatic context injection at session start
- Memory dashboard shows empty (0 memories)
- Users must manually load context via MCP tools
- Reduces effectiveness of the semantic memory system

## Scope

### In Scope

- Migrate plugin from `better-sqlite3` to `bun:sqlite`
- Update all SQLite API calls to match bun:sqlite syntax
- Verify plugin loads memories successfully after migration
- Document the migration for future reference

### Out of Scope

- Changes to MCP server (already works with Node.js)
- Changes to memory database schema
- New plugin features
- Performance optimization beyond basic functionality

## Success Criteria

1. **Primary**: Plugin logs "Loaded N memories for dashboard" where N > 0
2. **Verification**: Memory dashboard appears in AI system context
3. **Functionality**: `memory_load({ memoryId: # })` works correctly from plugin context
4. **Stability**: No errors or warnings related to SQLite in console

## Technical Approach

Replace the `better-sqlite3` library with Bun's native `bun:sqlite` module, updating the API calls to match:

| Change | From | To |
|--------|------|-----|
| Import | `import Database from 'better-sqlite3'` | `import { Database } from "bun:sqlite"` |
| Query | `db.prepare().all()` | `db.query().all()` |
| Close | `db.close()` | `db.close(false)` |

## Dependencies

- OpenCode with Bun runtime
- Existing memory database (`.opencode/skills/system-memory/database/memory-index.sqlite`)
- Plugin location: `.opencode/plugin/semantic_memory_plugin/index.js`

## References

- Research document: `./research.md`
- Bun SQLite docs: https://bun.sh/docs/api/sqlite
