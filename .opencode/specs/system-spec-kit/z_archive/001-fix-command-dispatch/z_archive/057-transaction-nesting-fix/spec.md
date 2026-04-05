---
title: "Spec: Fix SQLite [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/057-transaction-nesting-fix/spec]"
description: "The memory_index_scan MCP tool fails with SQLite error"
trigger_phrases:
  - "spec"
  - "fix"
  - "sqlite"
  - "transaction"
  - "nesting"
  - "057"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: CORE -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Fix SQLite Transaction Nesting Issue

<!-- ANCHOR:metadata -->
## Overview

| Field | Value |
|-------|-------|
| **Spec ID** | 057-transaction-nesting-fix |
| **Status** | Implementation Complete (Pending Verification) |
| **Priority** | P0 - Critical |
| **Category** | Bug Fix |
| **LOC Impact** | ~50 lines modified |

<!-- /ANCHOR:metadata -->
## Problem

The `memory_index_scan` MCP tool fails with SQLite error:
```
cannot start a transaction within a transaction
```

This occurs when bulk indexing memory files after switching embedding providers (e.g., from local HuggingFace to Voyage API).

## Root Cause

Inconsistent transaction handling between two functions:

1. **`indexMemoryFile()`** in `context-server.js` uses `database.transaction()` wrapper
2. **`indexMemory()`** in `vector-index.js` uses explicit `BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK`

When `indexMemoryFile()` wraps `indexMemory()` in a transaction, the inner function tries to start a nested transaction, which SQLite does not support.

## Solution

Refactor `indexMemory()` to use `database.transaction()` wrapper (matching `updateMemory()` pattern). better-sqlite3's transaction functions are composable - inner calls simply execute within the outer transaction.

## Files Changed

| File | Change |
|------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js` | Converted `indexMemory()` from explicit BEGIN/COMMIT/ROLLBACK to `database.transaction()` wrapper |
| `.opencode/skill/system-spec-kit/scripts/test-bug-fixes.js` | Updated test T-010a/T-010b to verify new pattern |

## Verification

After OpenCode restart:
1. Run `memory_index_scan({ force: true })`
2. Verify no transaction errors
3. Verify all 154+ memory files index successfully
4. Test semantic search functionality
