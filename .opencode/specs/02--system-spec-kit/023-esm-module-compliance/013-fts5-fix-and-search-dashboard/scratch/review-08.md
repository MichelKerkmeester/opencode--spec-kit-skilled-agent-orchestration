# Review Iteration 08 — Configuration (Part 2): Circuit Breakers and Embedding Provider

**Reviewer:** Copilot CLI / GPT 5.4 High  
**Dimension:** Embedding circuit breaker, embedding provider configuration, vector search preconditions  
**Files reviewed:** `shared/embeddings.ts`, `shared/embeddings/factory.ts`, `shared/embeddings/providers/openai.ts`, `shared/embeddings/providers/voyage.ts`, `shared/embeddings/providers/hf-local.ts`, `vector-index-store.ts`, `vector-index-queries.ts`, `search-flags.ts`, `pipeline/stage1-candidate-gen.ts`

---

## Findings

### F08-1: P1 — EMBEDDING_DIM can desync provider from vector store

- **File:** `shared/embeddings/factory.ts:258-266,495-517`, `shared/embeddings/providers/openai.ts:101-106`, `shared/embeddings/providers/voyage.ts:126-131`, `mcp_server/lib/search/vector-index-store.ts:103-123,813-830`
- **Severity:** P1 (likely bug)
- **Description:** Startup/vector code honors `process.env.EMBEDDING_DIM`, but provider construction does not pass the resolved dimension into the provider instance. The DB/schema can bootstrap with one dimension while the live provider emits another. This causes `VectorIndexError: Invalid embedding dimension` at query time, which is caught and returns `[]`.
- **Fix:** Pass `requestedDim` into `createProviderInstance(...)` and fail fast if env/model dimensions disagree.

### F08-2: P1 — Invalid cloud config can auto-fallback to hf-local and change dimensions

- **File:** `shared/embeddings/factory.ts:152-155,423-449,452-488,541-555`, `mcp_server/lib/search/vector-index-store.ts:103-123,813-830`
- **Severity:** P1 (likely bug)
- **Description:** Missing/invalid cloud credentials in `auto` mode can fall back to `hf-local`. If the original provider was 1024/1536 and fallback is 768, vector search becomes incompatible with stored embeddings. All vector queries would fail with dimension mismatch.
- **Fix:** Fail closed on invalid cloud config during startup, or initialize the provider/profile before DB bootstrap and isolate DBs per provider.

### F08-3: P1 — Embedding circuit breaker suppresses all embedding generation for 60s

- **File:** `shared/embeddings.ts:46-57,66-99,456-508,684-723`, `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:608-614,901-906`
- **Severity:** P1 (likely bug)
- **Description:** After 3 consecutive failures, the breaker opens and ALL embedding calls return `null` for 60s. Hybrid/vector callers treat missing embeddings as failure, so semantic retrieval disappears for every query during cooldown. Stage 1 hybrid path throws on null embedding (line 612-613), failing the entire pipeline.
- **Fix:** Surface breaker state in diagnostics. Make hybrid degrade to keyword/FTS instead of throwing on null embedding.

### F08-4: P2 — sqlite-vec load failure degrades to empty vector results

- **File:** `mcp_server/lib/search/vector-index-store.ts:795-803,381-435`, `mcp_server/lib/search/vector-index-queries.ts:173-176,323-326`
- **Severity:** P2
- **Description:** `sqliteVec.load()` failure is logged but runtime continues in "anchor-only mode". Vector queries return `[]`. If other channels are weak/disabled, this looks like "search returns 0 results."
- **Fix:** Promote to startup health/error state. Include `sqlite_vec_available=false` in search diagnostics/responses.

---

## Key Answers

1. **Is there an embedding circuit breaker?** Yes. Default-ON, trips after 3 consecutive failures, 60s cooldown. Returns `null` for all embedding calls while open.
2. **Missing/invalid API key behavior?** Throws on embedding generation, caught by pipeline. Falls back to local if `auto` mode enabled. Can cause dimension mismatch.
3. **How is sqlite-vec loaded?** Via `sqliteVec.load()` during `initialize_db()`. Failure is logged, sets `sqlite_vec_available_flag = false`, continues in degraded mode.
4. **Dimension mismatch?** Throws `VectorIndexError: Invalid embedding dimension`, caught by search path, returns `[]`.
5. **Stale/corrupted config?** Yes. `EMBEDDING_DIM` env var can override model dimension, creating permanent desync.
