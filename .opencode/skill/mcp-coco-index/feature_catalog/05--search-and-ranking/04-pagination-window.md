---
title: "04. Pagination window"
description: "Applies offset and limit after deduplication and reranking."
---

# 04. Pagination window

Applies offset and limit after deduplication and reranking. Pagination is applied to the unique ranked results, not directly to raw vector rows. That keeps repeated mirror hits from consuming the page window.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Pagination is applied to the unique ranked results, not directly to raw vector rows. That keeps repeated mirror hits from consuming the page window.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The query path over-fetches raw rows, ranks them, dedups aliases, then returns `unique[offset:offset + limit]`. The returned unique count reflects the actual page size.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:220` | Query | Dedups and ranks rows before slicing. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:245` | Query | Applies the offset and limit window. |
| `.opencode/skill/mcp-coco-index/references/tool_reference.md:284` | Reference | Maps CLI and MCP pagination parameters. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:57` | Protocol | Covers offset and limit fields. |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:522` | Manual playbook | Indexes result limit validation. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Search and ranking
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--search-and-ranking/04-pagination-window.md`

<!-- /ANCHOR:source-metadata -->
