# P0 Fix Summary: Memory Search 0-Results Bug

**Date:** 2026-04-01
**Executor:** Copilot CLI (GPT 5.4 model) orchestrated by Claude Code (Opus 4.6)
**Build status:** PASS (all three packages: shared, mcp-server, scripts)

---

## Root Cause

`resolve_database_path()` in `vector-index-store.ts` picks the database file based on the embedding provider singleton state. After lazy Voyage-4 initialization, it resolves to an empty provider-specific database (`context-index__voyage__voyage-4__1024.sqlite`) instead of the populated `context-index.sqlite` (1728 memories). All downstream search functions silently return empty arrays because the new database has no rows.

---

## Fixes Applied

### Fix 1: Stabilize resolve_database_path()

**File:** `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` (lines 277-299)
**Change:** +17 -8 lines

The function now:
- Returns `MEMORY_DB_PATH` env var immediately when set (never drifts)
- Falls back to `DEFAULT_DB_PATH` (`context-index.sqlite`) as the stable default
- Computes the provider-specific path only for comparison purposes
- Logs `console.error('[vector-index] WARNING: Provider-specific DB path differs from resolved path ...')` when drift is detected
- Never silently switches databases mid-session

### Fix 2: Prevent reinitializeDatabase() from rebinding to empty DB

**File:** `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts` (lines 285-310)
**Change:** +27 -0 lines

After `vectorIndex.initializeDb()` and before `rebindDatabaseConsumers()`:
- Counts rows via `SELECT COUNT(*) as cnt FROM memory_index`
- If count is 0, performs `PRAGMA database_list` comparison against expected path to detect drift
- Logs `'[db-state] WARNING: New database has 0 memories -- refusing to rebind consumers to empty DB'`
- Returns `false` (refuses rebind) unless `SPECKIT_FORCE_REBIND=true`

### Fix 3: Startup health check with auto-backfill

**File:** `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` (lines 1455-1476 + import at line 79)
**Change:** +24 -0 lines

After database initialization and before module init:
- Counts `memory_index` rows and `active_memory_projection` rows
- Logs `'[context-server] Startup health: memory_index=%d, active_memory_projection=%d'`
- If memory_index has rows but active_memory_projection is empty/missing, calls `runLineageBackfill(database)` and logs seeded count
- If both are 0, warns that search will return no results until memories are saved

### Fix 4: Add warnings to silent return [] in hybrid-search.ts

**File:** `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` (4 locations)
**Change:** +7 -4 lines

Replaced silent one-liner guards with explicit `console.warn()` before return:
1. `bm25Search()` line 330: `'[hybrid-search] BM25 not enabled -- returning empty bm25Search results'`
2. `isFtsAvailable()` line 428: `'[hybrid-search] db not initialized -- isFtsAvailable returning false'`
3. `ftsSearch()` line 454: `'[hybrid-search] db not initialized or FTS unavailable -- returning empty ftsSearch results'`
4. `structuralSearch()` line 1799: `'[hybrid-search] db not initialized -- returning empty structuralSearch results'`

---

## Verification

| Check | Result |
|---|---|
| `npm run build` (shared) | PASS |
| `npm run build` (mcp-server) | PASS |
| `npm run build` (scripts) | PASS |
| TypeScript `--noEmit` (copilot internal) | PASS |
| Alignment drift verifier | PASS |

---

## New Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `SPECKIT_FORCE_REBIND` | `undefined` (false) | Set to `true` to force rebinding consumers even when the new DB is empty |

---

## Defense-in-Depth Chain

1. **vector-index-store** -- stable path resolution prevents drift at the source
2. **db-state** -- empty-DB guard prevents rebinding consumers to a wrong database
3. **context-server** -- startup health check detects and auto-heals projection gaps
4. **hybrid-search** -- observable warnings make any remaining silent failures visible in logs
