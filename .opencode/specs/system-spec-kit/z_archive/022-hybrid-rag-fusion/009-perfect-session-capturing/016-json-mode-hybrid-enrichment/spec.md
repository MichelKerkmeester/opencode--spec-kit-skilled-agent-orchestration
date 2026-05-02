---
title: "Feature Specification: 016-json-mode-hybrid-enrichment"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Feature Specification: 016-json-mode-hybrid-enrichment"
trigger_phrases:
  - "016 json mode hybrid enrichment"
  - "json mode hybrid enrichment container"
  - "phase 016 packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment"
    last_updated_at: "2026-04-29T11:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Backfill _memory.continuity per Tier 4 sk-doc template alignment"
    next_safe_action: "Refresh on next packet edit"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase manifest: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: 016-json-mode-hybrid-enrichment

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-03-20 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing` |
| **Predecessor** | [015-runtime-contract-and-indexability](../015-runtime-contract-and-indexability/spec.md) |
| **Successor** | [017-json-primary-deprecation](../017-json-primary-deprecation/spec.md) |
| **Handoff Criteria** | Validator + phase-parent trio stay current while child packets remain the detailed execution surface |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This packet had drifted into a historical phase container that no longer matched active system-spec-kit template rules. The top-level docs lacked template markers, anchors, and required section structure, which prevented recursive strict validation even though the child phases capture real implementation work.

### Purpose
Provide a validator-compliant phase container for `016-json-mode-hybrid-enrichment` that truthfully records the four completed child phases, the shared research foundation, and the remaining follow-on tasks still keeping the container open.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Child packet `001-initial-enrichment/` remains the authoritative implementation surface for its phase.
- Child packet `002-scoring-and-filter/` remains the authoritative implementation surface for its phase.
- Child packet `003-field-integrity-and-schema/` remains the authoritative implementation surface for its phase.
- Child packet `004-indexing-and-coherence/` remains the authoritative implementation surface for its phase.
- Maintain the parent-level phase manifest, navigation pointers, and status surface only.

### Out of Scope
- Rewriting child-phase plans, tasks, or checklists from this parent packet.
- Using the parent spec as a changelog or migration-history ledger.
- Treating parent heavy docs as the source of implementation truth.

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/spec.md` | Modify/Create | parent | Lean phase-parent specification and child manifest |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/description.json` | Modify | parent | Refresh save metadata for the migration pass |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/graph-metadata.json` | Modify | parent | Refresh derived child pointers and save timestamp |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-initial-enrichment/` | Initial Enrichment: JSON Mode Hybrid Enrichment (Phase 1B) | complete |
| 002 | `002-scoring-and-filter/` | Scoring And Filter: Scoring and Filter — Quality Scorer Recalibration and Contamination Filter Expansion | complete |
| 003 | `003-field-integrity-and-schema/` | Field Integrity And Schema: Field Integrity and Schema Validation | complete |
| 004 | `004-indexing-and-coherence/` | Indexing And Coherence: Indexing & Coherence | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/NNN-phase/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | 001-initial-enrichment is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `001-initial-enrichment/` |
| 002 | 003 | 002-scoring-and-filter is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `002-scoring-and-filter/` |
| 003 | 004 | 003-field-integrity-and-schema is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `003-field-integrity-and-schema/` |
| 004 | Complete | Child packet validates and records implementation state. | `validate.sh --strict --no-recursive` on `004-indexing-and-coherence/` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should any child packet status in the phase map be reclassified beyond the implementation-summary heuristic?
- Does this parent packet need additional navigation references outside the lean trio for future resume flows?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase `spec.md`, `plan.md`, and `tasks.md`.
- **Parent packet metadata**: See `description.json` and `graph-metadata.json` for save lineage and active-child pointers.
