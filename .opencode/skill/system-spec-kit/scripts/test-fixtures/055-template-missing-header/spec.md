---
title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
description: "Validator fixture for missing required header failures."
trigger_phrases:
  - "fixture"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Template Fixture

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
| **Created** | 2026-03-16 |
| **Branch** | `codex/template-fixture` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This fixture intentionally removes a required H2 section.

### Purpose
`TEMPLATE_HEADERS` should fail when a required header is missing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Missing required header detection

### Out of Scope
- Warning-only behavior

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Remove a required header |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Missing header fails | `validate.sh` returns exit code 2 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missing section goes unnoticed | High | Fail on required header drift |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
