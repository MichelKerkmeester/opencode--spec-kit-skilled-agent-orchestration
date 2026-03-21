---
title: "Feature Specification: decisions-and-deferrals [template:level_2/spec.md]"
description: "Feature-centric code audit for decisions-and-deferrals features, documenting behavior alignment and test coverage deferrals."
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
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
| **Status** | Complete |
| **Created** | 2026-03-10 |
| **Branch** | `019-decisions-and-deferrals` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../018-ux-hooks/spec.md |
| **Successor** | ../020-feature-flag-reference/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The decisions-and-deferrals audit identified two WARN findings (F-02 and F-03) that blocked closure due to incomplete evidence mapping and a real sentence-boundary extraction bug. The spec folder now needs to reflect post-remediation reality with traceable verification evidence.

### Purpose
Provide a Level 2, verification-ready specification that captures final PASS outcomes after remediation with concrete closure evidence and no remaining product or ops decisions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit summary for the five decisions/deferrals findings using current source evidence from `feature_catalog/10--graph-signal-activation/` and `feature_catalog/13--memory-quality-and-indexing/`
- Closure evidence for the original WARN items F-02 and F-03
- Final verification outcomes and deterministic entity-refresh closure documentation

### Out of Scope
- New feature development beyond F-02/F-03 remediation and audit closure
- Manual playbook mapping - currently N/A for this catalog category

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/spec.md | Modify | Update phase status and post-remediation scope |
| .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/tasks.md | Modify | Mark remediation and verification tasks complete with evidence |
| .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/plan.md | Modify | Reflect completed implementation and verification phases |
| .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/checklist.md | Modify | Update F-02/F-03 outcomes from WARN to PASS with concrete evidence |
| .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/implementation-summary.md | Modify | Capture remediation pass, external evidence reconciliation, and final verification |
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
| REQ-003 | Create actionable closure tasks for the original WARN findings | Tasks capture owner action, target file, and expected correction |
| REQ-004 | Preserve audit methodology and verification workflow | Plan and checklist map directly to audit criteria and acceptance checks |
| REQ-005 | Ensure feature-catalog references resolve to existing markdown sources | All markdown references in this folder validate via `validate.sh --no-recursive` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 features are represented with status, issue class, and recommended action
- **SC-002**: Former WARN findings for F-02 and F-03 are reconciled to concrete remediation evidence
- **SC-003**: Verification commands for targeted tests and checks complete successfully
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 6. ACCEPTANCE SCENARIOS

1. **Given** all five catalog features are listed in scope, **When** checklist verification runs, **Then** each feature appears with its final status and a finding summary.
2. **Given** F-02 previously failed on evidence completeness, **When** feature-catalog sources are reconciled, **Then** graph-signals implementation/tests and migration-v19 touchpoints are explicitly referenced and F-02 can be marked PASS.
3. **Given** F-03 previously failed on cross-sentence extraction, **When** Rule-3 regex and regression tests are updated, **Then** sentence-boundary capture is prevented while dotted tokens like `Node.js` still extract correctly.
4. **Given** markdown cross-references are updated, **When** `validate.sh --no-recursive` runs for this folder, **Then** spec documentation integrity passes with no missing markdown targets.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `feature_catalog/10--graph-signal-activation/*.md` and `feature_catalog/13--memory-quality-and-indexing/*.md` | Missing/incorrect feature entries can skew audit conclusions | Reconcile findings against catalog source list before sign-off |
| Dependency | `mcp_server/lib/**` and `mcp_server/tests/**` references | Incomplete file inventory can hide behavior mismatches | Include all referenced implementation and migration files in source tables |
| Risk | Regex remediation changes extraction boundaries | Previously extracted cross-sentence entities may remain in stored data | Use the deterministic auto-entity rebuild path to refresh historical auto-generated rows when needed |
| Risk | Audit drift after closure | Future code changes can invalidate PASS evidence | Keep catalog source tables synchronized during future audits |
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
- Partial completion: Preserve current evidence and do not mark the phase complete until all closure items are recorded in tasks.md
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

- None. Historical auto-generated entity rows can be refreshed with the deterministic rebuild path documented in code and scripts.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
