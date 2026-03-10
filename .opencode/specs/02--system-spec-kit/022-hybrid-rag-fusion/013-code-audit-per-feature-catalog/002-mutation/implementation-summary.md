# Implementation Summary: 002-Mutation Code Audit

## Overview

Phase 002 of the 20-phase feature-centric code audit. Addressed 9 tasks (3 P0 + 6 P1) across 10 mutation features in the Spec Kit Memory MCP server.

## Changes by Workstream

### WS-1: T-01 — olderThanDays Validation + Bulk-Delete History
- `schemas/tool-input-schemas.ts` — Zod `min(0)` → `min(1)` to align with JSON schema
- `handlers/memory-bulk-delete.ts` — Wired `recordHistory('DELETE')` inside bulk-delete transaction loop

### WS-2: T-02 — Correction Undo Relation-Scoped
- `lib/learning/corrections.ts` — Scoped causal edge DELETE by relation type (`supersedes`/`derived_from`); replaced empty catch with `console.warn`

### WS-3: T-03 — Wire recordHistory into Save Handler
- `lib/storage/history.ts` — Removed restrictive CHECK constraint on actor column to allow `mcp:*` actors
- `handlers/save/create-record.ts` — Wired `recordHistory('ADD')` inside save transaction

### WS-4: T-05 — BM25 Re-index Transactional + recordHistory('UPDATE')
- `handlers/memory-crud-update.ts` — Infrastructure vs data failure distinction for BM25 errors; data failures roll back transaction; wired `recordHistory('UPDATE')`

### WS-5: T-06 — Prevent Partial Bulk-Folder Deletes + recordHistory('DELETE')
- `handlers/memory-crud-delete.ts` — No-DB bulk-folder path now throws instead of silently iterating; wired `recordHistory('DELETE')` in both single and bulk paths

### WS-6: T-04 + T-07 — Reconsolidation Gating + Confidence Tracker
- `handlers/save/reconsolidation-bridge.ts` — Collapsed dual reconsolidation gating to single canonical gate (`search-flags.ts`)
- `lib/scoring/confidence-tracker.ts` — `recordValidation` now throws on DB errors (explicit failure signaling)

### WS-7: T-08 + T-09 — Doc Fix + PE Decision Logging
- `feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md` — Added missing handler files to source table; removed stale entries
- `lib/cognitive/prediction-error-gate.ts` — Extended PE decision logging to ALL decisions (no-candidate, filtered-out, low-match)

### Test Updates
- `tests/confidence-tracker.vitest.ts` — 3 tests updated to expect throw behavior (T103-01b, T103-02a, T103-03-recordValidation)

### WS-8: Cross-AI Review Fixes (4 rounds)
- `handlers/save/reconsolidation-bridge.ts` — Added `recordHistory('ADD')` to reconsolidation conflict pre-store path (7th call site)
- `lib/storage/history.ts` — Schema migration: removes legacy CHECK(actor IN) + FOREIGN KEY constraints; no FK so DELETE history persists as audit trail
- `lib/search/vector-index-schema.ts` — Same migration in companion tables; added `initHistory(database)` alongside `ensureCompanionTables()` for production init
- `lib/search/vector-index-mutations.ts` — Removed `DELETE FROM memory_history WHERE memory_id = ?` from both `delete_memory()` and `delete_memories()` — history rows now survive deletion
- `handlers/memory-bulk-delete.ts` — Reordered `recordHistory('DELETE')` BEFORE `deleteMemory()`; added `?? null` coalescing (P2-03)
- `handlers/memory-crud-delete.ts` — Reordered `recordHistory('DELETE')` BEFORE `deleteMemory()` in both single and bulk paths

### Test Updates (WS-8)
- `tests/history.vitest.ts` — 4 new regression tests: T508-06a (migration removes CHECK + FK), T508-06b-c (mcp:* actors accepted), T508-06d (migration preserves existing rows)
- `tests/memory-save-ux-regressions.vitest.ts` — FK-safe cleanup: delete `memory_history` rows before `memory_index` rows

### WS-9: Comprehensive Delete Audit Coverage (R5 + R6 fixes)
- `context-server.ts` — Added import + `recordHistory('DELETE')` before file-watcher `deleteMemory()` calls (`mcp:file_watcher` actor)
- `cli.ts` — Added import + `recordHistory('DELETE')` before CLI bulk-delete `deleteMemory()` calls (`mcp:cli_bulk_delete` actor)
- `handlers/memory-index.ts` — Added import + `recordHistory('DELETE')` before stale-record cleanup `deleteMemory()` calls (`mcp:memory_index_scan` actor)
- `handlers/chunking-orchestrator.ts` — Added import + `recordHistory('DELETE')` before all `deleteMemory()` calls AND raw SQL `DELETE FROM memory_index` paths:
  - Force re-chunk child deletes (`mcp:chunking_reindex`)
  - Rollback parent+child deletes (`mcp:chunking_rollback`)
  - Safe-swap old child cleanup via SELECT+loop before bulk DELETE (`mcp:chunking_reindex`)
  - Failed finalize staged chunk cleanup (`mcp:chunking_rollback`)
- `lib/storage/reconsolidation.ts` — Added import + `recordHistory('DELETE')` before orphan conflict cleanup raw SQL (`mcp:reconsolidation_cleanup` actor)
- `lib/storage/checkpoints.ts` — Added import + `recordHistory('DELETE')` before checkpoint restore clearExisting DELETE (scoped + full table) (`mcp:checkpoint_restore` actor)
- `lib/search/vector-index-queries.ts` — Added import + `recordHistory('DELETE')` before integrity check autoClean orphaned chunk DELETE (`mcp:integrity_check` actor)

## Verification

- **TSC:** Clean (`npx tsc --noEmit` — 0 errors)
- **Tests:** 7 failed | 239 passed (246 files), 7203 tests passed — all 7 failures are pre-existing, none caused by this audit

### Review Results

| Reviewer | Score | Verdict | P0 | P1 | P2 |
|----------|-------|---------|----|----|-----|
| Claude @review | 82/100 | APPROVE | 0 | 2 (mitigated) | 5 |
| GPT-5.4 cross-AI R1 | 72/100 | REQUEST_CHANGES | 0 | 2 | 1 |
| GPT-5.4 cross-AI R2 | 84/100 | REQUEST_CHANGES | 0 | 1 (init gap) | 1 |
| GPT-5.4 cross-AI R3 | 74/100 | REQUEST_CHANGES | 0 | 3 (FK/order) | 0 |
| GPT-5.4 cross-AI R4 | 82/100 | REQUEST_CHANGES | 0 | 1 (deleteMemories) | 0 |
| GPT-5.4 cross-AI R5 | 78/100 | REQUEST_CHANGES | 0 | 4 (unaudited delete paths) | 1 |
| GPT-5.4 cross-AI R6 | 82/100 | REQUEST_CHANGES | 0 | 2 (raw SQL delete paths) | 1 |
| GPT-5.4 cross-AI R7 | 78/100 | REQUEST_CHANGES | 0 | 2 (checkpoint restore + integrity check) | 1 |
| GPT-5.4 cross-AI R8 | 88/100 | REQUEST_CHANGES | 0 | 2 (mutation module APIs) | 1 |
| GPT-5.4 cross-AI R9 | 88/100 | REQUEST_CHANGES | 0 | 1 (checkpoint false history) | 0 |
| GPT-5.4 cross-AI R10 | 89/100 | REQUEST_CHANGES | 0 | 1 (false DELETE history) | 0 |
| **GPT-5.4 cross-AI R11** | **98/100** | **APPROVE** | **0** | **0** | **0** |

**GPT-5.4 findings resolved across 5 rounds:**
1. R1-P1-1: Reconsolidation conflict pre-store missing `recordHistory('ADD')` → **Fixed**
2. R1-P1-2: History schema migration for legacy CHECK constraint → **Fixed**
3. R2-P1: Runtime `history.init(db)` never called → **Fixed** via `initHistory(database)` in schema setup
4. R3-P1-1: `recordHistory('DELETE')` after `deleteMemory()` FK-fails → **Fixed**: removed FK, reordered calls, history persists
5. R3-P1-2: Reconsolidation flag regression → **Intentional** (T-04 design, internal guard retained)
6. R3-P1-3: Reconsolidation conflict cleanup FK-fail → **Fixed** by FK removal
7. R4-P1: `deleteMemories()` still wiped `memory_history` → **Fixed**: removed DELETE FROM memory_history
8. R5-P1-1: `context-server.ts` file-watcher delete path unaudited → **Fixed**: added `recordHistory('DELETE')` with `mcp:file_watcher` actor
9. R5-P1-2: `cli.ts` CLI bulk-delete path unaudited → **Fixed**: added `recordHistory('DELETE')` with `mcp:cli_bulk_delete` actor
10. R5-P1-3: `handlers/memory-index.ts` stale-record cleanup unaudited → **Fixed**: added `recordHistory('DELETE')` with `mcp:memory_index_scan` actor
11. R5-P1-4: `handlers/chunking-orchestrator.ts` force re-chunk and rollback paths unaudited → **Fixed**: added `recordHistory('DELETE')` with `mcp:chunking_reindex` and `mcp:chunking_rollback` actors
12. R5-P2: `getHistoryStats(specFolder)` inner join loses deleted memories' history → **Deferred** (stats reporting, not data loss)
13. R6-P1-1: `chunking-orchestrator.ts:445` safe-swap raw SQL deletes old children without history → **Fixed**: SELECT old child IDs + recordHistory per child before DELETE
14. R6-P1-2: `chunking-orchestrator.ts:496` failed finalize cleanup raw SQL deletes staged chunks without history → **Fixed**: recordHistory per child before raw DELETE
15. R6-P1-3: `reconsolidation.ts:519` orphan conflict cleanup raw SQL without history → **Fixed**: added recordHistory('DELETE') with `mcp:reconsolidation_cleanup` actor
16. R7-P1-1: `checkpoints.ts:704,706` restoreCheckpoint clearExisting raw SQL without history → **Fixed**: record DELETE for scoped/all memories before raw delete, `mcp:checkpoint_restore` actor
17. R7-P1-2: `vector-index-queries.ts:1360` verify_integrity autoClean raw SQL without history → **Fixed**: record DELETE per orphaned chunk before raw delete, `mcp:integrity_check` actor
18. R8-P1-1: `delete_memories()` not self-recording DELETE history → **Fixed**: added recordHistory per memory inside function, `mcp:delete_memories` actor
19. R8-P1-2: `delete_memory_by_path()` not self-recording DELETE history → **Fixed**: added recordHistory before delegating to delete_memory(), `mcp:delete_by_path` actor
20. R9-P1: `checkpoints.ts` false DELETE history for snapshot-only IDs → **Fixed**: changed loop to iterate `currentScopedMemoryIds` instead of `scopedMemoryIdsToReplace`
21. R10-P1: `memory-crud-delete.ts` and `memory-bulk-delete.ts` record DELETE history before confirming deleteMemory() success → **Fixed**: moved recordHistory AFTER confirmed deletion in all 3 handler paths

## Key Design Decisions

1. **recordHistory convention:** `mcp:<tool_name>` actor format, best-effort try/catch inside transactions, consistent `(memoryId, event, prevValue, newValue, actor)` signature across 20+ production call sites. Handler paths record AFTER confirmed delete; raw SQL paths record BEFORE (where ID existence is confirmed by query)
2. **BM25 failure classification:** Infrastructure failures (mock DB, missing prepare) → warn + continue; data failures → re-throw to roll back transaction
3. **Confidence tracker throw behavior:** Replaced success-shaped fallback with explicit throw to prevent downstream side-effects on stale data
4. **Reconsolidation single gate:** `search-flags.ts:isReconsolidationEnabled()` is the canonical gate; `reconsolidate()` retains internal guard as safety net
5. **Schema migration strategy:** Check `sqlite_master` for legacy CHECK constraint, rebuild table via rename→create→insert→drop pattern
6. **History init at DB setup:** `initHistory(database)` called alongside `ensureCompanionTables()` in `vector-index-schema.ts` to guarantee `recordHistory()` works at runtime without manual init
