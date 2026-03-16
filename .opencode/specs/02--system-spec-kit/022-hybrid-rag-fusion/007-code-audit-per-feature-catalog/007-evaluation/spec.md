---
title: "Feature Specification: evaluation [template:level_2/spec.md]"
description: "Feature-centric code audit of the Evaluation catalog to validate behavior parity, standards alignment, and coverage gaps."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "feature"
  - "specification"
  - "evaluation"
  - "hybrid rag fusion"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: evaluation

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
| **Branch** | `007-evaluation` |
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../006-analysis/spec.md |
| **Next Phase** | ../008-bug-fixes-and-data-integrity/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Evaluation category requires a feature-by-feature code audit to confirm implementation correctness, standards compliance, and behavior parity with the feature catalog. Current findings show one critical behavior mismatch in dashboard data sourcing and several handler-level testing/documentation gaps that can hide regressions.

### Purpose
Deliver a complete, structured audit for both Evaluation features so gaps are prioritized and remediation is implementation-ready.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all Evaluation features in `.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/`.
- Validate correctness, standards alignment, behavior match, and test coverage.
- Map each feature to manual playbook coverage (`EX-032`, `EX-033`) and capture remediation tasks.

### Out of Scope
- Implementing non-evaluation feature fixes - handled in separate phases.
- Broad architecture refactors unrelated to audit findings - not required for this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md` | Modify | Align test inventory and audit outcomes for F-01. |
| `.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md` | Modify | Align Current Reality claims and test inventory for F-02. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/007-evaluation/*.md` | Modify | Maintain phase specification, plan, tasks, and checklist artifacts. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit F-01 (`eval_run_ablation`) with structured PASS/WARN/FAIL outcomes. | Findings include code issues, standards status, behavior match, test gaps, playbook coverage, and recommended fixes. |
| REQ-002 | Audit F-02 (`eval_reporting_dashboard`) and resolve behavior mismatch status. | Dashboard data-source behavior is reconciled with catalog claims (`eval_final_results` mismatch addressed or documented). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Document handler-level test gaps for both features. | Required handler scenarios are listed with concrete test actions and file targets. |
| REQ-004 | Map findings to playbook scenarios and remediation priorities. | Each feature maps to `EX-032` or `EX-033`, with P0/P1/P2 follow-up tasks captured. |
| REQ-005 | Keep phase documentation synchronized after remediation updates. | `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` reflect the same status, test scope, and evidence narrative. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 2 Evaluation features are audited with structured findings.
- **SC-002**: Each feature has PASS/WARN/FAIL status with code issues and standards violations documented.
- **SC-003**: Test gaps are explicitly documented and actionable.
- **SC-004**: Playbook scenarios are mapped, or gaps are clearly noted.

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
| Dependency | Feature catalog accuracy (`.opencode/skill/system-spec-kit/feature_catalog/07--evaluation`) | Incorrect catalog claims can produce false audit deltas. | Cross-check every finding against referenced source files and line ranges. |
| Dependency | Evaluation data tables (`eval_metric_snapshots`, `eval_channel_results`) | Missing/changed schema can invalidate behavioral conclusions. | Validate query usage in code and keep findings tied to actual SQL call paths. |
| Risk | Resolved F-02 data-source contract can drift again if docs are edited without source revalidation | Documentation can become inconsistent with implementation and hide regressions. | Keep `spec.md`, checklist evidence, and feature catalog wording synchronized to the resolved `eval_metric_snapshots` + `eval_channel_results` query contract. |
| Risk | Handler-level test gaps persist | Regressions may pass unnoticed despite feature-level tests. | Add focused handler tests for format/filter/normalization/error paths. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit evidence collection should remain reviewable within a single pass across both features.
- **NFR-P02**: Proposed handler tests should run in existing Vitest workflows without introducing significant runtime overhead.

### Security
- **NFR-S01**: Audit/remediation must not introduce secrets or weaken tool input validation behavior.
- **NFR-S02**: Any changes to reporting handlers must preserve existing authorization and safe error handling patterns.

### Reliability
- **NFR-R01**: Findings must include deterministic file/line references for reproducibility.
- **NFR-R02**: Remediation tasks must be specific enough to avoid ambiguous implementation outcomes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty filter/channel inputs: must normalize to defined defaults without runtime errors.
- Maximum result limits: dashboard queries should respect bounded `limit` inputs.
- Invalid channel names: normalization should fall back to valid channel sets.

### Error Scenarios
- Ablation disabled flag: handler must throw the expected typed error path.
- Query/data retrieval failure: dashboard path should surface actionable failures.
- Missing referenced test files: documentation must be corrected or tests added.

### State Transitions
- `storeResults=false`: ablation path should skip persistence safely.
- `includeFormattedReport=false`: output should omit formatted report while preserving raw data.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two features, focused audit surface, bounded artifact updates. |
| Risk | 9/25 | One P0 behavior mismatch and multiple handler test gaps. |
| Research | 7/20 | Requires cross-referencing catalog claims, handlers, and tests. |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- ~~Should F-02 be resolved by implementing `eval_final_results` querying or by correcting the catalog claim?~~ **RESOLVED**: Catalog claim corrected — dashboard only queries `eval_metric_snapshots` + `eval_channel_results`; `eval_final_results` reference was stale.
- ~~Should stale `retry.vitest.ts` references be removed immediately or replaced with new targeted tests in the same phase?~~ **RESOLVED**: Grep confirmed 0 stale references in 07--evaluation catalog files; already clean.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
