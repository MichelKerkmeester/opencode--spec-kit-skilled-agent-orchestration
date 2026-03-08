# Per-memory history log

## Current Reality

The `memory_history` table records a per-memory audit trail of state changes. Each row captures the memory ID, the type of event (created, updated, merged, archived, restored), a timestamp, and optional metadata about the change. This provides a complete lifecycle history for any individual memory, enabling operations like "show me everything that happened to memory #42."

The history log is populated by the save handler on creation, the update handler on modification, the session-learning handler on learning events, and the archival manager on tier transitions. The vector index schema module creates the `memory_history` table during database initialization. The cleanup-orphaned-vectors script uses the history table to find and remove orphaned entries when their parent memory no longer exists.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Schema creation for memory_history table |
| `mcp_server/handlers/session-learning.ts` | Handler | Session learning history events |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge history tracking |
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Index mutations writing history |
| `scripts/memory/cleanup-orphaned-vectors.ts` | Script | Orphaned history cleanup |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-session-learning.vitest.ts` | Session learning tests |
| `mcp_server/tests/vector-index-impl.vitest.ts` | Vector index implementation |

## Source Metadata

- Group: Mutation
- Source feature title: Per-memory history log
- Current reality source: audit-D04 gap backfill
