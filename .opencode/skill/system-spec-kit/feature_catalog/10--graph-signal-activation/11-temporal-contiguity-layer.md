---
title: "Temporal contiguity layer"
description: "Describes the pairwise temporal proximity boost that amplifies scores for memories created close together in time, using a clamped window with a cumulative cap of 0.50 per result."
---

# Temporal contiguity layer

## 1. OVERVIEW

Describes the pairwise temporal proximity boost that amplifies scores for memories created close together in time, using a clamped window with a cumulative cap of 0.50 per result.

Memories created around the same time are often about the same topic, like notes taken during the same meeting. This feature gives a search boost to results that were stored close together in time. If one memory from a Tuesday afternoon session is relevant, the others from that same session probably are too. The boost fades as the time gap between memories grows larger.

---

## 2. CURRENT REALITY

Temporal contiguity is an active graduated feature in the Stage 1 vector channel. Raw vector results are passed through `vectorSearchWithContiguity()` before any downstream fusion or reranking, so temporally adjacent memories can reinforce each other while the candidate set is still in its vector-native form. The rollout is controlled by `SPECKIT_TEMPORAL_CONTIGUITY`, which is default-on and can be disabled by setting the flag to `false`.

Given an in-memory set of vector search results, the module applies pairwise temporal boosts inside a clamped window (`1..86400` seconds, default 3600). Each pair contributes a distance-weighted boost using factor `0.15`, with a cumulative cap of `0.50` per result.

The same module also provides `init()` for database wiring, `getTemporalNeighbors()` for direct temporal neighborhood lookups, and `buildTimeline()` for chronological timeline construction. This captures the temporal contiguity effect from memory psychology: memories formed close together in time are often contextually related.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/temporal-contiguity.ts` | Lib | Temporal proximity boost and timeline queries |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/temporal-contiguity.vitest.ts` | Temporal contiguity tests |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Temporal contiguity layer
- Current reality source: active Stage 1 vector channel integration
