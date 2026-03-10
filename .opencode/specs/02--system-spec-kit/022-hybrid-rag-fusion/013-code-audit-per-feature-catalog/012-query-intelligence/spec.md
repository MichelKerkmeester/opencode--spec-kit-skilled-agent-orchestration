---
title: "Feature Specification: query-intelligence [template:level_2/spec.md]"
description: "Feature-centric code audit scope for the Query Intelligence category in hybrid-rag-fusion. Captures correctness, standards, behavior, testing, and playbook coverage requirements across six features with prioritized findings."
trigger_phrases:
  - "query intelligence"
  - "query-intelligence"
  - "code audit"
  - "query complexity router"
  - "relative score fusion"
  - "channel min representation"
  - "dynamic token budget"
  - "query expansion"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: query-intelligence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-10 |
| **Branch** | `012-query-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Query Intelligence feature catalog (`feature_catalog/12--query-intelligence/`) covers six capabilities, but the phase artifacts were not aligned to Level 2 template structure. Without normalized sections and anchors, verification traceability for correctness bugs, behavior mismatches, and test/playbook gaps is inconsistent.

### Purpose
Create a Level 2-compliant specification that defines what must be audited and reported for all six Query Intelligence features.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all 6 features in `feature_catalog/12--query-intelligence/`.
- Evaluate correctness, standards alignment, behavior match, test coverage, and playbook mapping.
- Produce structured PASS/WARN/FAIL findings and a prioritized remediation backlog.

### Out of Scope
- Implementing production fixes in `mcp_server/` modules - this phase documents findings and required follow-up actions.
- Auditing categories outside `feature_catalog/12--query-intelligence/` - limited to Query Intelligence only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/012-query-intelligence/spec.md` | Modify | Rewrite to Level 2 spec template with mapped Query Intelligence audit scope. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/012-query-intelligence/plan.md` | Modify | Align audit methodology to Level 2 plan template. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/012-query-intelligence/tasks.md` | Modify | Convert remediation backlog into Level 2 task structure. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/012-query-intelligence/checklist.md` | Modify | Convert feature findings into Level 2 verification checklist format. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit all six Query Intelligence features (F-01..F-06) with one consistent structure. | Every feature includes status (PASS/WARN/FAIL), code issues, standards violations, behavior mismatch status, test gaps, and playbook coverage notes. |
| REQ-002 | Capture confirmed correctness defects and behavior mismatches with source traceability. | Findings include F-01 routing/flag contradictions, F-03 channel re-sort dependency, and F-06 source/test-table gaps with concrete file references. |
| REQ-003 | Document test gaps and playbook coverage gaps across all six features. | Missing assertions and missing/stale test references are explicitly recorded per feature, with NEW-060+ mapping status noted. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Produce a prioritized remediation backlog from the audit. | Task inventory includes P0/P1/P2 grouping with counts (6/1/1) and file-level references. |
| REQ-005 | Keep spec, plan, tasks, and checklist synchronized in Level 2 format. | All four artifacts contain required anchors, SPECKIT comments, and aligned status/context. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 Query Intelligence features are audited with structured, traceable findings.
- **SC-002**: Each feature has explicit status, issue taxonomy, and actionable remediation guidance.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `feature_catalog/12--query-intelligence/` documentation accuracy | Stale or contradictory catalog text can misclassify behavior mismatches. | Validate each finding against both catalog narratives and current implementation/test sources. |
| Dependency | `mcp_server` test suites and listed source tables | Placeholder or incomplete test coverage reduces verification confidence. | Document gaps explicitly and create targeted follow-up tasks for missing assertions. |
| Risk | Catalog-to-implementation mapping drift | Missing file references can hide actual runtime behavior (e.g., wrapper dependencies). | Record all critical implementation surfaces in findings and tasks. |
| Risk | Template migration drift | Important findings could be lost during format conversion. | Preserve all major findings and priorities while enforcing required anchors/comments. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit artifacts remain concise and scannable while preserving per-feature issue detail.
- **NFR-P02**: Findings support quick triage by maintaining explicit P0/P1/P2 priority mapping.

### Security
- **NFR-S01**: Audit outputs must not include secrets or sensitive runtime data.
- **NFR-S02**: Security-adjacent validation assumptions (if any) are explicitly marked when coverage is incomplete.

### Reliability
- **NFR-R01**: Findings remain reproducible via stable file-level references.
- **NFR-R02**: Prioritization and status remain consistent across spec, plan, tasks, and checklist.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: Features with no effective assertions are marked WARN/FAIL with explicit test-gap rationale.
- Maximum length: Long finding sets are split by feature and priority to preserve readability.
- Invalid format: Missing source/test references are treated as incomplete and require follow-up tasks.

### Error Scenarios
- External service failure: If test infrastructure is unavailable, verification is deferred with documented reason.
- Network timeout: Not applicable to this documentation-only phase; no runtime network dependency is introduced.
- Concurrent access: Edits are limited to `012-query-intelligence/` artifacts to avoid cross-phase collisions.

### State Transitions
- Partial completion: Keep unresolved checks and remediation tasks marked `[ ]`.
- Session expiry: Resume from anchored sections to keep deterministic updates across all four files.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | 6 features, 4 synchronized artifacts, multi-criteria audit output |
| Risk | 16/25 | Multiple FAIL findings and contradictory feature-to-code mappings |
| Research | 11/20 | Requires cross-referencing catalog, implementation, tests, and playbook |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should F-02 (RSF shadow mode) be formalized as dormant utility behavior or restored as active shadow comparison?
- Should CHK-060 token-budget overhead and F-01 trace propagation tests be mandatory closure gates for this phase?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
