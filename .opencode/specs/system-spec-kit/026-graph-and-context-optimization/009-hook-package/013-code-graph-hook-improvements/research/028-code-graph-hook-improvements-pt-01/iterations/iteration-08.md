## Iteration 08
### Focus
Operator-facing observability gaps after scan persistence.

### Findings
- The DB persists `last_detector_provenance_summary` and `last_graph_edge_enrichment_summary` as first-class metadata records, and the scan handler writes both after every scan [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:226-259; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:236-242].
- `getStats()` does not expose those summaries, and `code_graph_status` therefore cannot tell operators whether the current graph was dominated by heuristic parsing or whether edge enrichment confidence degraded [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:652-692; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts:13-47].
- `buildStartupBrief()` likewise only forwards aggregate counts plus stale/ready state, so runtime startup surfaces lose the parser-quality and edge-confidence signals that scans already persist [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:88-128,131-169,223-255].

### New Questions
- Should status/startup surfaces expose the raw summaries, or a normalized "graphQuality" block?
- Would operators benefit more from dominant provenance only, or from the full detector count breakdown?
- Should the startup brief suppress highlights when the last scan was mostly heuristic/regex?
- Does exposing edge-confidence summaries require a matching doc/ENV update so operators know how to interpret them?

### Status
converging
