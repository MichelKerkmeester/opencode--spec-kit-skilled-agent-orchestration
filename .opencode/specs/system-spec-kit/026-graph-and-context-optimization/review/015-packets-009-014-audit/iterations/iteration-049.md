# Iteration 49 - test-quality - tests

## Dispatcher
- iteration: 49 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:39:27.584Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-save.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/post-insert-deferred.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-cleanup-ordering.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
- .opencode/skill/system-spec-kit/mcp_server/package.json

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`memory-search-integration.vitest.ts` is mostly a source-text snapshot, not the integration suite its T621-T650 labels claim to be.**
   - Evidence: `mcp_server/tests/memory-search-integration.vitest.ts:35-43` preloads raw source files with `fs.readFileSync(...)`; `:161-180`, `:225-256`, `:261-300`, and `:304-337` then prove multi-concept, hybrid, and review/access-update behavior by checking `toContain(...)` against those source strings instead of executing the live code paths.
   - Cross-check: `mcp_server/handlers/memory-search.ts:904` contains the runtime `searchType` branch and `mcp_server/handlers/memory-search.ts:1175` attaches progressive disclosure to real responses, but the corresponding "integration" checks in this file never drive those branches for most of the T621-T650 cases.
   - Impact: substantial runtime regressions can ship green as long as the expected substrings remain in the source tree.

```json
{
  "claim": "memory-search-integration.vitest.ts is a false-positive integration suite for much of T621-T650 because it reads source files and asserts string presence instead of executing the live multi-concept, hybrid, and review-update paths.",
  "evidenceRefs": [
    "mcp_server/tests/memory-search-integration.vitest.ts:35-43",
    "mcp_server/tests/memory-search-integration.vitest.ts:161-180",
    "mcp_server/tests/memory-search-integration.vitest.ts:225-256",
    "mcp_server/tests/memory-search-integration.vitest.ts:261-300",
    "mcp_server/tests/memory-search-integration.vitest.ts:304-337",
    "mcp_server/handlers/memory-search.ts:904",
    "mcp_server/handlers/memory-search.ts:1175"
  ],
  "counterevidenceSought": "I looked for later assertions that actually invoked the multi-concept, hybrid fallback, or review/access update branches and only found a small number of invalid-input handler checks plus the static source-text assertions above.",
  "alternativeExplanation": "The file may have been intended as a temporary contract snapshot while real DB-backed fixtures were deferred.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade to P2 if another non-text integration suite already covers T621-T650 against the live handler and search pipeline."
}
```

2. **`modularization.vitest.ts` can greenlight stale build artifacts instead of the current TypeScript sources.**
   - Evidence: `mcp_server/tests/modularization.vitest.ts:128-163` reads `dist/**` outputs for the module-size and context-server import checks, so those assertions are bound to the last compiled JS, not to the `.ts` files under review.
   - Cross-check: `mcp_server/package.json:24-26` runs `vitest` directly for `npm run test` / `npm run test:core` and does not build first, so these checks can run against stale `dist/` contents.
   - Impact: a source-only modularization regression can remain invisible to this suite when the checked-in or locally cached build output still satisfies the expectations.

```json
{
  "claim": "modularization.vitest.ts is vulnerable to stale-artifact false positives because its structural guardrails inspect dist/** while the package's normal test entrypoints do not rebuild dist first.",
  "evidenceRefs": [
    "mcp_server/tests/modularization.vitest.ts:128-163",
    "mcp_server/package.json:24-26"
  ],
  "counterevidenceSought": "I checked the package scripts for a pretest/precore build hook or another mandatory compile step and found none.",
  "alternativeExplanation": "CI may still guarantee a build-before-test workflow externally, which would mitigate the problem outside local/test:core runs.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade to P2 if the required CI gate always runs a clean build immediately before vitest and never consumes stale dist artifacts."
}
```

### P2 Findings
- **`n3lite-consolidation.vitest.ts` leaves the positive heuristic contradiction path unpinned.** `mcp_server/tests/n3lite-consolidation.vitest.ts:143-153` seeds an explicit "Always use JWT" vs "Never use JWT" contradiction but only asserts `Array.isArray(pairs)`. Since `mcp_server/lib/storage/consolidation.ts:88-108` returns structured contradiction pairs from the vector-or-heuristic scan, a regression that makes the heuristic fallback always return `[]` would still keep this test green.

## Traceability Checks
- The `memory-search-integration.vitest.ts` file does not match its own "integration" label for most of T621-T650: the suite snapshots source text instead of exercising the live handler/search behavior it names.
- The modularization suite's stated purpose is to guard current structural decomposition, but its `dist/**` dependency means it actually tracks last-built artifacts unless the caller separately guarantees a fresh compile.

## Confirmed-Clean Surfaces
- **`memory-search-ux-hooks.vitest.ts`**: good handler-level coverage for cursor continuation, scope mismatch rejection, and progressive-disclosure envelope shaping; it drives `handleMemorySearch` directly instead of asserting canned source text.
- **`post-insert-deferred.vitest.ts`**: good focused coverage of both the deferred enrichment execution status and the save-response payload/hints that surface it.
- **`pe-gating.vitest.ts`**: good deterministic coverage of the vector-window expansion loop and scope filtering, including exact `limit` growth assertions across retries.
- **`reconsolidation-cleanup-ordering.vitest.ts`**: good failure-path assertion that history is not recorded when orphan cleanup does not actually delete a row.

## Next Focus
- Iteration 50 should finish the test-quality sweep on the remaining large suites in this packet, especially `preflight.vitest.ts`, `progressive-validation.vitest.ts`, `quality-loop.vitest.ts`, and `memory-save-ux-regressions.vitest.ts`, looking for more permissive assertions or source-text surrogates.
