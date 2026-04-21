# Iteration 001 - Correctness

## Scope

Production code audited:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

## Verification

- Scoped Vitest command: PASS, 5 test files and 37 tests.
- Git history checked for these files: `106d394ca0` introduced the self-contained package scripts; `a663cbe78f` later patched both reviewed scripts.

## Finding

### DRI-F001 - P1 Correctness

Quoted command implementation prompts can be normalized into workflow execution routing when they contain workflow verbs.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2192` defines quoted command invocation detection.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2205` treats any workflow marker anywhere in the prompt as invocation intent.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2215` uses the quoted-reference guard before normalization.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2241` skips normalization only when that guard returns true.

Reproduction check: `_should_guard_command_bridge_normalization("add tests for `/memory:save` run-mode guard", "command-memory-save")` returns `False`, and `analyze_prompt()` normalizes the top recommendation to `system-spec-kit`. The same shape without `run` keeps `command-memory-save`.

Expected: quoted command strings in implementation-target prompts stay routed to the command bridge being edited or tested.

Actual: the word `run` anywhere in the prompt flips the quoted command from implementation reference to workflow invocation.

## Delta

New findings: 1 P1. Churn: 0.50.
