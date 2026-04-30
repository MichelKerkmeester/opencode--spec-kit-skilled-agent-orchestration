---
title: "06. No-results handling"
description: "Reports empty successful searches without stack traces."
---

# 06. No-results handling

Reports empty successful searches without stack traces. Empty searches are a normal result state. The CLI and MCP response model preserve that distinction from failures.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Empty searches are a normal result state. The CLI and MCP response model preserve that distinction from failures.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The CLI prints `No results found.` for successful empty responses. MCP responses carry `success=false` only when an exception occurs, otherwise an empty result list can still be a valid response.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:142` | CLI | Handles successful empty result sets. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:174` | MCP server | Converts query exceptions into failure responses. |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:433` | Manual playbook | Defines graceful no-results validation. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:433` | Manual playbook | Covers no-results graceful handling. |
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:77` | Protocol | Covers search response encoding. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Search and ranking
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--search-and-ranking/06-no-results-handling.md`

<!-- /ANCHOR:source-metadata -->
