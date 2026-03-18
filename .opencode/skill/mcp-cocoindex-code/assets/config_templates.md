---
title: CocoIndex Code Configuration Templates
description: Ready-to-copy MCP server configuration snippets for all 6 CLI environments, with absolute paths and documentation notes.
trigger_phrases:
  - cocoindex config
  - mcp configuration cocoindex
  - cocoindex setup
  - configure cocoindex for claude
  - cocoindex opencode config
---

# CocoIndex Code Configuration Templates

Ready-to-copy MCP server configuration snippets for all 6 CLI environments.

---

<!-- ANCHOR:overview -->
## 1. Overview

CocoIndex Code runs as an MCP server via `ccc mcp` in stdio mode. Each CLI environment uses a different configuration format. All configurations need:

- **Binary path**: The absolute path to the `ccc` binary in the skill venv
- **Args**: `["mcp"]` to start in MCP server mode
- **Environment**: `COCOINDEX_CODE_ROOT_PATH` set to the project root

### Binary Path

The venv binary path for this project:

```
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc
```

> **Note**: Replace this path with your own if your project is at a different location. Find your project root with `pwd`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:claude-code -->
## 2. Claude Code (`.mcp.json`)

**File location**: `.mcp.json` in project root

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public"
      },
      "disabled": true
    }
  }
}
```

**Notes:**
- Uses absolute paths for command and environment
- Set `"disabled": true` during initial setup, change to `false` after verification
- `args` is an array of strings

<!-- /ANCHOR:claude-code -->

---

<!-- ANCHOR:copilot-opencode -->
## 3. Copilot / OpenCode (`opencode.json`)

**File location**: `opencode.json` in project root

```json
{
  "mcp": {
    "cocoindex_code": {
      "type": "local",
      "command": [
        "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc",
        "mcp"
      ],
      "environment": {
        "COCOINDEX_CODE_ROOT_PATH": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public",
        "_NOTE_1_PACKAGE": "PyPI: cocoindex-code, installed via: bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh",
        "_NOTE_2_EMBEDDING": "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)",
        "_NOTE_3_INDEX": "Index stored in .cocoindex_code/ (gitignored)",
        "_NOTE_4_TOOLS": "Exposes: search (semantic code search), status, index, reset"
      }
    }
  }
}
```

**Notes:**
- `type` is `"local"` for installed binaries
- `command` is an array with the binary and subcommand together
- `_NOTE_*` keys are documentation hints (not used by runtime)
- `environment` passes env vars to the MCP server process

<!-- /ANCHOR:copilot-opencode -->

---

<!-- ANCHOR:agents-cli -->
## 4. Agents CLI (`.agents/settings.json`)

**File location**: `.agents/settings.json` in project root

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "cwd": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public",
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public"
      },
      "trust": true
    }
  }
}
```

**Notes:**
- Uses absolute paths for command, cwd, and environment
- `cwd` sets the working directory for the MCP server process
- `trust: true` allows the server to run without confirmation prompts

<!-- /ANCHOR:agents-cli -->

---

<!-- ANCHOR:gemini-cli -->
## 5. Gemini CLI (`.gemini/settings.json`)

**File location**: `.gemini/settings.json` in project root

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "cwd": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public",
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public"
      },
      "trust": true
    }
  }
}
```

**Notes:**
- Same format as Agents CLI
- Uses absolute paths for all fields
- `trust: true` required for Gemini CLI to run MCP servers

<!-- /ANCHOR:gemini-cli -->

---

<!-- ANCHOR:claude-cli -->
## 6. Claude CLI (`.claude/mcp.json`)

**File location**: `.claude/mcp.json` in project root

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": ".opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": ".",
        "_NOTE_1_PACKAGE": "PyPI: cocoindex-code, installed via: bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh",
        "_NOTE_2_EMBEDDING": "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)",
        "_NOTE_3_INDEX": "Index stored in .cocoindex_code/ (gitignored)",
        "_NOTE_4_TOOLS": "Exposes: search (semantic code search), status, index, reset"
      }
    }
  }
}
```

**Notes:**
- Claude CLI supports relative paths (resolves from project root)
- `"."` for `COCOINDEX_CODE_ROOT_PATH` means the project root
- `_NOTE_*` keys are documentation hints

<!-- /ANCHOR:claude-cli -->

---

<!-- ANCHOR:codex-cli -->
## 7. Codex CLI (`.codex/config.toml`)

**File location**: `.codex/config.toml` in project root

```toml
[mcp_servers.cocoindex_code]
command = "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc"
args = ["mcp"]

[mcp_servers.cocoindex_code.env]
COCOINDEX_CODE_ROOT_PATH = "."
_NOTE_1 = "Requires: pipx install --python python3.11 cocoindex-code"
_NOTE_2 = "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)"
_NOTE_3 = "Index stored in .cocoindex_code/ (gitignored)"
```

**Notes:**
- TOML format uses `[section.subsection]` headers
- `args` is an array in TOML: `["mcp"]`
- `env` is a sub-table under the server definition
- Supports relative paths for `COCOINDEX_CODE_ROOT_PATH`

<!-- /ANCHOR:codex-cli -->

---

<!-- ANCHOR:validation -->
## 8. Validation

After adding the configuration, verify it works:

### For JSON configs (.mcp.json, opencode.json, settings.json)

```bash
# Check JSON syntax
python3 -m json.tool < .mcp.json

# Verify binary path exists
ls -la /Users/michelkerkmeester/MEGA/Development/Opencode\ Env/Public/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc

# Test MCP server manually
/Users/michelkerkmeester/MEGA/Development/Opencode\ Env/Public/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc mcp
# Should start without errors (Ctrl+C to stop)
```

### For TOML config (.codex/config.toml)

```bash
# Verify the binary path exists
ls -la /Users/michelkerkmeester/MEGA/Development/Opencode\ Env/Public/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc

# Test MCP server manually
/Users/michelkerkmeester/MEGA/Development/Opencode\ Env/Public/.opencode/skill/mcp-cocoindex-code/mcp_server/.venv/bin/ccc mcp
# Should start without errors (Ctrl+C to stop)
```

After verification, restart your AI client to load the new configuration.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related-resources -->
## 9. Related Resources

| Resource        | Location                                                            |
| --------------- | ------------------------------------------------------------------- |
| INSTALL_GUIDE   | `.opencode/skill/mcp-cocoindex-code/INSTALL_GUIDE.md`              |
| Tool Reference  | `.opencode/skill/mcp-cocoindex-code/references/tool_reference.md`  |
| Search Patterns | `.opencode/skill/mcp-cocoindex-code/references/search_patterns.md` |
<!-- /ANCHOR:related-resources -->
