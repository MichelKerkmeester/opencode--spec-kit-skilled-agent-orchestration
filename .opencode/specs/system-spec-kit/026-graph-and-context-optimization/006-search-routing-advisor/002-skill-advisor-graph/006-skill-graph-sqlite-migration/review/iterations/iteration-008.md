# Iteration 008 - Maintainability

## Focus

Second maintainability pass over operator-facing health semantics.

## Prior State

Open findings: F-001 through F-007.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/validate.ts`

## Findings

| ID | Severity | Finding |
| --- | --- | --- |
| F-008 | P2 | `skill_graph_status` reports `isHealthy: true` while weight-band violations exist. |

### F-008 Evidence

The status handler computes `weightBandViolations` but `isHealthy` only checks broken edges and unsupported schema versions. This can tell operators the graph is healthy while the same response reports validation drift.

## Convergence Check

Continue. New advisory finding; P0 remains open.
