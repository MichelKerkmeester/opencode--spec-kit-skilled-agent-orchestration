# Iteration 9: Correctness stabilization after full coverage

## Focus
Correctness stabilization pass after full-dimension coverage.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts`

## Findings
### P1 - Required
- **F002**: Built-in Tier 3 cache keys ignore routing context and can replay stale destinations - `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334` - The stabilization pass found no countervailing logic that adds the missing prompt context back into the built-in cache key. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:26`]

## Ruled Out
- Freezing `promptVersion` inside the stored cache entry does not protect correctness because `promptVersion` is not part of the lookup key.

## Dead Ends
- Re-reading the Tier 3 prompt contract did not uncover a hidden safeguard; the prompt still consumes more context than the cache key preserves.

## Recommended Next Focus
Spend the final pass confirming the blocker and final registry state rather than attempting a third blocked-stop synthesis.

## Assessment
- Dimensions addressed: correctness
- newFindingsRatio: 0.04
- Cumulative findings: P0=1, P1=3, P2=2
