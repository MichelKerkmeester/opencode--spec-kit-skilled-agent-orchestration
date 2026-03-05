# Wave 3 — Sprint 1 Batch 2 (S1-B2) DONE

## Task: T004 — Agent UX Instrumentation

## Files Modified

### New Files
1. `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts`
   - New module: `consumption_log` SQLite table management
   - Exports: `initConsumptionLog`, `logConsumptionEvent`, `getConsumptionStats`, `getConsumptionPatterns`, `isConsumptionLogEnabled`
   - Feature flag: `SPECKIT_CONSUMPTION_LOG` (default true)

2. `.opencode/skill/system-spec-kit/mcp_server/tests/t010c-consumption-logger.vitest.ts`
   - 35 tests across 6 test groups (T001-T006)
   - All 35 pass

### Modified Files
3. `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
   - Added import: `initConsumptionLog`, `logConsumptionEvent` from consumption-logger
   - Added `_searchStartTime = Date.now()` at start of `handleMemorySearch`
   - Added fail-safe hook at END of `handleMemorySearch` (before return) that logs `event_type: 'search'`

4. `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
   - Added imports: `initConsumptionLog`, `logConsumptionEvent`, `vectorIndex`
   - Added `_contextStartTime = Date.now()` at start of `handleMemoryContext`
   - Refactored final `return createMCPResponse(...)` to capture response first, then log, then return
   - Added fail-safe hook that logs `event_type: 'context'`

5. `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
   - Added import: `initConsumptionLog`, `logConsumptionEvent` from consumption-logger
   - Refactored final `return createMCPSuccessResponse(...)` to capture response then log then return
   - Added fail-safe hook that logs `event_type: 'triggers'` using `attentionDecay.getDb()`

## Tests

- New tests: 35 in `t010c-consumption-logger.vitest.ts`
- All 35 pass
- Pre-existing failures in worktree (51 test files): all due to `@spec-kit/shared` package resolution error in worktree environment (not caused by this change)

## Decisions Made

1. **Timestamp column**: Removed `DEFAULT (datetime('now'))` from CREATE TABLE (not supported by better-sqlite3 expression defaults). Timestamp set explicitly in INSERT via `new Date().toISOString()`.

2. **Database access in hooks**:
   - `memory-search.ts`: Uses `requireDb()` wrapped in try/catch (main DB access pattern)
   - `memory-context.ts`: Uses `vectorIndex.getDb()` directly (avoids requiring DB when not initialized)
   - `memory-triggers.ts`: Uses `attentionDecay.getDb()` (already available in that module's scope)

3. **Session query bug fix**: The `getConsumptionStats` session count query had a duplicate WHERE clause (`WHERE ... WHERE session_id IS NOT NULL`). Fixed by merging `session_id IS NOT NULL` into the conditions array.

4. **Pattern category 5 (session-heavy)**: Session ID display uses full ID for IDs ≤36 chars (tests), truncates to 36+`...` for longer IDs (UUIDs are exactly 36 chars).

5. **Fail-safe pattern**: All instrumentation wrapped in `try { } catch { }` at the outer level. Inner parse errors for result ID extraction also wrapped separately. Instrumentation never throws.

## Passing Test Count: 35/35
