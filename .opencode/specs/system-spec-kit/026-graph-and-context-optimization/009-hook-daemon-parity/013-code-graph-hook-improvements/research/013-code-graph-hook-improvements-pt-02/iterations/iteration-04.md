## Iteration 04

### Focus

This round looked at scan-time metadata persistence after the staged-persistence fix. The question was whether any post-scan summary metadata can now become stale independently of the core file/node/edge rows.

### Context Consumed

- `iterations/iteration-03.md`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md`

### Findings

- `handleCodeGraphScan()` always recomputes `graphEdgeEnrichmentSummary`, but it only persists that summary when the value is truthy, so a later scan with no qualifying enriched edge leaves the previous summary untouched in metadata [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:187-188,239-242].
- The metadata layer stores the enrichment summary as a single persisted record, so "do not write when null" effectively means "keep the old summary forever until some future scan overwrites it" [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:243-259].
- The scan unit tests assert detector-provenance summary behavior but do not assert `graphEdgeEnrichmentSummary` emission or clearing, so this stale-summary path is currently unguarded by regression coverage [.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts:91-138].

### Evidence

```ts
const detectorProvenanceSummary = summarizeDetectorProvenance(results);
const graphEdgeEnrichmentSummary = summarizeGraphEdgeEnrichment(results);
if (graphEdgeEnrichmentSummary) {
  graphDb.setLastGraphEdgeEnrichmentSummary(graphEdgeEnrichmentSummary);
}
```

```ts
export function getLastGraphEdgeEnrichmentSummary(): GraphEdgeEnrichmentSummary | null {
  const value = getMetadata('last_graph_edge_enrichment_summary');
  if (!value) {
    return null;
  }
```

```ts
const payload = JSON.parse(response.content[0].text);
payload.data.detectorProvenanceSummary.dominant;
payload.data.filesIndexed;
payload.data.fullReindexTriggered;
payload.data.lastPersistedAt;
```

### Negative Knowledge

- CF-009 still appears effective for structural row persistence; the residual problem is summary freshness after a successful staged write, not partial file persistence.
- Detector-provenance summary itself is always rewritten, so the asymmetry is specific to enrichment summary handling.
- This finding does not depend on status/startup surfacing the summary yet; the stale metadata exists even before a consumer reads it.

### New Questions

- `Freshness` — Should the scan handler explicitly clear enrichment summary metadata when the current scan finds none?
- `Observability` — Would a richer summary shape make stale-summary bugs easier to detect than a singleton metadata record?
- `Verification` — What is the smallest regression test that proves null summaries clear prior metadata?

### Status

`converging`
