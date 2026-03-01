---
title: "Feature Specification: SpecKit-aligned doc visual upgrade [template:level_2/spec.md]"
description: "Level 2 specification for aligning sk-doc-visual commands, references, templates, and validator fixtures with SpecKit artifact profiles and metadata contracts."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "specification"
  - "doc visual"
  - "speckit"
  - "artifact profile"
  - "metadata contract"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: SpecKit-aligned doc visual upgrade

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-02-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current `sk-doc-visual` workflow is command-driven but not yet SpecKit-artifact aware. Commands and validation assets do not consistently enforce artifact profile metadata, source traceability markers, or SpecKit level signaling across generated outputs.

### Purpose
Deliver a single SpecKit-aligned doc visual contract across commands, references, templates, and validator fixtures so generated artifacts are explicit, traceable, and verifiable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `sk-doc-visual` skill documentation and references for artifact-aware behavior.
- Add artifact profile references for SpecKit artifacts and user guide artifacts.
- Add two new visual templates for artifact dashboards and traceability boards.
- Update all five `visual_explainer` command markdown files (`generate`, `plan-review`, `diff-review`, `recap`, `fact-check`).
- Update validator logic and test fixtures for SpecKit metadata + traceability checks.

### Out of Scope
- Changes to non-doc-visual command groups outside `.opencode/command/visual_explainer/`.
- New external libraries or runtime dependencies.
- Redesign of existing base templates (`architecture.html`, `data-table.html`, `mermaid-flowchart.html`) unrelated to SpecKit alignment.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-doc-visual/SKILL.md` | Modify | Add SpecKit-aware routing and reference loading rules |
| `.opencode/skill/sk-doc-visual/references/quick_reference.md` | Modify | Add artifact metadata and command contract reminders |
| `.opencode/skill/sk-doc-visual/references/quality_checklist.md` | Modify | Add metadata + traceability verification checks |
| `.opencode/skill/sk-doc-visual/references/artifact_profiles.md` | Create | Define artifact profile schema and detectors |
| `.opencode/skill/sk-doc-visual/references/user_guide_profiles.md` | Create | Define README and install guide profile mapping |
| `.opencode/skill/sk-doc-visual/assets/templates/artifact-dashboard.html` | Create | Add SpecKit artifact dashboard starter template |
| `.opencode/skill/sk-doc-visual/assets/templates/traceability-board.html` | Create | Add traceability board starter template |
| `.opencode/command/visual_explainer/generate.md` | Modify | Add artifact-aware contract and metadata output requirements |
| `.opencode/command/visual_explainer/plan-review.md` | Modify | Add artifact-aware contract and metadata output requirements |
| `.opencode/command/visual_explainer/diff-review.md` | Modify | Add artifact-aware contract and metadata output requirements |
| `.opencode/command/visual_explainer/recap.md` | Modify | Add artifact-aware contract and metadata output requirements |
| `.opencode/command/visual_explainer/fact-check.md` | Modify | Add artifact-aware contract and metadata output requirements |
| `.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh` | Modify | Add checks for SpecKit metadata and traceability markers |
| `.opencode/skill/sk-doc-visual/scripts/tests/test-validator-fixtures.sh` | Modify | Include SpecKit metadata + traceability fixture coverage |
| `.opencode/skill/sk-doc-visual/scripts/tests/fixtures/speckit-artifact-pass.html` | Create | Add passing SpecKit artifact fixture with required metadata contract |
| `.opencode/skill/sk-doc-visual/scripts/tests/fixtures/speckit-artifact-missing-meta.html` | Create | Add failing fixture for missing required SpecKit metadata fields |
| `.opencode/skill/sk-doc-visual/scripts/tests/fixtures/speckit-traceability-missing-crossrefs.html` | Create | Add failing fixture for traceability cross-reference requirements |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Artifact-aware command contracts | Each command file (`generate.md`, `plan-review.md`, `diff-review.md`, `recap.md`, `fact-check.md`) explicitly defines artifact-aware input and output behavior, including supported artifact types and source-document expectations. |
| REQ-002 | Output metadata contract (`ve-artifact-type`, `ve-source-doc`, `ve-speckit-level`, `ve-view-mode`) | Command contracts and references define all four metadata fields with allowed values, default behavior, and required presence in generated outputs. |
| REQ-003 | Artifact profile schema and detectors | `artifact_profiles.md` is created with a schema table, detector rules, and deterministic mapping from input source to artifact profile. |
| REQ-004 | User guide profiles (README + install guide) | `user_guide_profiles.md` is created and documents profile rules for README and install guide artifacts, including command usage guidance. |
| REQ-005 | Two template additions | `artifact-dashboard.html` and `traceability-board.html` are added and usable as command starter templates. |
| REQ-006 | Validator/test fixture updates | Validator and fixture test script enforce and verify SpecKit metadata and traceability checks with pass/fail fixture coverage. |
| REQ-007 | Verification command completion | Required verification commands complete successfully: validator fixture tests, command markdown validation, template validation for both new templates, `package_skill.py --no-zip`, and spec `validate.sh`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Update quick reference and quality checklist | `quick_reference.md` and `quality_checklist.md` include SpecKit artifact and metadata guidance used by all five command flows. |
| REQ-009 | Maintain existing command behavior baseline | Existing command entry points and argument patterns remain backward-compatible while adding SpecKit contract details. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five command markdown files include artifact-aware contract language and the four-field metadata contract.
- **SC-002**: Both new reference files exist and are linked from `SKILL.md` routing or reference guidance.
- **SC-003**: Both new templates are present and pass validator checks when rendered as compliant outputs.
- **SC-004**: Validator fixture script covers at least one metadata-fail and one traceability-fail scenario.
- **SC-005**: `validate_document.py --type command` passes for all five updated command files.
- **SC-006**: `package_skill.py --no-zip` and spec `validate.sh` both pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing command contract patterns in `.opencode/command/visual_explainer/*.md` | Contract drift can create inconsistent behavior across commands | Apply a shared metadata contract block to all five command files |
| Dependency | Validator and fixture coupling | New validator checks can fail legacy fixtures unexpectedly | Update fixtures in same workstream and run fixture script after each validator change |
| Risk | Overly strict metadata checks | Valid outputs may fail due to missing optional context | Define required vs optional metadata clearly in schema and validator messages |
| Risk | Profile detector ambiguity | Wrong artifact type selection can misroute template choice | Use deterministic detector precedence and explicit tie-break rules |
| Risk | Documentation mismatch | Skill references and command docs can diverge | Add command validation and package/spec validation to completion gates |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Validator runtime remains under 3 seconds for each fixture file on local execution.
- **NFR-P02**: Command documentation updates do not add new runtime dependencies.

### Security
- **NFR-S01**: No credentials, local absolute paths, or machine-specific identifiers are introduced.
- **NFR-S02**: Metadata fields are declarative and do not execute dynamic code.

### Reliability
- **NFR-R01**: Artifact detector rules produce deterministic profile selection for the same input.
- **NFR-R02**: Re-running fixture tests and validation commands yields stable pass/fail outcomes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing source document path: command must fail fast with a clear metadata error.
- Unknown artifact type hint: detector must choose fallback profile and report why.
- Mixed SpecKit level signals: command must use explicit input level precedence over inferred level.

### Error Scenarios
- Metadata keys partially present: validator fails and reports the missing keys.
- Traceability section missing: validator fails with targeted remediation text.
- Invalid view mode value: command returns `STATUS=FAIL` with allowed `ve-view-mode` values.

### State Transitions
- Existing command contract to artifact-aware contract migration preserves command names and usage examples.
- Fixture updates must include both compliant and non-compliant states for new checks.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:acceptance-scenarios -->
## L2: ACCEPTANCE SCENARIOS

1. **Given** `/doc-visual:generate` receives a SpecKit artifact source, **when** it builds output, **then** output metadata includes `ve-artifact-type`, `ve-source-doc`, `ve-speckit-level`, and `ve-view-mode`.
2. **Given** `/doc-visual:plan-review` reads a plan file, **when** the detector runs, **then** it maps to the correct artifact profile and template guidance.
3. **Given** `artifact-dashboard.html` is used as a starter, **when** validator runs, **then** SpecKit metadata and traceability checks pass.
4. **Given** a fixture missing traceability metadata, **when** `test-validator-fixtures.sh` runs, **then** the fixture fails with the expected exit code.
5. **Given** all five command markdown files are updated, **when** `validate_document.py --type command` runs on each file, **then** each command document passes validation.
6. **Given** skill and spec validations are executed, **when** `package_skill.py --check` and `validate.sh` run, **then** both commands return pass status.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Five command docs, skill references, two templates, validator, and fixtures |
| Risk | 17/25 | Contract and validator changes can cause regressions if inconsistent |
| Research | 14/20 | Requires profile schema design and detector logic alignment |
| **Total** | **51/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- No open questions at spec creation time. The implementation scope is fixed to REQ-001 through REQ-009.
<!-- /ANCHOR:questions -->
