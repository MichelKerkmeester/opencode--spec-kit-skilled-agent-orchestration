# Iteration 005 - Final Cross-Check and Synthesis Prep

## Focus

Verify the source-level findings against the current `dist/` build, cross-check remaining alternative explanations for the 33-file scan result, resolve open questions from iterations 1-4, and leave a synthesis-ready executive summary for `phase_synthesis`.

## Actions Taken

1. Checked the built MCP server files under `.opencode/skill/system-spec-kit/mcp_server/dist/code-graph/`.
2. Re-read the scan handler, indexer, DB schema/migration, persistence, and cleanup boundaries.
3. Spot-checked root and nested `.gitignore` files relevant to `.opencode/skill/`.
4. Reconciled all prior "Questions Remaining" entries into answered, ruled out, or deferred outcomes.
5. Prepared the final synthesis hand-off checklist.

## Dist Verification (G1)

The running `dist/` build still contains the stale-gate bug. `dist/code-graph/lib/structural-indexer.js` imports `isFileStale` at line 12 and still applies `if (!isFileStale(file)) continue;` at line 1036. No `skipFreshFiles` guard is present in that built file.

Packet 012 is present in the built output. `dist/code-graph/lib/indexer-types.js` line 45 includes `**/z_future/**`, `**/z_archive/**`, and `**/mcp-coco-index/mcp_server/**` in the default exclude globs.

The built scan handler still calls `indexFiles(config)` without options. `dist/code-graph/handlers/scan.js` computes `fullReindexTriggered` and `effectiveIncremental` at lines 133-137, then calls `indexFiles(config)` at line 141. It exposes `fullReindexTriggered` at line 203 but has no `fullScanRequested` or `effectiveIncremental` response fields.

Verdict: dist matches the source-level findings. This is the current shipped/running state, not a stale build mismatch.

## Alternative Hypotheses Cross-Check (G2)

| Hypothesis | Result | Evidence | Follow-up |
| --- | --- | --- | --- |
| H-alt-1: A pre-scan migration silently dropped rows. | Ruled out as primary cause. | `code-graph-db.ts` schema migration only adds `file_mtime_ms`, creates metadata/index structures, and updates `schema_version`; no migration path drops or truncates `code_files`, `code_nodes`, or `code_edges`. `lastPersistedAt` is derived from `MAX(indexed_at)` in `code_files`, not from a separate migration timestamp. The destructive row removal path is in `scan.ts` when `effectiveIncremental` is false and stale-only `results` become the desired full set. | No implementation change needed for this packet. |
| H-alt-2: The UNIQUE crash cascaded and aborted full-scan cleanup mid-flight. | Ruled out as primary cause; retained as a secondary consistency risk. | Non-incremental cleanup runs before per-file indexing. It builds `indexedPaths` from `results` and removes every tracked file absent from that stale-only set. `replaceNodes()` wraps only the node/edge replacement for one file in a transaction; the handler catches each file error and continues. Therefore duplicate-symbol failures do not abort the cleanup pass. However, `upsertFile()` runs before `replaceNodes()`, so a failed file can still have updated file metadata unless later guarded. | Verify post-fix that the three formerly failing files have coherent `code_files` metadata, nodes, and edges. |
| H-alt-3: A racing scan or concurrent MCP request caused the 33-file outcome. | Not supported by evidence; formally retained as a hardening item. | No scan-level mutex, lock, queue, or in-flight guard was found in the code-graph scan path. The DB uses WAL for concurrent readers, but that is not scan serialization. The exact 33-file result is already explained by the deterministic stale-only `results` plus non-incremental cleanup path. | Defer scan serialization/idempotency hardening to a future packet if post-fix repeated scans or concurrent invocations show instability. |
| H-alt-4: `.gitignore` aggressively ignored the whole `.opencode/` tree. | Ruled out. | Root `.gitignore` explicitly unignores `.opencode/` and comments that this repo is the source of `.opencode/` content. Nested `.opencode/skill/system-spec-kit/.gitignore` excludes build outputs such as `mcp_server/dist/`, `shared/dist/`, and caches, not the whole skill tree. Prior filesystem reproduction still yielded about 1,425 post-exclude candidates. | No follow-up needed beyond the existing acceptance scan. |

## Executive Summary

**Problem:** After packet 012, `code_graph_scan({incremental:false})` returned only 33 files / 809 nodes / 376 edges instead of the expected active-code scale of roughly 1,000-3,000 files.

**Root cause:** The first P0 bug is a split full-scan contract: the scan handler correctly derives `effectiveIncremental=false`, but `indexFiles()` still unconditionally applies `isFileStale()` and returns only stale files. The second P0 bug is duplicate parser-generated `symbolId` values in three indexer-self files, which trigger the `code_nodes.symbol_id` UNIQUE constraint during persistence.

**Fix:** Add `IndexFilesOptions { skipFreshFiles?: boolean }` with a default of `true`, and make the scan handler pass `{ skipFreshFiles: effectiveIncremental }` so caller-requested full scans parse every post-exclude candidate. Add a minimal `seenSymbolIds` dedupe guard inside `capturesToNodes()`, preserving the first node and preventing duplicate IDs from reaching `replaceNodes()`. Supplement the scan response with additive `fullScanRequested` and `effectiveIncremental` fields while keeping `fullReindexTriggered` unchanged.

**Implementation:** Host the remediation under packet `003-code-graph-package/003-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery/`, following ordered tasks T-001 through T-011 for docs, indexer options, scan handler mode, dedupe, response metadata, tests, build, and runtime scan.

**Verification:** Acceptance requires focused tests plus a real `incremental:false` scan that returns `filesScanned >= 1000`, zero duplicate-symbol errors, stable repeat-scan behavior, and passing status/query/context smoke checks.

**Impact if shipped:** The code graph DB should grow from the broken 33-file stale-only set back to approximately 1,425 active files, restoring graph completeness for code_graph_query and code_graph_context.

## Open Questions Resolution (G4)

| Source | Question | Resolution |
| --- | --- | --- |
| Iter-1 | What minimal API change should carry `effectiveIncremental` into `indexFiles()`? | Answered: add `IndexFilesOptions { skipFreshFiles?: boolean }`, default `true`; pass `{ skipFreshFiles: effectiveIncremental }` from the scan handler. |
| Iter-1 | Should duplicate captures be deduplicated, made unique by line, or fixed at parser layer? | Answered: choose Option A, dedupe in `capturesToNodes()` by generated `symbolId`, preserving first-seen nodes. Parser-layer identity repair is deferred. |
| Iter-1 | Should `fullReindexTriggered` be renamed? | Answered: supplement, do not rename. Keep `fullReindexTriggered` for git-HEAD-triggered reindex and add `fullScanRequested` / `effectiveIncremental`. |
| Iter-2 | Should the follow-up implementation include semantic parser repair after the crash guard? | Deferred to future parser-completeness work. The P0 fix should stay a minimal crash guard. |
| Iter-2 | Should `filesScanned` be renamed or supplemented later? | Deferred to packet 014 operator-metrics/scan-response clarity if needed. This packet should clarify docs and add mode fields only. |
| Iter-3 | Should `filesScanned` be supplemented with discovered-candidate count? | Deferred to packet 014. Recommended field names: `candidateFilesDiscovered` or `postExcludeCandidateFiles`, separate from parsed/persisted counts. |
| Iter-3 | Should `method_signature` be added to `JS_TS_KIND_MAP`? | Deferred to a parser-completeness packet. It is not required to fix the stale-gate cleanup or duplicate-symbol crash. |
| Iter-4 | What are the exact duplicate-symbol drop counts per file? | Deferred to patched implementation acceptance. Record the counts in the nested packet implementation summary after diagnostics or scan output exists. |
| Iter-4 | Should discovered candidate counts be added now? | Deferred to packet 014 unless operator confusion persists after `fullScanRequested`, `effectiveIncremental`, and README clarification. |

## Synthesis Hand-Off Checklist (G5)

- [x] All 5 iterations have `iteration-NNN.md` narratives: iteration 005 is this file.
- [x] All 5 iterations have `iter-NNN.jsonl` delta files: iteration 005 delta is written with this iteration.
- [x] `deep-research-state.jsonl` has 5 `type:"iteration"` records after this iteration append.
- [x] `deep-research-strategy.md` has the 5 key questions in Section 3.
- [x] No unresolved placeholder markers remain in iteration narratives.
- [x] Executive summary is synthesis-ready.

## Final Verdict

The prior recommendation is confirmed. The current built MCP server still has the unconditional stale-file filter in `indexFiles()` and the scan handler still calls it without a mode option. Packet 012's excludes are present in dist, so the 33-file result is the interaction of packet 012's now-active scan scope with the pre-existing stale-gate contract bug, followed by destructive full-scan cleanup using a stale-only result set. Duplicate `symbolId` generation remains a second P0 because it prevents the three stale indexer files from persisting cleanly and can leave file metadata ahead of node/edge state.

## Next Focus

synthesis
