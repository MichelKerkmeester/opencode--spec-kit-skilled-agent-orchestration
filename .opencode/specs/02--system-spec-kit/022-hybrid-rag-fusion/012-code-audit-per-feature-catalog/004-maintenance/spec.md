---
title: "Feature Specification: maintenance [template:level_2/spec.md]"
description: "Maintenance feature audit for workspace indexing and startup runtime compatibility guard behavior."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "feature"
  - "specification"
  - "maintenance"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: maintenance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-10 |
| **Branch** | `012-code-audit-per-feature-catalog` |
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../003-discovery/spec.md |
| **Next Phase** | ../005-lifecycle/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Maintenance feature behavior and findings are documented in phase notes, but not in the standardized Level 2 structure. This makes it harder to track blockers and verify the workspace indexing and startup guard audit outcomes consistently.

### Purpose
Standardize the maintenance audit into a Level 2 spec so requirements, risks, and success criteria are traceable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit `memory_index_scan` behavior for correctness, standards alignment, behavior match, and test coverage.
- Audit startup runtime compatibility guards for behavior match and coverage gaps.
- Record structured findings with PASS/WARN/FAIL status and accurate playbook mapping (F-01 -> EX-014; F-02 -> EX-035).

### Out of Scope
- Implementing production code fixes in `mcp_server/` during this documentation rewrite - tracked separately in tasks.
- Auditing non-maintenance feature catalog categories - limited to `feature_catalog/04--maintenance/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/004-maintenance/spec.md` | Modify | Rewrite to Level 2 template with mapped maintenance audit content |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/004-maintenance/tasks.md` | Modify | Align action items with structured Phase 2 task format |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/004-maintenance/plan.md` | Modify | Align methodology and checklist content to Level 2 planning sections |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/004-maintenance/checklist.md` | Modify | Align verification checks to maintenance findings by category |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit F-01 workspace scanning and indexing (`memory_index_scan`) with explicit correctness, behavior mismatch, and test-gap findings. | Findings include status, source evidence, and remediation direction for `skipped_hash`/`hash_checks` semantics. |
| REQ-002 | Preserve and map P0 remediation task for incremental scan hash accounting mismatch. | Phase 2 tasks include a numbered P0 action tied to F-01 evidence and target files. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Audit F-02 startup runtime compatibility guards with behavior and coverage assessment. | Findings include status, source evidence, dedicated automated coverage for SQLite validation + pure runtime mismatch logic, and a dedicated manual playbook scenario reference. |
| REQ-004 | Capture non-critical remediation and documentation updates for maintenance findings. | Phase 2 tasks include numbered follow-up actions for F-02 tests and catalog/test inventory alignment. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 2 maintenance features are represented in the Level 2 structure with clear status and evidence mapping.
- **SC-002**: Requirements, implementation plan, tasks, and verification checklist are synchronized around F-01 and F-02 findings.
- **SC-003**: P0 and P2 remediation actions are explicitly trackable through numbered tasks.
- **SC-004**: Playbook coverage mapping is accurate: F-01 maps to EX-014 and F-02 maps to EX-035.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 6. ACCEPTANCE SCENARIOS

### Scenario 1: F-01 mapping stays aligned with the maintenance playbook
- **Given** the maintenance audit references workspace scanning behavior
- **When** the docs and manual playbook are cross-checked
- **Then** F-01 resolves to `EX-014` only

### Scenario 2: F-02 startup validation has both automated and manual coverage
- **Given** the startup runtime guards are documented in the maintenance audit
- **When** coverage references are reviewed
- **Then** the docs cite `startup-checks.vitest.ts` for automated coverage and `EX-035` for manual coverage

### Scenario 3: Placeholder incremental tests are not used as behavioral proof
- **Given** the legacy incremental-index placeholder suite still exists
- **When** behavioral evidence is summarized
- **Then** `incremental-index-v2.vitest.ts` is treated as the primary behavioral suite and the placeholder suite is called out as deferred

### Scenario 4: Completion evidence remains internally consistent
- **Given** the Level 2 maintenance spec is marked complete
- **When** spec, plan, tasks, checklist, and implementation summary are compared
- **Then** they agree on mapping, verification results, and remaining limitations
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `feature_catalog/04--maintenance/` source-of-truth entries | Missing or stale catalog entries can misalign documented requirements | Keep findings traceable to concrete file/line evidence and update catalog references where needed |
| Dependency | `mcp_server` runtime and test files | Changes in handler semantics can invalidate documented findings | Re-validate against current source/test files before execution of remediation tasks |
| Risk | `skipped_hash` / `hash_checks` semantic mismatch persists | Medium | Treat REQ-001/REQ-002 as P0 and block completion until mismatch is resolved or explicitly documented as mtime-only |
| Risk | Startup guard manual scenario drifts from current runtime semantics | Low | Re-validate EX-035 against `startup-checks.vitest.ts` and `startup-checks.ts` whenever startup diagnostics change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Documentation updates remain concise and reviewable in a single pass (<15 minutes review time).
- **NFR-P02**: Verification steps identify maintenance regressions without requiring full-repo test execution.

### Security
- **NFR-S01**: No sensitive runtime/environment data is added to spec artifacts.
- **NFR-S02**: Security-relevant checks (input validation/no secrets) remain explicit in verification checklist items.

### Reliability
- **NFR-R01**: All four maintenance documents follow the same Level 2 template structure without missing anchors.
- **NFR-R02**: Cross-references between spec, plan, tasks, and checklist remain internally consistent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

### Data Boundaries
- Empty findings set: represent explicitly as "No findings" in relevant sections.
- Maximum detail: include only actionable evidence to avoid unreadable sections.
- Invalid reference path: flag and correct paths before completion.

### Error Scenarios
- Source file moved/renamed: update source citations in findings and linked tasks.
- Conflicting semantics (docs vs code): raise as a P0 blocker in requirements/tasks.
- Partial mapping: do not mark complete until each source section is mapped to template equivalent.

### State Transitions
- Draft to in-progress: once remediation begins, update status and completion checks.
- Deferred P1/P2 items: require explicit approval and tracking note before closure.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Four documents rewritten; two maintenance features mapped |
| Risk | 12/25 | F-01 semantic mismatch is P0 and impacts reporting correctness |
| Research | 8/20 | Requires cross-checking findings/tasks/plan/checklist alignment |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

- Should the legacy placeholder suite `incremental-index.vitest.ts` be archived to prevent accidental use as behavioral evidence?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
