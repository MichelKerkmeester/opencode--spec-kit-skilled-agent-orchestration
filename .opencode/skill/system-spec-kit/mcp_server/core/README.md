---
title: "MCP Server Core Modules"
description: "Runtime configuration, database-state coordination, and shared rebind hooks for the MCP server."
trigger_phrases:
  - "core modules"
  - "db state"
  - "resolve database paths"
---

# MCP Server Core Modules

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. RELATED](#3--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`core/` is the shared runtime foundation used by handlers, search modules, hooks, and formatters.

Files in this directory:

- `config.ts` - runtime path resolution, input limits, batch settings, allowed-path policy, and lazy cognitive config access.
- `db-state.ts` - current DB dependencies, readiness tracking, reconnect handling, cache state, and database rebind listeners.
- `index.ts` - barrel exports for the public core surface.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE

- `config.ts` exports `resolveDatabasePaths()` and the canonical `DATABASE_DIR`, `DATABASE_PATH`, and `DB_UPDATED_FILE` values.
- Database-directory resolution honors runtime overrides through `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR`, then falls back to the shared-path default.
- `config.ts` also exposes the lazily parsed `COGNITIVE_CONFIG` and `getCognitiveConfig()` bridge for `configs/cognitive.ts`.
- `db-state.ts` owns `init()`, `checkDatabaseUpdated()`, `reinitializeDatabase()`, embedding-readiness state, constitutional cache accessors, and `registerDatabaseRebindListener()`.
- Reconnect flows are mutex-protected so handlers and search modules can safely rebind their DB-backed dependencies after external updates.

<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:related -->
## 3. RELATED

- `../database/README.md`
- `../handlers/README.md`
- `../configs/README.md`

<!-- /ANCHOR:related -->
