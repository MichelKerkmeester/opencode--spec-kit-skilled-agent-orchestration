---
title: "04. Implementation-intent reranking"
description: "Boosts implementation hits and penalizes docs or spec research for implementation-style queries."
---

# 04. Implementation-intent reranking

Boosts implementation hits and penalizes docs or spec research for implementation-style queries. Reranking nudges implementation results upward when the query asks for code, definitions, handlers, classes or callers.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reranking nudges implementation results upward when the query asks for code, definitions, handlers, classes or callers.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Query text is checked for implementation-intent keywords. When present, implementation chunks receive a small boost while docs and spec research receive a small penalty. The raw score remains available for audit.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:39` | Query | Defines implementation-intent keywords. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:56` | Query | Detects implementation intent. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:176` | Query | Applies path-class score deltas. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/references/tool_reference.md:412` | Reference | Documents implementation-intent reranking. |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:453` | Manual playbook | Covers semantic intent routing expectations. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Patches and extensions
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--patches-and-extensions/04-implementation-intent-reranking.md`

<!-- /ANCHOR:source-metadata -->
