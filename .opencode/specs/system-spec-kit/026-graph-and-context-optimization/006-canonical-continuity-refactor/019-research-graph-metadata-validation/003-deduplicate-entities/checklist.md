---
title: "Deduplicate Graph Metadata Entities - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [ ] `mcp_server/lib/graph/graph-metadata-parser.ts:418-446` uses a shared helper for both entity write sites.
- [ ] Canonical packet-doc paths beat basename-only or non-canonical collisions when names normalize to the same key.
- [ ] Integration tests prove duplicate entity slots no longer survive simple `spec.md` and `plan.md` collision cases.
## P1 (Should Fix)
- [ ] The phase addresses duplicate creation during key-file seeding first, matching `../research/research.md:272-289`.
- [ ] The 16-entity cap behavior is preserved after deduplication.
- [ ] The implementation stays packet-local and does not introduce cross-folder entity merging.
## P2 (Advisory)
- [ ] Corpus verification captures the before/after duplicate-slot count for the targeted folders.
- [ ] Any adjacent trigger-cap cleanup remains tracked as separate parser work rather than silently merged into this phase.
