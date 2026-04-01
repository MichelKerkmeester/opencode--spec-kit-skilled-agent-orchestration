# Research Iteration 8: How provider-specific DB selection switches `vector_search` onto an empty SQLite file

## Question

Why does `vector_search` end up using the empty provider-specific database instead of the populated legacy `context-index.sqlite`?

Specifically:

1. How does `initialize_db()` choose the SQLite file?
2. How does the embedding profile affect that path?
3. Where is the `context-index__...` filename built?
4. What does `context-server.ts` pass into `initializeDb()`?
5. Is there a migration/backfill step that should copy data from `context-index.sqlite` into the provider-specific DB?
6. Does `vector-index-schema.ts` contain any such copy logic?
7. What do the live DB files on disk look like?

## Short answer

`context-server.ts` does **not** pass an explicit DB path into `vectorIndex.initializeDb()`. The path is resolved internally inside `vector-index-store.ts`.

That resolution order is:

1. `MEMORY_DB_PATH` env override, if set
2. otherwise, if the lazy embedding provider singleton is already initialized and exposes a profile, use `profile.getDatabasePath(DEFAULT_DB_DIR)`
3. otherwise, fall back to the canonical default `DATABASE_PATH`, which is `context-index.sqlite`

The provider-specific filename is constructed in `shared/embeddings/profile.ts`:

- slug = `${provider}__${sanitizedModel}__${dim}`
- DB path = `context-index__${slug}.sqlite`

with one legacy exception:

- `hf-local` + `nomic-embed-text` + `768` dims -> `context-index.sqlite`

So for a live initialized Voyage profile:

- provider = `voyage`
- model = `voyage-4`
- dim = `1024`

the resolved path becomes:

- `context-index__voyage__voyage-4__1024.sqlite`

That file is currently **schema-only and empty** in this environment:

- `memory_index = 0`
- `active_memory_projection = 0`
- `schema_version = 1`
- `vec_metadata.embedding_dim = 1024`

There is **no code path that copies rows from `context-index.sqlite` into the provider-specific DB**. `vector-index-schema.ts` only bootstraps/migrates the schema **inside the currently opened database**. It does not attach the legacy DB, copy rows across files, or backfill provider-specific stores.

So the empty-file bug is explained by this chain:

> once `initializeDb()` runs in a process where the lazy provider singleton has already been created for Voyage, DB resolution switches from legacy `context-index.sqlite` to `context-index__voyage__voyage-4__1024.sqlite`; that provider-specific DB has schema but no indexed data, so `vector_search` returns `0`.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:277-290`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:749-838`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:12-18`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:63-71`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:384-417`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:839-844`]  
[SOURCE: live SQLite probe on 2026-04-01 against `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` and `.opencode/skill/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`]  

## 1. Exact file-selection logic in `initialize_db()`

In `vector-index-store.ts`, `initialize_db(custom_path = null)` does **not** compute the file path itself from startup config in `context-server.ts`. It resolves:

```ts
const target_path = custom_path || resolve_database_path();
```

and `resolve_database_path()` is:

```ts
if (process.env.MEMORY_DB_PATH) {
  return process.env.MEMORY_DB_PATH;
}

const profile = embeddings.getEmbeddingProfile();

if (!profile || !('getDatabasePath' in profile)) {
  return DEFAULT_DB_PATH;
}

return profile.getDatabasePath(DEFAULT_DB_DIR);
```

So there are only three cases:

1. explicit env override -> use that exact file
2. initialized profile exists -> ask the profile for its DB path
3. no initialized profile -> use default `context-index.sqlite`

The default path comes from `core/config.ts`, where:

```ts
databasePath: path.join(resolved, 'context-index.sqlite')
```

and that value is exported as `DATABASE_PATH`.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:274-290`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:749-758`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:44-83`]  

## 2. Where the `context-index__...` filename is constructed

The suffixed filename is built in exactly one place: `shared/embeddings/profile.ts`.

### 2.1 Slug construction

`createProfileSlug(provider, model, dim)` produces:

```ts
return `${provider}__${safeModel}__${dim}`;
```

where `safeModel` is sanitized to a filesystem-safe lower-case token.

### 2.2 DB-path construction

`EmbeddingProfile.getDatabasePath(baseDir)` then does:

```ts
if (this.provider === 'hf-local' &&
    this.model.includes('nomic-embed-text') &&
    this.dim === 768) {
  return `${baseDir}/context-index.sqlite`;
}
return `${baseDir}/context-index__${this.slug}.sqlite`;
```

So for Voyage 4 at 1024 dims, the computed filename is exactly:

- `context-index__voyage__voyage-4__1024.sqlite`

This matches the live file on disk.

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:12-18`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:63-71`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/database/README.md:34-35`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/database/README.md:66-68`]  

## 3. The critical nuance: path selection depends on whether the lazy provider singleton already exists

This is the key detail behind the "wrong DB" behavior.

In `shared/embeddings.ts`:

- `providerInstance` starts as `null`
- `getProvider()` creates it lazily on first actual embedding call
- `getEmbeddingProfile()` returns `providerInstance.getProfile()` only if that singleton already exists; otherwise it returns `null`

That means:

### 3.1 Cold process / no provider initialized yet

`embeddings.getEmbeddingProfile()` returns `null`, so `resolve_database_path()` falls back to:

- `DEFAULT_DB_PATH`
- which is `context-index.sqlite`

### 3.2 After first embedding/query embedding call

Any call that forces provider creation, such as:

- `generateEmbedding(...)`
- `generateQueryEmbedding(...)`

will call:

```ts
const provider = await getProvider();
```

Once that happens, `getEmbeddingProfile()` becomes non-null, and later `initializeDb()` calls can resolve a provider-specific DB file instead of the legacy one.

So the file switch is **not** based just on environment variables existing at startup. It depends on whether `initializeDb()` is called **before or after** the lazy provider singleton is created.

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:364-417`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:478-503`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:684-723`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:838-844`]  

## 4. What `context-server.ts` passes to `initializeDb()`

The server passes **no custom path at all**.

I found two important call sites:

### 4.1 Startup

```ts
vectorIndex.initializeDb();
dbInitialized = true;
```

### 4.2 Per-tool guard

```ts
if (!dbInitialized) {
  vectorIndex.initializeDb();
  dbInitialized = true;
}
```

Both are zero-argument calls. So `context-server.ts` itself does **not** force either the legacy or provider-specific file. It delegates that choice completely to `vector-index-store.ts`.

Also important: startup sets `EMBEDDING_DIM` from `resolveStartupEmbeddingConfig(...).dimension` / `getStartupEmbeddingDimension()`, but that does **not** instantiate the lazy provider singleton used by `getEmbeddingProfile()`.

So "startup knows the dimension is 1024" and "startup has an initialized profile object that can choose a suffixed DB path" are **not the same thing**.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:796-800`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1360-1368`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:258-280`]  

## 5. How the server can later flip onto the provider-specific DB

The codebase contains an automatic rebind path:

1. search/index handlers call `checkDatabaseUpdated()`
2. if `.db-updated` has a newer timestamp, `db-state.ts` calls `reinitializeDatabase()`
3. `reinitializeDatabase()` closes the old DB and calls `vectorIndex.initializeDb()` again

Relevant code:

```ts
await checkDatabaseUpdated();
```

in `memory-search.ts`, and:

```ts
if (typeof vectorIndex.closeDb === 'function') {
  vectorIndex.closeDb();
}
vectorIndex.initializeDb();
```

inside `reinitializeDatabase()`.

External indexing code writes the `.db-updated` marker:

```ts
fsSync.writeFileSync(DB_UPDATED_FILE, Date.now().toString());
```

So the strongest code-supported flip sequence is:

1. cold process starts on legacy `context-index.sqlite`
2. an embedding request lazily creates the Voyage provider singleton
3. a later DB reinitialize occurs
4. that second `initializeDb()` now sees a live profile and switches to `context-index__voyage__voyage-4__1024.sqlite`

I cannot prove from static code alone that this exact runtime sequence is the one that happened in the failing session, but it is the clearest built-in mechanism that explains **how the same server can reopen onto the empty provider-specific file after provider initialization**.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:399-403`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:218-228`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:245-303`]  
[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:39-44`]  
[SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md:18`]  

## 6. Was a migration/backfill step supposed to copy legacy data into the profile DB?

### Short answer

**No such step exists in the code I inspected.**

### What `vector-index-schema.ts` actually does

`create_schema(database, ...)` and `ensure_schema_version(database)` only operate on the **currently opened database handle**.

They:

- create missing tables in that DB
- run schema migrations in that DB
- create/repair indexes in that DB
- initialize companion/history/lineage/governance/shared-space tables in that DB

I did **not** find any code that:

- attaches `context-index.sqlite`
- reads legacy rows from another DB file
- copies vectors or metadata across DB files
- backfills a newly created profile-specific DB from the legacy DB

The migration code I found is all **intra-database schema migration**, e.g.:

- rename table -> create new table -> `INSERT INTO ... SELECT ... FROM old_table`

inside the same DB connection.

This means the provider-specific file is not "missing copied rows because a migration failed"; rather, it appears to be a freshly bootstrapped per-profile DB that was never populated.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1243-1289`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2264-2295`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1186-1206`]  

## 7. The design docs suggest this is intentional isolation, not legacy-copy migration

The shared embeddings README explicitly describes per-profile databases as a feature:

> Each unique combination of `{provider, model, dimension}` uses its own SQLite database.

and lists as a benefit:

> Changing providers doesn't require migration

That strongly suggests the current architecture expects separate DB files per embedding profile rather than copying an existing legacy DB forward.

So the operational bug is not "copy step crashed halfway through." The bug is:

> the search pipeline can resolve onto a profile-specific DB that exists structurally but has never been indexed/backfilled, while the populated legacy DB still holds the real data.

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/README.md:152-167`]  

## 8. Live on-disk evidence

### 8.1 Directory listing

Live filesystem probe from repository root showed:

- `context-index.sqlite` -> **85,442,560 bytes**
- `context-index.sqlite-wal` -> **4,132,392 bytes**
- `context-index__voyage__voyage-4__1024.sqlite` -> **516,096 bytes**

The provider-specific DB is orders of magnitude smaller.

### 8.2 Live row counts

Probe results:

#### `context-index.sqlite`

- `memory_index = 1728`
- `active_memory_projection = 1708`
- `schema_version = 1`
- `vec_metadata = [('embedding_dim', '1024')]`

#### `context-index__voyage__voyage-4__1024.sqlite`

- `memory_index = 0`
- `active_memory_projection = 0`
- `schema_version = 1`
- `vec_metadata = [('embedding_dim', '1024')]`

So the provider-specific DB is not malformed. It has the schema and embedding-dimension metadata. It is simply empty of indexed content.

[SOURCE: live `ls -la` / `stat` probe on 2026-04-01 against `.opencode/skill/system-spec-kit/mcp_server/database/`]  
[SOURCE: live SQLite probe on 2026-04-01 against both DB files]  

## 9. Final conclusion

The exact file-selection mechanism is now clear:

1. default canonical DB path is `context-index.sqlite`
2. once the lazy embedding provider singleton exists, `getEmbeddingProfile()` exposes a per-profile DB path
3. for Voyage 4 / 1024, that path is `context-index__voyage__voyage-4__1024.sqlite`
4. any later `initializeDb()` / reinitialize path can reopen onto that provider-specific file
5. that file currently contains schema metadata but **zero indexed memories**
6. there is no legacy-to-profile backfill logic in the schema/bootstrap code

Therefore:

> `vector_search` uses the empty database because path resolution is profile-driven after provider initialization, and the chosen profile DB was created but never populated.

### Most likely remediation direction

The next investigation should focus on one of these architectural fixes:

1. add a deterministic migration/backfill from legacy `context-index.sqlite` into the active profile DB
2. pin runtime search to the legacy DB until profile-specific indexing is complete
3. make DB selection consistent across startup, indexing, and query paths so a server cannot silently flip between populated and empty stores

