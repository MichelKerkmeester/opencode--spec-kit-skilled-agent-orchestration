# Iteration 004 - Testing

## Scope

Production code audited:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

Test code consulted:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`

## Verification

- Scoped Vitest command: PASS, 5 test files and 37 tests.

## Finding

### DRI-F003 - P2 Testing

Regression coverage misses the quoted-command workflow-verb case and nested advisor metadata health case.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:160` covers corrupt source metadata, but the fixture creates top-level skill metadata only.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:790` starts command-normalization guard cases.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:792` includes quoted `/memory:save` without a workflow verb.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2205` is the untested workflow-marker branch that changes quoted command behavior.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:468` is the untested top-level-only source metadata scanner.

Expected: tests should pin both the quoted command implementation-reference behavior when workflow verbs appear as subject text and nested advisor metadata health parity with compiler discovery.

Actual: the current suites pass while both behaviors can be reproduced outside the test corpus.

## Delta

New findings: 1 P2. Churn: 0.20.
