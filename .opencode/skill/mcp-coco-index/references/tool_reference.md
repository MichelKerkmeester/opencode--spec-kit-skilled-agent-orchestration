---
title: CocoIndex Code Tool Reference
description: Complete reference for the CocoIndex Code CLI commands and MCP tool with parameters, examples, and expected output.
trigger_phrases:
  - ccc commands
  - cocoindex tools
  - search parameters
  - mcp tools cocoindex
  - ccc cli reference
---

# CocoIndex Code Tool Reference

Complete reference for all CLI commands and the MCP tool exposed by CocoIndex Code.

---

<!-- ANCHOR:overview -->
## OVERVIEW

This document provides the complete reference for CocoIndex Code CLI commands and MCP tool. It covers all available commands (search, index, status, init, reset, mcp, daemon), their parameters, expected output, supported languages, environment variables, settings schema, and related resources.

**Important distinction:** The MCP server exposes exactly **1 tool** (`search`). The `status`, `index`, and `reset` operations are **CLI-only commands** and are not available through the MCP protocol.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:cli-commands -->
## 1. CLI COMMANDS

### ccc search

Perform a semantic search across the indexed codebase.

```bash
ccc search QUERY [--lang LANG ...] [--path PATH] [--limit N] [--offset N] [--refresh]
```

| Parameter   | Required | Default | Description                                                        |
| ----------- | -------- | ------- | ------------------------------------------------------------------ |
| `QUERY`     | Yes      | -       | Natural language search query                                      |
| `--lang`    | No       | all     | Filter by language (repeatable: `--lang python --lang typescript`) |
| `--path`    | No       | .       | Filter by directory path                                           |
| `--limit`   | No       | 10      | Maximum number of results                                          |
| `--offset`  | No       | 0       | Skip first N results (pagination)                                  |
| `--refresh` | No       | false   | Force index refresh before searching                               |

**Note:** `--lang` is repeatable. Specify it multiple times to filter by multiple languages.

**Examples:**
```bash
# Basic search
ccc search "error handling in API routes"

# Filter by single language
ccc search "database connection pooling" --lang python

# Filter by multiple languages
ccc search "authentication middleware" --lang python --lang typescript

# Scope to directory
ccc search "authentication middleware" --path src/api/

# Paginate results
ccc search "configuration" --limit 5 --offset 10

# Refresh index before searching
ccc search "new feature" --refresh
```

**Output format:** Each result includes:
- File path
- Line range
- Code snippet
- Relevance score (0.0 to 1.0)
- Language

---

### ccc index

Build or update the semantic index for the current project.

```bash
ccc index
```

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| (none)    | -        | No parameters. Indexes from COCOINDEX_CODE_ROOT_PATH |

**Example:**
```bash
cd /path/to/project
ccc index
# Scans files, generates embeddings, stores in .cocoindex_code/
```

**Notes:**
- First run indexes all supported files
- Subsequent runs perform incremental updates (only changed files)
- Duration depends on codebase size (typically 1-5 minutes for first build)
- For forced refresh during search, use `ccc search ... --refresh`; the installed `ccc index` command does not expose a `--refresh` flag

---

### ccc status

Display project and index statistics.

```bash
ccc status
```

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| (none)    | -        | No parameters |

**Example:**
```bash
ccc status
# Shows: indexed files count, languages, index size, last update time
```

---

### ccc init

Initialize a new project for indexing. Creates the `.cocoindex_code/` directory.

```bash
ccc init [-f | --force]
```

| Parameter       | Required | Default | Description                                      |
| --------------- | -------- | ------- | ------------------------------------------------ |
| `-f`, `--force` | No       | false   | Force re-initialization even if already exists    |

**Examples:**
```bash
cd /path/to/project
ccc init
# Creates .cocoindex_code/ directory

# Force re-initialization
ccc init --force
```

**Notes:**
- Run this once per project before building the index
- The install script runs `ccc init` automatically if `.cocoindex_code/` does not exist
- Use `-f` / `--force` to re-initialize an existing project

---

### ccc reset

Reset the index databases. Optionally remove all data.

```bash
ccc reset [--all]
```

| Parameter | Required | Default | Description                                       |
| --------- | -------- | ------- | ------------------------------------------------- |
| `--all`   | No       | false   | Remove all data (full clean reset including settings) |

**Examples:**
```bash
# Reset databases only (keep settings)
ccc reset

# Full reset including all data and settings
ccc reset --all

# After reset, rebuild
ccc init
ccc index
```

---

### ccc mcp

Run CocoIndex Code as an MCP server in stdio mode. Used by AI clients.

```bash
ccc mcp
```

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| (none)    | -        | Starts MCP server on stdio. Ctrl+C to stop |

**Notes:**
- This command is used in MCP configuration files (not run manually)
- Communicates via stdin/stdout using the MCP protocol
- Exposes 1 tool: `search`
- The `status`, `index`, and `reset` operations are CLI-only and not exposed via MCP

---

### ccc daemon

Manage the background indexing daemon.

```bash
ccc daemon status|restart|stop
```

| Subcommand | Description                          |
| ---------- | ------------------------------------ |
| `status`   | Check if the daemon is running       |
| `restart`  | Restart the running daemon           |
| `stop`     | Stop the running daemon              |

**Examples:**
```bash
# Check daemon status
ccc daemon status

# Restart daemon
ccc daemon restart

# Stop daemon
ccc daemon stop
```

---

<!-- /ANCHOR:cli-commands -->
<!-- ANCHOR:mcp-tools -->
## 2. MCP TOOL

The MCP server (`ccc mcp`) exposes exactly **1 tool**: `search`. All other operations (status, index, reset) are CLI-only commands.

### search

Perform semantic search across the indexed codebase.

| Parameter       | Type                    | Required | Default | Description                              |
| --------------- | ----------------------- | -------- | ------- | ---------------------------------------- |
| `query`         | string                  | Yes      | -       | Natural language search query            |
| `languages`     | list of strings \| null | No       | null    | Filter by programming languages          |
| `paths`         | list of strings \| null | No       | null    | Filter by file paths                     |
| `limit`         | integer                 | No       | 5       | Maximum number of results to return      |
| `offset`        | integer                 | No       | 0       | Number of results to skip for pagination |
| `refresh_index` | boolean                 | No       | true    | Trigger index refresh before searching   |

**Parameter notes:**
- `languages` accepts a list (e.g., `["python", "typescript"]`), not a single string
- `paths` accepts a list (e.g., `["src/api/", "lib/"]`), not a single string
- `limit` defaults to **5** for MCP (CLI `--limit` defaults to 10)
- `offset` defaults to **0** for MCP and can be used for pagination
- `refresh_index` defaults to `true` -- set to `false` after the first query in a multi-query session when the codebase has not changed

**MCP request example:**
```json
{
  "query": "error handling in API routes",
  "languages": ["python", "typescript"],
  "paths": ["src/api/"],
  "limit": 10,
  "offset": 0,
  "refresh_index": false
}
```

**Response:** Array of search results, each containing:
- `file`: File path relative to project root
- `lines`: Start and end line numbers
- `snippet`: Code excerpt
- `score`: Relevance score (0.0 to 1.0)
- `language`: Detected programming language

---

<!-- /ANCHOR:mcp-tools -->
<!-- ANCHOR:parameter-mapping -->
## 3. CLI vs. MCP PARAMETER MAPPING

| Concept          | CLI Parameter       | MCP Parameter    | Notes                                       |
| ---------------- | ------------------- | ---------------- | ------------------------------------------- |
| Search query     | `QUERY` (positional)| `query`          | Same behavior                               |
| Language filter   | `--lang` (repeatable) | `languages` (list) | CLI: repeatable flag. MCP: list of strings |
| Path filter      | `--path` (string)   | `paths` (list)   | CLI: single path. MCP: list of paths        |
| Result limit     | `--limit` (default: 10) | `limit` (default: 5) | Different defaults        |
| Pagination       | `--offset`          | `offset` (default: 0)  | Available on both surfaces                   |
| Index refresh before search | `--refresh` on `ccc search` | `refresh_index` | CLI search: default false. MCP: default true |

---

<!-- /ANCHOR:parameter-mapping -->
<!-- ANCHOR:supported-languages -->
## 4. SUPPORTED LANGUAGES

CocoIndex Code supports **28+ programming and markup languages**:

| Language    | Code Value     | Common Extensions                |
| ----------- | -------------- | -------------------------------- |
| C           | `c`            | `.c`, `.h`                       |
| C#          | `csharp`       | `.cs`                            |
| C++         | `cpp`          | `.cpp`, `.cc`, `.cxx`, `.hpp`    |
| CSS         | `css`          | `.css`                           |
| DTD         | `dtd`          | `.dtd`                           |
| Elixir      | `elixir`       | `.ex`, `.exs`                    |
| Fortran     | `fortran`      | `.f`, `.f90`, `.f95`, `.for`     |
| Go          | `go`           | `.go`                            |
| Haskell     | `haskell`      | `.hs`                            |
| HTML        | `html`         | `.html`, `.htm`                  |
| Java        | `java`         | `.java`                          |
| JavaScript  | `javascript`   | `.js`, `.mjs`, `.cjs`            |
| JSON        | `json`         | `.json`                          |
| Kotlin      | `kotlin`       | `.kt`, `.kts`                    |
| Lua         | `lua`          | `.lua`                           |
| OCaml       | `ocaml`        | `.ml`, `.mli`                    |
| Pascal      | `pascal`       | `.pas`, `.pp`                    |
| PHP         | `php`          | `.php`                           |
| Python      | `python`       | `.py`                            |
| R           | `r`            | `.r`, `.R`                       |
| Ruby        | `ruby`         | `.rb`                            |
| Rust        | `rust`         | `.rs`                            |
| Scala       | `scala`        | `.scala`                         |
| Solidity    | `solidity`     | `.sol`                           |
| SQL         | `sql`          | `.sql`                           |
| Swift       | `swift`        | `.swift`                         |
| TOML        | `toml`         | `.toml`                          |
| TypeScript  | `typescript`   | `.ts`                            |
| XML         | `xml`          | `.xml`                           |
| YAML        | `yaml`         | `.yml`, `.yaml`                  |
| Zig         | `zig`          | `.zig`                           |

Use these code values with the CLI `--lang` flag or the MCP `languages` parameter.

---

<!-- /ANCHOR:supported-languages -->
<!-- ANCHOR:environment-variables -->
## 5. ENVIRONMENT VARIABLES

| Variable                      | Required | Default              | Description                                       |
| ----------------------------- | -------- | -------------------- | ------------------------------------------------- |
| `COCOINDEX_CODE_DIR`          | No       | `~/.cocoindex_code`  | Override config/data directory                     |
| `COCOINDEX_CODE_ROOT_PATH`    | No       | auto-detected        | Override project root detection                    |

**Legacy variables (mapped automatically):**

| Legacy Variable           | Maps To                      |
| ------------------------- | ---------------------------- |
| `COCOSEARCH_DIR`          | `COCOINDEX_CODE_DIR`         |
| `COCOSEARCH_ROOT_PATH`    | `COCOINDEX_CODE_ROOT_PATH`   |

Legacy variables are recognized for backward compatibility and automatically mapped to their current equivalents. If both legacy and current variables are set, the current variable takes precedence.

---

<!-- /ANCHOR:environment-variables -->
<!-- ANCHOR:settings-schema -->
## 6. SETTINGS SCHEMA

CocoIndex Code uses YAML settings files stored in the project `.cocoindex_code/` directory and the user home `~/.cocoindex_code/` directory.

**User settings** (`~/.cocoindex_code/global_settings.yml`):
- `embedding.provider` -- embedding provider (e.g., `sentence-transformers`, `litellm`)
- `embedding.model` -- embedding model name (e.g., `all-MiniLM-L6-v2`, `gemini/text-embedding-004`)
- `embedding.device` -- compute device (e.g., `cpu`, `cuda`, `mps`; default: auto-detect)
- `envs` -- environment variables map (e.g., API keys for LiteLLM providers)

**Project settings** (`<project>/.cocoindex_code/settings.yml`):
- `include_patterns` -- glob patterns for files to index (default: language-specific patterns)
- `exclude_patterns` -- glob patterns for files to exclude (default: common build/vendor dirs)
- `language_overrides` -- list of `{ext, lang}` mappings for custom file extensions

For detailed schema and configuration examples, see the upstream test files in `tests/test_settings.py` and `tests/test_config.py`.

---

<!-- /ANCHOR:settings-schema -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

| Resource         | Location                                                            |
| ---------------- | ------------------------------------------------------------------- |
| INSTALL_GUIDE    | `.opencode/skill/mcp-coco-index/INSTALL_GUIDE.md`              |
| Search Patterns  | `.opencode/skill/mcp-coco-index/references/search_patterns.md` |
| Cross-CLI Playbook | `.opencode/skill/mcp-coco-index/references/cross_cli_playbook.md` |
| Config Templates | `.opencode/skill/mcp-coco-index/assets/config_templates.md`    |
| Upstream Tests   | `.opencode/skill/mcp-coco-index/tests/`                        |

<!-- /ANCHOR:related-resources -->
