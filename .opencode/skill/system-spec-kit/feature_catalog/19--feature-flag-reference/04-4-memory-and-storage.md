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
| `MEMORY_ALLOWED_PATHS` | _(appends to built-in allowlist)_ | string | `lib/search/vector-index-store.ts`, `lib/search/vector-index-schema.ts` | Colon-delimited extra filesystem roots allowed for memory reads and migration-time file validation. The runtime already allowlists `process.cwd()/specs`, `process.cwd()/.opencode`, `~/.claude`, and `process.cwd()` before appending env-provided paths. |
| `MEMORY_BASE_PATH` | `process.cwd()` | string | `core/config.ts`, `context-server.ts` | Base path used by core path resolution helpers for relative memory file locations. Separate from the vector-index store allowlist, which maintains its own built-in roots plus `MEMORY_ALLOWED_PATHS`. |
| `MEMORY_DB_DIR` | _(legacy compatibility only)_ | string | `lib/search/vector-index-store.ts`, `lib/eval/eval-db.ts` | Legacy directory setting retained for backward compatibility messaging. The canonical directory resolution path is `SPEC_KIT_DB_DIR` then `SPECKIT_DB_DIR`, with provider-specific derivation handled from the resolved database directory. |
| `MEMORY_DB_PATH` | _(override)_ | string | `lib/search/vector-index-store.ts` | Absolute override for the SQLite database file path. When set, it bypasses provider-derived database path resolution and wins over directory-based settings. |
| `SPECKIT_DB_DIR` | _(fallback)_ | string | `shared/config.ts` | Secondary database-directory env var checked after `SPEC_KIT_DB_DIR`. Used by shared config helpers and `.db-updated` resolution when the canonical env var is absent. |
| `SPEC_KIT_BATCH_DELAY_MS` | `100` | number | `core/config.ts` | Delay in milliseconds between processing batches during `memory_index_scan`. Prevents exhausting I/O resources on large workspaces by introducing a small pause between embedding generation batches. |
| `SPEC_KIT_BATCH_SIZE` | `5` | number | `core/config.ts` | Number of files processed per batch during `memory_index_scan`. Lower values reduce peak memory usage and API concurrency at the cost of longer scan times. |
| `SPEC_KIT_DB_DIR` | _(canonical directory override)_ | string | `shared/config.ts`, `core/config.ts` | Primary database-directory env var. It takes precedence over `SPECKIT_DB_DIR`; if neither is set, the shared config falls back to the package `mcp_server/database` directory and the vector store derives provider-specific filenames from that directory unless `MEMORY_DB_PATH` is set. |

---

## 3. SOURCE FILES

Source file references are included in the flag table above.

---

## 4. SOURCE METADATA

- Group: Feature Flag Reference
- Source feature title: 4. Memory and Storage
- Current reality source: FEATURE_CATALOG.md
