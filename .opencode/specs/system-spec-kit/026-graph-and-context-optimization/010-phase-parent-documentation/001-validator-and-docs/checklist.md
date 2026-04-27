---
title: "Verification Checklist: Phase Parent Documentation"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "P0/P1/P2 verification checklist for the phase-parent lean-trio policy."
trigger_phrases:
  - "phase parent checklist"
  - "phase parent verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation"
    last_updated_at: "2026-04-27T08:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 checklist with P0/P1/P2 items"
    next_safe_action: "Run final strict validation; refresh metadata"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase Parent Documentation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Spec REQ-001 through REQ-006 are unambiguous and have measurable acceptance criteria — evidence: `spec.md` §4
- [ ] CHK-002 [P0] Plan §3 Architecture states the single-source-of-truth detection contract — evidence: `plan.md` ANCHOR:architecture
- [ ] CHK-003 [P0] Regression baseline captured for `026-graph-and-context-optimization/` and at least three other phase-bearing folders before Phase A patches land — evidence: stored under `scratch/regression-baseline-pre-A.txt`
- [ ] CHK-004 [P1] Tolerant migration policy explicitly chosen (Policy 1) over hard migration; soft-deprecation deferred to follow-on packet — evidence: `spec.md` ANCHOR:scope (Out of Scope) + ANCHOR:questions
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `is_phase_parent()` shell + `isPhaseParent()` JS helpers pass shellcheck and tsc strict — evidence: CI green or local run
- [ ] CHK-011 [P0] Both helpers return identical boolean for all 4 fixture cases — evidence: parity test pass
- [ ] CHK-012 [P0] `check-files.sh` and `check-level-match.sh` early branches do not regress non-phase-parent folders — evidence: validation runs against all `.opencode/specs/**` exit 0 or match baseline
- [ ] CHK-013 [P1] Generator phase-parent branch is covered by a vitest fixture asserting pointer write at parent and bubble-up from child save
- [ ] CHK-014 [P1] `templates/phase_parent/spec.md` includes the inline content-discipline comment listing FORBIDDEN merge/migration narrative tokens and REQUIRED root-purpose/sub-phases/what-needs-done content
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All P0 acceptance scenarios in `plan.md` ANCHOR:testing satisfied — evidence per scenario
- [ ] CHK-021 [P0] Manual `/spec_kit:plan :with-phases --phases 2` end-to-end test produces lean parent + populated children — evidence: command transcript + folder listing
- [ ] CHK-022 [P0] Manual `/spec_kit:resume <phase-parent>` reaches the active child via pointer redirect WITHOUT reading parent's `plan.md`/`tasks.md`/`implementation-summary.md` — evidence: trace log
- [ ] CHK-023 [P1] Edge case: detection rule returns false for a folder containing 3 NNN-named subdirs that are all empty
- [ ] CHK-024 [P1] Edge case: pointer-missing fallback (list-children-with-statuses prompt) works when parent's `last_active_child_id` is null
- [ ] CHK-025 [P1] Edge case: pointer to archived/removed child triggers fallback rather than crashing resume
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No new file-write paths introduced beyond existing canonical save / `generate-context.js` writes — evidence: diff review
- [ ] CHK-031 [P0] Detection regex `^[0-9]{3}-[a-z0-9-]+$` excludes traversal-friendly names by shape — evidence: shell + JS test cases including `..`, `.`, paths with slashes
- [ ] CHK-032 [P1] No hardcoded paths or secrets introduced in any patched file
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] CLAUDE.md updated — resume ladder addendum + §3 Documentation Levels phase-parent row
- [ ] CHK-041 [P0] root `AGENTS.md` updated — §3 Documentation Levels phase-parent row + content-discipline note
- [ ] CHK-042 [P0] `AGENTS_Barter.md` synced per known invariant (port shared gates/runtime contracts; do NOT port skill-specific names)
- [ ] CHK-043 [P0] `AGENTS_example_fs_enterprises.md` synced per known invariant
- [ ] CHK-044 [P0] system-spec-kit `SKILL.md` updated — phase-parent mode in level matrix; pointer mechanism explanation; new template pointers
- [ ] CHK-045 [P1] `templates/context-index.md` created with brief usage guidance ("use for migration bridges only")
- [ ] CHK-046 [P1] `templates/resource-map.md` Author Instructions §Scope shape sharpened for phase-parent mode
- [ ] CHK-047 [P2] Example phase-parent fixture/snippet added under `references/structure/phase_definitions.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp regression-baseline output kept in `scratch/` only; not committed at root
- [ ] CHK-051 [P1] `scratch/` cleaned before completion (or its retention reason documented in `implementation-summary.md`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
