---
title: "Feature Specification: [02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/006-analysis/spec]"
description: "Execute 7 manual test scenarios for the analysis category, covering causal graph tools, epistemic measurement, and learning history."
trigger_phrases:
  - "analysis testing"
  - "causal graph test"
  - "epistemic testing"
  - "learning history test"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook analysis phase

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
| **Predecessor** | [005-lifecycle](../005-lifecycle/spec.md) |
| **Successor** | [007-evaluation](../007-evaluation/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The analysis category contains 7 manual test scenarios covering causal graph operations (create, stats, delete, trace), epistemic measurement (preflight, postflight), and learning history retrieval. Each scenario must be executed with defined prompts, expected behaviors verified, and evidence captured to validate that analysis tools function correctly.

### Purpose
Execute all 7 analysis scenarios from the manual testing playbook, producing pass/fail verdicts with evidence for each scenario.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Execute all 7 scenarios listed in the scenario registry below
- Capture pass/fail verdict per scenario with evidence
- Record deviations and unexpected behaviors

### Out of Scope
- Automated test creation -- manual execution only
- Bug fixing -- document failures, do not remediate
- Performance benchmarking -- functional verification only

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | EX-019 | Causal edge creation (memory_causal_link) | 06--analysis/01-causal-edge-creation-memorycausallink.md |
| 2 | EX-020 | Causal graph statistics (memory_causal_stats) | 06--analysis/02-causal-graph-statistics-memorycausalstats.md |
| 3 | EX-021 | Causal edge deletion (memory_causal_unlink) | 06--analysis/03-causal-edge-deletion-memorycausalunlink.md |
| 4 | EX-022 | Causal chain tracing (memory_drift_why) | 06--analysis/04-causal-chain-tracing-memorydriftwhy.md |
| 5 | EX-023 | Epistemic baseline capture (task_preflight) | 06--analysis/05-epistemic-baseline-capture-taskpreflight.md |
| 6 | EX-024 | Post-task learning measurement (task_postflight) | 06--analysis/06-post-task-learning-measurement-taskpostflight.md |
| 7 | EX-025 | Learning history (memory_get_learning_history) | 06--analysis/07-learning-history-memorygetlearninghistory.md |

### Playbook Source Files

| Scenario ID | Playbook File |
|-------------|---------------|
| EX-019 | `../../manual_testing_playbook/06--analysis/019-causal-edge-creation-memory-causal-link.md` |
| EX-020 | `../../manual_testing_playbook/06--analysis/020-causal-graph-statistics-memory-causal-stats.md` |
| EX-021 | `../../manual_testing_playbook/06--analysis/021-causal-edge-deletion-memory-causal-unlink.md` |
| EX-022 | `../../manual_testing_playbook/06--analysis/022-causal-chain-tracing-memory-drift-why.md` |
| EX-023 | `../../manual_testing_playbook/06--analysis/023-epistemic-baseline-capture-task-preflight.md` |
| EX-024 | `../../manual_testing_playbook/06--analysis/024-post-task-learning-measurement-task-postflight.md` |
| EX-025 | `../../manual_testing_playbook/06--analysis/025-learning-history-memory-get-learning-history.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute EX-019 Causal edge creation | Pass/fail verdict with tool output evidence |
| REQ-002 | Execute EX-020 Causal graph statistics | Pass/fail verdict with tool output evidence |
| REQ-003 | Execute EX-021 Causal edge deletion | Pass/fail verdict with tool output evidence |
| REQ-004 | Execute EX-022 Causal chain tracing | Pass/fail verdict with tool output evidence |
| REQ-005 | Execute EX-023 Epistemic baseline capture | Pass/fail verdict with tool output evidence |
| REQ-006 | Execute EX-024 Post-task learning measurement | Pass/fail verdict with tool output evidence |
| REQ-007 | Execute EX-025 Learning history | Pass/fail verdict with tool output evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Capture evidence artifacts for each scenario | Screenshots, tool output, or log excerpts stored |
| REQ-009 | Document deviations from expected behavior | Deviation notes in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 scenarios executed with pass/fail verdict recorded
- **SC-002**: Evidence captured for every scenario (tool output, screenshots, or logs)
- **SC-003**: Deviations documented with reproducibility notes
### Acceptance Scenarios

**Given** the `006-analysis` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `006-analysis` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `006-analysis` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `006-analysis` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MCP server running | Cannot execute tool calls | Verify server health before starting |
| Dependency | Existing memories in database | Causal link tests need source/target IDs | Create test memories if needed |
| Risk | EX-021 is destructive (deletes causal edge) | High | Run in disposable sandbox; create checkpoint before execution |
| Risk | EX-023/EX-024 share specFolder/taskId pair | Medium | Execute EX-023 before EX-024 in same session |
| Risk | Database state from prior tests | Medium | Run memory_health check before starting |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Test Execution
- **NFR-T01**: Each scenario executed independently (no cross-scenario dependencies except EX-023/EX-024 pair)
- **NFR-T02**: Evidence captured within the same session as execution
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Scenario-Specific
- Empty causal graph: EX-020 stats and EX-022 tracing may return empty results if no edges exist
- Missing preflight: EX-024 postflight requires a prior preflight record to compute deltas
- No learning history: EX-025 may return empty if no preflight/postflight pairs exist
- EX-021 sandbox isolation: Must confirm sandbox before executing destructive edge deletion
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 7 scenarios, single category, no code changes |
| Risk | 8/25 | EX-021 destructive, EX-023/024 ordering dependency |
| Research | 3/20 | Playbook provides exact steps |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at this time. All scenario definitions are complete in the playbook.
<!-- /ANCHOR:questions -->
