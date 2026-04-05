# C1: Turso JS/TS SDK API Surface

**Agent:** general-purpose | **Duration:** ~271s | **Tokens:** 105,190

## Key Findings

- `@tursodatabase/database` has **both sync and async modes**
- Sync compat mode (`/compat` import) mirrors better-sqlite3 exactly: `.prepare().get()/.all()/.run()`
- Default `connect()` is async; compat uses `new Database(path)` sync pattern
- **NOT IMPLEMENTED:** `loadExtension()`, `function()`, `aggregate()`, `table()`, `backup()`, `serialize()`
- Named parameters work with `:`, `@`, `$` prefixes (same as better-sqlite3)
- Transaction API identical: `db.transaction(fn)` with `.deferred()/.immediate()/.exclusive()`
- TypeScript types weaker: `row()` returns `unknown`, `columns()` returns `any`
- No connection pooling (single-conn + AsyncLock, same as better-sqlite3)
- Three packages: `@tursodatabase/database` (sync+async), `@libsql/client` (async only, different API), `@tursodatabase/serverless` (HTTP only)
