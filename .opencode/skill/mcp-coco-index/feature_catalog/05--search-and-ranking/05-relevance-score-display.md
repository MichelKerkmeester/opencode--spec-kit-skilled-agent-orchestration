---
title: "05. Relevance score display"
description: "Shows post-rerank score, raw score and ranking signals in CLI output."
---

# 05. Relevance score display

Shows post-rerank score, raw score and ranking signals in CLI output. CLI output exposes both the final score and the raw vector score so operators can see how fork ranking changed a hit.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

CLI output exposes both the final score and the raw vector score so operators can see how fork ranking changed a hit.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

For each result, `ccc search` prints final score, raw score, file path, line range, language, path class and any ranking signals before the chunk content.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:136` | CLI | Formats search results. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:151` | CLI | Prints final score and raw score per result. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:176` | Query | Creates ranked result records. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:167` | End-to-end | Covers search result output. |
| `.opencode/skill/mcp-coco-index/references/tool_reference.md:405` | Reference | Documents ranking transparency fields. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Search and ranking
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--search-and-ranking/05-relevance-score-display.md`

<!-- /ANCHOR:source-metadata -->
