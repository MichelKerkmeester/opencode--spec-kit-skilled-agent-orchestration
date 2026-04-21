# Iteration 003 - Robustness

## Scope

Production code audited:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

## Verification

- Scoped Vitest command: PASS, 5 test files and 37 tests.
- A targeted Python fixture compared compiler discovery with runtime health source diagnostics.

## Finding

### DRI-F002 - P1 Robustness

Runtime source-metadata health ignores the nested skill-advisor graph-metadata file that the compiler treats as authoritative.

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:82` explicitly adds `system-spec-kit/mcp_server/skill-advisor/graph-metadata.json` to discovery.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:94` records parse errors for that nested file as corrupt metadata.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:468` starts runtime source signal loading by scanning only `SKILLS_DIR` top-level entries.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:493` records parse failures only for files reached by that top-level loop.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2936` calls the runtime source loaders before computing `source_metadata`.

Reproduction check: with a valid top-level skill and a corrupt nested `system-spec-kit/mcp_server/skill-advisor/graph-metadata.json`, `discover_graph_metadata()` raises `RuntimeError`, but `health_check()` reports `status: ok` and `source_metadata.healthy: true`.

Expected: every metadata file that compiler validation treats as authoritative should also be part of runtime source health diagnostics.

Actual: the nested advisor metadata file can be corrupt while health remains green if the cached graph is otherwise in sync.

## Delta

New findings: 1 P1. Churn: 0.50.
