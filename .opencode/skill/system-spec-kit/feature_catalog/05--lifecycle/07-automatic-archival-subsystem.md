# Automatic archival subsystem

## Current Reality

The archival manager (`lib/cognitive/archival-manager.ts`) is a background job that identifies dormant memories and transitions them to archived status. It queries `memory_index` for memories that have not been accessed within a configurable threshold period, demotes their tier classification, and optionally removes their BM25 index entries and vector embeddings to reclaim storage. Archived memories remain in the database for SQL-based recovery but are excluded from default search result sets.

The archival sweep runs periodically and respects tier-based protection: constitutional and critical-tier memories are never auto-archived. Access tracker data (`access_count`, `last_access_at`) drives the dormancy decision. The archival manager lazy-loads the tier classifier to avoid circular dependencies at import time.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/archival-manager.ts` | Lib | Background archival job logic |
| `mcp_server/lib/storage/access-tracker.ts` | Lib | Access pattern tracking for dormancy detection |
| `mcp_server/lib/search/vector-index-queries.ts` | Lib | Vector index query methods |
| `mcp_server/lib/search/sqlite-fts.ts` | Lib | SQLite FTS5 interface |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/archival-manager.vitest.ts` | Archival manager tests |
| `mcp_server/tests/search-archival.vitest.ts` | Search archival tests |

## Source Metadata

- Group: Lifecycle
- Source feature title: Automatic archival subsystem
- Current reality source: audit-D04 gap backfill
