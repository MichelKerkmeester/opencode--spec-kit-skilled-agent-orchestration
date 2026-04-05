# Iteration 002

## Focus
Q2: Performance bottlenecks in the hybrid search pipeline, with emphasis on token counting efficiency, fallback cascade overhead, BM25 rebuild cost, vector-search-adjacent latency, graph/degree overhead, and fusion computation.

## Scope Read
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`
- Supporting fusion code for call-path verification:
  - `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
  - `.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts`

## Findings

### 1. Fallback tiers rerun the full late-stage ranking pipeline instead of only widening candidate collection
- Impact: High
- Evidence:
  - `executeFallbackPlan()` calls `hybridSearchEnhanced()` for the primary and retry stages, so each fallback tier re-enters the full search stack: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L718), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L750)
  - `hybridSearchEnhanced()` does much more than candidate collection: degree scoring, channel enforcement, reranking, co-activation, folder scoring, confidence truncation, context-header injection, and token-budget truncation: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1046), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1246), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1458), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1482)
  - A cheaper staged path already exists: `collectRawCandidates()` uses `stopAfterFusion: true` so fallback can stop before the expensive post-fusion stages: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1552)
- Why it matters:
  - Queries that degrade from tier 1 to tier 2 or from primary to retry pay for vector retrieval, lexical retrieval, degree computation, MMR embedding fetches, co-activation, folder scoring, trace enrichment, and token-budget accounting multiple times before a final result is even chosen.
  - This is especially expensive for low-recall queries, which are exactly the queries most likely to trigger fallback.
- Recommendation:
  - Split the pipeline into `collect -> fuse -> decide tier -> enrich once`.
  - For fallback stages, use `stopAfterFusion: true` or a dedicated pre-ranking path, evaluate degradation on fused candidates, then run reranking/enrichment/token truncation only once on the final merged candidate set.

### 2. Token-budget truncation serializes every result multiple times in the hot path
- Impact: High
- Evidence:
  - `estimateResultTokens()` uses `JSON.stringify(result)` for each result, falling back only on serialization failure: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L2102)
  - `truncateToBudget()` first computes `totalTokens` with `reduce(... estimateResultTokens ...)`, then loops the same sorted results and calls `estimateResultTokens()` again during greedy admission: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L2174), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L2206)
  - This work happens after multiple result-copying passes that already inflate object size (`traceMetadata`, context headers, budget metadata): [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1423), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1458), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1491)
- Why it matters:
  - This turns token estimation into a repeated full-object serialization cost at the end of every non-eval search.
  - The work is proportional to payload size, so it gets worse exactly when content-rich results, trace metadata, or context headers are enabled.
- Recommendation:
  - Cache token estimates per result for the current request and reuse them for both `totalTokens` and greedy admission.
  - Avoid `JSON.stringify()` in the steady-state path; use a cheap field-based estimator for known result shapes and reserve full serialization for diagnostics.
  - Skip the extra sort inside `truncateToBudget()` when the caller already passes score-sorted rows.

### 3. The in-memory BM25 engine is still a full-corpus scan, and rebuilds are synchronous full reindexes
- Impact: High
- Evidence:
  - Each `BM25Index.search()` iterates every indexed document and computes score document-by-document: [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L312)
  - `calculateScore()` recomputes IDF lookups per query term and per document instead of using postings/intersections: [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L291)
  - `rebuildFromDatabase()` clears the whole in-memory index, pulls all active memories, rebuilds document text, tokenizes, and re-adds every row synchronously: [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L354)
  - That rebuild is invoked on startup and after checkpoint restore: [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1006), [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L414)
- Why it matters:
  - Search cost grows linearly with corpus size even though the server already has an FTS5 index for lexical search.
  - Startup and checkpoint-restore latency scale with the full memory table, because rebuild is a blocking retokenization pass.
- Recommendation:
  - Treat FTS5 BM25 as the default lexical engine and demote the in-memory BM25 path to a narrow fallback or experimental channel.
  - If the in-memory index must stay, switch to an inverted-index layout with postings lists and cached query-term IDF values.
  - Replace full rebuilds with incremental maintenance keyed off changed row IDs, or defer rebuild to a background warmup after startup.

### 4. Degree scoring is effectively N+1 SQL on cold cache, plus a global-max scan on every batch
- Impact: Medium
- Evidence:
  - `computeDegreeScores()` recomputes `computeMaxTypedDegree()` for every batch: [graph-search-fn.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts#L472)
  - For uncached IDs, it then calls `computeTypedDegree()` once per candidate, and each call issues a query over `causal_edges`: [graph-search-fn.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts#L333), [graph-search-fn.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts#L491)
  - The degree lane runs inside the search hot path immediately after channel collection: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1046)
- Why it matters:
  - Cold-cache or post-mutation queries will incur one global aggregate query plus one per-candidate query, which is avoidable because all requested IDs are already known up front.
  - This is one of the more expensive synchronous DB phases in the ranking path.
- Recommendation:
  - Batch candidate degree computation in one SQL statement using `WHERE source_id IN (...) OR target_id IN (...)` plus `GROUP BY node_id`.
  - Cache the global max typed degree alongside the per-node cache and invalidate both on causal-edge mutation.
  - Hoist `getDegreeCacheForDb(database)` outside the candidate loop to avoid repeated WeakMap lookups.

### 5. Graph retrieval pays extra SQL and JS dedup work because the FTS join shape is not index-friendly
- Impact: Medium
- Evidence:
  - `queryCausalEdgesFTS5()` joins `memory_fts` to `causal_edges` with an `OR` condition across both endpoints, then oversamples and deduplicates in JavaScript: [graph-search-fn.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts#L148), [graph-search-fn.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts#L161), [graph-search-fn.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts#L172)
  - The function also checks `sqlite_master` for FTS table availability on every graph query: [graph-search-fn.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts#L60), [graph-search-fn.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts#L87)
- Why it matters:
  - `OR` in join predicates often prevents the planner from using the best access path and inflates intermediate row counts.
  - The current plan then pays an extra JS pass to remove duplicates that were largely created by the join shape.
- Recommendation:
  - Rewrite the FTS graph query as a CTE that materializes matched rowids once, then `UNION ALL` source-side and target-side edge lookups before aggregating in SQL.
  - Cache FTS-table availability per bound database instance and invalidate it only on DB rebind.

### 6. Fusion work is duplicated when adaptive weights are requested but generic RRF still runs afterward
- Impact: Medium
- Evidence:
  - `hybridSearchEnhanced()` always calls `hybridAdaptiveFuse()` to obtain weights/results, then often builds `fusionLists` and calls `fuseResultsMulti()` again when graph or degree are present: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1114), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1145)
  - `hybridAdaptiveFuse()` always computes `standardFuse()` first, even before it knows whether the caller will use the adaptive result directly: [adaptive-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L366)
  - Both `standardFuse()` and `adaptiveFuse()` call `fuseResultsMulti()`: [adaptive-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L225), [adaptive-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L303)
  - The core RRF itself is linear over total ranked items, so the real overhead is redundant invocation, not the algorithm body: [rrf-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L262)
- Why it matters:
  - Queries with graph or degree enabled can pay for one standard lexical/semantic fusion inside `hybridAdaptiveFuse()` and then a second full fusion when the final channel set is assembled.
  - This is avoidable because the pipeline often only needs adaptive weights, not a full pre-fused result list.
- Recommendation:
  - Expose a cheap `getAdaptiveWeights(intent, documentType)` helper and let `hybridSearchEnhanced()` build the final `fusionLists` once.
  - Only call `hybridAdaptiveFuse()` in the narrow branch where the caller can return its results directly.

### 7. Vector-search-adjacent latency is amplified by re-fetching embeddings for MMR after retrieval
- Impact: Medium
- Evidence:
  - The vector channel already runs before fusion: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L981)
  - Later, MMR issues a second database read to fetch embeddings from `vec_memories` for the reranked IDs, then rebuilds `Float32Array` views and does per-candidate lookups: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1260), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1272), [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1305)
  - The `diversified.map(... reranked.find ...)` merge is also an avoidable O(n^2) pass, even if `n` is usually small: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1305)
- Why it matters:
  - Fallback queries can execute vector retrieval multiple times, then still pay an extra embedding fetch for MMR.
  - Even with small `limit`, this adds synchronous DB work and extra object churn in the hottest branch after fusion.
- Recommendation:
  - Let the vector channel optionally return embedding buffers for the top-K hits, or maintain a request-scoped embedding cache keyed by memory ID.
  - Replace `reranked.find(...)` with a `Map` built once from reranked IDs.

## Overall Assessment
- The biggest costs are not the individual scoring formulas; they are duplicated pipeline passes and repeated whole-object work after fusion.
- The best near-term win is to make fallback operate on pre-enrichment candidates and defer reranking, trace/header injection, and token-budget truncation until the final tier is chosen.
- The next highest-value change is to shrink lexical and graph-side synchronous DB work: reduce dependence on the in-memory BM25 full scan, batch degree computation, and rewrite the graph FTS join to avoid OR-based duplication.
