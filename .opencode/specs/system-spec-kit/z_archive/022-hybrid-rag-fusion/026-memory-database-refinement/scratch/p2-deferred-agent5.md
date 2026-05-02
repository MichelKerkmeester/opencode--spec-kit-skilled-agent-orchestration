# Agent 5 P2 Deferred Fix Summary

## Scope

- Fixed P2-038 in shared embedding providers and verified timeout-related behavior with regression coverage.
- Fixed P2-040 in `context-server.ts` so `autoSurfacedContext` now stays inside the MCP envelope metadata.
- Fixed P2-041 in `handlers/index.ts` by replacing eager handler imports with lazy module loaders and lazy export wrappers.

## Changes

### P2-038: Provider timeout handling

- `shared/embeddings/providers/hf-local.ts`
  - Added a reusable `withTimeout()` helper.
  - Wired the existing provider timeout into the actual inference call so slow local inference now fails with `ETIMEDOUT` instead of waiting indefinitely.
- `shared/embeddings/providers/openai.ts`
  - Added a warmup-level `Promise.race()` deadline using the provider timeout.
  - Warmup timeouts now log a warning and return success in a cold state instead of blocking startup or forcing fallback.
- `shared/embeddings/providers/voyage.ts`
  - Added the same bounded warmup behavior as OpenAI.

### P2-040: Envelope contract cleanup

- `context-server.ts`
  - Removed the sibling/top-level `autoSurfacedContext` response mutation.
  - Auto-surfaced context is now written to `meta.autoSurfacedContext` inside the JSON envelope after hint injection and before token-budget serialization.

### P2-041: Lazy handler barrel

- `handlers/index.ts`
  - Replaced eager `import * as ...` handler imports with cached lazy loaders.
  - Added lazy function wrappers for named exports and lazy proxies for module namespace exports.
  - Loader resolves both source (`.ts`) and built (`.js`) handler modules so the same barrel works in Vitest and built runtime contexts.

## Tests

- `tests/embeddings.vitest.ts`
  - Added regression assertions for HF-local timeout wiring and cloud warmup deadline coverage.
- `tests/context-server.vitest.ts`
  - Updated expectations so auto-surfaced context is asserted under `meta.autoSurfacedContext`, not at the top level.
- `tests/lazy-loading.vitest.ts`
  - Added regression coverage for the lazy handler barrel contract.

## Verification

- `npx tsc --noEmit 2>&1 | tail -5`
  - No tail output.
- `npx vitest run 2>&1 | tail -15`
  - Passed: `328` test files, `8790` tests passed, `74` skipped, `26` todo.
