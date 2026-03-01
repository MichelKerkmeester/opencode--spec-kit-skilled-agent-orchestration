---
title: "OpenCode Plugin Memory Database Access - Research Document [003-memory-plugin-debugging/research]"
description: "Problem: The memory plugin shows \"Loaded 0 memories for dashboard\" despite 66 memories existing in the database."
trigger_phrases:
  - "opencode"
  - "plugin"
  - "memory"
  - "database"
  - "access"
  - "research"
  - "003"
importance_tier: "normal"
contextType: "research"
---
# OpenCode Plugin Memory Database Access - Research Document

## 1. Executive Summary

**Problem**: The memory plugin shows "Loaded 0 memories for dashboard" despite 66 memories existing in the database.

**Root Cause**: The plugin uses `better-sqlite3`, a native Node.js addon that is incompatible with Bun runtime. OpenCode runs plugins in-process using Bun, not Node.js.

**Evidence**: The console shows Bun's error message:
```
Track the status in https://github.com/oven-sh/bun/issues/
In the meantime, you could try bun:sqlite which has a similar API.
[memory-context] Loaded 0 memories for dashboard
```

**Solution**: Migrate the plugin from `better-sqlite3` to `bun:sqlite` (Bun's native SQLite implementation).

## 2. Problem Analysis

### 2.1 Error Flow

1. Plugin loads in OpenCode (Bun runtime)
2. Plugin tries to import 'better-sqlite3'
3. Bun's Node.js compatibility layer attempts to load the native addon
4. Native addon fails (better-sqlite3 uses N-API which Bun doesn't fully support)
5. Bun shows warning about using bun:sqlite instead
6. The import returns undefined or a broken module
7. When `getMemoryIndex()` is called, `new Database()` throws
8. Error caught by try/catch, returns `{ memories: [], totalCount: 0 }`
9. Plugin logs "Loaded 0 memories for dashboard"

### 2.2 Why MCP Server Works but Plugin Doesn't

| Aspect | MCP Server | Plugin |
|--------|------------|--------|
| **Execution** | Separate process | In-process with OpenCode |
| **Runtime** | Node.js (spawned) | Bun (OpenCode's runtime) |
| **Communication** | stdio (JSON-RPC) | Direct function calls |
| **SQLite Library** | better-sqlite3 | better-sqlite3 |

The MCP server runs as a **separate Node.js process** spawned by OpenCode, communicating via stdio. The plugin runs **in-process** with OpenCode, which uses Bun as its runtime.

## 3. OpenCode Plugin Architecture

### 3.1 Runtime Environment

OpenCode uses **Bun** as its runtime:
- The plugin API exposes `$` as Bun's shell API (typed as `BunShell`)
- Installation uses `bun install -g opencode-ai`
- Plugins can use Node.js modules through Bun's compatibility layer (with limitations)

### 3.2 Plugin Loading

**Auto-discovery locations** (no explicit registration needed):
1. Project-local: `.opencode/plugin/` (highest priority)
2. Global: `~/.config/opencode/plugin/` or `~/.opencode/plugin/`

### 3.3 Plugin API

```typescript
export type Plugin = (input: PluginInput) => Promise<Hooks>

export type PluginInput = {
  client: ReturnType<typeof createOpencodeClient>
  project: Project
  directory: string
  worktree: string
  $: BunShell
}

export interface Hooks {
  event?: (input: { event: Event }) => Promise<void>
  "experimental.chat.system.transform"?: (input, output) => Promise<void>
  "chat.message"?: (input, output) => Promise<void>
  // ... other hooks
}
```

### 3.4 The `experimental.chat.system.transform` Hook

This hook injects content into the AI's system prompt:

```javascript
"experimental.chat.system.transform": async (input, output) => {
  const dashboard = formatMemoryDashboard(data);
  output.system.push(dashboard);  // Add to system prompt
}
```

## 4. SQLite Library Comparison

### 4.1 better-sqlite3 vs bun:sqlite

| Aspect | better-sqlite3 | bun:sqlite |
|--------|----------------|------------|
| **Runtime** | Node.js only | Bun only |
| **Performance** | Baseline | 3-6x faster (reads) |
| **API Similarity** | Original | ~95% compatible |
| **Install** | npm package (native addon) | Built-in |
| **BLOB Type** | `Buffer` | `Uint8Array` |

### 4.2 API Differences

| better-sqlite3 | bun:sqlite | Notes |
|----------------|------------|-------|
| `db.prepare()` | `db.query()` | `query()` caches statements |
| `stmt.run()` | `stmt.run()` | Identical |
| `stmt.get()` | `stmt.get()` | Identical |
| `stmt.all()` | `stmt.all()` | Identical |
| `db.close()` | `db.close(false)` | Boolean parameter |
| `?` params | `?1` params | Positional syntax |

### 4.3 Parameter Binding Differences

```javascript
// better-sqlite3: Prefix in SQL, not in binding
db.prepare("SELECT * FROM users WHERE id = $id").get({ id: 123 });

// bun:sqlite (default): Prefix required in binding too
db.query("SELECT * FROM users WHERE id = $id").get({ $id: 123 });

// bun:sqlite (strict: true): No prefix needed
const db = new Database(":memory:", { strict: true });
db.query("SELECT * FROM users WHERE id = $id").get({ id: 123 });
```

## 5. MCP Server Analysis (Working Pattern)

### 5.1 Database Connection Pattern

The MCP server uses a **singleton pattern** with lazy initialization:

```javascript
let db = null;

function initializeDb(customPath = null) {
  if (db && !customPath) return db;  // Return cached instance
  
  db = new Database(targetPath);
  db.pragma('journal_mode = WAL');
  db.pragma('cache_size = -64000');
  db.pragma('synchronous = NORMAL');
  
  return db;
}
```

### 5.2 Key Success Factors

1. **Single initialization point** - DB opened once before handlers
2. **Singleton pattern** - `initializeDb()` returns cached instance
3. **WAL mode** - Enables concurrent reads without blocking
4. **Performance pragmas** - Large cache, mmap, memory temp store
5. **Graceful degradation** - Works without sqlite-vec extension

## 6. Recommended Fix

### 6.1 Code Changes Required

**Change 1: Import statement** (line 17)
```javascript
// FROM
import Database from 'better-sqlite3';

// TO
import { Database } from "bun:sqlite";
```

**Change 2: Query method** (lines 112, 147, 181, etc.)
```javascript
// FROM
db.prepare(`SELECT ...`).all();

// TO
db.query(`SELECT ...`).all();
```

**Change 3: Close method** (lines 159, 219)
```javascript
// FROM
if (db) db.close();

// TO
if (db) db.close(false);
```

### 6.2 Optional Improvements

Add WAL mode for better concurrent access:
```javascript
db = new Database(dbPath, { readonly: true });
// Note: WAL mode should be set by the writer (MCP server), not reader
```

### 6.3 Testing Strategy

1. Make the code changes
2. Restart OpenCode completely
3. Check console for `[memory-context]` log messages
4. Verify dashboard shows memories (not 0)
5. Test `memory_load({ memoryId: # })` to confirm full functionality

## 7. Alternative Approaches

### Option A: Migrate to bun:sqlite (Recommended)
- **Pros**: Simple, native, fast, no dependencies
- **Cons**: Minor API differences
- **Effort**: Low (3 code changes)

### Option B: Use MCP tools from plugin
- **Pros**: Reuses existing working code
- **Cons**: Adds latency, complexity
- **Effort**: Medium

### Option C: Spawn Node.js subprocess
- **Pros**: Can use any Node.js library
- **Cons**: Complex, slow, resource-heavy
- **Effort**: High

## 8. Implementation Checklist

- [ ] Change import from 'better-sqlite3' to "bun:sqlite"
- [ ] Change all `db.prepare()` calls to `db.query()`
- [ ] Change all `db.close()` calls to `db.close(false)`
- [ ] Restart OpenCode
- [ ] Verify "[memory-context] Loaded N memories" shows N > 0
- [ ] Test memory dashboard appears in AI context
- [ ] Test memory_load() works correctly

## 10. Implementation Results

### Date
December 17, 2025

### Changes Made
Only ONE change was required:

**File**: `.opencode/plugin/semantic_memory_plugin/index.js`
**Line**: 17

```diff
- import Database from 'better-sqlite3';
+ import { Database } from "bun:sqlite";
```

### Why So Simple?
The initial research suggested multiple changes would be needed (prepare→query, close→close(false)). However, detailed code analysis revealed that **bun:sqlite was designed to be API-compatible with better-sqlite3**.

The following methods work identically:
- `db.prepare()` - works in both (no need for `db.query()`)
- `db.close()` - works in both (no need for boolean parameter)
- `{ readonly: true }` - identical option
- `.all()` and `.get()` - identical return formats

### Verification Status
- [x] Import statement changed
- [x] No remaining better-sqlite3 references
- [x] Code syntactically valid
- [ ] Plugin loads successfully (requires OpenCode restart)
- [ ] Memories loaded (requires OpenCode restart)

### Next Steps
1. Restart OpenCode to load the updated plugin
2. Verify console shows "Loaded N memories" where N > 0
3. Test memory dashboard appears in AI context

## 11. References

- [Bun SQLite Documentation](https://bun.sh/docs/api/sqlite)
- [better-sqlite3 Documentation](https://github.com/WiseLibs/better-sqlite3)
- [OpenCode Plugin API](https://opencode.ai/docs/plugins)
- Plugin location: `.opencode/plugin/semantic_memory_plugin/index.js`
- MCP server: `.opencode/skills/system-memory/mcp_server/semantic-memory.js`
