# Research Iteration 9: Why the FTS channel can also drop to 0 in the hybrid pipeline

## Question

If the legacy SQLite database still contains populated FTS data, why can the hybrid pipeline's FTS channel still return `0` results?

The core question is which database instance `ftsSearch()` actually uses at runtime, and whether that handle can be rebound from the populated legacy DB to the empty provider-specific DB.

## Short answer

Yes: `ftsSearch()` uses the module-level `db` variable inside `hybrid-search.ts`, and that variable is updated by `hybridSearch.init(database, ...)`.

Startup initializes `hybridSearch` with whatever database handle `vectorIndex.getDb()` returns after `vectorIndex.initializeDb()`. Later, `db-state.ts` can re-run `vectorIndex.initializeDb()` and then explicitly call `hybridSearch.init(newDatabase, ...)` again during rebind. Because `ftsSearch()` reads from that module-level `db`, FTS can follow the same DB switch as vector search. If the reinitialized DB is the empty provider-specific file, FTS can also return `0`.

However, there is a major caveat in this repository: the checked-in MCP launch configs explicitly set `MEMORY_DB_PATH` to the legacy `context-index.sqlite`, which should pin both vector and FTS to that legacy file and bypass provider-derived path selection. So the "startup on legacy -> later rebind to provider DB" sequence is absolutely supported by the code, but under the checked-in launcher config it should only happen if the runtime is not actually using that config, or if `MEMORY_DB_PATH` is temporarily overridden in-process.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:259-316`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:446-460`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:160-182`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:246-293`]  
[SOURCE: `opencode.json:19-38`]  
[SOURCE: `.vscode/mcp.json:11-29`]  

## 1. Exact startup order in `context-server.ts`

The relevant startup order is:

1. `validateConfiguredEmbeddingsProvider()`
2. `resolveStartupEmbeddingConfig(...)` for API-key validation
3. `process.env.EMBEDDING_DIM = startupEmbeddingConfig?.dimension ?? getStartupEmbeddingDimension()`
4. `vectorIndex.initializeDb()`
5. `initDbState({ vectorIndex, ..., hybridSearch, ... })`
6. `const database = vectorIndex.getDb()`
7. `graphSearchFn = ...`
8. `checkpoints.init(database)`
9. `accessTracker.init(database)`
10. `hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn)`
11. `initDbState({ graphSearchFn })`

The key observation is that `hybridSearch.init(...)` happens **after** `vectorIndex.initializeDb()` and after `vectorIndex.getDb()`. There is no provider singleton creation between `vectorIndex.initializeDb()` and `hybridSearch.init(...)` in this startup path.

Relevant startup code:

```ts
startupEmbeddingConfig = await resolveStartupEmbeddingConfig(...)
...
process.env.EMBEDDING_DIM = String(
  startupEmbeddingConfig?.dimension ?? getStartupEmbeddingDimension(),
);
...
vectorIndex.initializeDb();
...
initDbState({ vectorIndex, ..., hybridSearch, ... });
...
const database = vectorIndex.getDb();
...
hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);
initDbState({ graphSearchFn });
```

So at startup, `hybridSearch` receives the **same DB handle** that `vectorIndex.initializeDb()` opened.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1301-1368`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1417-1462`]  

## 2. Does startup embedding config create the provider singleton?

No.

`resolveStartupEmbeddingConfig()` is implemented in `shared/embeddings/factory.ts`, not in `shared/embeddings.ts`. It:

1. calls `resolveProvider()`
2. validates the API key with `validateApiKey(...)`
3. computes the dimension with `resolveStartupEmbeddingDimension(resolution)`
4. returns metadata

It does **not** call `createEmbeddingsProvider(...)` or `getProvider()`.

```ts
export async function resolveStartupEmbeddingConfig(...) {
  const resolution = resolveProvider();
  const validation = await validateApiKey(...);
  return {
    resolution,
    info: getProviderInfoForResolution(resolution),
    dimension: resolveStartupEmbeddingDimension(resolution),
    validation,
  };
}
```

Likewise, `getStartupEmbeddingDimension()` only does:

```ts
return resolveStartupEmbeddingDimension(resolveProvider());
```

That is provider **resolution**, not provider singleton creation.

So the answer to task 4 and 5 is:

- `resolveStartupEmbeddingConfig()` does **not** create the provider singleton
- `getStartupEmbeddingDimension()` does **not** create the provider singleton
- neither startup path populates `providerInstance`

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:258-287`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:10-16`]  

## 3. What actually creates the provider singleton?

The provider singleton is created lazily inside `shared/embeddings.ts` by `getProvider()`:

```ts
async function getProvider(): Promise<IEmbeddingProvider> {
  if (providerInstance) return providerInstance;
  ...
  providerInstance = await createEmbeddingsProvider({ warmup: false });
  ...
  return providerInstance;
}
```

And `getEmbeddingProfile()` is intentionally side-effect free:

```ts
function getEmbeddingProfile() {
  if (providerInstance) {
    return providerInstance.getProfile();
  }
  return null;
}
```

So:

- before first lazy provider creation, `getEmbeddingProfile()` returns `null`
- after first lazy provider creation, `getEmbeddingProfile()` returns a live profile

That distinction matters because `vector-index-store.ts` uses `getEmbeddingProfile()` when resolving the DB path.

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:364-417`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:838-849`]  

## 4. Which database does `ftsSearch()` use?

`ftsSearch()` uses the module-level `db` variable from `hybrid-search.ts`.

The module state is:

```ts
let db: Database.Database | null = null;
```

and `init()` assigns it:

```ts
function init(database, vectorFn = null, graphFn = null): void {
  db = database;
  vectorSearchFn = vectorFn;
  graphSearchFn = graphFn;
}
```

Then `ftsSearch()` reads from that same `db`:

```ts
function ftsSearch(query, options = {}) {
  if (!db || !isFtsAvailable()) return [];
  const bm25Results = fts5Bm25Search(db, query, { ... });
  ...
}
```

So FTS does **not** ask `vectorIndex` for the DB on each call. It uses whatever database handle was most recently passed into `hybridSearch.init(...)`.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:259-316`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:446-460`]  

## 5. Does `reinitializeDatabase()` re-run `hybridSearch.init()` with the new DB?

Yes.

`reinitializeDatabase()` closes the DB, calls `vectorIndex.initializeDb()` again, gets the new handle, and then calls `rebindDatabaseConsumers(database)`.

```ts
if (typeof vectorIndex.closeDb === 'function') {
  vectorIndex.closeDb();
}
vectorIndex.initializeDb();
...
const database = vectorIndex.getDb();
...
rebindDatabaseConsumers(database)
```

Inside `rebindDatabaseConsumers(...)`:

```ts
if (hybridSearch) {
  hybridSearch.init(database, vectorIndex?.vectorSearch, graphSearchFnRef ?? null);
}
```

So after a successful reinitialize, `hybridSearch.db` is explicitly rewritten to the new DB handle.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:160-182`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:246-293`]  

## 6. Is there also a DB-change listener path?

Yes.

`initDbState(...)` registers a vector-index database-connection-change listener when the vector index supports `onDatabaseConnectionChange(...)`. The listener also calls `rebindDatabaseConsumers(database)`.

```ts
vectorIndexListenerCleanup = nextVectorIndex.onDatabaseConnectionChange((database) => {
  ...
  const rebound = rebindDatabaseConsumers(database);
  ...
});
```

At the vector-index layer, `set_active_database_connection(...)` notifies those listeners whenever either the DB object or path changes.

```ts
if (previousDb !== connection || previousPath !== target_path) {
  for (const listener of database_connection_listeners) {
    listener(connection, { previousDb, previousPath, nextPath: target_path });
  }
}
```

During `reinitializeDatabase()` the listener is temporarily suppressed and `rebindDatabaseConsumers(...)` is called manually afterward, so the end result is still the same: dependent modules, including `hybridSearch`, are rebound to the new DB.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:128-183`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:394-442`]  

## 7. What triggers reinitialize at runtime?

`checkDatabaseUpdated()` watches the `.db-updated` marker file. If the marker timestamp is newer than `lastDbCheck`, it calls `reinitializeDatabase(...)`.

```ts
if (updateTime > lastDbCheck) {
  const rebindSucceeded = await reinitializeDatabase(updateTime);
  ...
}
```

This check is invoked both:

- at the top-level tool dispatch path in `context-server.ts`
- inside individual handlers such as `memory-search.ts`

Relevant call sites:

```ts
const dbReinitialized = await checkDatabaseUpdated();
```

and:

```ts
await checkDatabaseUpdated();
```

So once a marker is written, the next qualifying request can rebind the live DB handle.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:218-243`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:750-753`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:399-403`]  

## 8. Can the sequence in the prompt happen?

### Code-path answer

Yes, **if `MEMORY_DB_PATH` is not pinning the DB path**.

The sequence is fully supported by the code:

1. `initializeDb()` runs before the provider singleton exists
2. `resolve_database_path()` sees no live embedding profile and falls back to the legacy default DB
3. `hybridSearch.init(database, ...)` captures that legacy DB handle
4. some later embedding operation lazily creates `providerInstance`
5. a `.db-updated` marker triggers `checkDatabaseUpdated()`
6. `reinitializeDatabase()` re-runs `vectorIndex.initializeDb()`
7. now `resolve_database_path()` can see `getEmbeddingProfile()` and may choose a provider-specific DB
8. `rebindDatabaseConsumers(...)` calls `hybridSearch.init(newDatabase, ...)`
9. `ftsSearch()` now queries the **new** DB, not the old legacy DB

This means the hybrid pipeline's FTS channel can indeed drop to `0` for the same reason vector search does: both were rebound to the empty provider-specific DB.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:277-290`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:838-844`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:384-417`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:160-182`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:246-293`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:308-316`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:446-460`]  

## 9. But is that sequence compatible with the checked-in runtime config?

Not by default.

The checked-in launcher configs explicitly set:

```json
"MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite"
```

in both:

- `opencode.json`
- `.vscode/mcp.json`

Since `vector-index-store.ts` resolves the DB path by checking `process.env.MEMORY_DB_PATH` first:

```ts
if (process.env.MEMORY_DB_PATH) {
  return process.env.MEMORY_DB_PATH;
}
```

that env var should force both startup and reinitialize to keep using the legacy DB file, regardless of whether the provider singleton has been created.

So there are two different truths:

### 9.1 Code behavior

Without an env override, the startup/rebind timing sequence in the prompt is real and explains how both vector and FTS can jump to the provider-specific DB.

### 9.2 This repository's checked-in launcher config

With the checked-in `MEMORY_DB_PATH` setting, that timing sequence should be blocked, because the DB path is pinned to `context-index.sqlite`.

That means the remaining puzzle becomes narrower:

- either the failing MCP runtime was **not** started with the checked-in config
- or `MEMORY_DB_PATH` was absent/overridden in that runtime
- or some code temporarily swapped it

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:269-290`]  
[SOURCE: `opencode.json:19-38`]  
[SOURCE: `.vscode/mcp.json:11-29`]  

## 10. Is `MEMORY_DB_PATH` ever changed in-process?

Normally, it is treated as an input env var.

I found one real in-process mutation path in `handlers/eval-reporting.ts`, which temporarily swaps `MEMORY_DB_PATH` to an override DB, then restores it:

```ts
const previousMemoryDbPath = process.env.MEMORY_DB_PATH;
vectorIndex.closeDb();
process.env.MEMORY_DB_PATH = overrideDbPath;
...
vectorIndex.closeDb();
if (previousMemoryDbPath === undefined) {
  delete process.env.MEMORY_DB_PATH;
} else {
  process.env.MEMORY_DB_PATH = previousMemoryDbPath;
}
vectorIndex.initializeDb();
```

That proves the process can intentionally swap DBs by changing `MEMORY_DB_PATH` and reinitializing.

I did **not** find ordinary startup logic in `context-server.ts` that rewrites `MEMORY_DB_PATH`. The main normal reads are path-resolution sites such as:

- `vector-index-store.ts`
- `shared/paths.ts`
- some eval helpers/tests

So for normal search traffic, the most relevant question is whether the runtime was launched with `MEMORY_DB_PATH` set at all.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:127-141`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/paths.ts:101-108`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:274-290`]  

## Conclusion

The FTS channel can return `0` for the same structural reason as vector search:

1. `hybridSearch` stores its own module-level DB handle
2. `ftsSearch()` uses that stored handle
3. `reinitializeDatabase()` explicitly re-runs `hybridSearch.init(newDatabase, ...)`
4. therefore FTS follows any DB rebind

So if the server rebinds from the populated legacy DB to the empty provider-specific DB, both vector and FTS can go to zero together.

But the checked-in MCP configs in this repo explicitly set `MEMORY_DB_PATH=context-index.sqlite`, which should prevent provider-profile DB switching in a correctly launched runtime. That means the strongest static-code conclusion is:

> the "FTS also becomes 0 after rebind" mechanism is real, but if it happened in the observed failing session, the runtime likely was not honoring the checked-in `MEMORY_DB_PATH` pin, or that env var was temporarily overridden.
