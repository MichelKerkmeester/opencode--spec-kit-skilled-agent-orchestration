---
title: "01. Search tool contract"
description: "Defines the single MCP `search` tool and its natural-language retrieval contract."
---

# 01. Search tool contract

Defines the single MCP `search` tool and its natural-language retrieval contract. The MCP server exposes exactly one tool named `search`. It is built for semantic discovery when callers do not know exact symbols or strings.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The MCP server exposes exactly one tool named `search`. It is built for semantic discovery when callers do not know exact symbols or strings.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The tool accepts natural language or code snippets, returns code chunks with paths and line numbers and tells callers to start with a small result limit. Index, status and reset are intentionally outside the MCP tool surface.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:78` | MCP server | Registers the `search` tool and its description. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:95` | MCP server | Defines the async search handler. |
| `.opencode/skill/mcp-coco-index/references/tool_reference.md:235` | Reference | Documents the one-tool MCP boundary. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:515` | Manual playbook | Indexes the MCP search tool manual scenarios. |
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:47` | Protocol | Covers search request encoding defaults. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: MCP server
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mcp-server/01-search-tool-contract.md`

<!-- /ANCHOR:source-metadata -->
