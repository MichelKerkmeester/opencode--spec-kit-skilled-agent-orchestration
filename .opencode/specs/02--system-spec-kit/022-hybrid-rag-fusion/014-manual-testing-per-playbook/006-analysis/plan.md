---
title: "Implementation Plan: manual-testing-per-playbook analysis phase [template:level_1/plan.md]"
description: "Phase 006 defines the execution plan for seven analysis manual tests in the Spec Kit Memory system. It sequences preconditions, sandboxed execution, evidence capture, and review-protocol verdicting for causal graph and learning measurement scenarios."
trigger_phrases:
  - "analysis execution plan"
  - "phase 006 manual tests"
  - "causal graph verdict plan"
  - "hybrid rag analysis review"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook analysis phase

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
This plan converts the analysis scenarios in the manual testing playbook into an ordered execution workflow for Phase 006. The phase covers non-destructive causal graph reads and learning cycle scenarios first, then the single destructive edge deletion scenario last. EX-021 requires a named sandbox checkpoint created before execution and must never run against active project data.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact prompts, command sequences, and pass criteria were extracted from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md).
- [x] Feature mappings for all 7 analysis tests were confirmed against the cross-reference index and analysis feature files.
- [x] Verdict rules from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) were loaded for PASS/PARTIAL/FAIL handling.
- [x] EX-021 destructive scope and sandbox isolation requirements were identified and documented.

### Definition of Done
- [ ] All 7 analysis scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [ ] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [ ] Coverage is reported as 7/7 scenarios for Phase 006 with no skipped test IDs.
- [ ] EX-021 sandbox data and rollback checkpoint are documented or restored before closeout.
- [ ] EX-023 preflight `(specFolder, taskId)` is recorded and matches EX-024 postflight input before both scenarios close.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual analysis test execution pipeline with review-gated evidence collection and sandbox isolation for the destructive scenario.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature catalog links, runtime baseline, causal graph sandbox data, and named rollback checkpoint for EX-021.
- **Execution layer**: Manual operator actions plus MCP calls to `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `memory_drift_why`, `task_preflight`, `task_postflight`, and `memory_get_learning_history`.
- **Evidence bundle**: Tool outputs, causal graph traces, Learning Index records, and before/after edge-count comparisons captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify source documents are open: playbook, review protocol, and linked analysis feature files.
- [ ] Confirm MCP runtime access for `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `memory_drift_why`, `task_preflight`, `task_postflight`, and `memory_get_learning_history`.
- [ ] Create and record a named checkpoint for the sandbox spec folder before running EX-021.
- [ ] Agree on `specFolder` and `taskId` values for EX-023/EX-024 before running either scenario.

### Phase 2: Non-Destructive Tests
- [ ] Run EX-019 to create a causal edge and confirm it appears in the bidirectional trace from `memory_drift_why`.
- [ ] Run EX-020 to retrieve causal graph statistics and confirm edge count, coverage percentage, and health status are returned.
- [ ] Run EX-022 to trace both directions of a causal chain to depth 4 and confirm the expected path is returned.
- [ ] Run EX-023 to capture the epistemic preflight baseline for `pipeline-v2-audit` and confirm the record is persisted.
- [ ] Run EX-024 immediately after EX-023 using the same `specFolder` and `taskId`; confirm the Learning Index delta record is saved.
- [ ] Run EX-025 with `onlyComplete:true` and confirm completed learning cycles including EX-023/EX-024 are listed.

### Phase 3: Destructive Tests
- [ ] Confirm sandbox isolation and named checkpoint exist before proceeding with EX-021.
- [ ] Run EX-021: retrieve edge IDs from `memory_drift_why` on the sandbox memory, call `memory_causal_unlink` with the target edge ID, then re-run `memory_drift_why` to confirm the edge is absent from the trace.
- [ ] If sandbox isolation cannot be confirmed or active project data would be modified, stop and mark EX-021 blocked instead of proceeding.
- [ ] Document checkpoint name and sandbox spec folder path alongside EX-021 evidence.

### Phase 4: Evidence Collection and Verdict
- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 7/7 scenarios with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| EX-019 | Causal edge creation | `Link source->target supports strength 0.8` | MCP |
| EX-020 | Causal graph statistics | `Return causal stats and coverage` | MCP |
| EX-021 | Causal edge deletion [DESTRUCTIVE] | `Delete causal edge by ID in sandbox` | manual |
| EX-022 | Causal chain tracing | `Trace both directions to depth 4` | MCP |
| EX-023 | Epistemic baseline capture | `Create preflight for pipeline-v2-audit` | MCP |
| EX-024 | Post-task learning measurement | `Complete postflight for pipeline-v2-audit` | MCP |
| EX-025 | Learning history | `Show completed learning history` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) (verdict rules) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/06--analysis/`](../../feature_catalog/06--analysis/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| MCP runtime for causal graph and learning tools | Internal | Yellow | Analysis scenarios cannot be executed or compared |
| Disposable sandbox spec folder and rollback checkpoint | Internal | Yellow | EX-021 cannot run safely without confirmed sandbox isolation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: EX-021 edge deletion leaves the causal graph in a state that could taint later analysis scenarios, or sandbox isolation fails after execution begins.
- **Procedure**: Restore the named sandbox checkpoint created in Phase 1, discard any compromised evidence, verify graph integrity with `memory_causal_stats`, and rerun only EX-021 after the baseline is confirmed clean. If checkpoint restoration fails, mark EX-021 blocked and escalate before proceeding to the verdict phase.
<!-- /ANCHOR:rollback -->

---
