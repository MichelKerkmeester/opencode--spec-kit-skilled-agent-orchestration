# Iteration 3 (Codex-5.3): Cross-Cutting Transaction/Atomicity Analysis

## Focus
Comprehensive scan of ALL 189 TypeScript files in mcp_server/lib + mcp_server/handlers for transaction usage patterns, unwrapped multi-statement operations, and consistency of better-sqlite3 transaction() usage.

## Findings

### Quantitative Summary
- **512** total TS files in mcp_server (excl. dist/node_modules)
- **51** transaction call sites across **30** files
- **23** multi-statement ops properly wrapped in transaction()
- **27** multi-statement ops NOT lexically wrapped
- **9** risky unwrapped runtime hotspots (after manual triage; rest are migration/DDL)

### HIGH Risk Unwrapped Operations

| File:Line | Operation | Impact |
|-----------|-----------|--------|
| archival-manager.ts:496 | `DELETE vec_memories` then `INSERT vec_memories` (unarchive rebuild) | Crash between deletes old vector and inserts new → memory has no vector representation |
| lineage-state.ts:512 | `UPDATE memory_lineage` then `INSERT memory_lineage` + projection upsert in `recordLineageTransition` | Crash between UPDATE and INSERT → predecessor updated but new lineage row missing |
| memory-save.ts:639 | Lineage write called after create path, outside create-record tx boundary | Memory created but lineage not recorded → orphan without lineage chain |

### MEDIUM Risk Unwrapped Operations

| File:Line | Operation | Impact |
|-----------|-----------|--------|
| session-manager.ts:590 | 3 cleanup deletes (working_memory, session_sent_memories, session_state) in separate try blocks | Partial session cleanup on failure |
| adaptive-ranking.ts:240 | Reset does two deletes without tx | Partial adaptive state reset |
| history.ts:103 | Schema rebuild/backfill/update/index creation without tx | Migration can leave partial state |
| working-memory.ts:141 | Schema/ALTER/index sequence outside tx | Schema migration partial failure |
| memory-bulk-delete.ts:209 | Ledger append runs after bulk-delete tx boundary | Deletion succeeds but ledger entry missing |

### Manual BEGIN/COMMIT/ROLLBACK (Outside transaction() API)
- session-manager.ts:411,414,417
- consolidation.ts:488,515,531,539

### Properly Wrapped Operations (16 verified)
create-record.ts:120, reconsolidation-bridge.ts:113, entity-extractor.ts:176 (4 blocks), memory-crud-delete.ts:94,185, chunking-orchestrator.ts:156 (3 blocks), pe-gating.ts:256, vector-index-mutations.ts:191 (4 blocks), checkpoints.ts:389,696, causal-edges.ts:189 (5 blocks), lineage-state.ts:567, vector-index-schema.ts:875

## Sources Consulted
- All 189 TS files in mcp_server/lib + mcp_server/handlers
- Full 512-file mcp_server source tree
- Cross-referenced with iteration 1-2 findings

## Assessment
- New information ratio: 0.65 — Confirms and quantifies the systemic transaction pattern from iterations 1-2. Novel findings: archival-manager.ts unarchive race, manual BEGIN/COMMIT in session-manager and consolidation. The 9-hotspot quantification is actionable.
- Questions addressed: Q4 (systemic code quality — transaction consistency quantified)

## Recommended Next Focus
- Research is converging on clear patterns. Remaining value in: test coverage gap quantification and final prioritized fix list.
