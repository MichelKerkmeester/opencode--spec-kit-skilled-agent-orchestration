# Iteration 004 - Testing

## Scope

Audited the regression harness and scoped Vitest coverage that protects the phrase-booster change.

Verification: scoped Vitest iteration 004 passed, 2 files / 3 tests. Python regression harness also passed separately: 104/104 evaluations, top1=1.0, p0=1.0.

## Findings

### F-005 - P1 Testing - Added coverage is happy-path only

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py:148`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py:154`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2701`

The harness can check expected top skill and result presence, but the new fixture rows only exercise happy-path phrase prompts. They do not include negative substring cases, deep-review ranking collisions, regex-like how-is/how-does prompts, or the `proposal-only` threshold edge.

### F-006 - P2 Testing - Scoped Vitest parity tests do not consume the packet-local JSONL fixture

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts:35`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-corpus-parity.vitest.ts:42`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:33`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:39`

The scoped Vitest files load the 200-prompt corpus under the 026 research folder, not `skill_advisor_regression_cases.jsonl`. That is useful parity coverage, but it does not directly validate the packet's newly appended phrase fixture rows.

## Delta

New findings: F-005, F-006.
