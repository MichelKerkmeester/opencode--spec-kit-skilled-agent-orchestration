# Startup pending-file recovery

## Current Reality

On server startup, the transaction manager scans for leftover `_pending` files created by interrupted atomic-write operations. If a previous `memory_save` wrote the pending file and committed the DB row but crashed before renaming, the pending file is the only surviving copy of the content. The recovery routine finds these orphans via `findPendingFiles()`, renames each to its final path, and increments `totalRecoveries` in the transaction metrics.

Recovery is automatic and requires no user intervention. If the pending file is stale (the DB row was never committed), it is logged and left for manual review rather than silently deleted.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Atomic write + pending-file recovery |
| `mcp_server/context-server.ts` | Core | Startup hook that triggers recovery |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction manager tests |

## Source Metadata

- Group: Lifecycle
- Source feature title: Startup pending-file recovery
- Current reality source: audit-D04 gap backfill
