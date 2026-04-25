# Iteration 2 - Staleness Signals + Threshold Candidates

## Summary

The live code-graph implementation already treats staleness as more than file mtime: graph emptiness, Git HEAD drift, deleted tracked files, row-level persistence staging, schema version, readiness trust state, and read-path auto-index policy all affect whether structural answers are safe. The per-file stale predicate itself is still mtime-only, even though `content_hash` is persisted in both `code_files` and `code_nodes`; that makes hash mismatch a cheap candidate signal but not a current freshness authority.

For thresholds, the strongest local quantitative basis is the existing `SELECTIVE_REINDEX_THRESHOLD = 50`: 1-50 stale files are selective-refresh territory, while >50 stale files already triggers a full scan. External tools support adding time-based guardrails rather than replacing content/commit-based checks: Sourcegraph bounds repository polling between 45 seconds and 8 hours, updates global search a few minutes after Git data refresh, and defaults precise-code-intel auto-index scheduling to a 2-minute task interval with a 24-hour same-repository process delay. Universal Ctags is the opposite baseline: it generates a static tag file and does not own staleness detection, so staleness must be inferred externally from source-file changes or wrapper/editor automation.

## Signals Catalog

| Signal name | Cost-to-compute | Reliability | Current mechanism / evidence |
|---|---:|---:|---|
| Stored file mtime mismatch | O(N tracked files) `stat` + DB lookup | High for normal edits; weak for timestamp-preserving writes | `isFileStale()` reads `code_files.file_mtime_ms`, stats the current file, and returns stale when missing, unreadable, or mtime differs (`code-graph-db.ts:380-388`). Batch readiness uses the same stored/current mtime comparison (`code-graph-db.ts:396-424`). |
| Missing DB row for a candidate file | O(1) per file | High | `isFileStale()` returns true when no `code_files` row exists (`code-graph-db.ts:381-384`), so newly discovered candidates are reindexed. |
| Deleted tracked file | O(N tracked files) existence check | High | `detectState()` partitions tracked files into existing/deleted before freshness checks (`ensure-ready.ts:127-135`) and reports stale when deleted files remain (`ensure-ready.ts:148-155`); `ensureCodeGraphReady()` then cleans deleted tracked files (`ensure-ready.ts:302-310`). |
| Empty graph / no tracked files | O(1) counts | High | `detectState()` returns `freshness:'empty'` and `action:'full_scan'` for zero nodes or zero tracked files (`ensure-ready.ts:112-130`). |
| Git HEAD changed | O(1) `git rev-parse HEAD` + metadata lookup | High for branch/commit changes; coarse for working-tree changes | `detectState()` compares current HEAD to persisted `last_git_head` (`ensure-ready.ts:118-125`) and forces full scan when HEAD changed even if tracked mtimes are up to date (`ensure-ready.ts:135-145`). Manual scan also forces `effectiveIncremental=false` when HEAD changes (`scan.ts:174-186`). |
| Stale-file count over selective threshold | O(N tracked files), already computed by readiness | High as a workload-size signal | `SELECTIVE_REINDEX_THRESHOLD` is 50 (`ensure-ready.ts:47-52`); stale counts above 50 return `action:'full_scan'` (`ensure-ready.ts:161-173`), while 1-50 stale files return `action:'selective_reindex'` (`ensure-ready.ts:176-186`). |
| Read-path inline-index policy | O(1) after readiness state | High safety signal | `detect_changes` probes readiness before parsing/lookup, passes `allowInlineIndex:false` and `allowInlineFullScan:false`, and blocks unless freshness is exactly `fresh` (`detect-changes.ts:245-264`). |
| Schema version mismatch / schema drift | O(1) DB read | High for storage compatibility; not currently a stale trigger | The DB declares `SCHEMA_VERSION = 3` and a `schema_version` table (`code-graph-db.ts:50-52`, `code-graph-db.ts:95-97`), then inserts/updates older versions during init (`code-graph-db.ts:157-162`). Status reports the schema version but readiness does not classify mismatches (`status.ts:53-58`). |
| Persisted content hash mismatch | O(file read + hash) per sampled/stale file | Very high for timestamp-preserving edits; currently unused for stale gate | Schema stores `content_hash` on `code_files` and `code_nodes` (`code-graph-db.ts:55-65`, `code-graph-db.ts:68-84`) and indexes file hashes (`code-graph-db.ts:113-115`), but the stale predicate reads only `file_mtime_ms` (`code-graph-db.ts:380-388`). |
| Persistence staging mtime = 0 | O(1) DB field check | High for partial/failed writes | `persistIndexedFileResult()` first writes `file_mtime_ms:0`, persists nodes/edges, then finalizes the real mtime so failed persistence leaves the file stale on the next pass (`ensure-ready.ts:227-248`). |
| Last scan age | O(1) timestamp read | Medium alone; high as a soft warning | Stats derive last scan from `MAX(indexed_at)` (`code-graph-db.ts:701-715`), and status exposes it as `lastScanAt` / `lastPersistedAt` (`status.ts:53-57`). There is no current age threshold. |
| Graph quality / parser provenance drift | O(1) metadata read | Medium; supports confidence floor more than staleness | Status returns `parseHealth` and `graphQualitySummary` (`status.ts:58-62`); readiness contract downgrades stale evidence to `probable` structural trust (`readiness-contract.ts:161-181`). |
| Dependency-of-dependency invalidation | Potentially O(E) over imports/calls | High if implemented; currently not a direct stale trigger | The DB can compute connected-file degree from cross-file edges (`code-graph-db.ts:640-667`), but readiness only returns changed/deleted tracked files, not transitive dependents (`ensure-ready.ts:127-186`). |

## Threshold Candidates

| Boundary | Proposed rule | Rationale |
|---|---|---|
| N0 fresh | Classify as fresh only when readiness reports `fresh`, stale file count is 0, deleted tracked file count is 0, graph has rows, Git HEAD is unchanged, and schema version is current. | This exactly matches the current readiness success path: no stale files/deleted files returns `fresh` (`ensure-ready.ts:133-158`), while empty graph/no tracked rows require a full scan (`ensure-ready.ts:112-130`). The readiness contract maps `fresh` to `ready`/`live` (`readiness-contract.ts:73-88`, `readiness-contract.ts:109-124`). |
| N1 soft-stale | Enter soft-stale when 1-50 existing tracked files have mtime drift, when only deleted tracked files remain, or when `lastScanAt` is older than 8 hours but no hard-stale signal is present. Action: selective reindex or cleanup; read-only impact tools should block rather than answer. | The 1-50 range is the existing selective reindex path (`ensure-ready.ts:47-52`, `ensure-ready.ts:176-186`). Deleted files without mtime drift are stale but `action:'none'` after cleanup (`ensure-ready.ts:148-158`, `ensure-ready.ts:302-310`). The 8-hour age warning is defensible from Sourcegraph's repository update heuristic: repositories are never polled less frequently than every 8 hours, and global search updates a few minutes after Git data refresh. [SOURCE: https://3.30.sourcegraph.com/admin/repo/update_frequency] |
| N2 hard-stale | Enter hard-stale when stale existing files >50, Git HEAD changed, graph is empty/error, schema version is below current, `lastScanAt` is older than 24 hours, or stale-file ratio exceeds 3-5% in large workspaces. Action: full scan; impact/detect tools must refuse structural answers. | `>50` is already the local full-scan switch (`ensure-ready.ts:161-173`). Git HEAD changes force full scans in both readiness and explicit scan (`ensure-ready.ts:135-145`, `scan.ts:174-186`). Empty/error states map to missing/unavailable and must block read-path impact answers (`detect-changes.ts:94-106`, `detect-changes.ts:245-264`, `readiness-contract.ts:73-124`). The 24-hour age boundary matches Sourcegraph precise-code-intel's default same-repository auto-index process delay, while the 3-5% ratio is derived from local scale: iteration 1 recorded 1,425 expected post-exclude files, and the 50-file threshold is 3.5% of that count (`iteration-001.md:35-36`; `ensure-ready.ts:47-52`). [SOURCE: https://docs.sourcegraph.com/code_navigation/explanations/auto_indexing] |
| Ctags baseline | Do not use ctags as an auto-staleness model; treat it as a full-regeneration/static-snapshot baseline. | Universal Ctags' default mode creates a tag file from supplied source files, `--append` is disabled by default, and recursion is explicit (`ctags.1.html`). It does not expose a persisted per-file freshness model comparable to this code graph, so any stale threshold must be external wrapper policy rather than ctags-native. [SOURCE: https://docs.ctags.io/en/latest/man/ctags.1.html] |

## Cross-References to iteration 1

- Iteration 1's full-scan stale-gate pruning failure is directly explained by the current N1/N2 boundary: a requested full scan must not be reduced to stale-only candidates; `effectiveIncremental=false` must keep all returned scan results as the retention set (`iteration-001.md:11-20`; `scan.ts:197-206`).
- Iteration 1's expected 1,425-file scan population gives a local denominator for converting the existing absolute threshold of 50 stale files into a ratio signal: 50 / 1,425 = 3.5%, supporting a 3-5% hard-stale ratio candidate for large workspaces (`iteration-001.md:35-36`; `ensure-ready.ts:47-52`).
- Iteration 1's duplicate-symbol collision class is not a staleness signal by itself, but it is a hard-stale recovery trigger if persistence fails and leaves staged `file_mtime_ms=0`, because the file stays stale until a clean replacement lands (`iteration-001.md:15-17`; `ensure-ready.ts:227-248`).

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/deep-research-strategy.md:40-56`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-001.md:11-20`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-001.md:35-47`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:50-65`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:95-115`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:157-162`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:281-321`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-424`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:640-715`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:47-52`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:102-187`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:290-379`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:174-206`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:94-106`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:319-369`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:11-62`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:73-124`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:161-181`
- `https://3.30.sourcegraph.com/admin/repo/update_frequency`
- `https://docs.sourcegraph.com/code_navigation/explanations/auto_indexing`
- `https://docs.sourcegraph.com/code_search/explanations/features`
- `https://docs.ctags.io/en/latest/man/ctags.1.html`

## Convergence Signals

- newFindingsRatio: 0.86
- research_questions_answered: ["Q1", "Q2"]
- dimensionsCovered: ["staleness-signals", "threshold-candidates", "external-tool-baselines"]
- novelty justification: This iteration adds concrete fresh / soft-stale / hard-stale boundaries grounded in the local 50-file threshold, local 1,425-file scan scale from iteration 1, and Sourcegraph's 8-hour / 24-hour timing anchors.
- remaining gaps: Iteration 3 should test whether SQLite corruption or partial WAL failures can masquerade as `fresh` despite mtime/head checks; later synthesis should decide whether content-hash sampling is mandatory or optional because it requires file reads.
