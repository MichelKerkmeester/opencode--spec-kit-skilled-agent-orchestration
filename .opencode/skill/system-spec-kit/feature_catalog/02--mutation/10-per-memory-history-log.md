---
title: "Per-memory history log"
description: "Covers the per-memory audit trail that records ADD, UPDATE and DELETE mutation events in the `memory_history` table."
---

# Per-memory history log

## 1. OVERVIEW

Covers the per-memory audit trail that records ADD, UPDATE and DELETE mutation events in the `memory_history` table.

Every time a memory is created, changed or deleted, the system writes a log entry recording what happened, when and who did it. This is like a change history on a shared document. If something looks wrong later, you can trace back to exactly what changed and when it happened.

---

## 2. CURRENT REALITY

The `memory_history` table records a per-memory audit trail of mutation events. Each row captures the memory ID, event type (`ADD`, `UPDATE`, `DELETE`), timestamp, actor and optional `prev_value`/`new_value` payloads. This provides a lifecycle trace for individual memories and supports audit/debug workflows such as "show me all mutation events for memory #42."

The history log is written by mutation handlers (`memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`) and lower-level mutation helpers (`delete_memories`, `delete_memory_by_path`). `lib/storage/history.ts` owns schema-safe initialization/migration and read/write helpers, while `vector-index-schema.ts` ensures initialization runs at DB startup. The orphan cleanup script removes orphaned history rows when parent memories are missing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts` | Lib | History table init/migration and `recordHistory`/query helpers |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Lib | DB startup initialization for `memory_history` |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts` | Handler | Writes `ADD` events in save flow |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Handler | Writes `UPDATE` events in update flow |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | Handler | Writes `DELETE` events in delete flow |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Handler | Writes `DELETE` events for bulk tier deletion |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` | Lib | Writes `DELETE` events for mutation API delete helpers |
| `.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts` | Script | Removes orphaned `memory_history` rows and orphaned vectors |

### Tests

| File | Focus |
|------|-------|
| `.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts` | History schema migration, actor format coverage, and boundary validation |
| `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts` | Mutation handler integration paths that write history events |

---

## 4. SOURCE METADATA

- Group: Mutation
- Source feature title: Per-memory history log
- Current reality source: audit-D04 gap backfill
