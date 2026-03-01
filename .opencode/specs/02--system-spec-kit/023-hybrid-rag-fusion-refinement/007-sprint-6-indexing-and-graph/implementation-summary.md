---
title: "Implementation Summary: Sprint 6a — Indexing and Graph"
description: "Sprint 6a implementation summary: weight_history audit, N3-lite consolidation, anchor-aware thinning, encoding-intent capture, spec folder hierarchy"
SPECKIT_TEMPLATE_SOURCE: "implementation-summary | v2.2"
trigger_phrases:
  - "sprint 6 implementation"
  - "sprint 6a summary"
  - "N3-lite consolidation implementation"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary: Sprint 6a — Indexing and Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

## Overview

Sprint 6a implemented 5 major features for the Spec Kit Memory system: weight_history audit tracking (T001d/MR10), N3-lite consolidation engine (T002), anchor-aware chunk thinning (T003/R7), encoding-intent capture (T004/R16), and spec folder hierarchy retrieval (T006/S4). All Sprint 6a tasks completed; Sprint 6b (N2 centrality, R10 entity extraction) deferred pending feasibility spike.

**Schema version**: 17 → 18 | **New tests**: 121 | **Files created**: 8 | **Files modified**: 12

### Post-Review Gap Closure (2026-02-28)

After a deep audit, Sprint 6a runtime integrations were hardened to match documented exit-gate claims:

- **R7 wiring closed**: `indexChunkedMemoryFile()` now applies `thinChunks()` before writing child records; integration test verifies retained-count persistence.
- **R16 wiring closed**: `encoding_intent` now persists through active + deferred indexing paths, with DB-level integration tests.
- **S4 wiring closed**: graph search now augments results via hierarchy traversal when `specFolder` is present.
- **N3-lite runtime hook added**: `runConsolidationCycleIfEnabled()` is now invoked from `memory_save` and enforces weekly cadence when `SPECKIT_CONSOLIDATION=true`.
- **N3-lite bug fix**: Hebbian strengthening query now selects `created_by`, ensuring auto-edge cap enforcement during strengthening.

---

## Changes Made

### T001d: weight_history Audit Tracking (P0 Blocker)

**Files modified:**
- `mcp_server/lib/search/vector-index-impl.ts` — Schema v17→v18 migration: `weight_history` table, `created_by`/`last_accessed` on `causal_edges`, `encoding_intent` on `memory_index`
- `mcp_server/lib/storage/causal-edges.ts` — Extended `CausalEdge` interface, added `WeightHistoryEntry` interface, new functions: `logWeightChange()`, `getWeightHistory()`, `rollbackWeights()`, `countEdgesForNode()`, `touchEdgeAccess()`, `getStaleEdges()`
- `mcp_server/lib/search/search-flags.ts` — Added `isConsolidationEnabled()`, `isEncodingIntentEnabled()`

**Constants added:** `MAX_EDGES_PER_NODE=20`, `MAX_AUTO_STRENGTH=0.5`, `MAX_STRENGTH_INCREASE_PER_CYCLE=0.05`, `STALENESS_THRESHOLD_DAYS=90`, `DECAY_STRENGTH_AMOUNT=0.1`, `DECAY_PERIOD_DAYS=30`

**Design decisions:**
- Additive schema migration (ALTER TABLE ADD COLUMN) for existing DBs; base DDL updated for fresh installs
- `insertEdge()` enforces edge bounds at insert time — auto edges rejected at MAX_EDGES_PER_NODE, clamped to MAX_AUTO_STRENGTH
- All weight modifications logged with before/after values, timestamps, `changed_by` provenance, and `reason`
- `rollbackWeights()` restores from weight_history with fallback to oldest entry if timestamp matching fails (same-millisecond edge case)

### T002: N3-lite Consolidation Engine

**File created:** `mcp_server/lib/storage/consolidation.ts` (~450 LOC)

**Sub-tasks implemented:**
- **T002a** — `scanContradictions()`: Dual strategy — vector-based (cosine similarity on sqlite-vec embeddings) + heuristic fallback (word overlap). Both use `hasNegationConflict()` keyword asymmetry check. Threshold: 0.85.
- **T002b** — `runHebbianCycle()`: Strengthens recently accessed edges (+0.05/cycle), decays stale edges (-0.1 after 30 days). Respects auto cap. All changes logged to weight_history.
- **T002c** — `detectStaleEdges()`: Flags edges not accessed in 90+ days via `getStaleEdges()`. No deletion — flagging only.
- **T002d** — `checkEdgeBounds()`: Reports current edge count vs MAX_EDGES_PER_NODE. Enforcement at insert time via `insertEdge()`.
- **T002e** — `buildContradictionClusters()`: Expands contradiction pairs to full clusters via 1-hop causal edge neighbors.
- `runConsolidationCycle()`: Orchestrates all sub-tasks as weekly batch. Behind `SPECKIT_CONSOLIDATION` flag.

**Test file:** `tests/s6-n3lite-consolidation.vitest.ts` — 28 tests

### T003: R7 Anchor-Aware Chunk Thinning

**File created:** `mcp_server/lib/chunking/chunk-thinning.ts`

- `scoreChunk()`: Composite score = ANCHOR_WEIGHT(0.6) * anchorPresence + DENSITY_WEIGHT(0.4) * contentDensity
- `thinChunks()`: Applies threshold (default 0.3), safety guarantee never returns empty array
- Content density: strips HTML comments, computes meaningful-to-total ratio, length penalty for <100 chars, structure bonus for headings/code/lists

**Test file:** `tests/s6-r7-chunk-thinning.vitest.ts` — 24 tests

### T004: R16 Encoding-Intent Capture

**File created:** `mcp_server/lib/search/encoding-intent.ts`

- `classifyEncodingIntent()`: Returns `'document'` | `'code'` | `'structured_data'`
- Heuristic scoring: code indicators (blocks, imports, punctuation density), structured indicators (YAML frontmatter, tables, key-value pairs)
- Classification threshold: 0.4. Behind `SPECKIT_ENCODING_INTENT` flag.
- Schema: `encoding_intent TEXT DEFAULT 'document'` added to `memory_index`

**Test file:** `tests/s6-r16-encoding-intent.vitest.ts` — 18 tests

### T006: S4 Spec Folder Hierarchy

**File created:** `mcp_server/lib/search/spec-folder-hierarchy.ts`

- `buildHierarchyTree()`: Builds tree from DB spec_folder values with implicit parent nodes
- `queryHierarchyMemories()`: Returns parent/sibling/ancestor memories with relevance scoring (self=1.0, parent=0.8, grandparent=0.6, sibling=0.5, floor=0.3)
- Helper functions: `getParentPath()`, `getAncestorPaths()`, `getSiblingPaths()`, `getDescendantPaths()`, `getRelatedFolders()`

**Test file:** `tests/s6-s4-spec-folder-hierarchy.vitest.ts` — 46 tests

### Test Schema Updates

**10 existing test files updated** to include Sprint 6 schema additions (`created_by`, `last_accessed` on `causal_edges`, `weight_history` table):
- `causal-edges-unit.vitest.ts`, `t202-t203-causal-fixes.vitest.ts`, `causal-boost.vitest.ts`, `memory-save-extended.vitest.ts`, `reconsolidation.vitest.ts`, `t010-degree-computation.vitest.ts`, `handler-helpers.vitest.ts`, `t011-edge-density.vitest.ts`, `phase2-integration.vitest.ts`, `corrections.vitest.ts`

---

## Feature Flag Inventory

| Flag | Sprint | Default | Status |
|------|--------|---------|--------|
| SPECKIT_MMR | 0 | ON | Keep — core pipeline |
| SPECKIT_TRM | 0 | ON | Keep — core pipeline |
| SPECKIT_MULTI_QUERY | 0 | ON | Keep — core pipeline |
| SPECKIT_CROSS_ENCODER | 0 | ON | Keep — core pipeline |
| SPECKIT_SEARCH_FALLBACK | 3 | OFF | Keep — extend measurement |
| SPECKIT_FOLDER_DISCOVERY | 3 | OFF | Keep — extend measurement |
| SPECKIT_DOCSCORE_AGGREGATION | 4 | OFF | Keep — extend measurement |
| SPECKIT_SHADOW_SCORING | 4 | OFF | Keep — extend measurement |
| SPECKIT_SAVE_QUALITY_GATE | 4 | OFF | Keep — extend measurement |
| SPECKIT_RECONSOLIDATION | 4 | OFF | Keep — extend measurement |
| SPECKIT_NEGATIVE_FEEDBACK | 4 | OFF | Keep — extend measurement |
| SPECKIT_PIPELINE_V2 | 5 | OFF | Keep — extend measurement |
| SPECKIT_EMBEDDING_EXPANSION | 5 | OFF | Keep — extend measurement |
| SPECKIT_CONSOLIDATION | 6 | OFF | NEW — N3-lite |
| SPECKIT_ENCODING_INTENT | 6 | OFF | NEW — R16 |

**Default active**: 4 (Sprint 0 core). **Threshold**: <=6 MET.

---

## Test Results

| Suite | Tests | Status |
|-------|-------|--------|
| s6-n3lite-consolidation | 28 | PASS |
| s6-r7-chunk-thinning | 24 | PASS |
| s6-r16-encoding-intent | 18 | PASS |
| s6-s4-spec-folder-hierarchy | 46 | PASS |
| causal-edges-unit | 70 | PASS |
| t202-t203-causal-fixes | 17 | PASS |
| **Sprint 6a total** | **203** | **ALL PASS** |
| **Full regression** | **6589/6593** | **4 pre-existing** |

---

## Issues Resolved

1. **Floating point precision** (T-HEB-04): `0.8 - 0.1 = 0.7000000000000001`. Fixed with `toBeCloseTo(0.7, 5)`.
2. **Timestamp rollback** (T-WH-04): Same-millisecond updates caused `rollbackWeights()` to miss entries. Fixed with fallback to oldest weight_history entry.
3. **Schema mismatch** (61 test failures): Existing test files missing `created_by`/`last_accessed` columns. Fixed by updating 10 test files.

---

## Deferred (Sprint 6b)

Sprint 6b items remain pending, gated on feasibility spike (T-S6-SPIKE):
- **T001 (N2)**: Graph centrality + community detection (momentum, causal depth, connected components)
- **T005 (R10)**: Auto entity extraction behind `SPECKIT_AUTO_ENTITIES` flag
- **T-PI-S6**: PageIndex cross-references from earlier sprints

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md`
