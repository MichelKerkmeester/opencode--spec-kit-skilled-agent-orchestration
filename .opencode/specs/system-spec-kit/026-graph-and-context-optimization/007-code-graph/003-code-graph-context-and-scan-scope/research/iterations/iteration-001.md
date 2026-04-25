# Iteration 001: Code Graph Scan Scope Anomaly

## Focus

Read the code-graph scan path end-to-end for `incremental=false` with unchanged git HEAD, reproduce the packet 012 post-exclude file count, and locate the origin of the three `UNIQUE constraint failed: code_nodes.symbol_id` errors.

## Actions Taken

1. Read `structural-indexer.ts`, `indexer-types.ts`, the built `dist/code-graph/lib/structural-indexer.js`, and the scan handler.
2. Reproduced the scan's post-exclude file count with a Node script using the same `ignore` package resolution behavior, the same include globs, the same default excludes, the same max file size, and the same per-directory `.gitignore` inheritance model.
3. Inspected the live `code-graph.sqlite` row counts after the anomalous scan.
4. Parsed the three errored files with the built parser path and checked for duplicate `symbolId` values inside each parse result.

## Findings

### F1: `incremental=false` is forwarded, but `indexFiles()` still applies the stale-file gate

The handler maps `args.incremental !== false` into `incremental`, so a caller-supplied `incremental:false` becomes `false`. It then computes `effectiveIncremental = incremental && !fullReindexTriggered`, so the handler-level full-scan branch is selected when the caller passes `false`. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:124`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:128`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:171`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:177`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts)

However, the handler calls `indexFiles(config)` without passing the effective incremental mode. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:183`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts) Inside `indexFiles()`, every candidate file still goes through `if (!isFileStale(file)) continue;`, which means fresh files are silently removed from the parse result even during a caller-requested full scan. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1227`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1246`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1249`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts)

This is the likely root cause of the 33-file outcome: the full-scan cleanup branch treats the stale-only parse result as the complete desired graph and removes every tracked path not present in that reduced result set. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:193`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:196`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:197`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:199`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts)

### F2: `fullReindexTriggered=false` is expected for unchanged HEAD, but its name is misleading

`fullReindexTriggered` only means "git HEAD changed while incremental mode was requested"; it is not set for caller-requested `incremental:false`. Therefore `previousGitHead === currentGitHead` correctly leaves `fullReindexTriggered=false`, even though `effectiveIncremental=false` still asks the handler to behave like a full scan. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:171`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:173`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:177`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:248`](../../../../../skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts)

### F3: Packet 012 excludes are not aggressive enough to explain 33 files

The default config now includes 12 language include globs and excludes `node_modules`, `dist`, `.git`, `vendor`, `z_future`, `z_archive`, and `mcp-coco-index/mcp_server`. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:113`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:116`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:117`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts)

The reproduced post-exclude count is 1,425 unique files, with extension counts: 1,205 `.ts`, 4 `.tsx`, 34 `.js`, 13 `.mjs`, 34 `.cjs`, 31 `.py`, and 104 `.sh`. The same reproduction reported 4,272 gitignored entries and 204 default-excluded entries using the indexer's per-pattern walk/counting behavior. This lands inside the packet 012 handover expectation of roughly 1,000-3,000 files. [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/session-handover-2026-04-23.md:31`](../../../../007-deep-review-remediation/session-handover-2026-04-23.md) [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/session-handover-2026-04-23.md:45`](../../../../007-deep-review-remediation/session-handover-2026-04-23.md)

### F4: The three UNIQUE failures originate from duplicate symbols inside parser output, not from stale rows left behind by full-scan cleanup

`code_nodes.symbol_id` is declared unique. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:68`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:70`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts) `replaceNodes()` deletes existing nodes for the file id, then inserts each parsed node inside one transaction. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:305`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:314`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:318`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:328`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts)

The symbol id is deterministic from `filePath`, `fqName`, and `kind`; line number is not part of the key. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:82`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:83`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:85`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts) `capturesToNodes()` uses that key for every capture. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:796`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:799`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts)

Empirical parse checks found duplicate `symbolId` values within all three errored files:

- `structural-indexer.ts`: duplicate `method`/`class:method` and `function`/`foo` captures.
- `tree-sitter-parser.ts`: duplicate `class:body` and `method:TreeSitterParser.if` captures.
- `working-set-tracker.ts`: duplicate `method:WorkingSetTracker.if`, `parameter:WorkingSetTracker.if.existing`, and `method:WorkingSetTracker.for` captures.

This points to parser capture naming quality as a second bug. The duplicate names are plausible because the tree-sitter parser emits captures based on AST-extracted names and the fallback regex path can also emit generic names; both paths ultimately collapse to `filePath + fqName + kind`. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:498`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:505`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:520`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts)

### F5: The DB did replace/prune row counts; unchanged file size is not evidence that old rows remain

The live SQLite DB currently reports 33 `code_files`, 809 `code_nodes`, and 376 `code_edges`, matching the anomalous scan summary. The on-disk `code-graph.sqlite` file remains large because SQLite does not automatically shrink the main database file after deletes, and this workspace also has a sizable WAL file. The DB stats path reports `dbFileSize` from `statSync(dbPath).size`, which is a file-size observation, not a row-count or free-page measurement. [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:683`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:686`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts) [`.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:689`](../../../../../skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts)

## Questions Answered

- Q1: `incremental=false` is partly honored in the handler but not in `indexFiles()`. The stale-file gate inside `indexFiles()` still short-circuits fresh files.
- Q2: The packet 012 exclude set yields about 1,425 post-exclude candidate files in this workspace, not 33.
- Q3: The three UNIQUE errors come from duplicate parser-produced `symbolId` values inside each errored file.
- Q4: The scan did prune the DB down to 33 `code_files`; unchanged DB file size is consistent with SQLite delete behavior and WAL/free-page retention.
- Q5: 33 is not the correct full-scan answer. It is a regression caused by split incremental semantics between the handler and `indexFiles()`, with a separate duplicate-symbol parser/indexing defect exposed on three stale files.

## Questions Remaining

- What minimal API change should carry `effectiveIncremental` into `indexFiles()` without disturbing selective inline refresh callers?
- Should duplicate parser captures be deduplicated before insert, made unique by adding source range to `symbolId`, or fixed at capture extraction time?
- Should `fullReindexTriggered` be renamed or supplemented with a separate `fullScanRequested`/`effectiveIncremental` response field to avoid future operator confusion?

## Next Focus

Design the minimal-diff fix: add an indexer option that disables `isFileStale()` filtering for caller-requested full scans, then add tests proving `incremental:false` returns all post-exclude files and does not prune the graph to only stale files. Separately evaluate a parser-side duplicate-symbol guard for the three self-indexer files.
