---
title: "Feature Specification: Template Fixture [template:level_2/spec.md]"
description: "Validator fixture proving optional L2 sections can be absent without false positives."
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
| `.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/*` | Create | Template compliance fixtures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Required headers stay in template order | `validate.sh` returns exit code 0 |
| REQ-002 | Required anchors stay in template order | `ANCHORS_VALID` passes |
| REQ-003 | Optional anchors from the template stay allowed | No extra-anchor warning is emitted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Checklist formatting matches the live template | `TEMPLATE_HEADERS` passes |
| REQ-005 | Strict validation has no residual warnings | `validate.sh --strict` returns exit code 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The fixture passes `validate.sh` with no warnings.
- **SC-002**: Optional sections do not count as extra custom sections.
- **SC-003**: **Given** strict mode is enabled, **Then** the compliant fixture still succeeds.
- **SC-004**: **Given** live template comparison is active, **Then** optional template anchors are allowed.
- **SC-005**: **Given** the checklist uses CHK identifiers, **Then** the checklist format passes.
- **SC-006**: **Given** the live Level 2 templates are active, **Then** header order remains compliant.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fixture drift from template | Medium | Keep structure aligned with live templates |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
