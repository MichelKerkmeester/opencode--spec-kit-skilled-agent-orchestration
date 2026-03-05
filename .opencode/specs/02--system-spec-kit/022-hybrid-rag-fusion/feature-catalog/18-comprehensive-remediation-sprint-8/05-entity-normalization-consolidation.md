# Entity normalization consolidation

## Current Reality

Two cross-cutting normalization issues were resolved:

**A1 — Divergent normalizeEntityName:** `entity-extractor.ts` used ASCII-only normalization (`/[^\w\s-]/g`) while `entity-linker.ts` used Unicode-aware normalization (`/[^\p{L}\p{N}\s]/gu`). Consolidated to a single Unicode-aware version in `entity-linker.ts`, imported by `entity-extractor.ts`.

**A2 — Duplicate computeEdgeDensity:** Both `entity-extractor.ts` and `entity-linker.ts` had independent implementations. Consolidated to `entity-linker.ts` with import and re-export from `entity-extractor.ts`.

## Source Metadata

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Entity normalization consolidation
- Current reality source: feature_catalog.md
