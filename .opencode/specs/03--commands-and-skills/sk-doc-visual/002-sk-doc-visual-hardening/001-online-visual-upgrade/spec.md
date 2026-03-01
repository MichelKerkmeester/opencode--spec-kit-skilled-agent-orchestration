---
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
title: "Feature Specification: Online Visual Upgrade (Next Stage) [001-online-visual-upgrade/spec]"
description: "The current sk-doc-visual hardening baseline is stable, but parity between router behavior, reference coverage, and template/version governance is not yet explicit. This c..."
trigger_phrases:
  - "feature"
  - "specification"
  - "online"
  - "visual"
  - "upgrade"
  - "spec"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Online Visual Upgrade (Next Stage)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-22 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current `sk-doc-visual` hardening baseline is stable, but parity between router behavior, reference coverage, and template/version governance is not yet explicit. This creates drift risk when templates or references evolve without synchronized validator checks.

### Purpose
Define and deliver the next-stage upgrade so routing behavior, versioned references, templates, and drift enforcement stay aligned with minimal cross-skill coupling.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Router parity contract between command routing behavior and `sk-doc-visual` docs.
- References and library version source-of-truth for templates, validator checks, and support assets.
- Template modernization for shared structure, metadata, and token consistency.
- Validator expansion plus drift checks to catch parity and template contract regressions.
- Minimal `sk-doc` touchpoints needed to keep documentation routing accurate.

### Out of Scope
- Parent spec edits in `.opencode/specs/03--commands-and-skills/sk-doc-visual/002-sk-doc-visual-hardening/`.
- New visual themes or non-upgrade redesign work.
- Cross-repo integrations and external deployment automation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-doc-visual/SKILL.md` | Modify | Align router usage notes with command/runtime parity contract |
| `.opencode/skill/sk-doc-visual/assets/library_versions.json` | Create | Machine-readable version source-of-truth for templates, validators, and references |
| `.opencode/skill/sk-doc-visual/references/quick_reference.md` | Modify | Refresh routing and usage guidance to match implemented hardening |
| `.opencode/skill/sk-doc-visual/references/library_guide.md` | Modify | Align library guidance with pinned versions and compatibility notes |
| `.opencode/skill/sk-doc-visual/references/quality_checklist.md` | Modify | Align verification guidance with implemented validator/drift checks |
| `.opencode/skill/sk-doc-visual/references/css_patterns.md` | Modify | Align CSS guidance with modernized template contract |
| `.opencode/skill/sk-doc-visual/references/navigation_patterns.md` | Modify | Align navigation guidance with upgraded templates/references |
| `.opencode/skill/sk-doc-visual/assets/templates/architecture.html` | Modify | Apply modernization schema and metadata block |
| `.opencode/skill/sk-doc-visual/assets/templates/data-table.html` | Modify | Apply modernization schema and metadata block |
| `.opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html` | Modify | Apply modernization schema and metadata block |
| `.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh` | Modify | Add parity and version matrix checks |
| `.opencode/skill/sk-doc-visual/scripts/check-version-drift.sh` | Create | Detect library/version/reference drift |
| `.opencode/skill/sk-doc/assets/opencode/skill_md_template.md` | Modify | Add minimal pointer to `sk-doc-visual` upgrade touchpoint |
| `.opencode/skill/sk-doc/references/skill_creation.md` | Modify | Add minimal pointer to `sk-doc-visual` upgrade touchpoint |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Router parity is documented and testable | `SKILL.md` contains runtime-aware routing primitives and references map, and parity checks pass |
| REQ-002 | References/version source-of-truth is complete | `assets/library_versions.json` plus updated references map templates, validator checks, and current version tags |
| REQ-003 | Templates are modernized consistently | All three templates include the agreed metadata block and canonical token conventions |
| REQ-004 | Validator and drift checks enforce contract | `validate-html-output.sh` plus `check-version-drift.sh` fail on parity/version/template contract drift |
| REQ-005 | `sk-doc` touchpoint remains minimal | Exactly one scoped cross-reference update in `sk-doc` with no broader doc refactor |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Upgrade guidance is runnable by maintainers | Commands for parity, drift, and validator checks are documented and reproducible |
| REQ-007 | Backward compatibility is defined | Matrix includes compatibility notes for existing template usage |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Router parity matrix exists and parity check command returns pass.
- **SC-002**: Version matrix covers all tracked upgrade artifacts with no missing entries.
- **SC-003**: All modernized templates pass validator checks.
- **SC-004**: Drift checker fails on intentionally mismatched fixture and passes on aligned state.
- **SC-005**: `sk-doc` changes are limited to one targeted touchpoint.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing `sk-doc-visual` validator conventions | Drift checks may conflict with current assumptions | Reuse existing check naming and add focused assertions only |
| Dependency | Template baseline quality | Inconsistent legacy patterns can slow modernization | Define a strict modernization schema first, then apply uniformly |
| Risk | Over-expanding `sk-doc` scope | Scope creep beyond minimal touchpoint | Enforce single-file, single-section touchpoint constraint |
| Risk | Matrix maintenance burden | Matrix can become stale quickly | Add drift script check to require matrix/template parity |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Combined validator + drift checks run in under 10 seconds on local machine.
- **NFR-P02**: No new heavy dependencies; use shell tooling already present in repo.

### Security
- **NFR-S01**: Scripts remain read-only for checked files.
- **NFR-S02**: No secrets or absolute local paths introduced in docs/templates/scripts.

### Reliability
- **NFR-R01**: Repeated runs produce deterministic pass/fail results.
- **NFR-R02**: Matrix/check output is stable across supported runtimes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing matrix row: drift checker must fail and report missing artifact.
- Extra template token: validator must flag out-of-contract token usage.
- Empty parity mapping entry: parity check must fail with actionable output.

### Error Scenarios
- Router rule renamed without docs update: parity check fails.
- Template metadata block removed in one file: validator fails modernization check.
- Version bump without matrix update: drift script fails with mismatch report.

### State Transitions
- Baseline to modernized state must preserve existing pass behavior before adding stricter checks.
- Rollback must restore previous templates and validator rules without orphan matrix entries.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:acceptance-scenarios -->
## L2: ACCEPTANCE SCENARIOS

1. **Given** router triggers for `sk-doc-visual` in supported runtimes, **When** parity checks run, **Then** expected route outcomes match the matrix.
2. **Given** all tracked artifacts are present, **When** version matrix validation runs, **Then** no missing or stale entries are reported.
3. **Given** modernized templates, **When** validator checks run, **Then** metadata and token contract checks pass for all three templates.
4. **Given** a deliberate parity or matrix mismatch fixture, **When** drift checks run, **Then** the script fails with a specific mismatch report.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | Multiple docs/scripts/templates across one skill plus one minimal cross-skill touchpoint |
| Risk | 15/25 | Contract drift and false-positive validation risk |
| Research | 12/20 | Requires parity/matrix design and rule mapping |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should version matrix entries track semantic versions only, or date-stamped build revisions as well?
- Should drift check run by default in existing validation script or as a separate explicit command?
<!-- /ANCHOR:questions -->
