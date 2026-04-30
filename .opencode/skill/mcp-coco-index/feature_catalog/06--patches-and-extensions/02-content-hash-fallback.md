---
title: "02. Content hash fallback"
description: "Hashes normalized content to dedup older or symlinked rows when realpath is absent."
---

# 02. Content hash fallback

Hashes normalized content to dedup older or symlinked rows when realpath is absent. The content hash fallback keeps dedup behavior working when index rows do not have usable realpath metadata.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The content hash fallback keeps dedup behavior working when index rows do not have usable realpath metadata.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Indexing stores a SHA-256 hash of normalized chunk content. Query-time dedup uses that stored hash or recomputes one from row content when `source_realpath` is missing.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:39` | Indexer | Normalizes chunk content before hashing. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:241` | Indexer | Stores content hash per chunk. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:65` | Query | Computes fallback content hashes. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/references/tool_reference.md:392` | Reference | Documents chunk-level fork telemetry. |
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:217` | Protocol | Covers response round trips across protocol variants. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Patches and extensions
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--patches-and-extensions/02-content-hash-fallback.md`

<!-- /ANCHOR:source-metadata -->
