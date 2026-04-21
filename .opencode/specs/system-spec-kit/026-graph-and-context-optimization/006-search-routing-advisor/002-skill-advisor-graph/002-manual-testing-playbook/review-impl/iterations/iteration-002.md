# Iteration 002 - Security

## Scope

Focused on subprocess boundaries, prompt/metadata sanitization, and untrusted external command surfaces.

Code reviewed:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`

Verification:
- Vitest run 002 passed: 8 files, 54 tests.

## Findings

### IMPL-F005 - P2 Security - Optional semantic lookup executes PATH-resolved ccc without provenance checks

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2113` starts `resolve_cocoindex_binary`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2117` falls back to `shutil.which("ccc")`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1994` starts `_cocoindex_search_builtin`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2015` runs the resolved binary.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2020` executes it from the workspace root with workspace environment.

Why this matters:
The call is shell-safe and timeout-bounded, so this is not a P0/P1 injection issue. The residual risk is provenance: if the repo-local `ccc` binary is missing, hook-time routing can execute whichever `ccc` is first on `PATH` with repo context. That is a hardening gap for prompt-entry automation.

## Delta

New findings: 1 P2.
No P0 findings.
