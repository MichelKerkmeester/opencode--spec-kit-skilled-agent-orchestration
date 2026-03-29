---
title: "Co-activation boost strength increase"
description: "Describes the co-activation boost multiplier increase from 0.1x to 0.25x, making graph signal contribution visible in retrieval results at 15% or higher effective contribution."
---

# Co-activation boost strength increase

## 1. OVERVIEW

Describes the co-activation boost multiplier increase from 0.1x to 0.25x, making graph signal contribution visible in retrieval results at 15% or higher effective contribution.

When two memories are connected in the knowledge graph, finding one should help surface the other. The original boost from these connections was too weak to make a noticeable difference. This change turned up the volume so that graph connections actually influence what shows up in your search results, making the relationship map between memories useful rather than decorative.

---

## 2. CURRENT REALITY

The co-activation boost multiplier jumped from 0.1x to 0.25x. At 0.1x, the graph signal investment was barely visible in retrieval results, roughly 5% effective contribution at hop 2.

The new multiplier targets 15% or higher contribution, which is enough to matter without overwhelming the vector and lexical channels. You can tune the exact value through the `SPECKIT_COACTIVATION_STRENGTH` environment variable.

The stronger multiplier now runs on a cheaper retrieval path. Similarity-neighbor hydration batches memory detail fetches with a single `WHERE id IN (...)` query, `getCausalNeighbors()` uses one SQL statement with a CTE and `JOIN memory_index`, and Stage 2 fusion precomputes related-neighbor counts once per boosted batch before applying the fan-effect divisor. That eliminates the old N+1 lookup pattern, so raising co-activation strength no longer multiplies per-row database chatter.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading, batched related-memory hydration, and joined causal-neighbor lookup |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Batch-level co-activation count precomputation before score boosting |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests, including batched `WHERE id IN (...)` hydration and single-query causal-neighbor coverage |
| `mcp_server/tests/stage2-fusion.vitest.ts` | Verifies co-activation neighbor counts are precomputed once per boosted batch |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Co-activation boost strength increase
- Current reality source: FEATURE_CATALOG.md
