# Research Iteration 1: hybrid-search db null hypothesis

## Hypothesis tested

`hybrid-search.ts` may be executing `ftsSearch()` with its module-level `db` still `null`, causing the hybrid pipeline to return zero FTS candidates even though direct SQLite FTS5 queries against `context-index.sqlite` succeed.

## Evidence found

1. `hybrid-search.ts` uses a module-level `db` that defaults to `null`, and `ftsSearch()` short-circuits to an empty result set when that `db` has not been initialized.

- `let db: Database.Database | null = null` is declared at module scope in `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:259`.
- `init(database, vectorFn, graphFn)` assigns that module variable via `db = database` in `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:308-316`.
- `ftsSearch()` exits immediately with `return []` if `!db || !isFtsAvailable()` in `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:446-450`.
- `isFtsAvailable()` also depends on the same `db` handle to query `sqlite_master` for `memory_fts` in `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:426-433`.

2. In the normal server startup path, `context-server.ts` initializes the vector-index database before calling `hybridSearch.init(...)`, and it explicitly throws if `vectorIndex.getDb()` is falsy.

- `main()` calls `vectorIndex.initializeDb()` before any hybrid search initialization in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1356-1359`.
- It then fetches `const database = vectorIndex.getDb()` and guards it with `if (!database) { throw new Error(...) }` in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1407-1410`.
- Only after that guard does it call `hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn)` in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1442-1448`.
- The server only begins serving stdio requests after this initialization sequence completes, at `await server.connect(transport)` in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1646-1648`.

3. The compiled distribution still contains the `hybridSearch.init(database, ...)` call, so the init wiring was not dropped during compilation.

- Compiled output shows `hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);` in `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js:1167-1170`.

4. The `database` value passed from `context-server.ts` is designed to be non-null at that point.

- `vector-index-store.ts`’s `get_db()` returns `initialize_db()`, not a nullable field, in `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:870-876`.
- `initialize_db()` either returns an existing shared DB, a cached connection, or creates and validates a new `better-sqlite3` connection before returning it in `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:749-839`.
- This means the `database` flowing through the normal startup path is expected to be a concrete `Database` object, not `undefined`/`null`.

5. I did not find an ESM import-order problem in the normal startup path, but I did find a separate lazy request-handler path that initializes `vectorIndex` without also calling `hybridSearch.init(...)`.

- `context-server.ts` imports `hybridSearch` once via `import * as hybridSearch from './lib/search/hybrid-search.js';` in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:74-79`; there is no alternate production import path for that module in the runtime code reviewed.
- In the request handler, if `dbInitialized` is false, the code only does:
  - `vectorIndex.initializeDb();`
  - `dbInitialized = true;`
  in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:790-795`.
- That request-handler fallback does **not** call `hybridSearch.init(...)`; the only explicit `hybridSearch.init(...)` call inside `context-server.ts` is the startup one at `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1448`.
- There is a rebind path in `core/db-state.ts` that can call `hybridSearch.init(database, ...)`, but it depends on `db-state` having already been initialized with `hybridSearch` and associated deps in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1361-1380`, then later rebinds through `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:160-168`.

## Conclusion

The narrow hypothesis "`db` is null during `ftsSearch()` because the normal `main()` startup path passes a null/undefined database into `hybridSearch.init()`" is **not supported** by the code.

The normal startup sequence is ordered correctly:
- initialize DB,
- retrieve non-null DB,
- call `hybridSearch.init(database, ...)`,
- then connect the server.

So if `ftsSearch()` is seeing `db === null`, the more plausible explanation is **not** the main startup wiring itself.

However, there **is** a credible secondary null-db / uninitialized-module risk in the request-handler lazy-init path: when `dbInitialized` is false during tool dispatch, `context-server.ts` initializes `vectorIndex` but does not also initialize `hybridSearch`. If the process can handle requests through that path without `main()` having completed the full initialization block, `hybrid-search.ts` could retain `db = null` and `ftsSearch()` would return `[]` exactly as observed.

## Next investigation recommendation

Investigate whether the failing hybrid-search trace is coming from the full `main()` startup path or from the request-handler lazy-init path.

Recommended next checks:

1. Add temporary instrumentation in `hybrid-search.ts` around `init()` and `ftsSearch()` to log whether `db` was ever assigned, plus a stable identifier like `db.name`/database path if available.
2. Add temporary instrumentation in `context-server.ts` request dispatch around `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:790-795` to log when the lazy `dbInitialized` branch runs.
3. Verify whether the runtime process handling the failing request is entering `main()` and reaching `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1448` before the first memory search request.
4. If the lazy path is reachable in production, patch it so the fallback branch also initializes `hybridSearch` (and related DB-bound consumers) from the freshly opened DB, not just `vectorIndex`.
