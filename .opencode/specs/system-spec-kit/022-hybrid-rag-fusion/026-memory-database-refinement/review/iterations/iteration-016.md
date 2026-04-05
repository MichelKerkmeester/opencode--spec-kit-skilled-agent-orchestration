# Iteration 016: Error handling and recovery

## Findings

### [P1] Plain handler exceptions are misreported to MCP clients as `SEARCH_FAILED`
**File**
`.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts`

**Issue**
The top-level MCP wrapper treats any thrown non-`MemoryError` as a generic `SEARCH_FAILED` error. Several handlers still throw plain `Error` objects for parameter validation and request-shape failures, so clients receive the wrong error code and the wrong recovery hint family.

**Evidence**
`context-server.ts:411-418` catches every handler exception and forwards it to `buildErrorResponse()`. In `lib/errors/core.ts:283-301`, `buildErrorResponse()` derives the code via `(error as MemoryError).code || ErrorCodes.SEARCH_FAILED`, so any plain `Error` falls back to `E040`. `memory-ingest.ts` still throws raw `Error` for input validation at `139-145`, `265-266`, and `294-295` (for example, missing or invalid `paths` / `jobId`). That means invalid-parameter failures are surfaced as search failures instead of `INVALID_PARAMETER` / `MISSING_REQUIRED_PARAM`.

**Fix**
Convert handler-thrown validation errors to `MemoryError` with explicit codes, or add a server-boundary mapper that translates common plain exceptions into the correct MCP error family before calling `buildErrorResponse()`. The current `SEARCH_FAILED` fallback is too broad for handler-originated validation failures.

### [P1] Internal exception text is returned directly to MCP clients
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts`

**Issue**
Multiple handlers serialize raw exception messages into client-facing MCP error payloads. The shared sanitizer only redacts credential-like tokens, so filesystem paths, SQL fragments, schema details, and other internal diagnostics can still leak to callers.

**Evidence**
`lib/errors/core.ts:252-257` only redacts key-shaped secrets and bearer tokens. `shared-memory.ts:243-253` builds `error: \`${prefix}: ${message}\`` directly from `error.message`, and that helper is used by the catch paths at `410-416`, `517-523`, `551-557`, and `608-614`. `memory-context.ts:1098-1113` logs the strategy failure, then returns `error: toErrorMessage(error)` to the client. `memory-crud-stats.ts:155-164` and `279-288` do the same for database errors (`Database query failed: ${message}` / `Folder ranking query failed: ${message}`), which is enough to expose backend internals when low-level drivers return detailed text.

**Fix**
Stop returning raw exception strings to clients for internal failures. Use coarse, client-safe summaries in MCP responses and keep raw exception text in server logs only. If troubleshooting context is needed, attach a request ID or sanitized diagnostic token instead of the original exception message.

### [P1] Causal-graph handlers use unrelated canonical error codes for generic failures
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts`

**Issue**
The causal-graph catch paths hardcode canonical codes that do not match the failure class being reported. That misleads MCP clients and couples recovery hints to the wrong operational advice.

**Evidence**
`lib/errors/core.ts:65-74` defines `E022` as `DB_TRANSACTION_FAILED` and `E042` as `QUERY_TOO_LONG`. In `causal-graph.ts`, the generic catch for `memory_drift_why` returns `E042` at `416-423`, and `memory_causal_stats` also returns `E042` at `636-643`, even though those blocks catch any unexpected exception, not just overlong-query conditions. Likewise, `memory_causal_link` returns `E022` at `534-541` and `memory_causal_unlink` returns `E022` at `710-717` for all exceptions, even when the failure is validation, lookup, or logic-related rather than a transaction failure.

**Fix**
Replace these hardcoded catch-all codes with domain-appropriate canonical values such as `DATABASE_ERROR`, `DB_QUERY_FAILED`, or dedicated causal-graph error codes. Recovery hints should be selected from the actual failure class, not whichever code happens to exist nearby.

### [P2] Reconsolidation save path swallows BM25 indexing failure and commits a partially updated search state
**File**
`.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`

**Issue**
The reconsolidation callback commits the memory row and metadata even when the BM25 lexical index update fails. Because the BM25 error is only logged and not propagated, recovery leaves the database and lexical search index out of sync.

**Evidence**
Inside the transaction in `reconsolidation-bridge.ts:216-261`, the handler indexes the vector row and metadata first, then attempts BM25 insertion at `248-255`. If `bm25.addDocument()` throws, the catch only logs `BM25 indexing failed (recon conflict store)` and continues to `recordHistory()` before returning the new `memoryId`. There is no rollback, no failed-state marker, and no immediate repair scheduling in that path, so the save can succeed while one retrieval channel is silently stale.

**Fix**
Treat BM25 write failure as part of the atomic save contract and abort the transaction when it fails, or explicitly persist a degraded/index-pending state and trigger guaranteed follow-up repair. Logging alone is not sufficient recovery for a multi-index storage path.

## Summary
I found four meaningful issues in the error-handling and recovery surfaces. The highest-risk problems are incorrect error classification at the MCP boundary, direct leakage of internal exception text, and causal handlers returning unrelated canonical codes. I also found one state-recovery gap where reconsolidation can commit a memory while leaving BM25 indexing incomplete with only a warning log.
