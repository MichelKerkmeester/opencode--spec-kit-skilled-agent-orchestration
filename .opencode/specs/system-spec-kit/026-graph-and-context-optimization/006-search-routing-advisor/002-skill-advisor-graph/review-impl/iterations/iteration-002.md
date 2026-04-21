# Iteration 002 - Security

Dimension: security

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`

Verification:
- Vitest scoped command: pass, 7 files and 47 tests.
- Grep checked public-output sanitization and graph metadata fields.

Findings:

| ID | Severity | Finding | Code evidence |
| --- | --- | --- | --- |
| F-IMPL-003 | P2 | The local Python advisor output leaks `_graph_boost_count`, an internal scoring/debug field. The code writes the field into each recommendation but the cleanup block only removes `_score`, `_explicit_skill_match`, `_kind_priority`, `_num_matches`, and `_num_ambiguous`. I reproduced this with `skill_advisor.py "use figma to export designs" --show-rejections --force-local`, which returned `_graph_boost_count` in public JSON. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2817`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2862`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2869` |

Security notes:
- No P0/P1 injection, traversal, or secret leak found in this pass.
- Label sanitization in `advisor-recommend.vitest.ts` covers instruction-shaped labels, but the Python local path has this smaller API hygiene leak.

Delta:
- New findings: 1
- Churn: 0.08
- Next focus: robustness
