---
title: "03. Root path discovery"
description: "Finds the project root from initialized settings, markers or explicit environment override."
---

# 03. Root path discovery

Finds the project root from initialized settings, markers or explicit environment override. Root discovery lets commands run from subdirectories while still using the intended project index.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Root discovery lets commands run from subdirectories while still using the intended project index.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The settings path helper walks up to `.cocoindex_code/settings.yml`. The legacy config path can use `COCOINDEX_CODE_ROOT_PATH`, then initialized directories, common project markers and finally the current working directory.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/settings.py:146` | Settings | Finds initialized project roots. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/settings.py:177` | Settings | Finds parent project markers. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/config.py:25` | Legacy config | Documents root discovery priority. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_settings.py:142` | Unit | Covers project root discovery from subdirectories. |
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:397` | End-to-end | Covers subdirectory path default behavior. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Configuration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--configuration/03-root-path-discovery.md`

<!-- /ANCHOR:source-metadata -->
