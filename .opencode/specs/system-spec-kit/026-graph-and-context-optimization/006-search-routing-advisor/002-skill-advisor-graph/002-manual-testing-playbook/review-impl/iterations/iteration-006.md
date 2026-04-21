# Iteration 006 - Security

## Scope

Second security pass over subprocess, stdin, prompt redaction, and native bridge boundaries.

Code reviewed:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`

Verification:
- Vitest run 006 passed: 8 files, 54 tests.

## Findings

No new P0/P1 findings.

IMPL-F005 remains the only security finding. The bridge uses argv arrays and timeouts for external processes, and the native output label sanitizer rejects instruction-shaped labels before exposing legacy CLI output. The remaining issue is provenance hardening for the fallback `ccc` binary path.

## Delta

New findings: 0.
Refined findings: IMPL-F005.
No P0 findings.
