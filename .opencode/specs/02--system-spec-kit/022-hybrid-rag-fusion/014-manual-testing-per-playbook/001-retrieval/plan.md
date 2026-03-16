---
title: "Implementation Plan: manual-testing-per-playbook retrieval phase [template:level_1/plan.md]"
description: "Phase 001 defines the execution plan for nine retrieval manual tests in the Spec Kit Memory system. It sequences preconditions, sandboxed execution, evidence capture, and review-protocol verdicting for retrieval-focused scenarios."
trigger_phrases:
  - "retrieval execution plan"
  - "phase 001 manual tests"
  - "memory retrieval verdict plan"
  - "hybrid rag retrieval review"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook retrieval phase

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
This plan converts the retrieval scenarios in the manual testing playbook into an ordered execution workflow for Phase 001. The phase covers baseline retrieval behavior first, then trace and fallback behavior, and finally sandboxed stateful scenarios that require edits or runtime flag changes before verdict review.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact prompts, command sequences, and pass criteria were extracted from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md).
- [x] Feature mappings for all 9 retrieval tests were confirmed against the cross-reference index and retrieval feature files.
- [x] Verdict rules from [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) were loaded for PASS/PARTIAL/FAIL handling.
- [x] Sandbox expectations were identified for stateful scenarios NEW-086 and NEW-143.

### Definition of Done
- [ ] All 9 retrieval scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [ ] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [ ] Coverage is reported as 9/9 scenarios for Phase 001 with no skipped test IDs.
- [ ] Any sandbox mutations or rollout-flag changes are restored or explicitly documented before closeout.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual retrieval test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature catalog links, runtime baseline, and sandbox/checkpoint setup.
- **Execution layer**: Manual operator actions plus MCP calls to `memory_context`, `memory_search`, and `memory_match_triggers`.
- **Evidence bundle**: Tool outputs, runtime logs, flag snapshots, and ordering comparisons captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify source documents are open: playbook, review protocol, and linked retrieval feature files.
- [ ] Confirm MCP runtime access for `memory_context`, `memory_search`, and `memory_match_triggers`.
- [ ] Record baseline environment flags before any fallback or rollout-state testing.
- [ ] Prepare disposable sandbox data for trigger edits and a graph-connected sandbox corpus for rollout diagnostics.

### Phase 2: Non-Destructive Tests
- [ ] Run EX-001, EX-002, EX-003, EX-004, and EX-005 in order to cover orchestration, search, trigger, hybrid, and pipeline-baseline retrieval behavior.
- [ ] Run NEW-109 after baseline retrieval tests to inspect tiered degradation behavior and fallback-disabled comparison without mutating corpus content.
- [ ] Run NEW-142 to compare trace-enabled versus non-trace `memory_context` responses and confirm no session-transition leakage.

### Phase 3: Destructive Tests
- [ ] Run NEW-086 only against disposable sandbox memories; checkpoint the original trigger phrases before editing and capture re-index evidence immediately after mutation.
- [ ] Run NEW-143 in an isolated runtime with the same sandbox corpus across `trace_only`, `bounded_runtime`, and `off`; restart between rollout states and restore default flags after comparison capture.
- [ ] If sandbox isolation fails or shared data would be modified, stop execution and mark the scenario blocked instead of proceeding.

### Phase 4: Evidence Collection and Verdict
- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 9/9 scenarios with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| EX-001 | Intent-aware context pull | `Use memory_context in auto mode for: fix flaky index scan retry logic` | MCP |
| EX-002 | Hybrid precision check | `Search for checkpoint restore clearExisting transaction rollback` | MCP |
| EX-003 | Fast recall path | `Run trigger matching for resume previous session blockers with cognitive=true` | MCP |
| EX-004 | Channel fusion sanity | `Validate graph search fallback tiers behavior` | MCP |
| EX-005 | Stage invariant verification | `Search Stage4Invariant score snapshot verifyScoreInvariant` | MCP |
| NEW-086 | Confirm trigger edit causes re-index | `Validate BM25 trigger phrase re-index gate.` | manual |
| NEW-109 | Confirm 3-tier degradation chain triggers correctly | `Validate SPECKIT_SEARCH_FALLBACK tiered degradation.` | manual |
| NEW-142 | Session transition trace contract | `Validate Markovian session transition tracing for memory_context.` | MCP |
| NEW-143 | Bounded graph-walk rollout and diagnostics | `Validate bounded graph-walk rollout states and trace diagnostics.` | manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/01--retrieval/`](../../feature_catalog/01--retrieval/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| MCP runtime for `memory_context`, `memory_search`, and `memory_match_triggers` | Internal | Yellow | Retrieval scenarios cannot be executed or compared |
| Disposable sandbox corpus and rollback checkpoint | Internal | Yellow | Stateful retrieval tests cannot run safely |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Trigger-phrase edits, runtime-flag changes, or sandbox outputs leave the retrieval environment in a state that could taint later scenarios.
- **Procedure**: Restore the sandbox checkpoint, revert trigger-phrase edits, restart the runtime with default flag values, discard compromised evidence, and rerun only the affected scenarios after the baseline is clean again.
<!-- /ANCHOR:rollback -->

---
