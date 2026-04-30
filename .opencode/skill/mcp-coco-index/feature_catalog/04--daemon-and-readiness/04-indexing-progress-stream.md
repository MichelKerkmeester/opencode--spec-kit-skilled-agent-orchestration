---
title: "04. Indexing progress stream"
description: "Streams progress and waiting notices while index updates run."
---

# 04. Indexing progress stream

Streams progress and waiting notices while index updates run. Indexing progress gives CLI callers useful feedback while preserving a single serialized update per project.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Indexing progress gives CLI callers useful feedback while preserving a single serialized update per project.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The registry emits a waiting notice when another index run already holds the lock, then streams `IndexProgressUpdate` snapshots until a terminal `IndexResponse` is available.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:209` | Daemon | Streams progress for update requests. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/client.py:68` | Client | Consumes streaming index responses. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:72` | Protocol | Defines indexing progress messages. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_daemon.py:205` | Integration | Asserts progress updates are emitted. |
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:152` | Protocol | Covers waiting notice encoding. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and readiness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--daemon-and-readiness/04-indexing-progress-stream.md`

<!-- /ANCHOR:source-metadata -->
