---
title: "Deduplicate Graph Metadata Entities - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [x] `mcp_server/lib/graph/graph-metadata-parser.ts:418-446` uses a shared helper for both entity write sites. Evidence: `upsertEntityByName()` now handles both key-file seeding and extracted-entity insertion.
- [x] Canonical packet-doc paths beat basename-only or non-canonical collisions when names normalize to the same key. Evidence: `prefersCandidate()` now favors canonical path-like packet docs over basename-only duplicates.
- [x] Integration tests prove duplicate entity slots no longer survive simple `spec.md` and `plan.md` collision cases. Evidence: `graph-metadata-schema.vitest.ts` keeps `spec.md` and `plan.md` at one entity each after collision cases.
## P1 (Should Fix)
- [x] The phase addresses duplicate creation during key-file seeding first, matching `../research/research.md:272-289`. Evidence: key files are seeded through `upsertEntityByName()` before extracted entities are merged.
- [x] The 16-entity cap behavior is preserved after deduplication. Evidence: `deriveEntities()` still returns `Array.from(entities.values()).slice(0, 16)`.
- [x] The implementation stays packet-local and does not introduce cross-folder entity merging. Evidence: deduplication is limited to normalized names within one packet parse and does not add cross-folder merge logic.
## P2 (Advisory)
- [ ] Corpus verification captures the before/after duplicate-slot count for the targeted folders.
- [ ] Any adjacent trigger-cap cleanup remains tracked as separate parser work rather than silently merged into this phase.
