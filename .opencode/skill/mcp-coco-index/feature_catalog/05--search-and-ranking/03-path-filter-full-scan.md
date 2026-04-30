---
title: "03. Path-filter full scan"
description: "Uses SQL-level distance computation when path filters are present."
---

# 03. Path-filter full scan

Uses SQL-level distance computation when path filters are present. Path filters scope semantic search to one or more glob patterns. Since vec0 KNN cannot apply arbitrary path glob filters directly, the query path switches strategy.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Path filters scope semantic search to one or more glob patterns. Since vec0 KNN cannot apply arbitrary path glob filters directly, the query path switches strategy.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

When `paths` is set, query execution uses `_full_scan_query`, applies language and path predicates, computes vector distance in SQL and then orders by distance.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:119` | Query | Defines full-scan query with filter predicates. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:137` | Query | Applies path glob predicates. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py:286` | Query | Selects full scan when paths are present. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:182` | End-to-end | Covers path-scoped search output. |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:520` | Manual playbook | Indexes path and combined-filter scenarios. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Search and ranking
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--search-and-ranking/03-path-filter-full-scan.md`

<!-- /ANCHOR:source-metadata -->
