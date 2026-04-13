# Iteration 004: Status Bucket Verification

## Focus
Compared the user-expected status distribution with the actual corpus slices and traced the remaining outlier buckets back to `normalizeDerivedStatus()`.

## Findings

### P0

### P1

### P2
- **F005**: A small set of non-canonical derived statuses still survives after backfill — `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:102` — the normalizer maps `complete`, `completed`, `in_progress`, and `planned`, but it leaves values such as `done`, `active`, and `in-progress` untouched, which is why six graph-metadata files still sit outside the canonical `complete|in_progress|planned` buckets. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:102] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/graph-metadata.json:28] [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/015-cmd-create-changelog/graph-metadata.json:42]

## Ruled Out
- Full-corpus status collapse failure: excluding `z_archive` still lands near the operator’s expected bucket mix.

## Dead Ends
- The six outlier statuses are not enough to explain the higher-severity packet problems on their own.

## Recommended Next Focus
Read the operator-facing docs and templates to verify whether the doc-alignment packet actually fixed the requested surfaces.

## Assessment
- New findings ratio: 0.20
- Dimensions addressed: traceability, correctness
- Novelty justification: This pass added one bounded corpus-health advisory after ruling out a broader status-derivation regression.
