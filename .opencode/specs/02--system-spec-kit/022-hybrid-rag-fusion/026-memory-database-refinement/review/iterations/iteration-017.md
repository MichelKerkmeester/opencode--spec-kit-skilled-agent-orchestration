# Iteration 017: Index scan and ingest

## Findings

### [P1] Incremental scan can silently miss real file updates when mtimes do not move enough
**File**
`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`

**Issue**
The scan's incremental fast path trusts `categorizeFilesForIndexing()` to skip files based only on `file_mtime_ms` and embedding status. That means real content changes can be missed whenever a rewrite preserves mtime or lands within the `< 1000ms` tolerance window, even though the stored row already carries `content_hash` and the stat call already has `size`.

**Evidence**
`handleMemoryIndexScan()` sends every discovered file through `incrementalIndex.categorizeFilesForIndexing(files)` and then treats `categorized.toSkip` as already up to date at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:344-364`. In the helper, `shouldReindex()` returns `skip` whenever `Math.abs(fileInfo.mtime - stored.file_mtime_ms) < MTIME_FAST_PATH_MS` unless embedding is pending/failed at `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:145-172`. The same helper reads `content_hash` from storage and `size` from `fs.statSync()`, but neither value participates in the skip decision at `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:25-37` and `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:91-99`.

**Fix**
Keep the mtime fast path as a cheap first filter, but require a second signal before skipping: compare size, preserve a cheap hash/snapshot for suspicious same-mtime rewrites, or fall back to parsing when the delta is within the tolerance window. At minimum, stop treating `< 1000ms` as sufficient proof that content is unchanged.

### [P1] Stale rows are deleted before replacement indexing completes, so an interrupted scan can leave the index temporarily emptier than either side of the rename
**File**
`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`

**Issue**
The handler performs stale-record deletion before it runs the batch that indexes current files. If a scan is interrupted or the replacement file fails to index, the old row has already been removed and the new row never lands, leaving a partial index state until some later recovery scan succeeds.

**Evidence**
After categorization, the handler assigns `filesToDelete = categorized.toDelete` and immediately executes `deleteStaleIndexedRecords(filesToDelete)` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:344-370`. Only after that does it start `processBatches(filesToIndex, ...)` for the current files at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:381-385`. `deleteStaleIndexedRecords()` calls `vectorIndex.deleteMemory(staleRecordId)` inline for each stale row at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:224-260`, so those deletions are committed independently of the later reindex work.

**Fix**
Stage stale deletions until after successful indexing of the replacement set, or wrap "delete stale + index replacement" in a higher-level transactional/replayable workflow. If immediate deletion is required, persist a recovery journal so a mid-scan crash can restore or retry the removed rows before the next user-visible query.

### [P2] Scan batch concurrency is effectively unbounded by safety policy, which can spike memory on large workspaces
**File**
`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`

**Issue**
The handler delegates bulk scan work to `processBatches()` without enforcing any upper bound on batch size. Because the batch processor runs each batch via `Promise.all()`, an oversized `SPEC_KIT_BATCH_SIZE` can fan out a large number of simultaneous parses/embeddings and create an avoidable OOM risk on large scans.

**Evidence**
`handleMemoryIndexScan()` invokes `processBatches(filesToIndex, ...)` with the default batch size at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:381-385`. That default comes straight from `SPEC_KIT_BATCH_SIZE` with only a `> 0` check at `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:90-91`. `processBatches()` then slices a batch and executes the whole slice concurrently with `Promise.all(batch.map(...))` at `.opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts:112-145`. Each item here is `indexSingleFile()`, which parses and prepares memory content before persistence at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:650-678`.

**Fix**
Clamp scan batch size to a conservative maximum inside the scan path, or switch scan indexing to a resource-aware sequential/pooled executor that adapts to file count and file size. The environment variable can still tune performance, but it should not be able to request arbitrarily large concurrent indexing batches.

### [P2] Ingest start accepts duplicate paths and turns them into duplicate work inside one job
**File**
`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts`

**Issue**
The ingest handler normalizes and validates paths, but it never deduplicates them before creating the job. A caller that submits the same file twice gets inflated `filesTotal`, duplicated progress/error accounting, and redundant indexing work for the same target.

**Evidence**
`handleMemoryIngestStart()` pushes every accepted `realPath` into `normalizedPaths` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:173-230` and passes that array directly into `createIngestJob()` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:232-239`. `createIngestJob()` persists the full array and sets `files_total = normalizedPaths.length` at `.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:244-285`. The worker then iterates `job.paths[currentIndex]` one by one and calls `processFileFn(nextPath)` for every entry at `.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:570-646`, so duplicate inputs are processed twice.

**Fix**
Canonicalize and deduplicate `normalizedPaths` before job creation, and report how many duplicates were collapsed in the success payload. If callers need repeated attempts, that should be an explicit retry option rather than an accidental side effect of duplicate path submission.

## Summary
I found four concrete issues in the reviewed scan/ingest surfaces: one real missed-update bug in incremental scan classification, one delete-before-reindex interruption hazard, one configuration-driven OOM risk from unbounded scan batch fan-out, and one duplicate-path ingest bug that causes redundant work. I did not find a separate lost-job path in the queue itself; crash recovery does reset non-terminal jobs back to `queued`, so the main ingest weakness here is duplicate processing rather than dropped jobs.
