---
title: "Assistive reconsolidation"
description: "Three-tier assistive reconsolidation classifies memory pairs by cosine similarity into shadow-archive, review, or keep-separate tiers, providing non-destructive recommendations for near-duplicates and borderline pairs, gated by the SPECKIT_ASSISTIVE_RECONSOLIDATION flag."
---

# Assistive reconsolidation

> **Status**: This feature performs shadow-archive (not merge). See reconsolidation-bridge.ts:363-377. (updated 2026-03-25 per deep review)

## 1. OVERVIEW

Three-tier assistive reconsolidation classifies memory pairs by cosine similarity into shadow-archive, review, or keep-separate tiers, providing non-destructive recommendations for near-duplicates and borderline pairs, gated by the `SPECKIT_ASSISTIVE_RECONSOLIDATION` flag.

When you save many memories over time, some end up very similar. This feature detects those overlaps and handles them intelligently. Above 96% similarity, near-duplicates trigger a shadow-archive: the older record is marked is_archived=1 while the new record saves normally. No content merging occurs. Borderline pairs (88-96% similarity) get a recommendation — either the newer one replaces the older, or they complement each other — but no destructive action is taken without review. Below 88% similarity, both are kept as separate entries. It works alongside the existing reconsolidation system but adds a gentler, more nuanced approach.

---

## 2. CURRENT REALITY

The assistive reconsolidation module operates in three tiers based on cosine similarity:
- **Shadow-archive** (similarity >= `ASSISTIVE_AUTO_MERGE_THRESHOLD = 0.96`): the internal `auto_merge` tier triggers a shadow-archive: the older record is marked `is_archived=1` while the new record saves normally. No content merging occurs.
- **Review** (similarity >= `ASSISTIVE_REVIEW_THRESHOLD = 0.88`): a recommendation is logged but no destructive action is taken. Classification uses a heuristic: if the newer memory's content is longer (by > 20%), it is classified as `complement`; otherwise as `supersede`
- **Keep separate** (similarity < 0.88): memories are sufficiently different and both are kept

The `classifyAssistiveSimilarity()` function returns the tier, and `classifySupersededOrComplement()` provides the heuristic classification for borderline pairs. `logAssistiveRecommendation()` writes shadow-only console warnings (no database writes) with classification, memory IDs, and similarity score.

The bridge result (`ReconsolidationBridgeResult`) includes an `assistiveRecommendation` field populated when the feature is enabled and a borderline pair is detected.

The companion core reconsolidation merge path now validates predecessor freshness before any append-only merge completes. `executeMerge()` snapshots the predecessor row's `content_hash` and `updated_at`, reloads the row inside the transaction after the embedding await, and aborts with `predecessor_changed` or `predecessor_gone` if the predecessor changed, was deleted, or was archived mid-flight. Assistive reconsolidation still remains non-destructive at its own layer, but adjacent merge handling is now protected from stale predecessor state.

Default ON (graduated), controlled by `SPECKIT_ASSISTIVE_RECONSOLIDATION` (updated 2026-03-25 per deep review).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Handler | Tier classification, supersede/complement heuristic, recommendation logging, bridge integration |
| `mcp_server/lib/storage/reconsolidation.ts` | Lib | Core reconsolidation engine (merge, supersede, complement logic) |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isAssistiveReconsolidationEnabled()` base flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/assistive-reconsolidation.vitest.ts` | Flag behavior, tier classification, supersede/complement heuristic, recommendation logging |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Assistive reconsolidation
- Current reality source: mcp_server/handlers/save/reconsolidation-bridge.ts module header and implementation
