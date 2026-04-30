---
title: "06. MCP stdio command"
description: "Starts the MCP server over stdio for AI client integration."
---

# 06. MCP stdio command

Starts the MCP server over stdio for AI client integration. The MCP command turns the local CocoIndex daemon into an MCP server. AI clients use this path when they need the `search` tool over stdio transport.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The MCP command turns the local CocoIndex daemon into an MCP server. AI clients use this path when they need the `search` tool over stdio transport.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`ccc mcp` requires an initialized project, creates the MCP server with the daemon client, triggers background indexing and runs the server on stdio. Status, index and reset remain CLI-only commands.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:473` | CLI | Defines `ccc mcp`. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:74` | MCP server | Creates the FastMCP server. |
| `.opencode/skill/mcp-coco-index/references/tool_reference.md:185` | Reference | Documents `ccc mcp` and the CLI-only boundary. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:189` | End-to-end | Covers CLI help and daemon status around the full session. |
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:47` | Protocol | Covers search request defaults used under the daemon protocol. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: CLI commands
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--cli-commands/06-mcp-stdio-command.md`

<!-- /ANCHOR:source-metadata -->
