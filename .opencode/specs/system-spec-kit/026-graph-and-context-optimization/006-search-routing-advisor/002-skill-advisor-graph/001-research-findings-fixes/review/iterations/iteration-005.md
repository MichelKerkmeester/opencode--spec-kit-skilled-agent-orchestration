# Iteration 005 - Correctness

## Scope

Revisited the original P0 issue list against the live implementation, focusing on whether the documented fixes satisfy the original behavior rather than only the narrowed checklist wording.

## Files Reviewed

- `spec.md`
- `checklist.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

## Findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| DR-005 | P1 | Graph evidence separation does not lower uncertainty. | `spec.md:83` describes confidence/uncertainty inflation; `skill_advisor.py:2791` and `skill_advisor.py:2794` compute uncertainty without graph weighting; `skill_advisor.py:2822` only applies a confidence penalty after calibration. |

## Convergence Check

New severity-weighted ratio: `0.24`. Continue; a new correctness P1 was found.
