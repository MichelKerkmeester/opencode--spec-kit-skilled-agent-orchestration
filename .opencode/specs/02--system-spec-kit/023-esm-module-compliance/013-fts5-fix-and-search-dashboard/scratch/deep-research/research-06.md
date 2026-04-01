# Research Iteration 6: Embedding generation, circuit breaker, and FTS behavior

## Question

Is the vector channel getting a valid embedding, or is embedding generation failing silently due to provider failure or the embedding circuit breaker?

Also: could `ftsSearch()` be returning `[]` because it is swallowing an internal SQLite error?

## Short answer

In the **current environment**, the vector lane **is** getting a valid embedding.

A live runtime probe using the built server modules generated a **1024-dim Voyage embedding** for the query `semantic`. In the same probe:

- `vector_search(..., minSimilarity=30)` returned `0`
- `vector_search(..., minSimilarity=17)` returned `0`
- `vector_search(..., minSimilarity=10)` returned `0`
- `fts5Bm25Search('semantic')` returned `5`

I also ran the requested raw SQLite CLI probe:

- `SELECT COUNT(*) FROM memory_fts WHERE memory_fts MATCH "semantic"` -> **337**

So the new hypothesis is **not supported by current evidence**:

1. embedding generation is **working** in this environment,
2. the vector lane can still return `[]` even with a valid embedding,
3. FTS is **not** universally empty for `semantic`,
4. therefore the likely failure is **not** "vector got no embedding" for this runtime.  

The stronger current signal is:

- query embedding succeeds,
- vector similarity search still finds no qualifying neighbors for that query,
- while lexical FTS finds many matches.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:10-49`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:684-723`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:308-348`]  
[SOURCE: live runtime probe on 2026-04-01 using `mcp_server/dist/lib/providers/embeddings.js`, `vector-index-queries.js`, and `sqlite-fts.js`]  
[SOURCE: sqlite3 CLI probe on 2026-04-01 against `database/context-index.sqlite`]

## 1. Correct file path: the prompt path was slightly wrong

The file requested in the prompt does not exist at:

- `.opencode/skill/system-spec-kit/mcp_server/providers/embeddings.ts`

The actual file is:

- `.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts`

That file is only a **re-export facade**. The real implementation lives in:

- `.opencode/skill/system-spec-kit/shared/embeddings.ts`
- `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts`

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:1-49`]

## 2. How embeddings are generated

### 2.1 The MCP server facade is only a re-export

`mcp_server/lib/providers/embeddings.ts` exports named functions like:

- `generateEmbedding`
- `generateQueryEmbedding`
- `generateDocumentEmbedding`
- `validateApiKey`
- `__embeddingCircuitTestables`

But all of them come from `@spec-kit/shared/embeddings`.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts:10-49`]

### 2.2 The real query embedding path

`generateQueryEmbedding(query)` in `shared/embeddings.ts` behaves like this:

1. reject empty query -> `null`
2. check cache
3. if embedding circuit breaker is open -> return `null`
4. lazily initialize provider via `getProvider()`
5. call `provider.embedQuery(trimmed)`
6. on success -> record circuit success and optionally cache
7. on error -> record circuit failure, log warning, return `null`

This is a **silent-null** API at runtime: it does not throw on provider failure; it warns and returns `null`.  

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:684-723`]

### 2.3 Lazy provider initialization

Provider initialization is lazy:

```ts
providerInstance = await createEmbeddingsProvider({ warmup: false })
```

So startup does not fully instantiate the provider object for embeddings; it only validates configuration and dimensions, then marks the model "ready" for lazy first use.  

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:384-417`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js:1108-1113`]

## 3. Which provider is used, and what env vars matter

### 3.1 Provider resolution

Provider resolution precedence is:

1. `EMBEDDINGS_PROVIDER`
2. `VOYAGE_API_KEY`
3. `OPENAI_API_KEY`
4. fallback to `hf-local`

Important detail: the env var name is **`EMBEDDINGS_PROVIDER`** (plural), not `EMBEDDING_PROVIDER`.  

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:220-229`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:308-348`]

### 3.2 Required provider env vars

- `voyage` requires `VOYAGE_API_KEY`
- `openai` requires `OPENAI_API_KEY`
- `hf-local` requires no cloud API key

If a cloud provider is explicitly selected without its key, provider creation throws.  

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:351-407`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts:126-138`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts:102-112`]

### 3.3 What is configured in this environment

From the live shell environment for this session:

- `VOYAGE_API_KEY=<set>`
- `OPENAI_API_KEY=<unset>`
- `EMBEDDINGS_PROVIDER=<unset>`
- `SPECKIT_SKIP_API_VALIDATION=<unset>`
- `EMBEDDING_DIM=<unset>`

The repository root `.env` file also contains `VOYAGE_API_KEY`, but I did **not** find any `dotenv`-style loading code in `system-spec-kit`; the `mcp_server` start script is simply:

```json
"start": "node dist/context-server.js"
```

So the runtime appears to rely on the **inherited process environment** rather than internal `.env` loading. In this session, that inherited environment does contain `VOYAGE_API_KEY`.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:16-19`]  
[SOURCE: code search on 2026-04-01 for `dotenv|--env-file|loadEnv|config\\(` under `.opencode/skill/system-spec-kit` returned no matches]  
[SOURCE: live shell env probe on 2026-04-01]  
[SOURCE: repository root `.env:14-18`]

## 4. Embedding circuit breaker: real and enabled by default

The embedding circuit breaker is in `shared/embeddings.ts`, not in `lib/search/`.

It is controlled by:

- `SPECKIT_EMBEDDING_CIRCUIT_BREAKER` (default ON)
- `SPECKIT_EMBEDDING_CB_THRESHOLD` (default `3`)
- `SPECKIT_EMBEDDING_CB_COOLDOWN_MS` (default `60000`)

Behavior:

- after 3 consecutive embedding failures, the circuit opens,
- during cooldown, embedding calls return `null` immediately,
- after cooldown, the circuit becomes half-open and allows a probe request.

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:39-99`]

### 4.1 Search flags file does not define this flag

I checked `mcp_server/lib/search/search-flags.ts`.

There is **no** `SPECKIT_EMBEDDING_CIRCUIT_BREAKER` flag defined there. That is expected, because the circuit breaker belongs to the shared embeddings module rather than the search-flags module.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:1-260`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:46-57`]

### 4.2 Distinguish this from the cross-encoder circuit breaker

I found a separate circuit breaker in:

- `mcp_server/lib/search/cross-encoder.ts`

That one is only for reranker APIs (`voyage`, `cohere`, `local`) and does **not** control query embedding generation.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:141-205`]

## 5. What happens if the API key is missing or invalid?

There are **two different behaviors** depending on when the failure happens.

### 5.1 Startup validation behavior: fail fast

At server startup, `dist/context-server.js` does:

1. `validateConfiguredEmbeddingsProvider()`
2. `resolveStartupEmbeddingConfig()`
3. API key validation

If validation is invalid and **not** a network error, startup exits fatally:

```ts
console.error('[context-server] FATAL: Cannot start MCP server with invalid API key');
process.exit(1);
```

This validation is skipped only when:

- `SPECKIT_SKIP_API_VALIDATION=true`

If the problem is a **network error**, startup warns and continues.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js:1024-1079`]

### 5.2 Runtime query embedding behavior: warn and return null

After startup, runtime query embedding is softer:

- if circuit open -> `null`
- if provider throws -> record failure, warn, return `null`

So yes, **runtime embedding generation can fail silently into `null`** from the caller's point of view.  

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:698-723`]

### 5.3 But stage1 hybrid does not silently continue with null

This is the key link to the search pipeline:

`stage1-candidate-gen.ts` does:

```ts
const effectiveEmbedding =
  queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));

if (!effectiveEmbedding) {
  throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
}
```

So in the **standard hybrid stage1 path**, a null query embedding should produce an **error**, not a normal `candidateCount: 0`.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:608-614`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:854-858`]

## 6. Live runtime probe: the current environment does produce a valid embedding

I ran a direct runtime probe using the built server module:

```ts
import { generateQueryEmbedding, getProviderMetadata } from './mcp_server/dist/lib/providers/embeddings.js';
const embedding = await generateQueryEmbedding('semantic');
```

Observed output:

```json
{
  "embeddingLength": 1024,
  "provider": "voyage",
  "model": "voyage-4"
}
```

This is strong direct evidence that:

- query embedding is working,
- provider selection resolved to `voyage`,
- the resulting embedding dimension is `1024`,
- the current environment is not in an embedding-circuit-open state for this probe.

[SOURCE: live runtime probe on 2026-04-01 using `mcp_server/dist/lib/providers/embeddings.js`]

## 7. Vector probe: valid embedding, zero vector neighbors

I then ran a combined probe using:

- `generateQueryEmbedding('semantic')`
- `vector_search(embedding, { minSimilarity: 30 | 17 | 10 })`
- `fts5Bm25Search(db, 'semantic', { limit: 5 })`

Observed output:

```json
{
  "embeddingLength": 1024,
  "vector": {
    "10": 0,
    "17": 0,
    "30": 0
  },
  "fts": 5
}
```

This is the most important finding from this iteration.

It shows that, for the query `semantic`:

- the embedding is valid,
- vector search still returns zero results at all three fallback thresholds,
- FTS returns non-empty results in the same runtime.

That means the current runtime is consistent with:

- **valid embedding**
- **empty vector neighborhood**
- **non-empty lexical channel**

and inconsistent with:

- "the vector channel got no embedding at all"
- "FTS is universally failing for this query"

[SOURCE: live runtime probe on 2026-04-01 using `mcp_server/dist/lib/providers/embeddings.js`, `vector-index-queries.js`, and `sqlite-fts.js`]

## 8. Why vector can still be empty even with a valid embedding

`vector_search()` validates embedding dimension first:

```ts
if (!query_embedding || query_embedding.length !== expected_dim) {
  throw new VectorIndexError(...)
}
```

Then it computes:

```ts
const max_distance = 2 * (1 - minSimilarity / 100);
```

and filters rows by distance.

So if no rows satisfy the threshold, vector search legitimately returns `[]`.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:168-200`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:221-283`]

Inside hybrid search, the vector lane is wrapped in a non-fatal channel try/catch:

```ts
try {
  const vectorResults = vectorSearchFn(embedding, ...)
  ...
} catch (_err) {
  console.warn('[hybrid-search] Channel error:', ...)
}
```

So a vector-channel failure becomes an empty vector lane, not a pipeline crash.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1054-1084`]

## 9. Subtle conditional risk: auto fallback to `hf-local`

There is one important **conditional** failure mode, even though it is **not** what I observed live right now.

If provider creation for auto-selected Voyage/OpenAI fails at runtime, `createEmbeddingsProvider()` may automatically fall back to `hf-local` when the provider was not explicitly forced:

```ts
if ((providerName === 'openai' || providerName === 'voyage') && allowsAutomaticFallback(options.provider)) {
  return createFallbackProvider(...)
}
```

`allowsAutomaticFallback()` is true when provider is unset or `auto`.  

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:152-155`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:495-558`]

That fallback path explicitly warns that the embedding dimension may change:

```ts
WARNING: Provider fallback changed embedding dimension ...
```

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:452-488`]

If such a fallback produced embeddings with a different dimension than the vector index expects, then `vector_search()` would reject them with:

```ts
Invalid embedding dimension: expected X, got Y
```

and the vector channel would collapse to empty while FTS could still work.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:190-197`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1056-1084`]

However, that is **not** what I observed in this session: current live probe produced a 1024-dim Voyage embedding, which matches the expected startup path.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js:1081-1083`]  
[SOURCE: live runtime probe on 2026-04-01]

## 10. FTS behavior: can return [] on error, but current evidence says it works

### 10.1 `ftsSearch()` does swallow errors

`ftsSearch()` in `hybrid-search.ts` does:

```ts
try {
  const bm25Results = fts5Bm25Search(...)
  return bm25Results.map(...)
} catch (error) {
  console.warn(`[hybrid-search] FTS search failed: ${msg}`);
  return [];
}
```

So yes: if an exception happens, `ftsSearch()` returns `[]`.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:446-471`]

### 10.2 The underlying SQLite FTS helper also swallows errors

`fts5Bm25Search()`:

- tokenizes and sanitizes the query,
- returns `[]` if sanitization yields no query,
- catches SQLite errors,
- logs a warning,
- returns `[]`

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:48-103`]

### 10.3 But the current query does match FTS data

The requested direct SQLite probe returned:

- `SELECT COUNT(*) FROM memory_fts WHERE memory_fts MATCH "semantic"` -> **337**

And the live runtime helper probe returned:

- `fts5Bm25Search('semantic', { limit: 5 })` -> **5**

So for this specific query and database:

- FTS infrastructure is present,
- `semantic` has many FTS matches,
- current evidence does **not** support an internal silent FTS error for this query.

[SOURCE: sqlite3 CLI probe on 2026-04-01 against `database/context-index.sqlite`]  
[SOURCE: live runtime probe on 2026-04-01 using `sqlite-fts.js`]

## 11. What the compiled `dist/context-server.js` tells us

The compiled server confirms:

1. startup validates configured embeddings provider,
2. startup validates API key unless explicitly skipped,
3. invalid non-network validation is fatal,
4. embeddings are lazy-loaded on first use,
5. startup validates embedding dimension against the database and refuses to continue on mismatch.

That means the server is designed to fail early on obvious configuration problems rather than silently running with a broken embedding stack.  

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js:1024-1079`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js:1081-1130`]

## Final conclusion

### Ruled out for the current environment

1. **"No valid query embedding is being generated."**  
   Ruled out by live runtime probe: `generateQueryEmbedding('semantic')` returned a **1024-dim Voyage embedding**.  

2. **"The vector channel is empty because the embedding circuit breaker is currently blocking all queries."**  
   Not supported by the live probe; query embedding succeeded immediately.  

3. **"FTS is empty because `ftsSearch()` is silently failing for `semantic`."**  
   Not supported by current evidence; SQLite CLI returned **337** matches and runtime FTS helper returned **5** top rows.

### Supported by current evidence

1. **Runtime embedding generation can fail softly** (return `null`) on provider error or open circuit breaker.  
   This is real behavior in `shared/embeddings.ts`.  

2. **But stage1 hybrid should throw if query embedding is null**, so a null embedding should look more like an error than a clean `candidateCount: 0` in the standard hybrid path.  

3. **In this environment, the real observed behavior is: valid embedding + zero vector neighbors + non-empty FTS.**

### Best next step

The highest-value next investigation is now:

1. run the **actual failing query** through the same live probe,
2. capture:
   - embedding length/provider/model
   - vector result counts at `30`, `17`, `10`
   - FTS result count
   - BM25 result count
3. if vector is still zero while FTS is non-zero, inspect **why that query has no close vector neighbors** rather than chasing provider failure.

The main hypothesis for this iteration — **"embedding generation is failing silently, so vector gets no embedding"** — is **not supported** by the current runtime evidence.
