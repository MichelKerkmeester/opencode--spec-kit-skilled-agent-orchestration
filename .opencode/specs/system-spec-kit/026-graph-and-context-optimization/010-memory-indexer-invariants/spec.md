---
title: "Coordination Root: Memory [system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/spec]"
description: "Umbrella phase coordinating two shipped memory-indexer invariant fixes: child 001 prevents cross-file PE UPDATE/REINFORCE decisions and adds fromScan recheck bypass; child 002 enforces index-scope exclusions (z_future, external paths) and stops constitutional-tier pollution by restricting constitutional rows to dedicated folders."
trigger_phrases:
  - "026/010 memory indexer invariants"
  - "memory indexer lineage fix"
  - "constitutional tier pollution fix"
  - "index scope invariants"
  - "indexer correctness"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants"
    last_updated_at: "2026-04-24T15:55:00+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created coord root over two shipped indexer invariant packets"
    next_safe_action: "Monitor indexer telemetry across both invariants"
    blockers: []
    completion_pct: 100
    status: "complete"
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Coordination Root: Memory Indexer Invariants

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-24 |
| **Parent** | `026-graph-and-context-optimization/` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../009-hook-daemon-parity/` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-memory-indexer-lineage-and-concurrency-fix/` | Complete | Feature Specification: Memory Indexer Lineage and Concurrency Fix (E_LINEAGE + candidate_changed + fromScan recheck bypass) |
| 2 | `002-index-scope-and-constitutional-tier-invariants/` | Complete | Feature Specification: Index Scope and Constitutional Tier Invariants (z_future + external path exclusions, constitutional-tier pollution fix) |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The memory-indexer shipped two independent but related regressions during the 026 optimization cycle:

1. Cross-file PE `UPDATE`/`REINFORCE` decisions were selecting sibling spec docs and appending new rows onto the wrong lineage chain, producing `E_LINEAGE` errors. The scan-originated save path also re-ran a transactional candidate recheck after planner-time decisions had already been made, producing `candidate_changed` regressions.
2. The indexer lacked permanent scope exclusions for `z_future/` and external paths, and the constitutional tier was drifting onto ordinary research material. A live DB inspection surfaced 5700 rows at `importance_tier='constitutional'` while only 2 of those came from real `/constitutional/` files — the rest were `z_future` pollution.

Both regressions modify the same indexer runtime (`mcp_server/lib/search/vector-index-mutations.ts`, `handlers/memory-crud-update.ts`, `lib/storage/post-insert-metadata.ts`) and share the same evaluation surface, so they ship as coordinated siblings under this root.

### Purpose

- Record that both fixes ship together as memory-indexer invariants.
- Give operator tooling one discoverable parent for the invariant contract.
- Keep the two implementation packets independently rebase-able while preserving their shared provenance.

---

<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Coordination metadata for both children (`description.json`, `graph-metadata.json`, `spec.md` map).
- Parent/successor cross-references between 001 and 002.
- Shared trigger phrases and tier classification for the umbrella.

### Out of Scope

- Implementation work (lives in the two child packets).
- New indexer surfaces beyond what 001 and 002 already ship.
- Follow-up research packets; future follow-ons should land as new children under this root or as sibling phases.

### Files Likely to be Referenced

| Path | Why |
|------|-----|
| `001-memory-indexer-lineage-and-concurrency-fix/` | First child — lineage and concurrency fix |
| `002-index-scope-and-constitutional-tier-invariants/` | Second child — scope and tier enforcement |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` | Shared runtime touched by both children |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Shared runtime touched by both children |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts` | Shared runtime touched by both children |

---

<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Both children live under this coordination root with consistent path metadata | Each child's `_memory.continuity.packet_pointer`, `description.json.specFolder`, and `graph-metadata.json.spec_folder` reference the new nested path |
| REQ-002 | Both children declare `010-memory-indexer-invariants/` as their parent in spec metadata | Each child's METADATA table carries `Parent`, `Parent Spec`, and appropriate `Predecessor`/`Successor` fields |
| REQ-003 | Graph-metadata preserves the pre-restructure paths as aliases so existing links keep resolving | Coord-root `graph-metadata.json.aliases` includes the two old flat paths (`010-memory-indexer-lineage-and-concurrency-fix`, `011-index-scope-and-constitutional-tier-invariants`) |

### P1 — Recommended

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-004 | Coord-root surfaces provide a PHASE DOCUMENTATION MAP for operator navigation | `spec.md` contains a table linking both children with their status and one-line description |
| REQ-005 | Umbrella trigger phrases cover both children's scope | Coord-root trigger phrases span both lineage/concurrency and scope/tier keywords |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `memory_search` or graph lookup for memory-indexer invariants reaches this coord root and its two children via the shared parent.
- **SC-002**: The two children are no longer top-level `010-*` / `011-*` siblings; they live as `001-*` / `002-*` children of this root.
- **SC-003**: Aliases preserve old flat-path lookups so any prior cross-reference continues to resolve.

### Acceptance Scenarios

1. A future investigator searching for "memory indexer invariants" reaches `010-memory-indexer-invariants/` and can navigate from the coord-root `spec.md` into either child.
2. An external doc that references the old `010-memory-indexer-lineage-and-concurrency-fix/` path resolves via the `aliases` entry in coord-root `graph-metadata.json` to the new nested location.

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| External docs hold stale paths to old `010-*` / `011-*` flat locations | Preserved via the `aliases` array in coord-root `graph-metadata.json`; plus a bulk sed pass at restructure time updated all in-packet references |
| Validator strictness flags SPEC_DOC_INTEGRITY on prose file mentions | Pre-existing pattern across other 026 coord-roots; not a regression from this restructure |

---

<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Both children shipped before this coord-root was created; this is an after-the-fact structural reorganization only.

<!-- /ANCHOR:questions -->
