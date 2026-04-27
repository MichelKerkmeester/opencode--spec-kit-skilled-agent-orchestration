---
title: "Feature Specification: Phase Parent Documentation"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Phase-parent spec folders only require the lean trio (spec.md, description.json, graph-metadata.json). Heavy docs live in phase children where they stay accurate."
trigger_phrases:
  - "phase parent documentation"
  - "phase parent lean trio"
  - "phased spec documentation"
  - "parent doc staleness"
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

# Feature Specification: Phase Parent Documentation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `026-graph-and-context-optimization` |
| **Predecessor** | `009-hook-parity` |
| **Successor** | None (current tail of 026 active surface) |
| **Handoff Criteria** | Phase 1 (`001-validator-and-docs`) ships the validator + template + docs sync. Phase 2 (`002-generator-and-polish`) lands the deferred generator pointer-write, create.sh template swap, content validator, and end-to-end test. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A spec folder with phase children carries duplicate state at the parent level: `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` describe program-level intent at the time of decomposition, but the children own the real work and pivot as they execute. Over weeks, the parent docs drift from child reality. AI assistants reading the resume ladder treat the stale parent docs as authoritative, hallucinate current state, and propose work against outdated plans.

### Purpose
Make the parent of a phased spec folder a manifest, not a state-bearing document. The parent only requires three files: `spec.md` (root purpose + sub-phase manifest + what needs done), `description.json` (discovery metadata), and `graph-metadata.json` (children, derived rollup). Everything else lives in children where it stays accurate to that phase's actual work, so the parent surface cannot drift stale and feed bad context to a resuming AI.

> **Phase-parent note:** This `spec.md` is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Validator phase-parent branch: `check-files.sh` + `check-level-match.sh` detect phase parents and require only the lean trio at parent level.
- Single-source-of-truth detection: `is_phase_parent()` shell helper and `isPhaseParent()` ESM JS helper, both must agree.
- Lean phase-parent spec template (`templates/phase_parent/spec.md`) with embedded content-discipline comment.
- Generator phase-parent branch (deferred to Phase 2): pointer-write at parent saves and bubble-up from child saves into `derived.last_active_child_id` and `derived.last_active_at`.
- `create.sh --phase` parent template swap (deferred to Phase 2): parent scaffolds from `templates/phase_parent/spec.md` instead of level-N + addendum.
- `/spec_kit:resume` phase-parent behavior (list-fallback shipped in Phase 1; pointer-redirect deferred to Phase 2).
- Documentation sync: CLAUDE.md, AGENTS.md (root + Barter + fs-enterprises siblings), system-spec-kit `SKILL.md`.
- Content discipline rule embedded in template; optional token-scanning validator (deferred P2 in Phase 2).

### Out of Scope
- Soft deprecation of legacy phase-parent heavy docs (separate follow-on packet).
- Hard migration script auto-archiving legacy heavy docs to `z_archive/` (out of scope; tolerant policy stays).
- Modifying the detection rule beyond the locked contract: ≥1 NNN-named child AND ≥1 child has `spec.md` OR `description.json`.

### Files to Change
[See per-phase scope tables in `001-validator-and-docs/spec.md` and `002-generator-and-polish/spec.md`. Parent-level scope is the manifest, not the file ledger.]
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. Status is derived from each child's `graph-metadata.json` `derived.status` — read those for ground truth, not this column.

| Phase | Folder | Focus | Status (point-in-time) |
|-------|--------|-------|------------------------|
| 1 | `001-validator-and-docs/` | Validator phase-parent branches, `is_phase_parent`/`isPhaseParent` detection helpers, lean spec template, graph-metadata schema additive accept-path, CLAUDE.md / AGENTS.md / AGENTS sync triad / SKILL.md docs sync | complete |
| 2 | `002-generator-and-polish/` | Generator pointer-write + bubble-up, `create.sh --phase` lean-template swap, `templates/context-index.md`, `resource-map.md` polish, resume pointer-redirect, hook brief redirect, content-discipline validator (P2), end-to-end test | complete |
| 3 | `003-references-and-readme-sync/` | Doc-only sync of 13 reference docs, READMEs, command docs, and assets to align with the lean-trio policy: `phase_definitions.md`, `save_workflow.md`, `validation_rules.md`, top-level `README.md`, `templates/README.md`, plus 6 medium-severity files and 2 minor clarifications | complete |
| 4 | `004-retroactive-phase-parent-migration/` | Retroactive lean-trio retrofit across 31 legacy NNN-prefixed phase parents (22 active + 9 archived) via 3 parallel cli-codex/gpt-5.4-medium-fast workers. Tolerant policy preserved (heavy docs stay in place); manual blocks byte-equal pre/post; narrative carried forward; 026 regression baseline unchanged. | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map plus `graph-metadata.json` derived rollup
- Use `/spec_kit:resume specs/.../010-phase-parent-documentation/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Status column is informational; the canonical source is each child's `graph-metadata.json` `derived.status`

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-validator-and-docs` | `002-generator-and-polish` | Validator phase-parent branches live; detection helpers shipped and verified at 6/6 cross-impl parity; templates and docs sync landed; 026 regression preserved | `validate.sh --strict` against 026 shows ZERO new parent errors and 6 baseline errors REMOVED |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the pointer's staleness threshold (Phase 2 REQ-004) be configurable, or hard-coded at 24h? Tracked in `002-generator-and-polish/spec.md` open questions.
- Should `check-phase-parent-content.sh` (Phase 2 REQ-009) ship as `severity: warn` or `severity: error`? Recommendation: warn for v1.
- Soft deprecation of legacy phase-parent heavy docs — at what point do we surface a warning on parents like 026 telling the user to archive their heavy docs? Tracked here for visibility; lands in a separate follow-on packet after this packet (010) closes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase 1 — shipped**: See `001-validator-and-docs/` (full spec, plan, tasks, checklist, implementation-summary)
- **Phase 2 — shipped**: See `002-generator-and-polish/` (full spec, plan, tasks, checklist, implementation-summary)
- **Phase 3 — shipped**: See `003-references-and-readme-sync/` (doc-only sync; 13 files; full spec, plan, tasks, checklist, implementation-summary)
- **Phase 4 — shipped**: See `004-retroactive-phase-parent-migration/` (31 legacy phase parents retrofitted via 3 parallel cli-codex/gpt-5.4-medium-fast workers; full spec, plan, tasks, checklist, implementation-summary)
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for derived rollup and `last_active_child_id` pointer
