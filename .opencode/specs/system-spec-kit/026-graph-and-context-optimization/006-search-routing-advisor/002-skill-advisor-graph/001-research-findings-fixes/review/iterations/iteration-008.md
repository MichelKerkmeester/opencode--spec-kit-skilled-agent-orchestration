# Iteration 008 - Maintainability

## Scope

Reviewed remaining deferred P1 items and whether the packet makes future verification commands executable and unambiguous.

## Files Reviewed

- `plan.md`
- `tasks.md`
- `checklist.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`

## Findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| DR-008 | P2 | Plan still includes impossible `--audit-drift` verification for a deferred flag. | `plan.md:185`, `checklist.md:95`; `skill_graph_compiler.py --help` exposes no `--audit-drift` option. |
| DR-009 | P2 | Reason ordering debt remains and is visible in production output. | `checklist.md:103` marks it deferred; `skill_advisor.py:2811` still sorts and truncates reasons alphabetically. |

## Convergence Check

New severity-weighted ratio: `0.08`. Continue; new findings are P2-only.
