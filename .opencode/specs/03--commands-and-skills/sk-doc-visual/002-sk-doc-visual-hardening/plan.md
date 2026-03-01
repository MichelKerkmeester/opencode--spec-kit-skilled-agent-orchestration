---
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
title: "Implementation Plan: sk-doc-visual Hardening [041-sk-doc-visual-hardening/plan]"
description: "Implementation sequence for delivering and verifying sk-doc-visual hardening with minimal, requirement-bound changes."
trigger_phrases:
  - "implementation"
  - "plan"
  - "visual"
  - "explainer"
  - "hardening"
  - "041"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: sk-doc-visual Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

## 1. OVERVIEW

Implementation sequence for delivering and verifying `sk-doc-visual` hardening with minimal, requirement-bound changes.
---

<!-- ANCHOR:summary -->
## 2. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash + HTML/CSS + Markdown |
| **Framework** | Static validator script + reference templates |
| **Storage** | None |
| **Testing** | Shell command checks (`bash`, `rg`) with exit-code validation |

### Overview
This plan hardens `sk-doc-visual` by locking validator behavior and template/doc conformance to the required P0/P1 criteria. Work proceeds in five explicit phases: baseline capture, validator fixes, template token migration, docs correction, and validation+summary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 3. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Validation commands executed with expected results
- [x] Docs updated (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 4. ARCHITECTURE

### Pattern
Scripted validation pipeline with reference-template and docs consistency checks.

### Key Components
- **Validator Script** (`validate-html-output.sh`): Enforces structural, token, typography, and atmosphere checks.
- **Reference Templates** (`architecture.html`, `data-table.html`, `mermaid-flowchart.html`): Canonical examples for generated output style.
- **Reference Guide** (`library_guide.md`): Authoritative Mermaid syntax documentation.

### Data Flow
1. Run baseline validator on all three templates and capture exit/status output.
2. Apply validator fixes for token counting, font guardrails, and multiline background detection.
3. Canonicalize template tokens to `--ve-*`.
4. Correct docs typo in `library_guide.md`.
5. Re-run validator and targeted `rg` checks to confirm all P0/P1 criteria.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Baseline capture
- [x] Capture current validator output and exit code for each template.
- [ ] Record baseline evidence in `scratch/` for pre/post comparison.

### Phase 2: Validator fixes
- [x] Fix `VE_TOKEN_COUNT` detection bug.
- [x] Update typography guardrails to allow `Roboto Mono` while blocking Inter/Roboto/Arial primary use.
- [x] Ensure multiline `background-image` detection is robust.

### Phase 3: Template token migration
- [x] Ensure `architecture.html` uses canonical `--ve-*` token namespace.
- [x] Ensure `data-table.html` uses canonical `--ve-*` token namespace.
- [x] Ensure `mermaid-flowchart.html` uses canonical `--ve-*` token namespace.

### Phase 4: Docs correction
- [x] Correct `->>/-->` typo in `library_guide.md`.
- [x] Verify corrected sequence syntax string is present.

### Phase 5: Validation+summary
- [x] Run validator for all three templates and confirm exit code `0`.
- [x] Run targeted regex checks for token namespace, typography rule behavior, and doc typo removal.
- [x] Update `checklist.md` evidence and completion status.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Script validation | End-to-end validator behavior per template | `bash .opencode/skill/sk-doc-visual/scripts/validate-html-output.sh <template>` |
| Policy checks | Font/token/doc rule assertions | `rg` |
| Manual review | Confirm check output messages align with requirements | Terminal output review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh` | Internal | Green | Core hardening cannot proceed |
| `.opencode/skill/sk-doc-visual/assets/templates/*.html` | Internal | Green | Token migration and validator exit checks cannot be completed |
| `.opencode/skill/sk-doc-visual/references/library_guide.md` | Internal | Green | Docs typo requirement cannot be completed |
| Shell tooling (`bash`, `rg`) | Internal | Green | Verification evidence cannot be generated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: Validator starts producing false positives/false negatives, or template output quality regresses.
- **Procedure**: Revert hardening edits in validator/templates/docs, rerun baseline commands, confirm previous behavior is restored.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (baseline capture) ─► Phase 2 (validator fixes) ─► Phase 3 (template token migration)
                                                       └► Phase 4 (docs correction)
Phase 3 + Phase 4 ───────────────────────────────────────────────► Phase 5 (validation+summary)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline capture | None | Validator fixes |
| Validator fixes | Baseline capture | Template token migration, validation+summary |
| Template token migration | Validator fixes | Validation+summary |
| Docs correction | Baseline capture | Validation+summary |
| Validation+summary | Validator fixes, template token migration, docs correction | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline capture | Low | 30-45 minutes |
| Validator fixes | Medium | 1.5-3 hours |
| Template token migration | Medium | 1-2 hours |
| Docs correction | Low | 15-30 minutes |
| Validation+summary | Medium | 45-90 minutes |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline evidence captured before edits
- [x] Post-fix validator output captured
- [x] P0/P1 checklist evidence populated

### Rollback Procedure
1. Revert validator and template/doc hardening commits.
2. Re-run baseline commands on all three templates.
3. Confirm outputs match baseline evidence.
4. Document rollback outcome in `checklist.md`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
