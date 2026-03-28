# Iteration 026 -- Wave 1 Provider, Retry, Cache, And Lifecycle

**Agent:** GPT-5.4 (Codex main run)
**Dimension:** correctness, security, maintainability
**Status:** complete
**Timestamp:** 2026-03-27T16:07:00+01:00

## Findings

- `HRF-DR-024 [P1]` `tool-cache` leaves `inFlight` promises alive across write invalidation and shutdown, so later callers can still receive stale pre-write or pre-shutdown results.
- `HRF-DR-025 [P2]` `context-server` startup, readiness, and shutdown failure branches remain under-tested in executable form.
- `HRF-DR-026 [P2]` `sanitizeAndLogEmbeddingFailure()` still logs raw provider stack or message data to stderr under `rawError`.

## Evidence
- `lib/cache/tool-cache.ts:237-257,335-351,398-402`
- `context-server.ts:648-697,794-841,851-875`
- `lib/providers/retry-manager.ts:267-285,604-675`
- `tests/tool-cache.vitest.ts:393,542`
- `tests/context-server.vitest.ts:65,559,590,1593,1843`
- `tests/retry-manager.vitest.ts:119`

## Next Adjustment
- Use the second wave for counterevidence: replay focused test subsets and check whether any of the new runtime findings collapse under targeted execution.
