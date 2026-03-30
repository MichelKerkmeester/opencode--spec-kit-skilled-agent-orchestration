# Iteration 1: RRF Fusion K-Value Tuning and Channel Weight Optimization

## Focus

This iteration audits how hybrid fusion is actually scored in the live search pipeline, including the TypeScript and dist algorithm copies, then cross-checks the local SQLite database for what recent search traffic looks like. The goal is to separate the documented weights from the weights that truly reach final RRF scoring, and then recommend concrete K and channel-weight changes with evidence.

## Findings

1. The live RRF smoothing constant is `k=60`, with only an optional env override via `SPECKIT_RRF_K`; both the TypeScript source and dist JS agree on that contract. The scoring function is the standard `weight * (1 / (k + rank))`, so with `k=60` the rank gap is very flat: rank 1 contributes `0.016393`, rank 10 contributes `0.014286`, and the gap is only `0.002108`. A simulated comparison shows `k=40` increases that gap to `0.004390` and `k=30` to `0.007258`, which means the current default is conservative to the point of muting top-rank separation for the 2-3 channel searches that dominate recent traffic. Sources: `mcp_server/lib/search/hybrid-search.ts:10-11`, `shared/algorithms/rrf-fusion.ts:21-36`, `shared/algorithms/rrf-fusion.ts:148-162`, `shared/algorithms/rrf-fusion.ts:262-300`, `shared/dist/algorithms/rrf-fusion.js:18-32`, `shared/dist/algorithms/rrf-fusion.js:82-93`, `shared/dist/algorithms/rrf-fusion.js:180-213`.

   Simulated rank-gap evidence:

   ```text
   k=60  rank1=0.016393  rank10=0.014286  gap=0.002108
   k=40  rank1=0.024390  rank10=0.020000  gap=0.004390
   k=30  rank1=0.032258  rank10=0.025000  gap=0.007258
   ```

2. The hard-coded lane weights the pipeline advertises at collection time are not the same weights that reach final fusion. `hybrid-search.ts` initially pushes `vector=1.0`, `fts=0.3`, `bm25=0.6`, `graph=0.5`, and `degree=DEGREE_CHANNEL_WEIGHT` (`0.15`) into `lists`, but the final fusion step explicitly filters out `fts` and `bm25`, merges them into one `keyword` list, and then reweights `vector` and `graph` again through adaptive fusion. Because `fuseResultsMulti()` only consumes list order plus list weight, the separate `0.3` and `0.6` values do not directly affect final RRF scores. In practice, those FTS and BM25 numbers are currently comments-with-code, not final ranking weights. Sources: `mcp_server/lib/search/hybrid-search.ts:1080`, `mcp_server/lib/search/hybrid-search.ts:1087-1104`, `mcp_server/lib/search/hybrid-search.ts:1117-1123`, `mcp_server/lib/search/hybrid-search.ts:1157-1165`, `mcp_server/lib/search/hybrid-search.ts:1174-1178`, `mcp_server/lib/search/hybrid-search.ts:1214-1246`, `mcp_server/lib/search/graph-search-fn.ts:48-55`, `shared/algorithms/rrf-fusion.ts:262-300`.

3. Adaptive fusion is the default live path unless `SPECKIT_ADAPTIVE_FUSION=false`, and no relevant `SPECKIT_*` overrides were present in the shell during this audit. That means the effective production weights are intent profiles from `adaptive-fusion.ts`, not the raw collection-time numbers in `hybrid-search.ts`. After normalization, the effective profiles are:

   ```text
   understand      semantic=0.6087 keyword=0.1739 recency=0.0870 graph=0.1304
   find_spec       semantic=0.5385 keyword=0.1538 recency=0.0769 graph=0.2308
   fix_bug         semantic=0.3636 keyword=0.3636 recency=0.1818 graph=0.0909
   add_feature     semantic=0.4167 keyword=0.2500 recency=0.1667 graph=0.1667
   refactor        semantic=0.5217 keyword=0.2609 recency=0.0870 graph=0.1304
   security_audit  semantic=0.2609 keyword=0.4348 recency=0.1739 graph=0.1304
   find_decision   semantic=0.2727 keyword=0.1818 recency=0.0909 graph=0.4545
   ```

   The strongest outlier is `find_decision`, where graph becomes `45.45%` of the normalized weight mass. Sources: `shared/algorithms/adaptive-fusion.ts:60-76`, `shared/algorithms/adaptive-fusion.ts:88-121`, `shared/algorithms/adaptive-fusion.ts:135-181`, `shared/dist/algorithms/adaptive-fusion.js:7-22`, `shared/dist/algorithms/adaptive-fusion.js:29-63`, `shared/dist/algorithms/adaptive-fusion.js:74-113`.

4. The SQLite DB does not store channel-level search telemetry today, so channel distribution must be reconstructed from recent `consumption_log` query text plus the current routing rules. `memory-search.ts` logs only query text, intent, result count, ids, session, latency, and spec-folder filter; it never persists routed channels or fusion weights, and the local DB confirms `search` rows have `metadata IS NULL` for every entry. Sources: `mcp_server/handlers/memory-search.ts:969-995`, `mcp_server/lib/telemetry/consumption-logger.ts:141-162`.

   SQL evidence:

   ```sql
   SELECT COUNT(*) AS searches_with_metadata
   FROM consumption_log
   WHERE event_type='search' AND metadata IS NOT NULL;
   ```

   ```text
   0
   ```

5. Even with that limitation, recent traffic still gives a useful routing picture. The local DB contains `91` search events between `2026-03-30T11:51:44.593Z` and `2026-03-30T17:11:16.034Z`; average result count is `0.3187`, and `87/91` searches returned zero results. Applying the current router thresholds (`simple <= 3 terms`, `moderate 4-8`, `complex > 8`) to the logged query text produces `35 simple`, `51 moderate`, and `5 complex` searches. That implies approximate recent channel exposure of `vector=91`, `fts=91`, `bm25=63` (moderate + simple `find_spec`/`find_decision` preserves), `graph=5`, and `degree=5`. The important implication is that graph and degree tuning affect only about `5.5%` of recent search calls, while vector/lexical behavior affects almost everything. Sources: `mcp_server/lib/search/query-router.ts:62-72`, `mcp_server/lib/search/query-router.ts:138-163`, `mcp_server/lib/search/query-classifier.ts:22-24`, `mcp_server/lib/search/query-classifier.ts:172-185`.

   SQL evidence:

   ```sql
   SELECT MIN(timestamp), MAX(timestamp), COUNT(*), AVG(result_count),
          SUM(CASE WHEN result_count=0 THEN 1 ELSE 0 END)
   FROM consumption_log
   WHERE event_type='search';
   ```

   ```text
   2026-03-30T11:51:44.593Z | 2026-03-30T17:11:16.034Z | 91 | 0.318681318681319 | 87
   ```

   ```sql
   WITH searches AS (
     SELECT trim(query_text) AS q, COALESCE(intent,'') AS intent
     FROM consumption_log
     WHERE event_type='search' AND query_text IS NOT NULL AND trim(query_text) <> ''
   ),
   routed AS (
     SELECT q, intent,
       CASE
         WHEN (length(q) - length(replace(q,' ','')) + 1) <= 3 THEN 'simple'
         WHEN (length(q) - length(replace(q,' ','')) + 1) > 8 THEN 'complex'
         ELSE 'moderate'
       END AS tier
     FROM searches
   )
   SELECT tier, COUNT(*) FROM routed GROUP BY tier ORDER BY COUNT(*) DESC;
   ```

   ```text
   moderate | 51
   simple   | 35
   complex  | 5
   ```

   ```sql
   WITH searches AS (
     SELECT trim(query_text) AS q, COALESCE(intent,'') AS intent
     FROM consumption_log
     WHERE event_type='search' AND query_text IS NOT NULL AND trim(query_text) <> ''
   ),
   routed AS (
     SELECT q, intent,
       CASE
         WHEN (length(q) - length(replace(q,' ','')) + 1) <= 3 THEN 'simple'
         WHEN (length(q) - length(replace(q,' ','')) + 1) > 8 THEN 'complex'
         ELSE 'moderate'
       END AS tier
     FROM searches
   )
   SELECT 'vector' AS channel, COUNT(*) AS n FROM routed
   UNION ALL
   SELECT 'fts', COUNT(*) FROM routed
   UNION ALL
   SELECT 'bm25', SUM(CASE WHEN tier IN ('moderate','complex')
                              OR (tier='simple' AND intent IN ('find_spec','find_decision'))
                           THEN 1 ELSE 0 END)
   FROM routed
   UNION ALL
   SELECT 'graph', SUM(CASE WHEN tier='complex' THEN 1 ELSE 0 END) FROM routed
   UNION ALL
   SELECT 'degree', SUM(CASE WHEN tier='complex' THEN 1 ELSE 0 END) FROM routed
   ORDER BY n DESC, channel;
   ```

   ```text
   fts    | 91
   vector | 91
   bm25   | 63
   degree | 5
   graph  | 5
   ```

6. Graph coverage in the DB is real, but the current router makes it a niche signal, not a primary calibration target. The local database has `1,310` causal edges, touching `651` distinct sources and `656` distinct targets across `1,002` memories, and only `19` memories are protected (`constitutional` or `critical`). That means graph evidence exists, but because recent routed exposure is so low, the higher-value tuning work is still vector/lexical first. Degree is already intentionally capped at `0.15` and bound to the graph family, so it is not the main ranking problem. Sources: `mcp_server/lib/search/graph-search-fn.ts:35-55`, `shared/algorithms/rrf-fusion.ts:38-40`, `shared/algorithms/rrf-fusion.ts:271-274`, `shared/algorithms/rrf-fusion.ts:288-293`.

   SQL evidence:

   ```sql
   SELECT COUNT(*) AS total_edges,
          COUNT(DISTINCT source_id) AS distinct_sources,
          COUNT(DISTINCT target_id) AS distinct_targets
   FROM causal_edges;
   ```

   ```text
   1310 | 651 | 656
   ```

7. The current calibration story is heuristic rather than evidence-closed. The only justification for `fts=0.3` and `bm25=0.6` is inline commentary in `hybrid-search.ts`, but the DB does not persist the per-search channels or per-search weights needed to validate those choices against live traffic. Combined with Finding 2, that means the biggest optimization opportunity is not “tune 0.3 vs 0.6”; it is “make those lexical weights real in the final fusion path, then instrument them.” Sources: `mcp_server/lib/search/hybrid-search.ts:1091-1103`, `mcp_server/handlers/memory-search.ts:969-995`, `mcp_server/lib/telemetry/consumption-logger.ts:141-162`.

## Concrete Recommendations

1. Change `DEFAULT_K` from `60` to `40` in `shared/algorithms/rrf-fusion.ts` and keep the env override path intact.
   Expected impact: roughly doubles the rank-1 vs rank-10 separation (`0.002108 -> 0.004390`) without becoming as aggressive as `k=30`, which is a better fit for the observed workload where `86/91` non-empty recent queries route through only 2-3 channels.

2. Stop collapsing `fts` and `bm25` into a single `keyword` list before final `fuseResultsMulti()`.
   Expected impact: makes lexical tuning real again. Recommended concrete split: keep `vector` on adaptive `semanticWeight`, and split the lexical bucket as `ftsWeight = keywordWeight * 0.70` and `bm25Weight = keywordWeight * 0.30`. This matches the source comments that FTS exact matches are useful but over-weighting hurts, while BM25 is broader but lower precision. Right now the code cannot express that distinction in final RRF at all.

3. Reduce the `find_decision` graph profile from `graphWeight: 0.50` to `graphWeight: 0.35` before normalization in `adaptive-fusion.ts`.
   Expected impact: lowers the normalized graph share for `find_decision` from `0.4545` to about `0.3684`, so graph remains the strongest single signal for decision lookups without outweighing vector + lexical evidence combined on sparse or noisy causal graphs.

4. Leave `degree` at `0.15` for now, but do not increase it until channel telemetry exists.
   Expected impact: avoids compounding graph-family influence on the small set of complex queries where both `graph` and `degree` run. The current degree cap is already conservative and aligned with `DEGREE_BOOST_CAP`.

5. Add channel/weight telemetry to `consumption_log.metadata` for every `search` event before doing another weight-tuning pass.
   Expected impact: future tuning can be grounded in real per-query channel execution, not reconstructed proxies. This is especially important because the current recent-search sample is short (`~5.3h`) and heavily zero-result (`87/91`), which is not strong enough to defend fine-grained weight choices by itself.

## New Information Ratio

0.89
