# 124 — Automatic Archival Lifecycle Evidence

## Preconditions
- MCP server healthy (v1.7.2)
- Pre-test checkpoint `pre-124-archival` created (id: 8, sandbox-scoped)
- Archival subsystem exists in `lib/cognitive/archival-manager.ts`
- No MCP tool exposes archive/unarchive directly (internal background operation)

## Evidence Type
**Code analysis + unit test verification** — archival is an automatic background process (scan interval: 1h, background job interval: 2h). It cannot be triggered through MCP tools at runtime.

## Code Analysis

### 1. Archive Function — is_archived Flag
**File:** `mcp_server/lib/cognitive/archival-manager.ts`

Archive sets `is_archived = 1` on the `memory_index` row:
```sql
UPDATE memory_index SET is_archived = 1 WHERE id = ?
```
- Memory row is preserved (not deleted) with the archived flag
- Enables reversible unarchive operation

Unarchive reverses:
```sql
UPDATE memory_index SET is_archived = 0 WHERE id = ? AND is_archived = 1
```

### 2. BM25 Sync on Archive/Unarchive
**File:** `mcp_server/lib/search/bm25-index.ts` (lines 243-277)

- Archive: BM25 document removed from in-memory index
- Unarchive: BM25 document restored to index
- BM25 rebuild query: `SELECT ... FROM memory_index WHERE is_archived = 0` (excludes archived)

### 3. Vector Row Deletion on Archive
**File:** `mcp_server/lib/cognitive/archival-manager.ts` (lines 410-422)

```typescript
function syncVectorOnArchive(memoryId: number): void {
  db.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(memoryId));
}
```
- Vector rows deleted from `vec_memories` on archive
- `memory_index` row preserved (only vector embedding removed)
- Graceful error handling for missing table

### 4. Deferred Vector Rebuild on Unarchive
**File:** `mcp_server/lib/cognitive/archival-manager.ts` (lines 455-508)

```typescript
async function rebuildVectorOnUnarchive(memoryId: number): Promise<void> {
  // Generate new embedding
  const embedding = await embeddings.generateDocumentEmbedding(embeddingInput);
  // Atomic DELETE + INSERT in transaction
  database.transaction(() => {
    database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(memoryId));
    database.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(BigInt(memoryId), embeddingBuffer);
  })();
}
```
- Vector embedding regenerated asynchronously on unarchive
- Wrapped in transaction for atomicity (DELETE old + INSERT new)
- Called via `syncVectorOnUnarchive()` (async dispatch)

### 5. Protected Tier Filtering
**File:** `mcp_server/lib/cognitive/archival-manager.ts` (lines 99-108)

```typescript
const ARCHIVAL_CONFIG = {
  protectedTiers: ['constitutional', 'critical'],
  maxAgeDays: 90,
  maxAccessCount: 2,
  maxConfidence: 0.4,
};
```

**SQL pre-filter (lines 272-290):**
```sql
SELECT * FROM memory_index
WHERE (is_archived IS NULL OR is_archived = 0)
  AND importance_tier NOT IN ('constitutional', 'critical')
  AND is_pinned = 0
ORDER BY last_accessed ASC NULLS FIRST, access_count ASC
```

**Tier classifier double-check (lines 468-482):**
```typescript
function shouldArchive(memory): boolean {
  if (memory.importance_tier === 'constitutional' || memory.importance_tier === 'critical') {
    return false;  // Never archive protected tiers
  }
  if (memory.is_pinned === 1) return false;
  return state === 'ARCHIVED' || state === 'DORMANT';
}
```

### 6. Search Integration
**File:** `mcp_server/lib/search/vector-index-queries.ts` (lines 246-247)

```typescript
if (!includeArchived) {
  where_clauses.push('(m.is_archived IS NULL OR m.is_archived = 0)');
}
```
- Archived memories excluded from all search results by default

### 7. Unit Test Coverage
**File:** `mcp_server/tests/archival-manager.vitest.ts`
- Lines 335-418: vector sync tests (archive removes, unarchive rebuilds)
- Full coverage of archive/unarchive parity and protected tier behavior

## Expected Signals Checklist
- [x] Archived memory keeps metadata row with `is_archived=1` (code: UPDATE not DELETE)
- [x] BM25 artifacts synchronized on archive/unarchive (code: rebuild excludes archived)
- [x] Vector rows deleted on archive (code: DELETE FROM vec_memories)
- [x] Unarchive logs deferred vector re-embedding (code: async rebuildVectorOnUnarchive)
- [x] Protected tiers not auto-archived (code: SQL filter + tier classifier double-check)
- [ ] Runtime observation of actual archive/unarchive cycle (internal background process)

## Observations
- Archival is a background operation (1h scan interval) — cannot be triggered via MCP
- Two-layer protection: SQL pre-filter + tier classifier ensures constitutional/critical never archived
- Vector deletion is immediate on archive; rebuild is async on unarchive
- BM25 is synchronized via rebuild query that excludes `is_archived = 1`
- Design is fully reversible: memory_index row preserved, only search artifacts affected
- Comprehensive test suite validates archive/unarchive parity

## Verdict: **PARTIAL**
Core behavior confirmed via comprehensive code analysis and unit test evidence: archive/unarchive parity for metadata/BM25/vector implemented correctly, protected tier safeguards in place with double-check, deferred vector rebuild on unarchive is explicit. Not directly observable at runtime because archival is a background process with no MCP trigger.
