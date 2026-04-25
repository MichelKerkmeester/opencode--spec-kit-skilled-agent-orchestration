---
title: "Feature Specification: Memory Causal Graph (Post-Hoc Documentation) [system-spec-kit/026-graph-and-context-optimization/009-memory-causal-graph/spec]"
description: "Post-hoc canonical documentation home for the live causal-graph infrastructure under 026 — covers the four MCP tools (memory_causal_link, memory_causal_unlink, memory_causal_stats, memory_drift_why), the causal_edges schema, the six-relation taxonomy, and the ownership boundary between Memory, Code Graph, and Skill Graph. No code changes."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
trigger_phrases:
  - "009-memory-causal-graph"
  - "memory causal graph"
  - "memory causal infrastructure"
  - "causal_edges schema"
  - "memory_causal_link"
  - "memory_causal_unlink"
  - "memory_causal_stats"
  - "memory_drift_why"
  - "causal relation taxonomy"
  - "memory vs code graph vs skill graph ownership"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-memory-causal-graph"
    last_updated_at: "2026-04-25T11:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Post-hoc documentation of live causal-graph infrastructure"
    next_safe_action: "None - documentation only"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Memory Causal Graph (Post-Hoc Documentation)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## Status

Documented as-is on 2026-04-25; no implementation pending. The causal-graph infrastructure is live in production and has been since vector-index migration v8. This packet is a post-hoc documentation home: it records the existing surface area, schema, and ownership boundaries inside the 026 packet tree without proposing any code or schema mutation.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete (post-hoc documentation only) |
| **Created** | 2026-04-25 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Related Work** | `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` (display-only consumer, separate packet) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM STATEMENT

The causal-graph infrastructure shipped to production via vector-index migration v8 (`mcp_server/lib/search/vector-index-schema.ts` migration v8 in the dist build) and is exposed through four MCP tools wired in `mcp_server/tools/causal-tools.ts`. The runtime, schema, traversal, and operator-facing tool surface have all existed and been used in active flows for multiple release cycles, but the 026 packet tree did not contain a single canonical documentation home for that infrastructure.

The trust-display work in `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` reads from the live `causal_edges` schema (`strength`, `evidence`, `extracted_at`, `last_accessed`, anchors) but is explicitly display-only and out-of-scope for documenting the underlying graph. Memory indexer invariants packets (`../005-memory-indexer-invariants/`) reference the graph in passing but focus on indexer correctness, not the causal surface itself.

This packet closes that documentation gap. It is **post-hoc, descriptive, and code-grounded**: every claim cites a source file in `.opencode/skill/system-spec-kit/mcp_server/`.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Scope (In)

- Document the four MCP tools that comprise the causal-graph operator surface.
- Document the `causal_edges` table schema (columns, types, constraints, indexes).
- Document the six-relation taxonomy and its weight multipliers used during traversal.
- Document the ownership boundary between Memory (causal edges), Code Graph (separate domain, no causal edges), and Skill Graph (`skill_edges` table with a different vocabulary).
- Cross-reference the trust-display consumer packet at `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` so readers can find the display layer without confusing it with the underlying graph.

### Scope (Out)

- **No code changes.** Not a single byte of TypeScript, JavaScript, Python, or Shell will be authored, edited, or deleted by this packet.
- **No schema changes.** The `causal_edges` table, the six relation enum values, the `strength` `[0, 1]` clamp, and all existing indexes remain exactly as they are.
- **No new features.** Edge bounds, weight history, decay, anchor support, contradiction detection, and traversal semantics are documented as observed — not extended.
- **No migration work.** The cleanup CLI (`scripts/memory/cleanup-index-scope-violations.ts`) is owned by `../005-memory-indexer-invariants/` and is not part of this packet.
- **No display layer.** Trust badges, `MemoryResultEnvelope` consumers, and freshness UX live in `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` — readers are pointed there rather than served here.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:live-components -->
## 4. LIVE COMPONENTS

The four MCP tools below are dispatched from `mcp_server/tools/causal-tools.ts` and registered as part of the canonical Spec Kit Memory MCP surface:

| Tool Name | Purpose | Source File |
|-----------|---------|-------------|
| `memory_causal_link` | Creates a causal edge between two memories with relation, strength, and optional evidence. Upserts on `(source_id, target_id, relation, source_anchor, target_anchor)` and logs strength changes to `weight_history`. | `mcp_server/handlers/causal-graph.ts` (`handleMemoryCausalLink`); insertion via `mcp_server/lib/storage/causal-edges.ts` (`insertEdge`) |
| `memory_causal_unlink` | Deletes a causal edge by `id`. Returns `{ deleted: boolean }`. | `mcp_server/handlers/causal-graph.ts` (`handleMemoryCausalUnlink`); deletion via `mcp_server/lib/storage/causal-edges.ts` (`deleteEdge`) |
| `memory_causal_stats` | Reports graph coverage: total edges, edges by relation, average strength, unique sources/targets, link coverage percent vs. memory_index, orphaned-edge count, health badge, and a 60% coverage target check. | `mcp_server/handlers/causal-graph.ts` (`handleMemoryCausalStats`); stats computed by `mcp_server/lib/storage/causal-edges.ts` (`getGraphStats`, `findOrphanedEdges`) |
| `memory_drift_why` | BFS-style chain traversal from a root memory ID with configurable max depth (clamped server-side to `[1, 10]`), direction (`outgoing` / `incoming` / `both`), and optional relation-set filter. Returns flattened edge buckets per relation plus aggregated totals. | `mcp_server/handlers/causal-graph.ts` (`handleMemoryDriftWhy`); traversal via `mcp_server/lib/storage/causal-edges.ts` (`getCausalChain`) |

Supporting modules live alongside the four tools and are owned by the same package:

- `mcp_server/lib/storage/causal-edges.ts` — schema-aware CRUD, transactional upsert, weight history, edge bounds, staleness queries, spec-document chain helper (`createSpecDocumentChain`).
- `mcp_server/lib/search/causal-boost.ts` — search-time freshness factor used by retrieval, **not** part of the operator surface.
- `mcp_server/handlers/causal-graph.ts` — shared response envelope and tree-to-flat conversion for the `memory_drift_why` response.
- `mcp_server/handlers/causal-links-processor.ts` — auto-link extraction during save flows (referenced from save handlers, not directly tool-invoked).

<!-- /ANCHOR:live-components -->

---

<!-- ANCHOR:schema -->
## 5. SCHEMA

The canonical schema is created by vector-index migration v8 and rebuilt anchor-aware in migration v27. Both definitions match the active runtime shape used by `mcp_server/lib/storage/causal-edges.ts`:

```sql
CREATE TABLE IF NOT EXISTS causal_edges (
  id            INTEGER PRIMARY KEY,
  source_id     TEXT NOT NULL,
  target_id     TEXT NOT NULL,
  source_anchor TEXT,
  target_anchor TEXT,
  relation      TEXT NOT NULL CHECK(relation IN (
                  'caused', 'enabled', 'supersedes',
                  'contradicts', 'derived_from', 'supports')),
  strength      REAL DEFAULT 1.0
                  CHECK(strength >= 0.0 AND strength <= 1.0),
  evidence      TEXT,
  extracted_at  TEXT DEFAULT (datetime('now')),
  created_by    TEXT DEFAULT 'manual',
  last_accessed TEXT,
  UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)
);
```

| Column | Type | Meaning |
|--------|------|---------|
| `id` | INTEGER PRIMARY KEY | Surrogate edge identifier; consumed by `memory_causal_unlink` and surfaced in `memory_drift_why` flattened edges as `edgeId`. |
| `source_id` | TEXT NOT NULL | Memory ID at the tail of the edge (typically the cause / origin / superseded memory). Stored as TEXT so synthetic IDs and string-form `memory_index.id` values both fit. |
| `target_id` | TEXT NOT NULL | Memory ID at the head of the edge (typically the effect / derived / superseder memory). |
| `source_anchor` | TEXT NULL | Optional sub-document anchor inside the source memory (e.g. an `<!-- ANCHOR:foo -->` segment). Participates in the unique key so the same memory pair can carry multiple anchored edges. |
| `target_anchor` | TEXT NULL | Optional sub-document anchor inside the target memory. |
| `relation` | TEXT NOT NULL | One of the six relation values listed in §6. The `CHECK` constraint enforces the closed set at the schema layer. |
| `strength` | REAL DEFAULT 1.0 | Confidence / weight in `[0.0, 1.0]`. Auto-extracted edges (`created_by = 'auto'`) are runtime-capped at `MAX_AUTO_STRENGTH = 0.5`; manual edges retain the caller-supplied value. |
| `evidence` | TEXT NULL | Free-form provenance / justification string captured at link creation. |
| `extracted_at` | TEXT (default `datetime('now')`) | ISO timestamp the edge was first inserted. Set once at insert; never rewritten on upsert. |
| `created_by` | TEXT DEFAULT `'manual'` | Provenance flag; the runtime distinguishes `'manual'` (operator-driven) from `'auto'` (auto-link extractor) and applies different bounds. |
| `last_accessed` | TEXT NULL | Timestamp updated by `touchEdgeAccess` whenever traversal returns this edge; powers staleness / decay queries. |

**Indexes** (created in migration v8 and reaffirmed defensively at module init):

- `idx_causal_source ON causal_edges(source_id)`
- `idx_causal_target ON causal_edges(target_id)`
- `idx_causal_relation ON causal_edges(relation)`
- `idx_causal_strength ON causal_edges(strength DESC)`
- `idx_causal_edges_source_anchor ON causal_edges(source_anchor)`
- `idx_causal_edges_target_anchor ON causal_edges(target_anchor)`

**Companion table** `weight_history` is updated by `logWeightChange` whenever `strength` mutates (insert-upsert with a different value, explicit `updateEdge`, or `rollbackWeights`). The trust-display consumer at `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` derives its `weightHistoryChanged` badge from this table; the table is not modified by this packet.

<!-- /ANCHOR:schema -->

---

<!-- ANCHOR:relation-taxonomy -->
## 6. RELATION TAXONOMY

The six relation values are enforced by the schema `CHECK` constraint and surfaced as a frozen const map in `mcp_server/lib/storage/causal-edges.ts` (`RELATION_TYPES`). Each carries a traversal weight multiplier that amplifies or dampens propagated strength when `getCausalChain` walks the graph:

| Relation | Meaning | Traversal Weight |
|----------|---------|------------------|
| `supersedes` | The target memory replaces the source memory. Strongest signal — newer information overrides older information. | 1.5 |
| `caused` | The source memory directly caused the target memory (event / decision / change of state). | 1.3 |
| `enabled` | The source memory enabled (but did not directly cause) the target memory. Weaker than `caused`. | 1.1 |
| `supports` | The source memory supports / corroborates the target memory without claiming causality. | 1.0 |
| `derived_from` | The target memory is derived / refined from the source memory. Neutral. | 1.0 |
| `contradicts` | The source memory contradicts the target memory. Dampened — conflicting signals lower aggregated confidence. | 0.8 |

Weights are not part of the schema; they live in `RELATION_WEIGHTS` inside `causal-edges.ts` and are applied per-hop during BFS traversal in `getCausalChain` (cumulative path strength = `node.strength * edge.strength * weight`, then clamped back into `[0, 1]`).

The runtime additionally calls `detectContradictions` on insert when temporal-edges support is enabled (`mcp_server/lib/graph/contradiction-detection.ts`), but no relation value is added by that path — it surfaces conflicts using the existing `contradicts` relation.

<!-- /ANCHOR:relation-taxonomy -->

---

<!-- ANCHOR:ownership -->
## 7. OWNERSHIP BOUNDARIES

Three graph-shaped subsystems coexist inside the MCP server. They share the word "graph" and a borrowed schema shape, but their tables, vocabularies, and tools are deliberately separate. Conflating them is the most common point of confusion when a contributor first reads the codebase.

| Domain | Owns | Does NOT Own |
|--------|------|--------------|
| **Memory (this packet)** | `causal_edges` table; the six causal relations (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`); `memory_causal_link` / `memory_causal_unlink` / `memory_causal_stats` / `memory_drift_why` MCP tools; `weight_history` lineage table. | Code-graph nodes/edges; skill-graph nodes/edges; trust-badge display surfaces. |
| **Code Graph** | Structural code parse output (functions, files, modules, AST-derived relationships) maintained by `mcp_server/code-graph/` and accessed via `code_graph_*` MCP tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`). | The `causal_edges` table; any of the six causal relations. The Code Graph is a fundamentally different domain — it indexes code structure, not memory lineage. |
| **Skill Graph** | `skill_edges` table (defined in `mcp_server/lib/skill-graph/skill-graph-db.ts` dist build) with a separate relation vocabulary: `depends_on`, `enhances`, `siblings`, `conflicts_with`, `prerequisite_for`. Surfaced via `skill_graph_*` MCP tools. | The `causal_edges` table. The schema shape is intentionally similar (source / target / typed edge / weight) but the tables are physically distinct, the relation vocabularies do not overlap, and a skill edge is never persisted to `causal_edges` (and vice versa). |

**Key invariant:** the six causal-relation strings live exclusively under `causal_edges`. They are never reused as `skill_edges.edge_type` values, never emitted by the code-graph indexer, and never re-introduced by the trust-display consumer. Any future cross-domain bridge (for example, the Memory↔CodeGraph evidence bridge that is explicitly deferred in `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/`) would need its own table and its own relation vocabulary.

<!-- /ANCHOR:ownership -->

---

<!-- ANCHOR:related-work -->
## 8. RELATED WORK

- `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` — Display-only consumer of `causal_edges`. Reads `strength`, `extracted_at`, `last_accessed`, anchors, and `weight_history` to render `trustBadges` on `MemoryResultEnvelope`. Explicitly forbids schema mutation, new relation types, or storage of code/process/tool facts. **Not modified by this packet.**
- `../005-memory-indexer-invariants/` — Memory indexer correctness packet. References causal-edge cleanup as part of `cleanup-index-scope-violations` but owns the indexer surface, not the causal-graph surface. Schema and tool semantics documented here are independent of that packet's invariants.
- `../001-research-and-baseline/` — Root research baseline for 026 with the trust-axis separation ADR (ADR on measurement honesty / trust axes). Provides upstream rationale for keeping causal evidence inside Memory rather than synthesizing it from search ranking.
- `mcp_server/lib/search/causal-boost.ts` — Retrieval-time consumer of `causal_edges`. Not user-facing and not part of the operator tool surface; documented here only so future readers do not assume it is a separate graph.

<!-- /ANCHOR:related-work -->

---

## 9. ACCEPTANCE

This packet is documentation-only. Acceptance is satisfied when:

- All five canonical Level-2 docs (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `decision-record.md`) exist in `009-memory-causal-graph/`.
- Every claim in this spec is grounded in a source path under `.opencode/skill/system-spec-kit/mcp_server/`.
- The trust-display packet at `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` is referenced but not modified.
- No code, schema, or migration files are touched.
