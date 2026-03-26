---
title: "Lightweight consolidation"
description: "Lightweight consolidation is invoked after every save, but contradiction scanning, Hebbian edge strengthening, staleness detection and edge bounds enforcement execute on a weekly cadence."
---

# Lightweight consolidation

## 1. OVERVIEW

Lightweight consolidation is invoked after every save, but contradiction scanning, Hebbian edge strengthening, staleness detection and edge bounds enforcement execute on a weekly cadence.

Over time, stored memories can contradict each other or grow stale. This feature runs periodic housekeeping to spot conflicts, strengthen connections that get used often and flag relationships that have not been touched in months. Think of it as a librarian who regularly walks the shelves to catch duplicate entries and retire outdated references.

---

## 2. CURRENT REALITY

Four sub-components handle ongoing memory graph maintenance as a weekly batch cycle. Contradiction scanning finds memory pairs above 0.85 cosine similarity with keyword negation conflicts using a dual strategy: vector-based (cosine on sqlite-vec embeddings) plus heuristic fallback (word overlap). Both use a `hasNegationConflict()` keyword asymmetry check against approximately 20 negation terms (not, never, deprecated, replaced and others). The system surfaces full contradiction clusters rather than isolated pairs via 1-hop causal edge neighbor expansion.

Hebbian edge strengthening reinforces recently accessed edges at +0.05 per cycle with a 30-day decay of 0.1, respecting the auto-edge strength cap. Staleness detection flags edges unfetched for 90 or more days without deleting them. Edge bounds enforcement reports current edge counts versus the 20-edge-per-node maximum.

All weight modifications are logged to the `weight_history` table. The runtime hook is invoked after every successful `memory_save`, but execution is rate-limited to a weekly cadence (`CONSOLIDATION_INTERVAL_DAYS = 7`) when enabled. Runs behind the `SPECKIT_CONSOLIDATION` flag (default ON).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/save/response-builder.ts` | Handler | Post-save runtime hook that runs consolidation when the response is built |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge storage |
| `mcp_server/lib/storage/consolidation.ts` | Lib | Lightweight consolidation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/n3lite-consolidation.vitest.ts` | N3-lite consolidation tests |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Lightweight consolidation
- Current reality source: FEATURE_CATALOG.md
