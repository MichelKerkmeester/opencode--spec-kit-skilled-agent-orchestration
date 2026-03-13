# Automatic archival subsystem

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Automatic archival subsystem.

## 2. CURRENT REALITY

The archival manager (`lib/cognitive/archival-manager.ts`) is a background job that identifies dormant memories and transitions them to archived status. It queries `memory_index` for memories that have not been accessed within a configurable threshold period, demotes their tier classification, and removes BM25 index entries plus vector rows (`vec_memories`) to reclaim storage. Archived memories remain in the database for SQL-based recovery but are excluded from default search result sets.

The archival sweep runs periodically and respects tier-based protection: constitutional and critical-tier memories are never auto-archived. Access tracker data (`access_count`, `last_accessed`) drives the dormancy decision. On unarchive, BM25 is restored from stored text fields, while vector re-embedding is explicitly deferred and logged for the next index scan (no immediate vector row recreation). The archival manager lazy-loads the tier classifier to avoid circular dependencies at import time.

## 3. SOURCE FILES

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

## 4. SOURCE METADATA

- Group: Lifecycle
- Source feature title: Automatic archival subsystem
- Current reality source: audit-D04 gap backfill
