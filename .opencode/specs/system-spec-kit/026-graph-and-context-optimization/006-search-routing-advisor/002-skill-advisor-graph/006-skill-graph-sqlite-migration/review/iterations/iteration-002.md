# Iteration 002 - Security

## Focus

Security pass over public MCP query response shapes and handling of internal metadata fields.

## Prior State

Open findings: F-001 (P0 correctness).

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts`

## Findings

| ID | Severity | Finding |
| --- | --- | --- |
| F-003 | P1 | `skill_graph_query` leaks nested `sourcePath` and `contentHash` in several response shapes. |

### F-003 Evidence

The handler's `stripInternalFields()` removes only top-level `sourcePath` and `contentHash` from array items. Relationship results contain a nested `node`; hub results contain `node`; `transitive_path` returns a path object; and `subgraph` returns a graph object with a `nodes` array. Those nested nodes are not sanitized.

## Convergence Check

Continue. Security is covered once, but P0 remains open and traceability/maintainability are not yet covered.
