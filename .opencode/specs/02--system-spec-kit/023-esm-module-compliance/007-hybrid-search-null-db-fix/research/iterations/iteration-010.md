# Iteration 10: End-to-End Search Latency Profiling

## Focus

Profile the current search pipeline from query entry to final response, identify which stages are most likely driving the observed 500-800ms latency band, and verify whether repeat-query caching already exists in the live code and database surfaces.

## Findings

1. The cold-path bottleneck is still Stage 1 query embedding generation, not the downstream local ranking stages.

Code evidence:

- `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:546-556` generates the query embedding before hybrid candidate generation can proceed.
- `mcp_server/lib/search/pipeline/orchestrator.ts:62-78` makes Stage 1 mandatory; if Stage 1 fails, the whole pipeline aborts before Stage 2-4.
- `mcp_server/dist/lib/search/pipeline/orchestrator.js:45-54` preserves the same compiled behavior.

Runtime evidence:

- A direct in-process `handleMemorySearch()` cold-run attempt failed in Stage 1 with `PIPELINE_STAGE1_FAILED` after Voyage retries exhausted on `fetch failed`, before any Stage 2/3/4 work ran. In this sandbox that is caused by blocked outbound network, but it confirms the architecture: the provider call is the hard gate on a cache miss.

SQL evidence:

```sql
SELECT event_type,
       COUNT(*) AS count,
       ROUND(AVG(latency_ms),1) AS avg_latency_ms,
       ROUND(MIN(latency_ms),1) AS min_latency_ms,
       ROUND(MAX(latency_ms),1) AS max_latency_ms
FROM consumption_log
WHERE event_type='search'
GROUP BY event_type;

SELECT ROUND(AVG(latency_ms),1) AS avg_ms,
       ROUND(AVG(CASE WHEN latency_ms >= 500 THEN 1.0 ELSE 0 END)*100,1) AS pct_ge_500ms,
       ROUND(AVG(CASE WHEN latency_ms >= 800 THEN 1.0 ELSE 0 END)*100,1) AS pct_ge_800ms,
       ROUND(AVG(CASE WHEN latency_ms >= 1000 THEN 1.0 ELSE 0 END)*100,1) AS pct_ge_1000ms
FROM consumption_log
WHERE event_type='search';
```

Observed:

- 91 logged searches
- average latency `529.8ms`
- min `3.0ms`, max `5192.0ms`
- `60.4%` of searches are `>=500ms`
- `6.6%` are `>=800ms`
- `2.2%` are `>=1000ms`

Interpretation:

- The local pipeline stages can certainly add tail latency, but the dominant cold-path gate is still the external embedding call that happens before retrieval can start.

2. Vector search, FTS5 search, BM25 search, graph search, and RRF fusion all happen locally and sequentially inside hybrid candidate generation; there is no persisted per-channel timing today.

Code evidence:

- `mcp_server/lib/search/hybrid-search.ts:1051-1052` explicitly documents that the retrieval channels are synchronous `better-sqlite3` work and are intentionally not parallelized.
- `mcp_server/lib/search/hybrid-search.ts:1055-1127` runs vector, FTS, BM25, and graph collection in one sequential block.
- `mcp_server/lib/search/hybrid-search.ts:1214-1244` performs adaptive weighting and RRF input assembly after channel collection.
- `mcp_server/dist/lib/search/hybrid-search.js:694-695`, `:697-767`, and `:847-870` show the same compiled path.
- `mcp_server/dist/handlers/memory-search.js:685-719` logs only end-to-end `latency_ms`; it does not persist per-stage or per-channel timings into `consumption_log`.

SQL evidence:

```sql
PRAGMA table_info(consumption_log);

SELECT name, sql
FROM sqlite_master
WHERE type='table'
  AND name IN ('consumption_log', 'embedding_cache')
ORDER BY name;
```

Observed:

- `consumption_log` stores `event_type`, `query_text`, `intent`, `mode`, `result_count`, `result_ids`, `session_id`, `timestamp`, `latency_ms`, `spec_folder_filter`, and `metadata`
- there are no dedicated columns for `stage1_ms`, `vector_ms`, `fts_ms`, `bm25_ms`, `graph_ms`, `fusion_ms`, `rerank_ms`, or `filter_ms`

Interpretation:

- We can identify ownership of latency by code path, but we cannot compute a true SQL-only stage breakdown from the current telemetry schema.

3. The observed latency distribution is consistent with a split between cached/cheap repeats and cold or more complex queries.

SQL evidence:

```sql
SELECT CASE
         WHEN latency_ms < 100 THEN '<100'
         WHEN latency_ms < 300 THEN '100-299'
         WHEN latency_ms < 600 THEN '300-599'
         WHEN latency_ms < 1000 THEN '600-999'
         ELSE '1000+'
       END AS latency_bucket,
       COUNT(*) AS count
FROM consumption_log
WHERE event_type='search'
GROUP BY latency_bucket
ORDER BY CASE latency_bucket
           WHEN '<100' THEN 1
           WHEN '100-299' THEN 2
           WHEN '300-599' THEN 3
           WHEN '600-999' THEN 4
           ELSE 5
         END;

SELECT query_text, latency_ms, timestamp
FROM consumption_log
WHERE event_type='search'
  AND latency_ms <= 10
ORDER BY id DESC
LIMIT 10;
```

Observed:

- `<100ms`: `5`
- `100-299ms`: `21`
- `300-599ms`: `49`
- `600-999ms`: `14`
- `1000ms+`: `2`
- the ultra-fast rows were:
  - `semantic search` at `4.0ms`
  - `test` at `9.0ms`
  - `authentication` at `3.0ms`

Inference:

- These single-digit millisecond rows are too fast for a fresh Voyage round trip and are strongly consistent with whole-response cache hits or other already-warmed paths.

4. Tool-cache can bypass the entire `memory_search` handler for exact repeated arguments, but its hit rate is not persisted anywhere durable.

Code evidence:

- `mcp_server/lib/cache/tool-cache.ts:130-147` increments in-memory hit/miss counters on `get()`.
- `mcp_server/lib/cache/tool-cache.ts:374-438` provides a generic `withCache()` wrapper, but `memory_search` does not use it.
- `mcp_server/lib/cache/tool-cache.ts:444-457` exposes `getStats()` as in-process counters only.
- `mcp_server/dist/handlers/memory-search.js:385-393` performs a direct `toolCache.get(cacheKey)` check.
- `mcp_server/dist/handlers/memory-search.js:547-553` stores the formatted response payload back into tool-cache.
- `mcp_server/dist/lib/cache/tool-cache.js:267-330` confirms the compiled cache is an in-memory TTL/LRU structure with volatile stats.

SQL evidence:

```sql
SELECT COUNT(*) AS total_searches,
       COUNT(DISTINCT query_text) AS distinct_queries,
       ROUND(COUNT(DISTINCT query_text)*100.0/COUNT(*),1) AS distinct_pct
FROM consumption_log
WHERE event_type='search';

WITH repeated AS (
  SELECT query_text
  FROM consumption_log
  WHERE event_type='search'
  GROUP BY query_text
  HAVING COUNT(*) > 1
)
SELECT COUNT(*) AS repeated_rows,
       ROUND(COUNT(*)*100.0/(SELECT COUNT(*) FROM consumption_log WHERE event_type='search'),1) AS pct_repeated_rows
FROM consumption_log
WHERE event_type='search'
  AND query_text IN (SELECT query_text FROM repeated);
```

Observed:

- 91 total searches
- 61 distinct query texts
- 47 search rows (`51.6%`) belong to repeated query texts

Interpretation:

- There is enough repeated-query traffic for tool-cache to matter.
- Exact tool-cache hit rate is currently UNKNOWN from SQL because the only counters live inside process memory and reset on restart.

5. Query embeddings are already cached, but only in the shared in-memory embedding cache, not in the MCP server's persistent SQLite `embedding_cache`.

Code evidence:

- `mcp_server/lib/providers/embeddings.ts:10-48` is only a re-export surface; the real behavior lives in `shared/embeddings.ts`.
- `shared/embeddings.ts:42-43` defines an in-memory `Map` with `EMBEDDING_CACHE_MAX_SIZE = 1000`.
- `shared/embeddings.ts:246-279` exposes cache lookup/store and only reports `size` and `maxSize`, not hits/misses.
- `shared/embeddings.ts:584-614` explicitly says query embeddings are cached, checks `query:` keys first, and only stores new query embeddings while cache occupancy is below 90% of capacity.
- `scripts/tests/test-embeddings-behavioral.js:612-620` verifies that the second `generateQueryEmbedding('search term')` call uses cache instead of hitting the provider again.

Implication:

- Repeat-query embedding caching already exists, but it is process-local and ephemeral.
- It does not survive process restarts and it does not currently emit hit-rate telemetry.

6. The persistent SQLite `embedding_cache` is real and active, but it currently serves document/save/retry paths rather than the Stage 1 search query path.

Code evidence:

- `mcp_server/lib/cache/embedding-cache.ts:63-83` defines persistent cache lookup with `last_used_at` update on hit.
- `mcp_server/lib/cache/embedding-cache.ts:109-135` stores cache entries in SQLite with LRU trimming.
- `mcp_server/lib/providers/retry-manager.ts:586-627` uses the persistent cache before `generateDocumentEmbedding()` during retry recovery.
- `mcp_server/dist/handlers/save/embedding-pipeline.js:75-147` uses the same persistent cache around save-time document embedding generation and logs `HIT`, `MISS+GENERATE`, and `STORE`.
- By contrast, `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:547-555` calls `generateQueryEmbedding(query)` directly and never consults `lib/cache/embedding-cache.ts`.

SQL evidence:

```sql
SELECT COUNT(*) AS total_entries,
       ROUND(COALESCE(SUM(LENGTH(embedding)),0)/1024.0/1024.0,2) AS total_size_mb,
       MIN(last_used_at) AS oldest_entry,
       MAX(last_used_at) AS newest_entry
FROM embedding_cache;

SELECT model_id, dimensions, COUNT(*) AS entries,
       ROUND(AVG(LENGTH(embedding))/1024.0,1) AS avg_kb,
       MIN(created_at) AS first_created,
       MAX(last_used_at) AS last_used
FROM embedding_cache
GROUP BY model_id, dimensions
ORDER BY entries DESC;

SELECT COUNT(*) AS reused_entries,
       ROUND(COUNT(*)*100.0/(SELECT COUNT(*) FROM embedding_cache),1) AS pct_reused
FROM embedding_cache
WHERE last_used_at > created_at;
```

Observed:

- `1325` persistent embedding-cache rows
- `5.18 MB` total blob storage
- all rows are `voyage-4 / 1024`
- `456` rows (`34.4%`) show reuse (`last_used_at > created_at`)

Interpretation:

- Persistent caching is already paying off for document-oriented flows.
- Search-query embeddings are not benefiting from this durable cache layer today.

7. Stage 2 and Stage 4 are probably not the primary latency drivers; Stage 3 can become the secondary bottleneck when reranking is actually active.

Code evidence:

- `mcp_server/lib/search/pipeline/stage2-fusion.ts:705-1064` performs local scoring, graph-signal enrichment, optional FSRS writes, sorting, and enrichment; there are no external provider calls in the normal Stage 2 path.
- `mcp_server/lib/search/pipeline/stage3-rerank.ts:137-160` and `:242-277` record rerank and MPAB timings separately.
- `mcp_server/lib/search/pipeline/stage3-rerank.ts:307-420` shows reranking is skipped unless enabled and sufficiently populated, but when active it can invoke either a local reranker or cross-encoder.
- `mcp_server/lib/search/pipeline/stage3-rerank.ts:375-382` passes `useCache: true` to the cross-encoder reranker.
- `mcp_server/lib/search/pipeline/stage4-filter.ts:242-328` is read-only filtering plus evidence-gap annotation and timing capture.

Interpretation:

- Stage 2 and Stage 4 are mostly CPU/SQLite work.
- Stage 3 is conditional: it is often cheap when disabled or short-circuited, but it is the most likely secondary hotspot after Stage 1 when cross-encoder reranking is active.

8. Deep-mode query intelligence can multiply Stage 1 embedding work and should be treated as latency-amplifying fanout, not a free retrieval enhancement.

Code evidence:

- `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:600-614` generates one embedding per decomposed facet.
- `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:660-675` generates one embedding per deep-query variant.
- `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:739-761` adds an embedding-based expansion branch.
- `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1008-1030` adds LLM reformulation fanout plus more query embeddings.
- `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1132-1140` can add a summary-embedding branch.

Interpretation:

- The baseline 500-800ms profile is already dominated by cold embedding generation.
- Deep-mode features can stack additional embedding calls and make the long tail substantially worse unless they are guarded by cache state, confidence, or tighter latency budgets.

## Concrete Recommendations

1. Persist true per-stage timing into `consumption_log.metadata` from `pipelineResult.metadata.timing`, and add channel-level timings inside `collectRawCandidates()`.
Expected impact: converts latency tuning from inference to measurement and makes vector/FTS/BM25/graph/RRF bottlenecks queryable by SQL.

2. Add explicit hit/miss counters for both the shared embedding cache and tool-cache, then surface them in telemetry and a health/debug endpoint.
Expected impact: gives a real cache hit rate instead of proxies like low-latency rows or `last_used_at > created_at`.

3. Promote repeat-query embeddings to a durable cache layer.
Expected impact: removes the Voyage round trip for repeated queries across process restarts, not just within a warm process. The simplest path is a `query:` namespace in persistent `embedding_cache` or a dedicated `query_embedding_cache` table keyed by normalized query, provider, and dimensions.

4. Keep exact-argument `memory_search` response caching aggressive for the common path, but normalize cache keys carefully so semantically identical repeated queries hit more often.
Expected impact: improves the already-visible fast path represented by the 3-10ms rows in `consumption_log`.

5. Treat deep-mode fanout features as opt-in latency spend and gate them behind a hard budget.
Expected impact: avoids multiplying Stage 1 embedding calls on queries that are already served adequately by base hybrid search.

6. If the target is sub-300ms median, prioritize cache-first wins over retrieval-parallelism work.
Expected impact: the current code already documents that channel collection is synchronous SQLite work, so the highest ROI is eliminating remote embedding calls on repeats rather than trying to parallelize local `better-sqlite3` channels.

## New Information Ratio

0.84
