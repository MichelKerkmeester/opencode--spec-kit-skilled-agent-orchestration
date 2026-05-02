# Iteration 9: Active Memory Projection and Lineage Impact on Search
## Focus
This iteration traces how `active_memory_projection` entries are created and maintained, how lineage and supersession move the active pointer, and what the live database shows about memories that are outside the projection. It also checks the concrete search impact of missing projections, using both source/runtime code and SQL against `mcp_server/database/context-index.sqlite`.

## Findings
1. Projection rows are created in two separate layers, not just one. The schema bootstrap creates `memory_lineage` and `active_memory_projection`, migrates legacy `hydra_*` tables into them, and adds an index on `active_memory_projection(active_memory_id)` for lookup speed in both TS and compiled JS (`lib/search/vector-index-schema.ts:1218-1330`, `dist/lib/search/vector-index-schema.js:1065-1167`). The lower-level vector mutation path also writes projection rows directly on plain create, deferred create, and update via `upsert_active_projection(...)`, even when no lineage row is written (`lib/search/vector-index-mutations.ts:102-125`, `lib/search/vector-index-mutations.ts:219-236`, `lib/search/vector-index-mutations.ts:291-337`, `lib/search/vector-index-mutations.ts:470-475`, `dist/lib/search/vector-index-mutations.js:79-92`, `dist/lib/search/vector-index-mutations.js:143-169`, `dist/lib/search/vector-index-mutations.js:185-225`, `dist/lib/search/vector-index-mutations.js:322-327`). The lineage layer independently writes projection rows during seed, supersede, and backfill operations (`lib/storage/lineage-state.ts:599-655`, `lib/storage/lineage-state.ts:666-803`, `dist/lib/storage/lineage-state.js:357-396`, `dist/lib/storage/lineage-state.js:406-523`, `dist/lib/storage/lineage-state.js:729-847`).

2. Supersession is append-first: the new row is inserted first, then lineage marks the predecessor historical and advances the active projection to the new row. `memory-save.ts` selects append-only creation when the same path exists with a different content hash, calling `createAppendOnlyMemoryRecord(...)` with the prior row as `predecessorMemoryId`, then records lineage again through `recordLineageVersion(...)` (`handlers/memory-save.ts:927-978`, `dist/handlers/memory-save.js:680-714`). Inside lineage state, `recordLineageTransition(...)` closes the predecessor by setting `valid_to`, sets `superseded_by_memory_id`, marks the predecessor `deprecated` in `memory_index`, inserts the new lineage row, and moves `active_memory_projection` to the new active row (`lib/storage/lineage-state.ts:429-439`, `lib/storage/lineage-state.ts:666-803`, `dist/lib/storage/lineage-state.js:225-235`, `dist/lib/storage/lineage-state.js:406-523`). The second call is effectively idempotent because lineage returns early when the row already has a lineage record (`lib/storage/lineage-state.ts:547-563`, `lib/storage/lineage-state.ts:674-675`).

3. The exact orphan query returns 8 rows in `memory_index` that are not present in `active_memory_projection`, but they are all historical superseded versions, not active search losses. SQL against `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` returned:

```sql
SELECT COUNT(*) FROM memory_index WHERE id NOT IN (
  SELECT active_memory_id FROM active_memory_projection
);
-- 8

SELECT
  SUM(CASE WHEN l.memory_id IS NULL THEN 1 ELSE 0 END) AS no_lineage_row,
  SUM(CASE WHEN l.memory_id IS NOT NULL AND l.valid_to IS NULL THEN 1 ELSE 0 END) AS active_lineage_missing_projection,
  SUM(CASE WHEN l.memory_id IS NOT NULL AND l.valid_to IS NOT NULL THEN 1 ELSE 0 END) AS historical_lineage_missing_projection
FROM memory_index m
LEFT JOIN memory_lineage l ON l.memory_id = m.id
WHERE m.id NOT IN (SELECT active_memory_id FROM active_memory_projection);
-- no_lineage_row=0, active_lineage_missing_projection=0, historical_lineage_missing_projection=8
```

An example from the live DB is `historical_id=1001` for `.../007-hybrid-search-null-db-fix/plan.md`, which is `deprecated`, has a lineage row with `valid_to=2026-03-30T16:34:43.401Z`, and points at `superseded_by_memory_id=1003`, whose active row is still present and searchable. This means the 8 rows outside projection are expected historical versions, not active orphaned memories.

4. The larger live inconsistency is the inverse case: 208 active projection rows exist without any lineage row at all. The validator logic explicitly treats that as a projection mismatch by left-joining `active_memory_projection` to `memory_lineage` and failing whenever the active projection has no matching active lineage row (`lib/storage/lineage-state.ts:993-1040`, `dist/lib/storage/lineage-state.js:671-720`). SQL shows:

```sql
SELECT
  SUM(CASE WHEN l.memory_id IS NULL THEN 1 ELSE 0 END) AS projection_without_lineage_row,
  SUM(CASE WHEN l.memory_id IS NOT NULL AND l.valid_to IS NOT NULL THEN 1 ELSE 0 END) AS projection_points_to_inactive_lineage,
  SUM(CASE WHEN l.memory_id IS NOT NULL AND l.valid_to IS NULL THEN 1 ELSE 0 END) AS projection_points_to_active_lineage
FROM active_memory_projection p
LEFT JOIN memory_lineage l
  ON l.logical_key = p.logical_key
 AND l.memory_id = p.active_memory_id;
-- projection_without_lineage_row=208, projection_points_to_inactive_lineage=0, projection_points_to_active_lineage=786

SELECT COUNT(*) AS memory_index_not_lineaged
FROM memory_index m
LEFT JOIN memory_lineage l ON l.memory_id = m.id
WHERE l.memory_id IS NULL;
-- 208
```

Runtime validation through the compiled JS confirms the same result: `valid=false`, `activeProjectionCount=994`, `lineageRowCount=794`, `projectionMismatches=208`.

5. Those 208 projection-without-lineage rows are not random; they are all chunk children created by the chunking orchestrator. SQL shows every non-lineaged projected row uses a `chunk-*` anchor:

```sql
SELECT
  SUM(CASE WHEN m.anchor_id LIKE 'chunk-%' THEN 1 ELSE 0 END) AS chunk_anchor_rows,
  COUNT(*) AS total_non_lineaged_projections
FROM active_memory_projection p
JOIN memory_index m ON m.id = p.active_memory_id
LEFT JOIN memory_lineage l ON l.memory_id = p.active_memory_id
WHERE l.memory_id IS NULL;
-- chunk_anchor_rows=208, total_non_lineaged_projections=208

SELECT m.embedding_status, COUNT(*) AS total
FROM active_memory_projection p
JOIN memory_index m ON m.id = p.active_memory_id
LEFT JOIN memory_lineage l ON l.memory_id = p.active_memory_id
WHERE l.memory_id IS NULL
GROUP BY m.embedding_status;
-- success=207, failed=1
```

The code path matches that shape: chunk parents and children are inserted directly through `vectorIndex.indexMemoryDeferred(...)` / `vectorIndex.indexMemory(...)`, which writes projection rows, but this handler never records lineage for those chunk records (`handlers/chunking-orchestrator.ts:216-235`, `handlers/chunking-orchestrator.ts:303-330`, `dist/handlers/chunking-orchestrator.js:210-239`). That explains why these rows are fully projection-backed and mostly vector-ready while still failing lineage integrity.

6. Search depends on projection presence, not lineage presence. Vector search, multi-concept search, keyword/folder retrieval, count/stat helpers, constitutional retrieval, and interference refresh all inner-join `active_memory_projection`, so a truly active memory with no projection row disappears from those search surfaces even if its `memory_index` and `vec_memories` rows still exist (`lib/search/vector-index-queries.ts:83-99`, `lib/search/vector-index-queries.ts:119-145`, `lib/search/vector-index-queries.ts:259-283`, `lib/search/vector-index-queries.ts:368-405`, `lib/search/vector-index-queries.ts:643-686`, `lib/search/vector-index-store.ts:535-580`, `lib/search/vector-index-store.ts:612-672`, `lib/search/vector-index-store.ts:708-731`, `dist/lib/search/vector-index-queries.js:44-56`, `dist/lib/search/vector-index-queries.js:71-85`, `dist/lib/search/vector-index-queries.js:178-199`, `dist/lib/search/vector-index-queries.js:253-273`, `dist/lib/search/vector-index-queries.js:486-492`, `dist/lib/search/vector-index-store.js:544-566`). In the current DB, there are `999` vector-ready rows total but only `991` are search-visible through the projection join, and `active_lineage_without_projection_but_vector_ready=0`. So today’s missing-projection effect is limited to the 8 intentionally historical rows, but if an actually active row lost its projection, it would vanish from vector retrieval, count/stats, and projection-based refresh logic immediately.

## Concrete Recommendations
1. Decide whether chunk children should participate in lineage. If yes, record lineage for chunk parents/children in `chunking-orchestrator.ts`; if no, update `validateLineageIntegrity()` to exclude `parent_id IS NOT NULL` or `anchor_id LIKE 'chunk-%'` rows so the integrity report matches intended behavior.
2. Keep the exact orphan query, but split it into two guardrails in tests/monitoring: `active_lineage_missing_projection` must stay `0`, while `historical_lineage_missing_projection` may be non-zero because superseded rows are expected to fall out of projection.
3. Add a regression around chunking that asserts one of two valid states after save: either chunk rows get lineage entries, or integrity validation explicitly ignores them. Right now the runtime allows chunk projections without lineage, which makes the validator noisy and obscures real drift.
4. Consider a repair/backfill command for projection/lineage parity that targets only active rows with missing lineage, because current backfill semantics already know how to reconstruct chains and refresh the active projection (`dist/lib/storage/lineage-state.js:729-847`).

## New Information Ratio
0.82
