---
title: "06. Backward-compatible entrypoint"
description: "Keeps the older `cocoindex-code` entry path working by converting legacy settings."
---

# 06. Backward-compatible entrypoint

Keeps the older `cocoindex-code` entry path working by converting legacy settings. The fork preserves compatibility for callers using the upstream-style entrypoint and older environment variables.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The fork preserves compatibility for callers using the upstream-style entrypoint and older environment variables.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The legacy path converts old embedding model prefixes, can create settings from environment variables and delegates work to the daemon-backed implementation. Legacy root discovery can re-anchor to an existing indexed tree.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:187` | Compatibility | Converts legacy embedding model values. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/server.py:195` | Compatibility | Defines the backward-compatible entrypoint. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/settings.py:161` | Settings | Finds legacy project roots from existing index databases. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_backward_compat.py:29` | Compatibility | Covers creating settings from legacy environment variables. |
| `.opencode/skill/mcp-coco-index/tests/test_backward_compat.py:113` | Compatibility | Covers legacy root discovery behavior. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Patches and extensions
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--patches-and-extensions/06-backward-compatible-entrypoint.md`

<!-- /ANCHOR:source-metadata -->
