# Iteration 004 - Testing

## Scope

Reviewed the two packet test files against the production risks identified so far.

## Verification

Scoped Vitest result: PASS. `2` files passed; `89` tests passed and `3` skipped.

## Findings

### IMPL-F006 - P1 Testing - No regression test rejects unsafe Tier 3 target_doc values

The content-router tests cover successful Tier 3 classification and cache reuse at `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:261` through `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:334`. The handler tests cover live natural routing and explicit `routeAs` prompt fields at `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1625` through `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1788`.

Those tests only use safe targets such as `implementation-summary.md`. There is no regression that feeds Tier 3 a `target_doc` containing `..`, an absolute-looking path, or any document outside the canonical target allowlist and then asserts rejection/fail-open. That leaves the P0 path in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1160` unguarded.

## Convergence

New weighted findings ratio: `0.14`. Continue because all dimensions are now covered but the active P0 blocks early stop.
