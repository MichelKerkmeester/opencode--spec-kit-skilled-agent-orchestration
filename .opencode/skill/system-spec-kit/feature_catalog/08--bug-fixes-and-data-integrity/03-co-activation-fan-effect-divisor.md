---
title: "Co-activation fan-effect divisor"
description: "Tracks the fan-effect divisor that prevents hub memories from dominating co-activation results."
---

# Co-activation fan-effect divisor

## 1. OVERVIEW

Tracks the fan-effect divisor that prevents hub memories from dominating co-activation results.

Some highly connected memories kept showing up in every search result regardless of what you were looking for, like a popular student who gets invited to every party. This fix reduces the influence of overly connected memories so they do not crowd out more relevant results.

---

## 2. CURRENT REALITY

Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.

A fan-effect divisor helper (`1 / sqrt(neighbor_count)`) exists in `co-activation.ts` `boostScore()`. The same divisor is now also applied in the Stage 2 hot-path co-activation scoring (`stage2-fusion.ts`). When spreading activation boosts are applied to search results, the boost is divided by `sqrt(relatedCount)` where `relatedCount` is the number of pre-computed related memories for the target result. This ensures hub nodes with many connections receive proportionally dampened boosts, preventing any single hub from monopolizing top-N results.

The divisor path is now batched end to end. Related-memory detail hydration is fetched in one `WHERE id IN (...)` query, causal neighbors are hydrated with one CTE + join query, and Stage 2 asks for related counts once per boosted batch instead of calling back into per-row relationship lookups. That keeps the hub-dampening math intact while removing the N+1 read pattern from the hot scoring path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2 hot-path co-activation boost application (`base + boost * coactivation_strength`) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests, including batched lookup coverage for related-memory and causal-neighbor hydration |
| `mcp_server/tests/rrf-degree-channel.vitest.ts` | Fan-effect divisor behavior in `boostScore()` and co-activation boost interactions |
| `mcp_server/tests/stage2-fusion.vitest.ts` | Stage 2 adjacent scoring-path coverage, including one-shot co-activation neighbor-count precomputation |

---

## 4. SOURCE METADATA

- Group: Bug fixes and data integrity
- Source feature title: Co-activation fan-effect divisor
- Current reality source: FEATURE_CATALOG.md
