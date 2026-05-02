# Iteration 005: Embedding Lifecycle

## Findings

### [P0] `get_embedding_dim()` can size the vector index for the wrong provider
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`

**Issue**: `get_embedding_dim()` does not use the canonical provider-resolution rules before the provider is initialized. It returns `1024` whenever `VOYAGE_API_KEY` is merely present and `1536` whenever `OPENAI_API_KEY` is present, even if `EMBEDDINGS_PROVIDER=hf-local` explicitly forces the local 768-dim provider or if the Voyage key is a placeholder that the shared factory intentionally ignores. Because `initialize_db()` passes this helper into schema creation and dimension validation, a valid configuration can bootstrap the database with the wrong vector width and only fail later when real embeddings are generated.

**Evidence**:
- [`vector-index-store.ts:88`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L88) returns dimensions from raw env presence checks instead of canonical provider resolution.
- [`vector-index-store.ts:598`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L598) and [`vector-index-store.ts:662`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L662) use that helper during DB initialization/schema setup.
- [`shared/embeddings/factory.ts:206`](../../../../../../skill/system-spec-kit/shared/embeddings/factory.ts#L206) resolves providers with different precedence: explicit `EMBEDDINGS_PROVIDER` first, then non-placeholder Voyage, then non-placeholder OpenAI, then `hf-local`.
- [`tests/embeddings.vitest.ts:46`](../../../../../../skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts#L46) and [`tests/embeddings.vitest.ts:66`](../../../../../../skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts#L66) explicitly codify those canonical rules.

**Fix**: Replace the ad hoc env checks in `get_embedding_dim()` with the same startup-resolution path used by the shared embeddings package, so dimension selection is derived from the resolved provider/model profile rather than raw key presence.

### [P1] Provider-specific database isolation is bypassed before the embedding provider initializes
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`

**Issue**: `resolve_database_path()` only uses `profile.getDatabasePath()` when `getEmbeddingProfile()` already has a live provider instance. The shared embeddings facade returns `null` until lazy initialization completes, so first-touch callers open the generic `DEFAULT_DB_PATH` instead of a provider/model/dimension-specific database. That defeats the intended isolation between 768-, 1024-, and 1536-dim indexes and turns provider switches into shared-DB integrity failures.

**Evidence**:
- [`vector-index-store.ts:206`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L206) falls back to `DEFAULT_DB_PATH` when no profile is available.
- [`shared/embeddings.ts:735`](../../../../../../skill/system-spec-kit/shared/embeddings.ts#L735) returns `null` from `getEmbeddingProfile()` until `providerInstance` exists.
- [`retry-manager.ts:441`](../../../../../../skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts#L441) and many store entry points call into `initializeDb()/getDb()` before any embedding call has initialized the provider.
- The shared contract explicitly expects per-profile DB paths: [`shared/mcp_server/database/README.md:34`](../../../../../../skill/system-spec-kit/shared/mcp_server/database/README.md#L34).

**Fix**: Derive the startup DB path from resolved provider/model/dimension metadata even before lazy provider initialization, or add a synchronous startup-profile helper so DB selection and dimension selection share the same canonical source.

### [P1] The SQLite embedding cache can replay stale vectors after a dimension change
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`

**Issue**: Cache rows store `dimensions`, but `lookupEmbedding()` ignores that field and keys lookups only by `(content_hash, model_id)`. In `retryEmbedding()`, a cache hit is rehydrated directly into a `Float32Array` and treated as authoritative without checking the stored dimension against the current embedding dimension. If the same model name is reused with a different configured dimension, the retry path can serve a stale cached vector and attempt to persist it into the current index.

**Evidence**:
- [`embedding-cache.ts:38`](../../../../../../skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts#L38) stores `dimensions` alongside each cached embedding.
- [`embedding-cache.ts:67`](../../../../../../skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts#L67) reads `dimensions` but discards it and returns only the raw buffer.
- [`retry-manager.ts:586`](../../../../../../skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts#L586) computes the cache key from normalized content plus `getModelName()`, then [`retry-manager.ts:592`](../../../../../../skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts#L592) rebuilds the vector from byte length alone.
- [`shared/embeddings/factory.ts:143`](../../../../../../skill/system-spec-kit/shared/embeddings/factory.ts#L143) allows provider dimensions to vary independently of model names via explicit `dim` overrides, so `model_id` is not a sufficient cache discriminator.

**Fix**: Include the resolved embedding dimension in the cache key and/or return the cached dimension from `lookupEmbedding()` so the retry path can reject and evict stale entries before reuse.

## Summary
P0: 1, P1: 2, P2: 0
