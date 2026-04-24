# Iteration 4: Maintainability review of cache lifecycle

## Focus
Maintainability review of cache lifecycle and operator hygiene.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`

## Findings
### P2 - Suggestion
- **F005**: Shared Tier 3 cache keeps session entries forever with no bound or eviction - `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:326` - `memory-save.ts` keeps a module-scope cache instance, and the router writes session entries with infinite TTL into a plain `Map`, so long-lived processes accumulate routing history without an eviction policy. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:171`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:310`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:806`]

### P1 - Required
- **F003**: The phase packet documents the wrong Tier 3 enable flag and rollout model - `implementation-summary.md:53` - The maintenance burden is already visible in the operator-facing docs, which disagree about how the live path is meant to be enabled. [SOURCE: `implementation-summary.md:53`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1366`]

## Ruled Out
- The shared cache is not recreated per save. The module-level singleton in `memory-save.ts` removes that potential mitigation.

## Dead Ends
- No capacity cap, reset hook, or TTL override was found around the in-memory cache path.

## Recommended Next Focus
Revisit correctness and compare the built-in cache key with the dedicated cache-context regression to decide whether F002 should be promoted.

## Assessment
- Dimensions addressed: maintainability
- newFindingsRatio: 0.07
- Cumulative findings: P0=1, P1=1, P2=2
