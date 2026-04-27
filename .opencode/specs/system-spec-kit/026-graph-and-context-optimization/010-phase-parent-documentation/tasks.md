---
title: "Tasks: Phase Parent Documentation"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task breakdown for the phase-parent lean-trio policy. Three sub-phases: A (validator+template), B (generator+create), C (resume+docs)."
trigger_phrases:
  - "phase parent tasks"
  - "phase parent task list"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation"
    last_updated_at: "2026-04-27T08:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md three-phase task list"
    next_safe_action: "Author checklist.md and metadata"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase Parent Documentation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> **Sub-phase A — Detection + Validator + Template Foundation.** These pieces ship together because the validator is the contract and the template is what users author against.

- [ ] T001 Add `is_phase_parent()` helper to `scripts/lib/shell-common.sh` (reuse `has_phase_children()` + child-population check)
- [ ] T002 [P] Add `isPhaseParent()` helper to `mcp_server/lib/spec/is-phase-parent.ts` and build to `dist/`
- [ ] T003 Create cross-implementation test fixture under `scripts/tests/fixtures/is-phase-parent/` (4 cases: populated, scaffolded-empty, support-folders-only, mixed)
- [ ] T004 Author parity test asserting both helpers return identical boolean for every fixture case
- [ ] T005 Patch `scripts/rules/check-files.sh` early branch — phase parent requires only `spec.md` (not plan/tasks/checklist/decision-record)
- [ ] T006 Patch `scripts/rules/check-level-match.sh` early branch — skip level-match enforcement at phase parents; emit info-level message
- [ ] T007 Create `templates/phase_parent/spec.md` (~80 LOC) with anchors metadata/problem/scope/phase-map/questions and inline content-discipline comment listing FORBIDDEN merge/migration narrative tokens and REQUIRED root-purpose/sub-phases/what-needs-done content
- [ ] T008 Run `validate.sh --strict` regression baseline against `026-graph-and-context-optimization/` and three other phase-bearing folders BEFORE Phase A patches land — capture baseline output
- [ ] T009 Run `validate.sh --strict` against same set AFTER Phase A patches — confirm no new errors
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> **Sub-phase B — Generator + Create-Script Wire-Up.** Routes parent continuity into `graph-metadata.json` and wires `create.sh --phase` to the new lean template.

- [ ] T010 Extend `graph-metadata.json` derived schema doc to include optional `last_active_child_id` and `last_active_at` (additive, additive-only)
- [ ] T011 Patch `scripts/rules/check-graph-metadata.sh` schema check to allow (not require) the two new derived fields
- [ ] T012 Add phase-parent branch in `mcp_server/lib/memory/generate-context.ts` — when `isPhaseParent(folder)`, skip `implementation-summary.md` continuity write at parent
- [ ] T013 Add bubble-up logic — when generator saves at a child whose parent is a phase parent, also stamp parent's `derived.last_active_child_id` and `derived.last_active_at`
- [ ] T014 Rebuild `scripts/dist/memory/generate-context.js` from TS source
- [ ] T015 Patch `scripts/spec/create.sh --phase` mode — parent scaffolds from `templates/phase_parent/spec.md`; children unchanged (continue using level-N templates)
- [ ] T016 [P] Create `templates/context-index.md` (~40 LOC) for migration-bridge use cases (NOT auto-scaffolded; user adds when reorganizing)
- [ ] T017 Update `templates/resource-map.md` Author Instructions §Scope shape — explicit phase-parent guidance: prefer parent-aggregate OR per-child mode, not both (~10 LOC)
- [ ] T018 Add vitest fixture asserting generator writes pointer at parent and bubbles from child save
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> **Sub-phase C — Resume + Hook Brief + Documentation.** Closes the loop so users see the new behavior end-to-end and the docs explain the contract.

- [ ] T019 Patch `.opencode/command/spec_kit/spec_kit_resume.md` (and YAML asset) — phase-parent redirect: pointer-found recurses to child, pointer-missing or stale (>24h) lists children with statuses, `--no-redirect` bypasses
- [ ] T020 Patch hook brief assembler in `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` (and runtime brief loaders) to honor the same redirect
- [ ] T021 Update CLAUDE.md §1 Tools & Search resume ladder — add phase-parent branch
- [ ] T022 Update CLAUDE.md §3 Documentation Levels — add phase-parent mode row + content-discipline note
- [ ] T023 [P] Update root `AGENTS.md` §3 Documentation Levels — add phase-parent mode row
- [ ] T024 [P] Sync `AGENTS_Barter.md` per known invariant
- [ ] T025 [P] Sync `AGENTS_example_fs_enterprises.md` per known invariant
- [ ] T026 Update system-spec-kit `SKILL.md` — phase-parent mode in level matrix; pointer mechanism explanation; pointers to new templates
- [ ] T027 Add example phase-parent fixture/snippet under `references/structure/phase_definitions.md` (or peer doc) demonstrating the lean surface
- [ ] T028 Run end-to-end test: create new spec via `/spec_kit:plan :with-phases --phases 2`, edit a child, save, resume from parent — must reach the child via pointer redirect
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks (T001–T015, T019, T021–T026, T028) marked `[x]` with evidence
- [ ] No `[B]` blocked tasks remaining
- [ ] `validate.sh --strict` passes on lean phase-parent fixture (lean trio only)
- [ ] `validate.sh --strict` passes on `026-graph-and-context-optimization/` (regression baseline preserved)
- [ ] Manual verification of resume round-trip (parent → child via pointer) passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
