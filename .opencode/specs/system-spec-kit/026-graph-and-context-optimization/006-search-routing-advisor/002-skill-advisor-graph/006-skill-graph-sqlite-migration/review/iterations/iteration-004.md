# Iteration 004 - Maintainability

## Focus

Maintainability pass over validation rules and cross-module consistency.

## Prior State

Open findings: F-001 (P0), F-002 (P1), F-003 (P1).

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

## Findings

| ID | Severity | Finding |
| --- | --- | --- |
| F-006 | P2 | Skill graph validation rules are duplicated across database, status, validate, and compiler paths. |

### F-006 Evidence

Allowed families, schema versions, edge types, and weight bands appear in multiple files. That makes future graph schema changes easy to apply in one path and miss in another.

## Convergence Check

All four dimensions have at least one pass. Continue because F-001 is P0 and blocks convergence.
