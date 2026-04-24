# Iteration 002 - Security

## Scope

Audited Tier 3 input/output trust boundaries in:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`

Git history checked: `29624f3a71` and prior router introduction commit `2270dfb71f`.

Verification: scoped Vitest passed with 2 files and 40 tests.

## Findings

### IMPL-P1-002 - Tier 3 target_doc and target_anchor are trusted without allowlist validation

Severity: P1  
Dimension: security  
Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:683`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:688`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:837`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859`

`validateTier3Response()` checks category and merge mode, then copies any string `target_doc` and `target_anchor`. `makeDecisionFromTier3()` places those raw strings into the final routing target for non-refusal decisions. The prompt says not to invent docs, but a model output is still untrusted data. A malformed or adversarial classifier response could route to an unexpected relative path or arbitrary anchor.

Expected: Tier 3 should select a category, and production code should derive the target from `buildTarget()` or validate against an explicit target allowlist.  
Actual: target path and anchor strings from Tier 3 can override the router's known category-to-target mapping.

## Convergence

New finding ratio: 0.50. Continue.
