# Iteration 007 - Robustness

## Scope

Focused on fallback behavior when the compiled graph artifacts are missing.

Code reviewed:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

Verification:
- Vitest run 007 passed: 8 files, 54 tests.

## Findings

### IMPL-F004 - P2 Robustness - Fallback graph load can write skill-graph.json during a read-only advisor call

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:721` starts `_load_skill_graph`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:744` enters auto-compile when neither SQLite nor JSON exists.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:746` invokes the compiler with `--export-json`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:811` prepares JSON export.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:815` writes the output file.

Why this matters:
Advisor routing can be invoked as a prompt-entry/read path. Writing generated graph artifacts during that path can surprise users, fail in read-only installs, and make failures timing-dependent. Prefer explicit setup or an in-memory fallback compile for prompt-time recovery.

## Delta

New findings: 1 P2.
No P0 findings.
