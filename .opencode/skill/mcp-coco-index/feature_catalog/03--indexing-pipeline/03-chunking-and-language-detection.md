---
title: "03. Chunking and language detection"
description: "Splits text into language-aware chunks and records line ranges."
---

# 03. Chunking and language detection

Splits text into language-aware chunks and records line ranges. Indexing converts source files into smaller chunks with detected or overridden language metadata. Those chunks become the searchable unit returned by CLI and MCP search.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Indexing converts source files into smaller chunks with detected or overridden language metadata. Those chunks become the searchable unit returned by CLI and MCP search.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The indexer skips unreadable and empty files, detects language by filename unless a project override exists and uses `RecursiveSplitter` with configured chunk size, minimum size and overlap.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:35` | Indexer | Creates the recursive splitter. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:195` | Indexer | Processes a file into chunks. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:222` | Indexer | Applies chunk size, minimum size, overlap and language settings. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_settings.py:197` | Unit | Covers custom extension language overrides. |
| `.opencode/skill/mcp-coco-index/references/settings_reference.md:142` | Reference | Documents chunking configuration. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Indexing pipeline
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--indexing-pipeline/03-chunking-and-language-detection.md`

<!-- /ANCHOR:source-metadata -->
