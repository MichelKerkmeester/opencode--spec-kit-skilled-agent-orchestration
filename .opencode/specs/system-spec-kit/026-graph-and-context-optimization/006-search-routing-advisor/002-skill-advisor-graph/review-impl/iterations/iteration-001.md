# Iteration 001 - Correctness

Dimension: correctness

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`

Verification:
- Vitest scoped command: pass, 7 files and 47 tests.
- Git log checked for implementation history touching `skill_advisor.py` and `skill_graph_compiler.py`; relevant commits include `106d394ca0`, `8264f5ecca`, `c4a2adbbcc`, `b28522bea7`, `7261c3337c`, and `0bccad3e80`.
- Runtime checks: `skill_advisor.py --health` reports `status: degraded` with `missing_in_discovery: ["skill-advisor"]`; `skill_graph_compiler.py --validate-only` exits 2 on zero-edge warnings for `sk-deep-research` and `sk-git`.

Findings:

| ID | Severity | Finding | Code evidence |
| --- | --- | --- | --- |
| F-IMPL-001 | P1 | `health_check()` marks the current implementation degraded because graph inventory includes the internal `skill-advisor` node while discovery only returns 20 routable SKILL.md skills. This makes the health gate red in the normal repo state even though the graph intentionally contains 21 nodes. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2957`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2958`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2966` |
| F-IMPL-002 | P1 | `skill_graph_compiler.py --validate-only` hard-fails any zero-edge skill. In the current repo, that rejects `sk-deep-research` and `sk-git`, so the graph validation command exits 2. A sparse graph can have intentional isolated skills; the compiler needs either an explicit allowlist/policy or metadata must be corrected. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:468`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:782`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:786` |

Delta:
- New findings: 2
- Churn: 0.46
- Next focus: security
