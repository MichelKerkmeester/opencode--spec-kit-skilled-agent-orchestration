# Migration Path: 138-Hybrid-RAG-Fusion

> Upgrade guide for future schema changes to hybrid search tables.

---

## 1. Current Schema (v15)

The v15 SQLite schema is **unchanged** by spec 138. No new tables or columns were introduced.

- `memory_index` table: unchanged (id, spec_folder, anchor, content, embedding, created_at, etc.)
- `causal_edges` table: pre-existing; queried by `graph-search-fn.ts` but not modified
- FTS5 virtual table: `memory_fts` created via existing `sqlite-fts.ts` initialization
- SGQS skill graph: **in-memory only** (built by `buildSkillGraph()` from filesystem, cached by `SkillGraphCacheManager` with 5-min TTL)

**Key invariant:** All graph-enhanced search operates on existing tables + in-memory structures. Zero schema migration required for 138.

---

## 2. Future Schema Changes (Post-138)

If graph data needs persistence beyond in-memory caching, the following schema additions are anticipated:

### 2a. `graph_cache` Table

```sql
CREATE TABLE IF NOT EXISTS graph_cache (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  cache_key   TEXT NOT NULL UNIQUE,
  graph_json  TEXT NOT NULL,          -- serialized SkillGraph
  skill_root  TEXT NOT NULL,
  built_at    INTEGER NOT NULL,       -- unix timestamp ms
  ttl_ms      INTEGER NOT NULL DEFAULT 300000,
  created_at  TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_graph_cache_key ON graph_cache(cache_key);
```

### 2b. `authority_score` Column on `memory_index`

```sql
ALTER TABLE memory_index ADD COLUMN authority_score REAL DEFAULT 0.0;
ALTER TABLE memory_index ADD COLUMN pagerank_score REAL DEFAULT 0.0;
```

### 2c. `graph_version` in Metadata

```sql
ALTER TABLE metadata ADD COLUMN graph_version INTEGER DEFAULT 0;
```

---

## 3. Migration Steps

Follow the existing `schema-migration.ts` pattern:

1. **Increment schema version** from v15 to v16 in `db-state.ts`
2. **Add migration function** in `schema-migration.ts`:
   ```typescript
   function migrateV15ToV16(db: Database): void {
     db.exec(`
       CREATE TABLE IF NOT EXISTS graph_cache (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         cache_key TEXT NOT NULL UNIQUE,
         graph_json TEXT NOT NULL,
         skill_root TEXT NOT NULL,
         built_at INTEGER NOT NULL,
         ttl_ms INTEGER NOT NULL DEFAULT 300000,
         created_at TEXT DEFAULT (datetime('now'))
       );
       CREATE INDEX IF NOT EXISTS idx_graph_cache_key ON graph_cache(cache_key);
     `);
     // ALTER TABLE with IF NOT EXISTS guard (SQLite lacks native support)
     try {
       db.exec(`ALTER TABLE memory_index ADD COLUMN authority_score REAL DEFAULT 0.0`);
     } catch (e) {
       // Column already exists — safe to ignore
     }
     try {
       db.exec(`ALTER TABLE memory_index ADD COLUMN pagerank_score REAL DEFAULT 0.0`);
     } catch (e) {
       // Column already exists — safe to ignore
     }
   }
   ```
3. **Register migration** in the version dispatch chain
4. **Test:** Run `vitest` migration tests to confirm v15 -> v16 upgrade path

**Guards:**
- All `CREATE TABLE` uses `IF NOT EXISTS`
- All `ALTER TABLE ADD COLUMN` wrapped in try/catch (SQLite does not support `IF NOT EXISTS` for columns)
- Migration is idempotent: running twice produces the same result

---

## 4. Feature Flag Graduation

Feature flags defined in `graph-flags.ts`:

| Flag | Env Variable | Purpose |
|------|-------------|---------|
| Graph Unified | `SPECKIT_GRAPH_UNIFIED` | Gates unified graph search channel |
| Graph MMR | `SPECKIT_GRAPH_MMR` | Gates graph-guided MMR diversity |
| Graph Authority | `SPECKIT_GRAPH_AUTHORITY` | Gates structural authority propagation |

### Graduation Criteria

Remove flags when **all** conditions are met:

1. **Stability window:** Flag enabled in production for >= 4 weeks with zero regressions
2. **Performance verified:** p95 latency remains <= 120ms with flag enabled
3. **No rollback events:** Zero incidents requiring flag-off rollback during window
4. **Test coverage:** All flag-off regression tests can be retired (currently 18 tests)

### Graduation Steps

1. Remove `isGraph*Enabled()` checks from call sites
2. Inline the enabled code path (delete the disabled branch)
3. Remove flag functions from `graph-flags.ts`
4. Remove `graph-flags.vitest.ts` and `graph-regression-flag-off.vitest.ts`
5. Remove env variable documentation references
6. Update `decision-record.md` with graduation ADR

---

## 5. Breaking Changes Checklist

What would break if these interfaces change:

### 5a. `FusionWeights` Shape Changes

- **Impact:** `adaptive-fusion.ts` weight profiles, all intent-to-weight mappings
- **Consumers:** `adaptiveFuse()`, `INTENT_WEIGHT_PROFILES`, `DarkRunDiff` comparisons
- **Migration:** Update all 6 intent profiles in `INTENT_WEIGHT_PROFILES`. Update `FusionWeights` type consumers. Bump `DarkRunDiff` baseline.
- **Tests affected:** `adaptive-fusion.vitest.ts`, `integration-138-pipeline.vitest.ts`

### 5b. `GraphSearchFn` Signature Changes

- **Current signature:** `(query: string, specFolder: string, limit: number) => Promise<GraphSearchResult[]>`
- **Impact:** `context-server.ts:566` wiring, `hybrid-search.ts` graph channel invocation
- **Consumers:** `createUnifiedGraphSearchFn()` return type, `hybridSearch()` caller
- **Migration:** Update all call sites (context-server.ts, hybrid-search.ts). Update factory function. Update mock implementations in tests.
- **Tests affected:** `graph-search-fn.vitest.ts`, `graph-channel-benchmark.vitest.ts`

### 5c. Namespace Prefix Format Changes

- **Current format:** `skill:{path}` for SGQS results, `causal:{from}->{to}` for causal edges
- **Impact:** Result deduplication, RRF fusion key matching, debug logging
- **Consumers:** `graph-search-fn.ts` result construction, `rrf-fusion.ts` item keying
- **Migration:** Update namespace construction in `createUnifiedGraphSearchFn()`. Update any prefix-based filtering/deduplication logic. Verify RRF fusion handles new keys.
- **Tests affected:** `graph-search-fn.vitest.ts`, `unit-rrf-fusion.vitest.ts`

---

*Created: 2026-02-26 | Spec: 138-hybrid-rag-fusion | Status: Reference document*
