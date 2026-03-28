---
title: "Interference scoring"
description: "Describes the interference penalty that demotes memories in dense similarity clusters, preventing near-identical results from crowding out unique content."
---

# Interference scoring

## 1. OVERVIEW

Describes the interference penalty that demotes memories in dense similarity clusters, preventing near-identical results from crowding out unique content.

If you have five nearly identical memories about the same thing, they can all crowd into the top results and push out something different that might actually be more helpful. This feature penalizes memories that look too similar to their neighbors, making room for a wider variety of results. It is like a rule that says "no more than one song per artist on a playlist" to keep things diverse.

---

## 2. CURRENT REALITY

Memories in dense similarity clusters tend to crowd out unique results. If you have five near-identical memories about the same topic, all five can occupy the top results and push out a different memory that might be more relevant.

Interference scoring penalizes cluster density: for each memory, the system counts how many neighbors exceed a 0.75 text similarity threshold (Jaccard over word tokens from title and trigger phrases) within the same spec folder, then applies a `-0.08 * interference_score` penalty in composite scoring. Only live peer memories participate in that count: chunk rows, archived rows, and `deprecated` memories are excluded so inactive records do not drag down active retrieval. (Novelty boost remains disabled in the hot path.)

Both the threshold (0.75) and coefficient (-0.08) are provisional. They will be tuned empirically after two R13 evaluation cycles, tracked as FUT-S2-001. Runs behind the `SPECKIT_INTERFERENCE_SCORE` flag.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/interference.vitest.ts` | Interference scoring tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Interference scoring
- Current reality source: FEATURE_CATALOG.md
