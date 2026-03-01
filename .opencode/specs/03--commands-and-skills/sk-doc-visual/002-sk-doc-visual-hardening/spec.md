---
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
title: "Feature Specification: sk-doc-visual Hardening [041-sk-doc-visual-hardening/spec]"
description: "Level 2 specification for validator/template hardening of sk-doc-visual, scoped to documented P0/P1 requirements and verification evidence."
trigger_phrases:
  - "feature"
  - "specification"
  - "visual"
  - "explainer"
  - "hardening"
  - "spec"
  - "041"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: sk-doc-visual Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

## 1. OVERVIEW

Level 2 specification for validator/template hardening of `sk-doc-visual`, scoped to documented P0/P1 requirements and verification evidence.

## PHASE DOCUMENTATION MAP

| Phase | Spec |
|-------|------|
| `001-online-visual-upgrade` | `001-online-visual-upgrade/spec.md` |
---

<!-- ANCHOR:metadata -->
## 2. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed (2026-02-22) |
| **Created** | 2026-02-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 3. PROBLEM & PURPOSE

### Problem Statement
`sk-doc-visual` hardening work requires strict validator and template consistency to prevent regressions in generated HTML quality checks. The target requirements are specific: resolve the `VE_TOKEN_COUNT` bug, enforce canonical `--ve-*` token naming in all three reference templates, and preserve strict typography rules while allowing `Roboto Mono` in non-primary usage.

### Purpose
Deliver a validator/template/docs state where required hardening checks are explicit, testable, and verified with exit-code-based evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- Harden `VE_TOKEN_COUNT` detection in the HTML validator.
- Canonicalize and verify `--ve-*` token usage across all three templates.
- Ensure typography guardrails allow `Roboto Mono` while still blocking Inter/Roboto/Arial primary display usage.
- Ensure multiline `background-image` patterns are detected by validator checks.
- Correct the sequence syntax doc typo (`->>/-->` to intended form).
- Capture verification evidence showing validator exit code `0` for all three templates.

### Out of Scope
- New template layouts, visual redesign, or content rewrites unrelated to hardening.
- New validator checks outside the listed P0/P1 requirements.
- Changes outside `sk-doc-visual` files listed below.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh` | Modify | Fix `VE_TOKEN_COUNT`, typography rule exception for `Roboto Mono`, and multiline `background-image` detection |
| `.opencode/skill/sk-doc-visual/assets/templates/architecture.html` | Modify | Ensure canonical `--ve-*` token namespace |
| `.opencode/skill/sk-doc-visual/assets/templates/data-table.html` | Modify | Ensure canonical `--ve-*` token namespace |
| `.opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html` | Modify | Ensure canonical `--ve-*` token namespace |
| `.opencode/skill/sk-doc-visual/references/library_guide.md` | Modify | Correct sequence syntax typo (`->>/-->`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix `VE_TOKEN_COUNT` bug in validator | Running validator on each template reports non-zero `--ve-*` token counts when tokens exist and no false `No --ve-* design token variables found` failure |
| REQ-002 | Canonicalize templates to `--ve-*` namespace | No legacy non-`--ve-*` theme tokens remain in the three templates; all token references resolve consistently |
| REQ-003 | All 3 templates validator exit code is `0` | `validate-html-output.sh` returns `0` for `architecture.html`, `data-table.html`, and `mermaid-flowchart.html` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Allow `Roboto Mono` while still blocking Inter/Roboto/Arial primary usage | Validator passes files using `Roboto Mono` as non-primary/secondary mono font and fails when Inter/Roboto/Arial are primary display/body fonts |
| REQ-005 | Detect multiline `background-image` definitions | Validator check passes for templates where `background-image` gradients span multiple lines |
| REQ-006 | Fix docs typo `->>/-->` | `library_guide.md` no longer contains typo form and documents intended sequence notation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: Validator check 11 reports valid `--ve-*` token counts for all three templates.
- **SC-002**: All three templates produce validator exit code `0`.
- **SC-003**: Typography guardrail behavior explicitly allows `Roboto Mono` and still blocks Inter/Roboto/Arial as primary.
- **SC-004**: Multiline `background-image` patterns are recognized by validator checks.
- **SC-005**: The `->>/-->` typo is removed from docs and replaced with correct syntax guidance.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Validator logic in `validate-html-output.sh` | Incorrect parsing keeps false failures | Add command-level regression checks per requirement |
| Dependency | Template token consistency across 3 files | Partial migration can leave mixed namespaces | Add explicit template-by-template verification commands |
| Risk | Typography regex over-correction | Could accidentally allow forbidden primary fonts | Add positive (`Roboto Mono`) and negative (Inter/Roboto/Arial primary) test cases |
| Risk | Background detection regex mismatch | Could miss multiline gradients and regress quality signal | Validate against real multiline template blocks |
| Risk | Doc typo fix ambiguity | Wrong syntax replacement may introduce new confusion | Verify against sequence examples already present in same document |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Validator runtime for each template remains within current order of magnitude (<2s per file on local workstation).
- **NFR-P02**: No additional external dependencies are introduced for validator execution.

### Security
- **NFR-S01**: Validator remains read-only for target HTML files.
- **NFR-S02**: No secrets or local absolute paths are introduced into templates/docs.

### Reliability
- **NFR-R01**: Repeated validator runs on same templates produce deterministic exit codes.
- **NFR-R02**: Requirement checks are evidenced with reproducible shell commands.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty token set: validator must fail token check when `--ve-*` variables are truly absent.
- High token count: validator must deduplicate repeated token names correctly.
- Multiline CSS: `background-image` checks must work when gradients are split across lines.

### Error Scenarios
- Font URL includes `Roboto+Mono`: should not fail primary-font rule by itself.
- Font URL includes `family=Roboto`: should fail primary-font guardrail when used as primary.
- Mixed old/new tokens in template: validator should surface failures until fully canonicalized.

### State Transitions
- Pre-fix to post-fix transition requires baseline evidence and post-fix evidence in checklist.
- Completion claim is blocked until all P0 items are checked with evidence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:acceptance-scenarios -->
## L2: ACCEPTANCE SCENARIOS

1. **Given** `architecture.html` with canonical `--ve-*` tokens, **When** validator runs, **Then** check 11 reports token coverage and exits `0`.
2. **Given** `data-table.html` with multiline `background-image` gradients, **When** validator runs, **Then** background atmosphere check passes.
3. **Given** a test HTML using `Roboto Mono` as mono/supporting font only, **When** validator runs, **Then** typography guardrail does not fail.
4. **Given** a test HTML using Inter/Roboto/Arial as primary display/body font, **When** validator runs, **Then** typography guardrail fails.
5. **Given** `library_guide.md`, **When** scanned for typo string `->>/-->`, **Then** no matches are returned and corrected syntax guidance is present.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One validator script, three templates, one docs file |
| Risk | 16/25 | Regex and guardrail changes can create false pass/fail behavior |
| Research | 12/20 | Requires baseline capture and targeted validator verification |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None at spec drafting time; implementation follows explicit P0/P1 requirements.
<!-- /ANCHOR:questions -->
