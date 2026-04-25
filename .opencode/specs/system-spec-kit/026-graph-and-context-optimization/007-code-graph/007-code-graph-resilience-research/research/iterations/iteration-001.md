# Iteration 1 - Failure-Mode Survey

## Summary

Existing scan-related logs show two recurring hard scan failure classes: full-scan requests being reduced to stale-only results, and parser output collapsing distinct captures onto duplicate `code_nodes.symbol_id` values. I did not find recurring evidence for ENOENT/permission-denied, timeout/OOM, lock contention, or scan-output/DB-schema mismatch failures in the sampled `code_graph` logs; the closest non-runtime pattern is status/diagnostic confusion from SQLite file-size reporting after DELETE.

## Findings

### Recurring failure classes

- Full-scan stale-gate pruning: caller-requested `incremental:false` was logged as returning only 33 files / 809 nodes / 376 edges, far below the expected 1000-3000 file range, because the scan path treated stale-only results as the complete full-scan set and pruned tracked DB paths not returned by the stale gate.
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-001.log:21-33`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-002.log:23-30`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-003.log:23-30`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-004.log:23-31`
  - Frequency: 4 occurrences across 4 scan-scope logs

- Duplicate symbol identity collisions: parser captures inside a single file produced multiple `(filePath, fqName, kind)` tuples that hashed to the same deterministic `symbolId`, causing `UNIQUE constraint failed: code_nodes.symbol_id` for three indexer-self TypeScript files.
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-001.log:23-32`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-002.log:25-30`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-003.log:35-39`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-004.log:25-31`
  - Frequency: 4 occurrences across 4 scan-scope logs

- Misleading SQLite size/status signal after destructive prune: logs record `dbFileSize` unchanged at 473MB even after the DB pruned to 33 files, because status reports raw SQLite file size rather than logical row retention or post-DELETE compaction.
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-001.log:23-33`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-002.log:25-30`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:701-710`
  - Frequency: 2 occurrences across 2 scan-scope logs

- Non-recurring / not observed in sampled logs: no repeated parser/tokenizer encoding errors, ENOENT/EACCES permission failures, timeout/OOM failures, SQLite lock contention, or scan-output/DB-schema mismatch errors were found in the reviewed log samples. The skill-advisor setup review log did surface a graph-metadata field mismatch (`derived.triggers` / `derived.keywords`), but that is metadata-edit drift rather than a `code_graph_scan` runtime failure.
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/logs/iteration-003.log:189-192`
  - Frequency: 1 adjacent schema-drift occurrence across 1 non-scan review log; 0 recurring scan-output/DB-schema mismatch failures found

### File classes triggering errors

- Indexer-self TypeScript implementation files: `structural-indexer.ts`, `tree-sitter-parser.ts`, and `working-set-tracker.ts` repeatedly appear as the concrete files behind duplicate `symbolId` collisions. These files contain parser constructs that can emit duplicate method/function/parameter captures under the current identity model.
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-002.log:25-30`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:82-87`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:786-802`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:499-525`

- Fresh files in a requested full scan: any file whose DB mtime is fresh can be incorrectly omitted if the stale gate is applied during a full scan, turning a full-scan cleanup into a destructive stale-only retention pass.
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-003.log:25-30`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1405-1409`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1453-1458`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:197-206`

- Large workspaces with aggressive excludes: one scan-scope log establishes that the expected post-exclude count was 1,425 files, so a 33-file result is anomalous rather than a correct consequence of `.gitignore` / default excludes.
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-002.log:23-30`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1223-1270`

### Confirmed-working scan paths

- Current scan handler computes `effectiveIncremental` from the requested `incremental` flag and Git-head full-reindex trigger, then passes that value to `indexFiles(config, { skipFreshFiles: effectiveIncremental })`, which is the intended contrast to the stale-gate failure logged in earlier scan-scope research.
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:174-186`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1405-1409`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1453-1458`

- Current full-scan cleanup distinguishes incremental cleanup from full-scan retained-path cleanup, using all returned scan results as the retention set when `effectiveIncremental` is false.
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:197-206`

- Current node replacement path uses `INSERT OR IGNORE` for `code_nodes`, providing a working contrast to the logged `UNIQUE constraint failed` behavior and reducing duplicate-capture crash risk.
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:324-331`

- Root path validation now explicitly rejects invalid/broken-symlink roots and roots outside the workspace before scan work begins.
  - Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:150-166`

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/deep-research-strategy.md:1-79`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/deep-research-state.jsonl:1-2`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-001.log:13-33`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-002.log:13-31`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-003.log:13-42`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/research/logs/iteration-004.log:13-33`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/review/logs/iteration-003.log:170-230`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/logs/iteration-003.log:14-31`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/logs/iteration-004.log:14-31`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:150-220`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:786-820`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1180-1270`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1397-1533`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:290-335`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:675-715`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:490-525`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:75-90`

## Convergence Signals

- newFindingsRatio: 1.0
- dimensionsCovered: ["failure-modes"]
