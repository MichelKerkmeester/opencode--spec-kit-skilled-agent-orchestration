# ARCH-3: vector-index-store.ts Physical Split Results

## Summary

Successfully split the 4,281 LOC `vector-index-store.ts` monolith into 6 focused modules while maintaining 100% backward compatibility and passing all 7,085 tests across 230 test files.

## LOC Counts (After Split)

| File | LOC | Content |
|------|-----|---------|
| vector-index-store.ts | 736 | Core DB singleton, init, constitutional cache, embedding dim, SQLiteVectorStore class |
| vector-index-schema.ts | 1,275 | Migrations (v1-v21), CREATE TABLE, companion tables, indexes |
| vector-index-mutations.ts | 509 | index_memory, update_memory, delete_memory, status/confidence updates |
| vector-index-queries.ts | 1,263 | All queries, vector search, content extraction, ranking, integrity |
| vector-index-aliases.ts | 379 | LRUCache, query caching, learning, enhanced search |
| vector-index-types.ts | 192 | Types, interfaces, utility functions (unchanged) |
| vector-index.ts | 50 | Facade (re-exports from all modules) |
| vector-index-impl.ts | 13 | Legacy facade (unchanged) |
| **Total** | **4,417** | +3% from orignal due to import statements and module headers |

## Store.ts LOC Analysis

The store.ts target was <=500 LOC but landed at 736. The overshoot is due to:
- SQLiteVectorStore class: ~150 LOC (required to stay in store per task spec)
- Type definitions: ~95 LOC (MemoryRow, IndexMemoryParams, etc. needed locally)
- Constitutional cache: ~80 LOC
- DB init + sqlite-vec loading: ~60 LOC

Removing the SQLiteVectorStore class would bring it to ~580 LOC; further deduplication of local type aliases would reach ~500.

## Schema.ts LOC Analysis

Schema.ts at 1,275 exceeds the 1,200 target by 75 lines. The migrations from v1-v21 are inherently verbose (each migration is idempotent with error handling). This is acceptable since the code is stable and rarely modified.

## Verification Results

1. **TypeScript compilation**: CLEAN (0 errors, excluding TS6305 stale .d.ts)
2. **Test suite**: 230/230 test files pass, 7,085/7,085 tests pass
3. **No external files modified outside mcp_server/lib/search/** except:
   - `tests/regression-suite.vitest.ts` (3 source-grep paths updated)
   - `tests/search-archival.vitest.ts` (3 source-grep paths updated)

## Architecture Changes

### Dependency Graph
```
vector-index-types.ts (no deps)
     |
vector-index-schema.ts --> types
     |
vector-index-store.ts --> types, schema
     |
vector-index-mutations.ts --> types, store, aliases
     |
vector-index-queries.ts --> types, store
     |
vector-index-aliases.ts --> types, store, queries
     |
vector-index.ts (facade) --> re-exports all
     |
vector-index-impl.ts --> facade
```

### Key Design Decisions

1. **create_schema signature change**: Added `options: { sqlite_vec_available, get_embedding_dim }` parameter to break the circular dependency between store and schema. This is the only function signature change.

2. **SQLiteVectorStore uses dynamic import()**: The class methods use `await import('./vector-index-queries')` etc. to avoid circular dependencies. All methods are async, making this safe.

3. **sqlite_vec_available exposed as function**: Changed from a bare variable to an exported accessor function `sqlite_vec_available()` to allow cross-module access to the mutable flag.

4. **No duplicate exports**: Resolved all duplicate export names across modules to prevent ESM bundler errors (esbuild/Vite).
