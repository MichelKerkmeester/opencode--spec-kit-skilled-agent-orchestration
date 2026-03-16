---
title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
description: "Validator fixture for extra custom section warnings."
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
Validation fixtures used minimal headers and did not exercise live template comparison.

### Purpose
Provide a structurally compliant Level 2 folder that the validator should accept without warnings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Validate live header order
- Validate required anchor order
- Exercise checklist formatting rules

### Out of Scope
- Semantic field validation
- Decision-record validation

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/test-fixtures/054-template-extra-header/spec.md` | Modify | Add an extra custom section |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Required headers stay in template order | `validate.sh` returns exit code 1 |
| REQ-002 | Required anchors stay in template order | `ANCHORS_VALID` passes |
| REQ-003 | Optional anchors from the template stay allowed | No extra-anchor warning is emitted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Extra custom sections warn without failing | `TEMPLATE_HEADERS` reports a warning only |
| REQ-005 | Strict mode escalates the warning to failure | `validate.sh --strict` returns exit code 2 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The fixture warns about one extra custom section.
- **SC-002**: **Given** default validation, **Then** the validator returns a warning only.
- **SC-003**: **Given** strict mode, **Then** the validator fails.
- **SC-004**: **Given** live template comparison is active, **Then** optional template anchors are allowed.
- **SC-005**: **Given** one extra custom section exists, **Then** only the template-header rule warns.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Extra sections become blocking | Low | Keep required sections intact |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## 11. CUSTOM NOTES

This header is intentionally outside the template contract and should warn without failing.
