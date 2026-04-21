# Iteration 007 - Robustness

## Scope

Production code audited:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

## Verification

- Scoped Vitest command: PASS, 5 test files and 37 tests.
- Ran `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --validate-only`; it exits 2 on live zero-edge warnings for `sk-deep-research` and `sk-git`.

## Review

No new robustness finding was added.

The strict validation failure is not counted as a finding in this implementation-focused pass because the failure is caused by live graph metadata content, while the requested scope was the production code files claimed by this packet.

Evidence checked:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:805` delegates strict validation to the compiler.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:822` upgrades selected topology warning blocks to strict failures.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:782` emits zero-edge warnings.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:786` exits nonzero when topology violations are present.

DRI-F002 remains the active robustness issue.

## Delta

New findings: 0. Churn: 0.00.
