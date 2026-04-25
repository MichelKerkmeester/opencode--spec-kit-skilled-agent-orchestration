# Code-Graph Resilience Research Synthesis

<!-- ANCHOR:synthesis -->
## Summary

The seven-iteration loop answered all ten research questions and materialized the required four assets. The resulting resilience posture is source-first: the SQLite graph is a rebuildable cache, trust is gated by freshness/readiness, soft-stale states can selectively self-heal under strict boundaries, and hard-stale/confidence-floor failures must tell the operator to run a full re-scan.

## Findings by Question

### Q1-Q2: Staleness Signals and Thresholds

The code graph already treats staleness as more than raw file mtime. Empty graph, no tracked files, deleted tracked files, Git HEAD drift, stale-count threshold, inline indexing policy, and readiness/trust-state mapping all affect whether graph answers are safe. [SOURCE: `research/iterations/iteration-002.md:3-25`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:102-187`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:73-124`]

The core thresholds are:

- `fresh`: readiness `fresh`, canonical readiness `ready`, trust state `live`, zero stale/deleted tracked files, non-empty graph, current schema, current Git HEAD, and gold-query floors passing.
- `soft-stale`: 1-50 stale tracked files, deleted tracked files with otherwise fresh rows, or age warning older than 8 hours.
- `hard-stale`: empty/error graph, Git HEAD drift, >50 stale files, stale-file ratio >3-5%, scan age >24 hours, schema mismatch, missing persisted scan, or failed gold-query confidence floor.

The 50-file selective threshold is already implemented, Git HEAD drift forces full reindex, and `detect_changes` blocks on every non-fresh graph. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:47-52`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:118-186`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`]

### Q3: Failure Modes

The recurring historical scan failures were full-scan stale-gate pruning, duplicate symbol identity collisions, and misleading SQLite file-size/status signals after destructive prune. Current code has mitigations: explicit `effectiveIncremental`, full-scan retained-path cleanup, and `INSERT OR IGNORE` for nodes. [SOURCE: `research/iterations/iteration-001.md:11-24`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:174-206`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:324-331`]

### Q4: SQLite Recovery

The code-graph DB is an ordinary SQLite cache with `code_files`, `code_nodes`, `code_edges`, `schema_version`, `code_graph_metadata`, and B-tree indexes. `.recover` is a salvage stream, not a trust-restoring operation; the trusted recovery path is quarantine, optional forensic recovery on a copy, clean schema recreation, and full source scan. [SOURCE: `research/iterations/iteration-003.md:3-10`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:50-115`]

Partial persistence is retryable because files are staged with `file_mtime_ms = 0` until nodes and edges persist, so interrupted writes remain stale. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-424`]

### Q5: Verification Battery

The gold battery contains 28 queries spanning MCP tool handlers, cross-module functions, exported contracts, and regression canaries. The final materialized asset is `assets/code-graph-gold-queries.json`. These queries are intended to catch dropped canonical implementation files and over-aggressive excludes. [SOURCE: `research/iterations/iteration-004.md:11-57`; `research/iterations/iteration-004.md:59-354`; `research/deltas/iteration-004.json:4-323`]

### Q6: Exclude-Rule Confidence

Exclude rules should be tiered. High-confidence excludes are infrastructure/cache metadata such as `.git`, `node_modules`, Python caches, local venvs, `.DS_Store`, runtime compile caches, and `.cocoindex_code`. Medium-confidence excludes such as `dist`, `build`, `out`, `vendor`, `external`, and `generated` need warning/override semantics because real repositories use those names for source or regression fixtures. Low-confidence excludes such as fixtures, `testdata`, `scratch`, `z_archive`, `z_future`, and repo-local product directories are repo-policy decisions rather than global defaults. [SOURCE: `research/iterations/iteration-005.md:11-43`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:112-120`; `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:31-48`]

The final materialized tier table is `assets/exclude-rule-confidence.json`.

### Q7-Q8: Edge Drift and Resolver Failures

Edge weights are hard-coded in the producer: `CONTAINS`, `IMPORTS`, and `EXPORTS` at 1.0; `EXTENDS` and `IMPLEMENTS` at 0.95; `DECORATES` and `OVERRIDES` at 0.9; `TYPE_OF` at 0.85; `CALLS` at 0.8; and `TESTED_BY` at 0.6. There is no runtime tuning surface in `IndexerConfig`. [SOURCE: `research/iterations/iteration-006.md:9-28`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:895-1071`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1357-1377`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:73-80`]

Drift should be detected by edge-type distribution, confidence distribution, gold-query pass rate, blast-radius import coverage, and PSI/JSD-style distribution checks. [SOURCE: `research/iterations/iteration-006.md:29-58`]

Resolver failures remain important trust limitations: cross-module imports, path aliases, dynamic imports, type-only imports, re-export barrels, and default-import aliasing do not reliably produce cross-file relationship edges today. [SOURCE: `research/iterations/iteration-006.md:60-73`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:857-920`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:340-397`; `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:12-15`]

### Q9: Confidence-Floor Signaling

The doctor command should tell the user "your graph is unreliable, do a full re-scan" when any of these conditions are observed:

1. Readiness is `empty` or `error`, or trust state is `absent` or `unavailable`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:73-124`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:18-38`]
2. Readiness action is `full_scan`, including Git HEAD drift or >50 stale files. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:118-186`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:174-186`]
3. `lastScanAt` or `lastPersistedAt` is missing, or last scan age exceeds 24 hours without a successful verification pass. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-64`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:701-715`]
4. A scan completed but persisted no graph data, has repeated critical errors, or leaves staged stale rows. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:247-284`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`]
5. Gold-query verification falls below 90% overall, below 80% for an edge-focus bucket, or loses any critical expected symbol. [SOURCE: `research/iterations/iteration-004.md:59-354`; `research/iterations/iteration-006.md:40-43`]
6. Edge-distribution drift exceeds the iteration 6 thresholds or blast-radius import coverage collapses after a trusted baseline. [SOURCE: `research/iterations/iteration-006.md:29-58`]

### Q10: Self-Healing Thresholds and Safety Boundaries

Auto-triggered partial re-scan is safe only for soft-stale states where stale existing tracked files are <= 50, paths remain within the workspace, Git HEAD has not changed, no deleted-file-only cleanup needs a user-visible destructive explanation, no schema/error/corruption signal exists, and the caller opted into inline indexing. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:38-51`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:314-367`]

Read-only and safety-sensitive tools must not self-heal silently. `detect_changes` is the reference behavior: it disables inline index/full scan and blocks rather than returning false-safe empty affected-symbol output. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:94-106`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`]

Full scans should remain explicit unless invoked by a doctor/repair command with clear operator-facing messaging, because full scans can prune tracked paths, alter DB contents, and mask exclude-rule or resolver regressions unless followed by gold verification. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:197-206`; `research/iterations/iteration-001.md:11-20`; `assets/code-graph-gold-queries.json`]

## Materialized Assets

- `assets/code-graph-gold-queries.json`
- `assets/staleness-model.md`
- `assets/recovery-playbook.md`
- `assets/exclude-rule-confidence.json`

## Convergence

All 10 questions are answered. The loop stops at the configured maximum iteration with all required synthesis assets created and the confidence-floor/self-healing policy grounded in current code and prior iteration outputs.
<!-- /ANCHOR:synthesis -->
