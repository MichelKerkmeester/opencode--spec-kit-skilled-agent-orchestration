---
title: "05. Search wait during indexing"
description: "Queues search responses behind active load-time or explicit indexing."
---

# 05. Search wait during indexing

Queues search responses behind active load-time or explicit indexing. Search requests avoid racing against active indexing. The daemon can return a streaming response that first tells the client it is waiting.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Search requests avoid racing against active indexing. The daemon can return a streaming response that first tells the client it is waiting.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

When a project is still load-time indexing or has a held index lock, the dispatcher returns `_search_with_wait`. That path yields a waiting notice, waits for indexing to finish and then returns the search response.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:154` | Daemon | Checks whether search should wait. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:454` | Daemon | Streams wait then search response. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/client.py:96` | Client | Handles waiting notices during search. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:246` | Integration | Covers search waiting during explicit indexing. |
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:293` | Integration | Covers search waiting during load-time indexing. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and readiness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--daemon-and-readiness/05-search-wait-during-indexing.md`

<!-- /ANCHOR:source-metadata -->
