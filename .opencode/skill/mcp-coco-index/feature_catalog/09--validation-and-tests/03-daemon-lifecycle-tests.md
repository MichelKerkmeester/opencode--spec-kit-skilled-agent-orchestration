---
title: "03. Daemon lifecycle tests"
description: "Validates daemon handshake, status, indexing, search, removal and wait behavior."
---

# 03. Daemon lifecycle tests

Validates daemon handshake, status, indexing, search, removal and wait behavior. Daemon tests exercise the core process boundary between client and background registry.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Daemon tests exercise the core process boundary between client and background registry.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The suite starts a daemon in test fixtures, handshakes with it, checks version mismatch behavior, indexes a sample project, searches results, validates project removal and proves search waits during active indexing.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:162` | Test | Covers daemon startup and handshake. |
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:186` | Test | Covers status after indexing. |
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:246` | Test | Covers search waiting during explicit indexing. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:381` | Implementation | Handles client connections. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:481` | Implementation | Dispatches daemon requests. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Validation and tests
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `09--validation-and-tests/03-daemon-lifecycle-tests.md`

<!-- /ANCHOR:source-metadata -->
