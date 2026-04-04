---
title: "MCP Server Database Storage"
description: "Runtime SQLite storage for memory, structural code graph, vectors, FTS, and coordination files."
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

`database/` is the canonical runtime persistence location for the default MCP server configuration in this repository.

The MCP server resolves its default database directory through `shared/paths.ts` and `core/config.ts`, which point to `mcp_server/database/` unless `MEMORY_DB_PATH`, `SPEC_KIT_DB_DIR`, or `SPECKIT_DB_DIR` override it at runtime.

- Tracked in repo (source view): `.db-updated`, `.gitkeep`, `README.md`.
- Runtime-generated (canonical): `database/context-index.sqlite`, `database/code-graph.sqlite`, and their WAL sidecars (`-wal`, `-shm`).
- Embedding-profile database: `context-index__voyage__voyage-4__1024.sqlite` (and `-wal`, `-shm` sidecars) — profile-specific vector store.
- Evaluation database: `speckit-eval.db` (and `-wal`, `-shm` sidecars) — stores ablation/baseline evaluation results.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


- Primary table set includes `memory_index`, `vec_memories`, `memory_fts`, `checkpoints`, and `config`.
- Structural code-graph persistence lives in the separate `code-graph.sqlite` database with `code_files`, `code_nodes`, `code_edges`, and `code_graph_metadata`.
- Document-type indexing alignment:
  - `memory_index.document_type` and `memory_index.spec_level` are part of schema v13.
  - Spec document indexing is first-class (not memory-only).
  - Anchor-based retrieval applies to indexed spec docs.
- `.db-updated` is used by `core/db-state.ts` to detect external writes and reinitialize connections.
- Code-graph metadata stores freshness-relevant values such as `last_git_head`.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES


- Reinit safety is handled in `core/db-state.ts` (mutex + dependency rebind).
- Rate-limit timestamp is persisted in DB `config` table (`last_index_scan`).
- Document metadata remains preserved across update/reinforce/index paths (document-type indexing hardening).


<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:operational-notes -->
## 4. OPERATIONAL NOTES


- Database files are intentionally not committed; only control files are tracked.
- Primary memory index: `database/context-index.sqlite`.
- Structural code-graph index: `database/code-graph.sqlite`.
- Embedding-profile database: `context-index__voyage__voyage-4__1024.sqlite` stores profile-specific vectors (naming convention: `context-index__<provider>__<model>__<dims>.sqlite`).
- Evaluation database: `speckit-eval.db` stores ablation and baseline evaluation results from `scripts/evals/`.
- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
- Structural reads (`code_graph_query`, `code_graph_context`) can perform bounded inline selective refresh against `code-graph.sqlite` when the stale set is small enough.
- Empty or broadly stale structural states still require explicit `code_graph_scan` to rebuild the graph database.
- For reindex operations, see the canonical runbook at [`scripts/memory/README.md`](../../scripts/memory/README.md).


<!-- /ANCHOR:operational-notes -->
<!-- ANCHOR:related -->
## 5. RELATED


- `../core/README.md`
- `../handlers/README.md`
- `../../references/memory/memory_system.md`
<!-- /ANCHOR:related -->
