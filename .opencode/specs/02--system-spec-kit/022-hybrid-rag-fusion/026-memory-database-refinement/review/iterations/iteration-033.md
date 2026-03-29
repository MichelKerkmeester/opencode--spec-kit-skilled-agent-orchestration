# Iteration 033 — Sprint 1-2 Fix Verification (Correctness Dimension)

**Scope:** P1 Sprint 1-2 fixes — search correctness, data integrity, schema
**Dimension:** Correctness
**Files reviewed:**
- `mcp_server/lib/search/hybrid-search.ts`
- `mcp_server/lib/search/bm25-index.ts`
- `mcp_server/handlers/pe-gating.ts`
- `mcp_server/handlers/memory-save.ts`
- `mcp_server/lib/storage/causal-edges.ts`
- `mcp_server/lib/search/vector-index-schema.ts`
- `mcp_server/lib/cache/embedding-cache.ts`
- `mcp_server/handlers/chunking-orchestrator.ts`

---

## Sprint 1 Fix Verification

### hybrid-search.ts — 6 claimed fixes

#### Fix 1: Threshold units (fractional vs percentage)

**Status: VERIFIED CORRECT**

`PRIMARY_FALLBACK_MIN_SIMILARITY = 30` and `SECONDARY_FALLBACK_MIN_SIMILARITY = 17` at lines 235-239 are intentionally in percentage units (0-100 scale). This is consistent with the vector-index-queries layer, which converts at line 200: `const max_distance = 2 * (1 - minSimilarity / 100)`. The constants are passed directly as `minSimilarity` to `vectorSearchFn`, which internally divides by 100 before converting to cosine distance. The pe-gating layer also passes `minSimilarity: 50` (line 83 in pe-gating.ts) using the same 0-100 scale. No unit mismatch exists.

#### Fix 2: Disabled channels not re-enabled in fallback

**Status: VERIFIED CORRECT with a residual concern (P2)**

`getAllowedChannels()` at lines 666-678 correctly reads the explicit caller channel flags (`useGraph=false`, `useBm25=false`, `useFts=false`, `useVector=false`) into an `allowedChannels` set. `applyAllowedChannelOverrides()` at lines 680-693 then uses this set to filter overrides, so explicitly disabled channels cannot be re-enabled by `forceAllChannels`. In `searchWithFallbackTiered()` at lines 1967-1970, Tier 2 sets `forceAllChannels: true` but still wraps via `applyAllowedChannelOverrides(options, allowedChannels, ...)` — the allowed-channel set acts as the invariant cap.

**Residual concern (P2):** `forceAllChannels` in `hybridSearchEnhanced()` at line 849-850 replaces `activeChannels` with the full `allPossibleChannels` set (`['vector', 'fts', 'bm25', 'graph', 'degree']`) before the `allowedChannels` cap is applied at lines 854-857. Removing from `activeChannels` happens after the set is fully populated. The gate is present and correct, but the logic reads confusingly — `forceAllChannels` populates the full set first and then the mask removes from it, rather than starting from `allowedChannels` directly. No functional bug but the ordering creates maintenance risk.

#### Fix 3: `useGraph:false` disables degree

**Status: VERIFIED CORRECT**

`getAllowedChannels()` at lines 672-675:
```
if (options.useGraph === false) {
  allowed.delete('graph');
  allowed.delete('degree');
}
```
Both `graph` and `degree` are removed atomically. The degree channel at line 963 checks `activeChannels.has('degree')` before executing. The fix is complete.

#### Fix 4: Adaptive fusion weight not flipping

**Status: VERIFIED CORRECT**

`hybridAdaptiveFuse()` is called at line 1033 with `semanticResults` and `keywordResults` as positional arguments. The resulting `adaptiveResult.weights` at line 1034 extracts `semanticWeight`, `keywordWeight`, and `adaptiveGraphWeight`. These are then applied at lines 1042-1048: the vector list gets `semanticWeight`, the graph list gets `adaptiveGraphWeight`, and a synthesized keyword list gets `keywordWeight`. The fusion list explicitly excludes `fts` and `bm25` sources (line 1040) before injecting the merged keyword bucket. No weight-argument transposition is present.

#### Fix 5: Confidence truncation after rerankers

**Status: VERIFIED CORRECT**

The pipeline ordering in `hybridSearchEnhanced()` is:
1. Cross-encoder / local reranker (lines 1170-1175)
2. MMR reranking (lines 1177-1243)
3. Co-activation boosting (lines 1246-1274)
4. Folder relevance scoring (lines 1277-1300)
5. Confidence truncation (lines 1302-1329)
6. Token-budget truncation (lines 1382-1406)

Confidence truncation correctly runs after all reranking and score-boosting steps. The `evaluationMode` bypass at line 1305 prevents truncation in eval scenarios. The implementation matches the intended sequencing.

#### Fix 6: Token-budget byte count

**Status: VERIFIED — uses character count (not bytes), which is the correct heuristic**

`estimateTokenCount()` at lines 2047-2050 divides `text.length` (UTF-16 code units) by 4 as a token heuristic. `estimateResultTokens()` at lines 2057-2074 serializes via `JSON.stringify` and passes the resulting string `.length` to `estimateTokenCount`. This is a character-count heuristic — not byte count. For ASCII-dominant English content this is an accurate LLM token approximation (1 token ≈ 4 chars). The prior finding that this was using byte count was incorrect; the code correctly uses `.length`. The `CONTEXT_HEADER_TOKEN_OVERHEAD` constant at line 255-257 also uses character division:
```
Math.ceil((CONTEXT_HEADER_MAX_CHARS + CONTEXT_HEADER_SEPARATOR_CHARS) / 4)
```
All budget arithmetic is consistent on the character/token axis.

---

### bm25-index.ts — 2 claimed fixes

#### Fix 7: Archived doc eviction

**Status: VERIFIED CORRECT**

`BM25Index.rebuildFromDatabase()` at lines 354-383 uses:
```sql
SELECT id, title, content_text, trigger_phrases, file_path
FROM memory_index
WHERE COALESCE(is_archived, 0) = 0
```
Archived documents (`is_archived = 1`) and NULL-archived documents treated as archived are excluded. The `COALESCE` guard handles rows predating the `is_archived` column. The in-memory index is cleared first with `this.clear()` at line 355, so stale archived entries cannot survive a rebuild.

**Gap (P2):** The online path (`addDocument` / `removeDocument`) does not check `is_archived` — individual saves or ingest calls can add archived documents to the in-memory index. Only a full `rebuildFromDatabase()` guarantees exclusion. This is a known limitation noted in the comment block but creates a window where BM25 returns archived hits between restarts.

#### Fix 8: Centralized `buildBm25DocumentText`

**Status: VERIFIED CORRECT**

`buildBm25DocumentText()` is defined at lines 205-226 and exported at line 518. `rebuildFromDatabase()` at line 371 calls it directly. The chunking-orchestrator at lines 248-253 and 355-360 also imports and calls `bm25Index.buildBm25DocumentText(...)`. The normalization of `trigger_phrases` (JSON array or raw string) is handled by `normalizeTriggerPhrasesForBM25()` at lines 175-203, centralized within the same module. Duplication is eliminated.

---

### pe-gating.ts — Scope-aware PE filtering

**Status: VERIFIED CORRECT with a P2 residual**

`findSimilarMemories()` at lines 64-113 performs a multi-scope post-filter:
- `tenantId`, `userId`, `agentId`, `sessionId`, `sharedSpaceId` are all checked via `matchesScopedValue()`.
- The function over-fetches by `limit * 3` at line 81 to compensate for post-filter reduction.
- The `minSimilarity: 50` at line 83 is in percentage units (correct per Fix 1 analysis above).
- The `H9 FIX` comment at line 93 confirms `sessionId` filtering was specifically added to prevent cross-session PE decisions.

**Residual (P2):** When all `limit * 3` candidates are filtered out by scope checks, the function returns `[]` silently. The caller (`evaluateAndApplyPeDecision`) then has no similar memories to compare against and will default to `CREATE` for every save, bypassing deduplication entirely for isolated-scope saves. This is arguably correct behavior (no cross-scope pollution) but could mask genuine duplicates within narrow-scope deployments where the over-fetch multiplier is still insufficient.

---

### memory-save.ts — 3 claimed fixes

#### Fix 9: Atomic save window closed

**Status: PARTIALLY VERIFIED — core claim correct, edge case remains (P1)**

The `writeTransaction = database.transaction()` at line 683 wraps both the content-hash dedup check (`checkContentHashDedup` at lines 675-681 runs outside the transaction as an optimization note at line 671) and the actual `createMemoryRecord` / `markMemorySuperseded` inside a single SQLite transaction, committed with `.immediate()` at line 737. The F1.01 comment at line 713 confirms supersede-mark is now inside the transaction.

**Residual (P1):** The content-hash dedup check at lines 675-681 (`checkContentHashDedup`) is deliberately run outside the transaction (comment: "reads are safe outside the transaction"). However, between that check and the `writeTransaction.immediate()` at line 737 there is a TOCTOU window: another concurrent process can insert the same content hash after the dedup check passes but before the write lock is acquired. The comment acknowledges this but frames it as defense-in-depth, relying on the SQLite unique constraint to catch it. The concern is that the transaction does not re-run `checkContentHashDedup` inside the locked context, so a duplicate could be inserted if the constraint is not in place (e.g., content-hash column lacks a unique index). This is worth confirming against the schema.

#### Fix 10: Write lock scope

**Status: VERIFIED CORRECT**

`withSpecFolderLock()` at line 463 is called with `prepared.parsed.specFolder` as the key. The entire indexing pipeline — embedding, PE gating, DB write — executes within this lock. The `refreshFromDiskAfterLock` path at line 465-466 re-parses the file after acquiring the lock to eliminate TOCTOU between the pre-lock parse and the locked write. The lock scope is appropriate.

#### Fix 11: Large-file quality gate

**Status: VERIFIED CORRECT**

`isSaveQualityGateEnabled()` and `isQualityGateEnabled()` at line 514 gate the quality check. The quality gate at lines 516-571 runs after embedding generation and before PE gating — the ordering is correct. The `qualityGateMode === 'warn-only'` path at line 540 passes spec documents through with a warning rather than hard-rejecting them, which is the intended behavior for live spec documents. Errors inside the quality gate at lines 566-570 are caught and logged without blocking the save.

---

## Sprint 2 Fix Verification

### causal-edges.ts — Per-path traversal and cumulative strength propagation

#### Fix 12: Per-path traversal

**Status: VERIFIED CORRECT**

`getCausalChain()` at lines 428-485 uses a `path: Set<string>` to detect cycles. At each recursive call at lines 476-479, a new `Set` (`nextPath`) is created from the parent path with the next node added. This is a per-branch copy, not a shared mutable set. Each traversal branch maintains its own visited set, so:
- A node reachable via two different paths is correctly visited twice.
- Cycles within a branch are detected and stopped.
- No false "already visited" suppression occurs across branches.

The fix is complete and correct.

#### Fix 13: Cumulative strength propagation

**Status: VERIFIED CORRECT**

At lines 464-465:
```ts
const weight = RELATION_WEIGHTS[edge.relation] ?? 1.0;
const weightedStrength = clampStrength(node.strength * edge.strength * weight) ?? 0;
```
The child's strength is the product of the parent node's strength, the edge's raw strength, and the relation-type weight multiplier. This propagates strength cumulatively down the chain — a node at depth 2 has strength `root.strength × edge1.strength × weight1 × edge2.strength × weight2`. The `clampStrength()` call keeps the result within [0, 1]. The `RELATION_WEIGHTS` table assigns `supersedes: 1.5`, `caused: 1.3`, `contradicts: 0.8` which correctly amplify or dampen based on semantic relationship type.

---

### vector-index-schema.ts — Fail-hard DDL and v12/v23 migration repairs

#### Fix 14: Fail-hard DDL via `createRequiredIndex`

**Status: VERIFIED CORRECT**

`createRequiredIndex()` at lines 154-176 calls `database.exec(sql)` and then verifies the index exists via `hasIndex()`. If `exec` succeeds but the index is absent (which should not happen but guards against SQLite bugs), it throws. If `exec` fails but the index already exists (e.g., partial migration re-run), it logs a warning and returns without throwing. This is the correct fail-hard semantic — only truly absent indexes cause an error.

Used in migrations v4, v12, v13, v15, and others for all critical indexes. The pattern ensures migrations cannot silently proceed past index creation failures.

#### Fix 15: v12 migration repair

**Status: VERIFIED CORRECT**

`migrateMemoryConflictsTable()` at lines 222-275:
1. If the table doesn't exist, creates it fresh.
2. If it exists and already has all unified columns (`hasUnifiedMemoryConflictsTable()`), skips.
3. Otherwise, renames the old table to `memory_conflicts_legacy`, creates the new unified table, and performs a column-aware `INSERT ... SELECT` that uses `getFirstAvailableColumnExpression()` to map old column names to new ones (`similarity_score` → `similarity`, `notes` → `reason`, etc.).
4. Drops the legacy table.
5. Verifies the unified table is correct after migration — throws if not.

The migration is idempotent and handles schema drift from older deployments. The fail-hard post-verification at line 272-274 prevents a silent partial migration.

#### Fix 16: v23 migration repair

**Status: VERIFIED CORRECT with a P2 gap**

Migration v23 at lines 1035-1072:
1. Selects all rows with non-empty `file_path`.
2. Filters to spec-folder paths using normalized path separators (`replace(/\\/g, '/')`) to handle Windows paths.
3. Calls `extractSpecFolder()` to compute the canonical spec folder and compares against the stored value.
4. Bulk-updates rows where they differ using a `WHERE id = ? AND spec_folder = ?` guard to prevent clobbering concurrent changes.
5. Also migrates `session_state.spec_folder` and `memory_history.spec_folder` via helper functions.

**P2 gap:** The migration wraps all individual migrations in a single transaction at line 1075-1082 (`run_all_migrations = database.transaction(...)`). However, within migration v23 itself, the updates are issued individually (line 1063) without a nested transaction. For large databases with thousands of rows, a mid-migration crash would leave the schema version un-bumped (outer transaction rolls back), so the migration would re-run on next startup — which is safe since the `WHERE spec_folder = ?` guard prevents double-updates. The behavior is correct but depends on transactional atomicity of the outer wrapper.

---

### embedding-cache.ts — Dimension-aware cache key

#### Fix 17: Dimension-aware cache key

**Status: VERIFIED CORRECT**

`lookupEmbedding()` at lines 63-83 queries with:
```sql
SELECT embedding FROM embedding_cache WHERE content_hash = ? AND model_id = ? AND dimensions = ?
```
The `dimensions` column is part of both the lookup predicate and the `UPDATE last_used_at` predicate at line 79. The table schema at lines 38-47 uses `PRIMARY KEY (content_hash, model_id)` — note that `dimensions` is NOT part of the primary key.

**P1 finding:** The primary key does not include `dimensions`. `storeEmbedding()` at line 128-133 uses `INSERT OR REPLACE`, keyed on `(content_hash, model_id)`. If the same content is re-embedded with a different model that produces a different dimension count (e.g., model upgrade from 1536-dim to 3072-dim embeddings), `INSERT OR REPLACE` will overwrite the old entry. The `lookupEmbedding` call with the new `dimensions` value will then find the new entry correctly. However, if the model produces the same `model_id` string with a different `dimensions` value (dimension mismatch bug in the provider), `INSERT OR REPLACE` will silently replace the correctly-dimensioned embedding with the wrong one. The `lookupEmbedding` dimension filter prevents returning wrong-dimension embeddings on read, but the store step can silently corrupt a valid cache entry with an identically-named model that returns different dimensions. This is an edge case but represents a correctness risk for deployments that modify embedding models without changing the model ID string.

---

### chunking-orchestrator.ts — Anchor-mode and transactional child inserts

#### Fix 18: Anchor-mode chunking

**Status: VERIFIED CORRECT**

`chunkLargeFile()` is imported from `'../lib/chunking/anchor-chunker'` (line 18). The `indexChunkedMemoryFile()` function passes `chunk.label` as `anchorId` at line 306 to `vectorIndex.indexMemory()`. Each chunk carries its label through `applyMetadata` at line 334 (`chunk_label: chunk.label`). The parent is created with `embedding_status: 'partial'` at line 230 and the summary text as `contentText` at line 213. The anchor-mode semantics are implemented end-to-end.

#### Fix 19: Transactional child inserts

**Status: VERIFIED CORRECT with a P2 safe-swap concern**

Each child insert is wrapped in `insertChunkTx = database.transaction()` at lines 301-345. The transaction covers both `vectorIndex.indexMemory()` (or `indexMemoryDeferred()`) and `applyMetadata()`. If `applyMetadata` throws, the insert rolls back.

**Safe-swap concern (P2):** The safe-swap path (lines 329-342) intentionally omits `parent_id` from the child's metadata when `useSafeSwap` is true:
```ts
applyMetadata(database, childId, {
  ...(useSafeSwap ? {} : { parent_id: parentId }),
  ...
});
```
This means children on the safe-swap path are inserted with NULL `parent_id`, making them orphaned in the `memory_index` table until the finalization step. If the process crashes between chunk insertion and the parent-swap finalization, those NULL-parent-id child rows persist and are invisible to parent-based queries. The chunking-orchestrator does not appear to have a recovery path for this orphan state. This is an existing design limitation, not a regression, but warrants a cleanup job during startup or maintenance.

---

## Summary Table

| # | File | Claim | Status | Severity |
|---|------|-------|--------|----------|
| 1 | hybrid-search.ts | Threshold units (percentage) | VERIFIED | — |
| 2 | hybrid-search.ts | Disabled channels not re-enabled | VERIFIED | P2 residual |
| 3 | hybrid-search.ts | useGraph:false disables degree | VERIFIED | — |
| 4 | hybrid-search.ts | Adaptive fusion weight not flipping | VERIFIED | — |
| 5 | hybrid-search.ts | Confidence truncation after rerankers | VERIFIED | — |
| 6 | hybrid-search.ts | Token-budget uses char count (not bytes) | VERIFIED | — |
| 7 | bm25-index.ts | Archived doc eviction in rebuild | VERIFIED | P2 residual |
| 8 | bm25-index.ts | Centralized buildBm25DocumentText | VERIFIED | — |
| 9 | pe-gating.ts | Scope-aware PE filtering | VERIFIED | P2 residual |
| 10 | memory-save.ts | Atomic save window closed | PARTIAL | P1 residual |
| 11 | memory-save.ts | Write lock scope | VERIFIED | — |
| 12 | memory-save.ts | Large-file quality gate | VERIFIED | — |
| 13 | causal-edges.ts | Per-path traversal | VERIFIED | — |
| 14 | causal-edges.ts | Cumulative strength propagation | VERIFIED | — |
| 15 | vector-index-schema.ts | Fail-hard DDL | VERIFIED | — |
| 16 | vector-index-schema.ts | v12 migration repair | VERIFIED | — |
| 17 | vector-index-schema.ts | v23 migration repair | VERIFIED | P2 residual |
| 18 | embedding-cache.ts | Dimension-aware cache key | VERIFIED | P1 new finding |
| 19 | chunking-orchestrator.ts | Anchor-mode | VERIFIED | — |
| 20 | chunking-orchestrator.ts | Transactional child inserts | VERIFIED | P2 residual |

---

## New Findings

### P1-033-A — Embedding cache PRIMARY KEY excludes dimensions, enabling silent cross-dimension corruption

**Severity: P1**
**File:** `.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:38-48`

The `embedding_cache` table defines `PRIMARY KEY (content_hash, model_id)`. The `storeEmbedding()` function uses `INSERT OR REPLACE` (line 128), which replaces an existing `(content_hash, model_id)` entry regardless of the `dimensions` value. If a model ID is reused with a different dimension count (e.g., A/B model testing, silent provider config change), a store call with the new dimension will silently overwrite the correctly-dimensioned cached embedding. The `lookupEmbedding()` dimension filter protects reads, but the corrupt entry remains in the cache and blocks future correct-dimension lookups until eviction.

**Fix:** Add `dimensions` to the primary key: `PRIMARY KEY (content_hash, model_id, dimensions)`. This requires a schema migration to drop and recreate the table or add a unique index, and `INSERT OR REPLACE` will then correctly handle dimension mismatches as distinct entries.

### P1-033-B — Content-hash dedup check runs outside the write transaction (TOCTOU window)

**Severity: P1**
**File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:671-681`

The comment at line 671 acknowledges that `checkContentHashDedup` runs outside the `writeTransaction` for performance reasons ("reads are safe outside the transaction"). However, without a unique index on `content_hash` in `memory_index`, two concurrent saves of identical content can both pass the dedup check before either acquires the write lock. The `writeTransaction.immediate()` at line 737 serializes DB writes across processes via SQLite's write-ahead-lock, but the dedup read is not covered. If `memory_index` has a unique constraint on `content_hash`, the second writer gets an SQLite constraint error inside the transaction, which is caught and handled. If not, a duplicate row is silently inserted.

**Fix:** Confirm that `memory_index.content_hash` has a unique constraint (or add one with `WHERE content_hash IS NOT NULL`), OR move `checkContentHashDedup` inside the `writeTransaction` body, accepting the minor performance cost of running under the write lock.

### P2-033-C — `forceAllChannels` in hybridSearchEnhanced populates full channel set before mask is applied

**Severity: P2**
**File:** `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:849-857`

```ts
const activeChannels = options.forceAllChannels
  ? new Set<ChannelName>(allPossibleChannels)
  : new Set<ChannelName>(routeResult.channels);

const allowedChannels = getAllowedChannels(options);
for (const channel of allPossibleChannels) {
  if (!allowedChannels.has(channel)) activeChannels.delete(channel);
}
```

The `forceAllChannels` branch fills `activeChannels` with all 5 channels, then the mask loop removes the disallowed ones. This is functionally correct but the intent is obscured — it reads as "enable everything then restrict," which makes it harder to verify at a glance that disabled channels are truly blocked. A future maintainer changing the mask loop could easily break the invariant.

**Fix:** Change to `new Set<ChannelName>(getAllowedChannels(options))` when `forceAllChannels` is true, so the channel set starts from the allowed set rather than the full set.

### P2-033-D — Safe-swap orphan chunks lack recovery mechanism

**Severity: P2**
**File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:329-342`

When `useSafeSwap` is true during re-chunking, child records are inserted with `parent_id = NULL`. If the process crashes before the parent-swap finalization step, these NULL-parent children become permanent orphans in `memory_index`. They consume storage, are included in BM25 index results (since BM25 rebuild reads all non-archived rows without filtering by `parent_id IS NOT NULL`), and cannot be garbage-collected by parent-cascade DELETE.

**Fix:** Add a startup or maintenance-mode query to detect and clean up NULL-parent chunk rows: identify rows where `chunk_index IS NOT NULL AND parent_id IS NULL AND embedding_status IN ('success', 'pending')` and either assign them to their parent (if recoverable by `file_path` match) or delete them.

### P2-033-E — BM25 in-memory index can contain archived documents between restarts

**Severity: P2**
**File:** `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:354-383`

`rebuildFromDatabase()` correctly filters `WHERE COALESCE(is_archived, 0) = 0`. However, `addDocument()` has no archive check. When `memory-save.ts` or the ingest path calls `bm25.addDocument()` for a record that is simultaneously being archived, the in-memory index is updated with the archived content and will continue returning it until the next server restart (which triggers a fresh rebuild). Queries against the BM25 index can therefore surface archived content within the same server session.

**Fix:** Before calling `bm25.addDocument()` in the save/ingest paths, check that the memory's `is_archived` flag is 0. Alternatively, add an `archiveDocument(id)` helper that calls `removeDocument(id)` and call it when archiving a memory.
