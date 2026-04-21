# Iteration 002 - Security

## Scope

Production code audited:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

## Verification

- Scoped Vitest command: PASS, 5 test files and 37 tests.
- Reviewed subprocess and file-access paths in the two scripts.

## Security Review

No P0/P1/P2 security findings were added in this iteration.

Evidence checked:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:246` invokes Node through an argv list with prompt payload passed via stdin, not shell interpolation.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2015` invokes `ccc search` through an argv list.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:240` rejects absolute `derived.source_docs` paths.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:254` resolves `derived.key_files` under the repo root before existence checks.

Residual risk: file reads are local CLI behavior, not remote input. No shell injection path was found in the reviewed code.

## Delta

New findings: 0. Churn: 0.00.
