---
title: "Implementation Plan - bun:sqlite Migration [003-memory-plugin-debugging/plan]"
description: "Migrate the semantic memory plugin from better-sqlite3 to bun:sqlite to fix the \"Loaded 0 memories\" issue."
trigger_phrases:
  - "implementation"
  - "plan"
  - "bun"
  - "sqlite"
  - "migration"
  - "003"
  - "memory"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan - bun:sqlite Migration

## Overview

Migrate the semantic memory plugin from `better-sqlite3` to `bun:sqlite` to fix the "Loaded 0 memories" issue.

**Estimated Effort**: Low (30-60 minutes)
**Risk Level**: Low (isolated changes, easy rollback)

## Prerequisites

- [ ] Read current plugin source code
- [ ] Understand bun:sqlite API differences
- [ ] Backup current plugin file

## Implementation Steps

### Phase 1: Code Changes

#### Step 1.1: Update Import Statement

**File**: `.opencode/plugin/semantic_memory_plugin/index.js`

```javascript
// FROM (line ~17)
import Database from 'better-sqlite3';

// TO
import { Database } from "bun:sqlite";
```

#### Step 1.2: Update Query Methods

Replace all `db.prepare()` calls with `db.query()`:

```javascript
// FROM
const memories = db.prepare(`SELECT ...`).all();

// TO
const memories = db.query(`SELECT ...`).all();
```

**Locations to update**:
- `getMemoryIndex()` function - all query calls
- Any other database query locations

#### Step 1.3: Update Close Method

```javascript
// FROM
if (db) db.close();

// TO
if (db) db.close(false);
```

### Phase 2: Testing

#### Step 2.1: Restart OpenCode

```bash
# Exit current OpenCode session
# Start fresh OpenCode session
opencode
```

#### Step 2.2: Verify Console Output

Check for:
- `[memory-context] Loaded N memories for dashboard` where N > 0
- No SQLite-related errors or warnings
- No "better-sqlite3" compatibility warnings

#### Step 2.3: Verify Dashboard

- Start a new conversation
- Check if memory dashboard appears in AI context
- Verify memories are listed with correct tiers

#### Step 2.4: Test Memory Loading

```
# In chat, test loading a specific memory
memory_load({ memoryId: 1 })
```

### Phase 3: Validation

- [ ] Console shows N > 0 memories loaded
- [ ] No errors in console
- [ ] Dashboard visible in new conversations
- [ ] Memory load functionality works

## Rollback Plan

If migration fails:

1. Restore original plugin file from backup
2. Restart OpenCode
3. Document failure reason for further investigation

## Post-Implementation

- [ ] Update plugin documentation if needed
- [ ] Remove `better-sqlite3` from any package.json if present
- [ ] Create memory file documenting the fix

## Notes

- The MCP server does NOT need changes (runs in Node.js, not Bun)
- WAL mode is already set by MCP server, plugin opens read-only
- Parameter binding syntax may need `$prefix` in bindings for bun:sqlite
