---
title: "CocoIndex Code - Semantic Code Search"
description: "Vector-based semantic code search via MCP. Indexes the codebase into embeddings for natural language code discovery across 14+ languages."
trigger_phrases:
  - "semantic search"
  - "cocoindex"
  - "ccc"
  - "find code that"
  - "code search"
---

# CocoIndex Code - Semantic Code Search

> Vector-based semantic code search via MCP server. Indexes the codebase into **105K+ chunks** across **14 languages** using local embeddings (all-MiniLM-L6-v2). No API keys required.

[![MCP](https://img.shields.io/badge/MCP-Native-brightgreen.svg)](https://modelcontextprotocol.io)

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. TOOL SELECTION GUIDE](#3--tool-selection-guide)
- [4. CLI TOOLS](#4--cli-tools)
- [5. MCP INTEGRATION](#5--mcp-integration)
- [6. CONFIGURATION](#6--configuration)
- [7. PERFORMANCE](#7--performance)
- [8. USAGE PATTERNS](#8--usage-patterns)
- [9. TROUBLESHOOTING](#9--troubleshooting)
- [10. RESOURCES](#10--resources)
- [11. QUICK REFERENCE CARD](#11--quick-reference-card)

---

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What It Does

CocoIndex Code provides semantic code search using vector embeddings. Instead of matching exact text like `grep`, it understands the **meaning** behind your query and returns code that is conceptually relevant - even when the exact words differ.

Type `ccc search "error handling middleware"` and get results ranked by semantic similarity, not keyword frequency.

### Key Capabilities

| Feature | Description |
|---------|-------------|
| **Local Embeddings** | all-MiniLM-L6-v2 model, no API key needed |
| **14 Languages** | markdown, rust, typescript, javascript, cpp, bash, python, java, go, text, csharp, c, sql, tsx |
| **105K+ Chunks** | 6,792 files indexed into 105,965 searchable chunks |
| **SQLite Storage** | sqlite-vec for vector similarity search |
| **Language Filtering** | `--lang` flag narrows results by programming language |
| **Path Filtering** | `--path` flag narrows results by file path glob |

### Source Repository

| Property | Value |
|----------|-------|
| **PyPI** | [cocoindex-code](https://pypi.org/project/cocoindex-code/) |
| **GitHub** | [cocoindex-io/cocoindex](https://github.com/cocoindex-io/cocoindex) |
| **License** | Apache-2.0 |

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### Prerequisites

| Component | Purpose |
|-----------|---------|
| **Python 3.11+** | Runtime environment |
| **pip** | Package installation |
| **Disk space** | ~200MB for model + index |

### Installation

Run the bundled install script:

```bash
bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh
```

This creates a Python venv, installs `cocoindex-code` from PyPI, and initializes the project.

### Build the Index

```bash
ccc index
```

First-time indexing takes several minutes depending on codebase size. Subsequent runs are incremental.

### Search

```bash
ccc search "authentication middleware"
ccc search "error handling" --lang typescript
ccc search "database migration" --path "src/**"
```

---

<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:tool-selection -->
## 3. TOOL SELECTION GUIDE

### When to Use Each Tool

| Tool | Use When | Strength |
|------|----------|----------|
| **CocoIndex (`ccc search`)** | You know **what** code does but not **where** it lives | Semantic meaning |
| **Grep** | You know the exact text, variable name, or pattern | Exact text matching |
| **Glob** | You know the filename or extension pattern | File discovery |
| **Read** | You know the exact file path | File contents |

### Tool Selection Flowchart

```text
What are you looking for?
         |
         v
+---------------------+
| Do you know the     |
| exact text/symbol?  |
+--------+------------+
         |
    +----+----+
    |         |
   YES        NO
    |         |
    v         v
  Grep    +-------------------+
          | Do you know what  |
          | the code DOES?    |
          +--------+----------+
                   |
              +----+----+
              |         |
             YES        NO
              |         |
              v         v
         ccc search   Glob
         (semantic)   (by filename)
```

### Decision Examples

| Scenario | Best Tool | Why |
|----------|-----------|-----|
| Find all `useState` calls | Grep | Exact symbol match |
| Find "code that validates email" | ccc search | Semantic understanding |
| Find all `*.test.ts` files | Glob | File pattern match |
| Find "retry logic with exponential backoff" | ccc search | Concept search |
| Find `TODO` comments | Grep | Exact text match |
| Find "functions that parse JSON config" | ccc search | Behavior search |

---

<!-- /ANCHOR:tool-selection -->

<!-- ANCHOR:cli-tools -->
## 4. CLI TOOLS

### 4.1 ccc search

**Purpose**: Semantic search across the indexed codebase.

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `QUERY` | text | Yes | - | Natural language search query |
| `--lang` | text | No | all | Filter by programming language |
| `--path` | text | No | all | Filter by file path glob |
| `--limit` | integer | No | 10 | Maximum results to return |
| `--offset` | integer | No | 0 | Number of results to skip |
| `--refresh` | flag | No | false | Refresh index before searching |

**Example**:
```bash
ccc search "error handling middleware" --lang typescript --limit 5
```

---

### 4.2 ccc index

**Purpose**: Create or update the semantic index for the codebase.

**Parameters**: None (operates on current project root).

**Example**:
```bash
ccc index
```

Scans all files, chunks them, generates embeddings with all-MiniLM-L6-v2, and stores vectors in SQLite. Incremental - only re-indexes changed files.

---

### 4.3 ccc status

**Purpose**: Show project index statistics.

**Example**:
```bash
ccc status
```

**Output**: Displays chunk count, file count, and per-language breakdown.

---

### 4.4 ccc init

**Purpose**: Initialize a project for CocoIndex Code.

**Example**:
```bash
ccc init
```

Creates `.cocoindex_code/` directory and `settings.yml`. Adds `.cocoindex_code/` to `.gitignore`.

---

### 4.5 ccc reset

**Purpose**: Reset project databases and optionally remove settings.

**Parameters**:

| Parameter | Description |
|-----------|-------------|
| `--all` | Also remove settings and .gitignore entry |
| `--force`, `-f` | Skip confirmation prompt |

**Example**:
```bash
ccc reset          # Reset databases only
ccc reset --all    # Full reset including settings
```

---

### 4.6 ccc mcp

**Purpose**: Run CocoIndex Code as an MCP server in stdio mode.

**Example**:
```bash
ccc mcp
```

Used by MCP clients (Claude Code, OpenCode) to integrate semantic search as a tool.

---

### 4.7 ccc daemon

**Purpose**: Manage the background daemon process for continuous indexing.

**Subcommands**:

| Subcommand | Description |
|------------|-------------|
| `ccc daemon status` | Show daemon status |
| `ccc daemon restart` | Restart the daemon |
| `ccc daemon stop` | Stop the daemon |

---

<!-- /ANCHOR:cli-tools -->

<!-- ANCHOR:mcp-integration -->
## 5. MCP INTEGRATION

### How It Works

CocoIndex Code runs as an MCP server using stdio transport. When enabled, AI agents can call semantic search directly without going through the CLI.

### Claude Code Configuration (.mcp.json)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": "/absolute/path/to/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "/absolute/path/to/project"
      },
      "disabled": true
    }
  }
}
```

### Current Status

CocoIndex Code MCP is **disabled by default** in `.mcp.json`. Enable it by setting `"disabled": false` when you want agents to have direct semantic search access.

**Why disabled by default**: The semantic search index adds context to every agent session. Enable it only when the codebase is indexed and you actively need semantic search during agent conversations.

---

<!-- /ANCHOR:mcp-integration -->

<!-- ANCHOR:configuration -->
## 6. CONFIGURATION

### Key Paths

| Path | Purpose |
|------|---------|
| **Binary (venv)** | `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc` |
| **Index directory** | `.cocoindex_code/` (project root, gitignored) |
| **Settings** | `.cocoindex_code/settings.yml` |
| **MCP config** | `.mcp.json` (Claude Code) or `opencode.json` (OpenCode) |

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `COCOINDEX_CODE_ROOT_PATH` | Project root for indexing | Current directory |

### Settings File (.cocoindex_code/settings.yml)

Created by `ccc init`. Contains project-specific index configuration including language filters, ignore patterns, and chunk size settings.

### Gitignore

The `.cocoindex_code/` directory is automatically added to `.gitignore` during `ccc init`. The index is local-only and should not be committed.

---

<!-- /ANCHOR:configuration -->

<!-- ANCHOR:performance -->
## 7. PERFORMANCE

### Index Statistics

| Metric | Value |
|--------|-------|
| **Total Files** | 6,792 |
| **Total Chunks** | 105,965 |
| **Languages** | 14 |
| **Embedding Model** | all-MiniLM-L6-v2 (local) |

### Chunk Distribution by Language

| Language | Chunks | Share |
|----------|--------|-------|
| **markdown** | 64,759 | 61.1% |
| **rust** | 20,559 | 19.4% |
| **typescript** | 13,750 | 13.0% |
| **javascript** | 2,221 | 2.1% |
| **cpp** | 1,200 | 1.1% |
| **bash** | 1,111 | 1.0% |
| **python** | 1,107 | 1.0% |
| **java** | 460 | 0.4% |
| **go** | 275 | 0.3% |
| **text** | 273 | 0.3% |
| **csharp** | 89 | 0.1% |
| **c** | 83 | 0.1% |
| **sql** | 47 | <0.1% |
| **tsx** | 31 | <0.1% |

### Search Performance

- Sub-second for most queries against the full 105K chunk index
- Language and path filters reduce search space and improve speed
- SQLite-vec provides efficient approximate nearest neighbor search

---

<!-- /ANCHOR:performance -->

<!-- ANCHOR:usage-patterns -->
## 8. USAGE PATTERNS

### Pattern 1: Basic Search

Find code by describing what it does.

```bash
ccc search "authentication middleware that checks JWT tokens"
```

### Pattern 2: Language-Filtered Search

Narrow results to a specific language.

```bash
ccc search "database connection pooling" --lang typescript
ccc search "error handling patterns" --lang python
ccc search "build configuration" --lang rust
```

### Pattern 3: Path-Filtered Search

Narrow results to a specific directory or file pattern.

```bash
ccc search "test helpers" --path "**/*.test.*"
ccc search "API routes" --path "src/routes/**"
ccc search "MCP server handlers" --path ".opencode/**"
```

### Pattern 4: Combined Filters

Use both language and path filters together.

```bash
ccc search "validation logic" --lang typescript --path "src/**" --limit 5
```

### Pattern 5: Verify Results with Read

Semantic search returns file paths and snippets. Always verify by reading the full file.

```bash
# 1. Search for the concept
ccc search "retry with exponential backoff"

# 2. Read the top result to verify
# (Use the Read tool with the file path from search results)
```

### Pattern 6: Refresh Before Search

Force an index update before searching to catch recent changes.

```bash
ccc search "new feature implementation" --refresh
```

---

<!-- /ANCHOR:usage-patterns -->

<!-- ANCHOR:troubleshooting -->
## 9. TROUBLESHOOTING

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `command not found: ccc` | Binary not in PATH | Use venv path: `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc` |
| Empty search results | Query too specific or index stale | Broaden the query; run `ccc index` to refresh |
| `No index found` | Index not built yet | Run `ccc init` then `ccc index` |
| `No settings found` | Project not initialized | Run `ccc init` in the project root |
| Slow first search | Model loading into memory | Subsequent searches are faster; this is one-time |
| Stale results | Recent files not indexed | Run `ccc index` or use `--refresh` flag |
| MCP connection failed | Server not started or wrong path | Check `.mcp.json` command path and `disabled` flag |
| Python version error | Requires Python 3.11+ | Install Python 3.11 or later |

### Diagnostic Commands

```bash
# Check index health
ccc status

# Verify binary location
ls -la .opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc

# Rebuild from scratch
ccc reset --force
ccc index
```

---

<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:resources -->
## 10. RESOURCES

### Bundled Files

| File | Purpose |
|------|---------|
| [scripts/install.sh](scripts/install.sh) | Install CocoIndex Code into skill venv |
| [scripts/update.sh](scripts/update.sh) | Update to latest version |

### External Resources

- [CocoIndex GitHub](https://github.com/cocoindex-io/cocoindex) - Source code and documentation
- [CocoIndex Code on PyPI](https://pypi.org/project/cocoindex-code/) - Python package
- [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) - Embedding model
- [sqlite-vec](https://github.com/asg017/sqlite-vec) - SQLite vector search extension

### Related Skills

| Skill | Purpose | Relationship |
|-------|---------|--------------|
| **[system-spec-kit](../system-spec-kit/README.md)** | Context preservation and memory | Complementary - semantic memory vs semantic code search |
| **[mcp-code-mode](../mcp-code-mode/README.md)** | TypeScript tool execution via MCP | Peer MCP skill - different purpose |

---

<!-- /ANCHOR:resources -->

<!-- ANCHOR:quick-reference -->
## 11. QUICK REFERENCE CARD

### Essential Commands

```bash
# Search (most common)
ccc search "what does this code do"
ccc search "error handling" --lang typescript
ccc search "config parsing" --path "src/**" --limit 5

# Index management
ccc index                  # Build/update index
ccc status                 # Show index stats
ccc init                   # Initialize project

# Maintenance
ccc reset                  # Reset databases
ccc reset --all --force    # Full reset, no prompt
ccc daemon status          # Check daemon
ccc daemon restart         # Restart daemon

# MCP mode
ccc mcp                    # Start as MCP server (stdio)
```

### Search Tips

| Tip | Example |
|-----|---------|
| Describe behavior, not symbols | "validates user input" not "validateInput" |
| Use natural language | "function that retries failed HTTP requests" |
| Filter by language for precision | `--lang typescript` |
| Filter by path for scope | `--path "src/api/**"` |
| Combine filters | `--lang python --path "tests/**"` |
| Use `--refresh` for latest changes | `ccc search "new feature" --refresh` |

**Remember**: CocoIndex is for **semantic search** (meaning-based). For exact text matching, use Grep. For file discovery by name, use Glob.

<!-- /ANCHOR:quick-reference -->
