---
title: "Single and folder delete (memory_delete)"
description: "Covers the delete tool that supports both single-memory and bulk folder deletion with atomic transactions."
---

# Single and folder delete (memory_delete)

## 1. OVERVIEW

Covers the delete tool that supports both single-memory and bulk folder deletion with atomic transactions.

You can remove one memory at a time or clear out an entire folder at once. Before a big deletion, the system takes a snapshot so you can undo it if you change your mind. Deletions are all-or-nothing: either everything you asked to remove is gone or nothing changes at all. This prevents situations where only half the data gets deleted and the rest is left in a messy state.

---

## 2. CURRENT REALITY

Two deletion modes in one tool. Pass a numeric `id` for single delete or a `specFolder` string (with `confirm: true`) for bulk folder delete.

Single deletes run inside a database transaction: remove the memory record via `vectorIndex.deleteMemory(id)`, clean up associated causal graph edges via `causalEdges.deleteEdgesForMemory(id)` and record a mutation ledger entry. If any step fails, the entire transaction rolls back. This atomicity guarantee was added in Phase 018 (CR-P1-1) to prevent partial deletes from leaving orphaned data.

Bulk deletes by spec folder are more involved. The system first creates an auto-checkpoint with a timestamped name (like `pre-cleanup-2026-02-28T12-00-00`) so you can roll back if the deletion was a mistake. Then it deletes all matching memories inside a database transaction with per-memory causal edge cleanup and per-memory mutation ledger entries. The entire operation is atomic: either all memories in the folder are deleted or none are. The response includes the checkpoint name and a restore command hint.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-crud-delete.ts` | Handler | Delete handler: single-ID and bulk-folder delete with atomic transactions |
| `mcp_server/handlers/memory-crud-utils.ts` | Handler | Shared CRUD utility helpers (ledger append, hash snapshot) |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | Delete argument type definitions |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch (cache invalidation) |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook builder |
| `mcp_server/lib/search/vector-index.ts` | Lib | Vector index facade for `deleteMemory()` |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge cleanup per deleted memory |
| `mcp_server/lib/storage/checkpoints.ts` | Lib | Auto-checkpoint creation before bulk folder delete |
| `mcp_server/lib/storage/mutation-ledger.ts` | Lib | Mutation audit ledger |
| `mcp_server/lib/storage/history.ts` | Lib | Per-memory DELETE history writes |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Degree cache clearing after delete |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-memory-crud.vitest.ts` | CRUD handler validation |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Extended transactional mutation scenarios |
| `mcp_server/tests/memory-delete-cascade.vitest.ts` | Delete cascade behavior |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge unit tests |
| `mcp_server/tests/mutation-ledger.vitest.ts` | Mutation ledger tests |

---

## 4. SOURCE METADATA

- Group: Mutation
- Source feature title: Single and folder delete (memory_delete)
- Current reality source: FEATURE_CATALOG.md
- Source list updated 2026-03-26 per audit remediation
