---
title: "Implementation Plan: SpecKit-aligned doc visual upgrade [template:level_2/plan.md]"
description: "Execution plan for aligning sk-doc-visual command contracts, references, templates, and validator fixtures to SpecKit artifact metadata and traceability rules."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation plan"
  - "doc visual"
  - "speckit"
  - "artifact metadata"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: SpecKit-aligned doc visual upgrade

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, HTML, Bash, shell test harness |
| **Framework** | OpenCode command docs + `sk-doc-visual` skill contracts |
| **Storage** | None |
| **Testing** | `validate-html-output.sh`, `test-validator-fixtures.sh`, `validate_document.py`, `package_skill.py`, `validate.sh` |

### Overview
This plan upgrades doc visual workflows to be SpecKit-artifact aware. Implementation is sequenced to establish profile references first, then align command contracts, add templates, update validator/fixtures, and finish with mandatory verification commands.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All P0 acceptance criteria met
- [x] Validator and fixture checks pass
- [x] Command markdown validation passes for all five commands
- [x] `package_skill.py --no-zip` and spec `validate.sh` pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-first documentation and validation hardening.

### Key Components
- **Artifact Profile Layer**: `artifact_profiles.md` and `user_guide_profiles.md` define profile schema and detector logic.
- **Command Contract Layer**: Five `visual_explainer` command docs enforce artifact-aware inputs and metadata outputs.
- **Template Layer**: Two new templates provide concrete starters for dashboard and traceability outputs.
- **Validation Layer**: Validator script + fixture tests enforce SpecKit metadata and traceability rules.

### Data Flow
1. Artifact profile detector maps source input to a profile.
2. Command contracts require profile-aware output metadata fields.
3. Template selection follows mapped profile.
4. Validator checks metadata and traceability markers.
5. Fixture tests confirm both pass and fail behavior.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Profile references
- [x] Add `artifact_profiles.md` with schema and detectors.
- [x] Add `user_guide_profiles.md` for README/install-guide profiles.
- [x] Wire new reference files from `SKILL.md` and quick references.

### Phase 2: Command contract alignment
- [x] Update `generate.md` contract for artifact-aware outputs.
- [x] Update `plan-review.md` contract for artifact-aware outputs.
- [x] Update `diff-review.md` contract for artifact-aware outputs.
- [x] Update `recap.md` contract for artifact-aware outputs.
- [x] Update `fact-check.md` contract for artifact-aware outputs.

### Phase 3: Template additions
- [x] Add `artifact-dashboard.html` starter template.
- [x] Add `traceability-board.html` starter template.

### Phase 4: Validator and fixtures
- [x] Add metadata contract checks in `validate-html-output.sh`.
- [x] Update `test-validator-fixtures.sh` for metadata + traceability assertions.
- [x] Update or add fixtures to cover pass/fail metadata scenarios.

### Phase 5: Verification and spec sync
- [x] Run command markdown validation for five command files.
- [x] Run fixture tests and skill/spec validation commands.
- [x] Sync `tasks.md`, `checklist.md`, and `implementation-summary.md` evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Command markdown validation | Five `visual_explainer` command docs | `python3 .opencode/skill/sk-doc/scripts/validate_document.py <command-file> --type command` |
| Validator fixture regression | SpecKit metadata + traceability checks | `bash .opencode/skill/sk-doc-visual/scripts/tests/test-validator-fixtures.sh` |
| Skill package validation | `sk-doc-visual` packaging contract | `python3 .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/sk-doc-visual --no-zip` |
| Spec validation | Level 2 spec file integrity | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/sk-doc-visual/003-sk-doc-visual-refinement` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/command/visual_explainer/*.md` | Internal | Green | Cannot complete REQ-001/REQ-002 |
| `.opencode/skill/sk-doc-visual/references/` | Internal | Green | Cannot complete REQ-003/REQ-004 |
| `.opencode/skill/sk-doc-visual/assets/templates/` | Internal | Green | Cannot complete REQ-005 |
| `.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh` | Internal | Green | Cannot complete REQ-006 |
| `.opencode/skill/sk-doc-visual/scripts/tests/test-validator-fixtures.sh` | Internal | Green | Cannot complete REQ-006/REQ-007 |
| `sk-doc` scripts | Internal | Green | Cannot complete REQ-007 command and package validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Updated command or validator contract causes false failures or command ambiguity.
- **Procedure**: Revert modified command/reference/template/validator files as one unit and rerun baseline validation commands.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (profiles) -> Phase 2 (command contracts) -> Phase 3 (templates)
                                      |                          |
                                      +-> Phase 4 (validator+fixtures)
Phase 2 + Phase 3 + Phase 4 -> Phase 5 (verification+spec sync)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2 |
| Phase 2 | Phase 1 | Phase 3, Phase 4, Phase 5 |
| Phase 3 | Phase 2 | Phase 5 |
| Phase 4 | Phase 2 | Phase 5 |
| Phase 5 | Phase 2, Phase 3, Phase 4 | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Profile references | Medium | 1-2 hours |
| Phase 2: Command contracts | Medium | 2-3 hours |
| Phase 3: Template additions | Medium | 1-2 hours |
| Phase 4: Validator and fixtures | High | 2-4 hours |
| Phase 5: Verification and sync | Medium | 1-2 hours |
| **Total** | | **7-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline state captured for target command and skill files
- [x] Updated fixtures include both pass and fail coverage
- [x] Validation command set prepared

### Rollback Procedure
1. Revert contract, reference, template, validator, and fixture changes together.
2. Run fixture and command validation to confirm baseline behavior.
3. Confirm `package_skill.py --check` passes against rollback state.
4. Record rollback rationale in `implementation-summary.md`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
