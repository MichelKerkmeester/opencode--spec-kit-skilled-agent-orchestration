---
title: "Implementation Summary: 009 Memory Causal Graph (Post-Hoc Documentation) [system-spec-kit/026-graph-and-context-optimization/009-memory-causal-graph/implementation-summary]"
description: "Outcome record for the post-hoc documentation packet that captures the live causal-graph infrastructure under 026 — the four MCP tools, the causal_edges schema, the six-relation taxonomy, and the Memory / Code Graph / Skill Graph ownership boundary."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
trigger_phrases:
  - "009-memory-causal-graph summary"
  - "memory causal graph closeout"
  - "post-hoc documentation summary"
  - "causal graph documentation summary"
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
status: complete
---
# Implementation Summary: 009 Memory Causal Graph (Post-Hoc Documentation)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-memory-causal-graph |
| **Status** | Complete (post-hoc documentation only) |
| **Created / Completed** | 2026-04-25 |
| **Level** | 2 |
| **Layout** | Root-only (no child phase folders) |
| **Code changes** | None |
| **Schema changes** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:outcome -->
## Outcome

The 026 packet tree now provides a canonical documentation home for the live causal-graph infrastructure. Before this packet, the four MCP causal tools, the `causal_edges` schema, and the six-relation taxonomy were implemented in production code (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`, `mcp_server/handlers/causal-graph.ts`, `mcp_server/tools/causal-tools.ts`, `mcp_server/dist/lib/search/vector-index-schema.js` migrations v8 and v27) and consumed by the trust-display packet at `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/`, but they had no documentation surface inside the 026 spec tree.

After this packet:

- `spec.md` documents the four tools (`memory_causal_link`, `memory_causal_unlink`, `memory_causal_stats`, `memory_drift_why`), the schema (column types, constraints, indexes, weight-history companion table), the six-relation taxonomy with traversal weights, and the ownership boundary against Code Graph and Skill Graph.
- `decision-record.md` captures the three boundary ADRs that determine how Memory, Code Graph, and Skill Graph share the word "graph" without sharing tables.
- `plan.md` records that this is a no-op implementation packet — the system is already live and only documentation was authored.
- `tasks.md` carries a single completed task for the documentation work.

No code, schema, migration, MCP wiring, or test files were modified.
<!-- /ANCHOR:outcome -->

---

<!-- ANCHOR:decisions -->
## Decisions

The boundary decisions captured in `decision-record.md` are summarized here:

- **ADR-1 — Memory owns causal edges exclusively.** The six relation values (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`) live only in the `causal_edges` table. They are never re-emitted by the Code Graph indexer and never persisted to `skill_edges`. The CHECK constraint in vector-index migration v8 enforces this at the schema layer.
- **ADR-2 — Skill Graph uses a separate `skill_edges` table with a different vocabulary.** The skill-graph schema in `mcp_server/dist/lib/skill-graph/skill-graph-db.js` defines its own relation set (`depends_on`, `enhances`, `siblings`, `conflicts_with`, `prerequisite_for`). The schema shape is intentionally similar (typed edge with weight), but the tables are physically distinct and the relation vocabularies do not overlap. Borrowing a design pattern is not the same as sharing storage.
- **ADR-3 — Trust-badge display reads `causal_edges` directly but is display-only.** The display consumer at `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` reads `strength`, `evidence`, `extracted_at`, `last_accessed`, anchors, and the `weight_history` companion table to render `trustBadges` on `MemoryResultEnvelope`. It does not mutate the schema, does not add new relation types, and explicitly defers any Memory↔CodeGraph evidence bridge.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:files-authored -->
## Files Authored

All five files live inside `009-memory-causal-graph/`. No other paths in the repository were touched.

| File | Purpose | Size signal |
|------|---------|-------------|
| `spec.md` | Feature specification: status, problem, scope, live components, schema, relation taxonomy, ownership boundaries, related work, acceptance. | Long-form (the canonical reference for §4-§7). |
| `plan.md` | Plan-of-record explaining why this is a no-op implementation packet, listing the documents authored, the verification approach, and explicit non-goals. | Short. |
| `tasks.md` | Single completed task entry (`T001 [DONE]`) covering the documentation work and listing transcribed sources. | Short. |
| `implementation-summary.md` | This file — outcome, decisions, files authored, verification cross-checks. | Short-medium. |
| `decision-record.md` | ADR-1 / ADR-2 / ADR-3 codifying the Memory / Skill Graph / Code Graph ownership boundary and the trust-display read-only contract. | Medium. |

The packet root is intentionally lean: no `checklist.md`, no `research.md`, no `resource-map.md`. The Level-2 minimum is met for a documentation-only post-hoc packet, in line with the lean shape used by sibling `001-research-and-baseline/`.
<!-- /ANCHOR:files-authored -->

---

<!-- ANCHOR:verification -->
## Verification

The following cross-checks were performed before this packet was considered complete. Each is grounded in a specific source file so future readers can re-run the same check.

| Check | Source | Result |
|-------|--------|--------|
| Four MCP tool names match the dispatch surface | `.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts` (`TOOL_NAMES` set + `handleTool` switch) | Confirmed: `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`. |
| Six relation values match the runtime constants | `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` (`RELATION_TYPES` frozen object) | Confirmed: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`. |
| Traversal weights match the runtime weights table | `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` (`RELATION_WEIGHTS`) | Confirmed: `supersedes=1.5`, `caused=1.3`, `enabled=1.1`, `supports=1.0`, `derived_from=1.0`, `contradicts=0.8`. |
| Schema columns and CHECK clause match migration v8 | `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/vector-index-schema.js` migration `8` | Confirmed: column list, default values, the `relation` CHECK enum, and the unique key `(source_id, target_id, relation, source_anchor, target_anchor)` all match `spec.md` §5. |
| Anchor-aware rebuild preserves the same column shape | `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/vector-index-schema.js` migration `27` | Confirmed: rebuilds with the same `CHECK(relation IN ...)` clause and unique key; `valid_at` / `invalid_at` are conditionally preserved when present, but they are not part of the canonical schema documented here. |
| Skill Graph uses a separate table with a different vocabulary | `.opencode/skill/system-spec-kit/mcp_server/dist/lib/skill-graph/skill-graph-db.js` (`skill_edges` schema) | Confirmed: `edge_type` enum is `('depends_on', 'enhances', 'siblings', 'conflicts_with', 'prerequisite_for')` — zero overlap with the six causal relations. |
| Trust-display packet reads the schema and is display-only | `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/spec.md` §3 ("Out of Scope (HARD RULES)") | Confirmed: prohibits new columns on `causal_edges`, prohibits new relation types, and explicitly defers the Memory↔CodeGraph bridge. |
| Trust-display packet was not modified | `git status` against `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` | Confirmed: no files inside that directory are part of the staged or unstaged delta produced by this packet. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Limitations and Honest Carryover

- **No live `validate.sh --strict` run is recorded here.** This packet is documentation-only and does not own the validation gate. The next memory save flow that runs `generate-context.js` against this folder will refresh `description.json` and `graph-metadata.json`; until that runs, the packet is invisible to memory search by design.
- **The `valid_at` / `invalid_at` columns added by migration v27 are intentionally not documented in `spec.md` §5.** Those columns are temporal-edge support and are conditionally preserved during the v27 rebuild only when present. They are not part of the canonical operator-facing schema and are out of scope for a post-hoc canonical documentation packet. A future packet may document temporal edges separately.
- **Auto-link extraction is mentioned but not deeply documented.** `mcp_server/handlers/causal-links-processor.ts` is referenced in `spec.md` §4 as a non-tool consumer; the heuristics it uses are out of scope for this packet because they do not constitute the operator surface.
<!-- /ANCHOR:limitations -->
