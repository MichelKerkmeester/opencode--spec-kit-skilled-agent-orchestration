# Iteration 007 - Robustness

## Scope

Replayed boundary and literal-pattern cases after the initial robustness pass.

Verification: scoped Vitest iteration 007 passed, 2 files / 3 tests.

## Findings

No new findings.

Refinement:

- F-003 affects several prompt shapes because the new entries at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1509` to `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1511` are short and common.
- F-004 is a different failure mode from F-003: it is not too broad, it is too literal. The keys at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1524` and `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1525` need either real regex handling or concrete phrase variants.

## Delta

New findings: none. Refined F-003 and F-004.
