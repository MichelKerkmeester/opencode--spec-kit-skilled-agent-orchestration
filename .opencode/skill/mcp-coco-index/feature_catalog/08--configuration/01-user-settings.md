---
title: "01. User settings"
description: "Stores embedding provider, model, device and daemon environment variables globally."
---

# 01. User settings

Stores embedding provider, model, device and daemon environment variables globally. User settings apply across projects and control the embedding backend plus daemon environment variables.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

User settings apply across projects and control the embedding backend plus daemon environment variables.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The default user settings use the local sentence-transformers provider and `all-MiniLM-L6-v2`. The loader rejects missing or empty settings files and the saver writes explicit YAML.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/settings.py:67` | Settings | Defines user and embedding settings dataclasses. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/settings.py:101` | Settings | Defines default user settings. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/settings.py:287` | Settings | Loads user settings from YAML. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_settings.py:45` | Unit | Covers default user settings. |
| `.opencode/skill/mcp-coco-index/tests/test_settings.py:61` | Unit | Covers user settings save and load. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Configuration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--configuration/01-user-settings.md`

<!-- /ANCHOR:source-metadata -->
