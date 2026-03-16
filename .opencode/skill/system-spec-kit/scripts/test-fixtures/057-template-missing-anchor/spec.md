---
title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
description: "Validator fixture for missing required anchor failures."
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
This fixture intentionally omits a required anchor pair.

### Purpose
`ANCHORS_VALID` should fail even when the header text still exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Required anchor presence

### Out of Scope
- Header-order checks

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Remove a required anchor |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Missing required anchor fails | `validate.sh` returns exit code 2 |
<!-- /ANCHOR:requirements -->

---

## 5. SUCCESS CRITERIA

- **SC-001**: The validator reports the missing `success-criteria` anchor.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missing anchors break retrieval | High | Compare required anchor IDs against the live template |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
