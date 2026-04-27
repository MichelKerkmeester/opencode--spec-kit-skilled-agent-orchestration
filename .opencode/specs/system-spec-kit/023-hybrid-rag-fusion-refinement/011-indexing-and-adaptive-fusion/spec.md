---
title: "Feature Specification: Indexing and Adaptive Fusion Enablement"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Feature Specification: Indexing and Adaptive Fusion Enablement"
trigger_phrases:
  - "indexing enablement"
  - "adaptive fusion"
  - "cocoindex path drift"
importance_tier: "important"
contextType: "implementation"
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

# Feature Specification: Indexing and Adaptive Fusion Enablement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Review |
| **Created** | 2026-03-31 |
| **Branch** | `system-speckit/024-compact-code-graph` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/023-hybrid-rag-fusion-refinement` |
| **Predecessor** | 010-search-retrieval-quality-fixes |
| **Successor** | 012-memory-save-quality-pipeline |
| **Handoff Criteria** | Validator + phase-parent trio stay current while child packets remain the detailed execution surface |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature Specification: Indexing and Adaptive Fusion Enablement

### Purpose
After repository path changes, indexing subsystems were inconsistent: CocoIndex environment paths were stale, code-graph initialization could fail lazily, and adaptive fusion defaults were not explicitly represented across MCP config surfaces. Lexical score visibility through fusion traces was also incomplete.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Child packet `001-wire-promotion-gate/` remains the authoritative implementation surface for its phase.
- Child packet `002-persist-tuned-thresholds/` remains the authoritative implementation surface for its phase.
- Child packet `003-real-feedback-labels/` remains the authoritative implementation surface for its phase.
- Child packet `004-fix-access-signal-path/` remains the authoritative implementation surface for its phase.
- Maintain the parent-level phase manifest, navigation pointers, and status surface only.

### Out of Scope
- Rewriting child-phase plans, tasks, or checklists from this parent packet.
- Using the parent spec as a changelog or migration-history ledger.
- Treating parent heavy docs as the source of implementation truth.

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/spec.md` | Modify/Create | parent | Lean phase-parent specification and child manifest |
| `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/description.json` | Modify | parent | Refresh save metadata for the migration pass |
| `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/graph-metadata.json` | Modify | parent | Refresh derived child pointers and save timestamp |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-wire-promotion-gate/` | Wire Promotion Gate: Wire PromotionGate to Action | complete |
| 002 | `002-persist-tuned-thresholds/` | Persist Tuned Thresholds: Phase 2 — Persist Tuned Thresholds | complete |
| 003 | `003-real-feedback-labels/` | Real Feedback Labels: Real Feedback Labels for Evaluation | complete |
| 004 | `004-fix-access-signal-path/` | Fix Access Signal Path | complete |
| 005 | `005-e2e-integration-test/` | E2e Integration Test: Phase 5 — End-to-End Integration Test | complete |
| 006 | `006-default-on-boost-rollout/` | Default On Boost Rollout: Default-ON Boost Rollout — Session, Causal & Deep Expansion | complete |
| 007 | `007-external-graph-memory-research/` | External Graph Memory Research | complete |
| 008 | `008-create-sh-phase-parent/` | Create Sh Phase Parent: Append Nested Child Phases in create.sh | complete |
| 009 | `009-graph-retrieval-improvements/` | Graph Retrieval Improvements | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/NNN-phase/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | 001-wire-promotion-gate is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `001-wire-promotion-gate/` |
| 002 | 003 | 002-persist-tuned-thresholds is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `002-persist-tuned-thresholds/` |
| 003 | 004 | 003-real-feedback-labels is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `003-real-feedback-labels/` |
| 004 | 005 | 004-fix-access-signal-path is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `004-fix-access-signal-path/` |
| 005 | 006 | 005-e2e-integration-test is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `005-e2e-integration-test/` |
| 006 | 007 | 006-default-on-boost-rollout is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `006-default-on-boost-rollout/` |
| 007 | 008 | 007-external-graph-memory-research is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `007-external-graph-memory-research/` |
| 008 | 009 | 008-create-sh-phase-parent is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `008-create-sh-phase-parent/` |
| 009 | Complete | Child packet validates and records implementation state. | `validate.sh --strict --no-recursive` on `009-graph-retrieval-improvements/` |
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
