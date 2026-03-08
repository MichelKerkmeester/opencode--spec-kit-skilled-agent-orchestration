# Atomic pending-file recovery

## Current Reality

The transaction manager maintains an atomic write protocol where memory files are first written to a `_pending` path and only renamed to their final location after the database transaction commits. When a crash or error interrupts this sequence after DB commit but before rename, a `_pending` file is left on disk as a recoverable artifact.

The `findPendingFiles()` function scans the memory directories for files matching the `_pending` suffix. Each discovered pending file is checked against the database: if the corresponding DB row exists (committed), the file is renamed to its final path completing the interrupted operation. The `recoverPendingFile()` function handles individual file recovery and updates the `totalRecoveries` metric. This mechanism ensures zero data loss from interrupted save operations.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Pending file detection and recovery |
| `mcp_server/context-server.ts` | Core | Startup recovery invocation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction manager tests |
| `mcp_server/tests/transaction-manager-extended.vitest.ts` | Transaction extended tests |

## Source Metadata

- Group: Pipeline architecture
- Source feature title: Atomic pending-file recovery
- Current reality source: audit-D04 gap backfill
