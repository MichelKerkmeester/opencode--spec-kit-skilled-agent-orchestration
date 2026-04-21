# Iteration 004 - Testing

Focus: testing.

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/python-compat.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`

Verification:
- `vitest run skill-advisor/tests/compat/python-compat.vitest.ts --reporter=default`: passed, 1 test.

Findings:

| ID | Severity | Evidence | Finding |
| --- | --- | --- | --- |
| DR-IMPL-004 | P2 | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/python-compat.vitest.ts:12`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:3165`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:3246` | The Vitest wrapper runs the Python suite, but the suite does not pin the `--semantic-hits` input validation path. Since that path can alter routing confidence, it needs a regression case for malformed, non-object, out-of-range, `NaN`, and infinity scores. |

Ruled out:
- Existing tests cover graph intent signals and compiler topology behavior, but not external semantic-hit score validation.

Churn: 0.20.
