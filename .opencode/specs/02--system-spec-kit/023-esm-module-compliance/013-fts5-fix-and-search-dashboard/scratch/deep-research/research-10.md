# Research Iteration 10: Final synthesis on DB path drift, launcher env, and fix direction

## Question

Confirm the final root cause, validate the proposed fix direction, and check the real `MEMORY_DB_PATH` behavior across:

1. the current shell
2. the MCP launcher config
3. the live MCP server processes
4. the runtime path resolver in `vector-index-store.ts`
5. the script-side indexer path used by `memory-indexer.ts`

## Executive summary

The direct runtime result is now clear:

- the **current interactive shell** does **not** have `MEMORY_DB_PATH` set
- the checked-in **MCP launcher configs do set** `MEMORY_DB_PATH`
- the **currently running MCP server processes also have** `MEMORY_DB_PATH` set
- with that env var explicitly set, `resolve_database_path()` short-circuits to the legacy DB and `vectorSearch()` returns results
- however, the code still contains a **latent split-brain path-selection bug**: if a process runs **without** `MEMORY_DB_PATH`, then the DB file selected by `initializeDb()` changes depending on whether the lazy embedding provider singleton has already been created
- the script-side indexer is especially exposed to this because it calls `generateDocumentEmbedding(...)` **before** `vectorIndex.indexMemory(...)`, so provider creation can happen before the first DB open

That means the most accurate final conclusion is:

> The code-level root cause is real: DB path resolution is stateful and can drift from `context-index.sqlite` to `context-index__voyage__voyage-4__1024.sqlite` after lazy provider initialization, and there is no migration/backfill into the provider-specific DB. In the currently running MCP server, that drift is masked because the launcher correctly pins `MEMORY_DB_PATH` to the legacy DB. The remaining real risk is process inconsistency: any indexing or search process started without that env pin can still attach to the empty provider-specific DB and diverge from the pinned server.

[SOURCE: `opencode.json:19-38`]  
[SOURCE: `.vscode/mcp.json:11-29`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:277-290`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:384-417`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:839-849`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:63-71`]  
[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:63-92`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:153-156`]  
[SOURCE: live runtime probes on 2026-04-01 documented below]

## 1. Actual runtime environment

### 1.1 Current shell

Running:

```bash
env | grep -i MEMORY_DB || true
```

returned no matches in the current shell session.

So this shell does **not** export `MEMORY_DB_PATH` itself.

[SOURCE: live shell probe on 2026-04-01: `env | grep -i MEMORY_DB || true`]

### 1.2 Live MCP server processes

I then inspected the running `context-server.js` processes and checked their effective environment:

```bash
ps eww -p <pid> | tr ' ' '\n' | grep '^MEMORY_DB_PATH='
```

All live MCP server processes were started with:

```text
MEMORY_DB_PATH=.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite
```

So the active MCP servers are in fact pinned to the legacy DB path.

[SOURCE: live process env probe on 2026-04-01 for PIDs 9720, 59109, 75013, 57233]

## 2. Launcher config behavior

Both checked-in launcher configs pin `MEMORY_DB_PATH` to the legacy DB.

### 2.1 `opencode.json`

The OpenCode MCP config defines:

```json
"MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite"
```

[SOURCE: `opencode.json:19-38`]

### 2.2 `.vscode/mcp.json`

The VS Code MCP config also defines:

```json
"MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite"
```

[SOURCE: `.vscode/mcp.json:11-29`]

## 3. Exact priority order in `resolve_database_path()`

The runtime resolution order in `vector-index-store.ts` is:

```ts
function resolve_database_path() {
  if (process.env.MEMORY_DB_PATH) {
    return process.env.MEMORY_DB_PATH;
  }

  const embeddings = embeddingsProvider;
  const profile = embeddings.getEmbeddingProfile();

  if (!profile || !('getDatabasePath' in profile)) {
    return DEFAULT_DB_PATH;
  }

  return (profile as { getDatabasePath: (dir: string) => string }).getDatabasePath(DEFAULT_DB_DIR);
}
```

That means the exact priority order is:

1. `process.env.MEMORY_DB_PATH`
2. otherwise `embeddings.getEmbeddingProfile()?.getDatabasePath(DEFAULT_DB_DIR)`
3. otherwise `DEFAULT_DB_PATH`

`DEFAULT_DB_PATH` itself is also defined as:

```ts
export const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH || DATABASE_PATH;
```

So when `MEMORY_DB_PATH` is present, the override wins cleanly and early.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:274-290`]

## 4. What happens when `MEMORY_DB_PATH` is explicitly set

I ran an executable proof from `mcp_server/` with:

```bash
MEMORY_DB_PATH=database/context-index.sqlite node --input-type=module ...
```

The script:

1. imported `./dist/api/search.js`
2. called `vectorIndex.initializeDb()`
3. read one embedding from `vec_memories`
4. called `vectorIndex.vectorSearch(embedding, { limit: 5 })`

Result:

```json
{
  "ok": true,
  "envDbPath": "database/context-index.sqlite",
  "activeDbPath": "database/context-index.sqlite",
  "resultCount": 5,
  "topIds": [111, 106, 1, 1804, 164]
}
```

So explicit pinning works as expected. When `MEMORY_DB_PATH` is set, the search API reads from the populated legacy DB and returns results.

[SOURCE: live runtime probe on 2026-04-01 using `./mcp_server/dist/api/search.js`]

## 5. Live DB contents

Using the MCP server search layer with `sqlite-vec` loaded, I counted rows in both files:

### 5.1 Legacy DB

```json
{
  "dbPath": "database/context-index.sqlite",
  "counts": {
    "memory_index": 1728,
    "active_projection": 1708,
    "vec_memories": 1721
  }
}
```

### 5.2 Provider-specific Voyage DB

```json
{
  "dbPath": "database/context-index__voyage__voyage-4__1024.sqlite",
  "counts": {
    "memory_index": 0,
    "active_projection": 0,
    "vec_memories": 0
  }
}
```

This confirms the populated legacy DB versus empty provider-specific DB split.

[SOURCE: live runtime probe on 2026-04-01 using `./mcp_server/dist/api/search.js`]

## 6. Why provider initialization can change the DB path

The embedding provider is lazy. In `shared/embeddings.ts`:

```ts
let providerInstance: IEmbeddingProvider | null = null;
...
async function getProvider(): Promise<IEmbeddingProvider> {
  if (providerInstance) {
    ...
    return providerInstance;
  }
  ...
  providerInstance = await createEmbeddingsProvider({ warmup: false });
  ...
  return providerInstance;
}
```

And `getEmbeddingProfile()` is side-effect free:

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
- after provider creation, `getEmbeddingProfile()` returns a live profile

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:364-417`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:839-849`]

## 7. Where the provider-specific DB filename comes from

In `shared/embeddings/profile.ts`, the profile-specific DB path is built like this:

```ts
getDatabasePath(baseDir: string): string {
  if (this.provider === 'hf-local' &&
      this.model.includes('nomic-embed-text') &&
      this.dim === 768) {
    return `${baseDir}/context-index.sqlite`;
  }
  return `${baseDir}/context-index__${this.slug}.sqlite`;
}
```

For a Voyage profile:

- provider = `voyage`
- model = `voyage-4`
- dim = `1024`

the resulting path is:

- `context-index__voyage__voyage-4__1024.sqlite`

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:47-71`]

## 8. Startup and rebind behavior in `context-server.ts` and `db-state.ts`

### 8.1 Startup

At startup, `context-server.ts` does:

1. resolve startup embedding config
2. set `EMBEDDING_DIM`
3. call `vectorIndex.initializeDb()`
4. get the DB handle
5. initialize `hybridSearch` against that DB handle

Relevant lines:

```ts
process.env.EMBEDDING_DIM = String(
  startupEmbeddingConfig?.dimension ?? getStartupEmbeddingDimension(),
);
...
vectorIndex.initializeDb();
...
const database = vectorIndex.getDb();
...
hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);
```

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1360-1368`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1417-1459`]

### 8.2 Rebind after external DB update

`checkDatabaseUpdated()` in `db-state.ts` watches the `.db-updated` marker and can call `reinitializeDatabase()`:

```ts
if (updateTime > lastDbCheck) {
  const rebindSucceeded = await reinitializeDatabase(updateTime);
  ...
}
```

`reinitializeDatabase()` closes the DB, calls `vectorIndex.initializeDb()` again, then rebinds consumers:

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

So a later reinitialize can reopen the DB using the current runtime path-resolution logic, not necessarily the original startup choice.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:217-233`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:245-293`]

## 9. Does the ingest/indexer process write to a different DB than the search server reads from?

## Short answer

Yes, it can.

The script-side indexer is structurally capable of drifting onto a different DB than the MCP search server if the two processes do not share the same `MEMORY_DB_PATH` environment.

## Why

`memory-indexer.ts` does two important things in this order:

1. generate an embedding
2. then write via `vectorIndex.indexMemory(...)`

Relevant code:

```ts
embedding = await generateDocumentEmbedding(weightedEmbeddingInput);
...
memoryId = vectorIndex.indexMemory({ ... });
```

[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:72-92`]  
[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:159-172`]

The embeddings module used by scripts is just a re-export of shared embeddings:

```ts
export * from '@spec-kit/shared/embeddings';
```

[SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/embeddings.ts:1-9`]

And `index_memory(...)` defaults to:

```ts
database: Database.Database = initialize_db(),
```

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:153-156`]

That means:

- if the indexer process starts **without** `MEMORY_DB_PATH`
- and `generateDocumentEmbedding(...)` initializes the provider first
- then the later `initialize_db()` call inside `index_memory(...)` can resolve to the provider-specific DB

## Executable proof

I ran a drift proof in a fresh process with `MEMORY_DB_PATH` explicitly unset:

1. call `initializeDb()` before provider init -> path was `context-index.sqlite`
2. call `generateDocumentEmbedding(...)` to lazily create the Voyage provider
3. call `initializeDb()` again -> path switched to `context-index__voyage__voyage-4__1024.sqlite`

Observed output:

```json
{
  "coldPath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite",
  "warmPath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite"
}
```

So the split-brain risk is not theoretical. It is reproducible in one process whenever `MEMORY_DB_PATH` is absent.

[SOURCE: live runtime probe on 2026-04-01 with `env -u MEMORY_DB_PATH node --input-type=module ...`]

## 10. Final root cause chain

This is the complete root cause chain with the current evidence set:

1. `resolve_database_path()` in `vector-index-store.ts` chooses DB path in this order: `MEMORY_DB_PATH` -> embedding profile path -> default legacy path.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:277-290`]

2. The embedding provider is lazy, and `getEmbeddingProfile()` only returns a profile **after** provider creation.  
   [SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:364-417`]  
   [SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings.ts:839-849`]

3. A Voyage profile maps to `context-index__voyage__voyage-4__1024.sqlite`.  
   [SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:63-71`]

4. The provider-specific Voyage DB in this workspace is empty: `memory_index = 0`, `active_memory_projection = 0`, `vec_memories = 0`.  
   [SOURCE: live runtime probe on 2026-04-01]

5. The legacy DB is populated: `memory_index = 1728`, `active_memory_projection = 1708`, `vec_memories = 1721`.  
   [SOURCE: live runtime probe on 2026-04-01]

6. `checkDatabaseUpdated()` and `reinitializeDatabase()` can reopen the DB later, and that reopen reuses the same path-resolution logic.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:217-233`]  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:245-293`]

7. There is no migration or backfill step that copies legacy data into the provider-specific DB. The schema/bootstrap logic only initializes the currently opened database.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:749-838`]  
   [SOURCE: evidence from live DB counts above]

8. The script-side indexer generates embeddings before calling `vectorIndex.indexMemory(...)`, so in an unpinned process it can initialize the provider and then write into the provider-specific DB.  
   [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:72-92`]  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:153-156`]

9. The currently running MCP server is **not** suffering from this drift right now because it was launched with `MEMORY_DB_PATH=context-index.sqlite`.  
   [SOURCE: `opencode.json:19-38`]  
   [SOURCE: live process env probe on 2026-04-01]

## 11. FINAL SYNTHESIS

The original root cause hypothesis was directionally correct but needed one final refinement:

### What is definitively true

- The codebase does contain a real path-selection bug pattern.
- Without `MEMORY_DB_PATH`, DB selection is not stable. It depends on mutable runtime state: whether the lazy embedding provider singleton already exists.
- That state change can switch the process from the populated legacy DB to the empty provider-specific Voyage DB.
- There is no backfill into that provider-specific DB, so search returns `0` and indexing/search processes can diverge.

### What is **not** true for the currently running MCP server

- The live MCP server is **not currently ignoring** `MEMORY_DB_PATH`.
- The launcher config sets it.
- The running processes inherited it.
- An explicit runtime test showed that pinning works and returns real search results.

### The actual production-risk statement

The production risk is **configuration inconsistency across processes**, not simply "the launcher pin is broken."

More precisely:

> The MCP server is safe today because it is pinned to `context-index.sqlite`. The remaining bug is that other processes, especially script-side indexing paths, can start without that pin, create the Voyage provider lazily, and then read or write `context-index__voyage__voyage-4__1024.sqlite` instead. Because that DB is empty and there is no migration, this creates a split-brain system where some processes query the populated legacy DB and others query or write the empty provider-specific DB.

### Recommended fix direction

The safest fix direction is to remove stateful DB-path selection as a runtime side effect and make DB choice explicit and uniform across all processes.

## 12. Remediation options

### Option 1: Make `MEMORY_DB_PATH` mandatory and fail closed when absent

**Change**

- Require all MCP server and indexing entrypoints to set `MEMORY_DB_PATH`
- fail startup or indexing early if it is absent
- stop falling back to provider-derived DB filenames in production paths

**Pros**

- smallest behavioral change
- lowest implementation risk
- preserves the existing populated legacy DB
- immediately eliminates split-brain across processes

**Cons**

- keeps the old single-file DB model
- provider-specific DB support becomes effectively disabled unless explicitly managed elsewhere
- does not solve migration for teams that want per-provider stores

**Best when**

- immediate incident containment is the priority
- the system should continue using the legacy DB for now

### Option 2: Make DB path explicit in code and pass it through all call sites

**Change**

- stop calling `initializeDb()` without a path in critical entrypoints
- resolve the DB path once at process startup
- inject that exact DB handle or explicit path into search, save, and indexing code
- avoid hidden path changes based on provider singleton state

**Pros**

- fixes the architectural root cause
- removes mutable hidden behavior
- makes process behavior auditable and deterministic
- works whether the chosen DB is legacy or provider-specific

**Cons**

- broader refactor
- touches more startup and indexing paths
- requires careful audit of every implicit `initialize_db()` default

**Best when**

- the goal is a robust long-term fix
- a moderate refactor is acceptable

### Option 3: Support provider-specific DBs properly with migration/backfill

**Change**

- keep provider-specific DB naming
- add a migration/backfill step that copies or rebuilds legacy data into the provider-specific DB before it becomes active
- gate activation until the target DB is populated and validated

**Pros**

- aligns storage with provider/dimension-specific vector stores
- supports future multi-provider operation cleanly
- resolves the empty-DB failure mode without forcing legacy-only behavior

**Cons**

- highest implementation complexity
- requires explicit migration semantics and validation
- likely needs re-embedding if dimensions differ
- still needs deterministic process-level path coordination to avoid split-brain during rollout

**Best when**

- provider-specific storage is a real product goal
- the team is willing to do a controlled migration

## 13. Recommendation

Recommended sequence:

1. **Immediate containment**: adopt **Option 1** now for all entrypoints, including indexing scripts.  
2. **Structural fix**: move to **Option 2** so DB selection becomes explicit and stable.  
3. **Only if provider-specific stores are a real requirement**: implement **Option 3** as a deliberate migration project, not as implicit runtime behavior.

That sequence fixes the real bug quickly without blocking a better architecture later.
