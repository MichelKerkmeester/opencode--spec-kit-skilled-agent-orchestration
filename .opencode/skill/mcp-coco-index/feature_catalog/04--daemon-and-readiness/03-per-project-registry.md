---
title: "03. Per-project registry"
description: "Keeps loaded projects, locks and load-time indexing state per project root."
---

# 03. Per-project registry

Keeps loaded projects, locks and load-time indexing state per project root. The daemon can serve multiple project roots. Its registry tracks each loaded project, one lock per root and an event for load-time indexing completion.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The daemon can serve multiple project roots. Its registry tracks each loaded project, one lock per root and an event for load-time indexing completion.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Loading a new project can kick off background indexing unless the caller suppresses it. Removing a project closes resources, drops locks and clears load-time state.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:121` | Daemon | Defines the project registry. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:134` | Daemon | Loads projects and optionally starts indexing. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:340` | Daemon | Removes project resources from the registry. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:222` | Integration | Covers removing a loaded project. |
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:237` | Integration | Covers removing a project that is not loaded. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and readiness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--daemon-and-readiness/03-per-project-registry.md`

<!-- /ANCHOR:source-metadata -->
