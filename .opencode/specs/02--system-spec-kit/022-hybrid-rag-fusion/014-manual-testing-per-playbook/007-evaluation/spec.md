---
title: "Feature Specification: manual-testing-per-playbook evaluation phase [template:level_1/spec.md]"
description: "Phase 007 documents the evaluation manual test packet for the Spec Kit Memory system. It breaks two evaluation scenarios out of the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "evaluation manual testing"
  - "phase 007 evaluation"
  - "ablation studies manual test"
  - "hybrid rag evaluation playbook"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook evaluation phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
| **Predecessor Phase** | `006-analysis` |
| **Successor Phase** | `008-bug-fixes-and-data-integrity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual evaluation scenarios for the Spec Kit Memory system currently live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated evaluation packet, Phase 007 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results.

### Purpose
Provide a single evaluation-focused specification that maps both Phase 007 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| EX-026 | Ablation studies (eval_run_ablation) | [`../../feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md`](../../feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md) | `Run ablation on retrieval channels` | `eval_run_ablation({ dataset:"retrieval-channels-smoke", channels:["semantic","keyword","graph"], storeResults:true })` -> `eval_reporting_dashboard({ format:"json", limit:10 })` |
| EX-027 | Reporting dashboard (eval_reporting_dashboard) | [`../../feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md`](../../feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md) | `Generate the latest dashboard report` | `eval_reporting_dashboard(format:text)` and `eval_reporting_dashboard(format:json)` |

### Out of Scope
- Executing the two evaluation scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-evaluation phases from other phase folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 007 evaluation requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 007 evaluation execution plan and review workflow |
| `tasks.md` | Create | Phase 007 task tracker for setup, execution, and verification work |
| `checklist.md` | Create | Phase 007 verification checklist for all quality gates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document EX-026 ablation studies scenario with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS if per-channel deltas are reported and ablation run produces metrics/verdict |
| REQ-002 | Document EX-027 reporting dashboard scenario with its exact playbook prompt, dual-format command sequence, evidence target, and feature link. | PASS if report is generated without error in both text and JSON formats |

No P1 items are defined for this phase; both evaluation scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 2 evaluation tests are documented with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for EX-026 and EX-027 will be collected.
- **SC-003**: Reviewers can audit every Phase 007 scenario using this folder plus the linked playbook (`../../manual_testing_playbook/manual_testing_playbook.md`) and review protocol (`../../manual_testing_playbook/review_protocol.md`).
- **SC-004**: The phase packet contains no placeholder or template text and is ready for manual execution planning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth and update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review and do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/07--evaluation/`](../../feature_catalog/07--evaluation/) | Supplies feature context for each evaluation scenario | Keep every test row linked to its mapped evaluation feature file |
| Dependency | MCP runtime with `SPECKIT_ABLATION=true` and a populated eval dataset | Required to execute `eval_run_ablation` and `eval_reporting_dashboard` scenarios | Confirm the ablation flag is active and the `retrieval-channels-smoke` eval dataset exists before running EX-026 |
| Risk | EX-026 requires `SPECKIT_ABLATION=true`; if the flag is off the MCP handler returns a disabled-flag error and the run produces no metrics | High | Verify the flag before execution and document the enabled/disabled state in evidence |
| Risk | EX-027 depends on populated `eval_metric_snapshots` and `eval_channel_results` tables; an empty database will produce an empty dashboard rather than a failure | Medium | Pre-populate or confirm prior eval run data exists before executing the dashboard scenario |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which eval dataset should be treated as the canonical `retrieval-channels-smoke` fixture for EX-026 ablation runs, and where is it defined?
- For EX-027, which sprint labels or date range should reviewers use to confirm trend analysis is exercised rather than just returning an empty sprint list?
<!-- /ANCHOR:questions -->

---
