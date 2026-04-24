# Iteration 001 - Correctness

## Scope

Audited production router correctness in:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`

Git history checked: `29624f3a71 feat(026): implement all 5 remaining gap phases`, which added the continuity prompt paragraph and prompt-contract assertions.

Verification: `../scripts/node_modules/.bin/vitest run tests/k-value-optimization.vitest.ts tests/content-router.vitest.ts --reporter=default` passed with 2 files and 40 tests.

## Findings

### IMPL-P1-001 - metadata_only target contract diverges between prompt and router

Severity: P1  
Dimension: correctness  
Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1074`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1075`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1282`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:663`

`buildTarget('metadata_only')` returns `docPath: 'spec-frontmatter'` with `_memory.continuity`, and the metadata route test asserts that pseudo-target. The new Tier 3 prompt tells the model that `metadata_only` saves target `implementation-summary.md` / `implementation-summary.md::_memory.continuity`. Since `makeDecisionFromTier3()` later accepts model `target_doc` directly, Tier 3 metadata decisions can disagree with Tier 1/Tier 2 metadata decisions.

Expected: all router tiers should normalize `metadata_only` to one canonical write target.  
Actual: Tier 1/Tier 2 code and tests use `spec-frontmatter`, while Tier 3 prompt wording instructs `implementation-summary.md`.

## Convergence

New finding ratio: 1.00. Continue.
