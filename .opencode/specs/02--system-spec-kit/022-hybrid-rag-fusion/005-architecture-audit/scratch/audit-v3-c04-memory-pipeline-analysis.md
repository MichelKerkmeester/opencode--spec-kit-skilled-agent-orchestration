# C4 Memory Pipeline Audit

Scope reviewed:
- `.opencode/skill/system-spec-kit/scripts/memory/*.ts`
- `.opencode/skill/system-spec-kit/scripts/core/*.ts`

Notes:
- I reviewed all 18 TypeScript source files currently present in scope.
- There are no `.js` source files in those two directories at this revision; runtime behavior was spot-checked through the compiled `dist/` CLIs where helpful.

### C4-001: Filename de-duplication is not atomic, so concurrent saves can overwrite each other / High / File Naming Logic / Location: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:977`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1864`, `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:147`
Description:
The workflow computes a "unique" memory filename before the write phase, but that uniqueness check is only protected by an in-process promise lock. A second process can pick the same filename between `ensureUniqueMemoryFilename(...)` and the eventual rename, and `writeFilesAtomically(...)` explicitly overwrites an existing file instead of failing and re-resolving a new name.

Evidence:
- `withWorkflowRunLock()` is process-local only; it cannot serialize parallel CLI invocations in different processes.
- `ctxFilename` is finalized before the write starts in `workflow.ts`.
- `file-writer.ts` backs up and overwrites an existing target (`Warning: overwriting existing file ...`) instead of treating the collision as a hard conflict.
- Behavioral repro: writing `same.md` through `writeFilesAtomically(...)` replaced the existing file contents, not a collision-safe alternate name.

Impact:
Two overlapping saves for the same spec folder and same minute/slug can lose one memory file entirely. That is durable data loss, and the overwritten content can also desynchronize description tracking, metadata, and indexing history.

Recommended Fix:
Move uniqueness enforcement into the atomic write path. Open the final markdown target with `O_EXCL` semantics or fail on pre-existing targets, then regenerate a suffixed filename and retry. If cross-process concurrency is supported, add a filesystem lock or per-folder lockfile around filename allocation + rename.

### C4-002: Vector index write failures are silently downgraded to "embedding unavailable" / High / Indexing Bugs / Location: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:148`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2376`
Description:
`indexMemory(...)` catches vector-store write exceptions and returns `null`. The workflow interprets any `null` return as "embedding generation returned null" and records `skipped_embedding_unavailable`, even when the embedding succeeded and the actual failure was the database/vector write.

Evidence:
- `memory-indexer.ts` wraps `vectorIndex.indexMemory(...)` in `try/catch` and returns `null` on failure.
- `workflow.ts` treats `memoryId === null` as the single "embedding unavailable" branch and persists `skipped_embedding_unavailable`.
- The `failed_embedding` path in `workflow.ts` only runs when `indexMemory(...)` throws, but the vector-write branch does not throw.

Impact:
Real indexing failures are mislabeled as benign embedding unavailability. Operators get the wrong root cause, retry guidance is misleading, and broken vector writes can accumulate without being surfaced as failures.

Recommended Fix:
Return a structured result from `indexMemory(...)` that distinguishes `embedding_null`, `embedding_error`, and `vector_write_error`, or rethrow vector-write failures so `workflow.ts` can persist a hard failure status with the real error class.

### C4-003: Post-save HIGH findings are advisory only, so known-bad memories still get indexed / High / Error Recovery Gaps / Location: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2323`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:340`
Description:
The post-save review is documented as requiring manual patching for HIGH-severity issues, but the workflow only prints the review result and then continues directly into semantic indexing. No branch aborts, no non-zero exit is produced, and no retry/rollback path exists.

Evidence:
- `workflow.ts` calls `reviewPostSaveQuality(...)` and immediately passes the result to `printPostSaveReview(...)`.
- `post-save-review.ts` prints `The AI MUST manually patch HIGH severity fields before continuing.`
- There is no conditional in `workflow.ts` that checks `reviewResult.status` or `reviewResult.issues` before Step 11 indexing.

Impact:
Memories that the system itself has already identified as malformed or semantically degraded can still enter the vector index. That undermines the review stage, pollutes retrieval, and creates a mismatch between documented operator expectations and actual CLI behavior.

Recommended Fix:
Promote HIGH review issues to an actionable workflow state. Either abort before indexing with a non-zero exit, or write an explicit `needs_manual_patch` status and skip indexing until the saved file is repaired.

### C4-004: Orphan cleanup cannot remove stale searchable rows for deleted or moved memory files / High / Indexing Bugs / Location: `.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:72`, `.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:153`
Description:
The cleanup CLI only deletes rows in `memory_history` and `vec_memories` that no longer have a matching `memory_index` row. It never checks whether the `memory_index` row still points at a real file on disk, so renamed/deleted markdown files remain as stale searchable records.

Evidence:
- Step 1 queries `memory_history LEFT JOIN memory_index`.
- Step 2 queries `vec_memories LEFT JOIN memory_index`.
- All deletion logic is keyed off "missing parent row in `memory_index`".
- Verification only prints counts for `memory_index`, `vec_memories`, and `memory_history`; it never validates backing file existence.

Impact:
Search can continue surfacing memories whose markdown file no longer exists or has moved. Reindex/cleanup runs will report success while stale `memory_index` rows remain in place.

Recommended Fix:
Add a stale-record pass that scans `memory_index.file_path`, validates the file on disk, and deletes or marks rows whose backing file is gone. If path canonicalization/aliasing matters, reuse the same canonical path logic as the MCP file-watcher removal path.

### C4-005: `reindex-embeddings.js` reports success even when the scan reports failures / Medium / CLI Integration / Location: `.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts:81`
Description:
The reindex CLI treats "scan returned content" as success. It always prints `STATUS=OK` and exits 0 in that case, regardless of `data.status` or `data.failed`.

Evidence:
- The only non-success branch after `runMemoryIndexScan(...)` is "no content returned".
- When content exists, the script prints counters, then unconditionally prints `STATUS=OK`.
- There is no exit-code branch on `data.failed > 0` or an unhealthy `data.status`.

Impact:
Automation can treat a partially failed reindex as healthy. Operators may miss that some memories failed to reindex, which is especially risky after repair or migration runs.

Recommended Fix:
Map `data.status` and `data.failed` to explicit exit codes. At minimum, exit non-zero when failures are reported; optionally use a warning exit code for partial success and print the failure summary prominently.

### C4-006: Interrupting `generate-context.js` returns exit code 0 / Medium / CLI Integration / Location: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:160`
Description:
Both `SIGTERM` and `SIGINT` handlers call `process.exit(0)`. That marks an interrupted run as successful even though the workflow may have been stopped before validation, write completion, or indexing.

Evidence:
- `generate-context.ts` installs signal handlers that log a warning and exit `0`.
- Runtime repro: `tail -f /dev/null | node .../generate-context.js --stdin`, followed by `SIGINT`, exited with `exit_code=0` while printing `Warning: Received SIGINT signal, shutting down gracefully...`.

Impact:
Shell scripts, CI hooks, and supervising tools can record aborted saves as successful. That makes mid-run interruption indistinguishable from a real success and complicates recovery after partial writes.

Recommended Fix:
Exit with standard signal codes (`130` for `SIGINT`, `143` for `SIGTERM`) or throw an interrupt error that the top-level handler maps to a non-zero exit and an `interrupted` status.

### C4-007: The post-save trigger validator misclassifies common short technical phrases as path fragments / Medium / Memory File Format Violations / Location: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:151`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:213`
Description:
The path-fragment heuristic marks any 1-4 letter lowercase token as suspicious. That catches real directory names, but it also catches legitimate memory triggers such as `api`, `auth`, `ux`, `sql`, and similar domain terms. Those become HIGH-severity review issues.

Evidence:
- `PATH_FRAGMENT_PATTERNS` includes `^[a-z]{1,4}$`.
- The trigger review escalates any matching phrase to a HIGH issue.
- Behavioral repro: a saved file with `trigger_phrases: ["auth", "api", "oauth"]` produced `HIGH` findings for `["auth","api"]`.

Impact:
The review system generates noisy false positives on normal technical vocabulary. That reduces trust in the review output and can push operators to remove good trigger phrases or ignore the review entirely.

Recommended Fix:
Replace the length-only rule with context-aware checks: compare against actual path tokens from the file/spec context, add an allowlist for common technical abbreviations, and downgrade uncertain matches to MEDIUM unless there is corroborating path evidence.

### C4-008: Folder-global `metadata.json` is rewritten even when the primary memory file is skipped as a duplicate / Medium / Error Recovery Gaps / Location: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2029`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2240`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2358`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:189`
Description:
Every workflow run rewrites a single `metadata.json` in the shared `memory/` folder. If the primary markdown is skipped as a duplicate, `metadata.json` is still written and then updated to `skipped_duplicate`, even though no new memory file was created.

Evidence:
- `workflow.ts` always includes `metadata.json` in the `files` map.
- Duplicate detection only suppresses the markdown file; `writtenFiles` can still contain `metadata.json`.
- The duplicate branch then persists embedding status `skipped_duplicate` into that same shared metadata file.

Impact:
The folder's metadata can stop describing the last actual saved/indexed memory and instead describe a no-op duplicate attempt. That muddies operational debugging and makes "current metadata state" unreliable after duplicate or failed runs.

Recommended Fix:
Either make metadata per-memory-file instead of folder-global, or stop rewriting shared metadata when the primary markdown file is skipped. At minimum, keep duplicate-attempt bookkeeping separate from the canonical metadata for the last durable save.
