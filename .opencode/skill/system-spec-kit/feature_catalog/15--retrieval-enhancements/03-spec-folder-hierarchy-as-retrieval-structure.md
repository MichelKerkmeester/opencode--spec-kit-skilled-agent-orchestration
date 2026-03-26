---
title: "Spec folder hierarchy as retrieval structure"
description: "Spec folder paths are parsed into an in-memory hierarchy tree that surfaces parent, sibling and ancestor memories during retrieval."
---

# Spec folder hierarchy as retrieval structure

## 1. OVERVIEW

Spec folder paths are parsed into an in-memory hierarchy tree that surfaces parent, sibling and ancestor memories during retrieval.

The way you organize your project folders directly influences what the system finds when you search. If you are looking at a child folder, the system also checks the parent and sibling folders for related information. It is like browsing one section of a bookstore and getting recommendations from nearby shelves because they cover related topics.

---

## 2. CURRENT REALITY

Spec folder paths from memory metadata are parsed into an in-memory hierarchy tree. The `buildHierarchyTree()` function performs two-pass construction: the first pass creates nodes from all distinct `spec_folder` values including implicit intermediate parents, the second pass links children to parents via path splitting.

The `queryHierarchyMemories()` function returns parent, sibling and ancestor memories with relevance scoring: self receives 1.0, parent 0.8, grandparent 0.6, sibling 0.5, with a floor of 0.3. The graph search function traverses this tree so that related folders surface as contextual results alongside direct matches, making spec folder organization a direct retrieval signal rather than metadata that only serves filtering. Always active with no feature flag.

**Sprint 8 update:** A WeakMap TTL cache (60s, keyed by database instance) was added to `buildHierarchyTree()` to avoid full-scan reconstruction on every search request. An `invalidateHierarchyCache()` export allows explicit cache clearing when hierarchy data changes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Augments graph retrieval with hierarchy rows when `specFolder` is provided |
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Folder hierarchy tests |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Spec folder hierarchy as retrieval structure
- Current reality source: FEATURE_CATALOG.md
