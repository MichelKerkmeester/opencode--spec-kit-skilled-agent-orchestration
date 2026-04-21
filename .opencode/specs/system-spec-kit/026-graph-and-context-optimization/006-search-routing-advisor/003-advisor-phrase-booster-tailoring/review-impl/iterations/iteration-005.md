# Iteration 005 - Correctness

## Scope

Rechecked the two correctness findings against ranking and filtering code.

Verification: scoped Vitest iteration 005 passed, 2 files / 3 tests.

## Findings

No new findings.

Refinement:

- F-001 is not just a data-table issue. The comment at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2524` to `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2529` says strong phrase boosters should win before disambiguation, but reproduced outputs show equal rounded confidence and sk-code-review winning primary rank.
- F-002 is threshold-specific. With `show_rejections=True`, sk-improve-agent appears at 0.78; with normal filtering, `analyze_prompt()` returns no recommendation.

## Delta

New findings: none. Refined F-001 and F-002.
