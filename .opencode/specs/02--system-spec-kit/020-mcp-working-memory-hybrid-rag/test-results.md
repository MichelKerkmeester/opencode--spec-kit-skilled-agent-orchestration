# Test Results

<!-- ANCHOR: summary -->
## Summary

Latest all-flags verification passes for the full suite, rewritten embedding coverage, BM25-focused coverage, and the three suites that were previously deferred.
<!-- /ANCHOR: summary -->

<!-- ANCHOR: artifacts -->
## Check Results

| Check | Command | Result |
|---|---|---|
| Full test suite (all flags enabled) | `SPECKIT_ROLLOUT_PERCENT=100 SPECKIT_SESSION_BOOST=true SPECKIT_PRESSURE_POLICY=true SPECKIT_EXTRACTION=true SPECKIT_EVENT_DECAY=true SPECKIT_CAUSAL_BOOST=true SPECKIT_AUTO_RESUME=true SPECKIT_ADAPTIVE_FUSION=true SPECKIT_EXTENDED_TELEMETRY=true npm test` (run in `.opencode/skill/system-spec-kit`) | PASS: 142 passed test files (142 total). 4415 passed tests, 19 skipped (4434 total). |
| Previously deferred suites (now active) | `tests/api-key-validation.vitest.ts`, `tests/api-validation.vitest.ts`, `tests/lazy-loading.vitest.ts` (targeted run) | PASS: 3 passed files, 15 passed tests, 0 skipped. |
| Rewritten embeddings suite (architecture-aligned) | `npm run test --workspace=mcp_server -- tests/embeddings.vitest.ts` | PASS: 1 passed file, 13 passed tests, 0 skipped. |
| BM25-focused verification (all flags enabled) | `SPECKIT_ROLLOUT_PERCENT=100 SPECKIT_SESSION_BOOST=true SPECKIT_PRESSURE_POLICY=true SPECKIT_EXTRACTION=true SPECKIT_EVENT_DECAY=true SPECKIT_CAUSAL_BOOST=true SPECKIT_AUTO_RESUME=true SPECKIT_ADAPTIVE_FUSION=true SPECKIT_EXTENDED_TELEMETRY=true npm run test --workspace=mcp_server -- tests/bm25-index.vitest.ts tests/bm25-security.vitest.ts tests/hybrid-search.vitest.ts` | PASS: 3 passed files, 189 passed tests, 0 skipped. Duration 137ms. |

## Previously Deferred Suites (Closure)

| Suite | Current Status | Evidence |
|---|---|---|
| `tests/api-key-validation.vitest.ts` | Active | Included in targeted closure run: 3 files, 15 tests, 0 skipped |
| `tests/api-validation.vitest.ts` | Active | Included in targeted closure run: 3 files, 15 tests, 0 skipped |
| `tests/lazy-loading.vitest.ts` | Active | Included in targeted closure run: 3 files, 15 tests, 0 skipped |
<!-- /ANCHOR: artifacts -->

<!-- ANCHOR: blockers -->
## Open Blocker

- No runtime test or build blockers in this all-flags verification pass.
- No deferred API/startup fixture suites remain in skipped status.
<!-- /ANCHOR: blockers -->
