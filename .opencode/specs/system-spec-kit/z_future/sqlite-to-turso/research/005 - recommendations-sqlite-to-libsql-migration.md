# Recommendations: SQLite-to-libSQL Migration for Spec Kit Memory MCP Server

> **Type:** Research / Actionable Recommendations
> **Date:** 2026-03-05
> **Spec:** 024-sqlite-to-turso
> **Companion:** `004 - analysis-sqlite-to-libsql-migration.md`

---

## 1. Applicable Patterns

Several patterns from the libSQL ecosystem are directly applicable to evolving the MCP server, regardless of whether a full migration occurs:

**Native DiskANN vector indexing** — libSQL's F32_BLOB column type with `libsql_vector_idx` provides indexed approximate nearest neighbor search without any C extension. Unlike sqlite-vec's `vec0` virtual table (which is alpha-quality), DiskANN is maintained by the core libSQL team and works in embedded mode. This eliminates cross-platform build issues with native extensions.

**Embedded replica mode** — libSQL's `syncUrl` configuration enables a local SQLite file to sync with a remote libSQL Server. This could unlock multi-device memory access — the most frequently requested capability — while keeping the embedded, single-file architecture that makes our MCP server zero-config.

**Extension compatibility** — The `libsql` sync package's `loadExtension()` support means we can **keep sqlite-vec during transition**, test native vectors in parallel, and cut over only when validated. This dual-extension capability enables a risk-free migration path.

---

## 2. Integration Opportunities

**Drop-in driver replacement** — The `libsql` sync package mirrors better-sqlite3's API surface. The migration touches 51 import statements and 13 PRAGMA call sites — no algorithmic changes, no query rewrites (assuming FTS5 works). This is the most contained driver swap available in the libSQL ecosystem.

**Vector migration path** — A phased approach minimizes risk:
1. **Phase 1:** Swap driver, keep sqlite-vec via `loadExtension()` — zero vector code changes
2. **Phase 2:** Add native F32_BLOB column alongside `vec_memories`, dual-write embeddings to both
3. **Phase 3:** Validate DiskANN recall accuracy against sqlite-vec ANN, switch search queries
4. **Phase 4:** Drop sqlite-vec dependency and `vec_memories` virtual table

Each phase is independently deployable and reversible.

**Future Turso upgrade path** — Migrating to `libsql` now establishes the foundation for a future move to Turso Database (when it reaches 1.0). The `libsql` package already supports `syncUrl` for Turso Cloud connectivity. The progression SQLite → libSQL → Turso follows increasing capability with decreasing migration cost at each step.

---

## 3. Architecture Improvements

**DatabaseAdapter abstraction** — As recommended in doc 002 §3, creating a `DatabaseAdapter` interface remains the highest-value architectural change. For the libSQL migration specifically, the adapter should:

- Wrap the `.pragma()` gap with a `setPragma(key, value)` method that calls `.exec('PRAGMA ...')` on libSQL and `.pragma()` on better-sqlite3
- Provide a `loadVectorExtension()` method that abstracts sqlite-vec loading vs native vector availability
- Expose `supportsFeature(feature)` for runtime capability detection (FTS5, native vectors, DiskANN)

**PRAGMA wrapper utility** — The 13 production PRAGMA call sites follow a consistent pattern (`db.pragma('key = value')`). A thin utility function normalizes this:

```typescript
function setPragma(db: Database, pragma: string): void {
  // libsql: no .pragma() method
  db.exec(`PRAGMA ${pragma}`);
}
```

This utility can be applied independently of the full DatabaseAdapter, as a minimal first step.

---

## 4. Implementation Strategies — Prioritized

### P0 (Immediate): FTS5 Availability Gate Test

**Scope:** 2-4 hours | **Risk:** None | **Value:** Go/no-go decision

Install the `libsql` npm package and empirically verify:
1. Can an FTS5 virtual table be created? (`CREATE VIRTUAL TABLE ... USING fts5(...)`)
2. Do FTS5 triggers work? (INSERT/UPDATE/DELETE trigger-based sync)
3. Does `bm25()` return correct weighted scores?
4. Does the parameterized insert panic (#1811) affect the sync package?

**If this test fails, the libSQL migration is blocked.** No further work should proceed until FTS5 availability is confirmed.

### P1 (Before Committing): Performance Benchmark at MCP Workloads

**Scope:** 1 day | **Risk:** Low | **Value:** Quantifies performance impact

Run the production pipeline (`memory_context()` → `memory_search()` → `memory_match_triggers()`) against a copy of the production database using both better-sqlite3 and `libsql`. Measure:
- Per-query latency (p50, p95, p99) across all 23 MCP tools
- Stage 1 channel execution time (vector, FTS5, BM25, graph, trigger)
- Full pipeline end-to-end time including embedding generation
- Memory footprint comparison

**Acceptance threshold:** Total pipeline latency regression <50% (since embedding generation dominates, a 20x DB regression may only translate to a 10-30% total regression).

### P2 (If P0+P1 Pass): Driver Swap

**Scope:** 1-2 days | **Risk:** Low-Medium | **Value:** Migration complete

Execute the mechanical migration:
1. Replace `import Database from 'better-sqlite3'` with `import Database from 'libsql'` in 51 files
2. Replace `db.pragma('...')` with `db.exec('PRAGMA ...')` at 13 production + ~15 test call sites
3. Update `Database.Statement` type casts (~20 sites)
4. Keep `sqliteVec.load(db)` unchanged — `loadExtension()` works in `libsql`
5. Run full test suite, verify all 23 MCP tools operate correctly

### P3 (Optional): Native Vector Migration with DiskANN

**Scope:** 3-5 days | **Risk:** Medium | **Value:** High (eliminates sqlite-vec dependency)

After the driver swap is stable:
1. Add `embedding F32_BLOB(384)` column to `memory_index`
2. Create DiskANN index: `CREATE INDEX idx_vec ON memory_index(libsql_vector_idx(embedding))`
3. Dual-write: populate both `vec_memories` and native column during indexing
4. Benchmark DiskANN recall vs sqlite-vec ANN
5. Switch search queries to use native `vector_distance_cos()`
6. Drop `vec_memories` virtual table and `sqlite-vec` dependency

---

## 5. Risks

**FTS5 not bundled (CRITICAL)** — GitHub issue #1930 (open since January 2025) reports FTS5 virtual tables fail to create in the `libsql` npm package. If confirmed, the migration is blocked entirely. There are no viable workarounds: a custom build would be unsupported, and a dual-database approach (libSQL + SQLite-for-FTS5) adds unacceptable complexity.

**FTS5 parameterized insert panic (HIGH)** — GitHub issue #1811 documents a crash on parameterized FTS5 INSERT in `@libsql/client`. Both packages share the same Rust backend via `libsql-js`. The panic may affect our trigger-based FTS5 sync path in the sync package. The gate test (P0) must specifically verify this.

**Read performance 5-20x regression (HIGH)** — SQG benchmarks show `libsql` at 61K SELECT ops/s versus better-sqlite3's 1.2M ops/s. While our single-user workload and embedding-dominated latency may absorb this, the regression must be quantified at our workloads (P1) before committing.

**Prerelease package stability (MEDIUM)** — The `libsql` sync package is at `v0.6.0-pre.29`. Prerelease versions may introduce breaking changes between updates. Mitigation: exact version pinning, lock file, and maintaining better-sqlite3 as a fallback dependency.

**Type compatibility (LOW)** — The `Database.Statement` type cast pattern used in ~20 sites will need updating. This is mechanical but could surface TypeScript compilation errors during the migration.

---

## 6. Code Patterns

### Import Swap

```typescript
// Before (better-sqlite3)
import Database from 'better-sqlite3';

// After (libsql)
import Database from 'libsql';
```

### PRAGMA Replacement

```typescript
// Before (better-sqlite3)
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// After (libsql)
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');
```

### Native Vector Query Pattern (P3)

```sql
-- Current (sqlite-vec via vec0 virtual table)
SELECT rowid, distance
FROM vec_memories
WHERE embedding MATCH ?
ORDER BY distance
LIMIT 20;

-- Future (libSQL native DiskANN)
SELECT id, vector_distance_cos(embedding, ?) AS distance
FROM memory_index
WHERE embedding IS NOT NULL
ORDER BY distance ASC
LIMIT 20;
```

---

## 7. Migration Pathways

### Path A: FTS5 Works — Full Migration (Recommended)

**Gate test → Benchmark → Driver swap → Native vectors**

1. P0: Verify FTS5 availability (2-4 hours)
2. P1: Benchmark pipeline performance (1 day)
3. P2: Execute driver swap — 51 imports + 13 pragmas (1-2 days)
4. P3 (optional): Migrate to native DiskANN vectors (3-5 days)

**Total effort:** 3-8 days. **Risk:** Low (each step is reversible). **Outcome:** Modern vector capabilities, eliminated sqlite-vec dependency, future Turso upgrade path.

### Path B: FTS5 Broken — Custom Build or Dual-DB

**Not recommended.** If the gate test fails:

- **Custom build:** Compile libSQL from source with FTS5 enabled. Unsupported, creates maintenance burden for each libSQL update.
- **Dual-DB:** Use libSQL for structured data + vectors, keep a separate SQLite instance for FTS5. Adds transactional complexity and operational overhead.

Both options introduce more risk than they resolve. If FTS5 is broken, stay on Path C.

### Path C: FTS5 Broken — Stay on SQLite, Adapter Only

**Fallback.** Build the DatabaseAdapter abstraction (doc 002 §3), remain on better-sqlite3, and wait for either:
- FTS5 to be fixed/bundled in `libsql` (#1930 resolved)
- A stable `libsql` release (v1.0+)
- Turso Database to reach 1.0 with vector indexes and FTS

**Total effort:** 2-3 days (adapter only). **Risk:** None. **Outcome:** Improved architecture, no backend change, preserved optionality.

---

*Recommendations based on: libSQL `libsql` v0.6.0-pre.29, GitHub issues #1930 and #1811, SQG benchmark data, MCP server @spec-kit/mcp-server v1.7.2 codebase review. Agent research: G1 (libSQL stepping stone). Companion: doc 004 (libSQL analysis), doc 001 (Turso analysis), doc 002 (Turso recommendations).*
