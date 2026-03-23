---
title: "Feature Specification: manual-testing-per-playbook evaluation phase"
description: "Execute 2 manual test scenarios for the evaluation category, covering ablation studies and reporting dashboard."
trigger_phrases:
  - "evaluation testing"
  - "ablation test"
  - "dashboard test"
  - "eval reporting test"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook evaluation phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [006-analysis](../006-analysis/spec.md) |
| **Successor** | [008-bug-fixes-and-data-integrity](../008-bug-fixes-and-data-integrity/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The evaluation category contains 2 manual test scenarios covering ablation studies (channel-level Recall@20 delta measurement) and reporting dashboard (sprint/channel trend aggregation). Each scenario must be executed with defined prompts, expected behaviors verified, and evidence captured to validate that evaluation tools function correctly.

### Purpose
Execute both evaluation scenarios from the manual testing playbook, producing pass/fail verdicts with evidence for each scenario.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Execute both scenarios listed in the scenario registry below
- Capture pass/fail verdict per scenario with evidence
- Record deviations and unexpected behaviors

### Out of Scope
- Automated test creation -- manual execution only
- Bug fixing -- document failures, do not remediate
- Performance benchmarking -- functional verification only

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | EX-026 | Ablation studies (eval_run_ablation) | 07--evaluation/01-ablation-studies-evalrunablation.md |
| 2 | EX-027 | Reporting dashboard (eval_reporting_dashboard) | 07--evaluation/02-reporting-dashboard-evalreportingdashboard.md |

### Playbook Source Files

| Scenario ID | Playbook File |
|-------------|---------------|
| EX-026 | `../../manual_testing_playbook/07--evaluation/026-ablation-studies-eval-run-ablation.md` |
| EX-027 | `../../manual_testing_playbook/07--evaluation/027-reporting-dashboard-eval-reporting-dashboard.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute EX-026 Ablation studies | Pass/fail verdict with per-channel Recall@20 deltas in evidence |
| REQ-002 | Execute EX-027 Reporting dashboard | Pass/fail verdict with both text and JSON format output in evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Capture evidence artifacts for each scenario | Tool output stored as evidence |
| REQ-004 | Document deviations from expected behavior | Deviation notes in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both scenarios executed with pass/fail verdict recorded
- **SC-002**: Evidence captured for every scenario (tool output in both formats for EX-027)
- **SC-003**: Deviations documented with reproducibility notes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MCP server running | Cannot execute tool calls | Verify server health before starting |
| Dependency | SPECKIT_ABLATION=true env flag | EX-026 returns disabled-flag error if not set | Verify flag is active before execution |
| Dependency | Populated eval database | EX-027 returns empty dashboard if no prior eval runs exist | Confirm eval data exists or run EX-026 first |
| Risk | SPECKIT_ABLATION flag disabled in environment | High | Check and document flag state in evidence |
| Risk | Channel alias mismatch in playbook | Medium | Use MCP schema enums (vector, bm25, graph) not playbook aliases (semantic, keyword, graph) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Test Execution
- **NFR-T01**: EX-026 should run before EX-027 so dashboard has data to display
- **NFR-T02**: Evidence captured within the same session as execution
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Scenario-Specific
- SPECKIT_ABLATION=false: EX-026 will return a disabled-flag error rather than metrics
- Empty eval DB: EX-027 dashboard returns valid structure but empty sprint list
- Channel aliases: Playbook may use "semantic"/"keyword" but MCP schema requires "vector"/"bm25"
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | 2 scenarios, single category, no code changes |
| Risk | 6/25 | Feature flag dependency, channel alias mismatch |
| Research | 2/20 | Playbook provides exact steps |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at this time. All scenario definitions are complete in the playbook.
<!-- /ANCHOR:questions -->
