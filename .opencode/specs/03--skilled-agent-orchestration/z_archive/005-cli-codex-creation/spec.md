---
title: "Feature Specification: cli-gemini Model Consolidation + [03--commands-and-skills/005-cli-codex-creation/spec]"
description: "Consolidate cli-gemini to one model and create the cli-codex skill with matching ecosystem registration."
trigger_phrases:
  - "feature"
  - "specification"
  - "cli"
  - "gemini"
  - "model"
  - "spec"
  - "005"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: cli-gemini Model Consolidation + cli-codex Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-01 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The existing `cli-gemini` skill referenced multiple Gemini model variants, which created avoidable decision overhead. At the same time, there was no companion `cli-codex` skill even though Codex CLI support already existed elsewhere in the repository.

### Purpose
Consolidate `cli-gemini` around a single model reference and create a parallel `cli-codex` skill with matching ecosystem registration and supporting documentation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Normalize `cli-gemini` model references to `gemini-3.1-pro-preview`.
- Create the `cli-codex` skill with its SKILL.md, references, and prompt templates.
- Register `cli-codex` in advisor and README surfaces.
- Align the spec folder documentation to the active Level 2 template.

### Out of Scope
- Editing Codex runtime configuration files beyond registration/documentation touchpoints.
- Creating an install guide for Codex CLI.
- Changing `.codex/agents/*.toml` platform configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/cli-gemini/*` | Modify | Replace multi-model guidance with single-model references |
| `.opencode/skill/cli-codex/SKILL.md` | Create | Main skill definition |
| `.opencode/skill/cli-codex/references/*.md` | Create | Codex reference set |
| `.opencode/skill/cli-codex/assets/prompt_templates.md` | Create | Prompt template library |
| `.opencode/skill/scripts/skill_advisor.py` | Modify | Register `cli-codex` |
| `README.md` and related skill catalogs | Modify | Add `cli-codex` documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `cli-gemini` model references are consolidated | Old multi-model references are replaced by `gemini-3.1-pro-preview` |
| REQ-002 | `cli-codex` skill exists with core documents | SKILL.md, references, and prompt templates are present |
| REQ-003 | Ecosystem registration is updated | Advisor and README surfaces include `cli-codex` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `cli-codex` mirrors the documentation pattern used by sibling CLI skills | The new skill follows the established CLI skill structure |
| REQ-005 | Spec folder documentation validates structurally | No validation errors remain in the spec folder |
| REQ-006 | Cross-runtime discovery remains clear | Users can find `cli-codex` from catalog and advisor surfaces |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cli-gemini` points to one canonical model reference.
- **SC-002**: `cli-codex` exists as a documented peer to the other CLI bridge skills.
- **SC-003**: Skill discovery surfaces mention `cli-codex` consistently.

### Acceptance Scenarios

- **Given** a maintainer reviews the Gemini bridge skill, **when** the documentation is inspected, **then** it points to one canonical Gemini model instead of several competing model references.
- **Given** a user searches for Codex CLI support in the skill ecosystem, **when** catalog and advisor surfaces are checked, **then** `cli-codex` appears as a discoverable peer to the other CLI bridge skills.
- **Given** the new `cli-codex` skill package is opened, **when** the file tree is reviewed, **then** SKILL, references, and prompt templates follow the established sibling-skill pattern.
- **Given** the spec folder is validated after normalization, **when** compliance checks run, **then** the packet stays aligned with the documented model-consolidation and `cli-codex` creation scope.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Codex CLI documentation accuracy | Incorrect guidance weakens the new skill | Mirror proven sibling skill patterns |
| Risk | Model guidance drifts again in `cli-gemini` | Users face renewed confusion | Keep a single canonical model reference |
| Risk | Registration surfaces diverge | Users cannot discover the skill reliably | Update advisor and README surfaces together |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: `cli-codex` should match the CLI skill documentation conventions used by adjacent skills.

### Usability
- **NFR-U01**: The single-model `cli-gemini` guidance should reduce model-selection ambiguity.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Legacy references to older Gemini models must not survive in the normalized skill docs.
- `cli-codex` must remain discoverable even if users search by Codex-specific phrases instead of the folder name.
- Spec-folder compliance updates must not alter the implementation intent.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Skill creation plus sibling skill normalization and registration work |
| Risk | 8/25 | Documentation-only changes with moderate discovery impact |
| Research | 8/20 | Requires parallel skill-pattern alignment |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The original implementation intent is preserved in this template-aligned version.
<!-- /ANCHOR:questions -->

---
