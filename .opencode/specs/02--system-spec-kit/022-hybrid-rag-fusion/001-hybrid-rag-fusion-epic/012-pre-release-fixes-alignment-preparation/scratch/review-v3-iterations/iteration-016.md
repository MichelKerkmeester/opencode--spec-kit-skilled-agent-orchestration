## Iteration 016 - Code Review Findings

**Scope reviewed:** `mcp_server/lib/{storage,eval,extraction,providers,validation,config,errors,collab,telemetry,ops,manage,interfaces,contracts,parsing,utils,cache,chunking,response,architecture,spec}`

**Focus:** D1 Correctness + D2 Security

**Assessment:** `REQUEST_CHANGES`

**Baseline used:** `sk-code--review`

**Overlay used:** `sk-code--opencode`

**High-level note:** I did not find a new concrete raw-SQL injection issue in the inspected storage/eval paths; the dynamic SQL I spot-checked is generally constrained by placeholders or allowlists. The release-readiness blockers in this slice are concentrated in the embedding retry/provider flow and the auto-entity update pipeline.

### P1-001 [P1] Raw embedding-provider failures are persisted and surfaced back to callers
- **Files:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:172-175`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:135-148`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:144-146`, `.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:407-415`
- **Evidence:** The save path catches provider exceptions, converts them to a plain string via `toErrorMessage()`, stores that string in `embeddingFailureReason`, persists it as `failureReason`, and then includes it in the success response as `embeddingFailureReason`. The retry path does the same again when a retry transaction/provider call fails, returning `error: message` and writing `failure_reason = ?` with the unsanitized message.
- **Risk:** Provider/library failures can leak internal implementation details back through the MCP response and into persisted rows/checkpoints. In practice that can expose model/provider internals, filesystem/model-path details, or other sensitive operational context that should stay server-side.
- **Recommendation:** Map provider failures to stable, sanitized error codes/messages before persisting or returning them. Keep the raw diagnostic detail in server logs only.

### P1-002 [P1] Retry work is selected without an atomic claim, so the same memory can be embedded concurrently
- **Files:** `.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:205-233`, `.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:320-415`, `.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:510-555`, `.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:673-685`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:149-157`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:357-361`
- **Evidence:** `getRetryQueue()` only `SELECT`s eligible `pending`/`retry` rows and returns them; it never marks them as claimed or in-progress. `processRetryQueue()` then iterates those rows and calls `retryEmbedding()` later, after the provider call has already begun. The module also exports `retryEmbedding()`, `processRetryQueue()`, and `runBackgroundJob()`, while the save response path schedules both an immediate async retry and an opportunistic `processRetryQueue(2)` call.
- **Risk:** Two asynchronous entry points can pick the same row and issue duplicate provider requests before either one flips the row to `success`/`retry`/`failed`. That creates unnecessary external calls/cost, races on `retry_count`/`failure_reason`, and non-deterministic writes into `vec_memories`.
- **Recommendation:** Add an atomic claim step before work begins (for example, `UPDATE ... SET embedding_status='in_progress' ... WHERE id=? AND embedding_status IN (...)` inside a transaction, or an equivalent compare-and-swap marker) so each row can only be processed by one worker at a time.

### P1-003 [P1] In-place memory updates leave stale auto-entity rows behind, corrupting entity-driven graph signals
- **Files:** `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:276-303`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:486`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:97-102`, `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:169-182`, `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:399-422`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:400-455`
- **Evidence:** The deferred save/update path updates an existing `memory_index` row in place and returns the same memory ID. Post-insert enrichment then extracts the *current* entities and calls `storeEntities()` plus `updateEntityCatalog()`, but it never deletes old `created_by='auto'` entity rows for that memory first. `storeEntities()` is only an `INSERT OR REPLACE` on the entities that still exist, while the dedicated `rebuildAutoEntities()` repair path explicitly has to `DELETE FROM memory_entities WHERE created_by = 'auto'` before re-inserting. Downstream graph linking builds its catalog directly from `memory_entities`.
- **Risk:** If an edited memory removes or renames an entity, the old auto-generated rows stay attached to that memory, so cross-document entity matching and graph-link creation operate on stale facts. That silently biases entity coverage and can create false positive cross-spec links until a manual rebuild is run.
- **Recommendation:** On save/update, delete existing `created_by='auto'` rows for the target memory before storing the freshly extracted set, and update the catalog in the same transaction.

### P2-001 [P2] Retry fallback re-reads raw `file_path` values from SQLite without reapplying path validation
- **Files:** `.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:205-223`, `.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:530-535`, `.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:661-665`
- **Evidence:** The retry queue reads `SELECT * FROM memory_index`, carries `file_path` forward from SQLite, and when `content_text` is absent it falls back to `fsPromises.readFile(filePath, 'utf-8')`. Unlike the save path, this retry path does not re-run any allowed-base/path-security validation before opening the file.
- **Risk:** Under the assumption that a malformed row can enter `memory_index` (for example via a bad restore/import/manual DB edit or legacy data), the retry worker will read arbitrary local files and pass their content into the embedding pipeline. Even if that assumption is low-frequency, this is the wrong trust boundary for a background process.
- **Recommendation:** Revalidate `file_path` with the existing path-security helper before reading from disk, and fail the row closed if the path is outside the allowed workspace roots.

## Summary

- **P0:** 0
- **P1:** 3
- **P2:** 1

## Notes

- The storage/checkpoint SQL I spot-checked is generally parameterized or table-allowlisted; I did **not** find a fresh injection bug in this pass.
- I also did not find a new release-blocking correctness issue in the eval metric formulas I reviewed; the highest-confidence blockers in this iteration are the retry/provider race, raw error exposure, and stale entity state on update.
