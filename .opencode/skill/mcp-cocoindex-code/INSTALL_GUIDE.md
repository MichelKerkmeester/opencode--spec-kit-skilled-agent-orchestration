---
title: "CocoIndex Code Installation Guide"
description: "Complete installation and configuration guide for the CocoIndex Code MCP server providing semantic code search via vector embeddings."
trigger_phrases:
  - "install cocoindex"
  - "setup ccc"
  - "cocoindex install"
---

# CocoIndex Code Installation Guide

Complete installation and configuration guide for CocoIndex Code, a semantic code search engine for AI-assisted development. Provides natural language code search across your entire codebase using the all-MiniLM-L6-v2 embedding model (local, no API key required). Runs as an MCP server exposing search, index, status, and reset tools to any AI assistant. Covers CLI usage, MCP configuration for all 6 CLI environments, and index management.

> **Part of OpenCode Installation.** See the [Master Installation Guide](../README.md) for complete setup.
> **Package:** `cocoindex-code` (PyPI) | **Dependencies:** Python 3.11+

**Version:** 1.0.0 | **Updated:** 2026-03-18 | **Protocol:** MCP (stdio)

---

<!-- ANCHOR:ai-first-install-guide -->
## 0. AI-First Install Guide

Copy and paste this prompt to your AI assistant to get installation help:

```
I want to install CocoIndex Code for semantic code search.

Please help me:
1. Check if I have Python 3.11+ installed
2. Run the install script: bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh
3. Initialize the index with `ccc init` and `ccc index`
4. Configure MCP for my environment (I'm using: [Claude Code / Copilot / Agents CLI / Gemini CLI / Claude CLI / Codex CLI])
5. Verify with a test search: ccc search "error handling"

My project is located at: [your project path]

Guide me through each step with the exact commands needed.
```

The AI will:
- Verify Python 3.11+ is available on your system
- Run the install script to create a venv and install cocoindex-code
- Initialize the semantic index for your project
- Configure the MCP server for your AI platform
- Test with a sample semantic search query

**Expected setup time:** 3 to 5 minutes (plus indexing time depending on codebase size)

### Quick Success Check (30 seconds)

After installation, run these two tests immediately:

1. Open your terminal and run: `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc status`
2. Status output appears: CLI is working
3. Run: `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc search "hello world"`
4. Search results appear: full system is working

Not working? Go to [Troubleshooting](#9-troubleshooting).

<!-- /ANCHOR:ai-first-install-guide -->

---

<!-- ANCHOR:table-of-contents -->
## Table of Contents

0. [AI-First Install Guide](#0-ai-first-install-guide)
1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Configuration](#4-configuration)
5. [Verification](#5-verification)
6. [Usage](#6-usage)
7. [Features](#7-features)
8. [Examples](#8-examples)
9. [Troubleshooting](#9-troubleshooting)
10. [Resources](#10-resources)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. Overview

CocoIndex Code gives AI assistants the ability to search your codebase by meaning rather than exact text. Ask "how does authentication work" and it finds relevant code across files and languages, even when the word "authentication" never appears in the source.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### Source Repository

| Property      | Value                                                                 |
| ------------- | --------------------------------------------------------------------- |
| **PyPI**      | [cocoindex-code](https://pypi.org/project/cocoindex-code/)           |
| **Binary**    | `ccc`                                                                 |
| **License**   | Apache-2.0                                                            |
| **Embedding** | all-MiniLM-L6-v2 (local, no API key)                                 |

### When to Use Semantic Search

| Scenario                                  | Tool           | Why                                              |
| ----------------------------------------- | -------------- | ------------------------------------------------ |
| Find code by meaning or intent            | CocoIndex Code | Understands concepts, not just keywords           |
| Find exact string or regex pattern         | Grep           | Faster for known text patterns                    |
| Find files by name or glob pattern         | Glob           | File discovery by path pattern                    |
| Understand how a feature is implemented    | CocoIndex Code | Finds related code across files                   |
| Find all usages of a specific function     | Grep           | Exact match is more reliable for names            |

Default to Grep for exact matches. Use CocoIndex Code when you need semantic understanding.

### Decision Flowchart

```
Search task received --> Do you know the exact text?
                              |
                      +-------+-------+
                     YES              NO
                      |               |
                      v               v
                  Use Grep       Is ccc available?
                  (fastest)           |
                              +-------+-------+
                             YES              NO
                              |               |
                              v               v
                         Use ccc         Install ccc:
                         (semantic)      bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh
```

### Architecture Diagram

```
+-------------------------------------------------------------+
|                 AI Client (Any CLI Agent)                     |
+--------------------------+----------------------------------+
                           | MCP (stdio)
                           v
+-------------------------------------------------------------+
|              CocoIndex Code MCP Server                       |
|              (ccc mcp)                                       |
|                                                              |
|  Tools: search, index, status, reset                         |
|  Embedding: all-MiniLM-L6-v2 (local)                        |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|              .cocoindex_code/ (project root)                 |
|              Semantic vector index                            |
|              14 supported languages                          |
+-------------------------------------------------------------+
```

### Performance Targets

| Operation         | Target | Typical   |
| ----------------- | ------ | --------- |
| Semantic search   | <2s    | ~500ms    |
| Index build       | varies | 1-5 min   |
| Index refresh     | <30s   | ~10s      |
| Status check      | <1s    | ~200ms    |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:prerequisites -->
## 2. Prerequisites

### Required Tools

- **Python 3.11 or higher**
  ```bash
  python3.11 --version
  # Should show Python 3.11.x or higher
  ```

- **pip** (comes with Python)
  ```bash
  python3.11 -m pip --version
  ```

### Platform Support

| Platform    | Status         | Notes                              |
| ----------- | -------------- | ---------------------------------- |
| **macOS**   | Native support | Recommended                        |
| **Linux**   | Native support | May need python3.11-venv package   |
| **Windows** | WSL only       | PowerShell and Git Bash not tested |

### Common Setup Issues

**Python 3.11 not found:**
```bash
# macOS (Homebrew)
brew install python@3.11

# Linux (Ubuntu/Debian)
sudo apt install python3.11 python3.11-venv

# Verify
python3.11 --version
```

### Validation: `phase_1_complete`

Run these checks to confirm prerequisites are met:

| Check           | Command                       | Expected                |
| --------------- | ----------------------------- | ----------------------- |
| Python version  | `python3.11 --version`        | `Python 3.11.x`        |
| pip available   | `python3.11 -m pip --version` | pip version output      |
| venv available  | `python3.11 -m venv --help`   | Usage information       |

**STOP if validation fails.** Fix the issue before continuing.

<!-- /ANCHOR:prerequisites -->

---

<!-- ANCHOR:installation -->
## 3. Installation

This section covers **Phase 2 (Install)** and **Phase 3 (Initialize)**.

### Recommended: Venv in Skill Folder

Run the install script to create a venv inside the skill folder and install cocoindex-code:

```bash
bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh
```

The script will:
1. Create a Python 3.11 venv at `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/`
2. Install `cocoindex-code` from PyPI into the venv
3. Verify the `ccc` binary works
4. Initialize the index directory if it does not exist

### Alternative: pipx System-Wide

If you prefer a system-wide installation:

```bash
pipx install --python python3.11 cocoindex-code
```

> **Note**: The MCP configuration examples in this guide use the venv path. If you use pipx, replace the binary path with `ccc` (or the full pipx path from `which ccc`).

### Verify the Binary

```bash
# Confirm installation (venv method)
.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc --help
# Should display help text

# Or if using pipx
ccc --help
```

### Validation: `phase_2_complete`

| Check         | Command                                                                        | Expected             |
| ------------- | ------------------------------------------------------------------------------ | -------------------- |
| Binary exists | `ls .opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc`              | File exists          |
| Help works    | `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc --help`          | Help text            |

**STOP if validation fails.** Check installation output for errors.

### Initialize the Index

```bash
cd /path/to/your/project

# Initialize the project (creates .cocoindex_code/ directory)
.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc init

# Build the semantic index (this may take a few minutes)
.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc index
```

> **Note**: The `.cocoindex_code/` directory should be gitignored. It stores the semantic vector index locally.

### Validation: `phase_3_complete`

| Check           | Command                                                                  | Expected                   |
| --------------- | ------------------------------------------------------------------------ | -------------------------- |
| Index directory | `ls -d .cocoindex_code/`                                                 | Directory exists           |
| Status works    | `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc status`     | Index stats displayed      |

**STOP if validation fails.** Check initialization output for errors.

<!-- /ANCHOR:installation -->

---

<!-- ANCHOR:configuration -->
## 4. Configuration

Connect CocoIndex Code to your AI assistant (Phase 4). The MCP server runs via `ccc mcp` in stdio mode.

**Key environment variable:**
- `COCOINDEX_CODE_ROOT_PATH` - The root directory of the project to search. Set this to your project root.

### Configuration for All 6 CLI Environments

See [Config Templates](assets/config_templates.md) for ready-to-copy snippets for each CLI.

Below are the core patterns. Replace `/abs/path/to` with your actual project path.

### Option A: Claude Code (`.mcp.json`)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": "/abs/path/to/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "/abs/path/to/project"
      },
      "disabled": true
    }
  }
}
```

> **Note**: Set `"disabled": true` initially. Enable after verification by changing to `false`.

### Option B: Copilot / OpenCode (`opencode.json`)

```json
{
  "mcp": {
    "cocoindex_code": {
      "type": "local",
      "command": [
        "/abs/path/to/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc",
        "mcp"
      ],
      "environment": {
        "COCOINDEX_CODE_ROOT_PATH": "/abs/path/to/project",
        "_NOTE_1_PACKAGE": "PyPI: cocoindex-code, installed via scripts/install.sh",
        "_NOTE_2_EMBEDDING": "Default: all-MiniLM-L6-v2 (local, no API key needed)",
        "_NOTE_3_INDEX": "Index stored in .cocoindex_code/ (gitignored)"
      }
    }
  }
}
```

### Option C: Agents CLI (`.agents/settings.json`)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": "/abs/path/to/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "cwd": "/abs/path/to/project",
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "/abs/path/to/project"
      },
      "trust": true
    }
  }
}
```

### Option D: Gemini CLI (`.gemini/settings.json`)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": "/abs/path/to/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "cwd": "/abs/path/to/project",
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "/abs/path/to/project"
      },
      "trust": true
    }
  }
}
```

### Option E: Claude CLI (`.claude/mcp.json`)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": ".opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": ".",
        "_NOTE_1_PACKAGE": "PyPI: cocoindex-code, installed via scripts/install.sh",
        "_NOTE_2_EMBEDDING": "Default: all-MiniLM-L6-v2 (local, no API key needed)",
        "_NOTE_3_INDEX": "Index stored in .cocoindex_code/ (gitignored)"
      }
    }
  }
}
```

> **Note**: Claude CLI supports relative paths. The `.` value for `COCOINDEX_CODE_ROOT_PATH` resolves to the project root.

### Option F: Codex CLI (`.codex/config.toml`)

```toml
[mcp_servers.cocoindex_code]
command = "/abs/path/to/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc"
args = ["mcp"]

[mcp_servers.cocoindex_code.env]
COCOINDEX_CODE_ROOT_PATH = "."
_NOTE_1 = "Requires: pipx install --python python3.11 cocoindex-code"
_NOTE_2 = "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)"
_NOTE_3 = "Index stored in .cocoindex_code/ (gitignored)"
```

### Validation: `phase_4_complete`

| Check             | Method                                 | Expected                       |
| ----------------- | -------------------------------------- | ------------------------------ |
| Config exists     | Open your CLI's config file            | cocoindex_code entry present   |
| Binary path valid | `ls /abs/path/to/.../bin/ccc`          | File exists                    |
| JSON syntax valid | `python3 -m json.tool < config.json`   | No syntax errors               |

**STOP if validation fails.** Fix configuration syntax or paths before continuing.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:verification -->
## 5. Verification

### One-Command Health Check

```bash
# Complete CLI verification in one command
CCC=".opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc" && \
  $CCC status 2>&1 && \
  $CCC search "hello" --limit 3 2>&1 && \
  echo "SUCCESS: All checks passed" || \
  echo "FAILED: Check error output above"
```

### Full Verification Checklist

| #   | Check          | Command                     | Expected Result             |
| --- | -------------- | --------------------------- | --------------------------- |
| 1   | Binary exists  | `ls .../mcp_server/.venv/bin/ccc` | File exists             |
| 2   | Help works     | `ccc --help`                | Help text displayed         |
| 3   | Status works   | `ccc status`                | Index stats output          |
| 4   | Index exists   | `ls -d .cocoindex_code/`    | Directory exists            |
| 5   | Search works   | `ccc search "test"`         | Results returned            |
| 6   | MCP mode       | `ccc mcp` (then Ctrl+C)    | Server starts, no errors    |

### Verify in Your AI Client

In your AI client, ask:
```
Search the codebase for "error handling patterns"
```

Expected result: The AI uses the CocoIndex Code search tool and returns relevant code snippets with file paths and relevance scores.

### Validation: `phase_5_complete`

All 6 checklist items above pass with no errors. Your AI client successfully runs a semantic search on request.

**STOP if validation fails.** Check MCP configuration, restart your AI client, and review [Troubleshooting](#9-troubleshooting).

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:usage -->
## 6. Usage

### Pattern 1: Basic Semantic Search

```bash
ccc search "authentication middleware"
# Returns code snippets related to authentication, ranked by relevance
```

### Pattern 2: Language-Filtered Search

```bash
ccc search "database connection" --lang python
# Only searches Python files
```

### Pattern 3: Path-Scoped Search

```bash
ccc search "error handling" --path src/api/
# Only searches within the src/api/ directory
```

### Pattern 4: Paginated Results

```bash
ccc search "configuration" --limit 5 --offset 10
# Get results 11-15
```

### Pattern 5: Rebuild Index After Changes

```bash
# Full rebuild
ccc index

# Force refresh during search
ccc search "my query" --refresh
```

### Pattern 6: Check Index Status

```bash
ccc status
# Shows: indexed files, languages, index size, last update
```

### Tool Selection Guide

| Scenario                               | Tool           | Why                            |
| -------------------------------------- | -------------- | ------------------------------ |
| "How does X work?"                     | CocoIndex Code | Semantic understanding         |
| Find exact function name               | Grep           | Exact text match               |
| Find files by extension                | Glob           | Pattern-based file discovery   |
| Understand feature implementation      | CocoIndex Code | Cross-file concept search      |
| Find all TODO comments                 | Grep           | Exact pattern match            |
| "Where is error handling done?"        | CocoIndex Code | Intent-based search            |

<!-- /ANCHOR:usage -->

---

<!-- ANCHOR:features -->
## 7. Features

### Supported Languages (14)

| Language    | Extension(s)           |
| ----------- | ---------------------- |
| Python      | `.py`                  |
| TypeScript  | `.ts`                  |
| JavaScript  | `.js`                  |
| TSX         | `.tsx`                 |
| Rust        | `.rs`                  |
| Go          | `.go`                  |
| Java        | `.java`                |
| C           | `.c`                   |
| C++         | `.cpp`, `.cc`, `.cxx`  |
| C#          | `.cs`                  |
| SQL         | `.sql`                 |
| Bash        | `.sh`, `.bash`         |
| Markdown    | `.md`                  |
| Text        | `.txt`                 |

### Embedding Model

| Property        | Value                                    |
| --------------- | ---------------------------------------- |
| **Model**       | all-MiniLM-L6-v2                         |
| **Type**        | Local (no API key, no network required)  |
| **Dimensions**  | 384                                      |
| **Speed**       | Fast (runs on CPU)                       |
| **Quality**     | Good for code search tasks               |

### CLI Commands

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `ccc search`      | Semantic search across codebase      |
| `ccc index`       | Build or update the semantic index   |
| `ccc status`      | Show project and index statistics    |
| `ccc init`        | Initialize project index directory   |
| `ccc reset`       | Reset databases                      |
| `ccc mcp`         | Run as MCP server (stdio mode)       |
| `ccc daemon`      | Manage background daemon             |

### MCP Tools

| Tool       | Parameters                                          | Description                |
| ---------- | --------------------------------------------------- | -------------------------- |
| `search`   | query (required), lang, path, limit, offset         | Semantic code search       |
| `status`   | none                                                | Index statistics           |
| `index`    | none                                                | Trigger index build/update |
| `reset`    | none                                                | Reset the index            |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:examples -->
## 8. Examples

### Example 1: Find Authentication Logic

```bash
ccc search "how does user authentication work"
# Returns: login handlers, auth middleware, token validation, session management
```

### Example 2: Search Specific Language

```bash
ccc search "database migration" --lang python
# Returns: only Python files related to database migrations
```

### Example 3: Scoped Search in Directory

```bash
ccc search "API route handlers" --path src/routes/ --limit 5
# Returns: top 5 matches within src/routes/
```

### Example 4: Find Error Handling Patterns

```bash
ccc search "error handling and recovery" --lang typescript
# Returns: try/catch blocks, error boundaries, retry logic in TypeScript files
```

### Example 5: Discover Test Patterns

```bash
ccc search "unit test setup and teardown"
# Returns: test fixtures, beforeEach/afterEach, test helpers across all languages
```

### Example 6: Index Management

```bash
# Check current index state
ccc status

# Rebuild after major changes
ccc index

# Reset and start fresh
ccc reset
ccc init
ccc index
```

<!-- /ANCHOR:examples -->

---

<!-- ANCHOR:troubleshooting -->
## 9. Troubleshooting

### Error/Cause/Fix Reference

| Error | Cause | Fix |
| ----- | ----- | --- |
| `command not found: ccc` | Binary not in PATH or venv not activated | Use full path: `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc` |
| `Python 3.11 not found` | Python 3.11 not installed | Install with `brew install python@3.11` (macOS) or `apt install python3.11` (Linux) |
| `No such file or directory: .cocoindex_code/` | Index not initialized | Run `ccc init` then `ccc index` from project root |
| `ModuleNotFoundError` | Package not installed in venv | Re-run `bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh` |
| `No results found` | Index is empty or stale | Run `ccc index` to rebuild. Check `ccc status` for indexed file count |
| `MCP server not appearing in tools` | Config file error or path incorrect | Verify config JSON syntax and binary path. Restart AI client |
| `COCOINDEX_CODE_ROOT_PATH not set` | Environment variable missing from config | Add `COCOINDEX_CODE_ROOT_PATH` to your MCP config's env section |
| `Permission denied` | Binary not executable | Run `chmod +x .opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc` |

### Binary Not Found

```bash
# Use the full venv path
.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc --help

# Or add to your shell profile
echo 'alias ccc=".opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc"' >> ~/.zshrc
source ~/.zshrc
```

### Empty Search Results

```bash
# Check if index has content
ccc status

# If index is empty, rebuild
ccc index

# If still empty, verify COCOINDEX_CODE_ROOT_PATH points to your project
echo $COCOINDEX_CODE_ROOT_PATH
```

### MCP Server Not Connecting

1. Verify the binary path exists:
   ```bash
   ls -la .opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc
   ```

2. Test MCP mode directly:
   ```bash
   .opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc mcp
   # Should start without errors (Ctrl+C to stop)
   ```

3. Check your config file for syntax errors:
   ```bash
   python3 -m json.tool < .mcp.json
   ```

4. Restart your AI client completely.

### Venv Corrupted

```bash
# Remove and recreate
rm -rf .opencode/skill/mcp-cocoindex-code/mcp_server/.venv
bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:resources -->
## 10. Resources

### Related Documentation

| Document          | Location                                                              | Purpose              |
| ----------------- | --------------------------------------------------------------------- | -------------------- |
| SKILL.md          | `.opencode/skill/mcp-cocoindex-code/SKILL.md`                        | Complete workflows   |
| Tool Reference    | `.opencode/skill/mcp-cocoindex-code/references/tool_reference.md`     | CLI and MCP tools    |
| Search Patterns   | `.opencode/skill/mcp-cocoindex-code/references/search_patterns.md`    | Query strategies     |
| Config Templates  | `.opencode/skill/mcp-cocoindex-code/assets/config_templates.md`       | All 6 CLI configs    |

### File Locations

| Path                                                            | Purpose                    |
| --------------------------------------------------------------- | -------------------------- |
| `.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc`  | Binary (venv install)      |
| `.opencode/skill/mcp-cocoindex-code/scripts/install.sh`        | Install script             |
| `.opencode/skill/mcp-cocoindex-code/scripts/update.sh`         | Update script              |
| `.cocoindex_code/`                                              | Semantic index (gitignored)|

### External Resources

- **PyPI**: [cocoindex-code](https://pypi.org/project/cocoindex-code/)
- **Embedding Model**: [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)

<!-- /ANCHOR:resources -->

---

<!-- ANCHOR:quick-reference-card -->
## Quick Reference Card

### Installation

```bash
bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh
```

### Index Management

```bash
ccc init                      # Initialize project
ccc index                     # Build/update index
ccc status                    # Check index stats
ccc reset                     # Reset databases
```

### Search

```bash
ccc search "query"                        # Basic search
ccc search "query" --lang python          # Language filter
ccc search "query" --path src/            # Path filter
ccc search "query" --limit 5             # Limit results
ccc search "query" --offset 10           # Pagination
ccc search "query" --refresh             # Force index refresh
```

### MCP Server

```bash
ccc mcp                       # Run as MCP server (stdio)
ccc daemon start              # Start background daemon
ccc daemon stop               # Stop daemon
ccc daemon status             # Check daemon status
```

### Validation Checkpoints Summary

| Checkpoint          | Meaning                              |
| ------------------- | ------------------------------------ |
| `phase_1_complete`  | Python 3.11+ verified                |
| `phase_2_complete`  | Binary installed and working         |
| `phase_3_complete`  | Index initialized and built          |
| `phase_4_complete`  | MCP configuration valid              |
| `phase_5_complete`  | End-to-end search operational        |

<!-- /ANCHOR:quick-reference-card -->

---

<!-- ANCHOR:version-history -->
## Version History

| Version | Date       | Changes                      |
| ------- | ---------- | ---------------------------- |
| 1.0.0   | 2026-03-18 | Initial installation guide   |

---

**Need help?** See [Troubleshooting](#9-troubleshooting) or load the `mcp-cocoindex-code` skill for detailed workflows.
<!-- /ANCHOR:version-history -->
