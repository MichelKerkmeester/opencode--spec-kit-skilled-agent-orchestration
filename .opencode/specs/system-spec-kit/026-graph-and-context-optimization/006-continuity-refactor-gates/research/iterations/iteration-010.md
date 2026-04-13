---
title: "Iteration 010 — Causal graph retarget with 6 relation types (Feature 6)"
iteration: 10
band: B
timestamp: 2026-04-11T14:20:00Z
worker: claude-opus-4-6
scope: q4_feature6_causal_graph
status: complete
focus: "Retarget the causal edge graph (6 relations, 2-hop BFS) to point at (spec_folder, doc, anchor) tuples instead of memory_ids."
maps_to_questions: [Q4]
---

# Iteration 010 — Feature 6: Causal Graph

## Current implementation

- `lib/storage/causal-edges.ts` — stores directed edges between memory_ids
- 6 relation types: `caused` (1.5x weight), `enabled` (1.1x), `supersedes` (1.5x), `contradicts` (0.8x), `derived_from` (1.0x), `supports` (1.0x)
- Traversal: 2-hop BFS for strength propagation, contradiction detection
- Edges persisted in `causal_edges` table
- Queries: `memory_drift_why` follows causal chains

## The retarget problem

Edges currently connect `memory_id → memory_id`. Under Option C, we want edges to connect anchor-level nodes:
- `(spec_folder, doc, anchor) → (spec_folder, doc, anchor)`

Example: the decision "use Option C" in `decision-record.md::adr-005` supersedes a prior decision in `adr-002`. These are two different anchors in the same doc.

## Two design options

### Option CG-1: Keep memory_id, add anchor fields

Add `source_anchor` and `target_anchor` columns to `causal_edges`. Keep the `source_memory_id` / `target_memory_id` columns but allow them to reference spec_doc rows (not just memory rows).

```sql
ALTER TABLE causal_edges
  ADD COLUMN source_anchor TEXT,
  ADD COLUMN target_anchor TEXT;
```

**Pros**:
- Minimal schema change
- Existing traversal logic works (just queries memory_id)
- Backward compatible with archived memories

**Cons**:
- Two edges can appear to have the same memory_id endpoints but different anchor endpoints — requires UNIQUE constraint update

### Option CG-2: Rebuild around (spec_folder, doc, anchor) tuples

Create a new `anchor_nodes` table that assigns a synthetic `node_id` to each unique (spec_folder, doc, anchor) tuple. Rewrite `causal_edges` to reference `node_id` instead of `memory_id`.

```sql
CREATE TABLE anchor_nodes (
  node_id INTEGER PRIMARY KEY AUTOINCREMENT,
  spec_folder TEXT NOT NULL,
  doc TEXT NOT NULL,
  anchor TEXT NOT NULL,
  UNIQUE(spec_folder, doc, anchor)
);

ALTER TABLE causal_edges
  ADD COLUMN source_node_id INTEGER REFERENCES anchor_nodes(node_id),
  ADD COLUMN target_node_id INTEGER REFERENCES anchor_nodes(node_id);
```

**Pros**:
- Cleaner abstraction
- Anchor-level graph queries are natural
- Memory_id becomes optional (archived memory can map to a pseudo node)

**Cons**:
- More invasive schema change
- Requires migration of existing causal edges

## Recommendation: Option CG-1

Minimal schema change, backward compatible, works for the common case. The UNIQUE constraint is updated to `(source_memory_id, source_anchor, target_memory_id, target_anchor, relation)`.

### Traversal under CG-1

```
bfs_2_hop(start_memory_id, start_anchor):
  Q1 = edges where (source_memory_id=start AND source_anchor=start_anchor)
  For each edge in Q1:
    yield (target_memory_id, target_anchor, relation, strength × weight)
  For each (target_memory_id, target_anchor) from Q1:
    Q2 = edges where (source_memory_id=target AND source_anchor=target_anchor)
    For each edge in Q2:
      yield (second_target, relation_chain_strength)
```

Strength propagation uses the existing multipliers (caused 1.5x, contradicts 0.8x, etc.). Contradiction detection checks for reversed edges with the same pair.

## New causal link extraction

Currently causal links are parsed from a `## causal links` markdown section in memory files. Under Option C, they come from the spec doc's `_memory.causal_links` YAML sub-block (iteration 4 schema):

```yaml
_memory:
  causal_links:
    caused_by: [{ doc: "adr-002", anchor: "decision" }]
    supersedes: [{ doc: "adr-002", anchor: null }]
    ...
```

The extractor at `handlers/causal-links-processor.ts` reads YAML instead of markdown. This is an adaptation, not a rewrite.

## Code changes

| File | Effort | Change |
|---|:---:|---|
| `database/` schema | M | Add `source_anchor`, `target_anchor` columns to `causal_edges` + UNIQUE constraint update |
| `lib/storage/causal-edges.ts` | M | Update insert/query functions to include anchor fields |
| `handlers/causal-graph.ts` | M | Update BFS traversal to filter on anchor fields |
| `handlers/causal-links-processor.ts` | M | Parse YAML `_memory.causal_links` instead of markdown section |
| `save/post-insert.ts` | S | Pass target anchor to causal link extraction |

## Findings

- **F10.1**: Causal graph retargets via **small schema extension** (2 new columns) rather than a rebuild. Option CG-1 wins on minimal-change principle.
- **F10.2**: 2-hop BFS and strength propagation logic are unchanged. Only the query filters update to include anchor fields.
- **F10.3**: Causal link extraction migrates from markdown-section parsing to YAML sub-block parsing. This is structurally simpler (YAML is easier to parse than arbitrary markdown).
- **F10.4**: The causal graph becomes richer under Option C — edges can now target specific anchors, which is a finer-grained map than memory-file-level edges. This is a genuine enhancement.

## Next focus

Iteration 11 — FSRS cognitive decay + memory tiers.
