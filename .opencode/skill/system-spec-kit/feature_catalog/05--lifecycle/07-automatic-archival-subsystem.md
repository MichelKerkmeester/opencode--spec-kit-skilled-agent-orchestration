---
title: "Automatic archival subsystem"
description: "Covers the background archival job that transitions dormant memories to archived status and reclaims storage."
---

# Automatic archival subsystem

## 1. OVERVIEW

Covers the background archival job that transitions dormant memories to archived status and reclaims storage.

Memories that nobody has used for a long time get automatically moved to a storage-saving archive, like moving old files to a basement filing cabinet. They are still there if you need them but they do not take up space in the active search results. Important memories are protected and never get archived automatically.

---

## 2. CURRENT REALITY

The archival manager (`lib/cognitive/archival-manager.ts`) is a background job that identifies dormant memories and transitions them to archived status. It uses SQL only as a broad pre-filter to fetch unarchived, non-protected, non-pinned candidates from `memory_index`; the FSRS-based tier classifier remains the authoritative decision maker for whether a candidate should actually be archived. When archival happens, the job sets `is_archived = 1` and removes BM25 index entries plus vector rows (`vec_memories`) to reclaim storage, but it does not demote or otherwise modify `importance_tier`. Archived memories remain in the database for SQL-based recovery but are excluded from default search result sets.

The archival sweep runs periodically after access tracker data (`access_count`, `last_accessed`) establishes dormancy signals, but the FSRS-based classifier is still the final gate for archival eligibility. Constitutional and critical-tier memories therefore remain protected because the classifier will not approve auto-archival for them. On unarchive, BM25 is restored from stored text fields, while vector re-embedding is explicitly deferred and logged for the next index scan (no immediate vector row recreation). The archival manager lazy-loads the tier classifier to avoid circular dependencies at import time.

---

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

---

## 4. SOURCE METADATA

- Group: Lifecycle
- Source feature title: Automatic archival subsystem
- Current reality source: audit-D04 gap backfill
