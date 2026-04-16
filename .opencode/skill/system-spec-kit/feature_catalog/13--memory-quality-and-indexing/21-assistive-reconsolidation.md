---
title: "Assistive reconsolidation"
description: "Three-tier assistive reconsolidation classifies memory pairs by cosine similarity into a high-similarity compatibility note, review, or keep-separate tiers, with advisory-only behavior at the assistive layer and recommendations gated by SPECKIT_ASSISTIVE_RECONSOLIDATION."
audited_post_018: true
---

# Assistive reconsolidation

> **Status**: The assistive layer is advisory only. Near-duplicate pairs trigger a high-similarity compatibility note, review-tier pairs emit recommendations, and no assistive tier mutates stored memories.

## 1. OVERVIEW

Three-tier assistive reconsolidation classifies memory pairs by cosine similarity into a high-similarity compatibility note, review, or keep-separate tiers, with advisory-only behavior at the assistive layer and recommendations gated by the `SPECKIT_ASSISTIVE_RECONSOLIDATION` flag.

When you save many memories over time, some end up very similar. This feature detects those overlaps and handles them without mutating stored rows from the assistive layer itself. Above 96% similarity, near-duplicates trigger a high-similarity compatibility note that explicitly reports archived-tier side effects are disabled. Borderline pairs (88-96% similarity) get a recommendation about whether the newer memory likely supersedes or complements the older one. Below 88% similarity, both are treated as separate. It works alongside the core reconsolidation system but keeps the assistive path advisory.

---

## 2. CURRENT REALITY

The assistive reconsolidation module operates in three tiers based on cosine similarity:
- **High-similarity compatibility note** (similarity >= `ASSISTIVE_COMPATIBILITY_NOTE_THRESHOLD = 0.96`): the internal `auto_merge` tier now emits a warning that archived-tier side effects are disabled, rather than changing stored rows.
- **Review** (similarity >= `ASSISTIVE_REVIEW_THRESHOLD = 0.88`): a recommendation is logged but no destructive action is taken. Classification uses a heuristic: if the newer memory's content is longer (by > 20%), it is classified as `complement`; otherwise as `supersede`.
- **Keep separate** (similarity < 0.88): memories are sufficiently different and the assistive layer takes no action.

The `classifyAssistiveSimilarity()` function returns the tier, and `classifySupersededOrComplement()` provides the heuristic classification for borderline pairs. `logAssistiveRecommendation()` writes review-tier console warnings with classification, memory IDs, and similarity score. No assistive path writes archival metadata or performs merge-time mutations.

The bridge result (`ReconsolidationBridgeResult`) includes an `assistiveRecommendation` field only when the feature is enabled and a borderline pair is detected.

The companion core reconsolidation merge path now validates predecessor freshness before any append-only merge completes. `executeMerge()` snapshots the predecessor row's `content_hash` and `updated_at`, reloads the row inside the transaction after the embedding await, and aborts with `predecessor_changed` or `predecessor_gone` if the predecessor changed, disappeared, or otherwise drifted mid-flight. Assistive reconsolidation still remains non-destructive at its own layer, but adjacent merge handling is now protected from stale predecessor state.

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
