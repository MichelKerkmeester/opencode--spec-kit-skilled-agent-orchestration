# Iteration 007 - Robustness

## Scope

Second robustness pass across the same scoped code files.

## Verification

- Git log checked for the scoped files.
- Scoped Vitest command: PASS, 30 tests.

## Findings

No new robustness finding.

## Refinements

F-003 remains P1 because the rejected-promise cache is instance-wide for the router returned by `createContentRouter`. The cache is private and never evicted on failure; the decisive lines remain `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:914`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:921`, and `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:928`.

## Delta

No new finding. Refined F-003.
