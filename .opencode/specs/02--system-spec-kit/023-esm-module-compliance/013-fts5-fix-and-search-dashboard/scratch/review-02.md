# Review Iteration 02 — Initialization & State (Part 2): active_memory_projection

**Reviewer:** Copilot CLI / GPT 5.4 High  
**Dimension:** Module initialization ordering and the active_memory_projection table JOIN  
**Files reviewed:** `vector-index-queries.ts`, `vector-index-schema.ts`, `vector-index-store.ts`, `vector-index-mutations.ts`, `lineage-state.ts`, `checkpoints.ts`

---

## Findings

### F02-1: P0 — Normal startup can leave `active_memory_projection` empty (CRITICAL)

- **File:** `mcp_server/lib/search/vector-index-store.ts:749-823`
- **Severity:** P0 (critical bug — most likely root cause of 0 results)
- **Description:** `initialize_db()` creates schema and runs migrations, but does NOT backfill `active_memory_projection` from existing `memory_index` rows on normal startup. The schema code only creates the table and copies rows from migration-era tables, not from current memories. If this table is empty, every search query returns 0 results.
- **Fix:** After schema init, detect `memory_index` non-empty + `active_memory_projection` empty, then run lineage/projection backfill before serving queries.

### F02-2: P0 — Empty projection table makes ALL search channels return 0

- **File:** `mcp_server/lib/search/vector-index-queries.ts:259-267,368-385,643-646`
- **Severity:** P0 (critical bug)
- **Description:** `vector_search`, `multi_concept_search`, and keyword search all use `INNER JOIN active_memory_projection p ON p.active_memory_id = m.id`. If that table has no rows, the join removes every candidate, even when `memory_index`, `vec_memories`, and FTS contain matches. This is an INNER JOIN on an empty table = 0 results guaranteed.
- **Fix:** Keep active-snapshot semantics, but add projection rebuild/integrity checks at startup. Do NOT rely on silent empty-join behavior.

### F02-3: P0 — Count/stats/list queries also affected

- **File:** `mcp_server/lib/search/vector-index-store.ts:536-577,633-646`
- **Severity:** P0 (critical bug)
- **Description:** Counts, folder counts, path lookups, stats, list views, and constitutional retrieval all inner-join `active_memory_projection`. An empty table makes the ENTIRE search subsystem appear empty, not just vector search. This explains why `memory_stats` might report 0 memories even when the database has data.
- **Fix:** Add startup health validation and self-heal when projection is empty.

### F02-4: P1 — Normal writes populate projection but cannot heal already-empty DB

- **File:** `mcp_server/lib/search/vector-index-mutations.ts:102-124,193-197,236,288-315,472-476`
- **Severity:** P1 (likely bug)
- **Description:** Normal save/update paths call `upsert_active_projection()`, so new/touched memories get rows. But the "find existing row" path uses `get_by_folder_and_path`, whose prepared statement ALSO inner-joins `active_memory_projection`. If projection is already empty, old rows are not found, so untouched existing memories stay invisible.
- **Fix:** Rebuild projection at startup; optionally make mutation dedupe use a non-projection lookup.

### F02-5: P1 — Backfill exists but only in specific flows

- **File:** `mcp_server/lib/storage/lineage-state.ts:400-420,643,775,1195,1323-1327`, `mcp_server/lib/storage/checkpoints.ts:1228-1233`, `mcp_server/lib/search/vector-index-schema.ts:1377-1388`
- **Severity:** P1 (likely bug)
- **Description:** Rows are inserted in lineage/backfill code and migration copy code, but there is NO general startup-time rebuild. `runLineageBackfill()` is wired into checkpoint restore, not ordinary DB initialization.
- **Fix:** Invoke lineage/projection backfill during ordinary initialization when projection is empty.

---

## Key Conclusion

**The `active_memory_projection` table is the most probable root cause of 0 search results.** It acts as a gatekeeper via INNER JOIN on every search path (vector, FTS, BM25 via count/stats, keyword). If it is empty — which can happen after schema creation without migration data — all searches return 0 results even though `memory_index`, `vec_memories`, and `memory_fts` have data.

The FTS5 fix (sqlite-fts.ts double-quoting) was correct but secondary. FTS results also go through the vector-index-queries path which JOINs active_memory_projection, so the fix would have been masked.

**Verification query:** Run `SELECT COUNT(*) FROM active_memory_projection;` on the production database. If 0, this is confirmed.
