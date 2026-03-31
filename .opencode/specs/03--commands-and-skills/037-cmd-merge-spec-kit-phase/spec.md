---
title: "Feature Specification: Merge spec_kit:phase into plan and [03--commands-and-skills/037-cmd-merge-spec-kit-phase/spec]"
description: "The /spec_kit:phase command is a standalone 7-step workflow that only creates folder structure (parent + N children) without doing any planning or implementation. Users must the..."
trigger_phrases:
  - "feature"
  - "specification"
  - "merge"
  - "spec"
  - "kit"
  - "037"
  - "cmd"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Merge spec_kit:phase into plan and complete

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-29 |
| **Branch** | `037-cmd-merge-spec-kit-phase` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/spec_kit:phase` command is a standalone 7-step workflow that only creates folder structure (parent + N children) without doing any planning or implementation. Users must then separately invoke `/spec_kit:plan` per child phase. This three-command chain (phase -> plan per child -> implement per child) adds friction. The phase decomposition capability should be an integrated option within the existing plan and complete workflows, following the same pattern as the existing `:with-research` flag.

### Purpose
Eliminate the standalone `/spec_kit:phase` command by absorbing its phase decomposition workflow into the plan and complete commands as an optional `:with-phases` mode, reducing the command surface and simplifying the user experience.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `:with-phases` optional workflow flag to plan and complete commands
- Integrate phase decomposition steps (analyze scope, propose decomposition, create folders, populate parent/children) as a pre-workflow in both commands
- Update YAML assets (plan auto/confirm, complete auto/confirm) with `phase_decomposition` optional workflow config
- Remove standalone phase command and its YAML assets
- Update README.txt command table to remove phase entry and document `:with-phases` flag
- Update cross-references in CLAUDE.md quick reference table

### Out of Scope
- Changes to `create.sh --phase` script — the underlying infrastructure stays unchanged
- Changes to phase addendum templates (phase-parent-section, phase-child-header)
- Changes to `validate.sh --recursive` or phase-link validation rules
- Changes to `recommend-level.sh --recommend-phases`
- Updates to spec folders, changelogs, feature catalogs, or testing playbooks that reference `spec_kit:phase`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec_kit/plan` | Modify | Add `:with-phases` flag, decomposition sections, argument-hint |
| `spec_kit/complete` | Modify | Add `:with-phases` flag, decomposition sections, argument-hint |
| `spec_kit/assets/spec_kit_plan_auto.yaml` | Modify | Add `phase_decomposition` optional workflow config |
| `spec_kit/assets/spec_kit_plan_confirm.yaml` | Modify | Add `phase_decomposition` optional workflow config |
| `spec_kit/assets/spec_kit_complete_auto.yaml` | Modify | Add `phase_decomposition` optional workflow config |
| `spec_kit/assets/spec_kit_complete_confirm.yaml` | Modify | Add `phase_decomposition` optional workflow config |
| `spec_kit/phase` | Delete | Standalone command removed |
| `spec_kit/assets/spec_kit_phase_auto.yaml` | Delete | Phase YAML workflow removed |
| `spec_kit/assets/spec_kit_phase_confirm.yaml` | Delete | Phase YAML workflow removed |
| `spec_kit/README.txt` | Modify | Remove phase entry, document `:with-phases` |
| Root `CLAUDE` | Modify | Update quick reference table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `:with-phases` flag in `plan.md` triggers phase decomposition pre-workflow | Invoking `/spec_kit:plan:auto "feature" :with-phases --phases 3` creates parent + 3 child folders, then plans the first child |
| REQ-002 | `:with-phases` flag in spec_kit:complete triggers phase decomposition pre-workflow | Invoking `/spec_kit:complete:auto "feature" :with-phases --phases 3` creates parent + 3 child folders, then runs complete on first child |
| REQ-003 | Phase decomposition uses existing `create.sh --phase` infrastructure | No changes to create.sh; the command is invoked with same flags |
| REQ-004 | Standalone `spec_kit:phase` command and YAML assets removed | Files deleted, no orphaned references in primary documentation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Phase flags `--phases N` and `--phase-names "a,b,c"` supported in plan/complete commands | Flags parsed in setup phase and passed to `create.sh` |
| REQ-006 | `README.txt` updated to remove phase command and document `:with-phases` | No stale phase command reference in README |
| REQ-007 | CLAUDE.md quick reference table updated | Phase workflow row removed or replaced with `:with-phases` note |
| REQ-008 | Smart phase detection: when complexity scoring recommends phases, suggest `:with-phases` | User informed during setup if `recommend-level.sh` suggests phasing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/spec_kit:phase` command no longer exists; attempting to invoke it fails gracefully
- **SC-002**: `/spec_kit:plan:auto "feature" :with-phases --phases 3` produces identical folder structure to what `/spec_kit:phase:auto "feature" --phases 3` followed by `/spec_kit:plan` would have produced
- **SC-003**: All primary docs (CLAUDE, README.txt, plan command, complete command) reference `:with-phases` instead of `spec_kit:phase`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `create.sh --phase` must remain stable | Phase creation fails if script changes | Script is out of scope; no changes needed |
| Risk | ~44 files reference `spec_kit:phase` | Stale references in secondary docs | Out-of-scope secondary docs can be updated later |
| Risk | Phase setup adds complexity to plan/complete setup prompts | Longer consolidated prompt | Only show phase questions when `:with-phases` flag present |
<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No performance impact — phase decomposition adds pre-steps only when `:with-phases` flag is present

### Security
- **NFR-S01**: N/A — command prompt files only, no runtime code

### Reliability
- **NFR-R01**: Fallback: if phase creation fails, workflow should halt with clear error before proceeding to planning
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- No `:with-phases` flag: workflow unchanged (zero impact on existing behavior)
- `--phases 1`: valid but degenerate — creates parent + 1 child (same as non-phased)
- `--phases` without `:with-phases`: ignored (flag only meaningful with `:with-phases`)

### Error Scenarios
- `create.sh --phase` fails: halt workflow, report error, suggest manual `create.sh` invocation
- Phase folder already exists: `create.sh` handles this (reports conflict)

### State Transitions
- After phase creation: `spec_path` automatically updates to first child phase folder
- Subsequent phases: user invokes `/spec_kit:plan --phase-folder=<path>` for each child (existing capability)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 6-10 files, ~300 LOC, single domain (commands) |
| Risk | 8/25 | No breaking changes to scripts/runtime; documentation-only |
| Research | 5/20 | Pattern well-established (`:with-research`), minimal unknowns |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None — approach is clear, pattern is established.
<!-- /ANCHOR:questions -->
