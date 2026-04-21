# Iteration 004 - Testing

## Scope

Same three production/test files. This pass compared the delivery/progress implementation against regression coverage.

## Verification

- Git log checked for the scoped files.
- Scoped Vitest command: PASS, 30 tests.

## Findings

### F-004 - P1 Testing - The regression suite lacks negative progress cases for sequencing and verification words

The delivery/progress test added for the packet is positive-only: it proves an implementation sentence with explicit gate, verification checks, and final ship step routes to delivery at `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:76`.

The prototype rerun also asserts only intended prototype labels at `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:535`. It does not include a progress-like counterexample such as "updated X, then checked tests" that should stay in `narrative_progress`.

That gap matters because the implementation under test treats `then`, `after`, and `before` as delivery sequence cues at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:404` and treats test/check language as delivery verification cues at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:407`. F-001 reproduces a live misroute through exactly that missing negative case.

## Delta

New finding: F-004.
