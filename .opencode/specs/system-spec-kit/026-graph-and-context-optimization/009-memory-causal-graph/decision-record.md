---
title: "Decision Record: Memory Causal Graph Ownership Boundaries [system-spec-kit/026-graph-and-context-optimization/009-memory-causal-graph/decision-record]"
description: "ADRs codifying the ownership boundary between Memory (causal_edges with the six relation types), Code Graph (separate domain, no causal edges), and Skill Graph (skill_edges with a different vocabulary), plus the read-only contract for the trust-badge display consumer."
trigger_phrases:
  - "009-memory-causal-graph adr"
  - "memory causal graph decision record"
  - "memory vs code graph ownership"
  - "memory vs skill graph ownership"
  - "causal_edges ownership"
  - "skill_edges separate table"
  - "trust display read only contract"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
# Decision Record: Memory Causal Graph Ownership Boundaries

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## Status

This decision record is **descriptive, not prescriptive**. The boundaries documented below already exist in code and have been enforced at the schema and runtime layer for multiple release cycles. The ADRs make those existing boundaries explicit so that future contributors can reason about them without reverse-engineering the source.

---

<!-- ANCHOR:adr-1 -->
## ADR-1: Memory owns causal edges exclusively

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (descriptive — already enforced in production) |
| **Date** | 2026-04-25 (recorded; the boundary itself predates this packet) |
| **Source of truth** | `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` (`RELATION_TYPES`); `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/vector-index-schema.js` (migration v8 + v27 anchor-aware rebuild) |

### Context

Three graph-shaped subsystems coexist inside the MCP server: Memory's causal graph, the Code Graph (structural code parse), and the Skill Graph (skill dependency / capability graph). They share the word "graph" but serve fundamentally different purposes. Without an explicit ownership rule, future contributors are tempted to either (a) reuse causal-edge relation strings inside Code Graph or Skill Graph payloads, or (b) extend `causal_edges` with code-fact / skill-fact rows. Both moves blur the schema and make retrieval, traversal, and reasoning ambiguous.

### Decision

**Memory owns the `causal_edges` table and the six relation types — `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports` — exclusively.**

The Code Graph does NOT store causal edges. Its domain is structural: functions, files, modules, AST-derived relationships. It exposes its own MCP tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`) backed by its own storage layer under `mcp_server/code-graph/`. None of the six causal relations are valid output values for the Code Graph indexer.

The schema layer enforces this boundary. The `relation TEXT NOT NULL CHECK(relation IN ('caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'))` constraint in vector-index migration v8 (and the v27 anchor-aware rebuild) means SQLite itself rejects any attempt to insert a non-causal relation string into `causal_edges`. The same is true in reverse — any other table using one of those six strings would have to do so in a different column on a different table.

### Consequences

- **Retrieval and traversal stay unambiguous.** A search-time consumer asking for `supersedes` edges only ever queries `causal_edges`; it never has to check whether a code-graph or skill-graph row might also carry that relation.
- **`memory_drift_why` is the canonical traversal entry point.** Its BFS walk over `causal_edges` is the only path that propagates the six relations across memories.
- **Cross-domain bridges require new tables.** If Memory ever needs a "this memory references this code symbol" link (the deferred Memory↔CodeGraph evidence bridge mentioned in `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/`), it gets its own table and its own relation vocabulary. It does not extend `causal_edges`.

<!-- /ANCHOR:adr-1 -->

---

<!-- ANCHOR:adr-2 -->
## ADR-2: Skill Graph uses a separate `skill_edges` table with a different relation vocabulary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (descriptive — already enforced in production) |
| **Date** | 2026-04-25 (recorded; the boundary itself predates this packet) |
| **Source of truth** | `.opencode/skill/system-spec-kit/mcp_server/dist/lib/skill-graph/skill-graph-db.js` (`SCHEMA_SQL` defining `skill_edges`) |

### Context

The Skill Graph indexes skills (CLI, MCP, sk-code, sk-deep, sk-util, system) and their relationships. Its access pattern looks superficially identical to Memory's causal graph: source / target / typed edge / weight. The temptation is to share the `causal_edges` table and reuse the existing relation taxonomy. That temptation must be resisted because the two domains describe different things at different time scales: causal edges are emergent lineage between memories, skill edges are static / curated relationships between skills.

### Decision

**The Skill Graph uses its own `skill_edges` table with a separate relation vocabulary. Skill edges are never persisted to `causal_edges`, and causal relations are never written to `skill_edges`.**

The `skill_edges` schema (in the dist build) is:

```sql
CREATE TABLE IF NOT EXISTS skill_edges (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id  TEXT NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
  target_id  TEXT NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
  edge_type  TEXT NOT NULL CHECK(edge_type IN (
               'depends_on', 'enhances', 'siblings',
               'conflicts_with', 'prerequisite_for')),
  weight     REAL NOT NULL CHECK(weight >= 0.0 AND weight <= 1.0),
  context    TEXT NOT NULL,
  UNIQUE(source_id, target_id, edge_type),
  CHECK(source_id != target_id)
);
```

Two properties matter:

1. **The relation vocabulary does not overlap with causal relations.** None of `depends_on`, `enhances`, `siblings`, `conflicts_with`, `prerequisite_for` appears in the causal taxonomy, and none of `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports` appears as a valid `edge_type`. Each table's `CHECK` constraint independently rejects the other domain's strings.
2. **The schema shape is intentionally similar.** Source / target / typed edge / weight is a useful generic edge pattern, and Skill Graph borrowed it from the causal-edge design. Borrowing a design pattern is not the same as sharing storage. The tables are physically distinct, owned by different modules (`mcp_server/lib/storage/causal-edges.ts` vs. `mcp_server/lib/skill-graph/skill-graph-db.ts`), and surfaced through different MCP tool families (`memory_*` vs. `skill_graph_*`).

### Consequences

- **Skill graph queries cannot accidentally pull memory causal edges.** A `skill_graph_query` always hits `skill_edges`; a `memory_drift_why` always hits `causal_edges`.
- **Schema migrations are independent.** Migrating `causal_edges` (adding a column, tightening a constraint, rebuilding for anchors) does not touch `skill_edges`, and vice versa. The trust-display packet reads only `causal_edges` and is therefore insulated from skill-graph evolution.
- **A future cross-graph bridge is a deliberate design step.** If a query ever needs to combine skill-edge structure with memory-edge lineage (for example, "skills used by memories that supersede this one"), it would join the two tables explicitly at query time, not by collapsing them into one.

<!-- /ANCHOR:adr-2 -->

---

<!-- ANCHOR:adr-3 -->
## ADR-3: Trust-badge display reads `causal_edges` directly but is display-only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (descriptive — already enforced by the consumer packet) |
| **Date** | 2026-04-25 (recorded; the contract is documented in the consumer packet) |
| **Source of truth** | `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/spec.md` §3 ("Out of Scope (HARD RULES)") |

### Context

The trust-display work surfaces freshness, confidence, orphan, and weight-history badges on `MemoryResultEnvelope`. It has direct read access to `causal_edges` columns (`strength`, `evidence`, `extracted_at`, `last_accessed`, anchors) and the `weight_history` companion table. Without an explicit contract, a future change to the display layer might be tempted to add a column, define a new relation type, or persist a code-fact / process-fact / tool-fact into `causal_edges` to drive a new badge. That would silently break ADR-1 and ADR-2.

### Decision

**The trust-display consumer at `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` is permitted to read `causal_edges` columns directly but is forbidden from mutating the schema, adding new relation types, or storing non-memory facts in `causal_edges`. Display layer remains display-only.**

The consumer packet's `spec.md` §3 explicitly states (verbatim, as of 2026-04-25):

> **Out of Scope (HARD RULES per pt-02 §12 RISK-06)**
> - New columns on `causal_edges` table
> - New relation types (the 6: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports` — unchanged)
> - Storage of code/process/tool facts in Memory
> - Memory↔CodeGraph evidence bridge (deferred per pt-02 §15)
> - Modifying causal-boost decay logic

This ADR codifies that those out-of-scope items are not just deferred for one consumer packet — they are a permanent architectural contract between Memory's causal graph and any display layer reading from it.

### Consequences

- **The `causal_edges` table can evolve safely.** Memory can add columns, tighten constraints, or rebuild the table (as migration v27 already does for anchor support) without coordinating with display-layer release cycles.
- **The display layer cannot leak storage decisions into the schema.** A new badge that needs more data must either derive it from existing columns or motivate a separate, explicitly named storage surface — never an opaque extension of `causal_edges`.
- **Memory↔CodeGraph evidence is a future, separate piece of work.** Any "this memory cites this code path" affordance lands as its own table on its own packet, not as a sneaky extra column on `causal_edges`.

<!-- /ANCHOR:adr-3 -->

---

## Cross-References

- `spec.md` (this packet) — full documentation surface for the four MCP tools, schema, and relation taxonomy.
- `implementation-summary.md` (this packet) — outcome and verification cross-checks.
- `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` — display-only consumer governed by ADR-3.
- `../005-memory-indexer-invariants/` — adjacent indexer-correctness packet; references causal edges via cleanup CLI but does not own the causal-graph surface.
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` — runtime source of truth.
- `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/vector-index-schema.js` (migrations v8 + v27) — schema source of truth.
- `.opencode/skill/system-spec-kit/mcp_server/dist/lib/skill-graph/skill-graph-db.js` — `skill_edges` source of truth for ADR-2.
