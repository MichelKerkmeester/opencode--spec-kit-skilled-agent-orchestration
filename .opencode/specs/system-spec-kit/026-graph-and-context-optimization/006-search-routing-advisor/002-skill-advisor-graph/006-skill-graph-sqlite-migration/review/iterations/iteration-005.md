# Iteration 005 - Correctness

## Focus

Second correctness pass over advisor runtime behavior versus the SQLite migration contract.

## Prior State

Open findings: F-001, F-002, F-003, F-006.

## Files Reviewed

- `spec.md`
- `checklist.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`

## Findings

| ID | Severity | Finding |
| --- | --- | --- |
| F-005 | P1 | Advisor runtime still silently falls back to legacy `skill-graph.json`. |

### F-005 Evidence

The spec says the runtime path uses SQLite and JSON export remains optional for offline analysis and CI. The checklist says `_load_skill_graph()` should no longer read `skill-graph.json` at runtime and health should report `skill_graph_source: sqlite`. The current `_load_skill_graph()` prefers SQLite but then accepts JSON fallback and can auto-compile JSON when both artifacts are missing.

## Convergence Check

Continue. New correctness finding, P0 still open.
