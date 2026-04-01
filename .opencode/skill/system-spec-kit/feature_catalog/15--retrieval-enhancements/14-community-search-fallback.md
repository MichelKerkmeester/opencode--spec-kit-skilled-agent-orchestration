---
title: "Community-level search fallback"
description: "searchCommunities() provides topic-level fallback via word overlap scoring against community summaries, surfacing broad topical matches when fine-grained retrieval fails, gated by the SPECKIT_COMMUNITY_SEARCH_FALLBACK flag."
---

# Community-level search fallback

## 1. OVERVIEW

`searchCommunities()` provides topic-level fallback via word overlap scoring against community summaries, surfacing broad topical matches when fine-grained retrieval fails. When vector and BM25 channels return weak or empty results, community search offers a coarser but still useful layer of retrieval by matching queries against pre-computed community topic summaries.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_COMMUNITY_SEARCH_FALLBACK=false` to disable.

The `searchCommunities()` function scores the query against community summaries using word overlap. Each community represents a cluster of related memories with a summary describing its topic. The scoring function tokenizes both the query and each community summary, computes overlap, and returns communities ranked by relevance. Results from matching communities are surfaced as fallback candidates when primary retrieval channels produce insufficient results.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/community-search.ts` | Lib | `searchCommunities()` — word overlap scoring against community summaries |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/community-search.vitest.ts` | Community search scoring and fallback behavior |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Community-level search fallback
- Graduated via: 009-graph-retrieval-improvements
- Kill switch: SPECKIT_COMMUNITY_SEARCH_FALLBACK=false
