---
title: "Tasks: sk-doc-visual Template Improvement [044-sk-doc-visual-template-improvement/tasks]"
description: "Level 3 task map with complete rewrite, validation, and memory-save coverage for /spec_kit:complete auto workflow."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "rewrite"
  - "validation"
  - "memory save"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: sk-doc-visual Template Improvement

<!-- SPECKIT_LEVEL: 3 -->
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

**Task Format**: `ID OptionalParallel Description (file path)`

**ID Families**:
- `T1xx` Documentation lock
- `T2xx` Preflight and scope checks
- `T3xx` Skill and references rewrite
- `T4xx` Template rewrite
- `T5xx` Validator alignment
- `V6xx` Verification and completion evidence
- `M7xx` Memory save and closeout
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Documentation Lock

- [x] T100 Populate `spec.md` with Level 3 scope lock and requirements (`.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/spec.md`)
- [x] T101 Populate `plan.md` with auto workflow phases and dependency graph (`.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/plan.md`)
- [x] T102 Populate `tasks.md` with rewrite, validation, and memory-save IDs (`.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/tasks.md`)
- [x] T103 Populate `checklist.md` with evidence-first Level 3 gates (`.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/checklist.md`)
- [x] T104 Populate `decision-record.md` with modernization ADRs (`.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/decision-record.md`)
- [x] T105 Populate completion-ready `implementation-summary.md` scaffold (`.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/implementation-summary.md`)
- [x] T106 Freeze and re-verify scope lock consistency across root docs (`.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Preflight and Scope Checks

- [x] T200 Confirm all scope-listed implementation files exist (`.opencode/skill/sk-doc-visual/`)
- [x] T201 Kick off `/spec_kit:complete` in auto mode for this spec (`workflow execution`)
- [x] T202 Capture baseline snapshots for rollback of rewrite targets (`scope-listed implementation files`)
- [x] T203 Re-confirm scope lock immediately before first implementation edit (`spec.md` section 3)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Skill and References Rewrite

- [x] T300 Rewrite `SKILL.md` rules for README Ledger profile and workflow (`.opencode/skill/sk-doc-visual/SKILL.md`)
- [x] T310 Rewrite quick-start and command guidance (`.opencode/skill/sk-doc-visual/references/quick_reference.md`)
- [x] T311 Rewrite canonical token and component CSS guidance (`.opencode/skill/sk-doc-visual/references/css_patterns.md`)
- [x] T312 Rewrite navigation and active-state behavior guidance (`.opencode/skill/sk-doc-visual/references/navigation_patterns.md`)
- [x] T313 Rewrite dependency and pinning guidance (`.opencode/skill/sk-doc-visual/references/library_guide.md`)
- [x] T314 Rewrite quality gates for ledger profile behavior (`.opencode/skill/sk-doc-visual/references/quality_checklist.md`)
- [x] T315 Rewrite profile mapping for README outputs (`.opencode/skill/sk-doc-visual/references/user_guide_profiles.md`)
- [x] T316 Rewrite artifact style mapping guidance (`.opencode/skill/sk-doc-visual/references/artifact_profiles.md`)
- [x] T317 [P] Cross-check rewritten references against research gap matrix (`research.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Template Rewrite

- [x] T400 Rewrite README guide template to canonical ledger shell (`.opencode/skill/sk-doc-visual/assets/templates/readme-guide.html`)
- [x] T401 Rewrite implementation summary template to ledger shell (`.opencode/skill/sk-doc-visual/assets/templates/implementation-summary.html`)
- [x] T402 Rewrite artifact dashboard template with required JS behavior (`.opencode/skill/sk-doc-visual/assets/templates/artifact-dashboard.html`)
- [x] T403 Rewrite traceability board template with ledger shell and safe mermaid controls (`.opencode/skill/sk-doc-visual/assets/templates/traceability-board.html`)
- [x] T404 Rewrite mermaid flowchart template with ledger shell (`.opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html`)
- [x] T405 Rewrite architecture template with navigation shell and reveal behavior (`.opencode/skill/sk-doc-visual/assets/templates/architecture.html`)
- [x] T406 Rewrite data table template with responsive ledger styling (`.opencode/skill/sk-doc-visual/assets/templates/data-table.html`)
- [x] T407 [P] Verify each rewritten template maps to context component inventory (`context/context.md`)
- [x] T408 [P] Verify shared shell consistency across all seven templates (`template diff review`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Validator Alignment

- [x] T500 Update template validator token and typography policy checks (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)
- [x] T501 Update validator rules for allowed clock interval behavior and theme policy (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)
- [x] T502 [P] Update version drift expectations if dependency URLs changed (`.opencode/skill/sk-doc-visual/scripts/check-version-drift.sh`)
- [x] T503 [P] Update recorded library pins if needed (`.opencode/skill/sk-doc-visual/assets/library_versions.json`)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Verification and Completion Evidence

- [x] V600 Run Level 3 spec validation (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates`)
- [x] V601 Run placeholder scan for this spec folder (`.opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates`)
- [x] V602 Run HTML validator against all rewritten templates (`.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh`)
- [x] V603 Run version drift check (`.opencode/skill/sk-doc-visual/scripts/check-version-drift.sh`)
- [x] V604 Verify desktop/mobile behavior matches context rules (`manual browser verification`)
- [x] V605 Verify scope compliance against frozen file list (`changed-file audit`)
- [x] V606 Update checklist evidence for each completed P0/P1 gate (`checklist.md`)
- [x] V607 Finalize implementation summary with pass/fail outcomes (`implementation-summary.md`)
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Memory Save and Closeout

- [x] M700 Save context with required script (`node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates`)
- [x] M701 Confirm memory save output and index status (`memory script output`)
- [x] M702 Confirm readiness for completion claim under checklist gates (`checklist.md`)
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks T200-T503 are marked `[x]`.
- [x] All verification tasks V600-V607 are marked `[x]`.
- [x] Memory tasks M700-M702 are marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Scope lock compliance confirmed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Completion**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS
Includes full rewrite coverage + validator alignment + memory save
Prepared for /spec_kit:complete auto workflow
-->
