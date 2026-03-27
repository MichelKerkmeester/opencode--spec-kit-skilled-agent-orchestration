# Technical Analysis: SQLite-to-Turso Migration for Spec Kit Memory MCP Server

> **Type:** Research / Technical Analysis
> **Date:** 2026-03-05
> **Spec:** 024-sqlite-to-turso
> **Status:** Complete

---

## 1. Executive Summary

Turso Database (v0.5.0, Beta) is a complete Rust rewrite of SQLite — not a fork — offering native vector operations, Change Data Capture (CDC), Tantivy-based full-text search, encryption at rest, and a cloud sync protocol. For the Spec Kit Memory MCP server, which relies on a sophisticated 5-channel hybrid search pipeline backed by `better-sqlite3`, `sqlite-vec`, and FTS5, Turso presents both compelling future capabilities and critical near-term gaps.

**The central finding is that Turso is premature for this system's production use.** Three blockers stand out: (1) no vector indexes — Turso's `vector_distance_cos()` performs brute-force full-table scans (though libSQL Server already offers DiskANN); (2) no FTS5 — Turso replaces it with Tantivy, which supports per-column weights only at index creation time (not query time like FTS5's `bm25()`), and defaults to OR instead of AND for multi-term queries; (3) beta stability with known data corruption bugs and no published 1.0 roadmap.

**Important nuance:** There are three distinct products under the "Turso" brand: **Turso Database** (Rust rewrite, beta), **libSQL** (C fork of SQLite, production-ready), and **Turso Cloud** (GA SaaS). The Turso JS SDK (`@tursodatabase/database`) offers a sync compat mode that mirrors `better-sqlite3`'s API, partially mitigating the feared async migration burden.

**Recommendation:** Do not migrate to Turso Database now. Create a database abstraction layer to prepare for future flexibility. Evaluate libSQL (the `libsql` npm package) as a near-drop-in intermediate target in Q2 2026. Reassess Turso Database when vector indexes ship and the project approaches 1.0.

---

## 2. System Architecture Overview

The Spec Kit Memory MCP server (`@spec-kit/mcp-server` v1.7.2) is a production-grade semantic memory system exposing 23 tools via the Model Context Protocol. It comprises ~29,000 lines of TypeScript across 150+ files.

### Database Layer

The SQLite foundation consists of three tightly coupled components:

- **`better-sqlite3` v12.6.2** — Synchronous Node.js SQLite driver providing the core database connection. Every database operation uses the synchronous `.prepare(sql).get()/.run()/.all()` pattern (`vector-index-store.ts:16`, `sqlite-fts.ts:101`).
- **`sqlite-vec` v0.1.7-alpha.2** — Extension providing the `vec_memories` virtual table for approximate nearest neighbor (ANN) vector search with 384-dimensional embeddings (`vector-index-store.ts:17`).
- **FTS5** — SQLite's built-in full-text search extension, powering the `memory_fts` virtual table with weighted BM25 scoring (`sqlite-fts.ts:28`, weights: title=10.0, trigger_phrases=5.0, file_path=2.0, content_text=1.0).

### Schema Complexity

The database schema spans 21 migration versions (`vector-index-schema.ts:37`) encompassing:
- `memory_index` — Primary memory records (30+ columns including FSRS fields, quality scores, interference scores)
- `memory_fts` — FTS5 virtual table with 4 indexed columns
- `vec_memories` — sqlite-vec virtual table for vector embeddings
- `memory_history`, `memory_conflicts`, `memory_corrections` — Audit trail tables
- `causal_edges` — Graph relationships between memories
- `memory_summaries`, `memory_entities`, `entity_catalog` — Entity extraction tables
- `degree_snapshots`, `community_assignments` — Graph centrality tables
- `weight_history` — Search weight evolution tracking
- 40+ indexes for performance optimization

### Search Pipeline

The 4-stage retrieval pipeline (`pipeline/orchestrator.ts`) coordinates:

1. **Stage 1 — Candidate Generation** (`stage1-candidate-gen.ts`, 613 lines): Executes up to 5 search channels (vector, BM25, FTS5, graph, trigger) in parallel, injects constitutional memories, applies quality thresholds.
2. **Stage 2 — Fusion** (`stage2-fusion.ts`, 733 lines): Reciprocal Squared Frequency (RSF) fusion across channels with intent-adaptive weight selection.
3. **Stage 3 — Rerank** (`stage3-rerank.ts`, 619 lines): Cross-encoder reranking, MMR diversity, MPAB chunk aggregation.
4. **Stage 4 — Filter** (`stage4-filter.ts`, 334 lines): State filtering, deduplication, token budget enforcement.

---

## 3. Core Logic Flows

### Search Pipeline Flow

```
User Query → Embedding Generation → Stage 1 (5 channels)
  ├─ Vector: sqlite-vec ANN search on vec_memories
  ├─ FTS5:   bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) weighted search
  ├─ BM25:   In-memory BM25 index (bm25-index.ts, 363 lines)
  ├─ Graph:  Causal edge traversal (causal-edges.ts, 751 lines)
  └─ Trigger: Phrase matching (memory_match_triggers)
    ↓
Stage 2: RSF Fusion → Stage 3: Rerank → Stage 4: Filter → Results
```

### Flows That Break Under Turso

**Vector Search (BREAKING):** The `vectorSearch()` function in `vector-index-queries.ts` queries the `vec_memories` virtual table using sqlite-vec's ANN algorithm. Turso has no equivalent virtual table — it provides only `vector_distance_cos(x, y)` as a scalar function requiring a full table scan. For our ~2,000 indexed memories with 384-dimensional vectors, this means switching from O(log n) ANN search to O(n) brute-force on every query.

**FTS5 BM25 Search (BREAKING):** The FTS5 channel (`sqlite-fts.ts:62-114`) executes:
```sql
SELECT m.*, -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
FROM memory_fts
JOIN memory_index m ON m.id = memory_fts.rowid
WHERE memory_fts MATCH ?
```
Turso's Tantivy replacement uses `fts_score()` instead of `bm25()`, `CREATE INDEX ... USING fts` instead of FTS5 virtual tables, and critically, there is no documented support for per-column weight arguments. The `bm25(table, w0, w1, w2, w3)` signature that gives title matches 10x weight has no confirmed Tantivy equivalent.

**Synchronous API (MITIGATED):** Every database call uses better-sqlite3's synchronous API. A representative example from `sqlite-fts.ts:101`:
```typescript
const rows = (db.prepare(sql) as Database.Statement).all(...params);
```
Turso's `@tursodatabase/database` package is async by default, but provides a **sync compat mode** (`import { Database } from '@tursodatabase/database/compat'`) that mirrors better-sqlite3's API with identical `.prepare().get()/.all()/.run()` methods. However, the compat mode runs an internal I/O loop synchronously rather than being truly native sync, and critical features are NOT implemented: `loadExtension()`, `function()`, `aggregate()`, `backup()`, and `serialize()`. The `loadExtension()` gap means sqlite-vec cannot be loaded via the current pattern.

### Flows That Survive

- **Trigger matching** — Uses in-memory matching, no SQLite dependency
- **In-memory BM25** — The `bm25-index.ts` BM25 implementation is pure TypeScript
- **Graph traversal** — Standard SQL queries on `causal_edges` table
- **Schema migrations** — Standard DDL statements (CREATE TABLE, ALTER TABLE, CREATE INDEX)

---

## 4. Integration Mechanisms

### Driver Replacement

The primary integration point is `vector-index-store.ts`, which initializes the database singleton:
```typescript
import Database from 'better-sqlite3';        // Line 16
import * as sqliteVec from 'sqlite-vec';       // Line 17
```

Replacing `better-sqlite3` with `@tursodatabase/database` requires:
1. Changing every `Database.Statement` type annotation
2. Converting synchronous `.prepare().get()/.all()/.run()` to async equivalents
3. Replacing `sqliteVec.load(db)` extension loading with Turso's built-in vector functions
4. Updating transaction patterns from `db.exec('BEGIN')` to Turso's transaction API

### Extension Loading

sqlite-vec is loaded as a C extension at startup. Turso embeds vector operations natively — no extension loading needed. However, sqlite-vec's virtual table interface (`vec_memories`) has no Turso equivalent. The migration requires rewriting all vector queries to use `ORDER BY vector_distance_cos(stored_vec, ?) ASC LIMIT ?` instead of the virtual table's built-in filtering.

### Configuration

WAL mode (`PRAGMA journal_mode=wal`) is supported by Turso. `PRAGMA user_version` (used for schema versioning) is supported. However, `PRAGMA recursive_triggers` is not supported, which may affect FTS sync triggers if they use recursive patterns.

---

## 5. Design Patterns

### Patterns That Survive Migration

| Pattern | Location | Why It Survives |
|---------|----------|-----------------|
| Schema versioning via `user_version` | `vector-index-schema.ts:37` | PRAGMA user_version supported |
| File-system transaction manager | `transaction-manager.ts` | Uses fs operations, not SQL savepoints |
| In-memory BM25 index | `bm25-index.ts` | Pure TypeScript, no SQLite dependency |
| Embedding generation pipeline | `providers/embeddings.ts` | HuggingFace Transformers, external to DB |
| FSRS spaced repetition | `vector-index-store.ts:6-12` | Math computed in TypeScript |
| RSF fusion algorithm | `stage2-fusion.ts` | Pure scoring logic |

### Patterns That Break

| Pattern | Location | Why It Breaks |
|---------|----------|---------------|
| `db.prepare(sql).all()` sync calls | Entire codebase (~80 files) | Turso is async-first |
| `vec_memories` virtual table queries | `vector-index-queries.ts` | No ANN virtual table in Turso |
| `bm25(memory_fts, w0, w1, w2, w3)` | `sqlite-fts.ts:90` | Turso uses `fts_score()`, no column weights confirmed |
| FTS5 `memory_fts` virtual table | `vector-index-schema.ts` | Must replace with `CREATE INDEX ... USING fts` |
| `sqliteVec.load(db)` extension loading | `vector-index-store.ts:17` | Not applicable — vectors are built-in |

---

## 6. Technical Dependencies — Compatibility Matrix

| SQLite Feature | MCP Server Usage | Turso Status | Impact |
|----------------|-----------------|--------------|--------|
| **better-sqlite3 sync API** | Entire codebase (hundreds of `.prepare().get()/.run()/.all()` calls) | REPLACE with async `@tursodatabase/database` | **BREAKING** — touches 80+ files |
| **sqlite-vec ANN search** | `vec_memories` virtual table, 384-dim embeddings | REPLACE with brute-force `vector_distance_cos()` | **PERF REGRESSION** — O(n) vs O(log n) |
| **FTS5 + bm25() weights** | `memory_fts` virtual table, column weights [10, 5, 2, 1] | REPLACE with Tantivy `fts_score()` | **FEATURE GAP** — no column weights |
| **CREATE VIRTUAL TABLE** | `vec_memories`, `memory_fts` | Supported (different syntax for FTS) | **REWRITE** required |
| **Triggers** | FTS sync, audit trails | Supported (not under MVCC) | OK |
| **AUTOINCREMENT** | `memory_index`, `memory_history`, etc. | Supported (not under MVCC) | OK |
| **WAL mode** | Performance optimization | Supported | OK |
| **JSON functions** | `json_extract`, `json_array`, `json_group_array` | Fully supported | OK |
| **PRAGMA user_version** | Schema version tracking (v1-v21) | Supported | OK |
| **PRAGMA journal_mode** | WAL configuration | Supported | OK |
| **WITH clause (CTE)** | Some complex queries | Partial — no RECURSIVE, no MATERIALIZED | **RISK** — check all CTEs |
| **WINDOW functions** | Not heavily used | Partial — limited frame definitions | Low risk |
| **GENERATED columns** | Not used | Not supported | N/A |
| **Savepoints** | Not used (file-based tx manager) | Marked "No" in COMPAT.md (contradictory — changelog mentions named savepoints) | OK — we don't use them |
| **VACUUM** | Database maintenance | Not supported | **MINOR** — need alternative compaction |
| **RIGHT JOIN** | Not used | Not supported | N/A |
| **CROSS JOIN** | Not used | Not supported | N/A |
| **INDEXED BY** | Not used | Not supported | N/A |
| **Concurrent access** | Single-process server | Not supported (multi-process) | OK — single process |
| **PRAGMA recursive_triggers** | Possibly used for FTS sync | Not supported | **CHECK** — may affect trigger chains |

### Extension Compatibility

| Extension | Current | Turso | Notes |
|-----------|---------|-------|-------|
| sqlite-vec (ANN vectors) | v0.1.7-alpha.2 | Native vectors (brute-force only) | No indexed search |
| FTS5 | Built-in | Tantivy (different API) | `fts_score()` replaces `bm25()` |
| JSON1 | Built-in | Built-in | Full compatibility |
| regexp | Not used | Built-in (sqlean-regexp) | Available if needed |
| UUID | Not used | Built-in (v4, v7) | Available if needed |

---

## 7. Current Limitations of Turso

### Beta Stability (v0.5.0)

Turso's own README warns: *"This software is in BETA. It may still contain bugs and unexpected behavior. Use caution with production data and ensure you have backups."* The project is under extremely active development (daily commits, frequent breaking changes) with experimental features flagged for MVCC, encryption, incremental computation, and FTS.

### No Vector Indexes

The single most impactful limitation for our RAG system. Turso provides `vector_distance_cos()` and `vector_distance_l2()` as scalar functions, but these perform full table scans. The README explicitly lists **"Vector indexing for fast approximate vector search"** as a roadmap item. For our ~2,000 memories with 384-dim embeddings, brute-force may be acceptable now (~5-15ms estimate), but it won't scale. At 10,000 memories, expect 50-100ms per vector search. At 50,000, it becomes a serious bottleneck.

### No FTS5 (Tantivy Replacement)

Turso explicitly states: *"SQLite FTS3/FTS4/FTS5 — No. Use Turso FTS instead."* The Tantivy-based replacement uses different syntax:
- `CREATE INDEX idx USING fts(col1, col2)` instead of `CREATE VIRTUAL TABLE ... USING fts5(...)`
- `fts_score()` instead of `bm25(table, w0, w1, w2, w3)`
- `fts_match()` and `fts_highlight()` as helper functions

Agent research (C3) confirmed that `fts_score()` supports per-column weighting, but only at **index creation time**:
```sql
CREATE INDEX idx_memory_fts ON memory_index USING fts (title, trigger_phrases, file_path, content_text)
WITH (weights = 'title=10.0,trigger_phrases=5.0,file_path=2.0,content_text=1.0');
```
This is a significant architectural difference from FTS5's query-time `bm25(table, w0, w1, w2, w3)`. If different query types need different weight profiles (e.g., trigger-heavy vs. content-heavy), multiple FTS indexes would be required. Additionally, Tantivy defaults to OR for multi-term queries (FTS5 defaults to AND), which would change search behavior for all queries.

### MVCC Restrictions

Turso's `BEGIN CONCURRENT` (MVCC) is experimental. Triggers and AUTOINCREMENT are explicitly noted as not functioning under MVCC mode. Since our schema relies heavily on triggers for FTS synchronization and audit trails, MVCC mode is incompatible with our current architecture.

### Query Language Gaps

Several SQL features have partial or no support: `WITH RECURSIVE` (used by some graph traversal queries), `WINDOW` functions (limited frame definitions), `CROSS JOIN`, `RIGHT JOIN`, `VACUUM`, `REINDEX`. While most don't affect our codebase directly, `WITH RECURSIVE` could impact future graph traversal enhancements.

---

## 8. Key Learnings

**Turso is premature for production RAG systems.** The combination of brute-force-only vector search, no FTS5, and beta stability makes it unsuitable for a system that depends on all three. The MCP server's competitive advantage — its 5-channel hybrid search pipeline — would lose two of its most important channels (vector ANN + FTS5 BM25 weighted) in a migration.

**libSQL is a more pragmatic stepping stone.** libSQL (Turso's predecessor) retains FTS5 support, supports sqlite-vec extensions, and provides native vectors — potentially offering the best of both worlds during a transition period.

**The async paradigm shift is partially mitigated.** Turso's `@tursodatabase/database` offers a sync compat mode (`/compat` import path) that mirrors better-sqlite3's `.prepare().get()/.all()/.run()` API. However, the compat mode still lacks `loadExtension()`, `function()`, `aggregate()`, and `backup()` — meaning sqlite-vec cannot be loaded through the current pattern. For a full Turso migration, the async shift would still touch many files. But for an intermediate libSQL migration, the `libsql` npm package provides the same synchronous API with minimal breakage (mainly `pragma()` must become `exec('PRAGMA ...')`).

**CDC is the most compelling unique capability.** Turso's Change Data Capture (`turso_cdc` table, `PRAGMA capture_data_changes_conn`) could elegantly replace our hand-rolled trigger-based `memory_history` + `memory_conflicts` + `memory_corrections` tables, providing a more reliable and lower-maintenance audit trail.

**Cloud sync enables multi-device memory.** Currently, the MCP server's memory database is locked to a single machine. Turso's `@tursodatabase/sync` protocol could enable memory access across devices — a highly requested capability that is architecturally impossible with plain SQLite.

**The database abstraction layer pays for itself regardless.** Whether or not we ever migrate to Turso, creating a `DatabaseAdapter` interface that abstracts the sync/async boundary and the specific vector/FTS APIs would improve testability, enable gradual experimentation, and reduce coupling to any single database implementation.

---

*Analysis based on: Turso v0.5.0 (2026-03-04), COMPAT.md, MCP server @spec-kit/mcp-server v1.7.2, better-sqlite3 v12.6.2, sqlite-vec v0.1.7-alpha.2.*
