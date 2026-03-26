---
title: "Cross-document entity linking"
description: "Cross-document entity linking creates causal edges between memories in different spec folders that reference the same entity."
---

# Cross-document entity linking

## 1. OVERVIEW

Cross-document entity linking creates causal edges between memories in different spec folders that reference the same entity.

Different documents in different folders sometimes talk about the same thing without knowing about each other. This feature connects them automatically when it notices they reference the same concept. It is like a researcher who reads two separate reports, notices both mention the same topic and staples a note between them saying "these are related."

---

## 2. CURRENT REALITY

Memories in different spec folders often discuss the same concepts without any explicit connection between them. A decision record in one folder mentions "embedding cache" and an implementation summary in another folder implements it, but the retrieval system has no way to connect them unless a causal edge exists.

Cross-document entity linking bridges this gap using the entity catalog populated by R10. The `buildEntityCatalog()` function groups entities from the `memory_entities` table by canonical name. The `findCrossDocumentMatches()` function identifies entities appearing in two or more distinct spec folders, which represent genuine cross-document relationships.

For each cross-document match, `createEntityLinks()` inserts causal edges with `relation='supports'`, `strength=0.7` and `created_by='entity_linker'`. The `supports` relation was chosen over adding a new relation type to avoid ALTER TABLE complexity on the SQLite `causal_edges` CHECK constraint. Entity-derived links are genuinely supportive relationships: if two documents reference the same entity, they support each other's context.

An infrastructure gate checks that the `entity_catalog` has entries before running. Without R10 providing extracted entities, S5 has nothing to operate on. The `runEntityLinking()` orchestrator chains catalog build, match finding and edge creation with statistics reporting.

**Sprint 8 update:** Two performance improvements were applied to `entity-linker.ts`: (1) a parallel `Set` was added for `catalogSets` providing O(1) `.has()` lookups instead of O(n) `.includes()` in inner loops, and (2) a `batchGetEdgeCounts()` function replaced N+1 individual `getEdgeCount` queries with a single batch query.

A density guard prevents runaway edge creation: current global edge density is computed as `total_edges / total_memories` and checked before link generation begins. The linker also checks projected post-insert global density before creating links. If either check exceeds the configured threshold, new entity links are skipped to avoid overwhelming the graph. The threshold is controlled by `SPECKIT_ENTITY_LINKING_MAX_DENSITY` (default `1.0`), and invalid or negative values fall back to `1.0`. Runs behind the `SPECKIT_ENTITY_LINKING` flag (default ON). Depends on a populated `entity_catalog` (typically produced by R10 auto-entities).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/entity-linker.ts` | Lib | Builds the entity catalog, finds cross-document matches, and creates `supports` edges with density-guard enforcement |
| `mcp_server/handlers/save/post-insert.ts` | Handler | Save-time enrichment path that invokes entity linking after entity extraction succeeds |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/entity-linker.vitest.ts` | Unit coverage for catalog build, match discovery, link creation, and density-guard behavior |
| `mcp_server/tests/deferred-features-integration.vitest.ts` | End-to-end entity-linking integration through `runEntityLinking()` |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Cross-document entity linking
- Current reality source: FEATURE_CATALOG.md
