---
title: "Implementation Plan: manual-testing-per-playbook evaluation phase [template:level_1/plan.md]"
description: "Phase 007 defines the execution plan for two evaluation manual tests in the Spec Kit Memory system. It sequences preconditions, flag verification, eval dataset setup, execution, evidence capture, and review-protocol verdicting for evaluation-focused scenarios."
trigger_phrases:
  - "evaluation execution plan"
  - "phase 007 manual tests"
  - "ablation dashboard verdict plan"
  - "hybrid rag evaluation review"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook evaluation phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L1 |
| **Storage** | Filesystem spec folder + linked evidence artifacts |
| **Testing** | manual + MCP |

### Overview
This plan converts the evaluation scenarios in the manual testing playbook into an ordered execution workflow for Phase 007. The phase covers the ablation study first (which requires `SPECKIT_ABLATION=true` and a valid eval dataset), then the reporting dashboard (which requires prior eval run data in the database). Both scenarios are non-destructive read or measurement operations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact prompts, command sequences, and pass criteria were extracted from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md).
- [x] Feature mappings for both evaluation tests were confirmed against the cross-reference index and evaluation feature files.
- [x] Verdict rules from [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) were loaded for PASS/PARTIAL/FAIL handling.
- [ ] `SPECKIT_ABLATION=true` is confirmed active and the `retrieval-channels-smoke` eval dataset is available before EX-026 execution.

### Definition of Done
- [ ] Both evaluation scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [ ] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [ ] Coverage is reported as 2/2 scenarios for Phase 007 with no skipped test IDs.
- [ ] Ablation flag and eval dataset state are restored or explicitly documented before closeout.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual evaluation test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature catalog links, runtime baseline, `SPECKIT_ABLATION` flag state, and eval dataset availability.
- **Execution layer**: Manual operator actions plus MCP calls to `eval_run_ablation` and `eval_reporting_dashboard`.
- **Evidence bundle**: Tool outputs, per-channel delta tables, dashboard JSON/text outputs, and ablation metric snapshots captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> verify flag + dataset -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify source documents are open: playbook, review protocol, and linked evaluation feature files.
- [ ] Confirm MCP runtime access for `eval_run_ablation` and `eval_reporting_dashboard`.
- [ ] Verify `SPECKIT_ABLATION=true` is set in the runtime environment before attempting EX-026.
- [ ] Confirm the `retrieval-channels-smoke` eval dataset exists and is populated; document its location in evidence.
- [ ] Confirm `eval_metric_snapshots` and `eval_channel_results` tables contain prior run data for EX-027 dashboard completeness.

### Phase 2: Non-Destructive Tests
- [ ] Run EX-026 with channels `["semantic","keyword","graph"]` and `storeResults:true`, then follow with `eval_reporting_dashboard({ format:"json", limit:10 })` to confirm the ablation results are queryable.
- [ ] Run EX-027 in both text format and JSON format to confirm trend/channel/summary data is present in each output variant.

### Phase 3: Evidence Collection and Verdict
- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 2/2 scenarios with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| EX-026 | Ablation studies (eval_run_ablation) | `Run ablation on retrieval channels` | MCP |
| EX-027 | Reporting dashboard (eval_reporting_dashboard) | `Generate the latest dashboard report` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/07--evaluation/`](../../feature_catalog/07--evaluation/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| MCP runtime with `SPECKIT_ABLATION=true` | Internal | Yellow | EX-026 returns disabled-flag error and no metrics are produced |
| `retrieval-channels-smoke` eval dataset | Internal | Yellow | EX-026 ablation run cannot execute against a valid channel set |
| Populated `eval_metric_snapshots` and `eval_channel_results` tables | Internal | Yellow | EX-027 dashboard returns empty sprint list instead of trend data |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Ablation flag changes or eval dataset modifications leave the evaluation environment in a state that could taint later scenarios.
- **Procedure**: Restore the original `SPECKIT_ABLATION` flag value, discard any ablation metric snapshots written to `eval_metric_snapshots` during testing (negative timestamp IDs), and rerun only the affected scenario after the baseline database state is confirmed clean.
<!-- /ANCHOR:rollback -->

---
