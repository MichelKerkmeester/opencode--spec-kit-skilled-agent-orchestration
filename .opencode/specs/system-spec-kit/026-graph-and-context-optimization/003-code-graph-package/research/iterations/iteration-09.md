## Iteration 09
### Focus
Cross-file dedup defense, residual dangling edges, and graph-integrity edge cases.

### Findings
- The structural indexer generates cross-file `TESTED_BY` edges before it performs the global node-dedup sweep, so edges can be created for nodes that are later dropped. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1268-1309`.
- The query layer already has dedicated dangling-edge suppression and warning logic, which indicates dangling references are an expected live failure mode rather than a purely theoretical edge case. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:276-311`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:314-428`.
- `replaceNodes()` uses `INSERT OR IGNORE`, but `replaceEdges()` still inserts edges for every `sourceId` from the in-memory parse result, so a residual duplicate symbol that is ignored at insert time can still contribute edges whose source node was never persisted for that file. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:306-356`.
- The current defense reduces crashes but does not fully restore graph integrity; it trades hard scan failure for soft dangling-edge debt. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1292-1309`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:301-309`.

### New Questions
- Should dedup move ahead of `TESTED_BY` edge generation so the structural graph stays self-consistent by construction?
- Should `replaceEdges()` filter inserted edges against successfully persisted node IDs instead of trusting the parse result wholesale?
- Is there an operator-facing metric for dangling-edge counts so this debt is observable outside query warnings?

### Status
converging
