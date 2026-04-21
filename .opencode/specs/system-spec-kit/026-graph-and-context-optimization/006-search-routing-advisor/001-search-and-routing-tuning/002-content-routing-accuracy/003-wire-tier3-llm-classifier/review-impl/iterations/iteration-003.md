# Iteration 003 - Robustness

## Scope

Focused on lifecycle, resource bounds, timeout behavior, and fail-open handling in the audited implementation files.

## Verification

Scoped Vitest result: PASS. `2` files passed; `89` tests passed and `3` skipped.

## Findings

### IMPL-F004 - P2 Robustness - Shared session cache is unbounded and uses an infinite TTL

The save handler creates one module-level cache at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:171`. The cache implementation stores entries in a plain `Map` at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:310` through `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:328`, with no capacity bound.

`resolveTier3Decision()` writes session cache entries with `Number.POSITIVE_INFINITY` at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:806`, so long-lived MCP server processes can retain every distinct routed chunk hash for the process lifetime.

### IMPL-F005 - P1 Robustness - Tier 3 timeout does not cover response body parsing

The Tier 3 transport creates an abort timer at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1049` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1050`, but clears it immediately after `fetch()` resolves at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1073`. The response body is parsed later with `response.json()` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1079`.

That means a peer that returns headers promptly but stalls or streams a very large JSON body is no longer covered by the advertised Tier 3 timeout. The existing fail-open test at `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1790` through `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1823` only covers `fetch` throwing, not a delayed body parse after headers.

## Convergence

New weighted findings ratio: `0.28`. Continue.
