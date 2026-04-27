---
title: "Feature Specification: manual-testing-per-playbook"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Feature Specification: manual-testing-per-playbook"
trigger_phrases:
  - "manual testing"
  - "testing playbook"
  - "phase parent"
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

# Feature Specification: manual-testing-per-playbook

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress — wrapper truth-sync active; historical execution evidence preserved; traceability remediation still open |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/022-hybrid-rag-fusion` |
| **Predecessor** | ../014-agents-md-alignment/spec.md |
| **Successor** | ../016-rewrite-memory-mcp-readme/spec.md |
| **Handoff Criteria** | Validator + phase-parent trio stay current while child packets remain the detailed execution surface |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature Specification: manual-testing-per-playbook

### Purpose
The live manual-testing tree now contains **290** scenario files across **21** numbered categories, but this wrapper packet still mixes older `231 scenario files / 272 exact IDs / 19 categories` language with current phase folders `021` and `022` plus a retained duplicate `020-feature-flag-reference-audit` wrapper. That makes the root packet materially stale and self-contradictory for release-control use.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Child packet `001-retrieval/` remains the authoritative implementation surface for its phase.
- Child packet `002-mutation/` remains the authoritative implementation surface for its phase.
- Child packet `003-discovery/` remains the authoritative implementation surface for its phase.
- Child packet `004-maintenance/` remains the authoritative implementation surface for its phase.
- Maintain the parent-level phase manifest, navigation pointers, and status surface only.

### Out of Scope
- Rewriting child-phase plans, tasks, or checklists from this parent packet.
- Using the parent spec as a changelog or migration-history ledger.
- Treating parent heavy docs as the source of implementation truth.

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/spec.md` | Modify/Create | parent | Lean phase-parent specification and child manifest |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/description.json` | Modify | parent | Refresh save metadata for the migration pass |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/graph-metadata.json` | Modify | parent | Refresh derived child pointers and save timestamp |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-retrieval/` | Retrieval: manual-testing-per-playbook retrieval phase | complete |
| 002 | `002-mutation/` | Mutation: manual-testing-per-playbook mutation phase | complete |
| 003 | `003-discovery/` | Discovery: manual-testing-per-playbook discovery phase | complete |
| 004 | `004-maintenance/` | Maintenance: manual-testing-per-playbook maintenance phase | complete |
| 005 | `005-lifecycle/` | Lifecycle: manual-testing-per-playbook lifecycle phase | complete |
| 006 | `006-analysis/` | Analysis: manual-testing-per-playbook analysis phase | complete |
| 007 | `007-evaluation/` | Evaluation: manual-testing-per-playbook evaluation phase | complete |
| 008 | `008-bug-fixes-and-data-integrity/` | Bug Fixes And Data Integrity: Manual Testing — Bug Fixes and Data Integrity | complete |
| 009 | `009-evaluation-and-measurement/` | Evaluation And Measurement: Manual Testing — Evaluation and Measurement | complete |
| 010 | `010-graph-signal-activation/` | Graph Signal Activation: graph-signal-activation | complete |
| 011 | `011-scoring-and-calibration/` | Scoring And Calibration: scoring-and-calibration manual testing | complete |
| 012 | `012-query-intelligence/` | Query Intelligence: query-intelligence manual testing | complete |
| 013 | `013-memory-quality-and-indexing/` | Memory Quality And Indexing: manual-testing-per-playbook memory quality and indexing phase | complete |
| 014 | `014-pipeline-architecture/` | Pipeline Architecture: Manual Testing — Pipeline Architecture (Phase 014) | complete |
| 015 | `015-retrieval-enhancements/` | Retrieval Enhancements: Manual Testing — Retrieval Enhancements (Phase 015) | complete |
| 016 | `016-tooling-and-scripts/` | Tooling And Scripts: 016-Tooling-and-Scripts Manual Testing | complete |
| 017 | `017-governance/` | Governance: manual-testing-per-playbook governance phase | complete |
| 018 | `018-ux-hooks/` | Ux Hooks: manual-testing-per-playbook ux-hooks phase | complete |
| 019 | `019-feature-flag-reference/` | Feature Flag Reference: manual-testing-per-playbook feature-flag-reference phase | complete |
| 020 | `020-feature-flag-reference-audit/` | Feature Flag Reference Audit: manual-testing-per-playbook feature-flag-reference audit phase | complete |
| 021 | `021-remediation-revalidation/` | Remediation Revalidation: manual-testing-per-playbook remediation-revalidation phase | complete |
| 022 | `022-implement-and-remove-deprecated-features/` | Implement And Remove Deprecated Features: manual-testing-per-playbook implement-and-remove-deprecated-features phase | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/NNN-phase/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | 001-retrieval is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `001-retrieval/` |
| 002 | 003 | 002-mutation is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `002-mutation/` |
| 003 | 004 | 003-discovery is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `003-discovery/` |
| 004 | 005 | 004-maintenance is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `004-maintenance/` |
| 005 | 006 | 005-lifecycle is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `005-lifecycle/` |
| 006 | 007 | 006-analysis is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `006-analysis/` |
| 007 | 008 | 007-evaluation is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `007-evaluation/` |
| 008 | 009 | 008-bug-fixes-and-data-integrity is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `008-bug-fixes-and-data-integrity/` |
| 009 | 010 | 009-evaluation-and-measurement is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `009-evaluation-and-measurement/` |
| 010 | 011 | 010-graph-signal-activation is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `010-graph-signal-activation/` |
| 011 | 012 | 011-scoring-and-calibration is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `011-scoring-and-calibration/` |
| 012 | 013 | 012-query-intelligence is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `012-query-intelligence/` |
| 013 | 014 | 013-memory-quality-and-indexing is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `013-memory-quality-and-indexing/` |
| 014 | 015 | 014-pipeline-architecture is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `014-pipeline-architecture/` |
| 015 | 016 | 015-retrieval-enhancements is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `015-retrieval-enhancements/` |
| 016 | 017 | 016-tooling-and-scripts is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `016-tooling-and-scripts/` |
| 017 | 018 | 017-governance is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `017-governance/` |
| 018 | 019 | 018-ux-hooks is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `018-ux-hooks/` |
| 019 | 020 | 019-feature-flag-reference is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `019-feature-flag-reference/` |
| 020 | 021 | 020-feature-flag-reference-audit is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `020-feature-flag-reference-audit/` |
| 021 | 022 | 021-remediation-revalidation is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `021-remediation-revalidation/` |
| 022 | Complete | Child packet validates and records implementation state. | `validate.sh --strict --no-recursive` on `022-implement-and-remove-deprecated-features/` |
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
