---
title: "Feature Specification: manual-testing-per-playbook evaluation phase"
description: "Execute 6 manual test scenarios for the evaluation category, covering ablation studies, reporting dashboard, evaluation dashboard generation, ablation study execution, baseline comparison reporting, and learning history retrieval."
trigger_phrases:
  - "evaluation testing"
  - "ablation test"
  - "dashboard test"
  - "eval reporting test"
  - "evaluation dashboard generation"
  - "baseline comparison"
  - "learning history"
  - "EX-026 EX-027 EX-046 EX-047 EX-048 EX-049"
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
The evaluation category contains 6 manual test scenarios covering ablation studies (channel-level Recall@20 delta measurement), reporting dashboard (sprint/channel trend aggregation), evaluation dashboard generation, ablation study execution with custom parameters, baseline comparison reporting, and learning history retrieval. The four new scenarios (EX-046 through EX-049) expand coverage to comprehensive evaluation workflows and historical analysis. Each scenario must be executed with defined prompts, expected behaviors verified, and evidence captured to validate that evaluation tools function correctly.

### Purpose
Execute all six evaluation scenarios from the manual testing playbook, producing pass/fail verdicts with evidence for each scenario.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Execute all six scenarios listed in the scenario registry below
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
| 3 | EX-046 | Evaluation dashboard generation | 07--evaluation/02-reporting-dashboard-evalreportingdashboard.md |
| 4 | EX-047 | Ablation study execution with custom channels | 07--evaluation/01-ablation-studies-evalrunablation.md |
| 5 | EX-048 | Baseline comparison reporting | 07--evaluation/02-reporting-dashboard-evalreportingdashboard.md |
| 6 | EX-049 | Learning history retrieval | 07--evaluation/ (memory_get_learning_history) |

### Playbook Source Files

| Scenario ID | Playbook File |
|-------------|---------------|
| EX-026 | `.opencode/skill/system-spec-kit/manual_testing_playbook/07--evaluation/026-ablation-studies-eval-run-ablation.md` |
| EX-027 | `.opencode/skill/system-spec-kit/manual_testing_playbook/07--evaluation/027-reporting-dashboard-eval-reporting-dashboard.md` |
| EX-046 | `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md` |
| EX-047 | `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/047-encoding-intent-capture-at-index-time-r16.md` |
| EX-048 | `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/048-auto-entity-extraction-r10.md` |
| EX-049 | `.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/049-4-stage-pipeline-refactor-r6.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute EX-026 Ablation studies | Pass/fail verdict with per-channel Recall@20 deltas in evidence |
| REQ-002 | Execute EX-027 Reporting dashboard | Pass/fail verdict with both text and JSON format output in evidence |
| REQ-005 | Execute EX-046: invoke `eval_reporting_dashboard` with `format: "json"` and `sprintFilter` targeting a specific sprint label to generate a filtered evaluation dashboard | PASS if dashboard returns only data for the specified sprint; JSON structure includes sprint metrics, channel breakdown, and trend data for the filtered sprint. FAIL if dashboard returns data from other sprints or the sprint filter is ignored |
| REQ-006 | Execute EX-047: invoke `eval_run_ablation` with a custom `channels` subset (e.g., `["vector", "bm25"]` only, excluding graph) and `storeResults: true` | PASS if ablation runs only for the specified channels; per-channel Recall@20 deltas reported only for the requested subset; results stored in eval_metric_snapshots. FAIL if ablation includes unrequested channels or fails to restrict to the subset |
| REQ-007 | Execute EX-048: invoke `eval_reporting_dashboard` with `format: "text"` twice in succession (with an intervening `eval_run_ablation`) and compare the two outputs to verify baseline progression | PASS if the second dashboard reflects the new eval run data; sprint count or metric values differ from the first run; trend direction is consistent with the new data. FAIL if both dashboards are identical despite the intervening eval run |
| REQ-008 | Execute EX-049: invoke `memory_get_learning_history` with a known `specFolder` to retrieve the learning history for that folder | PASS if learning history returns a chronological list of context saves with timestamps, session summaries, and memory IDs; entries are ordered by date. FAIL if no history is returned for a folder with known saves or entries are unordered |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Capture evidence artifacts for each scenario | Tool output stored as evidence |
| REQ-010 | Document deviations from expected behavior | Deviation notes in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six scenarios executed with pass/fail verdict recorded
- **SC-002**: Evidence captured for every scenario (tool output in both formats for EX-027)
- **SC-003**: Deviations documented with reproducibility notes
- **SC-004**: EX-046 returns a filtered dashboard for the specified sprint only
- **SC-005**: EX-047 ablation runs only for the specified channel subset
- **SC-006**: EX-048 demonstrates baseline progression across two dashboard snapshots
- **SC-007**: EX-049 returns chronological learning history for the specified folder
### Acceptance Scenarios

**Given** the `007-evaluation` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `007-evaluation` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `007-evaluation` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `007-evaluation` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

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
| Scope | 9/25 | 6 scenarios across ablation, dashboard, comparison, and history operations |
| Risk | 9/25 | Feature flag dependency, channel alias mismatch, EX-048 requires sequential execution with intervening eval run |
| Research | 4/20 | Playbook provides core steps; new scenarios require MCP parameter discovery for filtering and history |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at this time. All scenario definitions are complete in the playbook.
<!-- /ANCHOR:questions -->
