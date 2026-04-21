# Iteration 004 - Testing

## Scope

Focused on whether scoped tests catch the implementation issues found in iterations 001-003.

Code reviewed:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/python-compat.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`

Verification:
- Vitest run 004 passed: 8 files, 54 tests.

## Findings

### IMPL-F006 - P1 Testing - Tests do not pin local fallback semantic attribution for nested package paths

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1967` contains the semantic path resolver under review.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2084` applies the semantic boosts.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:89` covers `--force-native --semantic`, not local fallback `--semantic-hits`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:56` shells into Python scorer.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:74` disables built-in semantic search for parity.

Why this matters:
The current scoped tests pass while the local semantic path regression reproduces. Add a local fallback test that feeds a hit under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/...` and expects `skill-advisor`, not `system-spec-kit`.

## Delta

New findings: 1 P1.
No P0 findings.
