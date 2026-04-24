# Iteration 004 - Testing

## Scope

Reviewed whether the test file would catch the production issues found in iterations 001-003.

## Verification

- Vitest: PASS, `tests/content-router.vitest.ts` 30/30.
- Git log checked.
- Grep checked focused regression assertions around `soft operational commands`, `refusal`, refreshed prototypes, and overrides.

## Findings

### IMPL-P1-002 - Regression tests miss the hard-wrapper-plus-handover case and only assert category for refreshed prototypes

Severity: P1

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:133` starts the focused soft-operation regression.
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:140` asserts the category.
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:142` asserts `refusal=false` only for the exact soft-operation string.
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:535` starts the refreshed prototype boundary test.
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:556` asserts category only for each refreshed prototype.
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409` still contains hard-ish repository-state routing language.

Impact:

The suite would pass if a handover prototype or realistic handover chunk produced category `handover_state` while still refusing to route to manual review.

## Churn

New findings: 1. Severity-weighted new finding ratio: 0.2308.
