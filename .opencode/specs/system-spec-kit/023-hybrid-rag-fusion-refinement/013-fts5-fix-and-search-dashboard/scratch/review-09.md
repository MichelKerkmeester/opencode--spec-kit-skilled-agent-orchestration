# Review Iteration 09 — Database Schema (Part 1): Schema vs Code Expectations

**Reviewer:** Copilot CLI / GPT 5.4 High  
**Dimension:** Does database schema match what search code expects? Missing tables, wrong columns, stale views?  
**Files reviewed:** `vector-index-schema.ts`, `schema-downgrade.ts`, `vector-index-store.ts`, `sqlite-fts.ts`

---

## Findings

### F09-1: P0 — active_memory_projection created but never backfilled from existing memory_index (CONFIRMED)

- **File:** `mcp_server/lib/search/vector-index-schema.ts:1080-1083,1357-1389,2275-2284`, `mcp_server/lib/search/vector-index-store.ts:536-579,633-643,713-719`
- **Severity:** P0 (critical bug)
- **Description:** `active_memory_projection` is created, but migration v22 only calls `ensureLineageTables()` which creates the table plus copies from legacy `hydra_*` tables. On any DB upgraded from pre-v22 without legacy lineage tables, `active_memory_projection` exists but is empty. Meanwhile, ALL search/count queries use `INNER JOIN active_memory_projection p ON p.active_memory_id = m.id`. Empty table = 0 results guaranteed.
- **Fix:** In v22/bootstrap, backfill one projection row per active `memory_index` row. Or temporarily change to `LEFT JOIN` until projection repair completes.

### F09-2: P2 — Startup compatibility validation does not treat lineage tables as required

- **File:** `mcp_server/lib/search/vector-index-schema.ts:51,94-118,1531-1595,1611-1658,2275-2289`
- **Severity:** P2
- **Description:** `validate_backward_compatibility()` only requires `memory_index` and `schema_version`. `validateLineageSchemaSupport()` exists separately but is not used in bootstrap path. The search layer unconditionally depends on `active_memory_projection`, but startup does not enforce that dependency.
- **Fix:** Fold `validateLineageSchemaSupport()` into normal startup validation, or add `active_memory_projection` to the main compatibility contract.

### F09-3: P2 — vec_memories only guaranteed on fresh schema creation

- **File:** `mcp_server/lib/search/vector-index-schema.ts:2275-2294,2361-2379`, `mcp_server/lib/search/vector-index-store.ts:195-207`
- **Severity:** P2
- **Description:** In the existing-DB bootstrap branch, the code ensures companion/lineage/governance tables but does NOT create `vec_memories` or `vec_metadata` if absent and sqlite-vec is now available. An older DB can remain permanently non-vectorized.
- **Fix:** When bootstrapping existing DB with sqlite-vec available, detect missing `vec_memories`/`vec_metadata`, create them, and mark rows for embedding backfill.

---

## Schema Verification

| Question | Answer | Evidence |
|----------|--------|----------|
| `memory_fts` columns match sqlite-fts.ts? | YES. `title, trigger_phrases, file_path, content_text` in correct order | `vector-index-schema.ts:2384-2387`, `schema-downgrade.ts:205-208`, `sqlite-fts.ts:76-81` |
| `vec_memories` exists with correct dim? | On fresh DB: YES. On existing DB: NOT guaranteed | `vector-index-schema.ts:2361-2379` |
| `active_memory_projection` created before first search? | YES (table exists). But may be EMPTY. | `vector-index-store.ts:822-823`, `vector-index-schema.ts:2280-2282,1291-1404` |
| Schema version where projection doesn't exist? | Table is always created by bootstrap. The issue is EMPTY data, not missing table. | `vector-index-schema.ts:1357-1362` |
| Missing columns in older schemas? | No FTS column-order mismatch found. Strongest gap is empty projection data. | All search files reviewed |
