---
title: "Implementation Plan: Memory Causal Graph (No-Op Documentation Packet) [system-spec-kit/026-graph-and-context-optimization/009-memory-causal-graph/plan]"
description: "Plan-of-record for the post-hoc documentation packet that captures the live causal-graph infrastructure. No implementation steps because the system is already in production; this packet only authors documentation and verifies its grounding against source code."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
trigger_phrases:
  - "009-memory-causal-graph plan"
  - "memory causal graph plan"
  - "post-hoc documentation plan"
  - "causal graph documentation plan"
importance_tier: "important"
contextType: "planning"
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
# Implementation Plan: Memory Causal Graph (No-Op Documentation Packet)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This packet is a **no-op implementation plan**. The causal-graph infrastructure it documents is already live: the schema was added by vector-index migration v8 (and rebuilt anchor-aware in migration v27), the storage module at `mcp_server/lib/storage/causal-edges.ts` is in active use, the four MCP tools (`memory_causal_link`, `memory_causal_unlink`, `memory_causal_stats`, `memory_drift_why`) are dispatched from `mcp_server/tools/causal-tools.ts`, and the trust-display consumer at `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` is already reading from the schema. There is therefore no code to plan, no schema migration to design, and no rollout to sequence.

What this packet does plan:

1. **Author five canonical Level-2 docs** inside `009-memory-causal-graph/`: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `decision-record.md`.
2. **Ground every documented claim in source code** by citing files inside `.opencode/skill/system-spec-kit/mcp_server/`.
3. **Cross-reference the trust-display consumer packet** at `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` so future readers can find display-layer work without confusing it with the underlying graph.
4. **Verify** that the documents accurately describe the live tools, schema, relation taxonomy, and ownership boundary against the current state of the source tree.

### Documents created by this packet

| File | Purpose |
|------|---------|
| `spec.md` | Feature specification documenting the four tools, schema, relation taxonomy, ownership boundaries, and related work. |
| `plan.md` | This file — explains why the plan is a no-op and what was authored. |
| `tasks.md` | Single completed task entry covering the documentation work. |
| `implementation-summary.md` | Outcome, decisions, files authored, verification cross-checks. |
| `decision-record.md` | ADRs codifying the ownership boundaries between Memory, Code Graph, and Skill Graph. |
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:steps -->
## 2. STEPS

| Step | Description | Status |
|------|-------------|--------|
| S001 | Read live source code under `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`, `mcp_server/handlers/causal-graph.ts`, `mcp_server/tools/causal-tools.ts`, and the canonical schema in `mcp_server/dist/lib/search/vector-index-schema.js` (migrations v8 and v27). Transcribe the schema, six relation values, traversal weights, and tool surface into this packet's `spec.md` and `decision-record.md`. Cite each source path so future contributors can re-verify against the same files. | Complete |

That single step is the entire implementation. There are no parallelizable sub-steps and no dependencies on other packets.
<!-- /ANCHOR:steps -->

---

<!-- ANCHOR:verification -->
## 3. VERIFICATION

Verification is performed by inspection rather than by execution, because no code or schema is changed.

| Check | How |
|-------|-----|
| The four MCP tools exist and dispatch from the canonical surface | Read `.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts` (`TOOL_NAMES` set + `handleTool` switch) and confirm all four names match `spec.md` §4. |
| The six relations and the unique key shape match the runtime constants | Read `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` (`RELATION_TYPES` frozen object + the upsert `UNIQUE` predicate inside `insertEdge`) and confirm both match `spec.md` §5 and §6. |
| The schema columns and the `CHECK(relation IN ...)` constraint match the migration | Read `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/vector-index-schema.js` migration v8 (and the v27 anchor-aware rebuild) and confirm the column list and CHECK clause match `spec.md` §5. |
| The Memory↔Skill Graph boundary holds at the schema layer | Read `.opencode/skill/system-spec-kit/mcp_server/dist/lib/skill-graph/skill-graph-db.js` and confirm `skill_edges` is a separate table with a different `edge_type` enum (`depends_on`, `enhances`, `siblings`, `conflicts_with`, `prerequisite_for`) — none of the six causal relations appears in that vocabulary. |
| The trust-display packet remains untouched | Run `git status` on `../012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` and confirm no files inside that directory are modified by this packet. |
| The 026 root description / graph-metadata pick up this new child | After `generate-context.js` is run on `009-memory-causal-graph/` (handled by the next memory save, not this packet), the parent `026-graph-and-context-optimization/description.json` and `graph-metadata.json` should list `009-memory-causal-graph` as a child packet. This is observed-only verification, not work performed here. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

To prevent scope creep, this plan explicitly declines:

- Authoring a `checklist.md` (Level 2 minimum is satisfied without it for documentation-only packets and the existing 026 sibling `001-research-and-baseline/` follows the same lean shape).
- Authoring a `research.md` (no research happened — the work is read-only transcription).
- Running `validate.sh --strict` mutations or any `generate-context.js` invocation. Those are owned by the surrounding memory-save flow, not by this packet.
- Producing diagrams, ADR alternatives matrices, or risk tables beyond the minimum required to record ownership boundaries.
<!-- /ANCHOR:non-goals -->
