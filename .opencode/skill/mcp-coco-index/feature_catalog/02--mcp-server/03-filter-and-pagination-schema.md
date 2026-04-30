---
title: "03. Filter and pagination schema"
description: "Defines language, path, limit and offset parameters for MCP search."
---

# 03. Filter and pagination schema

Defines language, path, limit and offset parameters for MCP search. MCP search supports targeted retrieval through language filters, path glob filters, bounded result counts and offset pagination.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

MCP search supports targeted retrieval through language filters, path glob filters, bounded result counts and offset pagination.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The MCP schema accepts `languages` and `paths` as lists. `limit` is constrained to 1 through 100 with a default of 5, while `offset` starts at 0 for pagination.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:105` | MCP schema | Defines result limit bounds. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:111` | MCP schema | Defines offset pagination. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:124` | MCP schema | Defines language and path filters. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:57` | Protocol | Covers search requests with all filter fields. |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:517` | Manual playbook | Indexes language, path and limit scenarios. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: MCP server
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--mcp-server/03-filter-and-pagination-schema.md`

<!-- /ANCHOR:source-metadata -->
