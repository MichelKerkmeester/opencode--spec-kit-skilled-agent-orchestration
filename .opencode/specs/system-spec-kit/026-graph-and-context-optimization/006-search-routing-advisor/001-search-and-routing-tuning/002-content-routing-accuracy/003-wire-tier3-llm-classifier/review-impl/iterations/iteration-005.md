# Iteration 005 - Correctness

## Scope

Returned to correctness after all dimensions had at least one pass. Re-read the cache and override paths to check whether IMPL-F001 was overstated.

## Verification

Scoped Vitest result: PASS. `2` files passed; `89` tests passed and `3` skipped.

## Findings

No new correctness findings.

IMPL-F001 remains active. The cache key still derives from normalized chunk text only at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:483` and `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:756`, while `buildTier3Prompt()` includes context fields at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1297` through `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1303`.

Adversarial check: `packet_level` is stored in the cache entry at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:796`, but `cacheEntryToOutcome()` does not compare it against the current context at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:813` through `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:829`. That reinforces the stale-context risk.

## Convergence

New weighted findings ratio: `0.05`; churn `0.04`. Do not stop because IMPL-F002 is active.
