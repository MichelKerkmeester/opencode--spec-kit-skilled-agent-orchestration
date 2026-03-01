---
title: "MCP Server Core Modules"
description: "Configuration, database-state coordination, and shared runtime guards for the Spec Kit Memory MCP server."
trigger_phrases:
  - "core modules"
  - "mcp config"
  - "database state"
---


# MCP Server Core Modules

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. HARDENING NOTES](#3--hardening-notes)
- [4. RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

This section provides an overview of the MCP Server Core Modules directory.

`core/` is the shared runtime layer used by handlers, tools, and formatters.

- `config.ts`: path constants, input limits, batch config, cooldown values, and allowed base paths.
- `db-state.ts`: external DB update detection, reinit lifecycle, readiness state, and cache accessors.
- `index.ts`: barrel exports for `config.ts` and `db-state.ts`.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


- Input limits are centralized in `INPUT_LIMITS` and `MAX_QUERY_LENGTH`.
- File access boundaries are centralized in `ALLOWED_BASE_PATHS`.
- Index-scan cooldown is enforced via `INDEX_SCAN_COOLDOWN`.
- `checkDatabaseUpdated()` reads `.db-updated` and triggers safe reconnect.
- `init()` supports `vectorIndex`, `checkpoints`, `accessTracker`, `hybridSearch`, `sessionManager`, and `incrementalIndex` dependencies.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES


- BUG-001: external update signal support (`.db-updated`).
- HIGH-002: mutex around reinitialization to prevent concurrent reconnect races.
- BUG-005: persistent scan timestamp in DB `config` table.
- P4-12/P4-19: rebinds session and incremental modules after DB reconnect.
- P4-13: mutex resolve order fixed to avoid double-reinit race windows.


<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:related -->
## 4. RELATED


- `../database/README.md`
- `../handlers/README.md`
- `../utils/README.md`
<!-- /ANCHOR:related -->
