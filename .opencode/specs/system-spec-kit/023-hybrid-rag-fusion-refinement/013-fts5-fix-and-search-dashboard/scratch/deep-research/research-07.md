# Research Iteration 7: Why `vector_search` returned 0 despite valid embeddings and 1701 vector rows

## Question

Why did `vector_search` return `0` results even though:

- query embedding generation succeeded,
- `vec_memories` contained 1721 rows,
- the `active_memory_projection` join still left 1701 active vector rows?

Was the problem:

- A. dimension mismatch,
- B. `sqlite-vec` not loaded,
- C. corrupted/all-zero stored vectors,
- D. overly aggressive `embedding_status = 'success'` filtering,
- E. similarity threshold too tight?

## Short answer

**None of A/C/D/E explain the observed `0` results on the live populated DB.**

The strongest current explanation is:

> the earlier `0`-result probe searched the **wrong SQLite database file**.

There are **two DB files** in this environment:

- populated legacy DB: `database/context-index.sqlite`
- provider-specific DB: `database/context-index__voyage__voyage-4__1024.sqlite`

The provider-specific DB is effectively empty:

- `memory_index = 0`
- `active_memory_projection = 0`
- `vec_memories = 0`

If the embeddings provider is initialized **before** `initialize_db()` resolves the path, `vector-index-store.ts` uses the provider profile’s `getDatabasePath()` and switches to the provider-specific filename. For `voyage-4` at `1024` dims, that means:

- `context-index__voyage__voyage-4__1024.sqlite`

That exact reproduction from repository root yielded:

- resolved DB path = `.../context-index__voyage__voyage-4__1024.sqlite`
- `vector_search(..., minSimilarity: 30)` -> `0`

When I explicitly forced the populated legacy DB:

- `initialize_db('./database/context-index.sqlite')`

the same query returned normal vector matches at `minSimilarity` `0`, `10`, `17`, and `30`.

So the answer to the headline question is:

> `vector_search` returned `0` because the probe hit the **empty provider-specific DB**, not because the populated legacy DB had unusable vectors.

[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:63-71`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:277-290`]  
[SOURCE: live probe on 2026-04-01 from repo root: `generateQueryEmbedding('semantic')` followed by `vector_search(...)` resolved `get_db_path()` to `context-index__voyage__voyage-4__1024.sqlite` and returned `0`]  
[SOURCE: live probe on 2026-04-01 with explicit `initialize_db('./database/context-index.sqlite')` returned vector matches]  

## 1. Requested command results

### 1.1 `embedding_status = 'success'`

Requested command:

```sql
SELECT COUNT(*) FROM memory_index WHERE embedding_status = "success";
```

Result:

- **1728**

This immediately rules out hypothesis D as the primary explanation. The status filter is **not** eliminating almost everything at the table level.

[SOURCE: sqlite3 CLI probe on 2026-04-01 against `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`]

### 1.2 `vec_memories` type/length probe

Requested Node probe:

```js
SELECT typeof(embedding), length(embedding) FROM vec_memories LIMIT 1
```

Result:

```json
{
  "type": "blob",
  "length": 4096
}
```

That is consistent with:

- binary vector storage,
- `1024 * 4 = 4096` bytes,
- therefore **float32**, not float16.

So hypothesis C is not supported by current evidence: vectors are not empty blobs, and their stored size is exactly what a 1024-dim float32 vector should be.

[SOURCE: live Node probe on 2026-04-01 using `better-sqlite3` + `sqlite-vec` against `database/context-index.sqlite`]

## 2. What dimension does `get_embedding_dim()` return?

In `vector-index-store.ts`:

```ts
export function get_embedding_dim(): number {
  const startup_dim = getStartupEmbeddingDimension();
  ...
  if (embeddings.isProviderInitialized && embeddings.isProviderInitialized()) {
    const profile = embeddings.getEmbeddingProfile();
    if (profile && profile.dim) {
      return profile.dim;
    }
  }
  return startup_dim;
}
```

In the current runtime, live probes showed:

- provider = `voyage`
- model = `voyage-4`
- embedding length = **1024**
- `expectedDim = get_embedding_dim()` = **1024**

So hypothesis A is **not** supported for the populated live DB path I tested:

- query embedding dimension = 1024
- vec metadata dimension = 1024
- vec schema dimension = 1024

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:103-123`]  
[SOURCE: live Node probe on 2026-04-01 showing `embeddingLength: 1024`, `expectedDim: 1024`, and `vec_metadata.embedding_dim = 1024`]  

## 3. What does the schema expect?

In `vector-index-schema.ts`, `vec_memories` is created as:

```ts
CREATE VIRTUAL TABLE vec_memories USING vec0(
  embedding FLOAT[${embedding_dim}]
)
```

In the live DB, the stored schema is:

```sql
CREATE VIRTUAL TABLE vec_memories USING vec0(
        embedding FLOAT[1024]
      )
```

So the table expects:

- **`FLOAT[1024]`**
- which corresponds to float32 vector storage

and the companion metadata row says:

- `embedding_dim = 1024`

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2361-2379`]  
[SOURCE: live SQLite/Node probe on 2026-04-01 reading `sqlite_master.sql` and `vec_metadata`]  

## 4. Is `sqlite-vec` loaded?

### 4.1 In raw `sqlite3` CLI

This command:

```sql
SELECT sql FROM sqlite_master WHERE name='vec_memories';
SELECT key || '=' || value FROM vec_metadata ORDER BY key;
SELECT COUNT(*) FROM vec_memories;
SELECT COUNT(*) FROM vec_memories vm JOIN active_memory_projection p ON p.active_memory_id = vm.rowid;
```

produced:

- vec schema SQL printed successfully
- `embedding_dim=1024`
- then:

```text
Error: in prepare, no such module: vec0
```

That means the standalone `sqlite3` CLI did **not** have the `sqlite-vec` module loaded, even though the DB contains a `vec0` virtual table.

So hypothesis B is **true for raw sqlite3 CLI**, but that is **not the runtime path used by the Node server**.

[SOURCE: sqlite3 CLI probe on 2026-04-01 against `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`]

### 4.2 In Node runtime

In Node with:

```js
import * as sqliteVec from 'sqlite-vec';
sqliteVec.load(db);
```

the live probe reported:

- `sqliteVecLoaded: true`
- `vectorSearchAvailable: true`

and direct `vector_search()` calls succeeded.

So hypothesis B is **false for the actual runtime/search environment**.

[SOURCE: live Node probe on 2026-04-01 using `better-sqlite3` + `sqlite-vec`]  
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:795-804`]  

## 5. Direct `vector_search` on the live populated DB

I ran a direct probe against the populated legacy DB:

```ts
const storeDb = initialize_db('./database/context-index.sqlite');
const rows = await vector_search(embedding, {
  limit: 5,
  minSimilarity: 0,
  includeConstitutional: false
}, storeDb);
```

Result:

- **5 matches** at `minSimilarity: 0`

Top results included similarities around:

- `77.69`
- `76.83`
- `76.39`

I also repeated this for query `semantic` at thresholds `0`, `10`, `17`, `30` and got matches at all thresholds. Raw cosine-distance SQL on the same DB also showed top similarities around:

- `71.87`
- `71.47`
- `70.69`

So hypothesis E is **not** the explanation for the populated DB:

- the threshold is not too tight,
- even `30` is well below the observed nearest-neighbor similarities.

[SOURCE: live Node probe on 2026-04-01 with explicit `initialize_db('./database/context-index.sqlite')`]  
[SOURCE: live raw cosine SQL probe on 2026-04-01 using `vec_distance_cosine(...)` against `database/context-index.sqlite`]  

## 6. The actual root cause: database path switching

This is the key mechanism.

### 6.1 Path selection logic

`vector-index-store.ts` resolves the DB path like this:

```ts
function resolve_database_path() {
  if (process.env.MEMORY_DB_PATH) {
    return process.env.MEMORY_DB_PATH;
  }

  const profile = embeddings.getEmbeddingProfile();
  if (!profile || !('getDatabasePath' in profile)) {
    return DEFAULT_DB_PATH;
  }

  return profile.getDatabasePath(DEFAULT_DB_DIR);
}
```

And in `shared/embeddings/profile.ts`:

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

For `voyage-4` at `1024`, that means:

- `context-index__voyage__voyage-4__1024.sqlite`

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:277-290`]  
[SOURCE: `.opencode/skill/system-spec-kit/shared/embeddings/profile.ts:63-71`]  

### 6.2 Reproduction of the failure mode

From repository root, I ran:

1. `generateQueryEmbedding('semantic')`
2. `vector_search(embedding, { limit: 5, minSimilarity: 30, includeConstitutional: false })`
3. `get_db_path()`

Observed output:

```json
{
  "resolvedDbPath": ".../.opencode/skill/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite",
  "count": 0
}
```

This exactly reproduces the confusing symptom:

- valid embedding
- vector search available
- zero results

But it happened because the default search path went to the **empty provider-specific DB**, not the populated legacy DB.

[SOURCE: live probe on 2026-04-01 from repo root using `dist/lib/providers/embeddings.js`, `dist/lib/search/vector-index-queries.js`, and `dist/lib/search/vector-index-store.js`]  

### 6.3 Proof by comparing both DB files

I compared both SQLite files.

Populated legacy DB:

- `database/context-index.sqlite`
- `memory_index = 1728`
- `active_memory_projection = 1708`
- `vec_memories = 1721`

Provider-specific DB:

- `database/context-index__voyage__voyage-4__1024.sqlite`
- `memory_index = 0`
- `active_memory_projection = 0`
- `vec_memories = 0`

That is the smoking gun.

[SOURCE: live DB comparison on 2026-04-01 using `better-sqlite3` + `sqlite-vec`]  

## 7. Answering A-E directly

### A. Embedding dimension mismatch?

**No, not for the populated DB path.**

- query embedding length = 1024
- `get_embedding_dim()` = 1024
- `vec_metadata.embedding_dim` = 1024
- `vec_memories` schema = `FLOAT[1024]`

### B. `sqlite-vec` not loaded?

**Only in raw sqlite3 CLI, not in the Node runtime.**

- raw `sqlite3` CLI: `no such module: vec0`
- Node runtime + `sqlite-vec.load(db)`: works

So this is not the explanation for runtime `vector_search`.

### C. Stored embeddings corrupted / all zeros?

**No evidence of that.**

- storage type = `blob`
- length = `4096`
- raw bytes non-zero
- raw cosine search returns meaningful similarity scores

### D. `embedding_status = 'success'` too aggressive?

**No.**

- `memory_index WHERE embedding_status='success'` = `1728`
- active join still leaves `1701` vector rows

### E. Similarity threshold too tight?

**No, not on the populated DB.**

- top similarities are around `70-78`
- results remain non-empty at thresholds `0`, `10`, `17`, and `30`

## Final conclusion

The core mystery is resolved:

`vector_search` returned `0` not because the vectors were bad, missing, wrong-dimension, or over-filtered, but because the probe resolved to a **different database file** than the one that contained the 1701 active vectors.

The populated file is:

- `context-index.sqlite`

The empty file is:

- `context-index__voyage__voyage-4__1024.sqlite`

The path switch happens because once the embeddings provider profile is initialized, `resolve_database_path()` can route searches to the provider-specific DB filename.

## Best next step

The next highest-value investigation is:

1. identify where production/runtime code is expected to use legacy `context-index.sqlite` versus provider-specific DB files,
2. determine whether the indexing pipeline and the search pipeline are writing/reading **different files**,
3. decide whether the fix should be:
   - force one canonical DB path via `MEMORY_DB_PATH`, or
   - migrate/index into the provider-specific DB consistently, or
   - make search/index path selection deterministic and visible in logs.
