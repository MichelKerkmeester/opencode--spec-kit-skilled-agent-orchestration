---
title: "Database Directory"
description: "Runtime location for SQLite database files used by the MCP server memory system."
trigger_phrases:
  - "database directory"
  - "sqlite database location"
  - "context index database"
---

# Database Directory

> Runtime location for SQLite database files used by the MCP server memory system.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. RELATED DOCUMENTS](#3--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This folder is the default storage location for SQLite databases created at runtime by the memory indexer. It does not contain source code.

**Path resolution:** `shared/config.ts` resolves this directory by walking up from `__dirname` to find `mcp_server/database/`. The path can be overridden with the `SPEC_KIT_DB_DIR` or `SPECKIT_DB_DIR` environment variable.

**Per-profile databases:** Each unique combination of `{provider, model, dimension}` produces its own SQLite file (via `EmbeddingProfile.getDatabasePath()`), preventing dimension-mismatch errors when switching providers.

**`.db-updated` file:** Contains a Unix timestamp (milliseconds) recording the last database modification. Used by the indexer to detect stale data.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File | Purpose |
| ---- | ------- |
| `.db-updated` | Timestamp marker for last database write (not source code) |
| `context-index.sqlite` | Legacy database created at runtime (HF Local, nomic, 768d) |
| `context-index__*__*__*.sqlite` | Per-profile databases created at runtime (provider, model, dimension in filename) |

Note: `.sqlite` files are generated at runtime. They are not committed to version control.

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:related -->
## 3. RELATED DOCUMENTS

| Document | Purpose |
| -------- | ------- |
| [shared/config.ts](../../config.ts) | Database directory resolution and `DB_UPDATED_FILE` export |
| [shared/paths.ts](../../paths.ts) | `DB_PATH` constant pointing to the default database |
| [shared/embeddings/profile.ts](../../embeddings/profile.ts) | Per-profile database path generation |
| [shared/embeddings/README.md](../../embeddings/README.md) | Embeddings factory with per-profile DB explanation |

<!-- /ANCHOR:related -->

---
