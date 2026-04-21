# Iteration 003 - Robustness

## Scope

Audited batch behavior under malformed existing metadata and partial-failure conditions.

## Verification

- Vitest: PASS, `scripts/tests/graph-metadata-backfill.vitest.ts` 3/3.
- Git history checked: `22c1c33a94`, `254461c386`.

## Findings

### DRIMPL-P1-002 - One malformed graph-metadata file aborts the entire batch

Severity: P1

Evidence:

- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:206`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:208`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:214`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:397`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:401`

`runBackfill` loops all discovered folders but has no per-folder error boundary around `loadGraphMetadata`, `deriveGraphMetadata`, or `refreshGraphMetadataForSpecFolder`. `loadGraphMetadata` throws when a file exists but fails validation. In a repo-wide backfill, one corrupt packet can prevent all later packets from being refreshed and no partial failure summary is produced.

## Convergence

New findings ratio: 0.20. Continue.
