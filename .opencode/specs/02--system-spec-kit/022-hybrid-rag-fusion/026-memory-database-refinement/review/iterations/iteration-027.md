# Iteration 027: BM25 index rebuild and consistency

## Findings

### [P1] Reconsolidation merge mutates `memory_index` without syncing the in-memory BM25 singleton
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`

**Issue** The merge path archives the old row and inserts a replacement row directly in `memory_index`, but it never removes the archived document from the in-memory BM25 index or adds the merged replacement. The bridge then returns early, so the normal save path that would at least call `bm25.addDocument(...)` never runs. That leaves the process-local BM25 index out of sync with the database until a restart or a full rebuild happens.

**Evidence** `reconsolidation.ts:223-262` sets `is_archived = 1` on the old row and inserts a new merged row into `memory_index`, but there is no BM25 mutation in that transaction. `reconsolidation-bridge.ts:271-313` treats `merge` as fully handled and exits before the normal create-record path executes. By contrast, the canonical rebuild path in `bm25-index.ts:289-313` only indexes rows where `COALESCE(is_archived, 0) = 0`, so the live singleton can keep returning an archived document that the rebuilt index would exclude while also omitting the new merged row entirely.

**Fix** Add an explicit BM25 sync step for reconsolidation merges after the DB transaction commits: remove `existingMemory.id`, add `newMemoryId` using the same text composition as `rebuildFromDatabase()`, or call a scoped rebuild helper for the affected IDs. Do not rely on restart-time rebuilds for this path.

### [P1] Live BM25 updates do not index the same document shape that rebuilds and FTS scoring use
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts`

**Issue** The rebuild path indexes `title + normalized content_text + trigger_phrases + file_path`, but most live mutation paths feed the singleton only raw content or summary text. That means the in-memory BM25 index has different tokens, different normalization, and effectively different field weighting than the DB-backed rebuild/FTS paths. Queries that depend on title, trigger phrases, file-path terms, or normalized markdown content can therefore behave differently before and after a rebuild.

**Evidence** `bm25-index.ts:41-55` defines field weights with title as the strongest signal, and `bm25-index.ts:289-313` rebuilds documents from `title`, `normalizeContentForBM25(content_text)`, `trigger_phrases`, and `file_path`. The steady-state mutation paths do not mirror that shape: `create-record.ts:201-205` indexes only `parsed.content`, `lineage-state.ts:385-388` indexes only `parsed.content`, `chunking-orchestrator.ts:244-248,341-345` indexes only `parentSummary` or `chunk.content`, `memory-crud-update.ts:155-169` reindexes only on title/trigger edits and still skips `normalizeContentForBM25`, and `archival-manager.ts:424-448` re-adds unarchived rows without normalization. Because `BM25_FTS5_WEIGHTS` are explicitly "not the in-memory BM25 engine" (`bm25-index.ts:41-42`), the runtime BM25 channel never actually matches the weighted field model that rebuilds and FTS search assume.

**Fix** Centralize BM25 document construction behind one helper, for example `buildBm25DocumentText(row)` inside `bm25-index.ts`, and use it everywhere: rebuilds, saves, updates, chunking, lineage writes, and unarchive. That helper should include the same fields and `normalizeContentForBM25()` call every time. If field weighting is intended for the in-memory engine too, encode fields separately or simulate the weights during token construction instead of silently dropping them in live updates.

### [P1] Assistive auto-merge archives rows in SQL but never evicts them from BM25, so the singleton can grow with stale archived documents
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`

**Issue** Assistive auto-merge marks the older memory as archived with a direct `UPDATE`, but it does not call the BM25 archive sync used elsewhere. The save then continues normally and indexes the new memory, so the singleton keeps the archived old document and adds the replacement. Over repeated near-duplicate saves this causes stale archived entries to accumulate in memory even though the authoritative rebuild path would exclude them.

**Evidence** `reconsolidation-bridge.ts:331-367` enables assistive auto-merge by default and archives `topId` with `UPDATE memory_index SET is_archived = 1`, but there is no `bm25.removeDocument(...)` call afterward. The normal save path still indexes the incoming memory in `create-record.ts:201-205`. The singleton itself is process-global and only shrinks when `removeDocument`, `clear`, or `rebuildFromDatabase` is called (`bm25-index.ts:182-216,273-313`), so archived rows from assistive auto-merge remain resident until a later rebuild. That is both a consistency bug and a memory-growth bug.

**Fix** Route assistive auto-merge through the same archive sync used by `archival-manager`, or immediately call `bm25.getIndex().removeDocument(String(topId))` after the archive update succeeds. If assistive auto-merge can archive multiple rows in the future, prefer a post-operation rebuild/sync hook rather than ad hoc per-call SQL updates.

## Summary

The highest-risk consistency problems are in reconsolidation and assistive archive flows, which mutate `memory_index` without applying the BM25 sync rules that startup and checkpoint restore already use. I also found a broader parity issue: live BM25 updates are indexing a different document shape from the canonical rebuild path, so title/trigger/file-path relevance and normalized content behavior can change depending on whether the process has rebuilt recently.
