---
title: "Working Memory Session Cleanup Timestamp Fix"
description: "Tracks the fix for incorrect session cleanup caused by mismatched timestamp formats between SQLite and JavaScript."
---

# Working Memory Session Cleanup Timestamp Fix

## 1. OVERVIEW

Tracks the fix for incorrect session cleanup caused by mismatched timestamp formats between SQLite and JavaScript.

The system was accidentally deleting active sessions because it compared timestamps written in two different formats. It is like comparing "March 14" to "14/03" and getting confused about which date is newer. The fix makes both sides use the same format so active sessions are kept and only truly expired ones are cleaned up.

---

## 2. CURRENT REALITY

The `cleanupOldSessions()` method in the working memory manager compared `last_focused` timestamps (stored via SQLite `CURRENT_TIMESTAMP` as `YYYY-MM-DD HH:MM:SS`) against JavaScript `toISOString()` output (`YYYY-MM-DDTHH:MM:SS.sssZ`). The lexicographic comparison failed because space (ASCII 32) sorts before `T` (ASCII 84), causing active sessions to be incorrectly deleted. The fix replaces the JavaScript Date comparison with SQLite-native `datetime()` math: `DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')`, keeping the comparison entirely within SQLite's datetime system.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Session lifecycle and cleanup logic |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/working-memory.vitest.ts` | Working-memory module coverage (including `cleanupOldSessions` export and `working_memory` table usage) |
| `mcp_server/tests/session-manager-stress.vitest.ts` | Direct cleanup regression coverage for expired vs active sessions with SQLite `CURRENT_TIMESTAMP` format |

---

## 4. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Source feature title: Working Memory Session Cleanup Timestamp Fix
- Current reality source: P0 code review finding (2026-03-08)
