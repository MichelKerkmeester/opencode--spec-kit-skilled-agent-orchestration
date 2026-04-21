# Iteration 004 - Testing

Dimension: testing

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`

Verification:
- Vitest scoped command: pass, 7 files and 47 tests.
- Grep checked health assertions and parity coverage.

Findings:

| ID | Severity | Finding | Code evidence |
| --- | --- | --- | --- |
| F-IMPL-005 | P1 | The Python test suite does not assert that `health_check()` is healthy for the real 20-routable-skill plus 1 graph-only `skill-advisor` topology. The current test only checks that keys exist, while separate tests cover deliberately degraded synthetic cases. This misses F-IMPL-001. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:144`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:148`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:151` |

Testing notes:
- The TypeScript parity suite is strong for ranking behavior, but it does not exercise the Python health contract.
- Add an explicit health fixture where graph IDs equal discovered skills plus the internal `skill-advisor` node and expected status is `ok`.

Delta:
- New findings: 1
- Churn: 0.18
- Next focus: correctness
