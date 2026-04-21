# Iteration 005 - Correctness

Dimension: correctness

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`

Verification:
- Vitest scoped command: pass, 7 files and 47 tests.
- `skill_graph_compiler.py --validate-only` was rerun and still exited 2 with two zero-edge warnings.

Findings:

| ID | Severity | Finding | Code evidence |
| --- | --- | --- | --- |
| F-IMPL-006 | P1 | The regression suite locks in "orphan skills now fail validation" as expected behavior, but the current production metadata contains two zero-edge skills. That means tests preserve a policy that rejects the live repo unless every skill is forced to declare an edge, including skills that may be intentionally standalone. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:1179`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:1184`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:1185` |

Correctness notes:
- F-IMPL-006 is distinct from F-IMPL-002: F-IMPL-002 is the production compiler behavior; F-IMPL-006 is the test contract that will preserve it.
- The remediation should decide one truth: either add meaningful edges for the current zero-edge skills, or change validator/test policy so intentional isolated skills are allowed.

Delta:
- New findings: 1
- Churn: 0.16
- Next focus: security
