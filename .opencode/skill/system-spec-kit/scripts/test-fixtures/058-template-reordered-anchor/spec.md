---
title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
description: "Validator fixture for reordered required anchor failures."
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
This fixture intentionally swaps required anchor IDs while keeping header text intact.

### Purpose
`ANCHORS_VALID` should fail on anchor-order drift without relying on header-order failures.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:requirements -->
## 3. SCOPE

### In Scope
- Required anchor order

### Out of Scope
- Missing header detection

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Swap required anchor IDs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:scope -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reordered required anchor fails | `validate.sh` returns exit code 2 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The validator reports required anchors out of order.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Anchor order drift goes unnoticed | Medium | Compare ordered anchor IDs against the live template |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
