---
title: CocoIndex Code Tool Reference
description: Complete reference for all CocoIndex Code CLI commands and MCP tools with parameters, examples, and expected output.
trigger_phrases:
  - ccc commands
  - cocoindex tools
  - search parameters
  - mcp tools cocoindex
  - ccc cli reference
---

# CocoIndex Code Tool Reference

Complete reference for all CLI commands and MCP tools exposed by CocoIndex Code.

---

<!-- ANCHOR:overview -->
## Overview

This document provides the complete reference for CocoIndex Code CLI commands and MCP tools. It covers all available commands (search, index, status, init, reset, mcp, daemon), their parameters, expected output, supported languages, environment variables, and related resources.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:cli-commands -->
## 1. CLI Commands

### ccc search

Perform a semantic search across the indexed codebase.

```bash
ccc search QUERY [--lang LANG] [--path PATH] [--limit N] [--offset N] [--refresh]
```

| Parameter   | Required | Default | Description                                    |
| ----------- | -------- | ------- | ---------------------------------------------- |
| `QUERY`     | Yes      | -       | Natural language search query                  |
| `--lang`    | No       | all     | Filter by language (e.g., python, typescript)  |
| `--path`    | No       | .       | Filter by directory path                       |
| `--limit`   | No       | 10      | Maximum number of results                      |
| `--offset`  | No       | 0       | Skip first N results (pagination)              |
| `--refresh` | No       | false   | Force index refresh before searching           |

**Examples:**
```bash
# Basic search
ccc search "error handling in API routes"

# Filter by language
ccc search "database connection pooling" --lang python

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
ccc init
```

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| (none)    | -        | No parameters. Run from project root |

**Example:**
```bash
cd /path/to/project
ccc init
# Creates .cocoindex_code/ directory
```

**Notes:**
- Run this once per project before building the index
- The install script runs `ccc init` automatically if `.cocoindex_code/` does not exist

---

### ccc reset

Reset the index databases. Optionally remove settings.

```bash
ccc reset [--settings]
```

| Parameter    | Required | Default | Description                                   |
| ------------ | -------- | ------- | --------------------------------------------- |
| `--settings` | No       | false   | Also remove settings (full clean reset)       |

**Examples:**
```bash
# Reset databases only (keep settings)
ccc reset

# Full reset including settings
ccc reset --settings

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
- Exposes 4 tools: search, status, index, reset

---

### ccc daemon

Manage the background indexing daemon.

```bash
ccc daemon start|stop|status
```

| Subcommand | Description                          |
| ---------- | ------------------------------------ |
| `start`    | Start the background daemon          |
| `stop`     | Stop the running daemon              |
| `status`   | Check if the daemon is running       |

**Examples:**
```bash
# Start daemon for automatic re-indexing
ccc daemon start

# Check daemon status
ccc daemon status

# Stop daemon
ccc daemon stop
```

---

<!-- /ANCHOR:cli-commands -->
<!-- ANCHOR:mcp-tools -->
## 2. MCP Tools

These tools are exposed when running `ccc mcp`. AI clients call them through the MCP protocol.

### search

Perform semantic search across the indexed codebase.

| Parameter | Type   | Required | Default | Description                          |
| --------- | ------ | -------- | ------- | ------------------------------------ |
| `query`   | string | Yes      | -       | Natural language search query        |
| `lang`    | string | No       | null    | Filter by programming language       |
| `path`    | string | No       | null    | Filter by directory path             |
| `limit`   | number | No       | 10      | Maximum results to return            |
| `offset`  | number | No       | 0       | Skip first N results                 |

**Response:** Array of search results, each containing:
- `file`: File path relative to project root
- `lines`: Start and end line numbers
- `snippet`: Code excerpt
- `score`: Relevance score (0.0 to 1.0)
- `language`: Detected programming language

---

### status

Return index statistics. No parameters.

**Response:** Object containing:
- `indexed_files`: Number of files in the index
- `languages`: List of indexed languages
- `index_size`: Size of the index on disk
- `last_updated`: Timestamp of last index update

---

### index

Trigger an index build or update. No parameters.

**Response:** Object containing:
- `files_indexed`: Number of files processed
- `files_updated`: Number of files updated
- `duration`: Time taken

---

### reset

Reset the index. No parameters.

**Response:** Confirmation message.

---

<!-- /ANCHOR:mcp-tools -->
<!-- ANCHOR:supported-languages -->
## 3. Supported Languages

CocoIndex Code supports 14 programming languages:

| Language    | Code Value   | Common Extensions              |
| ----------- | ------------ | ------------------------------ |
| Python      | `python`     | `.py`                          |
| TypeScript  | `typescript` | `.ts`                          |
| JavaScript  | `javascript` | `.js`                          |
| TSX         | `tsx`        | `.tsx`                         |
| Rust        | `rust`       | `.rs`                          |
| Go          | `go`         | `.go`                          |
| Java        | `java`       | `.java`                        |
| C           | `c`          | `.c`, `.h`                     |
| C++         | `cpp`        | `.cpp`, `.cc`, `.cxx`, `.hpp`  |
| C#          | `csharp`     | `.cs`                          |
| SQL         | `sql`        | `.sql`                         |
| Bash        | `bash`       | `.sh`, `.bash`                 |
| Markdown    | `markdown`   | `.md`                          |
| Text        | `text`       | `.txt`                         |

Use these code values with the `--lang` flag or the `lang` MCP parameter.

---

<!-- /ANCHOR:supported-languages -->
<!-- ANCHOR:environment-variables -->
## 4. Environment Variables

| Variable                    | Required | Default | Description                              |
| --------------------------- | -------- | ------- | ---------------------------------------- |
| `COCOINDEX_CODE_ROOT_PATH`  | Yes      | `.`     | Root directory of the project to search   |

---

<!-- /ANCHOR:environment-variables -->
<!-- ANCHOR:related-resources -->
## 5. Related Resources

| Resource        | Location                                                            |
| --------------- | ------------------------------------------------------------------- |
| INSTALL_GUIDE   | `.opencode/skill/mcp-cocoindex-code/INSTALL_GUIDE.md`              |
| Search Patterns | `.opencode/skill/mcp-cocoindex-code/references/search_patterns.md` |
| Config Templates| `.opencode/skill/mcp-cocoindex-code/assets/config_templates.md`    |

<!-- /ANCHOR:related-resources -->
