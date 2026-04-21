# Iteration 006 - Security

Focus: second security pass.

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`

Verification:
- `vitest run skill-advisor/tests/compat/python-compat.vitest.ts --reporter=default`: passed, 1 test.

Findings:

| ID | Severity | Evidence | Finding |
| --- | --- | --- | --- |
| DR-IMPL-005 | P2 | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:123`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:171`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:649` | Compiler numeric validation uses `isinstance(value, (int, float))`, which accepts JSON booleans in Python. That means `schema_version: true` compares equal to `1`, and `weight: true` can be compiled as a positive weight. This is minor for trusted metadata, but it is a schema hardening gap. |

Remediation note:
- Use `type(value) in (int, float)` plus `math.isfinite()` for weights and `type(schema_version) is int` for schema version.

Churn: 0.20.
