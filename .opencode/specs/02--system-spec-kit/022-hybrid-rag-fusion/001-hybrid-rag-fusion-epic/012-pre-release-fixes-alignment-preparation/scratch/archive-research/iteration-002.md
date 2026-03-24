# Deep Research Iteration 002

## Topic
Pre-release verification of 022-hybrid-rag-fusion P0/P1 fixes.

## Focus
Runtime Error Handling & Critical Code Paths (Q2)

## Research Question
What is the exact runtime code path for P0-1 (startup crash) from `factory.ts` validation through `context-server.ts` exit? Are there other handlers that call `process.exit()` on transient errors? Also verify P1-1 (`quality-loop` best-state tracking) and P1-16 (Stage 1 vector fallback).

## Findings

### 1. P0-1 exact startup-crash path is a resolved "invalid" result, not a thrown exception
- `validateApiKey()` is implemented in `shared/embeddings/factory.ts` and wraps its outbound validation request in a `try/catch`. On timeout (`isAbortError`) it returns `{ valid: false, errorCode: 'E053' }` with "Retry startup" guidance instead of throwing; the generic network-error path also returns `{ valid: false, errorCode: 'E053' }` rather than throwing. Citations: `shared/embeddings/factory.ts:307`, `shared/embeddings/factory.ts:428-459`.
- `main()` in `mcp_server/context-server.ts` awaits `embeddings.validateApiKey(...)` during startup. If `validation.valid` is false, it logs a fatal banner and calls `process.exit(1)` directly. That means timeout/network failures from `factory.ts` are treated as hard startup failures even though the catch-path messaging describes them as transient. Citations: `mcp_server/context-server.ts:738-775`.
- The `catch (validationError)` block in `main()` only runs for thrown exceptions and explicitly continues startup, but it is bypassed for the timeout/network paths above because `validateApiKey()` resolves `{ valid: false }` instead of rejecting. Citations: `mcp_server/context-server.ts:757-786`, `shared/embeddings/factory.ts:428-459`.
- This crash path does not go through `fatalShutdown()` and does not rely on the top-level `main().catch(...)`; the server exits synchronously from the validation branch first. Citations: `mcp_server/context-server.ts:616-663`, `mcp_server/context-server.ts:760-775`, `mcp_server/context-server.ts:1088`.

### 2. No other handler/lib/shared runtime code calls `process.exit()`; the only in-process server exits are all in `context-server.ts`
- A scoped scan across `mcp_server/context-server.ts`, `mcp_server/handlers`, `mcp_server/lib`, and `shared` found only three runtime exits, all in `context-server.ts`: `fatalShutdown(...)->process.exit(exitCode)`, the API-key validation failure branch, and the top-level `main().catch(...)`. Citations: `mcp_server/context-server.ts:663`, `mcp_server/context-server.ts:774`, `mcp_server/context-server.ts:1088`.
- `fatalShutdown()` is wired to `SIGTERM`, `SIGINT`, `uncaughtException`, and `unhandledRejection`; these are process-wide termination paths, not per-handler transient-error exits. Citations: `mcp_server/context-server.ts:716-731`.
- A broader repo scan did find additional `process.exit()` calls in CLI and maintenance scripts, but those are outside the long-running MCP server request path: `mcp_server/cli.ts:86,177,183,196,203,207,387,402,438,443,450,477,499,510`, `mcp_server/scripts/reindex-embeddings.ts:15,18`, `mcp_server/scripts/migrations/restore-checkpoint.ts:89,218`, `mcp_server/scripts/migrations/create-checkpoint.ts:93,240`.
- Conclusion: the only confirmed transient-error crash-on-start path in the runtime server is the API-key validation branch in `context-server.ts`, made fatal by `factory.ts` returning `valid: false` for timeout/network failures.

### 3. P1-1 is confirmed: `bestContent` / `bestAttempt` are tracked but never used in the return path
- `runQualityLoop()` initializes `bestScore`, `bestContent`, and `bestAttempt`, then updates them when a retry improves `score.total`. Citations: `mcp_server/handlers/quality-loop.ts:597-619`.
- On success, the function returns `currentContent` / `currentMetadata`, not `bestContent`; on rejection, it also returns `currentContent`, not the best-scoring state. Citations: `mcp_server/handlers/quality-loop.ts:621-660`.
- Symbol scan shows `bestContent` appears only at initialization and assignment, and `bestAttempt` appears only at initialization and assignment, with no read before return. Citations: `mcp_server/handlers/quality-loop.ts:599-600`, `mcp_server/handlers/quality-loop.ts:617-618`.
- Impact: if an early auto-fix improves quality and a later retry regresses it, the function rejects or returns the last mutated payload instead of the best observed payload.

### 4. P1-16 is confirmed: Stage 1 vector/raw-candidate fallback is bypassed when `skipFusion` enhanced search throws
- `hybridSearchEnhanced()` has a dedicated `skipFusion` branch that normally returns raw candidates collected from the channel lists before fusion. Citations: `mcp_server/lib/search/hybrid-search.ts:817-842`, `mcp_server/lib/search/hybrid-search.ts:931-942`.
- But the outer `catch` at the end of `hybridSearchEnhanced()` logs the failure and, when `options.skipFusion` is true, returns `[]` instead of delegating to the legacy `hybridSearch(...)` fallback. Only the non-`skipFusion` branch falls back to `hybridSearch(...)`. Citations: `mcp_server/lib/search/hybrid-search.ts:1344-1353`.
- `collectRawCandidates()` always invokes `hybridSearchEnhanced(..., { skipFusion: true })` for both the tiered fallback path and the two-pass primary/fallback path. If those calls hit the catch above, `results` becomes `[]`, so the code drops past Stage 1 and falls through to lexical-only `ftsSearch()` / `bm25Search()` fallbacks. There is no vector retry after the `skipFusion` failure. Citations: `mcp_server/lib/search/hybrid-search.ts:1361-1385`, `mcp_server/lib/search/hybrid-search.ts:1386-1415`, `mcp_server/lib/search/hybrid-search.ts:1418-1431`.
- That matches the reported regression: Stage 1 "raw candidates" loses vector recall when enhanced skip-fusion search fails, because the catch converts the failure into an empty candidate set rather than preserving or retrying vector/raw results.

### 5. Other notable non-fatal/silent runtime handlers
- `context-server.ts` intentionally swallows watcher-side history and post-mutation hook errors so file watching does not crash the server. Citations: `mcp_server/context-server.ts:700-712`.
- `quality-loop.ts` intentionally treats eval logging failures as non-fatal and only warns. Citations: `mcp_server/handlers/quality-loop.ts:667-702`.
- `hybridSearchEnhanced()` also swallows individual vector, graph, and degree channel failures as non-critical inside the pipeline, then continues with remaining channels. Citations: `mcp_server/lib/search/hybrid-search.ts:825-843`, `mcp_server/lib/search/hybrid-search.ts:866-885`, `mcp_server/lib/search/hybrid-search.ts:891-928`.

## Net-New Value
- The high-level defects were already known from Phase 1, but this iteration established the exact crash control flow, proved that runtime `process.exit()` is confined to `context-server.ts`, and mapped why `skipFusion` failures erase Stage 1 vector/raw candidates.
- `newInfoRatio`: `0.42`

## What Worked
- Direct line-range reads on the four target files were enough to reconstruct the control flow precisely.
- Exact-text `rg` searches for `process.exit(` and the affected symbols (`validateApiKey`, `bestContent`, `skipFusion`) quickly separated confirmed crash sites from non-fatal handlers.

## What Failed
- Initial path assumption was wrong for embeddings: the validation factory lives in `shared/embeddings/factory.ts`, not under `mcp_server/shared/...`.
- There was no existing `scratch/iteration-001.md` to mirror, so this iteration note uses an explicit findings-first structure.

## Next Focus
Iteration 3 should answer Q3: compare the script-side indexing path (`generate-context.js -> memory-indexer.ts -> workflow.ts`) against the MCP `memory_save` path and verify where governance, preflight, postflight, and audit hooks diverge.
