---
title: "Feature Specification: decisions-and-deferrals [template:level_2/spec.md]"
description: "Feature-centric code audit for decisions-and-deferrals features, documenting behavior alignment and test coverage deferrals."
trigger_phrases:
  - "decisions"
  - "deferrals"
  - "code audit"
  - "graph centrality"
  - "entity extraction"
  - "memory summary"
  - "entity linking"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: decisions-and-deferrals

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-10 |
| **Branch** | `019-decisions-and-deferrals` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The decisions-and-deferrals feature catalog has completed implementation notes, but the audit output needed to be normalized into a Level 2 SpecKit structure. Without that structure, findings about behavior mismatches and deferred test coverage are harder to verify and track.

### Purpose
Provide a Level 2, verification-ready specification that captures the five-feature audit results and deferral-driven follow-up work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit summary for all five catalog features in `feature_catalog/19--decisions-and-deferrals/`
- Behavior/correctness/test-gap findings for each audited feature
- Prioritized follow-up tasks for WARN findings and deferred fixes

### Out of Scope
- Immediate implementation of code fixes in `mcp_server/` - tracked as follow-up tasks
- Manual playbook mapping - currently N/A for this catalog category

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/019-decisions-and-deferrals/spec.md | Modify | Convert audit overview to Level 2 spec template |
| .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/019-decisions-and-deferrals/tasks.md | Modify | Convert finding list to phased Level 2 tasks |
| .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/019-decisions-and-deferrals/plan.md | Modify | Convert methodology notes to Level 2 implementation plan |
| .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/019-decisions-and-deferrals/checklist.md | Modify | Convert per-feature findings into Level 2 verification checklist |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit all 5 decisions-and-deferrals features with PASS/WARN/FAIL outcomes | Each feature has a status and structured finding summary |
| REQ-002 | Document behavior mismatches and test gaps with traceable source references | Findings include concrete file references and issue description |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Create actionable follow-up tasks for WARN findings | Tasks capture owner action, target file, and expected correction |
| REQ-004 | Preserve audit methodology and verification workflow | Plan and checklist map directly to audit criteria and acceptance checks |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 features are represented with status, issue class, and recommended action
- **SC-002**: All WARN findings are translated into explicit tasks and verification checkpoints
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `feature_catalog/19--decisions-and-deferrals/*.md` | Missing/incorrect feature entries can skew audit conclusions | Reconcile findings against catalog source list before sign-off |
| Dependency | `mcp_server/lib/**` and `mcp_server/tests/**` references | Incomplete file inventory can hide behavior mismatches | Include all referenced implementation and migration files in source tables |
| Risk | Documentation-only remediation stalls code-level fixes | WARN items can remain unresolved across cycles | Track fixes as P1/P2 tasks with explicit verification steps |
| Risk | Test-gap deferrals persist without ownership | Known gaps (graph signals, entity regex boundaries) remain untested | Add dedicated verification tasks and require evidence in checklist |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit document updates should remain reviewable in a single pass (<15 minutes for this folder)
- **NFR-P02**: Finding-to-task traceability should be immediate (one hop from checklist/spec to task)

### Security
- **NFR-S01**: No sensitive values or secrets introduced while documenting source references
- **NFR-S02**: File paths and citations must remain repository-internal and auditable

### Reliability
- **NFR-R01**: Every WARN finding must map to at least one concrete remediation task
- **NFR-R02**: Checklist evidence should be reproducible from cited files and existing test suites
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: Feature entries without implementation files are treated as decision records (e.g., F-01)
- Maximum length: Long finding notes remain concise enough for checklist evidence sections
- Invalid format: Missing source references are flagged as documentation completeness gaps

### Error Scenarios
- External service failure: N/A for this documentation-only audit workflow
- Network timeout: N/A for this documentation-only audit workflow
- Concurrent access: Re-run file diff verification before final sign-off if multiple editors update the same folder

### State Transitions
- Partial completion: Preserve PASS/WARN status and carry unresolved items into tasks.md
- Session expiry: Resume from saved spec/task/checklist anchors without losing finding context
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Four documents rewritten; five audited feature entries mapped |
| Risk | 12/25 | Moderate risk of losing finding traceability during template normalization |
| Research | 8/20 | Existing audit findings already available; no additional code research required |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should F-02 source inventory updates be applied in the same cycle as missing graph-signal test additions?
- Should the F-03 regex correction include a migration/backfill strategy for previously extracted entities?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
