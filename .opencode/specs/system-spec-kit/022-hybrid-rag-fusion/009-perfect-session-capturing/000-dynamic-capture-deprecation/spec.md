---
title: "Feature Specification: Dynamic Capture Deprecation Branch"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Feature Specification: Dynamic Capture Deprecation Branch"
trigger_phrases:
  - "dynamic capture deprecation"
  - "archived branch parent"
  - "phase branch parent"
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

# Feature Specification: Dynamic Capture Deprecation Branch

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Archived |
| **Created** | 2026-03-20 |
| **Branch** | `000-dynamic-capture-deprecation` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing` |
| **Predecessor** | None |
| **Successor** | [001-quality-scorer-unification](../001-quality-scorer-unification/spec.md) |
| **Handoff Criteria** | Validator + phase-parent trio stay current while child packets remain the detailed execution surface |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature Specification: Dynamic Capture Deprecation Branch

### Purpose
Five authoritative child phases were moved under `000-dynamic-capture-deprecation/`, but the branch itself had no parent `spec.md`, `plan.md`, or `tasks.md`. That left the moved child phases with broken parent back-references under recursive validation and made the archived branch harder to navigate from the parent pack.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Child packet `001-session-source-validation/` remains the authoritative implementation surface for its phase.
- Child packet `002-outsourced-agent-handback/` remains the authoritative implementation surface for its phase.
- Child packet `003-multi-cli-parity/` remains the authoritative implementation surface for its phase.
- Child packet `004-source-capabilities-and-structured-preference/` remains the authoritative implementation surface for its phase.
- Maintain the parent-level phase manifest, navigation pointers, and status surface only.

### Out of Scope
- Rewriting child-phase plans, tasks, or checklists from this parent packet.
- Using the parent spec as a changelog or migration-history ledger.
- Treating parent heavy docs as the source of implementation truth.

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/spec.md` | Modify/Create | parent | Lean phase-parent specification and child manifest |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/description.json` | Modify | parent | Refresh save metadata for the migration pass |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/graph-metadata.json` | Modify | parent | Refresh derived child pointers and save timestamp |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-session-source-validation/` | Session Source Validation | complete |
| 002 | `002-outsourced-agent-handback/` | Outsourced Agent Handback: Outsourced Agent Handback Protocol | complete |
| 003 | `003-multi-cli-parity/` | Multi Cli Parity: Multi-CLI Parity Hardening | complete |
| 004 | `004-source-capabilities-and-structured-preference/` | Source Capabilities And Structured Preference | complete |
| 005 | `005-live-proof-and-parity-hardening/` | Live Proof And Parity Hardening | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/NNN-phase/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | 001-session-source-validation is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `001-session-source-validation/` |
| 002 | 003 | 002-outsourced-agent-handback is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `002-outsourced-agent-handback/` |
| 003 | 004 | 003-multi-cli-parity is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `003-multi-cli-parity/` |
| 004 | 005 | 004-source-capabilities-and-structured-preference is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `004-source-capabilities-and-structured-preference/` |
| 005 | Complete | Child packet validates and records implementation state. | `validate.sh --strict --no-recursive` on `005-live-proof-and-parity-hardening/` |
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
