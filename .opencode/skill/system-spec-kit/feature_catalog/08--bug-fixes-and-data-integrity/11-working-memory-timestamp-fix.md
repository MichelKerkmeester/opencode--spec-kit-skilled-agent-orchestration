# Working Memory Session Cleanup Timestamp Fix

## Current Reality

The `cleanupOldSessions()` method in the working memory manager compared `last_focused` timestamps (stored via SQLite `CURRENT_TIMESTAMP` as `YYYY-MM-DD HH:MM:SS`) against JavaScript `toISOString()` output (`YYYY-MM-DDTHH:MM:SS.sssZ`). The lexicographic comparison failed because space (ASCII 32) sorts before `T` (ASCII 84), causing active sessions to be incorrectly deleted. The fix replaces the JavaScript Date comparison with SQLite-native `datetime()` math: `DELETE FROM working_memory_sessions WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')`, keeping the comparison entirely within SQLite's datetime system.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Session lifecycle and cleanup logic |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/cognitive-gaps.vitest.ts` | Cognitive layer gap coverage |

## Source Metadata

- Group: Bug Fixes and Data Integrity
- Source feature title: Working Memory Session Cleanup Timestamp Fix
- Current reality source: P0 code review finding (2026-03-08)
