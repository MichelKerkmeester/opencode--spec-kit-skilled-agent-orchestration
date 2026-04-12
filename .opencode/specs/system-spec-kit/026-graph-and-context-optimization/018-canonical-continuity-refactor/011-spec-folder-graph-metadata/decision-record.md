---
title: "018 / 011 — Graph metadata architectural decisions"
description: "Direct rationale for restoring packet-level graph signals after legacy memory-file removal."
trigger_phrases: ["018 011 decision record", "graph metadata adr", "per spec folder graph metadata decisions"]
importance_tier: "critical"
contextType: "research"
status: "complete"
_memory:
  continuity:
    packet_pointer: "018/011-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded the architectural decision from the graph metadata research"
    next_safe_action: "Use this ADR as the guardrail for implementation"
    key_files: ["decision-record.md", "research.md", "plan.md"]
---
# Decision Record: 018 / 011 — Per-spec-folder graph metadata

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use a dedicated `graph-metadata.json` file per spec folder

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-12 |
| **Deciders** | Codex research pass for Phase 018 / 011 |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 018 moved canonical continuity into git-tracked spec docs plus `_memory.continuity`, but the graph stack still expects packet-level metadata that used to arrive through legacy memory saves. The current runtime still ranks and links through `memory_index`, `causal_edges`, `causal-links-processor.ts`, and `reconsolidation.ts`, yet there is no longer a stable per-folder contract that carries packet relationships, trigger phrases, status, files, and entities.

### Constraints

- The solution must preserve `_memory.continuity` as a thin resume surface, not turn it back into a large packet metadata dump.
- The solution must avoid overloading `description.json`, which is both incomplete across the repo and scoped to folder discovery plus tracking history.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a dedicated `graph-metadata.json` file in each spec-folder root, indexed as one `graph_metadata` row in `memory_index`.

**How it works**: canonical save completion refreshes the file on every save, even when no legacy context markdown is emitted. The file keeps manual packet relationships in one merge-safe section and regenerates derived fields such as trigger phrases, status, key files, entities, and timestamps in another.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dedicated `graph-metadata.json`** | Deterministic, schema-friendly, easy to index, matches packet-level ownership | Adds one new root file contract | 9/10 |
| `graph-metadata.yaml` | Human-readable, root-level, still schema-capable | Adds parser complexity without runtime benefit | 7/10 |
| Extend `_memory.continuity` | No new file, close to canonical docs | Too thin today, spread across docs, wrong place for packet graph state | 4/10 |
| Extend `description.json` | Existing root file, easy to discover | Wrong concern boundary, high churn risk, incomplete repo coverage | 5/10 |

**Why this one**: it restores the missing packet-level graph input with the smallest architectural change. It also reuses existing `memory_index` and `causal_edges` plumbing instead of inventing a new storage system.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Packet dependency and supersession queries get one stable machine-readable source per folder.
- `_memory.continuity` stays compact and `description.json` stays focused on discovery and tracking.

**What it costs**:
- The save path, index discovery, validation, and backfill tooling all need follow-on implementation work. Mitigation: stage rollout as schema, save-path, indexing, then backfill.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Manual relationship edits get overwritten by save refresh | H | Preserve `manual.*` fields and fully regenerate only `derived.*` |
| Validation becomes noisy before old folders are backfilled | M | Roll out presence checks in warning-first mode |
| Graph metadata drifts away from canonical docs | M | Regenerate derived fields on every canonical save |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Packet-level graph inputs are materially missing after Phase 018 |
| 2 | **Beyond Local Maxima?** | PASS | The research compared four storage options and scored them directly |
| 3 | **Sufficient?** | PASS | One deterministic JSON file is smaller than reviving legacy memory-file behavior |
| 4 | **Fits Goal?** | PASS | The design restores graph usefulness without changing the canonical continuity model |
| 5 | **Open Horizons?** | PASS | The schema supports later code-graph enrichment and retroactive backfill |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `generate-context.js` and workflow helpers add a canonical-save metadata refresh step.
- Discovery, indexing, graph-edge processing, and validation gain explicit support for `graph-metadata.json`.

**How to roll back**: remove the new discovery and refresh path, stop generating `graph-metadata.json`, and fall back to current packet-doc-only behavior while reopening the design question. Do not move the graph state into `_memory.continuity` or `description.json` as a shortcut.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
