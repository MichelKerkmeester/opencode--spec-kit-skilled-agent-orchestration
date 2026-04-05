# C136-08 Evidence: Typed ContextEnvelope + RetrievalTrace Contracts

## Files Created
- `mcp_server/lib/contracts/retrieval-trace.ts` — Types: `RetrievalStage`, `TraceEntry`, `RetrievalTrace`, `ContextEnvelope<T>`, `DegradedModeContract`, `EnvelopeMetadata`. Factory functions: `createTrace()`, `addTraceEntry()`, `createEnvelope()`, `createDegradedContract()`.
- `mcp_server/tests/retrieval-trace.vitest.ts` — 17 tests covering trace creation, unique IDs, stage addition, duration accumulation, all 6 stages, envelope wrapping, degraded contract creation, confidence clamping, metadata validation, timestamp monotonicity.

## Files Modified
- `mcp_server/handlers/memory-search.ts` — Integrated trace into search pipeline:
  - Import `createTrace`, `addTraceEntry`, `RetrievalTrace` from contracts
  - Trace created at `handleMemorySearch` entry with query, sessionId, intent
  - `candidate` trace entries at each search path (multi-concept, hybrid, vector)
  - `filter` trace entry at state filtering stage
  - `fusion` trace entry at session+causal boost stage
  - `rerank` trace entry at cross-encoder reranking stage
  - `final-rank` trace entry after final ranking
  - `fallback` trace entry when hybrid search fails
  - Trace included in response `extraData.retrievalTrace`
  - Fixed pre-existing `trace.entries` references to `trace.stages` (C136-12 telemetry code)

## Test Results
- `tests/retrieval-trace.vitest.ts`: **17/17 passed** (4ms)
- Full test suite: **138 files passed, 4377 tests passed, 72 skipped, 0 failures** (4.44s)
- TypeScript: compiles cleanly (only pre-existing TS6307 in adaptive-fusion.ts unrelated to this change)

## Issues
- Pre-existing TS6307 error in `adaptive-fusion.ts` importing `rollout-policy.ts` outside tsconfig scope — not introduced by this change.
- Pre-existing C136-12 telemetry code referenced `trace.entries` instead of `trace.stages` — fixed as part of this integration.
