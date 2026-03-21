---
title: "Assistive reconsolidation"
description: "Three-tier assistive reconsolidation classifies memory pairs by cosine similarity into auto-merge, review, or keep-separate tiers, providing non-destructive recommendations for near-duplicates and borderline pairs, gated by the SPECKIT_ASSISTIVE_RECONSOLIDATION flag."
---

# Assistive reconsolidation

## 1. OVERVIEW

Three-tier assistive reconsolidation classifies memory pairs by cosine similarity into auto-merge, review, or keep-separate tiers, providing non-destructive recommendations for near-duplicates and borderline pairs, gated by the `SPECKIT_ASSISTIVE_RECONSOLIDATION` flag.

When you save many memories over time, some end up very similar. This feature detects those overlaps and handles them intelligently. Near-identical memories (above 96% similarity) are automatically merged. Borderline pairs (88-96% similarity) get a recommendation — either the newer one replaces the older, or they complement each other — but no destructive action is taken without review. Below 88% similarity, both are kept as separate entries. It works alongside the existing reconsolidation system but adds a gentler, more nuanced approach.

---

## 2. CURRENT REALITY

The assistive reconsolidation module operates in three tiers based on cosine similarity:
- **Auto-merge** (similarity >= `ASSISTIVE_AUTO_MERGE_THRESHOLD = 0.96`): near-duplicates are automatically merged
- **Review** (similarity >= `ASSISTIVE_REVIEW_THRESHOLD = 0.88`): a recommendation is logged but no destructive action is taken. Classification uses a heuristic: if the newer memory's content is longer (by > 20%), it is classified as `complement`; otherwise as `supersede`
- **Keep separate** (similarity < 0.88): memories are sufficiently different and both are kept

The `classifyAssistiveSimilarity()` function returns the tier, and `classifySupersededOrComplement()` provides the heuristic classification for borderline pairs. `logAssistiveRecommendation()` writes shadow-only console warnings (no database writes) with classification, memory IDs, and similarity score.

The bridge result (`ReconsolidationBridgeResult`) includes an `assistiveRecommendation` field populated when the feature is enabled and a borderline pair is detected.

Default OFF, set `SPECKIT_ASSISTIVE_RECONSOLIDATION=true` to enable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Handler | Tier classification, supersede/complement heuristic, recommendation logging, bridge integration |
| `mcp_server/lib/storage/reconsolidation.ts` | Lib | Core reconsolidation engine (merge, supersede, complement logic) |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isReconsolidationEnabled()` base flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/assistive-reconsolidation.vitest.ts` | Flag behavior, tier classification, supersede/complement heuristic, recommendation logging |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Assistive reconsolidation
- Current reality source: mcp_server/handlers/save/reconsolidation-bridge.ts module header and implementation
