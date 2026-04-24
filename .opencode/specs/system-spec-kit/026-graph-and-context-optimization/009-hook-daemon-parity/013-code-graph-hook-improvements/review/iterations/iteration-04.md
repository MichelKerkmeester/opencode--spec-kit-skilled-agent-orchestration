## Iteration 04

### Focus

Incremental scan behavior, skipped-file accounting, and the new enrichment-summary clearing path.

### Files Audited

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1335-1376`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:186-244`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts:147-227`

### Findings

- `[P1][correctness] .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1363-1367 already filters fresh files before returning results, but .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:207-212 still tries to count skipped files only from returned results, so real no-op incremental scans report `filesSkipped: 0` instead of the number of fresh files skipped.`
- `[P1][freshness] .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:186-188 and .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:240-243 clear the persisted edge-enrichment summary whenever the current `results` produce no summary, including empty incremental scans that persisted nothing and should have left the last known graph-quality summary intact.`
- `[P2][tests] .opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts:147-227 mocks `indexFiles()` as if fresh files still reach the handler, so the regression suite does not exercise the production `skipFreshFiles` path that creates both issues above.`

### Evidence

```ts
// structural-indexer.ts
if (skipFreshFiles && !isFileStale(file)) continue;

// scan.ts
const results = await indexFiles(config, { skipFreshFiles: effectiveIncremental });

if (effectiveIncremental && !graphDb.isFileStale(result.filePath)) {
  filesSkipped++;
  continue;
}

if (graphEdgeEnrichmentSummary) {
  graphDb.setLastGraphEdgeEnrichmentSummary(graphEdgeEnrichmentSummary);
} else {
  graphDb.clearLastGraphEdgeEnrichmentSummary();
}
```

### Recommended Fix

- Separate "files skipped before parse" from "files returned but not persisted" accounting, and only clear the persisted enrichment summary when a scan actually writes a replacement graph state that lacks enrichment evidence. Update the scan regression to cover an empty `indexFiles()` result under incremental mode.
Target files:
`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`
`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`
`.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts`

### Status

new-territory
