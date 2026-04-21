# Iteration 003 - Robustness

Dimension: robustness

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/skill-graph-db.vitest.ts`

Verification:
- Vitest scoped command: pass, 7 files and 47 tests.
- Grep checked graph load, fallback, and compiler write paths.

Findings:

| ID | Severity | Finding | Code evidence |
| --- | --- | --- | --- |
| F-IMPL-004 | P2 | `_load_skill_graph()` can write `skill-graph.json` during an advisor read path when both SQLite and JSON artifacts are absent. A hook/advisor invocation is expected to be read-mostly and safe in restricted runtimes; spawning the compiler with `--export-json` from the loader creates a side effect and potential race between concurrent advisors. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:744`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:746`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:750` |

Robustness notes:
- SQLite load errors are fail-soft (`sqlite3.Error` returns `None`) and JSON decoding errors are caught.
- The side-effectful fallback should be made explicit setup, controlled by an opt-in flag, or redirected to a cache location outside the source tree.

Delta:
- New findings: 1
- Churn: 0.11
- Next focus: testing
