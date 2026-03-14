---
title: "Feature Specification: analysis [template:level_2/spec.md]"
description: "Feature-centric code audit baseline for the Analysis catalog, capturing correctness, standards, behavior, and test coverage findings across seven features."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "feature"
  - "specification"
  - "analysis"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: analysis

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
| **Branch** | `006-analysis` |
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../005-lifecycle/spec.md |
| **Next Phase** | ../007-evaluation/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Analysis feature catalog has seven features but lacked a Level 2 normalized spec structure, making it harder to track correctness, standards alignment, behavior parity, and test coverage uniformly. Existing audit notes were detailed but not organized in a template-compatible way for repeatable verification. This created friction for execution planning and quality gating.

### Purpose
Provide a Level 2, template-compliant analysis specification that preserves all key audit findings and makes remediation work traceable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Normalize the Analysis phase documents to Level 2 template structure.
- Preserve findings for all seven Analysis features (F-01 through F-07).
- Map acceptance, tasks, plan phases, and verification checks into consistent anchors and checkbox formats.

### Out of Scope
- Extending P0/P1 fixes beyond the 7 Analysis features (F-01 through F-07) and their direct handler/storage code paths.
- Auditing feature catalogs outside `feature_catalog/06--analysis/` — not part of this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/causal-graph.ts` | Modify | Fix orphan-inflated coverage SQL (T004) and false-positive max_depth_reached (T006). |
| `mcp_server/lib/errors.ts` | Modify | Replace wildcard barrel exports with named exports (T008). |
| `mcp_server/lib/errors/index.ts` | Modify | Replace wildcard barrel exports with named exports (T008). |
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Modify | Add orphan regression (T005) and depth semantics (T007) tests. |
| `mcp_server/tests/causal-edges.vitest.ts` | Modify | Replace 77 placeholder stubs with DB-backed tests (T009), add unlink tests (T010). |
| `mcp_server/tests/handler-session-learning.vitest.ts` | Modify | Add overwrite guard (T011) and LI formula/band tests (T012). |
| `mcp_server/tests/learning-stats-filters.vitest.ts` | Modify | Add ordering, threshold, and limit clamping tests (T013). |
| `mcp_server/tests/integration-causal-graph.vitest.ts` | Modify | Add causal-stats (T014) and drift-why (T015) integration tests. |
| `feature_catalog/06--analysis/01-*.md` through `07-*.md` | Modify | Remove stale retry.vitest.ts references (T016-T022). |
| `spec.md` | Modify | Update status to Complete. |
| `tasks.md` | Modify | Mark all 25 tasks with evidence. |
| `plan.md` | Modify | Mark phase checkboxes with evidence. |
| `checklist.md` | Modify | Mark all verification items with evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit documentation covers all seven Analysis features. | F-01 through F-07 appear with status, findings, and actionable follow-ups. |
| REQ-002 | FAIL-level defects are explicitly captured as immediate tasks. | Orphan-inflated coverage and false-positive `maxDepthReached` defects are documented with fix direction. |
| REQ-003 | Template compliance is exact for Level 2 structure. | Required frontmatter, Speckit comments, anchors, and checkbox syntax are present. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Standards alignment gaps are tracked across impacted features. | Wildcard export and pattern-violation findings are mapped into tasks/checklist entries. |
| REQ-005 | Test coverage gaps are traceable to concrete regression tasks. | P0/P1/P2 test gaps are represented in tasks with T### numbering and file context. |
| REQ-006 | Manual playbook mapping status is recorded. | EX-019..EX-025 mapping state is explicitly noted with gap visibility. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 features are represented with structured PASS/WARN/FAIL findings.
- **SC-002**: Each feature documents code issues, standards violations, behavior match/mismatch, and test gaps.
- **SC-003**: P0/P1/P2 remediation tasks are converted into template-conformant Phase 2 tasks with T### numbering.
- **SC-004**: Verification checklist sections reflect pre-implementation, quality, testing, security, and documentation outcomes, including 211 passing tests across 5 Vitest files.

### Acceptance Scenarios

1. **Given** the documented requirements for this phase, **When** a reviewer walks the updated packet, **Then** each requirement has a matching verification path in tasks and checklist artifacts.
2. **Given** current implementation behavior, **When** spec statements are compared with source and test references, **Then** no contradictory behavior claims remain in the phase packet.
3. **Given** the updated verification evidence, **When** checklist entries are audited, **Then** each completed P0/P1 item carries inline evidence and traceable context.
4. **Given** Level 2 template constraints, **When** the spec validator runs, **Then** acceptance-scenario coverage and section integrity checks pass without structural warnings.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Analysis feature catalog markdown files | Missing or stale source references can weaken audit evidence. | Keep citations aligned with current file paths and line contexts during updates. |
| Risk | Deferred test suites remain unresolved | Backlog may grow while production behavior drifts. | Prioritize P0 regressions first, then complete P1 DB-backed suite replacements. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Documentation restructuring should remain readable and quickly scannable for execution planning.
- **NFR-P02**: Task and checklist navigation should support fast triage across 25 mapped tasks.

### Security
- **NFR-S01**: No secrets, credentials, or unsafe command patterns are introduced in spec artifacts.
- **NFR-S02**: Security-relevant findings (validation/auth/error handling) remain visible in checklist and tasks.

### Reliability
- **NFR-R01**: Template anchors remain stable for automated parsing and memory tooling.
- **NFR-R02**: Priority mapping (P0/P1/P2) remains internally consistent across all four documents.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty findings set: maintain required template scaffolding with explicit "NONE" entries.
- Large task backlog: preserve strict T### ordering to avoid ambiguity.
- Missing file references: keep task descriptions actionable without unresolved placeholders.

### Error Scenarios
- Stale source path references: flag in documentation checklist and avoid silent omission.
- Inconsistent priority mapping: treat as blocker until aligned across spec/tasks/checklist.
- Partial rewrites: reject if any required anchor or frontmatter key is missing.

### State Transitions
- Draft to In Progress: checklist counters update as verification evidence is added.
- In Progress to Complete: all P0 resolved and P1 completed or explicitly deferred with approval.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Four documents, seven audited features, cross-file consistency requirements. |
| Risk | 17/25 | Incorrect mapping can hide FAIL findings or priority blockers. |
| Research | 12/20 | Existing audit content is complete but needs structured normalization. |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should per-feature manual test scenarios be expanded beyond EX-019..EX-025 in a follow-up phase?
- Should wildcard export remediation be tracked as a shared cross-phase task instead of repeated per feature?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
