---
title: "Feature Specification: 023 Path Scoped Rules"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Keep this sealed phase-parent packet validator-compliant as a lean manifest that preserves the original purpose, lists the child phases, and leaves detailed planning, execution,..."
trigger_phrases:
  - "023-path-scoped-rules"
  - "023 path scoped rules"
  - "001-mvp-monolithic"
  - "002-modular-architecture"
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

# Feature Specification: 023 Path Scoped Rules

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | None (collection root) |
| **Parent Packet** | `z_archive` |
| **Predecessor** | `See child ordering above` |
| **Successor** | None |
| **Handoff Criteria** | Parent manifest, `description.json`, and `graph-metadata.json` stay aligned with the current child phase folders and pass tolerant phase-parent validation. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This parent packet coordinates the phased work under `023 Path Scoped Rules` so the child packets stay discoverable and the root purpose remains clear while implementation details live below the parent level. The current child surface includes 001-mvp-monolithic, 002-modular-architecture.

### Purpose
Keep this sealed phase-parent packet validator-compliant as a lean manifest that preserves the original purpose, lists the child phases, and leaves detailed planning, execution, and verification in the child folders without rewriting archive history.

> **Phase-parent note:** This `spec.md` is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Preserve the root purpose for `023-path-scoped-rules` without rewriting child-phase intent.
- Keep the parent packet discoverable as a lean manifest over the current child phase folders.
- Refresh parent discovery metadata and graph rollup so resume and validation surfaces point at the correct child packets.

### Out of Scope
- Editing any child packet content under `023-path-scoped-rules/[0-9][0-9][0-9]-*/`.
- Deleting or archiving legacy heavy parent docs that already exist beside the lean trio.
- Reconstructing missing historical detail beyond what is needed for the parent manifest.

### Files to Change
[Parent-level scope is limited to `spec.md`, `description.json`, and `graph-metadata.json`. Detailed execution, planning, and verification remain inside the child phase folders.]
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. Status is derived from each child `graph-metadata.json` `derived.status` when present.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-mvp-monolithic/` | Path-Scoped Validation Rules | in_progress |
| 2 | `002-modular-architecture/` | Modular Validation Architecture | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map plus `graph-metadata.json` child rollup.
- Use `/spec_kit:resume system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/023-path-scoped-rules/[NNN-phase]/` to resume a specific child phase.
- Run `validate.sh --recursive` on the parent when validating the integrated phase train.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-mvp-monolithic` | `002-modular-architecture` | `001-mvp-monolithic` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `002-modular-architecture` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- No additional parent-level open questions are required here. Phase-specific unknowns live in the child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase `spec.md`, `plan.md`, `tasks.md`, and verification docs.
- **Graph metadata**: See `graph-metadata.json` for the current child rollup and derived status.
