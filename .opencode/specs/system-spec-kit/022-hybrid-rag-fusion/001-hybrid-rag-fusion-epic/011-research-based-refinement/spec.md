---
title: "Feature Specification: Research-Based Refinement"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Feature Specification: Research-Based Refinement"
trigger_phrases:
  - "research refinement"
  - "d1 d2 d3 d4 d5"
  - "29 recommendations"
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

# Feature Specification: Research-Based Refinement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-03-21 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic` |
| **Predecessor** | `../010-sprint-9-extra-features/spec.md` |
| **Successor** | None (latest live direct phase) |
| **Handoff Criteria** | Validator + phase-parent trio stay current while child packets remain the detailed execution surface |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep research (spec `019-deep-research-rag-improvement`) produced 29 prioritized recommendations from 5 GPT 5.4 agents (1.35M tokens, ~52 web searches). The key finding: the system is more mature than expected — the gap is **calibration and wiring**, not missing code. Flat heuristic constants (k=60, convergence +0.10, graph boost 1.5x, FSRS decay, Stage 2 signal weights) need data-driven calibration. Graph value lies in typed traversal, not community detection. Feedback needs an event ledger before any learned ranking.

### Purpose
Turn the 29 research recommendations into 5 implementable sub-phases, each with concrete requirements, implementation phases, feature flags, and files to change.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Child packet `001-fusion-scoring-intelligence/` remains the authoritative implementation surface for its phase.
- Child packet `002-query-intelligence-reformulation/` remains the authoritative implementation surface for its phase.
- Child packet `003-graph-augmented-retrieval/` remains the authoritative implementation surface for its phase.
- Child packet `004-feedback-quality-learning/` remains the authoritative implementation surface for its phase.
- Maintain the parent-level phase manifest, navigation pointers, and status surface only.

### Out of Scope
- Rewriting child-phase plans, tasks, or checklists from this parent packet.
- Using the parent spec as a changelog or migration-history ledger.
- Treating parent heavy docs as the source of implementation truth.

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/spec.md` | Modify/Create | parent | Lean phase-parent specification and child manifest |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/description.json` | Modify | parent | Refresh save metadata for the migration pass |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/graph-metadata.json` | Modify | parent | Refresh derived child pointers and save timestamp |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-fusion-scoring-intelligence/` | Fusion Scoring Intelligence: Fusion & Scoring Intelligence | draft |
| 002 | `002-query-intelligence-reformulation/` | Query Intelligence Reformulation: Query Intelligence & Reformulation | draft |
| 003 | `003-graph-augmented-retrieval/` | Graph Augmented Retrieval: Graph-Augmented Retrieval | draft |
| 004 | `004-feedback-quality-learning/` | Feedback Quality Learning: Feedback & Quality Learning | draft |
| 005 | `005-retrieval-ux-presentation/` | Retrieval Ux Presentation: Retrieval UX & Result Presentation | draft |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/NNN-phase/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | 001-fusion-scoring-intelligence is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `001-fusion-scoring-intelligence/` |
| 002 | 003 | 002-query-intelligence-reformulation is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `002-query-intelligence-reformulation/` |
| 003 | 004 | 003-graph-augmented-retrieval is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `003-graph-augmented-retrieval/` |
| 004 | 005 | 004-feedback-quality-learning is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `004-feedback-quality-learning/` |
| 005 | Complete | Child packet validates and records implementation state. | `validate.sh --strict --no-recursive` on `005-retrieval-ux-presentation/` |
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
