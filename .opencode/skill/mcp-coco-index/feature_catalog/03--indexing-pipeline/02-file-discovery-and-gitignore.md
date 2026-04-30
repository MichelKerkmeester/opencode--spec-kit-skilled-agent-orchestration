---
title: "02. File discovery and gitignore"
description: "Walks included project files while respecting project patterns and `.gitignore`."
---

# 02. File discovery and gitignore

Walks included project files while respecting project patterns and `.gitignore`. The indexer uses project include and exclude patterns plus Git ignore rules to decide which files enter the semantic index.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The indexer uses project include and exclude patterns plus Git ignore rules to decide which files enter the semantic index.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`GitignoreAwareMatcher` normalizes nested `.gitignore` patterns and wraps the pattern matcher. The indexer then walks the codebase recursively with that matcher before processing files.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:93` | Indexer | Normalizes `.gitignore` lines. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:136` | Indexer | Defines the Gitignore-aware matcher. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:280` | Indexer | Combines configured patterns with Git ignore filtering. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:307` | End-to-end | Covers ignored files staying out of search results. |
| `.opencode/skill/mcp-coco-index/tests/test_cli_helpers.py:92` | Unit | Covers idempotent `.gitignore` entry handling. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Indexing pipeline
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--indexing-pipeline/02-file-discovery-and-gitignore.md`

<!-- /ANCHOR:source-metadata -->
