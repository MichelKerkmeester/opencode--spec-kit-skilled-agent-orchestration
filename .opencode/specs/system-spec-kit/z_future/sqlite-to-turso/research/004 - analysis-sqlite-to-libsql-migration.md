# Technical Analysis: SQLite-to-libSQL Migration for Spec Kit Memory MCP Server

> **Type:** Research / Technical Analysis
> **Date:** 2026-03-05
> **Spec:** 024-sqlite-to-turso
> **Status:** Complete
> **Companion:** `001 - analysis-sqlite-to-turso-migration.md` (Turso Database analysis)

---

## 1. Executive Summary

libSQL is a C-language fork of SQLite maintained by Turso — distinct from both the Turso Database Rust rewrite (analyzed in doc 001) and Turso Cloud (the SaaS offering). As a fork rather than a rewrite, libSQL retains near-complete SQLite compatibility while adding native vector operations (F32_BLOB with DiskANN indexing), embedded replica sync, and encryption at rest.

Three npm packages provide JavaScript access to libSQL: **`libsql`** (synchronous, better-sqlite3-compatible, v0.6.0-pre.29), **`@libsql/client`** (fully async, different API, v0.17.0), and **`@tursodatabase/database`** (beta, Turso Database SDK). For this migration, the `libsql` sync package is the recommended target — its API mirrors better-sqlite3's `.prepare().get()/.all()/.run()` pattern, making it a near-drop-in replacement requiring ~51 import changes and ~16 pragma call-site updates.

**The central finding is that libSQL is a viable intermediate migration target, but two critical uncertainties must be resolved empirically before committing:** (1) FTS5 may not be bundled in the `libsql` npm package (GitHub issue #1930, open since January 2025, no resolution), and (2) a known FTS5 parameterized insert panic exists in the shared Rust backend (GitHub issue #1811). Additionally, a 5-20x read performance regression versus better-sqlite3 has been documented in independent benchmarks (SQG: 1.2M vs 61K ops/s), though the impact on our MCP workload may be muted by embedding generation latency dominating the pipeline.

This analysis is the libSQL-specific companion to doc 001 (Turso Database analysis), implementing Path A from doc 002's recommendation: SQLite → libSQL → Turso.

---

## 2. System Architecture Overview

The Spec Kit Memory MCP server is a 29,000-line TypeScript system with 95+ files importing `better-sqlite3`, 936 prepared statements, and 13 PRAGMA call sites across production code. The database layer architecture is detailed in doc 001 §2; this section highlights the specific touchpoints relevant to a libSQL migration.

### Database Touchpoints

The migration surface is concentrated in these areas:

- **51 files** with `import Database from 'better-sqlite3'` — the primary driver import
- **936 prepared statements** using `db.prepare(sql).get()/.all()/.run()` — all synchronous, all compatible with `libsql`
- **13 PRAGMA calls** across 4 production files — `vector-index-store.ts:520-526` (7 pragmas), `context-server.ts:735,738` (2), `schema-downgrade.ts:269,304` (2), `eval-db.ts:131-132` (2)
- **1 extension load** — `sqliteVec.load(db)` at `vector-index-store.ts:511`
- **1 FTS5 virtual table** — `memory_fts` at `vector-index-schema.ts:1195-1198`
- **3 FTS5 sync triggers** — `vector-index-schema.ts:1202-1223`
- **1 vec0 virtual table** — `vec_memories` at `vector-index-schema.ts:1176-1179`
- **1 WITH RECURSIVE CTE** — `causal-boost.ts:119` (graph traversal)

The full search pipeline architecture (5-channel hybrid with RSF fusion, cross-encoder reranking, and FSRS-based state management) is documented in doc 001 §2-3.

---

## 3. libSQL Ecosystem — Three Packages

The libSQL JavaScript ecosystem consists of three distinct packages with different APIs, maturity levels, and use cases:

### `libsql` (Sync Package) — Recommended

- **Version:** v0.6.0-pre.29 (prerelease)
- **Weekly downloads:** ~100K
- **API:** Synchronous, mirrors better-sqlite3 — `prepare()`, `get()`, `all()`, `run()`, `iterate()`, `transaction()`, `exec()`, `loadExtension()`
- **Import:** `import Database from 'libsql'`
- **Key advantage:** Near-drop-in replacement for better-sqlite3. Same synchronous API surface. Supports `loadExtension()` for sqlite-vec.
- **Key gap:** No `.pragma()` method — must use `.exec('PRAGMA ...')` instead.

This is the only package suitable for our migration without rewriting the entire async call chain.

### `@libsql/client` (Async Package)

- **Version:** v0.17.0
- **Weekly downloads:** ~302K-732K
- **API:** Fully asynchronous — `execute()`, `batch()`, `transaction()`. No `prepare()`.
- **Import:** `import { createClient } from '@libsql/client'`
- **Key issue:** Completely different API surface. Would require rewriting every database call site to async. Known FTS5 parameterized insert panic (#1811).

**Not recommended** for this migration — the async paradigm shift would touch 80+ files and propagate `async/await` through every call chain.

### `@tursodatabase/database` (Beta)

- **Version:** Beta
- **API:** Turso Database SDK with sync compat mode
- **Status:** Targets the Turso Rust rewrite, not libSQL C fork.

**Not relevant** to this analysis — covered in doc 001.

---

## 4. API Compatibility Deep Dive

### Fully Compatible Methods

The following better-sqlite3 methods work identically in the `libsql` sync package, confirmed via documentation and agent testing:

| Method | Usage Count | Status |
|--------|-------------|--------|
| `prepare(sql)` | 936 statements | Compatible |
| `.get(...params)` | ~300 call sites | Compatible |
| `.all(...params)` | ~400 call sites | Compatible |
| `.run(...params)` | ~200 call sites | Compatible |
| `transaction(fn)` | ~30 call sites | Compatible |
| `exec(sql)` | ~50 call sites | Compatible |
| `loadExtension()` | 1 call site | Compatible |
| `.iterate()` | ~5 call sites | Compatible |

These methods cover **100% of our current synchronous database API usage**.

### Not Supported / Different

| Method | Usage Count | Impact | Workaround |
|--------|-------------|--------|------------|
| `.pragma(expr)` | 13 production + ~15 test | MEDIUM | `.exec('PRAGMA ...')` |
| `.function()` | 0 | NONE | N/A |
| `.aggregate()` | 0 | NONE | N/A |
| `.backup()` | 0 | NONE | File-system copy |
| `.serialize()` | 0 | NONE | N/A |
| `.pluck()` | 0 | NONE | N/A |
| `Database.Statement` type | ~20 cast sites | MEDIUM | Type alias or cast update |

The `.pragma()` gap is the only one affecting production code. All other missing methods are unused in our codebase (confirmed via grep across all 150+ source files).

### Type Compatibility

The `Database.Statement` type from better-sqlite3 is used in ~20 explicit type casts, e.g.:

```typescript
// sqlite-fts.ts:101
const rows = (db.prepare(sql) as Database.Statement).all(...params);
```

The `libsql` package exports its own `Statement` type. The cast pattern `as Database.Statement` will need updating to match the libsql type, or a type alias can bridge the gap:

```typescript
type Statement = ReturnType<Database['prepare']>;
```

---

## 5. Feature Comparison

### FTS5 Support — CRITICAL UNCERTAINTY

**Status:** FTS5 is supported in the libSQL C engine, but **may not be compiled into the `libsql` npm package**.

GitHub issue [#1930](https://github.com/tursodatabase/libsql/issues/1930) (opened January 2025, still open) reports that FTS5 virtual tables fail to create in the JavaScript binding. The issue has no official response or resolution. This is a **go/no-go gate** for the migration:

- **If FTS5 works:** The migration is mechanical — our `memory_fts` virtual table, BM25 queries, and sync triggers all operate unchanged.
- **If FTS5 is missing:** The migration is blocked. Options would be building from source with FTS5 enabled, or dual-database (libSQL for structured data + SQLite for FTS5) — neither is recommended.

**Additionally**, GitHub issue [#1811](https://github.com/tursodatabase/libsql/issues/1811) documents a **panic on parameterized FTS5 INSERT** operations. While this was reported against `@libsql/client` (the async package), both packages share the same Rust backend via the `libsql-js` FFI layer — meaning the bug may affect the sync package's trigger-based FTS5 sync path.

Our FTS5 usage:
```sql
-- vector-index-schema.ts:1195-1198 (FTS5 table creation)
CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
  title, trigger_phrases, file_path, content_text,
  content='memory_index', content_rowid='id'
)

-- sqlite-fts.ts:89-90 (BM25 weighted query)
SELECT m.*, -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
FROM memory_fts
JOIN memory_index m ON m.id = memory_fts.rowid
WHERE memory_fts MATCH ?
```

**Resolution:** A 2-4 hour gate test is required before any other migration work begins. Install `libsql`, create an FTS5 virtual table, insert via triggers, and query with `bm25()`.

### Vector Support — Native F32_BLOB with DiskANN

libSQL provides native vector operations that go **beyond** what sqlite-vec offers:

| Capability | sqlite-vec (current) | libSQL native |
|-----------|---------------------|---------------|
| Column type | `vec0` virtual table | `F32_BLOB(N)` column type |
| Index type | ANN (approximate) | DiskANN (approximate, indexed) |
| Distance functions | `vec_distance_cosine()` | `vector_distance_cos()` |
| Index creation | Automatic on virtual table | `CREATE INDEX ... (libsql_vector_idx(col))` |
| Embedded mode | Yes | Yes |
| Extension required | Yes (`sqlite-vec`) | No (built-in) |

**Key advantage:** DiskANN works in **embedded mode** — not just in libSQL Server. This means our single-process MCP server can use indexed vector search without running a separate server process.

Current sqlite-vec usage:
```typescript
// vector-index-store.ts:511 — extension loading
sqliteVec.load(db);

// vector-index-schema.ts:1176-1179 — vec0 virtual table
CREATE VIRTUAL TABLE vec_memories USING vec0(
  embedding FLOAT[${embedding_dim}]
)
```

The `loadExtension()` compatibility means we can **keep sqlite-vec during transition** and migrate to native vectors as a separate phase. The recommended path: keep `vec_memories` initially, then dual-write to both sqlite-vec and native F32_BLOB, then cut over.

### WITH RECURSIVE — Fully Supported

Unlike Turso Database (which lacks WITH RECURSIVE — see doc 001 §7), libSQL as a C fork of SQLite **fully supports WITH RECURSIVE CTEs**. Our `causal-boost.ts:119` graph traversal query works without modification:

```sql
WITH RECURSIVE causal_walk(origin_id, node_id, hop_distance, walk_score) AS (
  SELECT ce.source_id, ce.target_id, 1,
         (CASE WHEN ce.relation = 'supersedes' THEN 1.5
               WHEN ce.relation = 'contradicts' THEN 0.8
               ELSE 1.0 END * COALESCE(ce.strength, 1.0))
  FROM causal_edges ce
  WHERE ce.source_id IN (...)
  ...
)
```

This eliminates one of the three HIGH-severity gaps from doc 003 (Gap 6).

### Triggers — Fully Supported

All three FTS5 sync triggers (`vector-index-schema.ts:1202-1223`) operate unchanged in libSQL. Unlike Turso Database's MVCC restrictions, libSQL supports triggers in all transaction modes.

### Transactions — Fully Supported

The `db.transaction(fn)` pattern used in ~30 call sites works identically. libSQL supports BEGIN/COMMIT/ROLLBACK, savepoints, and nested transactions.

---

## 6. Performance Analysis

### SQG Benchmark Data

Independent benchmarks from the SQG (SQLite Query Generator) project show a significant read performance regression for the `libsql` sync package versus `better-sqlite3`:

| Operation | better-sqlite3 | libsql | Regression |
|-----------|----------------|--------|------------|
| SELECT (simple) | 1,200,000 ops/s | 61,000 ops/s | **~20x slower** |
| SELECT (indexed) | ~800,000 ops/s | ~45,000 ops/s | **~18x slower** |
| INSERT | ~150,000 ops/s | ~30,000 ops/s | **~5x slower** |
| Transaction batch | ~200,000 ops/s | ~50,000 ops/s | **~4x slower** |

The regression is attributed to the FFI (Foreign Function Interface) bridge between Node.js and the libSQL Rust/C backend. better-sqlite3 uses a direct N-API binding to SQLite, while `libsql` routes through a Rust FFI layer.

### Impact on MCP Server Workloads

The performance regression is real but its practical impact on our workload is likely **muted**:

1. **Embedding generation dominates latency.** A single `memory_context()` call generates an embedding via HuggingFace Transformers (~50-200ms), then runs the 4-stage search pipeline. Database queries typically complete in 1-5ms total. Even with a 20x regression, database time would be 20-100ms — still smaller than embedding generation.

2. **Single-user workload.** The MCP server handles one query at a time from one AI session. There is no concurrent query load. Throughput (ops/s) is less relevant than per-query latency.

3. **Small dataset.** Our working set is ~2,000 memories. Even brute-force operations complete quickly at this scale.

4. **Pipeline parallelism absorbs cost.** Stage 1 runs 5 search channels in parallel. Individual channel latency increases are partially hidden by parallel execution.

**However**, the regression must be benchmarked at our actual workloads before committing. A synthetic benchmark running the full `memory_context()` → `memory_search()` pipeline on the production database would provide definitive data. Estimated benchmarking effort: 1 day.

---

## 7. Production Readiness

### Adoption Evidence

- **GitHub:** 16,400+ stars for the libSQL project (not individual packages)
- **Production users:** Astro, Turso Cloud (which still runs libSQL, not the Turso Database Rust rewrite), Azion
- **Compliance:** SOC2, HIPAA certifications for Turso Cloud (which uses libSQL underneath)
- **Ecosystem:** Active maintenance, regular releases, dedicated documentation

### Maturity Concerns

- **Prerelease status:** The `libsql` sync package is at `v0.6.0-pre.29` — the `pre` tag indicates it has not reached a stable 1.0 release. Version pinning is essential.
- **FFI stability:** The Rust FFI bridge introduces a new failure surface compared to better-sqlite3's direct N-API binding. Crash behavior under FFI panics (like the FTS5 issue #1811) may be less graceful than native C segfaults.
- **Open critical issues:** FTS5 bundling (#1930) and FTS5 parameterized panic (#1811) are both open with no timeline for resolution.
- **Package churn:** The libSQL JavaScript ecosystem has seen significant API surface changes between minor versions. Lock files and version pinning are mandatory.

### Risk Mitigation

- Pin exact version in `package.json` (no semver ranges)
- Keep `better-sqlite3` as a fallback dependency during transition
- Gate on FTS5 availability test before any production changes
- Maintain the `DatabaseAdapter` abstraction from doc 002 §3 to enable quick rollback

---

## 8. Key Learnings

**FTS5 is the go/no-go gate.** The single most important finding is that FTS5 availability in the `libsql` npm package is uncertain (GitHub #1930). Our entire 5-channel search pipeline depends on FTS5 for the BM25 channel. A 2-4 hour empirical test — installing `libsql`, creating an FTS5 virtual table, and querying with `bm25()` — must precede all other migration work. Everything else in the migration is mechanical.

**Native vectors are the most compelling benefit.** libSQL's built-in F32_BLOB columns with DiskANN indexing offer indexed vector search without any C extension. This eliminates the `sqlite-vec` dependency (currently alpha-quality), reduces cross-platform build issues, and provides a production-grade vector index. The transition can be gradual: keep sqlite-vec initially, dual-write, then cut over.

**Performance must be benchmarked, not assumed.** The 5-20x read regression in synthetic benchmarks is concerning, but its actual impact depends on our specific query patterns, dataset size, and the dominance of embedding generation latency. A 1-day benchmark using the production pipeline would provide definitive data.

**The migration is wide but shallow.** 51 import changes, 13 pragma rewrites, and 0-20 type cast updates. No algorithm changes, no query rewrites (assuming FTS5 works), no async conversion. The `libsql` sync package was designed to be a better-sqlite3 drop-in, and it largely succeeds — with the `.pragma()` method being the primary API gap.

**WITH RECURSIVE support is a key differentiator.** Unlike Turso Database (doc 001 §7, doc 003 Gap 6), libSQL fully supports recursive CTEs. This means our `causal-boost.ts` graph traversal query works without modification, eliminating one of the three HIGH-severity gaps from the Turso analysis.

**The prerelease status demands caution.** The `v0.6.0-pre.29` version tag, open critical issues, and FFI stability concerns mean this migration should include: version pinning, a fallback path to better-sqlite3, comprehensive test suite execution against libsql, and a staged rollout.

---

*Analysis based on: libSQL (C fork), `libsql` npm package v0.6.0-pre.29, `@libsql/client` v0.17.0, GitHub issues #1930 and #1811, SQG benchmark data, MCP server @spec-kit/mcp-server v1.7.2, better-sqlite3 v12.6.2, sqlite-vec v0.1.7-alpha.2. Agent research: G1 (libSQL stepping stone), C1-C5 (Turso ecosystem). Companion: doc 001 (Turso Database analysis), doc 002 (recommendations), doc 003 (Turso gaps).*
