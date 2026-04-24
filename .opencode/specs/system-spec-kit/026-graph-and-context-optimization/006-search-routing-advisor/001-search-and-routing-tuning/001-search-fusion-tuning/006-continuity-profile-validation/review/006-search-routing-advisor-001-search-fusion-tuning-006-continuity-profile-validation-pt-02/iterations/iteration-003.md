# Iteration 003 - Robustness

## Scope

Audited cache and lifecycle robustness in:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`

Verification: scoped Vitest passed with 2 files and 40 tests.

## Findings

### IMPL-P1-003 - Tier 3 cache key can collide for distinct long chunks

Severity: P1  
Dimension: robustness  
Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:482`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:483`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:756`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:758`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1125`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1130`

The router normalizes chunk text, truncates it to 2048 characters, and hashes that truncated value for `chunkHash`. The same hash is used as the Tier 3 session/spec-folder cache key. Two chunks with identical first 2048 normalized characters but different trailing semantics can therefore reuse the same Tier 3 decision.

Expected: cache identity should include the full canonical chunk text, or a separate full-content hash should be used for cache keys while the truncated normalized body remains an embedding/prompt budget control.  
Actual: truncation is part of the cache key input.

### IMPL-P2-001 - cache expiry ignores the injected clock

Severity: P2  
Dimension: robustness  
Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:319`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:327`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:470`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:504`

The router accepts a `now` dependency and passes it through Tier 3 decision code, but `InMemoryRouterCache` computes and checks expiry with `Date.now()`. Tests that inject a deterministic clock do not control cache expiry, and production callers cannot keep routing timestamps and cache lifetimes on the same clock source.

## Convergence

New finding ratio: 0.50. Continue.
