# Iteration 002 - Security

Focus: security.

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`

Verification:
- `vitest run skill-advisor/tests/compat/python-compat.vitest.ts --reporter=default`: passed, 1 test.
- Reproduction command checked locally with `--force-local --semantic-hits`.

Findings:

| ID | Severity | Evidence | Finding |
| --- | --- | --- | --- |
| DR-IMPL-002 | P1 | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2096`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2105`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:3165` | `--semantic-hits` validates only that the JSON parses to an array, then `_apply_semantic_boosts()` casts `score` with `float()` and blends it without a finite/range check. A caller-supplied `{"score":"1e309"}` is accepted as infinity and can make an unrelated skill pass high-confidence routing. |

Adversarial check:
- `python3 .../skill_advisor.py --force-local --semantic-hits '[{"path":".opencode/skill/sk-git/SKILL.md","score":"1e309"}]' 'unrelated words xyzabc' --show-rejections` returned `sk-git` with confidence `0.95` and `passes_threshold: true`.

Churn: 0.33.
