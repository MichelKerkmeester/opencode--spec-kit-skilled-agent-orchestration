# Tasks: 003-Discovery Phase

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0       | 0     | FAIL status findings (correctness bugs, behavior mismatches) |
| P1       | 2     | WARN with behavior mismatch or significant code issues |
| P2       | 1     | WARN with documentation/test gaps only |
| **Total** | **3** | |

---

## P0 — Critical / Correctness

_No P0 findings in this phase._

---

## P1 — Behavior Mismatch / Significant Code Issues

### T-01: Fix inaccurate folder total in memory_stats summary string
- **Priority:** P1
- **Feature:** F-02 System statistics (memory_stats)
- **Status:** TODO
- **Source:** `mcp_server/handlers/memory-crud-stats.ts:229`
- **Issue:** Summary text uses `topFolders.length` instead of `totalSpecFolders` when result limits truncate the ranking output. When `safeLimit < totalSpecFolders`, the summary reads e.g. "10 folders" instead of the actual total, misleading callers about system scale. `totalSpecFolders` is correctly computed (line 137 count mode, line 216 scoring mode) but not used in the summary string.
- **Fix:** Update the summary string to use `totalSpecFolders` instead of `topFolders.length` for accurate folder count reporting. Add tests for the `computeFolderScores` fallback path and limit truncation behavior. Remove stale `retry.vitest.ts` catalog entry.

### T-02: Include requestId in all memory_health error responses
- **Priority:** P1
- **Feature:** F-03 Health diagnostics (memory_health)
- **Status:** TODO
- **Source:** `mcp_server/handlers/memory-crud-health.ts:206,269`
- **Issue:** `requestId` (generated at line 206) is only included in the `E_SCHEMA_MISSING` error response, not in other error paths or the success response, limiting incident correlation for non-schema errors. The `sanitizeErrorForHint` function also strips all absolute paths including project-relative ones that could help debugging.
- **Fix:** Include `requestId` consistently across all error responses, not just `E_SCHEMA_MISSING`. Review whether path sanitization should preserve safe project-relative hints. Add handler-level tests for `divergent_aliases` report mode, `autoRepair` orphan cleanup path, and schema-missing error path. Remove stale `retry.vitest.ts` catalog entry.

---

## P2 — Documentation / Test Gaps

### T-03: Close memory_list handler edge-case test coverage
- **Priority:** P2
- **Feature:** F-01 Memory browser (memory_list)
- **Status:** TODO
- **Source:** `mcp_server/handlers/memory-crud-list.ts:43,58-60,108-113`
- **Issue:** No handler-level test validates edge cases: offset exceeding total count hint (line 111-112), empty `specFolder` string behavior, or invalid `sortBy` fallback to `created_at` (line 58-60). Listed test file `retry.vitest.ts` does not exist.
- **Fix:** Add handler-level tests for offset-beyond-total pagination hint, empty `specFolder` input, and `sortBy` fallback behavior. Remove stale `retry.vitest.ts` from the feature table or add the missing test file.
