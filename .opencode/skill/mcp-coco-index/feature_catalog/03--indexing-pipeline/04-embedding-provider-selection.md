---
title: "04. Embedding provider selection"
description: "Creates sentence-transformer or LiteLLM embedders from user settings."
---

# 04. Embedding provider selection

Creates sentence-transformer or LiteLLM embedders from user settings. The embedder factory selects the runtime embedding backend. It supports local sentence-transformers and external LiteLLM-backed providers.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The embedder factory selects the runtime embedding backend. It supports local sentence-transformers and external LiteLLM-backed providers.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Default user settings choose `sentence-transformers/all-MiniLM-L6-v2`. When the provider is `sentence-transformers`, the factory strips the legacy `sbert/` prefix and can set a query prompt. Other providers route through LiteLLM.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/settings.py:101` | Settings | Defines default user embedding settings. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/shared.py:46` | Shared runtime | Creates the embedder from settings. |
| `.opencode/skill/mcp-coco-index/references/settings_reference.md:122` | Reference | Documents supported embedding models. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_settings.py:45` | Unit | Covers default user settings. |
| `.opencode/skill/mcp-coco-index/tests/test_config.py:19` | Unit | Covers device and default model configuration. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Indexing pipeline
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--indexing-pipeline/04-embedding-provider-selection.md`

<!-- /ANCHOR:source-metadata -->
