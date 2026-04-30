---
title: "02. Refresh-index default"
description: "Refreshes the index before MCP searches unless callers opt out."
---

# 02. Refresh-index default

Refreshes the index before MCP searches unless callers opt out. The MCP tool defaults to refreshing the index before a search so first queries see recent code. Follow-up queries can set `refresh_index=false` for speed when the workspace has not changed.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The MCP tool defaults to refreshing the index before a search so first queries see recent code. Follow-up queries can set `refresh_index=false` for speed when the workspace has not changed.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The server calls `client.index(project_root)` before search when `refresh_index` is true. Cross-CLI guidance recommends disabling refresh on follow-up MCP queries to avoid unnecessary daemon work.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:116` | MCP schema | Defines `refresh_index` with default `true`. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:139` | MCP server | Runs daemon indexing before search when refresh is enabled. |
| `.opencode/skill/mcp-coco-index/references/cross_cli_playbook.md:66` | Reference | Documents the follow-up query rule. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:241` | Manual playbook | Documents no-refresh follow-up strategy. |
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:246` | Integration | Covers search waiting during explicit indexing. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: MCP server
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mcp-server/02-refresh-index-default.md`

<!-- /ANCHOR:source-metadata -->
