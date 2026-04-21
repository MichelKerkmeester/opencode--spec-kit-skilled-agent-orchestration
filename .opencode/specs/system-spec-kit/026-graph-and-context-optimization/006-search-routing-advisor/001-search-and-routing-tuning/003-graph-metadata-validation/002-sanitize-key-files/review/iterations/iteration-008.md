# Iteration 008: Maintainability recheck of alias duplication

## Focus
Verify whether the duplicate display-path issue in `key_files` is only cosmetic or still present in the persisted artifact.

## Findings
- No new finding was added, but **F005** remains active because the persisted artifact still stores both `.opencode/skill/system-spec-kit/...` and `mcp_server/...` paths for the same implementation files. [SOURCE: `graph-metadata.json:33-40`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:717-789`]

## Ruled Out
- This pass did not uncover a second maintainability issue in the packet docs themselves; the lingering problem is output normalization, not missing narrative structure.

## Dead Ends
- Comparing entity-dedupe behavior to `key_files` output confirmed that the canonical-path preference currently helps entities more than it helps the stored key-file list. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:445-463`]

## Recommended Next Focus
Run one final correctness pass to confirm the stale ancestry issue is still isolated to `description.json`.

## Assessment
- New findings ratio: 0.09
- Cumulative findings: 0 P0, 5 P1, 0 P2
