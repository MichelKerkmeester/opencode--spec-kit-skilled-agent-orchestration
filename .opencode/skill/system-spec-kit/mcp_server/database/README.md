---
title: "MCP Server Database Storage"
description: "Runtime SQLite storage for memory index data, vectors, FTS, and coordination files."
trigger_phrases:
  - "database"
  - "sqlite"
  - "vector embeddings"
---


# MCP Server Database Storage

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. HARDENING NOTES](#3--hardening-notes)
- [4. OPERATIONAL NOTES](#4--operational-notes)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

This section provides an overview of the MCP Server Database Storage directory.

`dist/database/` is the canonical runtime persistence location when the MCP server runs from `dist/context-server.js`.

`database/` is the source-level compatibility view. In this repository, `database/context-index.sqlite` points to `../dist/database/context-index.sqlite`.

- Tracked in repo (source view): `.db-updated`, `.gitkeep`, `README.md`.
- Runtime-generated (canonical): `dist/database/context-index.sqlite` and WAL sidecars (`-wal`, `-shm`).

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


- Primary table set includes `memory_index`, `vec_memories`, `memory_fts`, `checkpoints`, and `config`.
- Spec 126/127/129 alignment:
  - `memory_index.document_type` and `memory_index.spec_level` are part of schema v13.
  - Spec document indexing is first-class (not memory-only).
  - Anchor-based retrieval applies to indexed spec docs.
- `.db-updated` is used by `core/db-state.ts` to detect external writes and reinitialize connections.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES


- Reinit safety is handled in `core/db-state.ts` (mutex + dependency rebind).
- Rate-limit timestamp is persisted in DB `config` table (`last_index_scan`).
- Document metadata remains preserved across update/reinforce/index paths (Spec 126 hardening follow-up).


<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:operational-notes -->
## 4. OPERATIONAL NOTES


- Database files are intentionally not committed; only control files are tracked.
- Single-database policy (this environment): use `dist/database/context-index.sqlite` as the only authoritative SQLite file.
- Source-path compatibility remains available through `database/context-index.sqlite` (symlink to canonical path).
- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
- Use `../scripts/reindex-embeddings.ts` for forced rebuild workflows; it delegates to `../../scripts/dist/memory/reindex-embeddings.js` (source at `../../scripts/memory/reindex-embeddings.ts`).


<!-- /ANCHOR:operational-notes -->
<!-- ANCHOR:related -->
## 5. RELATED


- `../core/README.md`
- `../handlers/README.md`
- `../../references/memory/memory_system.md`
<!-- /ANCHOR:related -->
