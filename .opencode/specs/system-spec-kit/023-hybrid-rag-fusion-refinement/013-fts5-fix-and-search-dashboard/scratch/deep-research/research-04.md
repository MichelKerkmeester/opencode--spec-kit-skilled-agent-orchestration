# Research Iteration 4: `active_memory_projection` reality check

## Question

Is the `JOIN active_memory_projection p ON p.active_memory_id = m.id` filtering out **all** vector search results?

## Direct database counts

Using the SQLite database at:

- `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`

I ran the requested counts.

### Raw counts

- `SELECT COUNT(*) FROM active_memory_projection` → **1708**
- `SELECT COUNT(*) FROM memory_index` → **1728**
- `SELECT COUNT(*) FROM vec_memories` via a plain `sqlite3` CLI connection → **failed** with `no such module: vec0`

That third failure is important: `vec_memories` is a sqlite-vec virtual table, so plain `sqlite3` on this machine cannot read it unless the sqlite-vec extension is loaded. This means the user's requested CLI probe cannot directly validate vector row presence by itself.

To compensate, I re-ran the `vec_memories` count through the same runtime dependency the app uses (`better-sqlite3` + `sqlite-vec`). That produced:

- `vec_memories` row count → **1721**

Sources:

- Command result from `sqlite3 ... COUNT(*) FROM active_memory_projection`
- Command result from `sqlite3 ... COUNT(*) FROM memory_index`
- Command result from `sqlite3 ... COUNT(*) FROM vec_memories` (`no such module: vec0`)
- Runtime probe using `node`, `better-sqlite3`, and `sqlite-vec`

## Key conclusion

**No — the active projection JOIN is not filtering out all results.**

The table is populated:

- `memory_index`: **1728** rows
- `active_memory_projection`: **1708** rows
- `vec_memories`: **1721** rows

So the active projection JOIN narrows the working set from all historical memory versions down to active versions, but it does **not** collapse the candidate set to zero globally.

## Stronger join diagnostics

I ran a few direct coverage checks in the sqlite-vec-enabled runtime:

- `memory_index m JOIN active_memory_projection p ON p.active_memory_id = m.id` → **1708** rows
- `memory_index m JOIN active_memory_projection p ... JOIN vec_memories v ON v.rowid = m.id` → **1701** rows
- `active_memory_projection` rows with no matching `memory_index` row → **0**
- `active_memory_projection` rows with no matching `vec_memories` row → **7**

This is the most important result from the iteration:

### The projection join is healthy enough to return many rows

If `active_memory_projection` were empty or structurally broken, those joins would be `0`.

Instead:

- projection→memory coverage is **1708 / 1708**
- projection→vector coverage is **1701 / 1708**

So the real gap is **7 active projected memories that do not currently have a vector row**, not a globally empty projection table.

## What `active_memory_projection` is for

`active_memory_projection` is defined as a compact table of the currently active memory version per logical key:

```sql
CREATE TABLE IF NOT EXISTS active_memory_projection (
  logical_key TEXT PRIMARY KEY,
  root_memory_id INTEGER NOT NULL,
  active_memory_id INTEGER NOT NULL UNIQUE,
  updated_at TEXT NOT NULL
)
```

The schema initializer also creates an index on `active_memory_id`:

```sql
CREATE INDEX IF NOT EXISTS idx_active_memory_projection_active
  ON active_memory_projection(active_memory_id)
```

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1357-1403`

## How the table gets populated

`lineage-state.ts` owns the write path.

### 1. Projection upsert helper

`upsertActiveProjection()`:

- first deletes any stale row that points the same `active_memory_id` at a different `logical_key`
- then performs an upsert keyed by `logical_key`

```ts
DELETE FROM active_memory_projection WHERE active_memory_id = ? AND logical_key != ?
INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
VALUES (?, ?, ?, ?)
ON CONFLICT(logical_key) DO UPDATE SET
  root_memory_id = excluded.root_memory_id,
  active_memory_id = excluded.active_memory_id,
  updated_at = excluded.updated_at
```

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:400-420`

### 2. Projection is updated inside lineage transition transaction

`recordLineageTransition()`:

- calls `ensureLineageTables(database)`
- wraps predecessor update, lineage insert, and projection upsert in a transaction
- inserts into `memory_lineage`
- then calls `upsertActiveProjection(...)`

```ts
database.prepare(`INSERT INTO memory_lineage ...`).run(...);
upsertActiveProjection(database, logicalKey, rootMemoryId, memoryId, validFrom);
```

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:666-803`
- especially `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:678-679`
- and `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:749-776`

### 3. Append-only save path inserts vector row before lineage transition

When a new append-only memory row is created, `insertAppendOnlyMemoryIndexRow()` inserts into `vec_memories` if an embedding exists and sqlite-vec is available:

```ts
if (embedding && sqlite_vec_available()) {
  database.prepare(`
    INSERT INTO vec_memories (rowid, embedding)
    VALUES (?, ?)
  `).run(BigInt(memoryId), to_embedding_buffer(embedding));
}
```

Then `createAppendOnlyMemoryRecord()` records the lineage transition, which in turn upserts `active_memory_projection`.

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:512-522`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:811-820`

## Why plain `sqlite3` misleads here

The failed CLI query against `vec_memories` is not evidence that the table is empty. It is evidence that:

- the table depends on sqlite-vec (`vec0` virtual table module)
- plain `sqlite3` in this shell does not have that module loaded

The application runtime does load sqlite-vec during DB initialization:

```ts
import * as sqliteVec from 'sqlite-vec';
...
sqliteVec.load(new_db);
```

If that load fails, the code warns and falls back to anchor-only/no-vector mode.

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:21`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:795-803`

## Relation to the reported search failure

The original hypothesis was:

> all vector searches return 0 because every query joins through `active_memory_projection`, and that table may be empty.

This iteration **rules out** that global explanation.

The vector-side join coverage numbers show:

- the projection table is populated
- the projection rows all map to real `memory_index` rows
- most projected rows (**1701**) also map to `vec_memories`

So the empty-candidate behavior must be explained by something narrower, for example:

1. query-time filtering in vector search beyond the active projection join
2. query embedding / distance threshold behavior
3. a failure path that bypasses or suppresses vector results for the specific failing request
4. the small but real set of active rows missing vector entries (**7 rows**)

## Notable anomaly: 7 active rows missing vectors

I queried the active rows with no `vec_memories` match. There are **7** such rows, all with `embedding_status = 'success'`.

Examples include:

- `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/research/research.md`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md`
- `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research/research/research.md`
- `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/019-architecture-remediation/decision-record.md`

That suggests a **vector/index integrity drift** class of bug:

- `memory_index.embedding_status` says success
- `active_memory_projection` marks the row active
- but `vec_memories` has no corresponding row

This could explain missing candidates for some memories, but not a universal zero-result failure, because **1701** projected rows still do have vectors.

## Bottom line

**Answer:** `active_memory_projection` is **not** filtering out all results.

It is populated and functioning as an active-version projection:

- `active_memory_projection` = **1708**
- `memory_index` = **1728**
- `vec_memories` = **1721** (when queried through sqlite-vec-enabled runtime)
- active projection rows with vectors = **1701**

So the iteration outcome is:

- **Hypothesis rejected**: the JOIN is not globally zeroing vector search
- **New lead**: investigate why some active rows are missing `vec_memories`, and inspect the specific query-time vector search path / filters that still yield zero candidates for the failing request

## Best next investigation

The highest-value next check is inside the actual vector search execution path, not the lineage projection table:

1. Inspect `vector-index-queries.ts` vector search predicates around the active projection join.
2. Check whether the failing query is being filtered by spec folder / archived / threshold / candidate limit conditions.
3. Investigate how the 7 `embedding_status='success'` but missing-vector rows were produced.
4. Compare a failing request against a direct vector query in the sqlite-vec-enabled runtime.

## Sources

- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:400-420`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:666-803`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:512-522`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:811-820`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1357-1403`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:795-803`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:535-579`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:87-123`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:446-470`
