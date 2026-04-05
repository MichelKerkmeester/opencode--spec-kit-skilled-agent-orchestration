# Research Iteration 2: `isFtsAvailable()` and lazy-init path

## Scope

This iteration investigated two questions:

1. Whether `isFtsAvailable()` could be returning `false` because the `memory_fts` table is actually missing or empty.
2. Whether the lazy request-handler bootstrap path can race ahead of `main()` and leave `hybrid-search.ts` uninitialized.

## Part A - `isFtsAvailable()`

### What the function actually checks

`isFtsAvailable()` does not validate FTS health beyond a single `sqlite_master` existence lookup against the module-local `db` handle:

- It returns `false` immediately if `db` is falsy.
- Otherwise it runs `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`.
- Any thrown DB error is swallowed and also converted to `false`.

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:426-438`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:446-450`

### Live SQLite check against the current database file

I ran the requested checks directly against:

`/.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`

Results:

1. `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
   - Returned: `memory_fts`
2. `SELECT COUNT(*) FROM memory_fts`
   - Returned: `1728`

So the concrete on-disk database file currently in use **does contain** the `memory_fts` table, and it is **not empty**.

### Conclusion for Part A

For this database file, a `false` result from `isFtsAvailable()` is **not explained** by a missing or empty `memory_fts` table.

The remaining plausible explanations are:

1. `hybrid-search.ts` still has `db === null`.
2. `hybrid-search.ts` has a **different** DB handle/path than the file inspected here.
3. Its cached `db` handle is non-null but unusable/stale/closed, causing the `sqlite_master` query to throw and get swallowed.

Because `isFtsAvailable()` catches all DB errors and returns `false`, it conflates:

- "FTS table missing"
- "DB handle missing"
- "DB handle invalid/erroring"

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:426-438`
- SQLite check run on `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`

## Part B - lazy-init path and startup ordering

### The lazy request-handler path is real, but narrow

Inside the request dispatch path, there is still a lazy guard:

```ts
if (!dbInitialized) {
  vectorIndex.initializeDb();
  dbInitialized = true;
}
```

That branch initializes only the vector-index DB singleton. It does **not** call:

- `hybridSearch.init(...)`
- `initDbState(...)`
- any equivalent rebind helper directly

Source:

- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:790-795`

### `dbInitialized` is only set in two places

I searched for all runtime uses of `dbInitialized`. In production code, it is:

1. Declared false at module scope.
2. Set true in the lazy dispatch fallback.
3. Set true in `main()` immediately after `vectorIndex.initializeDb()`.

I found no reset back to `false`.

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1151-1152`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:792-795`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1356-1359`

### `main()` fully initializes search wiring before accepting stdio traffic

The normal startup sequence is:

1. `vectorIndex.initializeDb()`
2. `dbInitialized = true`
3. `initDbState({ vectorIndex, checkpoints, accessTracker, hybridSearch, ... })`
4. `const database = vectorIndex.getDb()`
5. `hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn)`
6. `await server.connect(transport)`

That ordering matters: the MCP server only starts serving stdio requests **after** the explicit `hybridSearch.init(...)` call.

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1356-1380`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1407-1452`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1646-1648`

### `db-state` is the actual rebind mechanism

`core/db-state.ts` is designed to keep DB-caching modules in sync after connection changes:

1. `init(deps)` stores references to `vectorIndex`, `hybridSearch`, etc.
2. It registers `vectorIndex.onDatabaseConnectionChange(...)`.
3. When a DB connection change is observed, it calls `rebindDatabaseConsumers(...)`.
4. That rebind path explicitly calls `hybridSearch.init(database, vectorIndex?.vectorSearch, graphSearchFnRef ?? null)`.

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:128-168`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:190-210`

The vector index side supports this by notifying listeners when the active DB connection changes:

- `on_database_connection_change(...)` registers listeners.
- `set_active_database_connection(...)` notifies them when the active connection/path changes.
- `initialize_db()` calls `set_active_database_connection(...)` when reusing or creating a connection.

Sources:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:394-419`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:437-441`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:749-839`

### Important nuance: the request handler already assumes `main()` has run

Before the lazy `if (!dbInitialized)` branch, the request handler first calls:

`await checkDatabaseUpdated();`

Source:

- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:744-747`

That matters because `checkDatabaseUpdated()` belongs to `db-state`, and if it needs to reinitialize while `db-state` has never been initialized with a `vectorIndex`, it throws:

- `if (!vectorIndex) { throw new Error('db-state not initialized: vector_index is null'); }`

Source:

- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:246-249`

So the lazy `dbInitialized` branch is **not** a full "safe to receive requests before startup finishes" bootstrap path. Earlier code in the same request path already depends on startup work having completed.

### Race-condition assessment

For the **normal stdio MCP server path**, I do **not** see evidence of a real race where tool calls can arrive before `main()` finishes initialization:

1. `main()` performs DB init and `hybridSearch.init(...)`.
2. Only afterward does it call `await server.connect(transport)`.
3. Request dispatch cannot happen until after that transport connection is established.

Therefore, under the standard launched-server flow, the lazy branch at `.opencode/.../context-server.ts:790-795` does **not** look like a credible explanation for first-request hybrid FTS failure by itself.

### What the lazy branch still means

The lazy fallback is still asymmetric and potentially dangerous in **nonstandard** execution contexts:

- embedded/test invocation paths,
- partial startup states,
- future refactors that accidentally make dispatch reachable earlier.

If that branch ever executes before `main()` has performed:

- `initDbState(...)`, and
- `hybridSearch.init(...)`,

then it opens the vector DB and flips `dbInitialized = true`, but leaves `hybrid-search.ts` with its module-local `db` untouched.

So the lazy path is a real footgun, but based on current startup ordering it appears more like a **defensive gap** than the most likely production race root cause.

## Overall conclusion

### Ruled out

1. The inspected `context-index.sqlite` file is not missing `memory_fts`.
2. The table is not empty (`1728` rows).
3. The normal stdio startup path does not appear to accept MCP requests before `hybridSearch.init(...)` runs.

### Still plausible

1. `hybrid-search.ts` is operating with a null, stale, or wrong DB handle at the moment `isFtsAvailable()` runs.
2. A nonstandard path is bypassing or partially executing the normal startup/rebind sequence.
3. An error during the `sqlite_master` probe is being swallowed and flattened into `false`.

## Best next step

The highest-value next check is targeted runtime instrumentation around:

1. `hybridSearch.init(...)`
2. `isFtsAvailable()`
3. `ftsSearch()`

Specifically log:

- whether `db` is null,
- whether the `sqlite_master` query throws,
- the active DB path/identity if obtainable,
- whether the lazy `!dbInitialized` branch ever actually fires in the failing runtime.

That should distinguish:

- null-handle failure,
- wrong-handle/path failure,
- swallowed DB-error failure,

without relying on static reasoning alone.
