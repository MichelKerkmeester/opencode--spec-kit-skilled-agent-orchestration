# Iteration 006 - Security

## Focus

Second security pass over mutation authority of the scan tool.

## Prior State

Open findings: F-001, F-002, F-003, F-005, F-006.

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`

## Findings

| ID | Severity | Finding |
| --- | --- | --- |
| F-007 | P1 | `skill_graph_scan` can erase the live graph when pointed at an empty workspace directory. |

### F-007 Evidence

The scan handler accepts an optional `skillsRoot` as long as it resolves under the current workspace. The indexer then treats the scan result as authoritative and `deleteMissingNodes()` deletes all nodes when the discovered skill id list is empty. Because edges cascade from nodes, an accidental empty-root scan can wipe the graph.

## Convergence Check

Continue. New security finding and open P0.
