---
title: CocoIndex Code Configuration Templates
description: Repo-portable MCP configuration snippets for the checked-in CocoIndex integration across supported CLIs.
trigger_phrases:
  - cocoindex config
  - mcp configuration cocoindex
  - cocoindex setup
  - configure cocoindex for claude
  - cocoindex opencode config
---

# CocoIndex Code Configuration Templates

Repo-portable MCP configuration snippets for the current checked-in CocoIndex setup.

---

## 1. OVERVIEW

The installed runtime contract for this repo is:

- `cocoindex_code` is the server name across all CLIs
- the server command is the repo-local binary:
  - `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc`
- MCP always launches with `mcp`
- `COCOINDEX_CODE_ROOT_PATH` points at the project root using `.`
- MCP exposes only `search`

Default guidance:

- Use relative paths when the client supports them
- Keep `.mcp.json` disabled until the local install is verified
- Do not add `VOYAGE_API_KEY` to the default config examples; the checked-in setup uses the local embedding default

---

## 2. CLAUDE CODE (`.mcp.json`)

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

Notes:

- Keep `"disabled": true` until `doctor.sh` reports the install is ready
- Claude Code reads this file from the repo root

---

## 3. COPILOT / OPENCODE (`opencode.json`)

```json
{
  "mcp": {
    "cocoindex_code": {
      "type": "local",
      "command": [
        ".opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc",
        "mcp"
      ],
      "environment": {
        "COCOINDEX_CODE_ROOT_PATH": ".",
        "_NOTE_1": "Install: bash .opencode/skill/mcp-coco-index/scripts/install.sh",
        "_NOTE_2": "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)",
        "_NOTE_3": "Index stored in .cocoindex_code/ (gitignored)"
      }
    }
  }
}
```

---

## 4. AGENTS CLI (`.agents/settings.json`)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": ".opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "cwd": ".",
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "."
      },
      "trust": true
    }
  }
}
```

Notes:

- `cwd` and `trust` are required in the checked-in setup

---

## 5. GEMINI CLI (`.gemini/settings.json`)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": ".opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "cwd": ".",
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": "."
      },
      "trust": true
    }
  }
}
```

---

## 6. CLAUDE CLI (`.claude/mcp.json`)

```json
{
  "mcpServers": {
    "cocoindex_code": {
      "command": ".opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc",
      "args": ["mcp"],
      "env": {
        "COCOINDEX_CODE_ROOT_PATH": ".",
        "_NOTE_1": "Install: bash .opencode/skill/mcp-coco-index/scripts/install.sh",
        "_NOTE_2": "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)",
        "_NOTE_3": "Index stored in .cocoindex_code/ (gitignored)"
      }
    }
  }
}
```

---

## 7. CODEX CLI (`.codex/config.toml`)

```toml
[mcp_servers.cocoindex_code]
command = ".opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc"
args = ["mcp"]

[mcp_servers.cocoindex_code.env]
COCOINDEX_CODE_ROOT_PATH = "."
_NOTE_1 = "Install: bash .opencode/skill/mcp-coco-index/scripts/install.sh"
_NOTE_2 = "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)"
_NOTE_3 = "If you switch to LiteLLM with VOYAGE_API_KEY, use voyage/voyage-code-3 and rebuild the index"
_NOTE_4 = "Index stored in .cocoindex_code/ (gitignored)"
```

Notes:

- Codex runtime agents resolve through `.codex/agents/*.toml`, but the CocoIndex MCP server itself is still configured in `.codex/config.toml`

---

## 8. OPTIONAL CLOUD EMBEDDING VARIANT

The checked-in setup assumes the local default embedding. If you intentionally switch to a cloud embedding provider, configure it in `~/.cocoindex_code/global_settings.yml`.

Example:

```yaml
embedding:
  provider: litellm
  model: voyage/voyage-code-3
envs:
  VOYAGE_API_KEY: your-key-here
```

Changing embedding models requires rebuilding the index:

```bash
ccc reset
ccc init
ccc index
```

---

## 9. VALIDATION

Use the helper scripts before enabling or debugging configs:

```bash
bash .opencode/skill/mcp-coco-index/scripts/doctor.sh
bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh
```

Manual checks:

```bash
python3 -m json.tool < .mcp.json
python3 -m json.tool < opencode.json
python3 -m json.tool < .agents/settings.json
python3 -m json.tool < .gemini/settings.json
python3 -m json.tool < .claude/mcp.json
python3 - <<'PY'
import tomllib
with open('.codex/config.toml', 'rb') as handle:
    tomllib.load(handle)
print('ok')
PY
```

---

## 10. RELATED RESOURCES

> **Output shape.** The configs in this file control how the MCP server is wired and how it's invoked, but they do NOT describe the *response* shape your client will see. This skill bundles a soft-fork of `cocoindex-code` (`0.2.3+spec-kit-fork.0.2.0`) that emits seven additional fields beyond vanilla upstream output (`source_realpath`, `content_hash`, `path_class`, `dedupedAliases`, `uniqueResultCount`, `raw_score`, `rankingSignals`). If your config integrates with downstream code that parses results, see the Tool Reference §7 entry below for the full schema and reading guidance before writing parsers.

| Resource | Location |
| --- | --- |
| Install Guide | `.opencode/skill/mcp-coco-index/INSTALL_GUIDE.md` |
| Tool Reference | `.opencode/skill/mcp-coco-index/references/tool_reference.md` |
| Tool Reference §7 (Fork-Specific Output Telemetry) | `.opencode/skill/mcp-coco-index/references/tool_reference.md` (anchor: `#-7-fork-specific-output-telemetry`) |
| Fork CHANGELOG | `.opencode/skill/mcp-coco-index/changelog/CHANGELOG.md` |
| Cross-CLI Playbook | `.opencode/skill/mcp-coco-index/references/cross_cli_playbook.md` |
