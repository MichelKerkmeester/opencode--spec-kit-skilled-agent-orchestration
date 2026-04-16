---
title: "Deduplicate Graph Metadata Entities - Checklist"
status: complete
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
- [x] Corpus verification captures the duplicate-slot cleanup outcome for the targeted folders. Evidence: the final entity audit returned `duplicateEntityNameGroups = 0` across the refreshed corpus.
- [x] The adjacent trigger-cap cleanup remains explicit and verified rather than implicit. Evidence: `implementation-summary.md` documents the trigger-cap follow-up directly and `graph-metadata-schema.vitest.ts` still covers the 12-item cap behavior alongside the entity collision tests.
