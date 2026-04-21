# Iteration 001 - Correctness

Focus: correctness.

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`

Verification:
- `vitest run skill-advisor/tests/compat/python-compat.vitest.ts --reporter=default`: passed, 1 test.
- Git history checked: `a663cbe78f` changed `skill_advisor.py`, `skill_graph_compiler.py`, the regression fixture, and Python/Vitest tests; `106d394ca0` moved the old `.opencode/skill/skill-advisor` tree into `system-spec-kit/mcp_server/skill-advisor`.

Findings:

| ID | Severity | Evidence | Finding |
| --- | --- | --- | --- |
| DR-IMPL-001 | P1 | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py:153`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2708`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2754`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2957` | The Python fallback only discovers `*/SKILL.md`, so the nested `skill-advisor` graph node is not a recommendation record. Graph signal boosts can be added for `skill-advisor`, but the ranking loop iterates only discovered skills, so those signals are dead and health reports inventory parity degraded. |

Ruled out:
- The current native TypeScript scorer has a separate projection path, so this finding is specifically about the Python fallback/CLI path.

Churn: 0.33.
