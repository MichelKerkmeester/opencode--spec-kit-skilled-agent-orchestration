---
title: "CocoIndex Code - Semantic Code Search"
description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of code, patterns, and implementations across 28+ languages using a CLI and a single MCP search tool."
trigger_phrases:
  - "semantic search"
  - "cocoindex"
  - "ccc"
  - "find code that"
  - "code search"
  - "vector search"
  - "find similar code"
---

# CocoIndex Code - Semantic Code Search

> Find code by what it does, not what it says: natural-language queries resolved to semantically relevant results across 28+ languages via CLI or a single MCP tool.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. FEATURES](#3-features)
- [4. STRUCTURE](#4-structure)
- [5. CONFIGURATION](#5-configuration)
- [6. USAGE EXAMPLES](#6-usage-examples)
- [7. TROUBLESHOOTING](#7-troubleshooting)
- [8. FAQ](#8-faq)
- [9. RELATED DOCUMENTS](#9-related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

CocoIndex Code is a semantic code search tool built on vector embeddings. Where `grep` matches exact characters, CocoIndex Code matches meaning. Ask for "retry logic with exponential backoff" and it returns code that implements that pattern, regardless of how the author named variables or functions. This makes it the right tool when you know what a piece of code does but not where it lives or what it is called.

The skill ships with two access modes. The CLI (`ccc`) is fastest for one-off queries and all index management operations. The MCP server (`ccc mcp`) exposes a single `search` tool that AI agents call directly via stdio transport, integrating semantic search into any tool-calling workflow without leaving the conversation.

Indexing is incremental and daemon-backed. The first run scans and embeds all supported files in the project. Subsequent runs update only changed files. A background daemon starts automatically on the first command, persists across calls, and restarts itself when settings or the binary version change.

If that exploration feeds into Spec Kit packet recovery, `/spec_kit:resume` remains the canonical surface. Packet continuity still comes from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts stay secondary.

### Key Statistics

| Property | Value |
|---|---|
| Version | 1.0.0 |
| MCP tools exposed | 1 (`search`) |
| Supported languages | 28+ |
| Default embedding model | `sentence-transformers/all-MiniLM-L6-v2` (local, no API key) |
| Primary embedding model | `voyage/voyage-code-3` via LiteLLM (1024-dim, requires `VOYAGE_API_KEY`) |
| Vector storage | SQLite via sqlite-vec |
| Chunk size | 1000 chars, 250 char minimum, 150 char overlap |
| Similarity metric | Cosine similarity (0.0 to 1.0) |

### How This Compares

| Tool | Use When | Limitation |
|---|---|---|
| `ccc search` (CocoIndex) | You know what code does but not where it lives | Approximate, needs verification |
| `code_graph_query` | You need exact callers, imports, or structural dependencies | Requires the structural graph to be indexed first |
| `Grep` | You know the exact text, symbol, or regex pattern | Cannot find conceptual matches |
| `Glob` | You know the file name or extension pattern | Cannot search file contents |
| `Read` | You know the exact file path | No search capability |

### Key Features

| Feature | Description |
|---|---|
| Semantic search | Query by concept or intent, not exact text |
| CLI and MCP modes | `ccc` for terminal use, `ccc mcp` for AI agent integration |
| Language filters | `--lang` (CLI) or `languages` (MCP) narrows results by language |
| Path filters | `--path` (CLI) or `paths` (MCP) scopes results to a directory |
| Incremental indexing | Only re-embeds changed files on subsequent runs |
| Daemon architecture | Auto-starts, auto-restarts on version or settings change |
| Spec Kit integration | Companion lifecycle tools (`ccc_status`, `ccc_reindex`, `ccc_feedback`) and code-graph/session integration are available through system-spec-kit |
| Two embedding models | Local (no API key) or cloud (higher quality) |
| 28+ languages | Language-aware chunk splitting preserves function and class boundaries |

In the broader system-spec-kit stack, CocoIndex is the semantic half of a three-system retrieval model: CocoIndex finds conceptually similar code, Code Graph answers structural questions, and session bootstrap surfaces CocoIndex readiness during recovery. The companion lifecycle helpers exposed through system-spec-kit are `ccc_status`, `ccc_reindex`, and `ccc_feedback`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Install and verify**

Run the idempotent bootstrap helper. It installs the binary, initializes the project if needed, and reports readiness.

```bash
bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --strict --require-config
```

**Step 2: Build the index**

Run from the project root. The first run scans all supported files and generates embeddings. It takes 1-5 minutes depending on codebase size.

```bash
ccc index
```

**Step 3: Check index status**

Confirm files are indexed before searching.

```bash
ccc status
```

**Step 4: Search**

Run a natural-language query. Add language and path filters to narrow results.

```bash
ccc search "authentication middleware"
ccc search "error handling" --lang typescript
ccc search "database migration" --path "src/**" --limit 5
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

CocoIndex Code resolves queries by embedding the natural-language query text and comparing the resulting vector against pre-computed vectors for every code chunk in the index. This means the search engine reads intent, not characters. A query for "graceful shutdown handler" finds code that tears down servers or releases resources, even if the words "graceful", "shutdown", or "handler" never appear in that code.

The two embedding models trade off quality against convenience. The local model (`all-MiniLM-L6-v2`) requires no API key and works offline, making it the right default for most projects. The Voyage Code 3 model produces 1024-dimensional vectors trained specifically on code, and consistently returns higher-quality results for complex queries on large codebases. Switching models requires a full reset and reindex because the vector dimensions are incompatible.

Language and path filters apply after ranking, which means they narrow an already semantically ranked result set rather than replacing semantic ranking with keyword matching. This design keeps the filters fast and the results meaningful. For multi-query agent sessions, set `refresh_index=false` on follow-up calls after the first query has already triggered a refresh. The daemon has a known concurrency issue where simultaneous `refresh_index=true` requests can cause `ComponentContext` errors.

The CLI and MCP interfaces are complementary, not redundant. The CLI handles index management operations (`index`, `status`, `reset`, `init`, `daemon`) that have no MCP equivalents. The MCP server exposes only the `search` tool because index management is a human-initiated operation, not an agent-initiated one. When building an AI workflow that needs semantic search, configure the MCP server and let agents call `search` directly.

### 3.2 FEATURE REFERENCE

**CLI commands**

| Command | Purpose | Key Flags |
|---|---|---|
| `ccc search QUERY` | Semantic search | `--lang`, `--path`, `--limit`, `--offset`, `--refresh` |
| `ccc index` | Build or update the vector index | none |
| `ccc status` | Show index statistics | none |
| `ccc init` | Initialize project (`/.cocoindex_code/`) | `-f` / `--force` |
| `ccc reset` | Reset databases | `--all` (include settings), `-f` (skip prompt) |
| `ccc mcp` | Start MCP server (stdio mode) | none |
| `ccc daemon status` | Show daemon state | none |
| `ccc daemon restart` | Restart daemon | none |
| `ccc daemon stop` | Stop daemon | none |

**MCP tool: `search`**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | Yes | - | Natural-language search query |
| `languages` | list or null | No | null | Filter by programming languages |
| `paths` | list or null | No | null | Filter by file paths |
| `limit` | integer | No | 5 | Maximum number of results to return |
| `offset` | integer | No | 0 | Number of results to skip for pagination |
| `refresh_index` | boolean | No | true | Trigger index refresh before searching |

**CLI vs. MCP parameter differences**

| Concept | CLI | MCP | Note |
|---|---|---|---|
| Language filter | `--lang` (repeatable flag) | `languages` (list) | CLI: one flag per language. MCP: list of strings |
| Path filter | `--path` (single string) | `paths` (list) | CLI: one path. MCP: multiple paths |
| Result limit | `--limit` (default 10) | `limit` (default 5) | Different defaults |
| Index refresh | `--refresh` (default false) | `refresh_index` (default true) | Different defaults |
| Pagination | `--offset` | `offset` (default 0) | Available on both surfaces |

**Embedding models**

| Model | Type | Dimensions | API Key | Best For |
|---|---|---|---|---|
| `sentence-transformers/all-MiniLM-L6-v2` | Local | 384 | None | Offline use, no API dependency |
| `voyage/voyage-code-3` | Cloud via LiteLLM | 1024 | `VOYAGE_API_KEY` | Higher quality code search |

**Similarity score interpretation**

| Score Range | Meaning | Action |
|---|---|---|
| 0.8 - 1.0 | Strong match | Read this first |
| 0.6 - 0.8 | Good match | Worth reviewing |
| 0.4 - 0.6 | Moderate match | Scan for usefulness |
| 0.0 - 0.4 | Weak match | Usually skip |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
mcp-coco-index/
  SKILL.md                         AI agent instructions and routing logic
  README.md                        This file
  INSTALL_GUIDE.md                 Installation and initial setup guide
  assets/
    config_templates.md            MCP server configuration examples
  manual_testing_playbook/
    01--core-cli-commands/         Test cases for search, index, status, init, reset
    02--mcp-search-tool/           Test cases for MCP search tool
    ...
  references/
    cross_cli_playbook.md          Safe defaults for multi-query sessions and cross-CLI use
    downstream_adoption_checklist.md  Minimum bundle for sibling-repo rollout
    search_patterns.md             Query writing strategies and filter examples
    settings_reference.md          Embedding model switching and daemon settings
    tool_reference.md              Complete CLI and MCP parameter reference
  scripts/
    install.sh                     Install CocoIndex Code into skill venv
    update.sh                      Update to latest version
    doctor.sh                      Read-only health check (supports --json, --strict)
    ensure_ready.sh                Idempotent bootstrap (install + init + index if needed)
  mcp_server/
    .venv/
      bin/
        ccc                        CLI binary (full path for PATH-less invocation)
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

**Binary path**

If `ccc` is not on your PATH, use the full venv path:

```text
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc
```

**Global settings** (`~/.cocoindex_code/global_settings.yml`)

Controls the embedding model used for all projects on this machine.

```yaml
embedding:
  provider: sentence-transformers       # or litellm for cloud models
  model: all-MiniLM-L6-v2              # or voyage/voyage-code-3
  device: cpu                           # cpu | cuda | mps (auto-detects if omitted)
envs:
  VOYAGE_API_KEY: "your-key-here"       # required only for voyage models
```

**Project settings** (`.cocoindex_code/settings.yml`)

Created by `ccc init`. Controls which files get indexed in this project.

```yaml
include_patterns:
  - "**/*.ts"
  - "**/*.py"
exclude_patterns:
  - "node_modules/**"
  - "dist/**"
```

**MCP configuration** (`.mcp.json` for Claude Code)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": ".opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "."
      },
      "disabled": true
    }
  }
}
```

Set `"disabled": false` to activate. The MCP server is disabled by default to avoid adding search context to sessions that do not need it.

**Environment variables**

| Variable | Default | Description |
|---|---|---|
| `COCOINDEX_CODE_ROOT_PATH` | auto-detected | Override project root for indexing |
| `COCOINDEX_CODE_DIR` | `~/.cocoindex_code` | Override config and data directory |
| `VOYAGE_API_KEY` | (none) | Required for Voyage Code 3 cloud embeddings |

**Root path detection order**

CocoIndex Code resolves the project root in this order:

1. `COCOINDEX_CODE_ROOT_PATH` environment variable
2. Nearest parent with `.cocoindex_code/` directory
3. Nearest parent with a project marker (`.git`, `pyproject.toml`, `package.json`, `Cargo.toml`, `go.mod`)
4. Current working directory

**Changing embedding models**

Changing the model requires destroying and rebuilding the index. Different models produce vectors with incompatible dimensions, and mixing them corrupts results.

```bash
ccc reset
ccc index
```

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Example 1: Concept search with filters**

Find TypeScript error handling code in the API layer. Start broad, then add filters to narrow.

```bash
# Broad search first
ccc search "error handling and recovery"

# Add language filter
ccc search "error handling and recovery" --lang typescript

# Scope to a directory
ccc search "error handling and recovery" --lang typescript --path "src/api/" --limit 5
```

**Example 2: Multi-step discovery workflow**

Use semantic search to find candidate files, then verify with Grep and Read.

```bash
# Step 1: Semantic search finds candidate files
ccc search "rate limiting middleware" --lang typescript --limit 5

# Step 2: Grep confirms exact patterns in candidates
grep -rn "rateLimit" src/middleware/

# Step 3: Read the matched file to confirm implementation details
# Use the Read tool on the file path returned by Step 1
```

**Example 3: MCP tool call (agent context)**

An AI agent calls the MCP `search` tool directly. Set `refresh_index` to `false` on follow-up queries within the same session.

```json
{
  "query": "database connection pooling setup",
  "languages": ["python", "typescript"],
  "paths": ["src/db/"],
  "limit": 10,
  "offset": 0,
  "refresh_index": false
}
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

**`command not found: ccc`**

What you see: shell reports `ccc: command not found` when running any `ccc` command.

Common causes: The venv binary directory is not on PATH. This is expected after a fresh install.

Fix: Use the full path directly, or add the venv `bin` directory to PATH.

```bash
.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc status
```

---

**Empty search results for reasonable queries**

What you see: `ccc search "authentication middleware"` returns zero results or only low-score matches.

Common causes: The index has not been built yet, the index is stale after a large refactor, or the query is too specific for the embedding model to match.

Fix: Run `doctor.sh` first to check index health, then rebuild if needed.

```bash
bash .opencode/skill/mcp-coco-index/scripts/doctor.sh --strict --require-config
ccc index
```

If results are still poor, rephrase the query. Use shorter, concept-focused phrases (3-5 words) rather than long keyword lists.

---

**`ComponentContext` errors on concurrent MCP queries**

What you see: MCP search tool returns a `ComponentContext` error when multiple queries fire with `refresh_index=true` at the same time.

Common causes: The daemon has a known concurrency issue when multiple simultaneous requests each trigger a refresh.

Fix: Set `refresh_index=false` on all follow-up queries in a multi-query session. Only the first query in a session needs to refresh.

```json
{ "query": "your query", "refresh_index": false }
```

---

**Stale results after a branch switch or large merge**

What you see: Search returns files or code that no longer exist, or misses recently added implementations.

Common causes: The index reflects the previous state of the codebase. Incremental indexing tracks file changes but does not automatically detect branch switches.

Fix: Run `ccc index` to update the index. For a clean rebuild after major structural changes, reset first.

```bash
ccc reset
ccc index
```

---

**Embedding model mismatch after changing `global_settings.yml`**

What you see: Search returns no results or errors about vector dimension incompatibility after switching the embedding model.

Common causes: The existing index was built with a different model and the vector dimensions do not match the new model.

Fix: Reset the index and rebuild with the new model.

```bash
ccc reset
ccc index
```

---

**Python version error during install**

What you see: `install.sh` fails with a message about Python version requirements.

Common causes: CocoIndex Code requires Python 3.11 or later. The system Python may be an older version.

Fix: Install Python 3.11+ and re-run the install script.

```bash
python3 --version
bash .opencode/skill/mcp-coco-index/scripts/install.sh
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Why does CocoIndex Code only expose one MCP tool when the CLI has seven commands?**

A: Index management operations (`index`, `status`, `reset`, `init`, `daemon`) are intended for human-initiated workflows, not agent-initiated ones. An agent asking to reset a codebase index would be a destructive action with no confirmation step. The MCP interface exposes only `search` to keep agent behavior predictable and safe. Run index management commands from a terminal.

---

**Q: When should I use Voyage Code 3 instead of the local model?**

A: Use Voyage Code 3 when search quality matters more than avoiding an API dependency. The local model (`all-MiniLM-L6-v2`) is a general-purpose sentence embedding model with 384 dimensions. It works well for most queries but can miss nuanced code patterns. Voyage Code 3 was trained on code and produces 1024-dimensional vectors, giving it better discrimination between semantically similar but functionally different patterns. Switch to it when you notice too many false positives or misses on important queries. Remember: switching models requires `ccc reset && ccc index`.

---

**Q: How often should I reindex?**

A: The daemon handles incremental updates automatically. Run `ccc index` manually after major structural changes: branch switches, large merges, or significant refactors. For day-to-day work, the index stays current because changed files are detected on each query when `refresh_index=true` (MCP default) or `--refresh` (CLI flag).

---

**Q: What is the difference between `doctor.sh` and `ensure_ready.sh`?**

A: `doctor.sh` is read-only. It inspects the environment, reports what is working and what is not, and exits with a non-zero code if any check fails. It never modifies anything. `ensure_ready.sh` is idempotent and takes action: it installs the binary if missing, initializes the project if not yet initialized, and optionally refreshes the index. Use `doctor.sh` for diagnostics and CI gates. Use `ensure_ready.sh` to bring a machine to a ready state.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

**This skill**

| Document | Purpose |
|---|---|
| [SKILL.md](SKILL.md) | AI agent instructions, routing logic, rules, and integration points |
| [INSTALL_GUIDE.md](INSTALL_GUIDE.md) | Installation and initial setup walkthrough |
| [references/tool_reference.md](references/tool_reference.md) | Complete CLI and MCP parameter reference |
| [references/search_patterns.md](references/search_patterns.md) | Query writing strategies and filter examples |
| [references/cross_cli_playbook.md](references/cross_cli_playbook.md) | Safe defaults for multi-query and cross-CLI sessions |
| [references/settings_reference.md](references/settings_reference.md) | Embedding model switching and daemon configuration |
| [assets/config_templates.md](assets/config_templates.md) | MCP server configuration examples |
| [scripts/install.sh](scripts/install.sh) | Install CocoIndex Code |
| [scripts/doctor.sh](scripts/doctor.sh) | Read-only health check |
| [scripts/ensure_ready.sh](scripts/ensure_ready.sh) | Idempotent bootstrap |

**Related skills**

| Skill | Purpose | Relationship |
|---|---|---|
| [system-spec-kit](../system-spec-kit/SKILL.md) | Context preservation and memory | Complementary: semantic memory vs. semantic code search |
| [mcp-code-mode](../mcp-code-mode/SKILL.md) | External tool integration via MCP | Peer MCP skill with a different purpose |

**External resources**

| Resource | URL |
|---|---|
| CocoIndex GitHub | https://github.com/cocoindex-io/cocoindex |
| CocoIndex Code on PyPI | https://pypi.org/project/cocoindex-code/ |
| all-MiniLM-L6-v2 on HuggingFace | https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2 |
| sqlite-vec | https://github.com/asg017/sqlite-vec |

<!-- /ANCHOR:related-documents -->
