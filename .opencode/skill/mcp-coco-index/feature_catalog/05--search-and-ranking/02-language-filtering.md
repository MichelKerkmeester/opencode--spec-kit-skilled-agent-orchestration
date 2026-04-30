---
title: "02. Language filtering"
description: "Restricts search results to one or more detected language partitions."
---

# 02. Language filtering

Restricts search results to one or more detected language partitions. Language filters let callers narrow semantic retrieval to implementation languages or data formats.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Language filters let callers narrow semantic retrieval to implementation languages or data formats.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Single-language queries use the vec0 language partition directly. Multi-language queries run partition-specific KNN scans and take the nearest rows across all requested languages.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:93` | Query | Accepts an optional language for KNN. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:288` | Query | Chooses single-language KNN. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:292` | Query | Merges multi-language KNN rows. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_protocol.py:57` | Protocol | Covers multiple languages in search requests. |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:517` | Manual playbook | Indexes language filter scenarios. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Search and ranking
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--search-and-ranking/02-language-filtering.md`

<!-- /ANCHOR:source-metadata -->
