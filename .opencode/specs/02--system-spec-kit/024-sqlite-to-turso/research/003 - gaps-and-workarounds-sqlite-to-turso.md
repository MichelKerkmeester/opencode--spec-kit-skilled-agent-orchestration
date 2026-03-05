# Gaps & Workarounds: SQLite-to-Turso Migration

> **Type:** Research / Gap Analysis
> **Date:** 2026-03-05
> **Spec:** 024-sqlite-to-turso
> **Companion:** `001 - analysis`, `002 - recommendations`

---

## Overview

This document catalogs every identified gap between SQLite (our current stack) and Turso Database (v0.5.0 Beta), with concrete workarounds, code patterns, and effort estimates for each. Gaps are ranked by severity:

- **CRITICAL** — Blocks migration entirely until resolved
- **HIGH** — Significant rework required, but solvable
- **MEDIUM** — Behavioral change needing careful migration
- **LOW** — Minor inconvenience or cosmetic difference

---

## Gap 1: No Vector Indexes (Brute-Force Only)

**Severity:** CRITICAL at scale, LOW at current volume
**Affects:** `vector-index-store.ts`, `vector-index-queries.ts`, `hybrid-search.ts`, `stage1-candidate-gen.ts`

### Current Pattern

sqlite-vec provides the `vec_memories` virtual table with ANN (approximate nearest neighbor) search:

```sql
-- vector-index-schema.ts:1176-1179
CREATE VIRTUAL TABLE vec_memories USING vec0(
  embedding FLOAT[768]
)
```

Queries use the virtual table interface for indexed vector similarity search, returning results in sub-millisecond time at our working set of ~2,000 memories.

### What Breaks

Turso has no virtual table equivalent. It provides only scalar distance functions:
- `vector_distance_cos(x, y)` — cosine distance
- `vector_distance_l2(x, y)` — L2 distance

These require a **full table scan** on every query. No ANN index, no HNSW, no IVF. Vector indexing is on Turso's roadmap (listed at 20.9% of their 1.0 milestone) but has no published timeline.

### Workarounds

**W1a: Accept brute-force at current scale (~2,000 rows)**
At 384-dim with 2,000 rows, brute-force cosine distance completes in <10ms (agent C2 confirmed). This is acceptable for our current workload. Store vectors in a regular `BLOB` column:

```sql
-- Turso pattern
ALTER TABLE memory_index ADD COLUMN embedding BLOB;

SELECT id, vector_distance_cos(embedding, ?) AS distance
FROM memory_index
WHERE embedding IS NOT NULL
ORDER BY distance ASC
LIMIT 20;
```

Estimated effort: ~1 day to rewrite vector queries.

**W1b: Pre-filter to reduce scan space**
Use `spec_folder` filtering to cut scan space by 80%+:

```sql
SELECT id, vector_distance_cos(embedding, ?) AS distance
FROM memory_index
WHERE embedding IS NOT NULL
  AND spec_folder = ?
ORDER BY distance ASC
LIMIT 20;
```

This is a zero-cost optimization that we should apply regardless of backend.

**W1c: Use libSQL Server instead of Turso CLI**
libSQL Server already has **DiskANN** indexed vector search — `F32_BLOB(N)` columns with `libsql_vector_idx`. The `libsql` npm package supports this. This is the strongest workaround if ANN performance matters.

```sql
-- libSQL native vectors with DiskANN
CREATE TABLE memory_index (
  id INTEGER PRIMARY KEY,
  embedding F32_BLOB(768)
);
CREATE INDEX idx_vec ON memory_index(libsql_vector_idx(embedding));
```

Estimated effort: 3-5 days (includes testing DiskANN recall accuracy).

**W1d: External vector DB (LanceDB)**
Keep SQLite/Turso for structured data and use LanceDB for vector search. LanceDB is the only embedded TypeScript vector library with production adoption (Continue IDE, AnythingLLM). Includes hybrid FTS+vector search.

Estimated effort: 1-2 weeks (new dependency, adapter layer, dual-DB operations).

### Scaling Thresholds

| Memory Count | Brute-Force Latency | Acceptable? |
|-------------|-------------------|-------------|
| 2,000 | <10ms | Yes |
| 5,000 | ~15-25ms | Yes |
| 10,000 | ~50-100ms | Marginal |
| 50,000 | ~300-500ms | No |
| 100,000 | ~700ms+ | No |

---

## Gap 2: No FTS5 — Tantivy Replacement with Different Semantics

**Severity:** HIGH
**Affects:** `sqlite-fts.ts` (entire file), `vector-index-schema.ts:1194-1223`, `stage1-candidate-gen.ts`, `hybrid-search.ts`

### Current Pattern

FTS5 virtual table with external content and trigger-based sync:

```sql
-- vector-index-schema.ts:1195-1198
CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
  title, trigger_phrases, file_path, content_text,
  content='memory_index', content_rowid='id'
)
```

Query-time BM25 column weights:

```sql
-- sqlite-fts.ts:89-90
SELECT m.*, -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
FROM memory_fts
JOIN memory_index m ON m.id = memory_fts.rowid
WHERE memory_fts MATCH ?
```

Three sync triggers keep FTS in sync with `memory_index` (`vector-index-schema.ts:1202-1223`).

### What Breaks

1. **Different creation syntax:** `CREATE INDEX ... USING fts` instead of `CREATE VIRTUAL TABLE ... USING fts5`
2. **Index-time weights only:** `fts_score()` reads weights set at index creation, not at query time
3. **OR default:** Tantivy uses OR for multi-term queries; FTS5 uses AND. "memory search" returns different results
4. **No `snippet()`:** Only `fts_highlight()` is available (we use our own `extract_snippet()` so this is low-impact)
5. **No `bm25()` function:** Replaced by `fts_score(col1, col2, ..., query)`
6. **Manual optimization:** Tantivy uses `NoMergePolicy` — requires periodic `OPTIMIZE INDEX` to prevent segment accumulation

### Workarounds

**W2a: Translate FTS5 schema to Tantivy index**

```sql
-- Turso pattern
CREATE INDEX idx_memory_fts ON memory_index USING fts
  (title, trigger_phrases, file_path, content_text)
WITH (weights = 'title=10.0,trigger_phrases=5.0,file_path=2.0,content_text=1.0');
```

The weights match our FTS5 `bm25()` weights. Major advantage: **no sync triggers needed** — Tantivy is transactionally integrated. This eliminates the three manually-maintained triggers at `vector-index-schema.ts:1202-1223`.

**W2b: Rewrite queries to use `fts_match()` and `fts_score()`**

```sql
-- Current FTS5
SELECT m.*, -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
FROM memory_fts
JOIN memory_index m ON m.id = memory_fts.rowid
WHERE memory_fts MATCH ?

-- Turso Tantivy
SELECT m.*, fts_score(title, trigger_phrases, file_path, content_text, ?) AS fts_score
FROM memory_index m
WHERE fts_match(title, trigger_phrases, file_path, content_text, ?)
ORDER BY fts_score DESC
LIMIT ?
```

The `sqlite-fts.ts` file is only 151 lines — the rewrite is contained.

**W2c: Handle OR-default for multi-term queries**
Wrap query terms with AND explicitly using Tantivy's query syntax:

```typescript
// Force AND behavior to match FTS5
const tantivy_query = tokens.map(t => `+${t}`).join(' ');
// Or use quoted phrases: '"term1" AND "term2"'
```

**W2d: Multiple indexes for different weight profiles**
If we ever need query-time weight variation (e.g., trigger-heavy vs content-heavy search), create separate Tantivy indexes with different weight configurations. Currently, we use one weight profile, so this is hypothetical.

**W2e: Schedule periodic OPTIMIZE INDEX**
Add a maintenance task (e.g., on server startup or daily) to compact Tantivy segments:

```sql
OPTIMIZE INDEX idx_memory_fts;
```

Estimated effort: 2-3 days (rewrite `sqlite-fts.ts`, update schema, test scoring parity).

---

## Gap 3: `.pragma()` Method Not Available

**Severity:** HIGH
**Affects:** `vector-index-store.ts:520-526`, `context-server.ts:738`, `schema-downgrade.ts:269,304`, `eval-db.ts:131-132`, test files

### Current Pattern

```typescript
// vector-index-store.ts:520-526
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 10000');
db.pragma('foreign_keys = ON');
db.pragma('cache_size = -64000');
db.pragma('mmap_size = 268435456');
db.pragma('synchronous = NORMAL');
db.pragma('temp_store = MEMORY');
```

16+ `.pragma()` calls across production code and tests.

### What Breaks

Neither Turso's SDK nor the `libsql` npm package implements the `.pragma()` convenience method. It's simply not present on the API surface.

### Workaround

**W3a: Replace `.pragma()` with `.exec('PRAGMA ...')`**

```typescript
// Before
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// After
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');
```

This is a mechanical find-and-replace. The `libsql` npm package confirms this works identically.

Estimated effort: ~30 minutes (16 call sites in production, ~15 in tests).

---

## Gap 4: `loadExtension()` Not Implemented

**Severity:** CRITICAL (for sqlite-vec), N/A (for Turso native vectors)
**Affects:** `vector-index-store.ts:17` (`import * as sqliteVec from 'sqlite-vec'`)

### Current Pattern

```typescript
import * as sqliteVec from 'sqlite-vec';
// ... later in initialization:
sqliteVec.load(db);  // loads C extension
```

### What Breaks

Turso's `@tursodatabase/database` compat mode lists `loadExtension()` as **NOT IMPLEMENTED**. This means sqlite-vec cannot be loaded.

### Workarounds

**W4a: Not needed for Turso — vectors are built-in**
Turso has native `vector_distance_cos()`, `vector_extract()`, `vector_concat()`. No extension loading required. The trade-off is brute-force only (see Gap 1).

**W4b: Use `libsql` npm package instead**
The `libsql` package DOES support `loadExtension()`. sqlite-vec can be loaded during a transitional period:

```typescript
import Database from 'libsql';
const db = new Database('memory.db');
db.loadExtension('./sqlite-vec');  // works
```

This enables a phased migration: libsql + sqlite-vec first, then native vectors later.

Estimated effort: 0 if going directly to Turso native vectors; ~1 hour if using libsql as stepping stone.

---

## Gap 5: `function()` and `aggregate()` Not Implemented

**Severity:** LOW (we don't use them currently)
**Affects:** Potential future custom SQL functions

### Current Pattern

We do NOT currently use `db.function()` or `db.aggregate()` in the MCP server codebase (confirmed via grep). All scoring, normalization, and transformation happens in TypeScript.

### What Breaks

If we ever wanted to add custom SQL functions (e.g., a custom scoring function callable from SQL), this would not work with Turso's compat mode.

### Workaround

**W5a: Keep logic in TypeScript**
Continue the current pattern of performing all custom logic in application code rather than SQL UDFs. This is already our approach.

**W5b: Use Turso's built-in functions**
Turso bundles `sqlean-regexp`, UUID functions (v4, v7), and vector functions natively — covering the most common use cases for custom functions.

Estimated effort: 0 (no current usage).

---

## Gap 6: `WITH RECURSIVE` Not Supported

**Severity:** HIGH
**Affects:** `causal-boost.ts:119` (graph traversal)

### Current Pattern

```sql
-- causal-boost.ts:119-122
WITH RECURSIVE causal_walk(origin_id, node_id, hop_distance, walk_score) AS (
  SELECT ce.source_id, ce.target_id, 1,
         (CASE WHEN ce.relation = 'supersedes' THEN 1.5
               WHEN ce.relation = 'contradicts' THEN 0.8
  ...
```

This recursive CTE traverses the `causal_edges` graph up to `maxDepth` hops (default 3) to compute causal boost scores for the graph search channel.

### What Breaks

Turso's `COMPAT.md` explicitly states: **WITH clause — Partial (no RECURSIVE, no MATERIALIZED)**. The causal boost query will fail.

### Workarounds

**W6a: Unroll recursion into fixed-depth JOINs**
Since `maxDepth` is bounded (default 3, max 10), replace the recursive CTE with explicit self-joins:

```sql
-- Hop 1
SELECT ce1.source_id AS origin_id, ce1.target_id AS node_id, 1 AS hop, ...
FROM causal_edges ce1
WHERE ce1.source_id IN (?)
UNION ALL
-- Hop 2
SELECT ce1.source_id, ce2.target_id, 2, ...
FROM causal_edges ce1
JOIN causal_edges ce2 ON ce1.target_id = ce2.source_id
WHERE ce1.source_id IN (?)
UNION ALL
-- Hop 3
SELECT ce1.source_id, ce3.target_id, 3, ...
FROM causal_edges ce1
JOIN causal_edges ce2 ON ce1.target_id = ce2.source_id
JOIN causal_edges ce3 ON ce2.target_id = ce3.source_id
WHERE ce1.source_id IN (?)
```

Less elegant but functionally equivalent for bounded depths.

**W6b: Move traversal to TypeScript**
Fetch edges in one query, traverse in application code. This is actually simpler for bounded graphs:

```typescript
function causalWalk(db: Database, seedIds: number[], maxDepth: number) {
  const edges = db.prepare(`
    SELECT source_id, target_id, relation, strength
    FROM causal_edges
  `).all();

  const edgeMap = new Map<number, Edge[]>();
  for (const e of edges) {
    if (!edgeMap.has(e.source_id)) edgeMap.set(e.source_id, []);
    edgeMap.get(e.source_id)!.push(e);
  }

  // BFS traversal up to maxDepth
  const visited = new Set<number>();
  let frontier = seedIds;
  for (let hop = 0; hop < maxDepth; hop++) {
    const nextFrontier: number[] = [];
    for (const nodeId of frontier) {
      for (const edge of edgeMap.get(nodeId) || []) {
        if (!visited.has(edge.target_id)) {
          visited.add(edge.target_id);
          nextFrontier.push(edge.target_id);
        }
      }
    }
    frontier = nextFrontier;
  }
  return visited;
}
```

At our graph size (~hundreds of edges), loading all edges is negligible.

Estimated effort: 1-2 days (rewrite `causal-boost.ts`, test scoring equivalence).

---

## Gap 7: AUTOINCREMENT Incompatible with MVCC

**Severity:** MEDIUM (only if using MVCC)
**Affects:** 10+ tables across production code using `INTEGER PRIMARY KEY AUTOINCREMENT`

### Current Pattern

AUTOINCREMENT is used extensively:
- `memory_index` — primary memories table
- `causal_edges` — graph relationships
- `memory_history` — audit trail
- `weight_history`, `memory_corrections`, `learned_feedback_terms`, etc.

### What Breaks

Turso explicitly documents: **AUTOINCREMENT does not work under MVCC mode** (`BEGIN CONCURRENT`). Standard (non-MVCC) transactions are fine.

### Workaround

**W7a: Don't use MVCC mode**
MVCC is experimental in Turso and is opt-in via `BEGIN CONCURRENT`. Since we run a single-process server, standard transactions suffice. Simply avoid `BEGIN CONCURRENT`.

**W7b: Use UUIDs or ULIDs as primary keys**
If MVCC is ever needed, replace `INTEGER PRIMARY KEY AUTOINCREMENT` with application-generated IDs:

```sql
CREATE TABLE memory_index (
  id TEXT PRIMARY KEY DEFAULT (uuid_v7()),
  ...
);
```

Turso has built-in `uuid_v4()` and `uuid_v7()` functions. This is a schema-wide change with cascading impact on foreign keys.

Estimated effort: 0 if avoiding MVCC; 3-5 days if switching to UUIDs.

---

## Gap 8: Triggers Incompatible with MVCC

**Severity:** MEDIUM (only if using MVCC)
**Affects:** FTS sync triggers (`vector-index-schema.ts:1202-1223`), audit trail triggers

### Current Pattern

Three FTS5 sync triggers keep `memory_fts` aligned with `memory_index` on INSERT/UPDATE/DELETE.

### What Breaks

Same as Gap 7: triggers do not fire under `BEGIN CONCURRENT` (MVCC mode).

### Workaround

**W8a: Don't use MVCC mode** — same as W7a.

**W8b: Tantivy eliminates FTS sync triggers**
If using Turso's Tantivy FTS (Gap 2), the FTS index is transactionally integrated — no sync triggers are needed. This is actually an improvement: eliminates a class of bugs where triggers drift out of sync.

Estimated effort: 0 (avoid MVCC), or net negative effort (Tantivy removes trigger maintenance).

---

## Gap 9: VACUUM Not Supported

**Severity:** LOW
**Affects:** Database maintenance operations

### Current Pattern

No explicit `VACUUM` calls found in the MCP server codebase (confirmed via grep). SQLite databases grow and get fragmented over time without manual vacuuming.

### What Breaks

Turso's `COMPAT.md` marks VACUUM as unsupported. Cannot defragment the database file.

### Workaround

**W9a: Not currently needed**
We don't call VACUUM today, so nothing breaks immediately.

**W9b: Recreate database from backup**
If compaction is ever needed, export all data, create a fresh database, and reimport. Turso's checkpoint system could assist.

**W9c: Use Turso Cloud's managed storage**
Turso Cloud handles storage management automatically. Local database files may grow larger than optimal.

Estimated effort: 0 (no current usage).

---

## Gap 10: CDC Is Unstable/Preview

**Severity:** MEDIUM (for future adoption)
**Affects:** Future replacement of `memory_history`, `memory_conflicts`, `memory_corrections`

### Current Pattern

Audit trails use trigger-based tables:
- `memory_history` — tracks all changes
- `memory_conflicts` — records conflicting updates
- `memory_corrections` — tracks correction events

### What Breaks

CDC is enabled via `PRAGMA unstable_capture_data_changes_conn('full')` — the word "unstable" is literally in the API name. Issues:
- Before/after values are binary BLOBs requiring JSON helper functions to decode
- Schema evolution breaks historical record decoding (old BLOBs reference old schema)
- Cannot add custom metadata (session_id, reason) to change records
- 3x disk writes per UPDATE in "full" mode
- API may change without notice

### Workaround

**W10a: Keep current trigger-based audit trail**
Our hand-rolled triggers work reliably. No urgency to switch to CDC.

**W10b: Layer CDC on top when it stabilizes**
When CDC reaches stable status, it can complement (not replace) our triggers by providing:
- Gap detection: catch any DML that bypasses triggers
- Universal change stream for external consumers
- Point-in-time recovery assistance

**W10c: Write a CDC-to-structured-audit adapter**
When CDC stabilizes, build a translation layer that reads CDC BLOBs and writes structured records to our existing history tables.

Estimated effort: 0 now; 2-3 days when CDC stabilizes.

---

## Gap 11: `backup()` and `serialize()` Not Implemented

**Severity:** LOW
**Affects:** Potential future backup workflows

### Current Pattern

No `db.backup()` or `db.serialize()` calls in the codebase. Checkpoints use file-system copy operations (`checkpoints.ts`).

### What Breaks

Turso's compat mode doesn't implement these methods. The `libsql` npm package also omits `backup()`.

### Workaround

**W11a: Continue file-system copies**
Our checkpoint system already works via file-level operations. No change needed.

**W11b: Use Turso Cloud's managed backups**
If on Turso Cloud, backups are handled by the service.

Estimated effort: 0 (no current usage).

---

## Gap 12: `PRAGMA recursive_triggers` Not Supported

**Severity:** LOW
**Affects:** Potentially trigger chains if triggers fire other triggers

### Current Pattern

No explicit `PRAGMA recursive_triggers` call found in the codebase. Our triggers are flat (FTS sync triggers don't trigger other triggers).

### What Breaks

If a trigger on `memory_index` causes an INSERT that fires another trigger, the chain would not propagate without `recursive_triggers`. Currently not an issue since our triggers are one-level deep.

### Workaround

**W12a: No action needed**
Our trigger architecture is non-recursive.

Estimated effort: 0.

---

## Gap 13: Tantivy `NoMergePolicy` Maintenance Burden

**Severity:** MEDIUM
**Affects:** Long-running instances with frequent writes

### Current Pattern

FTS5 auto-maintains its index structures. No manual optimization needed.

### What Breaks

Tantivy uses `NoMergePolicy` in Turso, meaning index segments accumulate over time. Query performance degrades as segment count grows.

### Workaround

**W13a: Scheduled OPTIMIZE INDEX**

```typescript
// Run on server startup or daily
db.exec('OPTIMIZE INDEX idx_memory_fts');
```

Add to the initialization sequence in `vector-index-store.ts` or as a periodic maintenance task.

**W13b: Optimize after bulk operations**
After `memory_index_scan` (which may insert hundreds of records), run optimization:

```typescript
async function afterBulkInsert() {
  db.exec('OPTIMIZE INDEX idx_memory_fts');
}
```

Estimated effort: ~1 hour (add maintenance call).

---

## Gap 14: WINDOW Function Limitations

**Severity:** LOW
**Affects:** Future complex analytical queries

### Current Pattern

No WINDOW functions found in the current MCP server SQL queries (all windowing/ranking is done in TypeScript in the pipeline stages).

### What Breaks

Turso has limited frame definitions for WINDOW functions. `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` works, but advanced frames may not.

### Workaround

**W14a: Continue TypeScript-side ranking**
Our pipeline stages already handle all ranking, deduplication, and windowed operations in TypeScript. No SQL WINDOW functions needed.

Estimated effort: 0.

---

## Gap 15: FTS5 Parameterized Insert Bug (`libsql` only)

**Severity:** MEDIUM (if using `libsql` npm package)
**Affects:** FTS5 operations during libSQL intermediate migration

### Current Pattern

FTS5 content is synced via triggers using parameterized values (`new.title`, `new.trigger_phrases`, etc.).

### What Breaks

GitHub issue #1811 documents that the `libsql` TypeScript client crashes on parameterized FTS5 INSERT operations. This affects the trigger-based sync pattern.

### Workaround

**W15a: Use `libsql` npm package (sync API), not `@libsql/client`**
Agent G1 confirmed this is a `@libsql/client` (async) issue. The `libsql` npm package (sync, better-sqlite3-compatible) works correctly with FTS5 triggers.

**W15b: Test thoroughly before migration**
Run the full FTS5 test suite against the `libsql` package to verify trigger-based operations work before committing to the migration.

Estimated effort: ~2 hours (test suite validation).

---

## Gap 16: Sync-to-Async API Paradigm Shift

**Severity:** HIGH (for full Turso migration), MITIGATED (with compat mode or libsql)
**Affects:** Every file that calls `db.prepare().get()/.all()/.run()`

### Current Pattern

All database operations are synchronous:

```typescript
// Used throughout ~80 files
const rows = db.prepare(sql).all(...params);
const row = db.prepare(sql).get(...params);
db.prepare(sql).run(...params);
```

### What Breaks

Turso's native API (`@tursodatabase/database`) is async:

```typescript
const rows = await db.prepare(sql).all(...params);
```

Async propagates up every call chain — every caller must become `async`, every caller of callers, etc.

### Workarounds

**W16a: Use sync compat mode**
Turso's `@tursodatabase/database/compat` provides synchronous `.prepare().get()/.all()/.run()`:

```typescript
import { Database } from '@tursodatabase/database/compat';
const db = new Database('memory.db');
const rows = db.prepare(sql).all(...params);  // works synchronously
```

Caveat: internally runs an I/O loop synchronously (not truly native sync). Performance characteristics may differ.

**W16b: Use `libsql` npm package**
The `libsql` package is a **near-drop-in** replacement for `better-sqlite3` with native sync API:

```typescript
import Database from 'libsql';
const db = new Database('memory.db');
db.prepare(sql).all(...params);  // native sync, same API
```

All `.prepare().get()/.all()/.run()/.iterate()/.transaction()` work identically. Only `.pragma()` needs replacement (see Gap 3). This is the **lowest-effort path** (~120 import changes + 16 pragma replacements).

**W16c: Gradual async migration with adapter**
If going fully async, create an adapter interface and migrate callers incrementally:

```typescript
interface DatabaseAdapter {
  query<T>(sql: string, ...params: any[]): Promise<T[]>;
  queryOne<T>(sql: string, ...params: any[]): Promise<T | undefined>;
  execute(sql: string, ...params: any[]): Promise<void>;
}
```

Estimated effort: ~30 min (libsql swap) to ~2-3 weeks (full async migration).

---

## Summary Matrix

| # | Gap | Severity | Current Impact | Effort to Fix | Best Workaround |
|---|-----|----------|---------------|---------------|-----------------|
| 1 | No vector indexes | CRITICAL/LOW | None at 2K rows | 1 day (brute-force) / 3-5 days (DiskANN) | W1a (brute-force) or W1c (libSQL DiskANN) |
| 2 | No FTS5 (Tantivy) | HIGH | Full rewrite of FTS | 2-3 days | W2a + W2b (translate schema + queries) |
| 3 | No `.pragma()` | HIGH | 16+ call sites | 30 min | W3a (`.exec('PRAGMA ...')`) |
| 4 | No `loadExtension()` | CRITICAL/N/A | Blocks sqlite-vec | 0 (native vectors) | W4a (built-in) or W4b (libsql) |
| 5 | No `function()`/`aggregate()` | LOW | No usage | 0 | W5a (keep TypeScript) |
| 6 | No `WITH RECURSIVE` | HIGH | `causal-boost.ts:119` | 1-2 days | W6a (unrolled JOINs) or W6b (TypeScript BFS) |
| 7 | AUTOINCREMENT + MVCC | MEDIUM | None (avoid MVCC) | 0 | W7a (don't use MVCC) |
| 8 | Triggers + MVCC | MEDIUM | None (avoid MVCC) | 0 / negative | W8a or W8b (Tantivy removes triggers) |
| 9 | No VACUUM | LOW | No usage | 0 | W9a (not needed) |
| 10 | CDC unstable | MEDIUM | Future feature | 0 now | W10a (keep triggers) |
| 11 | No `backup()`/`serialize()` | LOW | No usage | 0 | W11a (file-system copies) |
| 12 | No `recursive_triggers` | LOW | No usage | 0 | W12a (non-recursive triggers) |
| 13 | Tantivy NoMergePolicy | MEDIUM | Ongoing maintenance | 1 hour | W13a (scheduled OPTIMIZE) |
| 14 | WINDOW function limits | LOW | No usage | 0 | W14a (TypeScript ranking) |
| 15 | libsql FTS5 param bug | MEDIUM | libSQL path only | 2 hours (testing) | W15a (use sync package) |
| 16 | Sync → async shift | HIGH/MITIGATED | Entire codebase | 30 min (libsql) | W16b (`libsql` drop-in) |

### Total Migration Effort Estimates

| Migration Path | Gaps to Address | Estimated Effort |
|---------------|----------------|-----------------|
| **SQLite → libsql** (recommended first step) | #3, #15, #16 | **1-2 days** |
| **SQLite → Turso (compat mode)** | #1, #2, #3, #4, #6, #13, #16 | **2-3 weeks** |
| **SQLite → Turso (full async)** | All HIGH/CRITICAL | **4-6 weeks** |

### Key Insight

Of the 16 gaps identified, **only 4 are truly blocking** (severity HIGH or CRITICAL with active code impact): vector indexes (#1 at scale), FTS5→Tantivy (#2), `WITH RECURSIVE` (#6), and the sync/async shift (#16). The rest are either unused features, avoidable via configuration (don't use MVCC), or have trivial workarounds.

The recommended libSQL intermediate path sidesteps ALL critical gaps except `.pragma()` replacement, which takes 30 minutes. This is why Path A (SQLite → libSQL → Turso) remains the lowest-risk migration strategy.

---

*Gap analysis based on: Turso v0.5.0 COMPAT.md, agent research (C1-C5, G1-G2), MCP server codebase review, libsql npm package documentation.*
