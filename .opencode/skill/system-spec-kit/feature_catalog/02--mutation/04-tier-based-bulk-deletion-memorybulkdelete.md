---
title: "Tier-based bulk deletion (memory_bulk_delete)"
description: "Covers the bulk delete tool that targets entire importance tiers with safety checkpoints and constitutional protection."
---

# Tier-based bulk deletion (memory_bulk_delete)

## 1. OVERVIEW

Covers the bulk delete tool that targets entire importance tiers with safety checkpoints and constitutional protection.

This is the cleanup tool for large-scale housekeeping. You can delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection so they cannot be accidentally wiped. A safety snapshot is taken first so you can restore if needed.

---

## 2. CURRENT REALITY

For large-scale cleanup operations. Instead of targeting a folder, you target an importance tier: delete all deprecated memories, or all temporary memories older than 30 days. The tool counts affected memories first (so the response tells you exactly how many were deleted), creates a safety checkpoint, then deletes within a database transaction.

Constitutional and critical tier memories receive extra protection. Unscoped deletion of these tiers is refused outright. You must provide a `specFolder` to delete constitutional or critical memories in bulk. The `skipCheckpoint` speed optimization, which skips the safety checkpoint for faster execution, is also rejected for these tiers. If the checkpoint creation itself fails for constitutional/critical, the entire operation aborts. For lower tiers, a checkpoint failure triggers a warning but the deletion proceeds because the risk of losing deprecated or temporary memories is low.

Each deleted memory gets its causal graph edges removed. A single consolidated mutation ledger entry (capped at 50 linked memory IDs to avoid ledger bloat) records the bulk operation. All caches are invalidated after deletion.

The `olderThanDays` parameter is validated as a positive integer (>= 1) before query construction. Values that are zero, negative, non-integer, or NaN return a validation error rather than silently removing the age filter. The `tool-schemas.ts` definition enforces `minimum: 1` at the schema level.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-bulk-delete.ts` | Handler | Bulk delete handler: tier targeting, constitutional protection, checkpoint safety, atomic deletion |
| `mcp_server/handlers/memory-crud-utils.ts` | Handler | Shared CRUD utility helpers (ledger append) |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch (cache invalidation) |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook builder |
| `mcp_server/lib/search/vector-index.ts` | Lib | Vector index facade for memory deletion |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge cleanup per deleted memory |
| `mcp_server/lib/storage/checkpoints.ts` | Lib | Safety checkpoint creation before bulk delete |
| `mcp_server/lib/storage/mutation-ledger.ts` | Lib | Consolidated mutation audit ledger (capped at 50 IDs) |
| `mcp_server/lib/storage/history.ts` | Lib | Per-memory DELETE history writes during tier bulk delete |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | `MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS` constant and Zod schema |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-memory-crud.vitest.ts` | CRUD handler validation (includes bulk delete) |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Extended mutation scenarios |
| `mcp_server/tests/checkpoints-storage.vitest.ts` | Checkpoint storage tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/mutation-ledger.vitest.ts` | Mutation ledger tests |

---

## 4. SOURCE METADATA

- Group: Mutation
- Source feature title: Tier-based bulk deletion (memory_bulk_delete)
- Current reality source: direct implementation audit of `memory-bulk-delete.ts`, related mutation/storage helpers, and the listed Vitest coverage
- Source list updated 2026-03-26 per audit remediation
