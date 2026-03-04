# Causal edge creation (memory_causal_link)

## Current Reality

Creates a directed relationship edge between two memories in the causal graph. Six relationship types are supported: caused (this memory led to that one), enabled (this memory made that one possible), supersedes (this memory replaces that one), contradicts (these memories disagree), derived_from (this memory was produced from that one) and supports (this memory backs up that one).

Edge strength is a 0-1 float, clamped at both ends. Evidence text is optional but recommended because it explains why the relationship exists. If an edge with the same source, target and relation already exists, the system updates strength and evidence via `INSERT ... ON CONFLICT DO UPDATE` rather than creating a duplicate. That upsert behavior means you can call `memory_causal_link` repeatedly with updated evidence without worrying about edge proliferation.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). Every strength modification is logged to a `weight_history` table recording old strength, new strength, who changed it, when and why. The `created_by` and `last_accessed` fields on each edge track provenance and usage patterns.

A batch insert variant (`insertEdgesBatch()`) handles bulk edge creation during spec document indexing. The `createSpecDocumentChain()` function auto-links spec folder documents in a standard chain: spec causes plan, plan causes tasks, tasks cause implementation-summary. Checklist, decision-record and research documents get support relationships to the primary chain.

## Source Metadata

- Group: Analysis
- Source feature title: Causal edge creation (memory_causal_link)
- Summary match found: No
- Current reality source: feature_catalog.md
