# G1: libSQL as Stepping Stone

**Agent:** general-purpose | **Duration:** ~241s | **Tokens:** 81,883

## Key Findings

- libSQL and Turso Database are **diverging products**, not a single continuum
- `libsql` npm package is **near-drop-in** for better-sqlite3 (sync API!)
- All `.prepare().get()/.all()/.run()/.iterate()/.transaction()` work
- **NOT IMPLEMENTED:** `pragma()` (use `exec('PRAGMA ...')`), `function()`, `aggregate()`, `backup()`, `serialize()`, `pluck()`
- FTS5 fully supported but has **parameterized insert bug** (#1811 — TS client crashes on parameterized FTS5 inserts)
- `loadExtension()` works — sqlite-vec can be loaded during transition
- **Native vectors with DiskANN already in libSQL** — `F32_BLOB(N)` columns + `libsql_vector_idx`
- Migration estimate: Phase 1 (libsql swap) = 1-2 days, Phase 2 (native vectors) = 3-5 days
- `@libsql/client` is different: fully async, no prepare(), uses execute() — NOT the drop-in
- `libsql` npm package weekly downloads: ~100K
- `@libsql/client` weekly downloads: ~302K-732K
