---
title: "Entity normalization consolidation"
description: "Entity normalization consolidation unified two divergent normalization functions and deduplicated `computeEdgeDensity` into a single source."
---

# Entity normalization consolidation

## 1. OVERVIEW

Entity normalization consolidation unified two divergent normalization functions and deduplicated `computeEdgeDensity` into a single source.

Two parts of the system were cleaning up entity names in different ways, which meant the same name could look different depending on where it was processed. This fix unified them so there is only one way to clean up a name, ensuring "Claude Code" always looks the same everywhere. Without this, the system could fail to recognize that two mentions refer to the same thing.

---

## 2. CURRENT REALITY

Two cross-cutting normalization issues were resolved:

**A1: Divergent normalizeEntityName:** `entity-extractor.ts` used ASCII-only normalization (`/[^\w\s-]/g`) while `entity-linker.ts` used Unicode-aware normalization (`/[^\p{L}\p{N}\s]/gu`). Consolidated to a single Unicode-aware version in `entity-linker.ts`, imported by `entity-extractor.ts`.

**A2: Duplicate computeEdgeDensity:** Both `entity-extractor.ts` and `entity-linker.ts` had independent implementations. Consolidated to `entity-linker.ts` with import and re-export from `entity-extractor.ts`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/entity-linker.ts` | Lib | Canonical `normalizeEntityName()` and `computeEdgeDensity()` implementations |
| `mcp_server/lib/extraction/entity-extractor.ts` | Lib | Entity extraction; imports and re-exports `normalizeEntityName` and `computeEdgeDensity` from `entity-linker.ts` |
| `mcp_server/lib/extraction/entity-denylist.ts` | Lib | Entity denylist |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/entity-extractor.vitest.ts` | Entity extraction tests |

---

## 4. SOURCE METADATA

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Entity normalization consolidation
- Current reality source: FEATURE_CATALOG.md
