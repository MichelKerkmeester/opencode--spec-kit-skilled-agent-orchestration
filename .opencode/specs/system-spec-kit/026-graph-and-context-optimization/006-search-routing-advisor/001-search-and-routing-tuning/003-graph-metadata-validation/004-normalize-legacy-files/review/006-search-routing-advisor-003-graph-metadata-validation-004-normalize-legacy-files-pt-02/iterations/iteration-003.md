# Iteration 003 - Robustness

## Scope

Audited:
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`

## Verification

- Scoped vitest: PASS, `1` file and `3` tests.
- Behavior probe: `node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js --dry-run --root /tmp/does-not-exist-graph-review` exits 0 and reports `totalSpecFolders: 0`.

## Findings

### IMPL-ROB-001 - P2 - Active-only archive detection uses the absolute path instead of a root-relative path

Evidence:
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:103` defines `isArchivedTraversalPath(dirPath)`.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:104` tests the normalized full `dirPath` for `z_archive` or `z_future`.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:121` starts traversal at the supplied root.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:122` returns immediately when `activeOnly` and the full current path matches archive/future.

Impact:
If the repository or temporary specs root itself lives under a parent path segment named `z_archive` or `z_future`, active-only mode can skip the entire active corpus.

Suggested fix:
Evaluate archive/future segments relative to the traversal root instead of against the absolute current path.

### IMPL-ROB-002 - P2 - CLI argument parsing silently accepts missing values and unknown flags

Evidence:
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:75` loops through argv manually.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:89` recognizes `--root`.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:90` uses `argv[index + 1] ?? root`, so a bare `--root` silently falls back to the current default.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:91` advances past the missing value.

Impact:
A mistyped flag or missing root value produces a successful run over the default or empty corpus instead of a usage error.

Suggested fix:
Reject unknown flags and validate that `--root` has a following non-flag path.

## Delta

New findings: P2: 2.

