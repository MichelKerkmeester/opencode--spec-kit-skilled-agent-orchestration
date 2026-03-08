---
title: "Feature Specification: Design Phase (Broken)"
description: "Phase 1 child with WRONG parent path — intentionally broken."
trigger_phrases:
  - "design"
  - "broken"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Design Phase (Broken)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Pending |
| **Created** | 2026-03-08 |
| **Branch** | `002-broken-links-fixture` |
| **Phase** | 1 of 2 |
| **Predecessor** | N/A |
| **Successor** | 002-implement |
| **Handoff Criteria** | Design review approved |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 1** of the Broken Links Fixture specification.

**Scope Boundary**: Design activities only

**Dependencies**:
- None (first phase)

**Deliverables**:
- Design documentation
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Design phase with intentionally wrong parent back-reference.

### Purpose
Test that check-phase-links.sh detects wrong parent path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Design work

### Out of Scope
- Implementation

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| N/A | N/A | Test fixture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Design complete | Design doc reviewed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: This spec intentionally fails link validation
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| N/A | N/A | N/A | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->
