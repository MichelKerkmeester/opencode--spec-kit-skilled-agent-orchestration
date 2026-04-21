# Iteration 003 - Robustness

Focus: robustness.

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`

Verification:
- `vitest run skill-advisor/tests/compat/python-compat.vitest.ts --reporter=default`: passed, 1 test.
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py --validate-only` currently exits `2`.

Findings:

| ID | Severity | Evidence | Finding |
| --- | --- | --- | --- |
| DR-IMPL-003 | P1 | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:782`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:786`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:3158`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:1179` | The strict validation path treats zero-edge warnings as fatal and the current checkout has two zero-edge skills, so the production validation command exits 2. This contradicts the packet's claimed verification state and leaves the validator unusable until either those edges are supplied or the rule is revised. |

Command evidence:
- Compiler output included `ZERO-EDGE WARNINGS (2)` and `VALIDATION FAILED: 2 error(s)`.
- `skill_advisor.py --validate-only` also exits `2` through the same strict topology path.

Churn: 0.33.
