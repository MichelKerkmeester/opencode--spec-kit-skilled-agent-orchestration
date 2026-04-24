# Iteration 004 - Testing

## Scope

Audited implementation test strength in:

- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`

Verification: scoped Vitest passed with 2 files and 40 tests.

## Findings

### IMPL-P1-004 - continuity K=60 validation is self-fulfilling

Severity: P1  
Dimension: testing  
Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:43`
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:53`
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:417`
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:421`
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:428`

The continuity fixture hardcodes the ranked result list for every K value, including the K=60 winner. The test then asserts that the hardcoded K=60 primary result is first and that `optimizeKValuesByIntent()` chooses K=60. This validates arithmetic over preselected rankings, not whether the search/fusion implementation actually produces those rankings for continuity queries.

Expected: fixture queries should run through the real retrieval/fusion pipeline or a faithful scorer fixture before K optimization.  
Actual: all rankings are static test data selected by the test itself.

### IMPL-P2-002 - prompt-contract tests do not exercise Tier 3 metadata normalization

Severity: P2  
Dimension: testing  
Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:560`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:584`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:655`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:663`

The prompt-contract test only checks string containment. The existing metadata routing test exercises Tier 1/Tier 2 behavior and expects `spec-frontmatter`, but no test injects a Tier 3 `metadata_only` response and asserts the router normalizes the target. That gap lets IMPL-P1-001 survive while all tests pass.

## Convergence

New finding ratio: 0.40. Continue.
