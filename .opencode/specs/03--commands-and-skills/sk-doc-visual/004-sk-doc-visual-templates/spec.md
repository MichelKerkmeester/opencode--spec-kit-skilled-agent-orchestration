---
title: "Feature Specification: sk-doc-visual Template Improvement [044-sk-doc-visual-template-improvement/spec]"
description: "Level 3 control spec for modernizing sk-doc-visual docs/templates to the README Ledger profile with validator alignment and completion workflow rigor."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "sk-doc-visual"
  - "template modernization"
  - "README Ledger"
  - "level 3"
  - "spec_kit complete"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: sk-doc-visual Template Improvement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This spec defines the Level 3 execution contract for modernizing `sk-doc-visual` to the provided README Ledger visual system and behavior profile. The workstream updates skill guidance, reference docs, templates, and validation policy so `/spec_kit:complete` can run in auto mode without scope drift.

**Key Decisions**: adopt full-system modernization (not partial), keep deterministic validation gates, require evidence-first completion.

**Critical Dependencies**: `context/README.html`, `context/context.md`, and `research.md` in this spec folder.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-23 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-doc-visual` currently has policy and template mismatches against the provided README Ledger context (token system, typography policy, layout shell, components, and interaction behavior). Without a locked Level 3 plan, `/spec_kit:complete` could produce partial modernization or validator conflicts.

### Purpose
Deliver a frozen, implementation-ready Level 3 spec that drives complete modernization across skill docs, references, templates, and validators with verification gates required before completion claim.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Populate all required Level 3 root docs in this spec folder for `/spec_kit:complete` auto workflow.
- Rewrite `sk-doc-visual` skill guidance to support README Ledger profile rules.
- Rewrite reference docs for CSS, navigation, libraries, quick reference, quality checklist, and profile mapping.
- Rewrite all template artifacts to the shared README Ledger shell.
- Align validator behavior to modernized token/typography/theme/script policy.
- Run validation workflow and save session memory context.

### Scope Lock (Frozen)
- Only files explicitly listed in this section are allowed for implementation edits.
- No unrelated refactors or style cleanups outside listed files.
- `research.md` is an intentional external input artifact and must remain untouched.
- Any new request discovered during execution must be captured as follow-up work, not silently added to this spec.

### Out of Scope
- Changes to unrelated skills, agents, or commands outside `sk-doc-visual` and listed validator/runtime assets.
- New product features beyond README Ledger parity and validation alignment.
- Additional design system experimentation not present in context inputs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/spec.md` | Modify | Level 3 scope and requirement contract |
| `.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/plan.md` | Modify | Auto workflow plan and phase sequencing |
| `.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/tasks.md` | Modify | Task IDs for rewrite, validation, and memory save |
| `.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/checklist.md` | Modify | Evidence-first Level 3 quality gates |
| `.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/decision-record.md` | Modify | ADRs for modernization and validator policy |
| `.opencode/specs/03--commands-and-skills/sk-doc-visual/004-sk-doc-visual-templates/implementation-summary.md` | Modify | Completion-ready summary scaffold |
| `.opencode/skill/sk-doc-visual/SKILL.md` | Modify | README Ledger profile rules and workflow guidance |
| `.opencode/skill/sk-doc-visual/references/quick_reference.md` | Modify | README Ledger starter and command quick refs |
| `.opencode/skill/sk-doc-visual/references/css_patterns.md` | Modify | Canonical tokens, component classes, compatibility notes |
| `.opencode/skill/sk-doc-visual/references/navigation_patterns.md` | Modify | 260px sidebar shell and active-dot TOC behavior |
| `.opencode/skill/sk-doc-visual/references/library_guide.md` | Modify | Runtime dependency strategy and pinning expectations |
| `.opencode/skill/sk-doc-visual/references/quality_checklist.md` | Modify | Behavior and accessibility checks for ledger profile |
| `.opencode/skill/sk-doc-visual/references/user_guide_profiles.md` | Modify | README ledger profile mapping and required sections |
| `.opencode/skill/sk-doc-visual/references/artifact_profiles.md` | Modify | Style-profile mapping for artifacts |
| `.opencode/skill/sk-doc-visual/assets/templates/readme-guide.html` | Rewrite | Canonical README Ledger demonstration template |
| `.opencode/skill/sk-doc-visual/assets/templates/implementation-summary.html` | Rewrite | Ledger shell + implementation summary view |
| `.opencode/skill/sk-doc-visual/assets/templates/artifact-dashboard.html` | Rewrite | Ledger shell + dynamic dashboard behavior |
| `.opencode/skill/sk-doc-visual/assets/templates/traceability-board.html` | Rewrite | Ledger shell + traceability/mermaid behavior |
| `.opencode/skill/sk-doc-visual/assets/templates/mermaid-flowchart.html` | Rewrite | Ledger shell + flowchart behavior |
| `.opencode/skill/sk-doc-visual/assets/templates/architecture.html` | Rewrite | Ledger shell + architecture narrative layout |
| `.opencode/skill/sk-doc-visual/assets/templates/data-table.html` | Rewrite | Ledger shell + responsive data-table pattern |
| `.opencode/skill/sk-doc-visual/scripts/validate-html-output.sh` | Modify | Accept modernization policy without weakening core safety checks |
| `.opencode/skill/sk-doc-visual/scripts/check-version-drift.sh` | Modify (if needed) | Keep pinned dependency drift checks aligned |
| `.opencode/skill/sk-doc-visual/assets/library_versions.json` | Modify (if needed) | Record any dependency pin changes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All six Level 3 root docs are fully populated | No template placeholder tokens remain and validation passes for spec docs |
| REQ-002 | Scope lock is explicit and frozen | `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all enforce same boundary |
| REQ-003 | Task IDs cover full rewrite surface | `tasks.md` includes IDs for skill, references, templates, validators, verification, and memory save |
| REQ-004 | `/spec_kit:complete` auto workflow is implementation-ready | `plan.md` defines deterministic phase sequence and hard stop conditions |
| REQ-005 | Research/context inputs are traceable | Requirements and plan explicitly cite `context/README.html`, `context/context.md`, and `research.md` |
| REQ-006 | Validation workflow is explicit | Commands and expected outcomes are documented in plan/checklist |
| REQ-007 | Memory preservation is part of completion | Dedicated memory-save task and checklist gate are present |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Skill guidance rewrite strategy is documented | Plan/tasks detail target outcomes for `SKILL.md` |
| REQ-009 | Reference rewrite strategy is documented | Plan/tasks enumerate required reference files |
| REQ-010 | Template rewrite strategy is documented | Plan/tasks enumerate all seven templates |
| REQ-011 | Validator alignment strategy is documented | Plan/tasks include `validate-html-output.sh` policy updates |
| REQ-012 | Checklist is evidence-first | Every P0/P1 checklist item includes an evidence field |
| REQ-013 | Implementation summary is completion-ready | `implementation-summary.md` has sections for verification outcomes and limitations |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Level 3 root docs are complete and contain no unresolved template placeholders.
- **SC-002**: Scope lock is consistent across spec, plan, tasks, and checklist.
- **SC-003**: Task map includes end-to-end IDs for rewrite, validator updates, verification, and memory save.
- **SC-004**: `/spec_kit:complete` auto mode can run from this documentation set without missing prerequisites.
- **SC-005**: Evidence fields are present for all P0/P1 checklist entries.
- **SC-006**: Validation commands and expected pass criteria are documented and executable.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `context/README.html` | Visual/layout contract becomes ambiguous if ignored | Keep context-derived acceptance points explicit in tasks/checklist |
| Dependency | `context/context.md` | Component parity may drift | Use component inventory as verification reference |
| Dependency | `research.md` | Implementation surface could be incomplete | Use research gap matrix to drive file list and task IDs |
| Risk | Partial template rewrite | Inconsistent artifact behavior | Require all seven templates in scope and checklist |
| Risk | Validator policy drift | False failures or missed regressions | Add dedicated validator-alignment phase and verification items |
| Risk | Scope creep | Delivery delay and review noise | Enforce frozen file list and out-of-scope rejection rule |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Documentation validation commands complete successfully in local workflow.
- **NFR-P02**: Rewritten templates preserve desktop/mobile responsiveness expected by context profile.

### Security
- **NFR-S01**: No credentials or sensitive data are introduced in rewritten docs/templates/scripts.
- **NFR-S02**: Runtime dependencies remain pinned and version-drift checkable.

### Reliability
- **NFR-R01**: Auto workflow has deterministic phase order with blocker handling.
- **NFR-R02**: Rollback procedure remains documented and testable.

---

## 8. EDGE CASES

### Data Boundaries
- Missing context inputs: halt implementation and record blocker evidence.
- Existing templates with custom per-file behavior: preserve required behavior while converging shared shell.

### Error Scenarios
- Validator fails after policy change: block completion and remediate before proceeding.
- Unexpected out-of-scope file requirement appears: create follow-up spec task instead of expanding current scope.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Cross-cutting rewrite across skill, references, templates, validators |
| Risk | 14/25 | Policy migration plus verification strictness |
| Research | 16/20 | Requires context + research synthesis for accurate parity |
| Multi-Agent | 2/15 | LEAF execution only, no nested dispatch |
| Coordination | 10/15 | Multiple phases and strict completion gating |
| **Total** | **63/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Style-policy mismatch between skill docs and validator | High | Medium | Implement validator alignment phase before final verification |
| R-002 | Incomplete template migration | High | Medium | Require all seven templates in scope and completion checks |
| R-003 | Hidden scope drift during auto mode | Medium | Medium | Add explicit scope lock checks before and after implementation |
| R-004 | Missing memory capture at closeout | Medium | Low | Include dedicated memory-save task and checklist gate |

---

## 11. USER STORIES

### US-001: Controlled Modernization (Priority: P0)

**As a** maintainer, **I want** a frozen Level 3 scope with explicit file targets, **so that** modernization can run in auto mode without drift.

**Acceptance Criteria**:
1. Given this spec, when implementation begins, then only listed files are eligible for edit.
2. Given a new idea mid-run, when it is out of scope, then it is tracked as follow-up work.

---

### US-002: Full Asset Rewrite Coverage (Priority: P0)

**As a** maintainer, **I want** tasks for skill docs, references, templates, and validator updates, **so that** no part of the modernization surface is missed.

**Acceptance Criteria**:
1. Given `tasks.md`, when phases are reviewed, then every required file group has task IDs.
2. Given completion review, when tasks are checked, then rewrite + validation + memory save coverage is present.

---

### US-003: Evidence-First Completion (Priority: P1)

**As a** reviewer, **I want** a Level 3 checklist with explicit evidence fields, **so that** completion claims are auditable.

**Acceptance Criteria**:
1. Given checklist P0/P1 items, when inspected, then each item includes evidence slot.
2. Given final verification, when completion is claimed, then evidence fields are filled.

---

### US-004: Context-Driven Fidelity (Priority: P1)

**As a** designer-developer, **I want** implementation decisions tied to context and research inputs, **so that** outputs match the intended ledger system.

**Acceptance Criteria**:
1. Given requirements and plan, when reviewed, then context/research files are referenced as canonical inputs.
2. Given template verification, when manual checks run, then parity criteria align to documented context features.

---

## 12. OPEN QUESTIONS

- None for this documentation pass. Execution-phase clarifications, if any, will be captured as checklist blockers.
<!-- /ANCHOR:questions -->

---

## 13. ACCEPTANCE SCENARIOS

### Scenario 1: Root docs completeness
- **Given** the spec root docs are opened, **When** content is reviewed, **Then** all six required Level 3 files are populated with concrete project data.

### Scenario 2: Scope lock enforcement
- **Given** implementation starts, **When** a file edit is proposed, **Then** the file must be in the scope lock table or be rejected as follow-up work.

### Scenario 3: Rewrite coverage
- **Given** `tasks.md` is reviewed, **When** phase coverage is checked, **Then** skill, references, templates, validator alignment, and memory save all have task IDs.

### Scenario 4: Validation readiness
- **Given** the plan and checklist are reviewed, **When** command sections are checked, **Then** spec validation and placeholder checks are present with evidence expectations.

### Scenario 5: Auto workflow readiness
- **Given** `/spec_kit:complete` auto mode is used, **When** phases execute, **Then** the documented phase order can be followed without missing prerequisites.

### Scenario 6: Completion evidence integrity
- **Given** completion is requested, **When** checklist items are audited, **Then** P0/P1 entries require evidence and unresolved blockers prevent completion claim.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC
Inputs: context/README.html, context/context.md, research.md
Workflow target: /spec_kit:complete auto mode with evidence-first verification
-->
