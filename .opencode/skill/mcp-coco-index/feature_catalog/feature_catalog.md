---
title: "mcp-coco-index: Feature Catalog"
description: "Unified current-state inventory for the mcp-coco-index semantic code search skill."
trigger_phrases:
  - "mcp-coco-index feature catalog"
  - "cocoindex catalog"
  - "semantic search catalog"
---

# mcp-coco-index: Feature Catalog

This document combines the current feature inventory for the `mcp-coco-index` skill into a single reference. The root catalog summarizes each capability area and links to per-feature files that carry implementation anchors, validation anchors and source metadata.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CLI COMMANDS](#2--cli-commands)
- [3. MCP SERVER](#3--mcp-server)
- [4. INDEXING PIPELINE](#4--indexing-pipeline)
- [5. DAEMON AND READINESS](#5--daemon-and-readiness)
- [6. SEARCH AND RANKING](#6--search-and-ranking)
- [7. PATCHES AND EXTENSIONS](#7--patches-and-extensions)
- [8. INSTALLATION TOOLING](#8--installation-tooling)
- [9. CONFIGURATION](#9--configuration)
- [10. VALIDATION AND TESTS](#10--validation-and-tests)

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `mcp-coco-index` feature surface. The skill provides semantic code search through a local `ccc` CLI, a daemon-backed MCP `search` tool, an indexing pipeline, readiness scripts, configuration references, fork-specific ranking extensions and validation coverage.

| Category | Coverage | Primary Runtime Surface |
|---|---:|---|
| CLI commands | 7 features | `01--cli-commands/` |
| MCP server | 4 features | `02--mcp-server/` |
| Indexing pipeline | 5 features | `03--indexing-pipeline/` |
| Daemon and readiness | 5 features | `04--daemon-and-readiness/` |
| Search and ranking | 6 features | `05--search-and-ranking/` |
| Patches and extensions | 6 features | `06--patches-and-extensions/` |
| Installation tooling | 4 features | `07--installation-tooling/` |
| Configuration | 5 features | `08--configuration/` |
| Validation and tests | 4 features | `09--validation-and-tests/` |

---

## 2. CLI COMMANDS

These entries cover the `ccc` command surface exposed by the Typer CLI. The CLI owns project setup, index lifecycle, local searches, MCP startup, reset behavior and daemon management.

### Project initialization

#### Description

Creates project and user settings for a new CocoIndex Code workspace.

#### Current Reality

`ccc init` exits early when the project is already initialized. Without `--force`, it warns when a parent directory already looks like the better project root, then writes default settings and leaves indexing to the next `ccc index` run.

#### Source Files

See [`01--cli-commands/01-project-initialization.md`](01--cli-commands/01-project-initialization.md) for full implementation and validation file listings.

---

### Index build

#### Description

Runs incremental indexing and prints final index statistics.

#### Current Reality

`ccc index` has no refresh flag because the command itself is the refresh path. It requires an initialized project, starts or reconnects to the daemon and prints chunk, file and language counts after the update finishes.

#### Source Files

See [`01--cli-commands/02-index-build.md`](01--cli-commands/02-index-build.md) for full implementation and validation file listings.

---

### CLI semantic search

#### Description

Searches indexed code with natural language plus optional language, path, limit and offset filters.

#### Current Reality

`ccc search` can refresh first with `--refresh`, accepts repeatable `--lang`, accepts one path glob through `--path`, supports offset pagination and falls back to a current-directory path filter when invoked below the project root.

#### Source Files

See [`01--cli-commands/03-cli-semantic-search.md`](01--cli-commands/03-cli-semantic-search.md) for full implementation and validation file listings.

---

### Status reporting

#### Description

Shows project-level index health, counts and language distribution.

#### Current Reality

`ccc status` prints project root first, then index status. If the target vector table does not exist yet, it tells the operator to build the index instead of throwing a raw SQLite error.

#### Source Files

See [`01--cli-commands/04-status-reporting.md`](01--cli-commands/04-status-reporting.md) for full implementation and validation file listings.

---

### Reset command

#### Description

Deletes index databases and optionally removes project settings and ignore entries.

#### Current Reality

By default, `ccc reset` deletes `cocoindex.db` and `target_sqlite.db` while preserving settings. With `--all`, it also removes `settings.yml`, tries to remove the empty `.cocoindex_code` directory and removes the Git ignore entry.

#### Source Files

See [`01--cli-commands/05-reset-command.md`](01--cli-commands/05-reset-command.md) for full implementation and validation file listings.

---

### MCP stdio command

#### Description

Starts the MCP server over stdio for AI client integration.

#### Current Reality

`ccc mcp` requires an initialized project, creates the MCP server with the daemon client, triggers background indexing and runs the server on stdio. Status, index and reset remain CLI-only commands.

#### Source Files

See [`01--cli-commands/06-mcp-stdio-command.md`](01--cli-commands/06-mcp-stdio-command.md) for full implementation and validation file listings.

---

### Daemon subcommands

#### Description

Exposes daemon status, restart and stop operations through `ccc daemon`.

#### Current Reality

The installed CLI exposes `status`, `restart` and `stop`, but not a standalone `start` subcommand. Normal commands auto-start the daemon through `ensure_daemon`.

#### Source Files

See [`01--cli-commands/07-daemon-subcommands.md`](01--cli-commands/07-daemon-subcommands.md) for full implementation and validation file listings.

---

## 3. MCP SERVER

These entries cover the stdio MCP server and its single exposed tool. The MCP surface is intentionally narrower than the CLI surface.

### Search tool contract

#### Description

Defines the single MCP `search` tool and its natural-language retrieval contract.

#### Current Reality

The tool accepts natural language or code snippets, returns code chunks with paths and line numbers and tells callers to start with a small result limit. Index, status and reset are intentionally outside the MCP tool surface.

#### Source Files

See [`02--mcp-server/01-search-tool-contract.md`](02--mcp-server/01-search-tool-contract.md) for full implementation and validation file listings.

---

### Refresh-index default

#### Description

Refreshes the index before MCP searches unless callers opt out.

#### Current Reality

The server calls `client.index(project_root)` before search when `refresh_index` is true. Cross-CLI guidance recommends disabling refresh on follow-up MCP queries to avoid unnecessary daemon work.

#### Source Files

See [`02--mcp-server/02-refresh-index-default.md`](02--mcp-server/02-refresh-index-default.md) for full implementation and validation file listings.

---

### Filter and pagination schema

#### Description

Defines language, path, limit and offset parameters for MCP search.

#### Current Reality

The MCP schema accepts `languages` and `paths` as lists. `limit` is constrained to 1 through 100 with a default of 5, while `offset` starts at 0 for pagination.

#### Source Files

See [`02--mcp-server/03-filter-and-pagination-schema.md`](02--mcp-server/03-filter-and-pagination-schema.md) for full implementation and validation file listings.

---

### Extended result models

#### Description

Returns fork-specific dedup, raw score, path class and ranking telemetry fields.

#### Current Reality

Each chunk includes `raw_score`, `path_class` and `rankingSignals`. The response includes `dedupedAliases` and `uniqueResultCount`, matching the CLI output shape added by the fork.

#### Source Files

See [`02--mcp-server/04-extended-result-models.md`](02--mcp-server/04-extended-result-models.md) for full implementation and validation file listings.

---

## 4. INDEXING PIPELINE

These entries cover how a project becomes a searchable vector index, from environment setup through file discovery, chunking, embedding and persistence.

### Project environment

#### Description

Creates a CocoIndex environment with project settings, embedder and SQLite contexts.

#### Current Reality

Project creation ensures `.cocoindex_code/` exists, opens the target SQLite database with vector loading, injects project settings, language overrides and `.gitignore` state, then builds a `CocoIndexCode` app around `indexer_main`.

#### Source Files

See [`03--indexing-pipeline/01-project-environment.md`](03--indexing-pipeline/01-project-environment.md) for full implementation and validation file listings.

---

### File discovery and gitignore

#### Description

Walks included project files while respecting project patterns and `.gitignore`.

#### Current Reality

`GitignoreAwareMatcher` normalizes nested `.gitignore` patterns and wraps the pattern matcher. The indexer then walks the codebase recursively with that matcher before processing files.

#### Source Files

See [`03--indexing-pipeline/02-file-discovery-and-gitignore.md`](03--indexing-pipeline/02-file-discovery-and-gitignore.md) for full implementation and validation file listings.

---

### Chunking and language detection

#### Description

Splits text into language-aware chunks and records line ranges.

#### Current Reality

The indexer skips unreadable and empty files, detects language by filename unless a project override exists and uses `RecursiveSplitter` with configured chunk size, minimum size and overlap.

#### Source Files

See [`03--indexing-pipeline/03-chunking-and-language-detection.md`](03--indexing-pipeline/03-chunking-and-language-detection.md) for full implementation and validation file listings.

---

### Embedding provider selection

#### Description

Creates sentence-transformer or LiteLLM embedders from user settings.

#### Current Reality

Default user settings choose `sentence-transformers/all-MiniLM-L6-v2`. When the provider is `sentence-transformers`, the factory strips the legacy `sbert/` prefix and can set a query prompt. Other providers route through LiteLLM.

#### Source Files

See [`03--indexing-pipeline/04-embedding-provider-selection.md`](03--indexing-pipeline/04-embedding-provider-selection.md) for full implementation and validation file listings.

---

### Vector table persistence

#### Description

Persists chunks, embeddings and fork metadata in a SQLite vec0 table.

#### Current Reality

The table primary key is chunk id. Auxiliary columns include file path, real path, content, content hash, path class and line ranges. Language is a partition key for indexed language filtering.

#### Source Files

See [`03--indexing-pipeline/05-vector-table-persistence.md`](03--indexing-pipeline/05-vector-table-persistence.md) for full implementation and validation file listings.

---

## 5. DAEMON AND READINESS

These entries cover daemon lifecycle, project registry behavior, indexing concurrency and readiness helper scripts.

### Daemon auto-start

#### Description

Connects to an existing daemon or starts one when commands need it.

#### Current Reality

`ensure_daemon` first tries an existing socket. If the daemon is missing, version-stale or settings-stale, it starts or restarts the process and retries the handshake.

#### Source Files

See [`04--daemon-and-readiness/01-daemon-auto-start.md`](04--daemon-and-readiness/01-daemon-auto-start.md) for full implementation and validation file listings.

---

### Socket, PID and log paths

#### Description

Defines daemon runtime paths under the user settings directory.

#### Current Reality

Unix uses a socket file under the daemon directory. Windows uses a named pipe with a hash of the daemon directory so environment overrides can create isolated daemon instances. PID and log files share the same directory.

#### Source Files

See [`04--daemon-and-readiness/02-socket-pid-log-paths.md`](04--daemon-and-readiness/02-socket-pid-log-paths.md) for full implementation and validation file listings.

---

### Per-project registry

#### Description

Keeps loaded projects, locks and load-time indexing state per project root.

#### Current Reality

Loading a new project can kick off background indexing unless the caller suppresses it. Removing a project closes resources, drops locks and clears load-time state.

#### Source Files

See [`04--daemon-and-readiness/03-per-project-registry.md`](04--daemon-and-readiness/03-per-project-registry.md) for full implementation and validation file listings.

---

### Indexing progress stream

#### Description

Streams progress and waiting notices while index updates run.

#### Current Reality

The registry emits a waiting notice when another index run already holds the lock, then streams `IndexProgressUpdate` snapshots until a terminal `IndexResponse` is available.

#### Source Files

See [`04--daemon-and-readiness/04-indexing-progress-stream.md`](04--daemon-and-readiness/04-indexing-progress-stream.md) for full implementation and validation file listings.

---

### Search wait during indexing

#### Description

Queues search responses behind active load-time or explicit indexing.

#### Current Reality

When a project is still load-time indexing or has a held index lock, the dispatcher returns `_search_with_wait`. That path yields a waiting notice, waits for indexing to finish and then returns the search response.

#### Source Files

See [`04--daemon-and-readiness/05-search-wait-during-indexing.md`](04--daemon-and-readiness/05-search-wait-during-indexing.md) for full implementation and validation file listings.

---

## 6. SEARCH AND RANKING

These entries cover query execution, filtering, scoring, pagination and result presentation.

### Semantic KNN query

#### Description

Embeds the query and runs nearest-neighbor search against the vector table.

#### Current Reality

Without path filters, the query path uses SQLite vec0 KNN. With no language filter or one language, it can use a direct KNN query; with multiple languages, it merges KNN rows across partitions.

#### Source Files

See [`05--search-and-ranking/01-semantic-knn-query.md`](05--search-and-ranking/01-semantic-knn-query.md) for full implementation and validation file listings.

---

### Language filtering

#### Description

Restricts search results to one or more detected language partitions.

#### Current Reality

Single-language queries use the vec0 language partition directly. Multi-language queries run partition-specific KNN scans and take the nearest rows across all requested languages.

#### Source Files

See [`05--search-and-ranking/02-language-filtering.md`](05--search-and-ranking/02-language-filtering.md) for full implementation and validation file listings.

---

### Path-filter full scan

#### Description

Uses SQL-level distance computation when path filters are present.

#### Current Reality

When `paths` is set, query execution uses `_full_scan_query`, applies language and path predicates, computes vector distance in SQL and then orders by distance.

#### Source Files

See [`05--search-and-ranking/03-path-filter-full-scan.md`](05--search-and-ranking/03-path-filter-full-scan.md) for full implementation and validation file listings.

---

### Pagination window

#### Description

Applies offset and limit after deduplication and reranking.

#### Current Reality

The query path over-fetches raw rows, ranks them, dedups aliases, then returns `unique[offset:offset + limit]`. The returned unique count reflects the actual page size.

#### Source Files

See [`05--search-and-ranking/04-pagination-window.md`](05--search-and-ranking/04-pagination-window.md) for full implementation and validation file listings.

---

### Relevance score display

#### Description

Shows post-rerank score, raw score and ranking signals in CLI output.

#### Current Reality

For each result, `ccc search` prints final score, raw score, file path, line range, language, path class and any ranking signals before the chunk content.

#### Source Files

See [`05--search-and-ranking/05-relevance-score-display.md`](05--search-and-ranking/05-relevance-score-display.md) for full implementation and validation file listings.

---

### No-results handling

#### Description

Reports empty successful searches without stack traces.

#### Current Reality

The CLI prints `No results found.` for successful empty responses. MCP responses carry `success=false` only when an exception occurs, otherwise an empty result list can still be a valid response.

#### Source Files

See [`05--search-and-ranking/06-no-results-handling.md`](05--search-and-ranking/06-no-results-handling.md) for full implementation and validation file listings.

---

## 7. PATCHES AND EXTENSIONS

These entries cover the local fork behavior layered onto upstream CocoIndex Code: mirror deduplication, path-class ranking and compatibility surfaces.

### Mirror dedup identity

#### Description

Uses real path plus line range to collapse mirror-folder duplicate chunks.

#### Current Reality

The primary dedup key is `source_realpath`, `start_line` and `end_line`. Duplicate rows increment `dedupedAliases` and only the first ranked representative remains in the unique list.

#### Source Files

See [`06--patches-and-extensions/01-mirror-dedup-identity.md`](06--patches-and-extensions/01-mirror-dedup-identity.md) for full implementation and validation file listings.

---

### Content hash fallback

#### Description

Hashes normalized content to dedup older or symlinked rows when realpath is absent.

#### Current Reality

Indexing stores a SHA-256 hash of normalized chunk content. Query-time dedup uses that stored hash or recomputes one from row content when `source_realpath` is missing.

#### Source Files

See [`06--patches-and-extensions/02-content-hash-fallback.md`](06--patches-and-extensions/02-content-hash-fallback.md) for full implementation and validation file listings.

---

### Path-class taxonomy

#### Description

Classifies indexed paths as implementation, tests, docs, spec research, generated or vendor.

#### Current Reality

Classification happens during indexing. Vendor and generated paths are recognized first, spec research paths are separated from regular implementation, tests are detected by path and filename and docs are recognized outside spec trees.

#### Source Files

See [`06--patches-and-extensions/03-path-class-taxonomy.md`](06--patches-and-extensions/03-path-class-taxonomy.md) for full implementation and validation file listings.

---

### Implementation-intent reranking

#### Description

Boosts implementation hits and penalizes docs or spec research for implementation-style queries.

#### Current Reality

Query text is checked for implementation-intent keywords. When present, implementation chunks receive a small boost while docs and spec research receive a small penalty. The raw score remains available for audit.

#### Source Files

See [`06--patches-and-extensions/04-implementation-intent-reranking.md`](06--patches-and-extensions/04-implementation-intent-reranking.md) for full implementation and validation file listings.

---

### Ranking telemetry

#### Description

Carries ranking signals and response-level dedup counts through query, daemon, MCP and CLI layers.

#### Current Reality

Query results include `rankingSignals`, `raw_score`, `path_class`, `dedupedAliases` and `uniqueResultCount`. The daemon maps those fields into protocol results and the MCP server maps them again into Pydantic response models.

#### Source Files

See [`06--patches-and-extensions/05-ranking-telemetry.md`](06--patches-and-extensions/05-ranking-telemetry.md) for full implementation and validation file listings.

---

### Backward-compatible entrypoint

#### Description

Keeps the older `cocoindex-code` entry path working by converting legacy settings.

#### Current Reality

The legacy path converts old embedding model prefixes, can create settings from environment variables and delegates work to the daemon-backed implementation. Legacy root discovery can re-anchor to an existing indexed tree.

#### Source Files

See [`06--patches-and-extensions/06-backward-compatible-entrypoint.md`](06--patches-and-extensions/06-backward-compatible-entrypoint.md) for full implementation and validation file listings.

---

## 8. INSTALLATION TOOLING

These entries cover shell helpers that install the local fork, inspect readiness, bootstrap missing state and assist upstream sync reviews.

### Editable fork install

#### Description

Installs the vendored fork into the skill-local virtual environment.

#### Current Reality

`install.sh` creates a Python 3.11+ virtual environment if needed, installs the package editable, verifies `ccc --help`, initializes the project when `.cocoindex_code/` is missing and prints readiness next steps.

#### Source Files

See [`07--installation-tooling/01-editable-fork-install.md`](07--installation-tooling/01-editable-fork-install.md) for full implementation and validation file listings.

---

### Doctor health check

#### Description

Reports CocoIndex binary, payload, index, daemon and config readiness.

#### Current Reality

`doctor.sh` can emit JSON, run in strict mode, require config wiring, require daemon availability and check specific config paths. It uses shared readiness helpers and returns distinct exit codes for blocking states.

#### Source Files

See [`07--installation-tooling/02-doctor-health-check.md`](07--installation-tooling/02-doctor-health-check.md) for full implementation and validation file listings.

---

### Ensure-ready bootstrap

#### Description

Idempotently installs, initializes and indexes enough state for search use.

#### Current Reality

The script installs the binary when missing, runs `ccc init` when project settings are missing, indexes when requested or when readiness says the index is missing and can return machine-readable JSON with actions performed.

#### Source Files

See [`07--installation-tooling/03-ensure-ready-bootstrap.md`](07--installation-tooling/03-ensure-ready-bootstrap.md) for full implementation and validation file listings.

---

### Update sync helper

#### Description

Compares the vendored fork with a selected upstream release without overwriting local source.

#### Current Reality

`update.sh` downloads an upstream source release, finds the extracted `cocoindex_code` package, compares files against the vendored directory and flags patched files for manual merge. It does not mutate vendored runtime source.

#### Source Files

See [`07--installation-tooling/04-update-sync-helper.md`](07--installation-tooling/04-update-sync-helper.md) for full implementation and validation file listings.

---

## 9. CONFIGURATION

These entries cover user settings, project settings, root discovery, environment overrides and downstream MCP adoption.

### User settings

#### Description

Stores embedding provider, model, device and daemon environment variables globally.

#### Current Reality

The default user settings use the local sentence-transformers provider and `all-MiniLM-L6-v2`. The loader rejects missing or empty settings files and the saver writes explicit YAML.

#### Source Files

See [`08--configuration/01-user-settings.md`](08--configuration/01-user-settings.md) for full implementation and validation file listings.

---

### Project settings

#### Description

Controls include patterns, exclude patterns and language overrides per project.

#### Current Reality

`ccc init` writes project settings under `.cocoindex_code/settings.yml`. Missing project settings are an initialization error for normal CLI commands, while empty files load as defaults.

#### Source Files

See [`08--configuration/02-project-settings.md`](08--configuration/02-project-settings.md) for full implementation and validation file listings.

---

### Root path discovery

#### Description

Finds the project root from initialized settings, markers or explicit environment override.

#### Current Reality

The settings path helper walks up to `.cocoindex_code/settings.yml`. The legacy config path can use `COCOINDEX_CODE_ROOT_PATH`, then initialized directories, common project markers and finally the current working directory.

#### Source Files

See [`08--configuration/03-root-path-discovery.md`](08--configuration/03-root-path-discovery.md) for full implementation and validation file listings.

---

### Environment overrides

#### Description

Supports runtime overrides for config directory, root path, device and legacy variables.

#### Current Reality

`COCOINDEX_CODE_DIR` changes the global settings directory. `COCOINDEX_CODE_ROOT_PATH` pins the project root for helper scripts and legacy config. Extra extension and excluded pattern environment variables remain in the compatibility config path.

#### Source Files

See [`08--configuration/04-environment-overrides.md`](08--configuration/04-environment-overrides.md) for full implementation and validation file listings.

---

### Downstream MCP adoption

#### Description

Documents the minimal config wiring needed for repositories to use CocoIndex.

#### Current Reality

The checklist requires the local skill payload, repo-specific `cocoindex_code` MCP wiring, readiness checks and `.gitignore` hygiene. It says not to expand rollout to unused CLI configs just for symmetry.

#### Source Files

See [`08--configuration/05-downstream-mcp-adoption.md`](08--configuration/05-downstream-mcp-adoption.md) for full implementation and validation file listings.

---

## 10. VALIDATION AND TESTS

These entries map the automated and manual validation surfaces that keep the CocoIndex skill honest.

### CLI helper tests

#### Description

Validates project-root, default-path and `.gitignore` helper behavior.

#### Current Reality

The tests cover initialized and uninitialized project roots, default path calculation from subdirectories and idempotent add/remove behavior for `.gitignore` entries.

#### Source Files

See [`09--validation-and-tests/01-cli-helper-tests.md`](09--validation-and-tests/01-cli-helper-tests.md) for full implementation and validation file listings.

---

### Protocol round-trip tests

#### Description

Validates daemon request and response encoding for all protocol message types.

#### Current Reality

Coverage includes handshake, search requests with defaults and all fields, search responses, errors, daemon status, waiting notices, progress updates and round trips for all request and response variants.

#### Source Files

See [`09--validation-and-tests/02-protocol-round-trip-tests.md`](09--validation-and-tests/02-protocol-round-trip-tests.md) for full implementation and validation file listings.

---

### Daemon lifecycle tests

#### Description

Validates daemon handshake, status, indexing, search, removal and wait behavior.

#### Current Reality

The suite starts a daemon in test fixtures, handshakes with it, checks version mismatch behavior, indexes a sample project, searches results, validates project removal and proves search waits during active indexing.

#### Source Files

See [`09--validation-and-tests/03-daemon-lifecycle-tests.md`](09--validation-and-tests/03-daemon-lifecycle-tests.md) for full implementation and validation file listings.

---

### End-to-end session tests

#### Description

Validates full CLI, daemon and search workflows against sample projects.

#### Current Reality

The suite covers init, index, status, search filters, reset modes, daemon stop and restart, refresh search, not-initialized errors, subdirectory behavior, root discovery and gitignore respect.

#### Source Files

See [`09--validation-and-tests/04-e2e-session-tests.md`](09--validation-and-tests/04-e2e-session-tests.md) for full implementation and validation file listings.

---
