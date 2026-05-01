# Iteration 014 — C4: Code-graph staleness detection accuracy

## Focus
Audited how the code graph decides `fresh` vs `stale`, when it forces selective or full reindex, and how the `/doctor:code-graph` workflow consumes that signal. The model is mostly `code_files.file_mtime_ms` plus content hash for tracked files, with Git HEAD as a broad full-scan trigger.

## Actions Taken
- Enumerated code-graph library and doctor workflow files with `rg --files`.
- Searched for staleness/freshness terms across `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/`, code-graph handlers, and `.opencode/command/doctor`.
- Read `code-graph-db.ts`, `ensure-ready.ts`, `structural-indexer.ts`, `indexer-types.ts`, `code-graph-context.ts`, `handlers/status.ts`, `handlers/scan.ts`, and `handlers/detect-changes.ts` around the relevant paths.
- Read `/doctor:code-graph` markdown plus auto/confirm/apply YAML slices that define stale/missed/bloat analysis.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-014-C4-01 | P2 | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:457-459` | False-stale on timestamp-only changes. `ensureFreshFiles()` declares a file stale as soon as the stored mtime differs, before comparing content hash. `isFileStale()` has the same early return at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:421-423`. Concrete patterns: `touch file.ts`, checkout/restore workflows that rewrite mtimes without content changes, generated files rewritten identically, or editors that save identical content. These force selective reindex, and if more than 50 files are touched they trip full scan via `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:199-208`. | On mtime drift, hash the file before declaring stale for normal-sized source files. Keep the current mtime fast path for matching mtimes, but use `content_hash` as the deciding signal when only timestamp changed. |
| F-014-C4-02 | P2 | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:156-183` | False-stale on Git HEAD changes unrelated to indexed structure. `detectState()` marks the graph stale and requests `full_scan` whenever stored and current HEAD differ, even if all tracked files are content-fresh. Concrete patterns: commits that only change Markdown/JSON/spec docs, excluded directories, config files outside `includeGlobs`, or branch switches where indexed source files are identical. The scan handler repeats the same broad full-reindex trigger at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:218-224`. | Replace raw HEAD drift with a graph-affecting diff check: compare `git diff --name-only <storedHead>..<currentHead>` filtered through include globs, language support, max-size rules, gitignore/default excludes, and index-scope exclusions. Full scan only if graph-affecting files changed or the diff cannot be trusted. |
| F-014-C4-03 | P1 | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:166-196` | False-fresh for new indexable files when Git HEAD has not changed. `detectState()` only gets paths already present in `code_files`, partitions that tracked set, and returns `fresh` when those files are up to date. A newly created untracked `*.ts`, `*.js`, `*.py`, or shell file matching the default config at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:137-140` is absent from `code_files`, so it is invisible to this freshness check until a full scan, a HEAD change, or a doctor-style missed-file comparison happens. | Persist and compare a candidate-file manifest, or add a bounded filesystem candidate discovery to readiness snapshots that detects files-on-disk minus `code_files` under the same include/exclude/index-scope rules. Treat missed indexable files as stale with an explicit action. |
| F-014-C4-04 | P1 | `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml:100-104` | Doctor stale detection is wired to the wrong tool contract. The workflow says to invoke `detect_changes({})` to obtain a stale set, but the checked-in handler requires a `diff` string and returns `parse_error` when missing (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:265-274`). Even with a diff, the handler returns affected symbols/files, not `stale_files[]` or `missed_files[]` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:289-319`). Apply mode makes the same assumption at `.opencode/command/doctor/assets/doctor_code-graph_apply.yaml:95-97`. | Give doctor a dedicated index-health primitive, e.g. `code_graph_detect_staleness`, or define the workflow in terms of existing outputs: `code_graph_status` readiness plus a filesystem-vs-`code_files` missed-file comparison and a clear fallback when no per-file stale list is available. |

## Questions Answered
- False-stale patterns: timestamp-only rewrites and broad Git HEAD drift, especially docs/excluded-file-only commits.
- False-fresh patterns: newly added untracked indexable files that are not in `code_files`.
- Doctor workflow accuracy: the diagnostic workflow currently asks `detect_changes` for stale/missed sets it does not produce.

## Questions Remaining
- Whether `code_graph_context` should expose the readiness model's freshness rather than its age-only metadata at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:271-281`; it can label an unchanged graph as time-stale after one hour.
- Whether selective reindex should refresh importer/dependent files for edge-quality drift. The current audit did not prove a concrete false-fresh case there.

## Next Focus
Audit the scanner's incremental/full-scan behavior against include/exclude/index-scope rules, especially whether a shared candidate manifest could solve both missed new files and HEAD-only false-stale scans.
