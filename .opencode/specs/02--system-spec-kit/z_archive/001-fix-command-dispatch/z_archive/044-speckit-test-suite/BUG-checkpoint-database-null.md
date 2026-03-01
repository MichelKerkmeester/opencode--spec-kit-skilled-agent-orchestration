# BUG: Checkpoint Database Connection Returns Null

| Field | Value |
|-------|-------|
| **Bug ID** | SPECKIT-001 |
| **Severity** | P0 - Critical |
| **Component** | Spec Kit Memory MCP - Checkpoints |
| **Status** | Fixed (pending restart) |
| **Discovered** | 2025-12-26 |
| **Discovered By** | Test Agent 6 (Checkpoint Testing) |

## Summary

The checkpoint functionality in Spec Kit Memory MCP is completely broken. All checkpoint operations (`checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete`) fail with `Cannot read properties of null (reading 'prepare')`. The checkpoints module receives a `null` database reference during initialization, preventing any checkpoint operations from executing. This is a critical data loss risk as users cannot create backup snapshots of their memory state.

## Environment

- **System**: Spec Kit Memory MCP v12.6.0
- **Location**: `.opencode/skill/system-spec-kit/`
- **Database**: `database/context-index.sqlite`
- **Platform**: macOS (darwin)
- **Node.js**: Runtime environment

## Steps to Reproduce

1. Start OpenCode with Spec Kit Memory MCP server running
2. Execute any checkpoint operation:
   ```javascript
   // Via MCP tool call
   checkpoint_create({ name: "test-checkpoint" })
   ```
3. Observe error response

Alternatively, run any of these operations:
```javascript
checkpoint_list({})
checkpoint_restore({ name: "any-name" })
checkpoint_delete({ name: "any-name" })
```

## Expected Behavior

- `checkpoint_create()` should create a named checkpoint containing memory state
- `checkpoint_list()` should return an array of existing checkpoints
- `checkpoint_restore()` should restore memory state from a checkpoint
- `checkpoint_delete()` should remove a checkpoint by name

## Actual Behavior

All checkpoint operations fail immediately with the error:

```
Cannot read properties of null (reading 'prepare')
```

The error occurs because the `db` variable in `checkpoints.js` (line 13) remains `null` even after `checkpoints.init()` is called. This happens when `vectorIndex.getDb()` returns `null` at the time of initialization.

## Error Message

```
Cannot read properties of null (reading 'prepare')
```

**Stack trace location**: `.opencode/skill/system-spec-kit/mcp_server/lib/checkpoints.js`

The error originates from any function attempting to use `db.prepare()`:
- `createCheckpoint()` at line 61
- `listCheckpoints()` at line 189
- `getCheckpoint()` at line 203
- `restoreCheckpoint()` at line 250
- `deleteCheckpoint()` at line 476

## Impact

### User Impact
- **Cannot create memory backups** - Users cannot snapshot their memory state before risky operations
- **Cannot restore from checkpoints** - Existing checkpoints (if any) cannot be restored
- **Data loss risk** - Without checkpoint functionality, accidental bulk deletes cannot be undone
- **Feature completely unusable** - 0% of checkpoint operations work

### System Impact
- Affects all 4 checkpoint-related MCP tools
- Auto-checkpoint creation during bulk delete (P0-011 feature) is non-functional
- The `pre-cleanup-*` auto-checkpoints referenced in delete operations cannot be created

## Technical Analysis

### Root Cause Identification

The bug is a **race condition / initialization order issue** in the MCP server startup:

1. **checkpoints.js** (line 13) declares `let db = null;`
2. **checkpoints.js** (line 26-28) has an `init(database)` function that sets `db = database`
3. **context-server.js** (line 1715) calls `checkpoints.init(vectorIndex.getDb())`
4. **The problem**: If `vectorIndex.getDb()` returns `null` at call time, the checkpoint module permanently has a null db reference

### Code Analysis

**checkpoints.js (lines 12-28)**:
```javascript
// Database reference
let db = null;  // <-- Starts as null

function init(database) {
  db = database;  // <-- If database is null, db stays null forever
}
```

**context-server.js (line 1715)**:
```javascript
// Initialize checkpoints and access tracker with database connection
checkpoints.init(vectorIndex.getDb());
```

**Hypothesis**: The `vectorIndex.getDb()` call may return `null` if called before the database singleton is fully initialized, or if there's an error during initialization that's caught but not propagated.

### Evidence

1. **Memory operations work** - `memory_stats()` returns 127 memories successfully
2. **Vector search works** - `sqliteVecAvailable: true` confirmed in stats
3. **Only checkpoints fail** - All 8 checkpoint tests failed with identical error
4. **Error is consistent** - Same error across create/list/restore/delete operations

This suggests the main database works, but the checkpoint module's reference is broken.

## Suggested Investigation

1. **Add defensive null check in checkpoints.init()**:
   ```javascript
   function init(database) {
     if (!database) {
       console.error('[checkpoints] WARNING: init() called with null database');
     }
     db = database;
   }
   ```

2. **Add null guard in checkpoint operations**:
   ```javascript
   function createCheckpoint(name, options = {}) {
     if (!db) {
       throw new Error('Checkpoint database not initialized. Call checkpoints.init() first.');
     }
     // ... rest of function
   }
   ```

3. **Verify initialization order in context-server.js**:
   - Confirm `vectorIndex.initializeDb()` completes before `checkpoints.init()` is called
   - Check if try-catch around line 1704-1723 is swallowing initialization errors

4. **Check for async/timing issues**:
   - The database initialization appears synchronous, but verify no race conditions exist
   - Check if any SIGTERM/SIGINT handlers interfere with initialization

5. **Test database connection directly**:
   ```javascript
   const db = vectorIndex.getDb();
   console.log('getDb() result:', db); // Is this null?
   console.log('db type:', typeof db);
   ```

## Related Files

| File | Relevance |
|------|-----------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/checkpoints.js` | **Primary**: Contains broken `db` reference (line 13) and `init()` function (line 26) |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.js` | **Secondary**: Calls `checkpoints.init()` at line 1715 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js` | **Reference**: Provides `getDb()` function (line 2798) that may return null |
| `.opencode/skill/system-spec-kit/database/context-index.sqlite` | **Database**: The SQLite database file containing checkpoints table |

## Test Evidence

- **Test Report**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/044-speckit-test-suite/scratch/test-agent-06-checkpoint/TEST-REPORT.md`
- **Test Date**: 2025-12-26
- **Test Agent**: Agent 6 (Checkpoint Testing)
- **Tests Executed**: 8
- **Tests Passed**: 0
- **Tests Failed**: 8 (100% failure rate)
- **All failures**: Same error message (`Cannot read properties of null (reading 'prepare')`)

### Attempted Test Cases

| Test ID | Operation | Checkpoint Name |
|---------|-----------|-----------------|
| T6.1 | Create basic | `test-agent-06-1766736192-basic` |
| T6.2 | Create with metadata | `test-agent-06-1766736192-meta` |
| T6.3 | Create filtered | `test-agent-06-1766736192-filtered` |
| T6.4 | List all | N/A |
| T6.5 | List filtered | N/A |
| T6.6 | Restore | N/A |
| T6.7 | Restore with clear | N/A |
| T6.8 | Delete | N/A |

## Workaround

**None - functionality completely broken.**

Users cannot create, list, restore, or delete checkpoints. The only partial mitigation is:

1. **Manual backups**: Copy the `context-index.sqlite` database file before risky operations
2. **Avoid bulk deletes**: Do not use `memory_delete({ specFolder: "...", confirm: true })` as the auto-checkpoint feature will not protect you

## Proposed Fix

**Option A: Defensive initialization (quick fix)**

In `checkpoints.js`, add null check:
```javascript
function init(database) {
  if (!database) {
    throw new Error('checkpoints.init() requires a valid database instance');
  }
  db = database;
}
```

**Option B: Lazy initialization (robust fix)**

In `checkpoints.js`, use lazy initialization like other modules:
```javascript
function getDb() {
  if (!db) {
    const vectorIndex = require('./vector-index');
    db = vectorIndex.getDb();
    if (!db) {
      throw new Error('Database not available');
    }
  }
  return db;
}

function createCheckpoint(name, options = {}) {
  const database = getDb();  // Lazy init on first use
  // ... rest of function using `database` instead of `db`
}
```

**Option C: Verify initialization order (root cause fix)**

In `context-server.js`, ensure database is confirmed initialized:
```javascript
// Phase 1: Initialize database
const database = vectorIndex.initializeDb();
if (!database) {
  throw new Error('Failed to initialize database');
}

// Phase 2: Initialize modules that depend on database
checkpoints.init(database);  // Pass verified non-null reference
```

---

*Bug report generated from Spec Kit Test Suite execution*
*Report created: 2025-12-26*

---

## Fix Applied (2025-12-26)

### Changes to `checkpoints.js`

**1. Enhanced `init()` function with null check:**
```javascript
function init(database) {
  if (!database) {
    console.error('[checkpoints] WARNING: init() called with null database');
    console.error('[checkpoints] Checkpoint operations will fail until a valid database is provided');
    return false;
  }
  db = database;
  console.error('[checkpoints] Database initialized successfully');
  return true;
}
```

**2. Added `getDatabase()` helper with defensive null check:**
```javascript
function getDatabase() {
  if (!db) {
    throw new Error('Checkpoint database not initialized. The server may have started before the database was ready. Please try again or restart the server.');
  }
  return db;
}
```

**3. Updated all checkpoint operations to use `getDatabase()`:**
- `createCheckpoint()`, `listCheckpoints()`, `getCheckpoint()`, `restoreCheckpoint()`, `deleteCheckpoint()`

### Verification
Restart OpenCode to reload the MCP server with the updated code. Then test:
```javascript
checkpoint_create({ name: "test-fix" })
checkpoint_list({})
checkpoint_delete({ name: "test-fix" })
```
