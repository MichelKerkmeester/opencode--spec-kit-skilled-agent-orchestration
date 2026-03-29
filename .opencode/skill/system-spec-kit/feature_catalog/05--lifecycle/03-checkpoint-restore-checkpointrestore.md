---
title: "Checkpoint restore (checkpoint_restore)"
description: "Covers the checkpoint restore tool that decompresses snapshots and either replaces memory state atomically with `clearExisting=true` or merges with best-effort partial restore semantics by default."
---

# Checkpoint restore (checkpoint_restore)

## 1. OVERVIEW

Covers the checkpoint restore tool that decompresses snapshots and either replaces memory state atomically with `clearExisting=true` or merges with best-effort partial restore semantics by default.

This brings your knowledge base back to a previous snapshot, like using the undo button on a massive scale. If a replace-style restore fails partway through, nothing changes and your current data stays safe. In merge mode, successful rows can still commit while failures are reported as warnings. Restored memories are immediately searchable without any extra steps. The restore path now also enters a maintenance barrier that blocks mutation traffic until the restore lifecycle and post-restore rebuilds finish.

---

## 2. CURRENT REALITY

Restoring from a named checkpoint decompresses the gzip snapshot, validates every row against the database schema (a T107 fix that catches corrupted snapshots before they damage the database) and either merges with existing data or clears existing data first.

The `clearExisting` mode deserves explanation. When true, the entire restore runs inside a database transaction. If the restore encounters an error halfway through, the transaction rolls back and existing data is untouched. This atomicity guarantee (a T101 fix) is critical because clearing existing data and then failing to restore would leave you with an empty database and no way back.

When merging (the default), the system checks for duplicates using a logical key of `spec_folder + file_path + anchor_id`. Existing memories that match the logical key are skipped rather than duplicated, but row-level/table-level errors are accumulated and the successful subset can still commit. In other words, merge mode is intentionally best-effort and may return a partial-restore warning instead of full rollback semantics.

After restore, vectors are restored from the checkpoint snapshot when vector payloads are present. The restore handler then clears in-memory search/constitutional caches, rebuilds BM25 from live DB content when BM25 is enabled and refreshes the trigger cache. This keeps restored memories immediately discoverable without forcing a full re-embedding pass.

Checkpoint restore now acquires a module-level maintenance barrier before restore mutations begin and keeps it active through the post-restore rebuild sequence. While that barrier is active, concurrent `checkpoint_restore` calls and mutation traffic from `memory_save`, `memory_index_scan` and `memory_bulk_delete` fail fast with `E_RESTORE_IN_PROGRESS` instead of racing the restore lifecycle.

Barrier release is guaranteed in the restore `finally` path, so the maintenance window clears after both successful restores and failed restores.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/checkpoints.ts` | Checkpoint handler: create, list, restore, delete orchestration plus concurrent-restore barrier rejection |
| `mcp_server/lib/storage/checkpoints.ts` | Checkpoint storage: gzip decompression, schema validation, merge/clear-existing logic, transaction wrapping and restore maintenance barrier state |
| `mcp_server/handlers/memory-save.ts` | Mutation handler: fail-fast barrier check blocks `memory_save` during active checkpoint restore maintenance |
| `mcp_server/handlers/memory-index.ts` | Mutation handler: fail-fast barrier check blocks `memory_index_scan` during active checkpoint restore maintenance |
| `mcp_server/handlers/memory-bulk-delete.ts` | Mutation handler: fail-fast barrier check blocks `memory_bulk_delete` during active checkpoint restore maintenance |
| `mcp_server/core/db-state.ts` | Database state management and connection access |
| `mcp_server/lib/search/bm25-index.ts` | BM25 index rebuilt post-restore |
| `mcp_server/lib/search/vector-index.ts` | Vector index facade for post-restore cache refresh |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for checkpoint arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `checkpoint_restore` |
| `mcp_server/tools/lifecycle-tools.ts` | Lifecycle tool dispatcher for checkpoint tools |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-checkpoints.vitest.ts` | Checkpoint handler validation |
| `mcp_server/tests/handler-checkpoints-edge.vitest.ts` | Checkpoint lifecycle edge coverage (create/list/restore/delete) |
| `mcp_server/tests/checkpoints-extended.vitest.ts` | Checkpoint extended tests |
| `mcp_server/tests/checkpoints-storage.vitest.ts` | Checkpoint storage tests |
| `mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts` | Checkpoint lifecycle integration |

---

## 4. SOURCE METADATA

- Group: Lifecycle
- Source feature title: Checkpoint restore (checkpoint_restore)
- Current reality source: FEATURE_CATALOG.md
