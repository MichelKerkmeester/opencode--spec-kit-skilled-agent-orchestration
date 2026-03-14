# Cross-document entity linking

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Cross-document entity linking creates causal edges between memories in different spec folders that reference the same entity.

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
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/search/entity-linker.ts` | Lib | Cross-document entity linking |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/entity-linker.vitest.ts` | Entity linking tests |
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Cross-document entity linking
- Current reality source: feature_catalog.md

## 5. IN SIMPLE TERMS

Different documents in different folders sometimes talk about the same thing without knowing about each other. This feature connects them automatically when it notices they reference the same concept. It is like a researcher who reads two separate reports, notices both mention the same topic and staples a note between them saying "these are related."
