## Code Review Summary

**Files reviewed**: `shared/embeddings.ts`, `shared/embeddings/factory.ts`, `shared/embeddings/providers/{openai,voyage,hf-local}.ts`, `mcp_server/handlers/{memory-save,memory-search,memory-context,quality-loop}.ts`, `mcp_server/context-server.ts`, plus tool routing/schema entry points for validation evidence.

**Overall assessment**: `REQUEST_CHANGES`

**Baseline used**: `sk-code` (`sk-code--review`)

**Overlay skill used**: `sk-code--opencode`

## Findings

### P1 - High

1. [`shared/embeddings.ts:627-639`, `mcp_server/context-server.ts:861-869`, `shared/embeddings/factory.ts:197-209`, `shared/embeddings/factory.ts:233-245`] Startup dimension validation is checking an environment guess, but the runtime provider can later fall back to a different dimension.
   - `context-server.ts` blocks startup on `validateEmbeddingDimension()`, but `validate_embedding_dimension()` ultimately calls `getEmbeddingDimension()`, which returns a sync env-based guess when the provider has not been initialized yet.
   - Later, `createEmbeddingsProvider()` can silently replace an auto-detected cloud provider with `hf-local` after warmup/create failure, which changes the live embedding dimension (for example, OpenAI/Voyage -> HF local 768-dim).
   - User impact: the server can pass startup checks and only fail once indexing/search begins, or start writing/querying with a different provider profile than the one used to select/validate the database.
   - Recommended fix: bind startup validation to the actual resolved provider/profile instance, and do not allow silent fallback when it changes the effective embedding dimension unless the DB/profile path is recomputed and revalidated.

2. [`shared/embeddings/factory.ts:75-81`, `shared/embeddings/factory.ts:184-188`, `shared/embeddings/factory.ts:307-351`, `shared/embeddings.ts:327-343`, `mcp_server/context-server.ts:756-799`] Invalid `EMBEDDINGS_PROVIDER` values are not rejected during startup.
   - `resolveProvider()` accepts any explicit `EMBEDDINGS_PROVIDER` string, but `createEmbeddingsProvider()` only supports `voyage`, `openai`, `hf-local`, and `ollama` (not implemented).
   - `validateApiKey()` does not validate that explicit provider name first; anything except `voyage` falls through the OpenAI validation path. In lazy mode, startup can therefore succeed and the first real embedding call fails later with `Unknown provider`.
   - User impact: operators get a misleading "startup succeeded" signal and only discover the bad config when a real request triggers provider initialization.
   - Recommended fix: validate `EMBEDDINGS_PROVIDER` against an allowlist inside `resolveProvider()` / `validateApiKey()` and make unknown values a fatal startup error.

3. [`shared/embeddings/providers/voyage.ts:107-109`, `shared/embeddings/providers/voyage.ts:125-149`, `shared/embeddings/factory.ts:345-347`, `shared/embeddings/factory.ts:365-373`, `mcp_server/context-server.ts:756-799`] Voyage startup validation ignores the configured runtime base URL.
   - The runtime Voyage provider honors `VOYAGE_BASE_URL`, but `validateApiKey()` hardcodes `https://api.voyageai.com/v1`.
   - That means startup validation and live runtime can be talking to different endpoints. In proxy/private-gateway deployments, startup may fail even though the runtime endpoint is healthy, or validate the wrong service entirely.
   - Security impact: the validation request attaches the bearer token to an endpoint chosen by code rather than to the same validated runtime destination.
   - Recommended fix: use the same configured base URL in validation that the runtime provider uses, and validate the URL/scheme before attaching `Authorization`.

### P2 - Medium

4. [`mcp_server/handlers/quality-loop.ts:597-620`, `mcp_server/handlers/quality-loop.ts:646-662`] `runQualityLoop()` returns the best mutated content but the last-attempt score/rejection reason.
   - The loop correctly tracks `bestScore`, `bestContent`, and `bestMetadata`, but the rejection path still returns `score` and constructs `rejectionReason` from the final iteration instead of the best snapshot.
   - User impact: rejection telemetry, operator debugging, and any caller that inspects the returned score can be out of sync with the `fixedContent` actually returned.
   - Recommended fix: return `bestScore` and build the rejection reason from the same best-state snapshot that is returned in `fixedContent` / `fixedTriggerPhrases`.

## Validation / Security Notes

- Input validation is generally present before handler logic runs. Strict Zod schemas are enforced in `mcp_server/schemas/tool-input-schemas.ts:99-200`, and tool routing calls `validateToolArgs(...)` before invoking handlers (`mcp_server/tools/context-tools.ts:13-16`, `mcp_server/tools/memory-tools.ts:44-67`).
- The handlers also perform local guards where it matters most: `memory-save.ts:564-685` validates `filePath`, canonicalizes it, and enforces governance/shared-space checks; `memory-search.ts:441-525` validates cursor/query/specFolder/limit flow; `memory-context.ts:887-925` rejects empty input early.
- Error handling is mostly consistent and recovery-oriented, but `context-server.ts` still has several "warn and continue" startup paths. The three P1 findings above are the release-relevant cases where that posture can leave the server in a misleadingly healthy state.
- I did **not** see direct API key logging in the reviewed providers/handlers, and `getProviderInfo()` masks key presence correctly (`shared/embeddings/factory.ts:273-286`). The remaining D2 concern is destination validation for bearer-token requests.

## Next Steps

1. Fail fast on unknown embedding providers and on any auto-fallback that changes the effective embedding dimension/profile.
2. Make Voyage API validation use the same configured base URL as runtime, with explicit URL/scheme validation before sending credentials.
3. Fix `runQualityLoop()` to return a self-consistent best-state score/content pair.
