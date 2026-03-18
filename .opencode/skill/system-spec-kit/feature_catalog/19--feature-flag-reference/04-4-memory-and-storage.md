---
title: "4. Memory and Storage"
description: "This document captures the implemented behavior, source references, and validation scope for 4. Memory and Storage."
---

# 4. Memory and Storage

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 4. Memory and Storage.

These variables define where memory files and databases live and how indexing batches are processed. In practice, they control storage location, path safety boundaries, and scan throughput.

---

## 2. CURRENT REALITY

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `MEMORY_ALLOWED_PATHS` | _(cwd)_ | string | `tests/regression-010-index-large-files.vitest.ts` | Colon-separated list of filesystem paths that are allowlisted for memory file access. Used in path security validation to restrict which directories `memory_save` can read from. Defaults to `cwd` if not set. |
| `MEMORY_BASE_PATH` | _(cwd)_ | string | `core/config.ts` | Base path prepended to relative file paths when resolving memory file locations. Defaults to `process.cwd()` when not set. Determines the root of the allowed path tree. |
| `MEMORY_DB_DIR` | _(legacy fallback)_ | string | `lib/search/vector-index-store.ts` | Compatibility fallback for the database directory. Superseded by `SPEC_KIT_DB_DIR`. Precedence order: `SPEC_KIT_DB_DIR` > `MEMORY_DB_DIR` > default `database/` directory adjacent to the server root. |
| `MEMORY_DB_PATH` | _(derived)_ | string | `lib/search/vector-index-store.ts` | Full path to the SQLite database file. When set, it overrides the derived path from `SPEC_KIT_DB_DIR` or `MEMORY_DB_DIR`. Use it for provider-specific or non-default database locations. |
| `SPECKIT_DB_DIR` | _(fallback)_ | string | `shared/config.ts` | Fallback env var for the database directory, checked after `SPEC_KIT_DB_DIR`. Added in Phase 018 (CR-P1-8) to support the underscore-less naming convention. Precedence: `SPEC_KIT_DB_DIR` > `SPECKIT_DB_DIR` > default path. |
| `SPEC_KIT_BATCH_DELAY_MS` | `100` | number | `core/config.ts` | Delay in milliseconds between processing batches during `memory_index_scan`. Prevents exhausting I/O resources on large workspaces by introducing a small pause between embedding generation batches. |
| `SPEC_KIT_BATCH_SIZE` | `5` | number | `core/config.ts` | Number of files processed per batch during `memory_index_scan`. Lower values reduce peak memory usage and API concurrency at the cost of longer scan times. |
| `SPEC_KIT_DB_DIR` | _(server root)_ | string | `core/config.ts` | Directory where the SQLite database file is stored. Takes precedence over `MEMORY_DB_DIR`. Resolved relative to `process.cwd()` when set. Defaults to a `database/` directory adjacent to the server root. |

---

## 3. SOURCE FILES

Source file references are included in the flag table above.

---

## 4. SOURCE METADATA

- Group: Feature Flag Reference
- Source feature title: 4. Memory and Storage
- Current reality source: feature_catalog.md
