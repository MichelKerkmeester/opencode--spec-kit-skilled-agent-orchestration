# Recommendations: SQLite-to-Turso Migration for Spec Kit Memory MCP Server

> **Type:** Research / Actionable Recommendations
> **Date:** 2026-03-05
> **Spec:** 024-sqlite-to-turso
> **Companion:** `001 - analysis-sqlite-to-turso-migration.md`

---

## 1. Applicable Patterns

Despite Turso's premature production status, several of its design patterns are directly relevant to evolving the MCP server:

**Change Data Capture (CDC)** — Turso's `PRAGMA capture_data_changes_conn` provides automatic, transactional change tracking that could replace our hand-rolled trigger-based audit trail (`memory_history`, `memory_conflicts`, `memory_corrections`). CDC captures all DML operations without the fragility of manually maintained triggers, and the audit data participates in the same WAL transaction as the source mutation.

**Native vector operations** — When vector indexes arrive, Turso's built-in `vector_distance_cos()`, `vector_extract()`, and `vector_concat()` functions eliminate the need for the `sqlite-vec` C extension, reducing build complexity and cross-platform issues.

**Transactional FTS sync** — Turso's Tantivy-based FTS integrates index updates into database transactions automatically, eliminating the trigger-based FTS synchronization that can drift out of sync. This pattern is architecturally superior to FTS5's external content table model.

**Encryption at rest** — Currently absent from our system. Turso offers transparent encryption for the database file, including support for encrypted attached databases via URI parameters.

---

## 2. Integration Opportunities

**Turso MCP server complement** — Turso ships with a built-in MCP server mode (`tursodb --mcp-server`). Rather than replacing our specialized 23-tool MCP server, this could serve as a complementary raw-SQL access layer for debugging, ad-hoc queries, or administrative operations.

**Cloud sync for multi-device memory** — The `@tursodatabase/sync` protocol could enable the most-requested missing capability: accessing the memory database from multiple devices. Currently, the SQLite file is locked to one machine. Turso's sync engine could replicate the memory database across workstations with conflict resolution.

**CDC simplifying FTS sync** — Our current architecture maintains FTS5 sync via triggers that must be manually created and kept aligned with schema changes. CDC could provide a universal change stream that automatically feeds any downstream index (FTS, vector, graph) without per-table trigger maintenance.

---

## 3. Architecture Improvements

**Database Abstraction Layer (recommended regardless of migration)**

The single highest-value architectural change is creating a `DatabaseAdapter` interface that isolates the MCP server from direct `better-sqlite3` dependencies. This pays for itself independent of any Turso migration by improving testability, enabling experimentation, and reducing coupling.

```typescript
interface DatabaseAdapter {
  // Core operations (sync or async depending on implementation)
  prepare(sql: string): PreparedStatement;
  exec(sql: string): void;
  transaction<T>(fn: () => T): T;

  // Search-specific
  vectorSearch(embedding: Float32Array, options: VectorSearchOptions): SearchResult[];
  ftsSearch(query: string, options: FtsSearchOptions): SearchResult[];

  // Lifecycle
  close(): void;
  getPath(): string;
}
```

The abstraction should sit at the boundary between the search pipeline and the database, specifically wrapping `vector-index-store.ts` (the current singleton), `vector-index-queries.ts` (query execution), and `sqlite-fts.ts` (FTS operations). The pipeline stages (`stage1-candidate-gen.ts` through `stage4-filter.ts`) should call through this adapter rather than accessing `better-sqlite3` directly.

This enables swapping the backend from `better-sqlite3` to `@libsql/client` to `@tursodatabase/database` without modifying pipeline logic. The async/sync boundary can be handled at the adapter level using a synchronous wrapper for the current backend and native async for future backends.

---

## 4. Implementation Strategies — Prioritized

### P0: Database Abstraction Layer (Now)

**Scope:** ~500-800 LOC | **Risk:** Low | **Value:** High

Create the `DatabaseAdapter` interface and refactor `vector-index-store.ts` to implement it. This is a pure refactoring with no behavioral changes — all existing tests must continue to pass. The adapter wraps:
- `prepare()` / `exec()` / `transaction()` — Core SQL operations
- `vectorSearch()` — Abstracts sqlite-vec virtual table queries
- `ftsSearch()` — Abstracts FTS5 `bm25()` queries
- Extension loading — Currently `sqliteVec.load(db)`, future-proofed for built-in alternatives

### P1: Evaluate libSQL as Intermediate Target (Q2 2026)

**Scope:** Research + Proof of Concept | **Risk:** Medium | **Value:** Medium

libSQL retains FTS5 support and sqlite-vec compatibility while adding native vector functions. The `@libsql/client` npm package provides a `better-sqlite3`-compatible API with optional async mode. Key evaluation criteria:
- Does `@libsql/client` support synchronous mode (avoiding the async migration)?
- Can sqlite-vec load as an extension in libSQL?
- Are native libSQL vectors available alongside sqlite-vec for gradual migration?
- What's the performance overhead vs direct `better-sqlite3`?

### P2: Benchmark Turso Vectors vs sqlite-vec (When Vector Indexes Arrive)

**Scope:** Benchmarking | **Risk:** Low | **Value:** Conditional

When Turso ships vector indexing (on their published roadmap), benchmark against sqlite-vec's ANN at our working set sizes (1K, 5K, 10K, 50K memories with 384-dim embeddings). Key metrics: query latency (p50, p95, p99), index build time, memory footprint, and recall accuracy.

### P3: Full Migration Assessment (Turso 1.0)

**Scope:** Comprehensive evaluation | **Risk:** Medium | **Value:** High

Once Turso reaches 1.0 stability, re-evaluate with:
- Full FTS feature parity (column weights confirmed, query syntax validated)
- Vector indexes available and benchmarked
- Production stability track record established
- MVCC stable with trigger support

### P4: Hybrid Architecture — SQLite + LanceDB (Optional)

**Scope:** Architecture exploration | **Risk:** Medium | **Value:** Medium-High

If vector search performance becomes a bottleneck before Turso matures, the most promising hybrid is **SQLite + LanceDB**:
- SQLite for structured data, FTS5, metadata, FSRS scheduling — keep what works
- LanceDB for vector similarity search — the only embedded TypeScript vector DB with production adoption (Continue IDE, AnythingLLM)
- LanceDB includes Tantivy-based FTS and built-in hybrid search with reranking
- Zero infrastructure: both are embedded, in-process, file-based
- The `DatabaseAdapter` from P0 makes this composable

Other alternatives evaluated: Qdrant embedded (not available for Node.js — private beta only), ChromaDB (Python-only embedded, JS requires server), DuckDB VSS (experimental, OLAP-focused), Zvec/Alibaba (impressive but only 1 month old as of March 2026)

---

## 5. Risks

**Brute-force vector scaling** — Turso's `vector_distance_cos()` does full table scan. At our current ~2,000 memories, latency is likely 5-15ms (acceptable). At 10,000 memories, expect 50-100ms. At 50,000, the search pipeline's p95 latency would breach acceptable thresholds. Vector indexes are on Turso's roadmap but have no published timeline.

**Tantivy FTS weighted scoring** — Turso's `fts_score()` supports column weights, but only at index creation time via `WITH (weights = 'title=10.0,...')` — not at query time like FTS5's `bm25(table, w0, w1, w2, w3)`. If our system needs to vary weight profiles per query type (e.g., trigger-heavy vs. content-heavy search), we would need multiple FTS indexes, adding complexity. Additionally, Tantivy defaults to OR for multi-term queries (FTS5 defaults to AND), which would change search behavior.

**Beta stability** — Turso v0.5.0 (2026-03-04) explicitly warns against production use. Multiple data corruption bugs have been documented (ptrmap corruption PR #3894, async I/O ordering issue #772, MVCC version chain bug #4877), and Turso offers a $1,000 bug bounty for corruption bugs their testing misses. Turso Cloud experienced a data loss incident in January 2025 during AWS migration. No production users of the Rust rewrite (as opposed to libSQL) have been identified — even Turso Cloud still runs on libSQL.

**Async migration scope** — Converting from `better-sqlite3`'s synchronous API to Turso's async API affects every file that touches the database. This is not a localized change — `async` propagates up every call chain, potentially touching 80+ files and requiring changes to the pipeline orchestrator, all four stages, all storage modules, and the MCP tool handlers.

**Tantivy maintenance burden** — Unlike FTS5 which auto-maintains its index, Turso's Tantivy implementation uses `NoMergePolicy`, requiring manual `OPTIMIZE INDEX` operations to prevent query performance degradation from segment accumulation.

---

## 6. Code Patterns

### Adapter Pattern for vector-index-store.ts

The current singleton in `vector-index-store.ts:16-17`:
```typescript
import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
```

Would be wrapped by a `BetterSqliteAdapter` implementing `DatabaseAdapter`:
```typescript
class BetterSqliteAdapter implements DatabaseAdapter {
  private db: Database.Database;

  vectorSearch(embedding: Float32Array, options: VectorSearchOptions): SearchResult[] {
    // Delegates to current sqlite-vec virtual table query
    return this.db.prepare(`SELECT ... FROM vec_memories WHERE ...`).all(...);
  }

  ftsSearch(query: string, options: FtsSearchOptions): SearchResult[] {
    // Delegates to current FTS5 bm25() query
    return this.db.prepare(`SELECT ..., -bm25(memory_fts, 10, 5, 2, 1) ...`).all(...);
  }
}
```

Future `TursoAdapter` and `LibSqlAdapter` implementations would provide the same interface with backend-specific query translation.

### Async Wrapper for FTS

For gradual async migration, an intermediate adapter can wrap synchronous calls:
```typescript
class AsyncBetterSqliteAdapter implements AsyncDatabaseAdapter {
  async ftsSearch(query: string, options: FtsSearchOptions): Promise<SearchResult[]> {
    // Wrap sync call — zero overhead, enables interface compatibility
    return this.syncAdapter.ftsSearch(query, options);
  }
}
```

This allows pipeline stages to be converted to async one-at-a-time while maintaining backward compatibility.

---

## 7. Migration Pathways

### Path A: SQLite → libSQL → Turso (Recommended)

**Phase 1 (Now):** Create `DatabaseAdapter` abstraction. No backend changes.
**Phase 2 (Q2 2026):** Migrate to the `libsql` npm package (near-drop-in for `better-sqlite3`). Keep FTS5 and sqlite-vec. Main changes: replace `.pragma()` with `.exec('PRAGMA ...')`, ~120 import path changes. Estimated: 1-2 days.
**Phase 2.5 (Optional):** Migrate from sqlite-vec to libSQL's native vectors with DiskANN indexes. Estimated: 3-5 days.
**Phase 3 (Turso 1.0+):** Migrate from libSQL to Turso. Adopt CDC, Tantivy FTS, native vectors. Gain: full feature set with production stability.

**Risk:** Lowest. Each phase is independently valuable and reversible. libSQL maintains SQLite compatibility as a safety net.

### Path B: SQLite + LanceDB Hybrid

**Phase 1:** Create `DatabaseAdapter` with split backend — SQLite for structured data, LanceDB for vectors.
**Phase 2:** Optionally migrate structured storage to Turso/libSQL when stable, keeping LanceDB for vectors.

**Risk:** Medium. Adds operational complexity (two databases). Best if vector search performance is the primary bottleneck and Turso's vector index timeline is too uncertain.

### Path C: Stay on SQLite Until Turso 1.0

**Phase 1:** Create `DatabaseAdapter` (still valuable for testing/flexibility).
**Phase 2:** Wait for Turso 1.0 with vector indexes, stable FTS, and production track record.
**Phase 3:** Direct migration from SQLite to Turso.

**Risk:** Low but misses intermediate benefits. Appropriate if the current SQLite stack meets all needs and there's no urgency for cloud sync or CDC.

---

### Decision Matrix

| Criterion | Path A (libSQL) | Path B (Split DB) | Path C (Wait) |
|-----------|----------------|-------------------|---------------|
| Migration risk | Low (incremental) | Medium (dual DB) | Low (one-shot) |
| Time to first value | ~1-2 days (libsql swap) | ~1-2 weeks (adapter + LanceDB) | ~2-3 days (adapter only) |
| Cloud sync | Phase 2 | No | Phase 3 |
| Vector performance | Same as current | Improved (dedicated DB) | Same until Turso 1.0 |
| Operational complexity | Same | Higher (two DBs) | Same |
| Future flexibility | Highest | High | Medium |

**Recommendation:** Path A. The incremental approach via libSQL provides the safest migration path while delivering real value at each phase. The `DatabaseAdapter` abstraction (P0) should begin immediately as it benefits all three paths.

---

*Recommendations based on: Turso v0.5.0 COMPAT.md, Tantivy FTS architecture analysis, MCP server @spec-kit/mcp-server v1.7.2 codebase review.*
