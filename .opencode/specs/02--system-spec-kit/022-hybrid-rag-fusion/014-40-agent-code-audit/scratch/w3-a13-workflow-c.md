● skill(sk-code--review)

● SQL: Track audit todos
  └ 3 row(s) inserted. Last inserted row ID: 3.

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 901-1333
  └ 433 lines read

● Read .agents/skills/sk-code--review/references/quick_reference.md
  └ 151 lines read

● Read .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

● Read .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● skill(sk-code--opencode)

● Todo started:

● Read .agents/skills/sk-code--opencode/references/typescript/quality_standards.md
  └ 1 line read

● Read .agents/skills/sk-code--opencode/assets/checklists/typescript_checklist.md
  └ 392 lines read

● Todo completed: analyze-findings, draft-report

### FINDING-01: Null dereference in validation gate crashes no-data/simulation saves
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1162-1165`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** The code reads `collectedData._source` directly even though earlier lines treat `collectedData` as optional. If `collectedData` is absent, this path throws a `TypeError` before the quality-gate logic can make a controlled decision.
- **Expected Behavior:** Missing `collectedData` should be handled safely, e.g. by treating it as a non-file source or by checking with optional chaining.
- **Root Cause:** The condition assumes `collectedData` is always defined, which contradicts the earlier `collectedData?._source` usage and `!collectedData` simulation detection.
- **Suggested Fix:** Rewrite the branch as `if (!qualityValidation.valid && collectedData?._source !== 'file') { ... }` or normalize the source type into a local variable before this check.

### FINDING-02: Spec-folder prefix stripping produces malformed slug fallback inputs
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:939-940,969-972`
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `specFolderBasename.replace(/^\d+-/, '')` removes only one hyphen after the numeric prefix. For folder names like `02--system-spec-kit`, the fallback base becomes `-system-spec-kit`, which is a malformed slug seed.
- **Expected Behavior:** Prefix normalization should remove the full numeric separator pattern used by spec folders, leaving a clean base name for slug generation.
- **Root Cause:** The regex assumes only `NNN-name` formatting and does not handle `NN--name`/double-hyphen variants.
- **Suggested Fix:** Use a shared spec-folder normalizer or a safer pattern such as `/^\d+--?/`, then trim residual separators before calling `generateContentSlug`.

### FINDING-03: Final write path does not validate helper-generated filenames
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:969-972,1215-1216`
- **Severity:** MEDIUM
- **Category:** SECURITY
- **Current Behavior:** The output of `generateContentSlug()`/`ensureUniqueMemoryFilename()` is used as a write target without a local containment check. If either helper ever returns a path containing separators or an absolute path, this layer will attempt to write it.
- **Expected Behavior:** The write boundary should enforce that the final name is a plain basename that resolves inside `contextDir`, regardless of what upstream helpers return.
- **Root Cause:** Filesystem safety is delegated entirely to upstream helpers instead of being re-validated at the sink.
- **Suggested Fix:** Before `writeFilesAtomically`, reject absolute paths and `..`, require `ctxFilename === path.basename(ctxFilename)`, and verify `path.resolve(contextDir, ctxFilename)` stays within `contextDir`.

### FINDING-04: Duplicate-suppressed context files can still leave stale folder metadata behind
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1024-1103,1215-1223,1267-1283`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `metadata.json` is prepared up front with `embedding.status: 'pending'`, then both files are written together. Later, the code only checks whether the context markdown was actually written; if it was skipped as a duplicate, metadata can still be updated for a memory file that does not exist, and indexing is skipped.
- **Expected Behavior:** Folder metadata should only be updated when a new context file is actually created, and skipped writes should produce an explicit `duplicate`/`skipped` state rather than `pending`.
- **Root Cause:** The workflow batches per-memory output and per-folder metadata before it knows whether the primary file survived duplicate suppression.
- **Suggested Fix:** Determine duplicate status before writing companion metadata, or write `metadata.json` in a second phase only after confirming `ctxFileWritten`; add explicit metadata states for `duplicate`, `skipped`, and `index-failed`.

### FINDING-05: Per-folder memory tracking has a lost-update race
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1223-1238`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Two concurrent saves can both load the same per-folder description, compute the same next `memorySequence`, and overwrite each other’s `memoryNameHistory` updates. The last writer wins.
- **Expected Behavior:** Sequence increments and history appends should be atomic so concurrent saves cannot drop entries or reuse sequence numbers.
- **Root Cause:** `loadPFD` -> mutate -> `savePFD` is a read-modify-write cycle with no lock, transaction, or conflict detection.
- **Suggested Fix:** Serialize description updates with a file lock/queue, or move sequence/history mutation into an atomic helper that retries on write conflict.

### FINDING-06: Description tracking errors are silently discarded
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1223-1240`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Any failure while loading or saving per-folder description tracking is swallowed by `catch {}`. That makes memory-sequence drift and missing history entries invisible.
- **Expected Behavior:** Best-effort failures should at least emit a warning with enough context to debug and, ideally, be surfaced to callers.
- **Root Cause:** The error handler intentionally suppresses all exceptions without logging or status propagation.
- **Suggested Fix:** Catch `unknown`, log the folder and filename, and include a non-fatal warning field in the return value.

### FINDING-07: Indexing failures and metadata-sync failures are conflated
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1272-1288`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** A single `try/catch` covers both `indexMemory()` and `updateMetadataWithEmbedding()`. If indexing succeeds but metadata update fails, the code logs that semantic indexing failed even though `memoryId` may already exist and be returned.
- **Expected Behavior:** The workflow should distinguish “index insert failed” from “index insert succeeded but metadata sync failed” and recover accordingly.
- **Root Cause:** Two different side effects with different rollback/retry semantics share one generic failure path.
- **Suggested Fix:** Split these into separate error boundaries; preserve `memoryId` on post-index metadata failures and mark metadata as desynchronized instead of claiming indexing never happened.

### FINDING-08: Success logging and return data do not describe the actual outcome
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1250-1262,1267-1289,1309-1323`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** The function logs `Context saved successfully!` before indexing completes, prints every planned file from `files` rather than only `writtenFiles`, and returns no explicit flags for duplicate suppression, skipped indexing, validation outcome, or v2 quality score.
- **Expected Behavior:** Logs and return data should reflect what was actually persisted and indexed, not what was merely intended.
- **Root Cause:** The success contract is based on planned artifacts instead of final state.
- **Suggested Fix:** Move the success log after indexing, log from `writtenFiles`, and extend the return shape with fields like `ctxFileWritten`, `duplicateSuppressed`, `indexingStatus`, `qualityValidation`, and `qualityV2Score`.

### FINDING-09: `memorySequence` can still overflow past a safe integer
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1230-1233`
- **Severity:** LOW
- **Category:** BUG
- **Current Behavior:** `Number.isSafeInteger(rawSeq)` is checked before increment, so `rawSeq === Number.MAX_SAFE_INTEGER` passes the guard and is then incremented to an unsafe value.
- **Expected Behavior:** The stored sequence should remain safe after incrementing, or reset/clamp when the maximum safe integer is reached.
- **Root Cause:** The safety check is applied to the pre-increment value only.
- **Suggested Fix:** Guard the increment itself, e.g. `rawSeq >= 0 && rawSeq < Number.MAX_SAFE_INTEGER ? rawSeq + 1 : 1`.

### SUMMARY - Total: 9, Critical: 0, High: 2, Medium: 5, Low: 2


Total usage est:        1 Premium request
API time spent:         4m 48s
Total session time:     4m 59s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 273.4k in, 18.2k out, 192.1k cached (Est. 1 Premium request)
