---
title: "Feature Specification: CLI Self-Invocation Guards [03--commands-and-skills/009-cli-self-invocation-guards/spec]"
description: "Add consistent self-invocation guards across the CLI bridge skills so each runtime avoids delegating to itself."
---
# Feature Specification: CLI Self-Invocation Guards

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-02 |
| **Branch** | `009-cli-self-invocation-guards` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CLI bridge skills are meant for cross-AI delegation, but the shared skill system makes it possible for a runtime to be told to invoke the very bridge that targets itself. That creates circular self-delegation and, in some cases, nested-runtime failure modes.

### Purpose
Add a consistent self-invocation guard pattern to the CLI bridge skills so each runtime recognizes when it should use its native capabilities instead of delegating to itself.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add self-invocation guidance to the relevant CLI bridge skill docs.
- Add explicit NEVER-style self-delegation rules.
- Improve prerequisite/runtime-detection wording where applicable.

### Out of Scope
- Changing `skill_advisor.py` runtime-awareness logic.
- Creating new environment-detection mechanisms.
- Editing unrelated reference files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/cli-claude-code/SKILL.md` | Modify | Clarify Claude Code self-invocation guard |
| `.opencode/skill/cli-gemini/SKILL.md` | Modify | Add Gemini self-invocation guard |
| `.opencode/skill/cli-codex/SKILL.md` | Modify | Add Codex self-invocation guard |
| `.opencode/skill/cli-copilot/SKILL.md` | Modify | Strengthen Copilot self-invocation guard |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every targeted CLI bridge skill documents a self-invocation guard | Users can see that the skill is for external runtimes, not the runtime itself |
| REQ-002 | Every targeted CLI bridge skill adds a clear anti-self-delegation rule | The docs explicitly forbid circular self-invocation |
| REQ-003 | Runtime detection wording is updated where available | Existing env-var or nesting checks are reframed consistently |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Guidance explains what to use instead of self-delegation | Native capabilities are named for each runtime |
| REQ-005 | The spec folder validates structurally after normalization | No validation errors remain |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The targeted CLI bridge skills now warn against self-invocation.
- **SC-002**: The guidance points each runtime back to its native capabilities.
- **SC-003**: The spec folder is structurally compliant without changing the implementation meaning.

### Acceptance Scenarios

- **Given** a runtime encounters the CLI bridge that targets its own native executor, **when** the self-invocation guidance is read, **then** the docs tell the runtime to use native capabilities instead of delegating to itself.
- **Given** a maintainer compares the affected CLI bridge skills, **when** the guard language is reviewed, **then** each targeted skill documents the same anti-self-delegation pattern with runtime-specific guidance.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Guard wording becomes inconsistent across CLI skills | Users receive mixed guidance | Normalize the pattern and rationale |
| Dependency | Existing runtime-detection hints differ by CLI | Some guards are conceptual rather than env-driven | Document the strongest available signal per runtime |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. This structural pass preserves the original self-invocation-guard intent.
<!-- /ANCHOR:questions -->

---
