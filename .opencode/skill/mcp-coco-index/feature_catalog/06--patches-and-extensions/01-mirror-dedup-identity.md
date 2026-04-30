---
title: "01. Mirror dedup identity"
description: "Uses real path plus line range to collapse mirror-folder duplicate chunks."
---

# 01. Mirror dedup identity

Uses real path plus line range to collapse mirror-folder duplicate chunks. Mirror deduplication prevents copied runtime mirrors from crowding out canonical results. It groups equivalent chunks before pagination.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Mirror deduplication prevents copied runtime mirrors from crowding out canonical results. It groups equivalent chunks before pagination.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The primary dedup key is `source_realpath`, `start_line` and `end_line`. Duplicate rows increment `dedupedAliases` and only the first ranked representative remains in the unique list.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:217` | Indexer | Stores file path and real path for chunks. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:158` | Query | Builds dedup keys from realpath or fallback hash. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:234` | Query | Tracks seen dedup keys and alias counts. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/references/tool_reference.md:398` | Reference | Documents result-row dedup telemetry. |
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:77` | Protocol | Covers search response result fields. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Patches and extensions
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--patches-and-extensions/01-mirror-dedup-identity.md`

<!-- /ANCHOR:source-metadata -->
