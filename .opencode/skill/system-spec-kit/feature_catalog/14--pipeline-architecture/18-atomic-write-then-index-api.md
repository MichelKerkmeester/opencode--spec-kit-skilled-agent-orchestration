# Atomic write-then-index API

## Current Reality

The `memory_save` handler offers an atomic write-then-index mode where file writing and database indexing are coupled in a single transactional unit. The transaction manager writes the memory content to a `_pending` temporary file, inserts the database row (memory_index, vec_memories, BM25 tokens) inside a SQLite transaction, and only renames the pending file to its final path after the DB commit succeeds. If the DB transaction fails, the pending file is cleaned up and no partial state is left on disk.

This ensures that a memory file and its corresponding index entry either both exist or neither does. The `AtomicSaveResult` interface reports `dbCommitted` status so callers can distinguish between a full success and a partial commit (DB succeeded but rename failed, leaving a pending file for startup recovery).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Atomic write + DB transaction coupling |
| `mcp_server/handlers/memory-save.ts` | Handler | Save handler using atomic write path |
| `mcp_server/tool-schemas.ts` | Core | Tool schema definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction manager tests |
| `mcp_server/tests/transaction-manager-extended.vitest.ts` | Transaction extended tests |

## Source Metadata

- Group: Pipeline architecture
- Source feature title: Atomic write-then-index API
- Current reality source: audit-D04 gap backfill
