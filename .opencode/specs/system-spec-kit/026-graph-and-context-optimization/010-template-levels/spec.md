---
title: "Feature Specification: Template Levels — Phase Parent (Investigation → Greenfield Redesign → Implementation)"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Phase-parent for the spec-kit template-system rework. Three sub-phases: 001 investigated whether to consolidate the existing level-folder system; 002 reframed the question as a greenfield redesign and converged on the C+F hybrid manifest-driven design; 003 plans the 4-phase implementation."
trigger_phrases:
  - "010 template levels"
  - "template levels phase parent"
  - "template system rework"
  - "spec-kit template phases"
importance_tier: "high"
contextType: "architecture"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This document is the PARENT spec for the 3-phase template-system rework.
  All planning, tasks, checklists, decisions, and continuity live inside the child phase folders 001/002/003.
  This file declares ROOT PURPOSE, the SUB-PHASE MANIFEST, and WHAT NEEDS DONE — nothing else.
-->

# Feature Specification: Template Levels — Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (026-graph-and-context-optimization) |
| **Parent Packet** | `system-spec-kit/026-graph-and-context-optimization` |
| **Predecessor** | (none — first packet under 026 to address template architecture) |
| **Successor** | 010-template-levels/003 hands off to a future implementation execution session |
| **Handoff Criteria** | All 3 sub-phases validate; phase 003 produces ready-to-execute file-by-file plan |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-kit template system today maintains 86 files (~13K LOC) split across `core/`, `addendum/{level2-verify, level3-arch, level3-plus-govern, phase}/`, four materialized `level_N/` outputs, `phase_parent/`, plus a build-time composer (`compose.sh`) and an anchor wrapper (`wrap-all-templates.ts`). The Level 1/2/3/3+ taxonomy bundles two independent concerns (which doc files a packet needs AND which sections within those docs apply), causes drift between the scaffolder and the validators (both encode the level→files matrix independently), and produces stale empty addon stubs (`handover.md`, `debug-delegation.md`, `research.md`) in fresh packets even though those docs are written exclusively by automation.

### Purpose
Decompose the rework into three sequential investigation/design/implementation phases, each with its own externalized state, decision-record, and plan. Phase 001 establishes the problem and considers PARTIAL consolidation under backward-compat constraints. Phase 002 reframes the work as greenfield (the user explicitly rejected backward-compat preservation), runs a 14-iteration deep-research loop, and converges on the C+F hybrid manifest-driven design with 5 ADRs. Phase 003 plans the 4-phase implementation with file-by-file blast radius and gated phases.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders 001/002/003. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Three sequential phases covering investigation → greenfield design → implementation planning for the spec-kit template-system rework
- Final design (chosen in 002, planned in 003): C+F hybrid manifest-driven greenfield, eliminating the on-disk `templates/level_N/` folders while keeping `--level N` as the sole public/AI-facing API forever (per inherited ADR-005)

### Out of Scope (at the parent level)
- Implementation execution itself — phase 003 ends with a ready-to-execute plan; the actual code work happens in a follow-on session
- Backward-compat with 868 existing spec folders — packet 001 explored this as PARTIAL recommendation; user rejected; 002 + 003 are unconstrained by it (existing folders are immutable git history)
- Cross-cutting templates beyond what the manifest covers — `templates/changelog/`, `examples/`, `scratch/`, `stress_test/` stay untouched

### Files to Change
This parent spec lists no files directly. Per-phase blast radius:

| Phase | Folder | Authoritative file ledger |
|-------|--------|---------------------------|
| 001 | `001-template-consolidation-investigation/` | `001/research/research.md` (29.7 KB, PARTIAL recommendation, REJECTED) |
| 002 | `002-template-greenfield-redesign/` | `002/research/research.md` (51.4 KB, C+F hybrid recommendation, ACCEPTED) |
| 003 | `003-template-greenfield-impl/` | `003/resource-map.md` (~95 file references, the authoritative implementation ledger) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-template-consolidation-investigation` | Initial 10-iter deep-research loop on consolidating templates with backward-compat preservation | Complete (PARTIAL recommendation, REJECTED by user) |
| 002 | `002-template-greenfield-redesign` | 14-iter deep-research loop on greenfield redesign + workflow-invariance constraint + 5 ADRs | Complete (C+F hybrid manifest-driven greenfield, ACCEPTED) |
| 003 | `003-template-greenfield-impl` | 4-phase implementation plan with file-by-file blast radius (`resource-map.md`) and gated phases | Plan ready; awaiting implementation session |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume 010-template-levels/00X-...` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | User rejection of PARTIAL framing; greenfield reframe articulated | Conversation transcript + spec.md §3 in 002 cites the rejection |
| 002 | 003 | Design converged (C+F hybrid + 5 ADRs); workflow-invariance locked | 002/decision-record.md ADR-001 through ADR-005 all Accepted; 002/research/research.md §18 addendum present |
| 003 | (impl session) | resource-map.md complete; plan.md phases gated; tasks.md actionable | 003/checklist.md Gates 1-4 listed; codex review remediated all P0+P1+P2 findings |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Will the implementation session land all 4 phases in a single squash-merge or as 4 separate PRs? (Decided in 003/plan.md §7: separate PRs feeding an integration branch, then squash-merge to main.)
- Should phase 001's PARTIAL recommendation be archived to `z_archive/` once 003 ships, or kept as historical context? (Recommend keep — explains why the team rejected the gradual approach.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-template-consolidation-investigation/`, `002-template-greenfield-redesign/`, `003-template-greenfield-impl/`
- **Parent Spec**: `../spec.md` (026-graph-and-context-optimization)
- **Graph Metadata**: `graph-metadata.json` (this folder; `derived.last_active_child_id` pointer)
- **Headline design**: `002-template-greenfield-redesign/research/research.md` (51.4 KB synthesis)
- **Implementation ledger**: `003-template-greenfield-impl/resource-map.md` (~95 file references)
- **Inherited ADRs**: `002-template-greenfield-redesign/decision-record.md` (ADR-001 through ADR-005)
