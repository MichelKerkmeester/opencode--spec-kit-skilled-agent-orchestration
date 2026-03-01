---
title: "Tasks: SpecKit-aligned doc visual upgrade [template:level_2/tasks.md]"
description: "Execution task list for SpecKit artifact alignment across visual_explainer commands, references, templates, and validator fixtures."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "doc visual"
  - "speckit alignment"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: SpecKit-aligned doc visual upgrade

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm scope, requirement IDs, and fixed branch identifier in `spec.md` (`.opencode/specs/03--commands-and-skills/sk-doc-visual/003-sk-doc-visual-refinement/spec.md`)
- [x] T002 Capture implementation phases and verification command matrix in `plan.md` (`.opencode/specs/03--commands-and-skills/sk-doc-visual/003-sk-doc-visual-refinement/plan.md`)
- [x] T003 [P] Initialize checklist gates and in-progress implementation summary (`.opencode/specs/03--commands-and-skills/sk-doc-visual/003-sk-doc-visual-refinement/checklist.md`, `.opencode/specs/03--commands-and-skills/sk-doc-visual/003-sk-doc-visual-refinement/implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add artifact profile schema reference (`.opencode/skill/sk-doc-visual/references/artifact_profiles.md`)
- [x] T005 Add user guide profile reference (`.opencode/skill/sk-doc-visual/references/user_guide_profiles.md`)
- [x] T006 Update skill routing/reference links (`.opencode/skill/sk-doc-visual/SKILL.md`, `.opencode/skill/sk-doc-visual/references/quick_reference.md`, `.opencode/skill/sk-doc-visual/references/quality_checklist.md`)
- [x] T007 Update command contract for `generate` (`.opencode/command/visual_explainer/generate.md`)
- [x] T008 Update command contract for `plan-review` (`.opencode/command/visual_explainer/plan-review.md`)
- [x] T009 Update command contract for `diff-review` (`.opencode/command/visual_explainer/diff-review.md`)
- [x] T010 Update command contract for `recap` (`.opencode/command/visual_explainer/recap.md`)
- [x] T011 Update command contract for `fact-check` (`.opencode/command/visual_explainer/fact-check.md`)
- [x] T012 Add `artifact-dashboard` template (`.opencode/skill/sk-doc-visual/assets/templates/artifact-dashboard.html`)
- [x] T013 Add `traceability-board` template (`.opencode/skill/sk-doc-visual/assets/templates/traceability-board.html`)
- [x] T014 Update validator checks for SpecKit metadata and traceability (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)
- [x] T015 Update fixture runner and fixtures for metadata/traceability pass-fail scenarios (`.opencode/skill/sk-doc-visual/scripts/tests/test-validator-fixtures.sh`, `.opencode/skill/sk-doc-visual/scripts/tests/fixtures/*.html`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run fixture validation suite (`bash .opencode/skill/sk-doc-visual/scripts/tests/test-validator-fixtures.sh`)
- [x] T017 Run command markdown validation for all five command files (`python3 .opencode/skill/sk-doc/scripts/validate_document.py <command-file> --type command`)
- [x] T018 Run skill package validation (`python3 .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/sk-doc-visual --no-zip`)
- [x] T019 Run spec validation (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/sk-doc-visual/003-sk-doc-visual-refinement`)
- [x] T020 Update checklist evidence and finalize implementation summary (`.opencode/specs/03--commands-and-skills/sk-doc-visual/003-sk-doc-visual-refinement/checklist.md`, `.opencode/specs/03--commands-and-skills/sk-doc-visual/003-sk-doc-visual-refinement/implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements (REQ-001 to REQ-007) are marked complete with evidence.
- [x] All verification commands return pass status.
- [x] `checklist.md` gate items are updated to `[x]` with evidence.
- [x] Implementation summary is updated from in-progress placeholder to final evidence state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Completion Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
