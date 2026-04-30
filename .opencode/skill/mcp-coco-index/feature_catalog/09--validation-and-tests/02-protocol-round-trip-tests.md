---
title: "02. Protocol round-trip tests"
description: "Validates daemon request and response encoding for all protocol message types."
---

# 02. Protocol round-trip tests

Validates daemon request and response encoding for all protocol message types. Protocol tests confirm that msgspec tagged unions preserve request and response types between client and daemon.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Protocol tests confirm that msgspec tagged unions preserve request and response types between client and daemon.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Coverage includes handshake, search requests with defaults and all fields, search responses, errors, daemon status, waiting notices, progress updates and round trips for all request and response variants.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:39` | Test | Covers handshake request round trip. |
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:47` | Test | Covers search defaults. |
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:217` | Test | Covers all response types. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:176` | Implementation | Encodes and decodes requests. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:185` | Implementation | Encodes and decodes responses. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Validation and tests
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `09--validation-and-tests/02-protocol-round-trip-tests.md`

<!-- /ANCHOR:source-metadata -->
