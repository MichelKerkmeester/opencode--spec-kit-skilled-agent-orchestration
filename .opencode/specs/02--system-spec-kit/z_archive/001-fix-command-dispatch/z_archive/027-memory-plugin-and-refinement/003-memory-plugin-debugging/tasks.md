---
title: "Tasks: Memory Plugin bun:sqlite Migration [003-memory-plugin-debugging/tasks]"
description: "bun:sqlite is API-compatible with better-sqlite3!"
trigger_phrases:
  - "tasks"
  - "memory"
  - "plugin"
  - "bun"
  - "sqlite"
  - "003"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Plugin bun:sqlite Migration

## CRITICAL FINDING

**bun:sqlite is API-compatible with better-sqlite3!**

Bun's SQLite implementation was specifically designed to be a drop-in replacement for better-sqlite3. This means:

- `.prepare()` works (no need to change to `.query()`)
- `.all()` works the same way
- `.close()` works (no need to add `false` parameter)
- Only the **import statement** needs to change

**Result**: Migration is ~90% simpler than initially planned. Only T-001 is required.

---

## Overview
Migration of the memory plugin from better-sqlite3 to bun:sqlite to fix compatibility with OpenCode's Bun runtime.

## User Stories

### US-001: Plugin Database Compatibility
As an AI assistant, I need the memory plugin to successfully load memories from the SQLite database so that I can provide context-aware responses.

**Acceptance Criteria:**
- Plugin loads without errors in Bun runtime
- Memories are retrieved from database (count > 0)
- Memory dashboard appears in system prompt

## Tasks

### T-001: Update Import Statement
**Priority**: P0 (Critical)
**Estimate**: 2 min
**Status**: REQUIRED
**File**: `.opencode/plugin/semantic_memory_plugin/index.js`
**Line**: 17

Change:
```javascript
import Database from 'better-sqlite3';
```
To:
```javascript
import { Database } from "bun:sqlite";
```

**Note**: This is the ONLY code change required due to API compatibility.

---

### T-002: Update getMemoryIndex() Query Calls
**Priority**: N/A
**Status**: NOT NEEDED - API Compatible

~~Change all `db.prepare()` to `db.query()`~~

**Reason**: bun:sqlite supports `.prepare()` with identical API to better-sqlite3.

---

### T-003: Update getMemoryIndex() Close Call
**Priority**: N/A
**Status**: NOT NEEDED - API Compatible

~~Change `db.close()` to `db.close(false)`~~

**Reason**: bun:sqlite `.close()` works without parameters.

---

### T-004: Update matchTriggerPhrases() Query Calls
**Priority**: N/A
**Status**: NOT NEEDED - API Compatible

~~Change all `db.prepare()` to `db.query()`~~

**Reason**: bun:sqlite supports `.prepare()` with identical API to better-sqlite3.

---

### T-005: Update matchTriggerPhrases() Close Call
**Priority**: N/A
**Status**: NOT NEEDED - API Compatible

~~Change `db.close()` to `db.close(false)`~~

**Reason**: bun:sqlite `.close()` works without parameters.

---

### T-006: Verify Plugin Loads Successfully
**Priority**: P0 (Critical)
**Estimate**: 5 min
**Status**: REQUIRED (Verification)

1. Restart OpenCode
2. Check console for `[memory-context]` messages
3. Verify "Loaded N memories" shows N > 0

---

### T-007: Verify Memory Dashboard
**Priority**: P1 (High)
**Estimate**: 5 min
**Status**: REQUIRED (Verification)

1. Start a new chat session
2. Verify memory dashboard appears in AI context
3. Test memory_load() function

---

## Simplified Dependencies

```
T-001 ─► T-006 ─► T-007
  │
  └─► (T-002 to T-005 NOT NEEDED)
```

## Estimated Total Time
~12 minutes (down from 30 minutes)
- T-001: 2 min
- T-006: 5 min  
- T-007: 5 min
