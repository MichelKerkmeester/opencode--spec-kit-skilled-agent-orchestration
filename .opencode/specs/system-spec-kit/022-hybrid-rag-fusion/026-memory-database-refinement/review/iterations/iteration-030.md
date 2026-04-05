# Iteration 030: Cross-module state dependencies (second pass)

## Findings

### [P1] Access tracker can flush pending counters into the wrong database after a rebind
**File**
`mcp_server/core/db-state.ts`, `mcp_server/lib/storage/access-tracker.ts`, `mcp_server/context-server.ts`

**Issue**
`db-state` reinitializes the live database handle and immediately calls `accessTracker.init(database)`, but `access-tracker` keeps its accumulator `Map`, interval, and process-level handler state in module globals. Because `init()` only swaps the `db` reference and does not flush or reset pending counters, any accumulated access events from the old database can later be written into the newly bound database. That creates cross-database state bleed in ranking signals and `access_count`.

**Evidence**
`core/db-state.ts:164-182` closes and reopens the DB, then rebinds `accessTracker.init(database)`. `lib/storage/access-tracker.ts:54-72` stores `db`, `accumulators`, `flushInterval`, and exit-handler state at module scope, and `init()` only updates `db` and interval wiring. The actual reset/dispose paths are separate in `lib/storage/access-tracker.ts:242-250` and `lib/storage/access-tracker.ts:303-310`. Startup uses the same pattern in `context-server.ts:938-940`.

**Fix**
Make rebinding explicit. Either call `accessTracker.dispose()` or at least `accessTracker.reset()` before swapping databases, or change `access-tracker` to scope accumulators by `Database` instance instead of a single process-global `db`.

### [P1] Restore and mutation paths leave graph-degree and hierarchy caches stale
**File**
`mcp_server/handlers/checkpoints.ts`, `mcp_server/handlers/mutation-hooks.ts`, `mcp_server/lib/search/graph-search-fn.ts`, `mcp_server/lib/search/spec-folder-hierarchy.ts`

**Issue**
The restore and post-mutation invalidation paths clear search/tool/constitutional caches, but they do not clear the typed-degree cache in `graph-search-fn` or the hierarchy tree cache in `spec-folder-hierarchy`. After a checkpoint restore, or after mutations that add/remove folders, graph/hierarchy-assisted retrieval can keep serving stale state even though the main search caches were rebuilt.

**Evidence**
`handlers/checkpoints.ts:393-407` rebuilds BM25 and clears search + constitutional caches, but does not call either `clearDegreeCacheForDb()` or `invalidateHierarchyCache()`. `handlers/mutation-hooks.ts:19-103` clears trigger, tool, constitutional, graph-signals, and co-activation caches only. The omitted caches are stateful: `lib/search/graph-search-fn.ts:309-318` and `lib/search/graph-search-fn.ts:479-509` keep per-DB degree scores until manually cleared, and `lib/search/spec-folder-hierarchy.ts:35-44` keeps a per-DB hierarchy cache behind a manual invalidator. A usage sweep found `invalidateHierarchyCache()` only in tests, not in production code. `lib/search/graph-search-fn.ts:90-105` shows that graph search does consume hierarchy rows during spec-scoped retrieval.

**Fix**
Extend both checkpoint restore and `runPostMutationHooks()` to invalidate these caches with the active database handle. At minimum, call `clearDegreeCacheForDb(database)` and `invalidateHierarchyCache(database)` anywhere causal edges or `spec_folder` membership can change.

### [P2] The vector-index layer still contains a live import cycle across query, mutation, and cache helpers
**File**
`mcp_server/lib/search/vector-index-aliases.ts`, `mcp_server/lib/search/vector-index-queries.ts`, `mcp_server/lib/search/vector-index-mutations.ts`

**Issue**
There is a real circular dependency in the core vector-index surface: aliases import queries, queries import mutations, and mutations import aliases. It happens to work today because the cycle mostly traverses function exports, but this makes initialization order brittle and raises the risk of partially initialized exports if any leg adds new module-scope work.

**Evidence**
`lib/search/vector-index-aliases.ts:13-23` imports query helpers from `vector-index-queries`. `lib/search/vector-index-queries.ts:21-32` imports `delete_memory_from_database` from `vector-index-mutations`. `lib/search/vector-index-mutations.ts:13-15` imports `clear_search_cache` from `vector-index-aliases`. An import-graph sweep across the reviewed handler/search/storage files found this as the only strongly connected component.

**Fix**
Break the cycle by extracting cache invalidation into a neutral module, for example `vector-index-cache.ts`, or by inverting the dependency so mutation code does not import the alias layer.

### [P2] The handler barrel eagerly imports the full handler graph and amplifies import-time side effects
**File**
`mcp_server/handlers/index.ts`, `mcp_server/context-server.ts`, `mcp_server/lib/search/vector-index-store.ts`

**Issue**
The main handler barrel imports every handler module up front, and runtime entrypoints import from that barrel. That means loading one handler surface also loads transitive singleton owners and import-time work from unrelated handlers. In practice, import order now influences when shared search/storage state gets initialized and when sync file I/O happens.

**Evidence**
`context-server.ts:31-35` imports from `./handlers`. `handlers/index.ts:5-18` eagerly imports all handler modules before re-exporting them. One of the deeper transitive side effects is in `lib/search/vector-index-store.ts:47-67`, which synchronously reads `search-weights.json` and fixes `search_weights` at module load time.

**Fix**
Prefer direct re-exports in `handlers/index.ts` without the eager namespace imports, and keep any test-only submodule aggregation in a separate barrel. Where possible, move import-time configuration reads behind lazy getters or explicit init functions.

## Summary
I read the handler/search/storage files in scope with an import-graph pass over the 129 TypeScript modules under those directories. I did not find a handler-to-handler cycle, but I did find one live search-layer SCC, one cross-database singleton corruption risk in the access tracker, and two stale-cache paths where restore/mutation logic does not fully invalidate shared process state.
