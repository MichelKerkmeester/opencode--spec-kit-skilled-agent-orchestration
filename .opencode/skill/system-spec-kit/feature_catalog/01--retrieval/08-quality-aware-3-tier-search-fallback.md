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

Adaptive search degradation chain in `searchWithFallbackTiered()`. Tier 1: enhanced hybrid search (minSimilarity=0.3, standard channels). Quality check via `checkDegradation()`: fails if topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3. On fail, Tier 2: widened search (minSimilarity=0.1, all channels forced). Same quality check. On fail, Tier 3: structural SQL fallback (ORDER BY importance_tier, importance_weight). Tier 3 scores are calibrated to max 50% of existing top score to prevent outranking semantic hits. Degradation events are attached as non-enumerable `_degradation` property on the result set. Gated by `SPECKIT_SEARCH_FALLBACK` (default: true, graduated).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel search orchestration with tiered fallback |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration |
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/memory-search-quality-filter.vitest.ts` | Search quality filtering |

---

## 4. SOURCE METADATA

- Group: Undocumented feature gap scan
- Source feature title: Quality-aware 3-tier search fallback
- Current reality source: 10-agent feature gap scan
- Playbook reference: 109
