## Iteration 05

### Focus

This round traced whether the persisted detector-provenance and edge-enrichment summaries have any production readers. The goal was to determine whether the scan-time summary work is observable to operators or effectively write-only state.

### Context Consumed

- `iterations/iteration-04.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`

### Findings

- The DB layer exposes both detector-provenance and edge-enrichment summary getters, but `getStats()` still returns only aggregate counts, parse health, timestamps, Git head, DB size, and schema version [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:226-259,652-692].
- `code_graph_status` serializes the `getStats()` snapshot plus readiness fields, so operators see parse health but never the richer persisted provenance/enrichment summaries [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts:13-47].
- `buildStartupBrief()` similarly builds startup output from `getStats()`, `getGraphFreshness()`, and `queryStartupHighlights()`, so the summaries written during scans still do not reach startup surfaces or the builder's own `sharedPayload` [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:131-169,223-255].

### Evidence

```ts
export function getStats(): {
  totalFiles: number; totalNodes: number; totalEdges: number;
  nodesByKind: Record<string, number>; edgesByType: Record<string, number>;
  parseHealthSummary: Record<string, number>;
```

```ts
data: {
  totalFiles: stats.totalFiles,
  totalNodes: stats.totalNodes,
  totalEdges: stats.totalEdges,
}
```

```ts
const stats = getStats();
const graphSummary: StartupGraphSummary = {
  files: stats.totalFiles,
  nodes: stats.totalNodes,
};
```

### Negative Knowledge

- This is not merely a documentation omission; the live production readers truly do not consume the stored summary metadata.
- The summary getters are not inherently useless, but without status/startup readers they function as internal write sinks rather than operator signals.
- Parse-health visibility alone is not a substitute for detector mix or edge-confidence drift; those are materially different observability surfaces.

### New Questions

- `Observability` — Should `getStats()` expand to include summary fields, or should status/startup read them through a dedicated helper?
- `Ergonomics` — Which summary shape would actually help operators: dominant detector only, full counts, or both detector and edge-confidence histograms?
- `Docs` — If these summaries stay internal, should docs stop implying that scan-time quality metadata is surfaced to operators?

### Status

`converging`
