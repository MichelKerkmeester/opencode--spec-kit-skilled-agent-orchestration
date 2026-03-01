---
title: "Plan: Fix SQLite Transaction Nesting Issue [057-transaction-nesting-fix/plan]"
description: "The memory_index_scan MCP tool fails with \"cannot start a transaction within a transaction\" when bulk indexing memory files. This prevents reindexing the memory database after s..."
trigger_phrases:
  - "plan"
  - "fix"
  - "sqlite"
  - "transaction"
  - "nesting"
  - "057"
importance_tier: "important"
contextType: "decision"
---
# Plan: Fix SQLite Transaction Nesting Issue

## Problem Statement

The `memory_index_scan` MCP tool fails with "cannot start a transaction within a transaction" when bulk indexing memory files. This prevents reindexing the memory database after switching embedding providers (e.g., from local to Voyage).

## Root Cause Analysis

The error occurs due to inconsistent transaction handling between two functions:

1. **`indexMemoryFile()` in `context-server.js`** (line 1667):
   - Uses `database.transaction()` wrapper (better-sqlite3's recommended approach)
   - Wraps `indexMemory()` call and follow-up UPDATE in atomic transaction

2. **`indexMemory()` in `vector-index.js`** (line 1055):
   - Uses explicit `database.exec('BEGIN TRANSACTION')` / `COMMIT` / `ROLLBACK`
   - When called from within `indexMemoryFile()`'s transaction, SQLite throws error

**SQLite does NOT support nested transactions.** When `indexMemoryFile()` starts a transaction with `database.transaction()`, and then `indexMemory()` tries to start another with explicit `BEGIN TRANSACTION`, SQLite rejects it.

## Solution

Refactor `indexMemory()` to use `database.transaction()` wrapper, matching the pattern used by `updateMemory()` (which already works correctly).

**Why this works:**
- better-sqlite3's `database.transaction()` functions are composable
- When called within an existing transaction, inner transaction functions simply execute their statements
- No nested BEGIN is issued - statements run in the outer transaction
- Automatic rollback on error (no manual cleanup needed)

## Changes Required

### File 1: `vector-index.js`

Convert `indexMemory()` from explicit transaction to `database.transaction()` wrapper:

```javascript
// BEFORE (problematic)
try {
  database.exec('BEGIN TRANSACTION');
  // ... INSERT operations ...
  database.exec('COMMIT');
} catch (error) {
  database.exec('ROLLBACK');
  throw error;
}

// AFTER (fixed)
const indexMemoryTx = database.transaction(() => {
  // ... INSERT operations ...
  return metadataId;
});
return indexMemoryTx();
```

### File 2: `test-bug-fixes.js`

Update test that verifies transaction handling - change expectation from explicit BEGIN/COMMIT to `database.transaction()` usage.

## Testing Plan

1. Apply fix to `vector-index.js`
2. Restart OpenCode (to reload MCP server)
3. Run `memory_index_scan({ force: true })`
4. Verify:
   - No transaction nesting errors
   - Memories indexed successfully
   - Semantic search works with new embeddings

## Risk Assessment

**Low Risk:**
- Pattern matches existing `updateMemory()` implementation
- better-sqlite3's transaction wrapper is well-tested
- Maintains atomicity guarantees
- Cleaner error handling (auto-rollback)

## Checklist

- [x] Modify `indexMemory()` in `vector-index.js` - DONE
- [x] Update test expectations in `test-bug-fixes.js` - DONE
- [ ] Test with `memory_index_scan` - PENDING (requires OpenCode restart)
- [ ] Verify semantic search functionality - PENDING (requires OpenCode restart)
