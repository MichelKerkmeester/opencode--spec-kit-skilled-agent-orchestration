---
title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
description: "Validator fixture for reordered required header failures."
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
This fixture intentionally reorders required H2 sections.

### Purpose
`TEMPLATE_HEADERS` should fail when required headers drift out of sequence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reordered header fails | `validate.sh` returns exit code 2 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Required header order enforcement

### Out of Scope
- Warning-only behavior

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Swap required section order |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The validator reports an out-of-order required section.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Header order drift goes unnoticed | Medium | Compare against the live template sequence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
