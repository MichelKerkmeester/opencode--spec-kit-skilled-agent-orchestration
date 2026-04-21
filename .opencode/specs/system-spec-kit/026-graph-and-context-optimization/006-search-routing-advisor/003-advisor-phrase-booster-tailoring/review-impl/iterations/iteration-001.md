# Iteration 001 - Correctness

## Scope

Audited the live Python advisor file resolved from the packet's moved paths:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`

Git history checked: `678bd9bf52 feat(026.013): advisor phrase-booster tailoring` and `106d394ca0 refactor: consolidate skill-advisor into self-contained mcp_server/skill-advisor/`.

Verification: scoped Vitest iteration 001 passed, 2 files / 3 tests.

## Findings

### F-001 - P1 Correctness - Deep-review phrase boosters can still rank below sk-code-review

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1536`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1538`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1540`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1541`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2524`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2525`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2849`

The code adds or keeps explicit sk-deep-review phrases for release/auto review forms, but the disambiguation phrase set omits "auto review" and the final sort can leave sk-code-review first when both candidates round to 0.95. Reproduced examples: `auto review audit`, `auto review security audit`, `release readiness review`, and `review convergence`.

### F-002 - P1 Correctness - `proposal-only` remains filtered below threshold

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1623`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1635`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:3021`

The new `proposal-only` phrase has only a 1.4 boost. `proposal-only candidate evaluation` reaches sk-improve-agent at 0.78 with `passes_threshold=false`; default `analyze_prompt()` output is empty.

## Delta

New findings: F-001, F-002.
