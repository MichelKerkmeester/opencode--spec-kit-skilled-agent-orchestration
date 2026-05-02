# Iteration 014: Reconsolidation bridge

## Findings

### [P0] Merge reconsolidation can make the surviving memory unreachable and returns the wrong ID
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts` and `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`

**Issue**: The merge path archives the old row and inserts a raw replacement row, but it never updates `active_memory_projection`, never runs the normal post-insert/indexing hooks, and the bridge reports the archived row ID back to the caller instead of the new merged row ID. Since vector retrieval joins through `active_memory_projection` and excludes archived rows, the merged survivor can disappear from search immediately after a successful merge.

**Evidence**:
- `executeMerge()` archives the old row and inserts directly into `memory_index`, only optionally inserting into `vec_memories`; it does not call the normal projection/index metadata path at [`reconsolidation.ts:223-260`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L223).
- Vector search only returns rows that both join through `active_memory_projection` and are not archived by default at [`vector-index-queries.ts:223-265`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L223).
- The canonical mutation path explicitly upserts `active_memory_projection` on insert/update at [`vector-index-mutations.ts:85-101`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L85) and [`vector-index-mutations.ts:198-229`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L198), but the merge path bypasses it entirely.
- After merge, the bridge returns `existingMemoryId` as the tool result ID instead of `newMemoryId` at [`reconsolidation-bridge.ts:275-279`](../../../../../../skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L275), even though `executeMerge()` produced a new row ID at [`reconsolidation.ts:264-270`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L264).
- The current merge tests stop at checking that a new row exists and the old row is archived; they do not assert projection/searchability or returned-ID correctness at [`reconsolidation.vitest.ts:341-420`](../../../../../../skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts#L341).

**Fix**: Make merge use the same append-only creation path as normal saves so the new record gets projection state, metadata, BM25/history updates, and the correct returned ID. At minimum, the merge transaction must upsert `active_memory_projection`, apply post-insert metadata, refresh interference/BM25 state, and have the bridge return `reconResult.newMemoryId` instead of the archived predecessor ID.

### [P1] Conflict-band saves on the same file path silently fall back to in-place overwrite and lose lineage
**File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`

**Issue**: The bridge stores conflict candidates through `vectorIndex.indexMemory()` without `appendOnly: true`. On a same-path save, `indexMemory()` updates the existing row instead of creating a new version. That makes `storedId === topMatch.id`, so reconsolidation drops into the legacy `executeConflict()` fallback that overwrites the existing row in place and skips the `supersedes` edge. Because `memory-save` returns early for reconsolidation hits, the normal append-only lineage path never runs.

**Evidence**:
- The bridge conflict store path calls `vectorIndex.indexMemory()` with the incoming `filePath` and no append-only override at [`reconsolidation-bridge.ts:216-230`](../../../../../../skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L216).
- `index_memory()` updates an existing row whenever the same folder/path key already exists unless `appendOnly` is set at [`vector-index-mutations.ts:169-194`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L169).
- In `reconsolidate()`, `conflictMemory.id` is only set when the stored ID differs from the matched row; otherwise `executeConflict()` is called without a distinct new ID at [`reconsolidation.ts:512-526`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L512).
- The no-distinct-ID branch of `executeConflict()` overwrites `content_text`, `title`, `content_hash`, and embedding in place and creates no `supersedes` edge at [`reconsolidation.ts:377-396`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L377).
- `memory-save` exits immediately on non-complement reconsolidation, so the normal append-only `createAppendOnlyMemoryRecord()` and `recordLineageVersion()` flow is skipped at [`memory-save.ts:519-533`](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L519) and would otherwise have run at [`memory-save.ts:544-583`](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L544).

**Fix**: For save-handler callers, forbid the legacy in-place fallback. Conflict handling should always materialize a distinct successor row, preferably via the same append-only/versioned path used by normal saves, and then create the `supersedes` edge against the predecessor.

### [P1] Assistive auto-merge can archive the wrong memory because it skips scope filtering and TM-06 safety guards
**File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`

**Issue**: The assistive reconsolidation path is default-on and directly archives the top match at `>= 0.96`, but unlike TM-06 reconsolidation it does not apply the caller's governance scope filter and does not require a pre-reconsolidation checkpoint. In shared-memory or governed deployments, a high-similarity match from another tenant/user/agent/shared space but the same `spec_folder` can therefore be shadow-archived by the wrong caller.

**Evidence**:
- The guarded TM-06 path checks for a checkpoint before doing any reconsolidation work at [`reconsolidation-bridge.ts:152-160`](../../../../../../skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L152).
- TM-06 similarity candidates are explicitly post-filtered by `tenantId`, `userId`, `agentId`, and `sharedSpaceId` before action selection at [`reconsolidation-bridge.ts:181-199`](../../../../../../skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L181).
- The assistive path performs its own raw `vectorSearch()` and never applies the same scope filter before selecting `topId` at [`reconsolidation-bridge.ts:331-351`](../../../../../../skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L331).
- When the similarity tier is `auto_merge`, it immediately sets `is_archived = 1` on that `topId` with no checkpoint check, lineage update, or causal edge at [`reconsolidation-bridge.ts:353-367`](../../../../../../skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L353).
- Assistive reconsolidation is default-on, so this behavior is active unless explicitly disabled at [`reconsolidation-bridge.ts:56-61`](../../../../../../skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L56) and is tested only for thresholds/classification, not for scope safety, at [`assistive-reconsolidation.vitest.ts:17-227`](../../../../../../skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts#L17).

**Fix**: Run assistive candidate selection through the same governance-scope filter as TM-06, and do not archive anything unless the same checkpoint/safety conditions are met. If that safety bar is not acceptable for assistive mode, keep the `>= 0.96` tier advisory-only instead of mutating records.

### [P2] Interference scoring keeps counting archived and deprecated memories after reconsolidation
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`

**Issue**: Interference scoring computes redundancy from every non-chunk row in a folder, including archived rows and deprecated predecessors. Reconsolidation therefore leaves retired memories contributing penalty weight even though the search pipeline itself excludes archived/deprecated results. That creates a persistent scoring mismatch where active memories are demoted by siblings users can no longer retrieve.

**Evidence**:
- `computeInterferenceScore()` counts all sibling rows in `memory_index` for the folder, excluding only `parent_id IS NULL` and self at [`interference-scoring.ts:120-141`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts#L120).
- `computeInterferenceScoresBatch()` likewise pulls all parent rows in the folder with no `is_archived`, `importance_tier`, or active-projection filter at [`interference-scoring.ts:196-244`](../../../../../../skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts#L196).
- Folder-wide refresh writes scores for every parent row in the folder, again without excluding retired memories, at [`vector-index-store.ts:563-578`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L563).
- The retrieval path excludes archived rows and, by default, excludes deprecated tiers while only considering active projections at [`vector-index-queries.ts:223-265`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L223).
- Reconsolidation itself explicitly archives merge predecessors and deprecates conflict predecessors at [`reconsolidation.ts:223-231`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L223) and [`reconsolidation.ts:349-355`](../../../../../../skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L349).

**Fix**: Compute interference only over active, retrievable memories: filter out `is_archived = 1`, exclude deprecated rows unless a caller explicitly opts in, and ideally derive the comparison set from `active_memory_projection` so scoring matches the retrieval universe.

## Summary
P0: 1, P1: 2, P2: 1.

The biggest regression is on the merge path: it bypasses the canonical indexing/projection workflow badly enough that a “successful” merge can hide the surviving memory. The next two risks are append-only lineage loss in conflict-band same-path saves and an assistive auto-archive path that skips the scope/safety protections TM-06 already has. Interference scoring is a lower-severity follow-on bug, but it will quietly bias ranking after reconsolidation unless the active-vs-retired memory set is aligned.
