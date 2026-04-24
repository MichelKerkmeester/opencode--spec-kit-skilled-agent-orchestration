## Iteration 03
### Focus
How partial-scope scans can still look healthy to status and startup consumers.

### Findings
- Readiness treats the graph as `fresh` whenever tracked files are current on disk and git HEAD matches, but it has no concept of "the graph only covers a subtree"; once a partial scan deletes out-of-scope rows, freshness collapses to a file-mtime check over the reduced file set [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:96-180].
- `code_graph_status` reports totals, freshness, parse health, and schema version, but not the scan root, scope mode, or any "coverage incomplete" flag, so a narrowed graph can still be surfaced as `ready/live` [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts:13-47].
- `buildStartupBrief()` also derives its `ready/stale` startup banner from `getGraphFreshness(process.cwd())` plus aggregate counts, so a partial graph would still prime hooks as "healthy" if the remaining tracked files are current [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:131-169,223-255].

### New Questions
- Should the DB persist an explicit scan coverage contract, such as workspace-root vs scoped-subtree?
- Should `status` and startup surfaces refuse to claim `ready` when the last persisted scan was partial?
- Would consumers benefit more from a boolean `coverageComplete` flag or a concrete `scanRoot`/`scanScope` payload?
- Do any existing operators rely on subtree scans intentionally enough to justify supporting them?

### Status
new-territory
