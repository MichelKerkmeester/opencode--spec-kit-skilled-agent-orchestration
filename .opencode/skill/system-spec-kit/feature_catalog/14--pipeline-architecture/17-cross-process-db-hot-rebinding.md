# Cross-process DB hot rebinding

## Current Reality

Process-lifetime DB connection manager via marker file (`DB_UPDATED_FILE`). When an external process mutates the database, it writes a timestamp to the marker file. On next `checkDatabaseUpdated()` call, if timestamp > lastDbCheck, triggers `reinitializeDatabase()`: closes the old DB handle, calls `vectorIndex.initializeDb()`, and rebinds 6 modules (vectorIndex, checkpoints, accessTracker, hybridSearch, sessionManager, incrementalIndex). Concurrency-safe via mutex with race-condition fix (P4-13). Also manages embedding model readiness (polling with timeout) and constitutional cache lifecycle.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/core/db-state.ts` | Core | Database state management and hot rebinding |
| `mcp_server/core/config.ts` | Core | Server configuration including DB_UPDATED_FILE |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/db-state-graph-reinit.vitest.ts` | DB state graph reinit |

## Source Metadata

- Group: Undocumented feature gap scan
- Source feature title: Cross-process DB hot rebinding
- Current reality source: 10-agent feature gap scan
- Playbook reference: NEW-112
