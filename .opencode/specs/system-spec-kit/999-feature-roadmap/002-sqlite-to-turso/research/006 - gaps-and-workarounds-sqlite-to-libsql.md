# Gaps & Workarounds: SQLite-to-libSQL Migration for Spec Kit Memory MCP Server

> **Type:** Research / Gap Catalog
> **Date:** 2026-03-05
> **Spec:** 024-sqlite-to-turso
> **Companion:** `004 - analysis-sqlite-to-libsql-migration.md`

---

## Overview

This document catalogs every gap between `better-sqlite3` and the `libsql` sync package (v0.6.0-pre.29) as it affects the Spec Kit Memory MCP server. Each gap includes severity, affected files, current code pattern, what breaks, workarounds with code examples, and effort estimates.

**Severity scale:**
- **CRITICAL** — Blocks the migration entirely; no viable workaround
- **HIGH** — Breaks production functionality; workaround exists but requires significant effort
- **MEDIUM** — Requires code changes but has straightforward workarounds
- **LOW** — Minimal impact; trivial fix or no production usage
- **NONE** — No gap exists (included for completeness where expected)

---

## Gap 1: FTS5 Not Bundled in `libsql` npm Package

**Severity:** CRITICAL
**GitHub:** [#1930](https://github.com/tursodatabase/libsql/issues/1930) (open since January 2025)

**Affects:**
- `vector-index-schema.ts:1195-1198` — FTS5 virtual table creation
- `vector-index-schema.ts:1202-1223` — FTS5 sync triggers (insert/update/delete)
- `sqlite-fts.ts:89-90` — BM25 weighted search query
- `sqlite-fts.ts:101` — FTS5 query execution

**Current pattern:**
```sql
-- vector-index-schema.ts:1195-1198
CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
  title, trigger_phrases, file_path, content_text,
  content='memory_index', content_rowid='id'
)
```

**What breaks:** If FTS5 is not compiled into the `libsql` prebuilt binary, `CREATE VIRTUAL TABLE ... USING fts5(...)` will fail with `unknown tokenizer: fts5` or similar. The entire BM25 search channel — one of five in the hybrid search pipeline — would be non-functional. Since FTS5 is the primary text search mechanism, this effectively blocks the migration.

**Workarounds:**

**W1a: Empirical gate test (RECOMMENDED — P0)**
- Effort: 2-4 hours
- Install `libsql`, create an FTS5 table, insert data, query with `bm25()`. If it works, the gap is a non-issue. This must be done before any other migration work.

**W1b: Build libSQL from source with FTS5 enabled**
- Effort: 2-5 days + ongoing maintenance
- Clone the `libsql` repo, modify build flags to include FTS5, compile. Produces an unsupported custom build that must be rebuilt for each libSQL update.
- NOT RECOMMENDED — creates a maintenance burden that defeats the purpose of using a maintained package.

**W1c: Dual-database architecture**
- Effort: 3-5 days
- Keep a separate better-sqlite3 instance for FTS5-only operations. Requires transactional coordination between two databases, duplicated schema management, and complex connection handling.
- NOT RECOMMENDED — adds unacceptable architectural complexity.

**W1d: Wait for resolution**
- Effort: 0 (no migration)
- Monitor GitHub #1930 for a fix. Stay on better-sqlite3 and build the DatabaseAdapter abstraction (doc 002 §3) in the meantime.

---

## Gap 2: FTS5 Parameterized Insert Panic

**Severity:** HIGH
**GitHub:** [#1811](https://github.com/tursodatabase/libsql/issues/1811)

**Affects:**
- `vector-index-schema.ts:1202-1207` — FTS5 insert trigger
- `vector-index-schema.ts:1209-1216` — FTS5 update trigger (uses INSERT for the "new" row)
- Any code path that inserts or updates `memory_index` rows (which fires the FTS5 sync triggers)

**Current pattern:**
```sql
-- vector-index-schema.ts:1203-1206 (trigger body)
CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
  INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
  VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
END
```

**What breaks:** The `@libsql/client` (async package) crashes with a panic when executing parameterized INSERT statements on FTS5 tables. Both `libsql` (sync) and `@libsql/client` (async) share the same `libsql-js` Rust FFI backend. The trigger-based inserts use `new.column` references (not parameterized), but the shared backend panic may still be triggered depending on how the Rust layer processes the statement.

**Workarounds:**

**W2a: Include in gate test (RECOMMENDED)**
- Effort: Included in P0 (2-4 hours)
- The P0 gate test must specifically insert rows into the base `memory_index` table and verify that the FTS5 sync triggers fire without panic. If the trigger path works (since triggers use `new.column` references, not `?` parameters), this gap may not apply.

**W2b: Direct FTS5 population (bypass triggers)**
- Effort: 2-4 hours
- Replace trigger-based FTS5 sync with explicit application-level INSERT/DELETE on `memory_fts` after each `memory_index` mutation. Requires modifying every INSERT/UPDATE/DELETE call site that touches `memory_index`.

**W2c: Batch FTS5 rebuild**
- Effort: 4-8 hours
- Instead of real-time triggers, periodically rebuild the FTS5 index from `memory_index` data. Acceptable for our single-user workload but introduces search staleness between rebuilds.

---

## Gap 3: No `.pragma()` Method

**Severity:** MEDIUM

**Affects:**
- `vector-index-store.ts:520-526` — 7 PRAGMA calls (WAL, busy_timeout, foreign_keys, cache_size, mmap_size, synchronous, temp_store)
- `context-server.ts:735,738` — 2 PRAGMA calls (journal_mode check and set)
- `schema-downgrade.ts:269,304` — 2 PRAGMA calls (foreign_keys OFF/ON)
- `eval-db.ts:131-132` — 2 PRAGMA calls (journal_mode, foreign_keys)
- ~15 test files with PRAGMA assertions

**Current pattern:**
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

**What breaks:** The `libsql` sync package does not expose a `.pragma()` method. Calling `db.pragma(...)` will throw `TypeError: db.pragma is not a function`.

**Workarounds:**

**W3a: Replace with `.exec('PRAGMA ...')` (RECOMMENDED)**
- Effort: 30-45 minutes
- Change all 13 production call sites from `db.pragma('key = value')` to `db.exec('PRAGMA key = value')`.

```typescript
// Before
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// After
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');
```

**W3b: PRAGMA wrapper utility**
- Effort: 30 minutes (once) + same per-site changes
- Create a `setPragma(db, expr)` function used project-wide. Centralizes the pattern for future maintainability.

```typescript
function setPragma(db: Database, pragma: string): void {
  db.exec(`PRAGMA ${pragma}`);
}
// Usage:
setPragma(db, 'journal_mode = WAL');
```

**W3c: PRAGMA read pattern for context-server.ts**
- Effort: 5 minutes (specific to the read-then-set pattern)
- `context-server.ts:735` reads PRAGMA journal_mode with `.prepare('PRAGMA journal_mode').get()` — this pattern works in libSQL since it uses `.prepare()` rather than `.pragma()`.

---

## Gap 4: Read Performance 5-20x Slower

**Severity:** HIGH

**Affects:** All database read operations system-wide — all 23 MCP tools, all 5 search channels, all schema queries.

**Current pattern:** better-sqlite3 at 1,200,000 SELECT ops/s (SQG benchmark).

**What breaks:** The `libsql` sync package achieves ~61,000 SELECT ops/s — a 20x regression. This is caused by the FFI bridge between Node.js and the libSQL Rust/C backend, versus better-sqlite3's direct N-API binding to SQLite.

**Workarounds:**

**W4a: Benchmark at actual workloads (RECOMMENDED — P1)**
- Effort: 1 day
- Run the production search pipeline against both drivers. The synthetic benchmark may overstate the impact because: (a) embedding generation dominates latency (~50-200ms vs 1-5ms DB time), (b) single-user workload means throughput is irrelevant, (c) small dataset (~2,000 memories) means even brute-force is fast.

**W4b: Acceptance threshold**
- If total pipeline latency regresses <50%, accept the trade-off for the benefits (native vectors, future Turso path).
- If >50% regression, consider staying on better-sqlite3 until `libsql` FFI performance improves.

**W4c: Query optimization**
- Effort: 1-2 days (if needed)
- Reduce query count per pipeline run. Pre-compute aggregates. Use `UNION ALL` to combine channel queries. Cache frequent lookups.

**W4d: Connection pooling / prepare caching**
- Effort: 2-4 hours
- Verify that libSQL's prepared statement caching matches better-sqlite3. Pre-warm frequently used statements at startup.

---

## Gap 5: `Database.Statement` Type Compatibility

**Severity:** MEDIUM

**Affects:**
- `sqlite-fts.ts:101` — `(db.prepare(sql) as Database.Statement).all(...params)`
- ~19 additional sites using `Database.Statement` type casts across search, storage, and eval modules

**Current pattern:**
```typescript
// sqlite-fts.ts:101
const rows = (db.prepare(sql) as Database.Statement).all(
  ...params
) as Array<Record<string, unknown>>;
```

**What breaks:** `Database.Statement` refers to the better-sqlite3 type. The `libsql` package exports its own `Statement` type with a compatible runtime API but different TypeScript type identity. TypeScript will report type errors at compile time.

**Workarounds:**

**W5a: Update type imports (RECOMMENDED)**
- Effort: 1-2 hours
- Change type casts from `as Database.Statement` to the libsql equivalent, or remove unnecessary casts where TypeScript can infer the type from `db.prepare()`.

**W5b: Type alias bridge**
- Effort: 30 minutes
- Create a shared type alias that works with both drivers:

```typescript
// types/database.ts
import Database from 'libsql'; // or 'better-sqlite3'
type Statement = ReturnType<Database['prepare']>;
```

**W5c: Remove casts entirely**
- Effort: 1-4 hours
- Many `as Database.Statement` casts may be unnecessary if `db.prepare()` returns a compatible type. Remove casts and let TypeScript infer.

---

## Gap 6: No `.pluck()` Method

**Severity:** LOW

**Affects:** No production code.

**Current pattern:** `.pluck()` is a better-sqlite3 convenience that returns only the first column value instead of a row object.

**What breaks:** Nothing in production. Grep across 150+ source files confirms zero `.pluck()` usage.

**Workarounds:** None needed. If future code requires pluck-like behavior, use destructuring:

```typescript
// Instead of: db.prepare('SELECT id FROM ...').pluck().all()
// Use: db.prepare('SELECT id FROM ...').all().map(r => r.id)
```

**Effort:** 0

---

## Gap 7: No `.backup()` / `.serialize()` Methods

**Severity:** LOW

**Affects:** No production code.

**Current pattern:** better-sqlite3's `.backup()` creates a hot backup; `.serialize()` returns the database as a Buffer.

**What breaks:** Nothing in production. Neither method is used in the codebase.

**Workarounds:** If needed in the future, use file-system copy (safe with WAL mode checkpoint) or the `VACUUM INTO` SQL command:

```typescript
db.exec(`VACUUM INTO '${backupPath}'`);
```

**Effort:** 0

---

## Gap 8: No `.function()` / `.aggregate()` Methods

**Severity:** LOW

**Affects:** No production code.

**Current pattern:** better-sqlite3's `.function()` registers custom SQL functions; `.aggregate()` registers custom aggregate functions.

**What breaks:** Nothing in production. Neither method is used in the codebase.

**Workarounds:** If needed in the future, libSQL supports custom functions through its extension API. For now, no action required.

**Effort:** 0

---

## Gap 9: Vector Function Name Difference

**Severity:** MEDIUM (but deferred to P3)

**Affects:**
- `vector-index-store.ts` — vector search query functions
- `vector-index-schema.ts:1176-1179` — vec0 virtual table definition

**Current pattern:**
```sql
-- Current (sqlite-vec)
SELECT rowid, distance FROM vec_memories
WHERE embedding MATCH ?
ORDER BY distance LIMIT 20;
```

**What breaks:** If migrating to libSQL native vectors (P3), the function name `vec_distance_cosine()` (sqlite-vec) must change to `vector_distance_cos()` (libSQL native). The `vec0` virtual table syntax also differs from the native `F32_BLOB(N)` column type.

**Workarounds:**

**W9a: Keep sqlite-vec during driver swap (RECOMMENDED for P2)**
- Effort: 0
- `loadExtension()` works in `libsql`. Keep `vec_memories` and `sqliteVec.load(db)` unchanged during the initial driver swap. Defer vector migration to P3.

**W9b: Native vector migration (P3)**
- Effort: 3-5 days
- Replace `vec0` with native `F32_BLOB(N)` column, replace `vec_distance_cosine()` with `vector_distance_cos()`, add DiskANN index.

```sql
-- Native libSQL vectors
ALTER TABLE memory_index ADD COLUMN embedding F32_BLOB(384);
CREATE INDEX idx_vec ON memory_index(libsql_vector_idx(embedding));

-- Query
SELECT id, vector_distance_cos(embedding, ?) AS distance
FROM memory_index
WHERE embedding IS NOT NULL
ORDER BY distance ASC LIMIT 20;
```

---

## Gap 10: `vec0` Virtual Table vs `F32_BLOB` Column Type

**Severity:** LOW/MEDIUM (deferred to P3)

**Affects:**
- `vector-index-schema.ts:1176-1179` — vec0 virtual table
- `vector-index-store.ts` — vector insert/query logic

**Current pattern:**
```sql
-- vector-index-schema.ts:1176-1179
CREATE VIRTUAL TABLE vec_memories USING vec0(
  embedding FLOAT[384]
)
```

**What breaks:** The `vec0` virtual table is a sqlite-vec construct. libSQL native vectors use `F32_BLOB(N)` as a regular column type on existing tables, not a separate virtual table. The data model and query pattern differ significantly.

**Workarounds:**

**W10a: Keep sqlite-vec (RECOMMENDED for P2)**
- Effort: 0
- Same as W9a — defer to P3.

**W10b: Dual-write migration (P3)**
- Effort: Included in Gap 9 P3 effort (3-5 days)
- During P3: add native column, dual-write to both `vec_memories` and native column, validate recall accuracy, then drop `vec_memories`.

---

## Gap 11: Prerelease Package Stability

**Severity:** MEDIUM

**Affects:** All code — the entire `libsql` dependency (v0.6.0-pre.29).

**Current pattern:** `better-sqlite3` at v12.6.2 — stable, battle-tested, 7M+ weekly downloads.

**What breaks:** Prerelease versions (`-pre.29`) may introduce breaking changes between updates. The `libsql` sync package has seen API surface changes between minor versions. Semver ranges (`^0.6.0-pre.29`) could pull incompatible updates.

**Workarounds:**

**W11a: Exact version pinning (RECOMMENDED)**
- Effort: 0 (standard practice)
- Pin exact version in `package.json` with no semver range:

```json
{
  "dependencies": {
    "libsql": "0.6.0-pre.29"
  }
}
```

**W11b: Keep better-sqlite3 as fallback**
- Effort: 0
- Retain `better-sqlite3` in `devDependencies` during transition. The DatabaseAdapter abstraction (doc 002 §3) enables quick rollback.

**W11c: Lock file enforcement**
- Effort: 0
- Ensure `package-lock.json` is committed and `npm ci` (not `npm install`) is used in CI/CD.

---

## Gap 12: `context-server.ts` PRAGMA Read Pattern

**Severity:** LOW

**Affects:**
- `context-server.ts:735` — `database.prepare('PRAGMA journal_mode').get()`

**Current pattern:**
```typescript
// context-server.ts:735
const walRow = database.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
```

**What breaks:** This pattern uses `.prepare().get()` — not `.pragma()` — to read the PRAGMA value. Since `.prepare()` is compatible in libSQL, this specific pattern **may work unchanged**. However, the return value shape could differ (libSQL may return `{ journal_mode: 'wal' }` or a different key name).

**Workarounds:**

**W12a: Verify return shape in gate test (RECOMMENDED)**
- Effort: 5 minutes (add to P0 gate test)
- Test `db.prepare('PRAGMA journal_mode').get()` in the gate test and verify the returned object has `journal_mode` as a key.

**W12b: Use `.exec()` for read pragmas**
- Effort: 5 minutes
- If the `.prepare().get()` pattern doesn't work, switch to:

```typescript
const result = db.exec('PRAGMA journal_mode');
// Parse result for journal_mode value
```

---

## Gap 13: `schema_version` Table (NO GAP)

**Severity:** NONE

**Affects:** `schema-downgrade.ts`, schema migration system.

**Current pattern:** The MCP server uses a custom `schema_version` table (not the SQLite `PRAGMA schema_version`):

```sql
INSERT OR REPLACE INTO schema_version (id, version, updated_at)
VALUES (1, ?, datetime('now'))
```

**What breaks:** Nothing. This is a regular table with standard SQL operations — fully compatible with libSQL. This was initially flagged as a potential gap due to the name similarity with `PRAGMA schema_version`, but the codebase uses a user-defined table, not the pragma.

**Effort:** 0

---

## Gap 14: BigInt `lastInsertRowid` Behavior

**Severity:** LOW

**Affects:** Any code using `result.lastInsertRowid` from `.run()` calls.

**Current pattern:**
```typescript
const result = db.prepare('INSERT INTO ...').run(...params);
const id = result.lastInsertRowid; // number in better-sqlite3
```

**What breaks:** better-sqlite3 returns `lastInsertRowid` as a JavaScript `number` (or `BigInt` if configured). The `libsql` package may return `BigInt` by default. Code that performs arithmetic or comparison with `lastInsertRowid` as a number could break if it receives a `BigInt`.

**Workarounds:**

**W14a: Test in gate test (RECOMMENDED)**
- Effort: 1 hour (add to P0 gate test)
- Insert a row, check `typeof result.lastInsertRowid`. If it's `bigint`, add `Number()` conversion at call sites.

**W14b: Number conversion wrapper**
- Effort: 30 minutes
- If BigInt is returned, wrap:

```typescript
const id = Number(result.lastInsertRowid);
```

**W14c: Check all `.run()` return value usage**
- Effort: 1 hour
- Grep for `lastInsertRowid` across the codebase to find all affected sites.

---

## Gap 15: Eval DB Separate PRAGMAs

**Severity:** LOW

**Affects:**
- `eval-db.ts:131-132` — 2 PRAGMA calls on the eval database

**Current pattern:**
```typescript
// eval-db.ts:131-132
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
```

**What breaks:** Same as Gap 3 — `.pragma()` is not available in `libsql`. The eval database is a secondary database separate from the main memory database.

**Workarounds:**

**W15a: Included in Gap 3 fix (RECOMMENDED)**
- Effort: Included in Gap 3 (30-45 min total)
- Apply the same `.exec('PRAGMA ...')` replacement as Gap 3.

```typescript
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');
```

---

## Summary Matrix

| # | Gap | Severity | Prod Usage | Effort | Workaround |
|---|-----|----------|------------|--------|------------|
| 1 | FTS5 not bundled (#1930) | CRITICAL | YES — BM25 search | 0 or blocking | Gate test (P0) |
| 2 | FTS5 parameterized panic (#1811) | HIGH | YES — triggers | Incl. in P0 | Gate test (P0) |
| 3 | No `.pragma()` method | MEDIUM | 13 call sites | 30-45 min | `.exec('PRAGMA ...')` |
| 4 | Read perf 5-20x slower | HIGH | All reads | 1 day benchmark | Benchmark (P1) |
| 5 | `Database.Statement` type | MEDIUM | ~20 casts | 1-2 hours | Update type imports |
| 6 | No `.pluck()` | LOW | 0 | 0 | N/A |
| 7 | No `.backup()`/`.serialize()` | LOW | 0 | 0 | N/A |
| 8 | No `.function()`/`.aggregate()` | LOW | 0 | 0 | N/A |
| 9 | Vector function names | MEDIUM | Deferred P3 | 0 initially | Keep sqlite-vec |
| 10 | vec0 vs F32_BLOB | LOW/MED | Deferred P3 | 0 initially | Keep sqlite-vec |
| 11 | Prerelease stability | MEDIUM | All code | 0 | Pin version |
| 12 | PRAGMA read pattern | LOW | 1 site | 5 min | Verify in gate test |
| 13 | schema_version table | NONE | N/A | 0 | No gap |
| 14 | BigInt lastInsertRowid | LOW | ~10 sites | 1 hour | Test + Number() |
| 15 | Eval DB pragmas | LOW | 2 sites | Incl. in #3 | Same as Gap 3 |

---

## Total Migration Effort Estimates

| Phase | Scope | Effort | Blocking? |
|-------|-------|--------|-----------|
| P0: FTS5 gate test | Gaps 1, 2, 12, 14 | 2-4 hours | YES — go/no-go |
| P1: Performance benchmark | Gap 4 | 1 day | YES — acceptance threshold |
| P2: Driver swap | Gaps 3, 5, 11, 15 | 1-2 days | No |
| P3: Native vectors (optional) | Gaps 9, 10 | 3-5 days | No |
| **Total (P0-P2)** | | **2.5-3.5 days** | |
| **Total (P0-P3)** | | **5.5-8.5 days** | |

---

## Key Insight

Only **2 potentially blocking gaps** (FTS5 bundling and FTS5 panic) and **1 serious concern** (read performance regression) stand between the current codebase and a working libSQL migration. The remaining 12 gaps are either mechanical (pragma replacement, type updates), unused in production (pluck, backup, function, aggregate), or deferred to a later phase (native vectors).

The entire migration hinges on one empirical test: **does the `libsql` npm package support FTS5?** A 2-4 hour gate test answers this question and determines whether Path A (full migration) or Path C (stay on SQLite, adapter only) is the correct path forward.

---

*Gap analysis based on: libSQL `libsql` v0.6.0-pre.29, better-sqlite3 v12.6.2, GitHub issues #1930 and #1811, SQG benchmark data, MCP server @spec-kit/mcp-server v1.7.2 full source audit (95+ files, 936 prepared statements, 13 PRAGMA sites). Companion: doc 004 (libSQL analysis), doc 005 (recommendations).*
