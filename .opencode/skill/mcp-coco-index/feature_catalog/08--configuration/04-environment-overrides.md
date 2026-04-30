---
title: "04. Environment overrides"
description: "Supports runtime overrides for config directory, root path, device and legacy variables."
---

# 04. Environment overrides

Supports runtime overrides for config directory, root path, device and legacy variables. Environment overrides give agents and CI runs deterministic control over where CocoIndex stores state and which project it searches.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Environment overrides give agents and CI runs deterministic control over where CocoIndex stores state and which project it searches.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`COCOINDEX_CODE_DIR` changes the global settings directory. `COCOINDEX_CODE_ROOT_PATH` pins the project root for helper scripts and legacy config. Extra extension and excluded pattern environment variables remain in the compatibility config path.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/settings.py:123` | Settings | Uses `COCOINDEX_CODE_DIR` for global settings location. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/config.py:82` | Legacy config | Loads environment variables into config. |
| `.opencode/skill/mcp-coco-index/scripts/common.sh:123` | Script helper | Runs `ccc` with `COCOINDEX_CODE_ROOT_PATH`. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_config.py:49` | Unit | Covers embedding model defaults from env config. |
| `.opencode/skill/mcp-coco-index/tests/test_backward_compat.py:29` | Compatibility | Covers legacy environment variables. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Configuration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--configuration/04-environment-overrides.md`

<!-- /ANCHOR:source-metadata -->
