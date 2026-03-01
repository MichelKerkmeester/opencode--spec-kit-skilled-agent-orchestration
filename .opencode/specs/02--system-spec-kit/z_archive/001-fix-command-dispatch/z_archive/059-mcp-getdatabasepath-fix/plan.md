---
title: "Plan: Fix MCP Server Method Name Mismatches [059-mcp-getdatabasepath-fix/plan]"
description: "The Spec Kit Memory MCP server fails with multiple errors due to import naming mismatches"
trigger_phrases:
  - "plan"
  - "fix"
  - "mcp"
  - "server"
  - "method"
  - "059"
importance_tier: "important"
contextType: "decision"
---
# Plan: Fix MCP Server Method Name Mismatches

## Problem

The Spec Kit Memory MCP server fails with multiple errors due to import naming mismatches:

1. `profile.getDatabasePath is not a function` (E040)
2. `validateFilePath is not a function` (E040)
3. `isTransientError is not a function` (E040)
4. `escapeRegex is not a function` (E040)

## Root Cause

During refactoring to snake_case naming convention, the exports in source files were updated but imports in consuming files were not:

### Issue 1: getDatabasePath (FIXED)
- `profile.js` exports `get_database_path` (snake_case)
- `context-server.js:1454` and `vector-index.js:100` called `getDatabasePath` (camelCase)

### Issue 2: validateFilePath (FIXED)
- `shared/utils.js` exports `validate_file_path` (snake_case)
- `context-server.js:55` and `vector-index.js:13` imported `validateFilePath` (camelCase)

### Issue 3: isTransientError / userFriendlyError (FIXED)
- `lib/errors.js` exports `is_transient_error` and `user_friendly_error` (snake_case)
- `context-server.js:214` imported `isTransientError` and `userFriendlyError` (camelCase)

### Issue 4: escapeRegex (FIXED)
- `shared/utils.js` exports `escape_regex` (snake_case)
- `lib/trigger-matcher.js:7` and `lib/memory-parser.js:9` imported `escapeRegex` (camelCase)

## Solution

Use import aliasing to map snake_case exports to camelCase local names:
```javascript
const { validate_file_path: validateFilePath } = require('../shared/utils');
const { escape_regex: escapeRegex } = require('../../shared/utils');
const { is_transient_error: isTransientError, user_friendly_error: userFriendlyError } = require('./errors.js');
```

## Files Modified

| File | Line | Change |
|------|------|--------|
| `mcp_server/context-server.js` | 55 | Import alias for `validateFilePath` |
| `mcp_server/context-server.js` | 214 | Import alias for `isTransientError`, `userFriendlyError` |
| `mcp_server/context-server.js` | 1454 | `getDatabasePath` → `get_database_path` |
| `mcp_server/lib/vector-index.js` | 13 | Import alias for `validateFilePath` |
| `mcp_server/lib/vector-index.js` | 100 | `getDatabasePath` → `get_database_path` |
| `mcp_server/lib/trigger-matcher.js` | 7 | Import alias for `escapeRegex` |
| `mcp_server/lib/memory-parser.js` | 9 | Import alias for `escapeRegex` |

## Verification

After fix:
1. Restart OpenCode (MCP server runs as child process)
2. Run `memory_health` - should return healthy status
3. Run `memory_index_scan` - should work without E040 error
4. Run `memory_save` - should work without E040 error
