---
title: "Deduplicate Graph Metadata Entities - Decision Record"
status: planned
---
# Decision Record
## ADR-001: Prefer Canonical Packet Paths on Entity Name Collisions
**Context:** `../research/research.md:272-289` showed duplicate entity slots are created in both the key-file and extracted-entity loops, and that simple basename values like `spec.md` can coexist with canonical packet-doc paths for the same entity name.
**Decision:** Replace both direct `entities.set(...)` calls in `mcp_server/lib/graph/graph-metadata-parser.ts:418-446` with a shared helper that prefers canonical packet-doc paths when collisions occur.
**Rationale:** The graph benefits more from keeping a canonical packet reference than from preserving the first inserted basename-only value.
**Consequences:** Entity ordering may shift slightly after canonical replacements, duplicate slot pressure should drop, and any broader cross-folder dedup remains out of scope for this phase.
