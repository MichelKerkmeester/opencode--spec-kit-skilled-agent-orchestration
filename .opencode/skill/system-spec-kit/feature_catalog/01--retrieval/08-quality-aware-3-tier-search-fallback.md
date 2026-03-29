---
title: "Quality-aware 3-tier search fallback"
description: "Covers the adaptive search degradation chain that progressively widens retrieval when initial results fail quality checks."
---

# Quality-aware 3-tier search fallback

## 1. OVERVIEW

Covers the adaptive search degradation chain that progressively widens retrieval when initial results fail quality checks.

If your search does not find good results on the first try, the system automatically tries again with wider criteria instead of giving up. Think of it like asking a store clerk for a specific item. If they cannot find it on the first shelf, they check the back room and then the warehouse. You almost never walk away empty-handed.

---

## 2. CURRENT REALITY

Adaptive search degradation chain in `searchWithFallbackTiered()`. Tier 1: enhanced hybrid search (minSimilarity=0.3, standard channels). Quality check via `checkDegradation()`: fails if topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3. On fail, Tier 2: widened search (minSimilarity=0.1) inside the caller-allowed channel set rather than forcing previously disabled channels back on. That means explicit routing decisions such as `useGraph:false` still hold during degradation. On fail, Tier 3: structural SQL fallback (ORDER BY importance_tier, importance_weight), but only for lexical channels that are still allowed after routing. Tier 3 scores are calibrated to max 50% of existing top score to prevent outranking semantic hits, and archived rows stay excluded unless `includeArchived=true`. Degradation events are attached as non-enumerable `_degradation` property on the result set. Gated by `SPECKIT_SEARCH_FALLBACK` (default: true, graduated).

T310 split the fallback path into fusion-only collection followed by a single post-fusion enrichment pass. `executeFallbackPlan()` now collects per-tier fused candidates first, then `searchWithFallbackTiered()` merges Tier 1, Tier 2, and calibrated Tier 3 candidates before calling `enrichFusedResults()` once on the final tier execution context. As a result, reranking, MMR, co-activation spreading, folder scoring, confidence truncation, contextual headers, and token-budget truncation run once on the final merged candidate set instead of re-running for every fallback tier.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel search orchestration: `executeFallbackPlan()`, `searchWithFallbackTiered()`, `enrichFusedResults()`, `checkDegradation()`, 3-tier fallback chain |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry (`SPECKIT_SEARCH_FALLBACK` gate) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/search-fallback-tiered.vitest.ts` | Tiered fallback chain behavior |
| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration |
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/memory-search-quality-filter.vitest.ts` | Search quality filtering |

---

## 4. SOURCE METADATA

- Group: Undocumented feature gap scan
- Source feature title: Quality-aware 3-tier search fallback
- Current reality source: 10-agent feature gap scan
- Playbook reference: 109
