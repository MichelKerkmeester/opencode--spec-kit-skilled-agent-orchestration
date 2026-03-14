# Lightweight consolidation

## 1. OVERVIEW

Lightweight consolidation runs contradiction scanning, Hebbian edge strengthening, staleness detection and edge bounds enforcement as a post-save batch cycle.

Over time, stored memories can contradict each other or grow stale. This feature runs periodic housekeeping to spot conflicts, strengthen connections that get used often and flag relationships that have not been touched in months. Think of it as a librarian who regularly walks the shelves to catch duplicate entries and retire outdated references.

---

## 2. CURRENT REALITY

Four sub-components handle ongoing memory graph maintenance as a weekly batch cycle. Contradiction scanning finds memory pairs above 0.85 cosine similarity with keyword negation conflicts using a dual strategy: vector-based (cosine on sqlite-vec embeddings) plus heuristic fallback (word overlap). Both use a `hasNegationConflict()` keyword asymmetry check against approximately 20 negation terms (not, never, deprecated, replaced and others). The system surfaces full contradiction clusters rather than isolated pairs via 1-hop causal edge neighbor expansion.

Hebbian edge strengthening reinforces recently accessed edges at +0.05 per cycle with a 30-day decay of 0.1, respecting the auto-edge strength cap. Staleness detection flags edges unfetched for 90 or more days without deleting them. Edge bounds enforcement reports current edge counts versus the 20-edge-per-node maximum.

All weight modifications are logged to the `weight_history` table. The cycle fires after every successful `memory_save` when enabled. Runs behind the `SPECKIT_CONSOLIDATION` flag (default ON).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge storage |
| `mcp_server/lib/storage/consolidation.ts` | Lib | Lightweight consolidation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/bm25-index.vitest.ts` | BM25 index operations |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge unit tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization tests |
| `mcp_server/tests/graph-search-fn.vitest.ts` | Graph search function tests |
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/n3lite-consolidation.vitest.ts` | N3-lite consolidation tests |
| `mcp_server/tests/reconsolidation.vitest.ts` | Reconsolidation tests |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |
| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Folder hierarchy tests |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Lightweight consolidation
- Current reality source: feature_catalog.md
