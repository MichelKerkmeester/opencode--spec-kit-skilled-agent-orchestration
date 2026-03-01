---
title: "Feature Specification: SpecKit Template ToC Policy Enforcement [007-spec-kit-templates/spec.md]"
description: "Level 2 documentation-only scope to enforce the policy that only research.md may contain a ToC and to retro-clean non-research spec artifacts."
trigger_phrases:
  - "spec kit"
  - "templates"
  - "toc policy"
  - "retro cleanup"
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify | v2.2"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: SpecKit Template ToC Policy Enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec-folder artifacts currently contain inconsistent Table of Contents sections in non-`research.md` files, which violates the target policy and creates validation/doc-style drift. The target spec folder for this work is also empty and needs complete Level 2 documentation for traceability.

### Purpose
Deliver a documentation-only update that applies the ToC policy consistently and records the work in a complete Level 2 spec folder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Populate this folder with Level 2 documentation files using system-spec-kit template structure.
- Remove ToC sections from non-`research.md` standard artifacts in the specified existing spec folders.
- Validate all affected folders with `validate.sh` and capture outcomes.

### Out of Scope
- Any code or script logic changes in skill tooling.
- Any edits to `research.md` files.
- Any edits in `memory/`, `scratch/`, or `context/` subtrees.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-spec-kit-templates/spec.md` | Create | Level 2 specification for this doc-only change |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-spec-kit-templates/plan.md` | Create | Implementation/verification plan |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-spec-kit-templates/tasks.md` | Create | Task tracking for execution |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-spec-kit-templates/checklist.md` | Create | Verification checklist with evidence |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-spec-kit-templates/implementation-summary.md` | Create | Completion summary and outcomes |
| `.opencode/specs/03--commands-and-skills/sk-code/z_archive/013-sk-code-opencode-alignment-hardening{spec,plan,tasks,checklist,decision-record,implementation-summary}.md` | Modify | Remove disallowed ToC sections |
| `.opencode/specs/03--commands-and-skills/sk-doc-visual/002-sk-doc-visual-hardening/{spec,plan,tasks,checklist,implementation-summary}.md` | Modify | Remove disallowed ToC sections |
| `.opencode/specs/03--commands-and-skills/sk-code/014-code-review-skill/{spec,plan,tasks,checklist}.md` | Modify | Remove disallowed ToC sections |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create complete Level 2 docs in `007-spec-kit-templates` | All required files exist and contain non-placeholder task-specific content |
| REQ-002 | Remove ToC sections from specified non-research artifacts | No `## TABLE OF CONTENTS` remains in the listed standard artifacts |
| REQ-003 | Preserve policy boundaries | No changes made to `research.md`, `memory/`, `scratch/`, or `context/` |
| REQ-004 | Validate affected folders | `validate.sh` runs for all four target folders and outcomes are recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Provide concise completion report | Report includes changed files and per-folder validation outcomes |
| REQ-006 | Keep scope docs-only | Git diff includes markdown-only changes in scoped spec folders |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New `007-spec-kit-templates` folder contains `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- **SC-002**: All listed offender files no longer include ToC sections.
- **SC-003**: All four requested `validate.sh` runs execute and outcomes are documented.
- **SC-004**: No out-of-scope file classes are modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing spec docs have varied header patterns | ToC removal may miss variants | Use targeted scan after edits for standard artifact filenames |
| Risk | Over-removal in markdown blocks | Could remove non-ToC content | Restrict removal to explicit ToC heading/list pattern only |
| Risk | Validation mismatch in legacy docs | Could report warnings/errors unrelated to ToC policy | Record outcomes transparently and avoid scope creep |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Documentation validation for each target folder completes in normal shell execution time.
- **NFR-P02**: ToC scan/check commands complete without manual post-processing.

### Security
- **NFR-S01**: No secrets or credentials introduced in documentation.
- **NFR-S02**: No filesystem changes outside scoped spec markdown files.

### Reliability
- **NFR-R01**: Re-running ToC scan on targeted standard artifacts returns no matches.
- **NFR-R02**: `validate.sh` results are reproducible from the recorded commands.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `README.md` files under spec folders may still contain ToC and are out of this cleanup scope.
- `research.md` is explicitly allowed to contain ToC and must remain unchanged.

### Error Scenarios
- Validation script may return warnings for pre-existing content style issues unrelated to this policy.
- Some files contain `## 0. OVERVIEW` and section guides; these are retained unless they are actual ToC blocks.

### State Transitions
- Empty target folder transitions to complete Level 2 documentation set.
- Existing spec artifacts transition from mixed ToC usage to policy-compliant non-research format.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:acceptance-scenarios -->
## L2: ACCEPTANCE SCENARIOS

1. **Given** the empty `007-spec-kit-templates` folder, **When** Level 2 docs are authored, **Then** `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all exist with real content.
2. **Given** scoped standard artifacts in `039`, **When** ToC cleanup is applied, **Then** no `## TABLE OF CONTENTS` section remains in `spec/plan/tasks/checklist/decision-record/implementation-summary`.
3. **Given** scoped standard artifacts in `040` and `041`, **When** ToC cleanup is applied, **Then** no `## TABLE OF CONTENTS` section remains in the listed non-research standard artifacts.
4. **Given** the ToC policy exception for `research.md`, **When** cleanup runs, **Then** `research.md` files remain untouched.
5. **Given** the four requested validation commands, **When** `validate.sh` is executed, **Then** each folder returns a recorded outcome for reporting.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 20 markdown files touched across 4 spec folders |
| Risk | 9/25 | Low functional risk; moderate documentation consistency risk |
| Research | 8/20 | Required file-level scan and policy application checks |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
