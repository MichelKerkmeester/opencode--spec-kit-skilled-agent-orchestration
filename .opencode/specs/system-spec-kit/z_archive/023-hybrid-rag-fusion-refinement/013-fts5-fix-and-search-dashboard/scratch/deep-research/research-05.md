# Research Iteration 5: `executeFallbackPlan` and where `0` candidates originate

## Question

Inside the hybrid fallback path, where can `candidateCount: 0` actually originate?

The focus for this iteration was:

1. `executeFallbackPlan()`
2. the primary-stage hybrid execution path
3. the vector search call and embedding handoff
4. the stage1 `collectRawCandidates()` call site
5. the embeddings provider and any embedding circuit breaker

## Short answer

The `0` candidates do **not** appear to come from stage1 forgetting to pass the embedding.

Stage1 resolves `effectiveEmbedding`, throws if it is missing, and passes that embedding into `hybridSearch.collectRawCandidates(...)`. Inside hybrid search, the primary stage uses `collectAndFuseHybridResults(query, embedding, primaryOptions)`, and the vector lane passes that same embedding into `vectorSearchFn(embedding, ...)`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:608-614`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:854-858`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:773-780`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1054-1064`]

The likely origin of `0` is narrower:

- every active hybrid lane returns `[]` for the query, especially vector under the fallback similarity thresholds, and
- `collectRawCandidates()` still returns **fused** output rather than true raw per-channel candidates, so stage1 sees `0` once fusion input is effectively empty. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1677-1720`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1180-1193`] [SOURCE: `.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:290-299`]

## Trace: `stage1` -> `collectRawCandidates` -> `executeFallbackPlan`

### 1. Stage1 passes the embedding correctly

For hybrid search, stage1 computes:

```ts
const effectiveEmbedding =
  queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
```

and then immediately fails hard if that embedding is absent:

```ts
if (!effectiveEmbedding) {
  throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
}
```

Then the standard hybrid path calls:

```ts
hybridSearch.collectRawCandidates(
  effectiveQuery,
  effectiveEmbedding,
  { limit, specFolder, includeArchived }
)
```

So stage1 is not silently calling hybrid search with a null embedding in the normal hybrid path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:608-614`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:854-858`]

### 2. `collectRawCandidates()` delegates into `executeFallbackPlan()`

`collectRawCandidates()` does:

```ts
const { allowedChannels, stages } = await executeFallbackPlan(
  query,
  embedding,
  options,
  isSearchFallbackEnabled() ? 'tiered' : 'adaptive',
  { stopAfterFusion: true }
);
```

Then it prefers staged results from `stages[0]`/`stages[1]`, and only if those are empty does it separately run FTS-only and BM25-only fallback searches. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1677-1719`]

## What `executeFallbackPlan()` actually does

`executeFallbackPlan()` does **not** call `hybridSearchEnhanced()` for the primary stage.

Instead, it directly runs:

```ts
const primaryExecution = await collectAndFuseHybridResults(query, embedding, primaryOptions);
const primaryResults = primaryExecution
  ? applyResultLimit(primaryExecution.fusedResults, primaryOptions.limit)
  : await hybridSearch(query, embedding, primaryOptions);
```

So the primary stage uses the enhanced internal fusion path by calling `collectAndFuseHybridResults(...)` directly. `hybridSearchEnhanced()` is just a thin wrapper around that same helper. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:773-780`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:970-985`]

## Important finding: `collectRawCandidates()` is not really returning raw candidates

The docstring says:

> "Returns unfused candidate results from the first non-empty collection stage."

But the actual implementation passes `{ stopAfterFusion: true }`, and `collectAndFuseHybridResults()` returns:

```ts
if (options.stopAfterFusion) {
  return {
    ...,
    fusedResults: collectCandidatesFromLists(
      lists.filter((list) => list.source !== 'degree'),
      options.limit ?? DEFAULT_LIMIT
    ),
  };
}
```

That means `collectRawCandidates()` still consumes `execution.fusedResults`, not the raw per-channel lists themselves. It is "pre-enrichment" and "pre-rerank", but **not pre-fusion**. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1677-1719`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1180-1193`]

This matters because if all channel lists are empty, `collectRawCandidates()` returns `[]` even though the code path is named "collect raw candidates."

## Inside the primary stage: the vector lane does receive the embedding

Inside `collectAndFuseHybridResults()`, the vector lane is:

```ts
if (activeChannels.has('vector') && embedding && vectorSearchFn) {
  const vectorResults = vectorSearchFn(embedding, {
    limit: options.limit || DEFAULT_LIMIT,
    specFolder: options.specFolder,
    minSimilarity: options.minSimilarity || 0,
    includeConstitutional: false,
    includeArchived: options.includeArchived || false,
    includeEmbeddings: true,
  });
  ...
  lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
}
```

So the embedding is definitely passed into the vector search function. There is no sign here that the embedding is omitted, replaced with `null`, or accidentally dropped before the vector query executes. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1054-1081`]

## Where vector results can become empty without error

The vector query itself returns `[]` in normal non-error situations.

`vector_search(...)` validates the embedding dimension, converts the embedding to a buffer, and then uses:

```ts
const max_distance = 2 * (1 - minSimilarity / 100);
...
WHERE sub.distance <= ?
```

So if no rows satisfy the distance threshold, the vector lane simply returns an empty array. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:190-200`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:259-283`]

That is directly relevant because `executeFallbackPlan()` sets:

- primary min similarity = `30`
- adaptive retry min similarity = `17`
- tiered retry min similarity = `10`

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:235-239`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:773-777`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:794-799`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:813-819`]

So a fully healthy vector stack can still yield `[]` if the query has no neighbors under those thresholds.

## The lexical lanes are not skipped by the complexity router

I checked whether internal routing could reduce the pipeline to vector-only and thereby explain `0`.

It does not.

`routeQuery()` guarantees at least two channels via `enforceMinimumChannels()`, and the default `simple` route is already `['vector', 'fts']`. If the complexity router is disabled, it returns **all** channels. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:43-47`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:62-72`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:83-95`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:138-163`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:45-48`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:154-158`]

So if `candidateCount: 0` comes out of `collectRawCandidates()`, it is not because lexical search was silently disabled by query routing. It means the active routed lanes all produced `[]`.

## FTS and BM25 can also legitimately return `[]`

### FTS

`ftsSearch()` short-circuits to `[]` if `db` is missing or `memory_fts` is unavailable, and otherwise catches any query failure and returns `[]`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:426-437`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:446-471`]

From prior iterations, we already know `db` is present and `memory_fts` exists, so the most likely remaining FTS-empty case is simply "no lexical matches for this query" rather than missing infrastructure.

### BM25

`bm25Search()` also legitimately returns `[]` when:

- BM25 is disabled
- the index has no matching rows
- scoped spec-folder lookup fails closed

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:326-399`]

So the hybrid path can produce an all-empty `lists` set even when all subsystems are up.

## Could the embedding provider fail silently?

Yes, but not in the way that fits the observed stage1 call path.

The embeddings facade in `mcp_server/lib/providers/embeddings.ts` is only a re-export of the shared provider implementation. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:1-49`]

The real `generateQueryEmbedding()` implementation is in `shared/embeddings.ts`, and it can return `null` in several non-throwing cases:

- empty query
- circuit breaker open
- provider exception

Specifically:

```ts
if (isEmbeddingCircuitOpen()) {
  return null;
}
...
catch (...) {
  recordEmbeddingFailure();
  console.warn(...);
  return null;
}
```

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:1-49`] [SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:46-57`] [SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:66-79`] [SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:684-723`]

However, in the stage1 hybrid path that does **not** explain a silent zero result, because stage1 explicitly throws if `effectiveEmbedding` is null before it ever calls hybrid search. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:608-614`]

So:

- **embedding provider silent nulls are possible**
- but **they should cause a stage1 error**, not a normal `candidateCount: 0`, in the standard hybrid branch

## Is there an embedding circuit breaker under `lib/search/`?

Not for query embedding generation.

The only circuit breaker I found under `lib/search/` is for the cross-encoder reranker, not embeddings. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:141-187`] 

The actual embedding circuit breaker lives in `shared/embeddings.ts` and is re-exported through the provider facade. [SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:39-99`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:10-49`]

## Can fusion itself collapse non-empty channel lists to zero?

The RRF combiner does not appear to be the origin of empty results.

`fuseResultsMulti()` skips only lists with `weight <= 0` or `list.results.length === 0`. For any non-empty, positive-weight list, it inserts items into `scoreMap` and returns `Array.from(scoreMap.values())...`. [SOURCE: `.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:264-327`] [SOURCE: `.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:254-255`]

So if fusion output is empty, the most likely reason is that the input lists were empty (or all had zero weight, which is not the case for the normal vector/fts/bm25 paths here).

## Final conclusion

### Ruled out

1. **Stage1 forgetting to pass the embedding**  
   Ruled out. Stage1 computes `effectiveEmbedding`, throws if null, and passes it into `collectRawCandidates()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:608-614`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:854-858`]

2. **`executeFallbackPlan()` dropping the embedding before vector search**  
   Ruled out. The vector lane explicitly calls `vectorSearchFn(embedding, ...)`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1054-1064`]

3. **Complexity router silently disabling lexical lanes**  
   Ruled out. The router enforces at least two channels and defaults to vector+fts for simple queries. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:62-72`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:83-95`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:154-163`]

### Most likely actual origin of `0`

`candidateCount: 0` most likely originates when:

1. vector search receives the embedding correctly but returns `[]` under the current `minSimilarity` threshold,
2. FTS/BM25 also return `[]` for that same query/scope,
3. `collectAndFuseHybridResults()` therefore has no effective ranked lists,
4. `collectRawCandidates()` returns empty because it is still consuming **fused** results rather than raw lane outputs. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:199-200`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:259-283`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1180-1193`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1677-1720`]

## Best next step

The highest-value next check is now **not** "is the embedding missing?" but:

1. run the failing query directly through `vector_search(...)` at `minSimilarity = 30`, `17`, and `10`
2. run the same query through `ftsSearch(...)` and `bm25Search(...)`
3. inspect whether all lanes are independently empty for that query/spec scope
4. if needed, instrument `collectAndFuseHybridResults()` to log `lists.map(l => [l.source, l.results.length])`

That will tell us whether the true origin is:

- thresholded vector emptiness,
- scoped lexical emptiness,
- or an unexpectedly empty `lists` assembly step before fusion.

## Sources

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:608-614`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:854-858`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:235-239`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:326-399`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:426-471`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:604-640`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:674-705`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:763-836`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:970-985`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:987-1081`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1180-1193`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1677-1720`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:43-47`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:62-72`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:83-95`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:138-163`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:45-48`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:154-158`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:168-283`
- `.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:1-49`
- `.opencode/skill/system-spec-kit/shared/embeddings.ts:39-99`
- `.opencode/skill/system-spec-kit/shared/embeddings.ts:684-723`
- `.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:254-327`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:141-187`
