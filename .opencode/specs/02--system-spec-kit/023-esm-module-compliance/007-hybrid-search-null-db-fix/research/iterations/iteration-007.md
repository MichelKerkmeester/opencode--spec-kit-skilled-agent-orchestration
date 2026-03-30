# Iteration 7: Graph channel and co-activation effectiveness
## Focus
This iteration checked whether the graph channel and Stage 2 co-activation are materially helping retrieval in the current SQLite database, not just existing in code. I reviewed the source/runtime pairs for `graph-signals`, `co-activation`, and `graph-search-fn`, then verified the live graph population and replayed the current graph channel over the eval query set.

## Findings
1. The graph channel is a real retrieval channel over `causal_edges`, but `graph-signals` is only a reranker for rows that already exist in the candidate set. `lib/search/graph-search-fn.ts:94-142,154-252,660-682` builds graph candidates by FTS5-matching `memory_fts`, joining matching memories to `causal_edges`, emitting both endpoints, and deduping by memory ID; the dist build mirrors that in `dist/lib/search/graph-search-fn.js:61-107,113-200`. By contrast, `lib/graph/graph-signals.ts:553-620` only adds momentum/depth/graph-walk bonuses to rows already present, and the dist build mirrors that in `dist/lib/graph/graph-signals.js:455-505`.
   SQL evidence:
   ```sql
   SELECT COUNT(*) AS total_edges, COUNT(DISTINCT source_id) AS distinct_sources, COUNT(DISTINCT target_id) AS distinct_targets FROM causal_edges;
   WITH nodes AS (SELECT source_id AS node_id FROM causal_edges UNION SELECT target_id AS node_id FROM causal_edges) SELECT COUNT(*) AS distinct_nodes FROM nodes;
   ```
   Result: `causal_edges` currently contains 1,310 edges across 752 distinct nodes (`651` distinct sources, `656` distinct targets), so the graph channel has enough live structure to contribute retrieval candidates even before Stage 2 scoring.

2. The similarity half of co-activation is effectively inert in the current DB because the stored `related_memories` payload does not match the parser contract. `lib/cognitive/co-activation.ts:94-115` only accepts arrays of objects shaped like `{id, similarity}`, and `lib/cognitive/co-activation.ts:173-214,395-409` depends on that parser for `getRelatedMemories()` before merging with causal neighbors in `spreadActivation()`. The dist build mirrors the same contract in `dist/lib/cognitive/co-activation.js:57-77,120-156,292-320`.
   SQL evidence:
   ```sql
   SELECT COUNT(*) AS total_memories,
          SUM(CASE WHEN related_memories IS NOT NULL AND related_memories != '' AND related_memories != '[]' THEN 1 ELSE 0 END) AS memories_with_related
   FROM memory_index;

   SELECT related_count, COUNT(*) AS memories
   FROM (
     SELECT id, COALESCE(json_array_length(related_memories), 0) AS related_count
     FROM memory_index
   )
   GROUP BY related_count
   ORDER BY related_count DESC;

   SELECT COUNT(*) AS total_json_entries,
          SUM(CASE WHEN json_type(j.value) = 'object' THEN 1 ELSE 0 END) AS object_entries,
          SUM(CASE WHEN json_type(j.value) IN ('integer','real','text') THEN 1 ELSE 0 END) AS scalar_entries,
          SUM(CASE WHEN json_extract(j.value, '$.id') IS NOT NULL THEN 1 ELSE 0 END) AS entries_with_id_field
   FROM memory_index mi, json_each(mi.related_memories) j
   WHERE mi.related_memories IS NOT NULL AND mi.related_memories != '[]';
   ```
   Result: only `37 / 1002` memories have any `related_memories`, every populated row has exactly one entry, all `37` JSON entries are scalars, and `0` entries expose an `$.id` field. Sample rows are raw arrays like `[39]`, `[309]`, and `[351]`, so `getRelatedMemories()` will parse them as empty even though the column is populated.

3. In practice, Stage 2 co-activation is therefore running almost entirely on causal neighbors, not on the precomputed similarity graph the code claims to merge. `lib/cognitive/co-activation.ts:303-345` fetches causal neighbors directly from `causal_edges`, and `lib/cognitive/co-activation.ts:347-429` does a best-first 2-hop traversal over the merged neighbor map. Because the similarity branch is empty under the current payload shape, the traversal is dominated by `getCausalNeighbors()` output.
   SQL evidence:
   ```sql
   WITH related_pairs AS (
     SELECT mi.id AS source_id, CAST(json_extract(j.value, '$.id') AS INTEGER) AS related_id
     FROM memory_index mi, json_each(mi.related_memories) j
     WHERE mi.related_memories IS NOT NULL AND mi.related_memories != '[]'
   )
   SELECT COUNT(*) AS total_related_links,
          SUM(CASE WHEN related_id IS NOT NULL THEN 1 ELSE 0 END) AS parsed_object_links
   FROM related_pairs;
   ```
   Result: the current table stores `37` non-empty relation payloads but `0` parseable object-form links, so the similarity neighbor path is not contributing usable adjacency today.

4. The graph channel is not just duplicating FTS5 when it fires. I replayed all `110` eval queries through the live DB using `dist/lib/search/graph-search-fn.js` and `dist/lib/search/sqlite-fts.js` against `context-index.sqlite`. The graph channel returned results on `32` queries; `31` of those `32` graph-hit queries contained at least one ID not already present in the top-20 FTS result set. Aggregate totals were `324` graph IDs, `131` overlaps with FTS, and `193` graph-only IDs, which is `6.03` unique graph IDs per graph-hit query.
   SQL evidence:
   ```sql
   SELECT relation, COUNT(*) AS edge_count, ROUND(AVG(strength), 3) AS avg_strength
   FROM causal_edges
   GROUP BY relation
   ORDER BY edge_count DESC;
   ```
   Result: the graph is highly skewed toward `supports` (`535`) and `supersedes` (`532`), with `caused` at `240` and only one row each for `enabled`, `derived_from`, and `contradicts`. That skew explains why graph results often expand to adjacent planning/documentation artifacts rather than surfacing a broader mix of causal semantics.

5. The exact "graph channel hit rate being zero" topic is still weak in the live system, but not for the reason the Stage 2 code comments imply. Query 6 in the eval set (`what was recently discussed about the graph channel hit rate being zero`) produced `0` graph-channel results from `graph-search-fn`, yet a direct `spreadActivation()` replay over its top-5 FTS seeds still found `17` causal neighbors, only `1` of which was already in the combined FTS+graph candidate pool. This matches the Stage 2 code path in `lib/search/pipeline/stage2-fusion.ts:780-820`: it only boosts rows that already exist in `results`, it does not inject newly discovered spread nodes.
   SQL evidence:
   ```sql
   SELECT COUNT(*) AS invalid_source_refs
   FROM causal_edges ce
   LEFT JOIN memory_index mi ON mi.id = CAST(ce.source_id AS INTEGER)
   WHERE mi.id IS NULL;

   SELECT COUNT(*) AS invalid_target_refs
   FROM causal_edges ce
   LEFT JOIN memory_index mi ON mi.id = CAST(ce.target_id AS INTEGER)
   WHERE mi.id IS NULL;

   SELECT COUNT(*) AS edges_with_placeholder_ids
   FROM causal_edges
   WHERE source_id LIKE '<%' OR target_id LIKE '<%' OR source_id LIKE 'test-%' OR target_id LIKE 'test-%';
   ```
   Result: the table has `7` invalid source refs, `7` invalid target refs, and `7` placeholder/test edges (`<memory-id-a>`, `<memory-id-b>`, `test-source-id`, `test-target-id`). Those rows pollute the graph without helping real query expansion.

6. Graph-signal scoring coverage is also incomplete because the snapshot layer lags the live graph. `lib/graph/graph-signals.ts:67-109,137-168` computes momentum as current degree minus the degree recorded 7 days ago, and `lib/graph/graph-signals.ts:486-538,565-620` uses those scores during reranking. The database currently has fewer same-day `degree_snapshots` rows than live graph nodes.
   SQL evidence:
   ```sql
   SELECT COUNT(*) AS degree_snapshot_rows,
          COUNT(DISTINCT memory_id) AS snapshotted_nodes,
          MIN(snapshot_date) AS min_date,
          MAX(snapshot_date) AS max_date
   FROM degree_snapshots;

   WITH nodes AS (
     SELECT source_id AS node_id FROM causal_edges
     UNION
     SELECT target_id AS node_id FROM causal_edges
   ),
   snap AS (
     SELECT CAST(memory_id AS TEXT) AS node_id
     FROM degree_snapshots
     WHERE snapshot_date = date('now')
   )
   SELECT COUNT(*) AS graph_nodes_missing_snapshot
   FROM nodes n
   LEFT JOIN snap s ON s.node_id = n.node_id
   WHERE s.node_id IS NULL;
   ```
   Result: `degree_snapshots` has `686` rows, all dated `2026-03-30`, but `66` graph nodes currently have no same-day snapshot. Some are placeholder/test IDs, but many are live numeric nodes, so momentum is at best partial and at worst stale for a non-trivial slice of the graph.

7. I could not measure live vector overlap directly in this sandbox because the vector query path is network-bound here. A direct call to `dist/lib/search/vector-index-queries.js` retried Voyage embeddings four times, failed with `fetch failed`, and fell back to `keyword` mode. That means I can confidently answer the FTS duplication question from live replay, but the vector-overlap part is only inferential in this iteration: the stored similarity graph is too sparse and too malformed to be materially helping co-activation right now.
   SQL evidence:
   ```sql
   SELECT COUNT(*) AS related_rows
   FROM memory_index
   WHERE related_memories IS NOT NULL AND related_memories != '[]';
   ```
   Result: only `37` rows even have stored similarity links, so even with a healthy embedding provider the current precomputed similarity graph is extremely shallow.

## Concrete Recommendations
1. Fix the `related_memories` contract mismatch first. Either migrate stored values from scalar arrays like `[39]` to object arrays like `[{"id":39,"similarity":...}]`, or make `parseRelatedMemoryReferences()` accept the scalar legacy form and enrich it before use. Expected impact: Stage 2 will start using the intended similarity graph instead of relying almost entirely on causal edges.
2. If the goal is true discovery, let Stage 2 inject a small bounded set of spread results instead of only boosting rows that already exist in `results` (`lib/search/pipeline/stage2-fusion.ts:792-810`). Expected impact: graph/co-activation can surface novel memories instead of merely reordering the current pool.
3. Clean the placeholder/test edges out of `causal_edges`, then rerun `snapshotDegrees()`. Expected impact: remove bogus graph structure, reduce noisy traversal, and restore momentum coverage for real nodes.
4. Add a permanent evaluation metric for `graph_only_ids`, `graph_fts_overlap`, and `coactivation_boostable_ids` per query. Expected impact: future "graph hit rate zero" investigations can distinguish "graph channel returned nothing", "graph found only duplicates", and "graph found off-list nodes that Stage 2 refused to inject."

## New Information Ratio
0.82
