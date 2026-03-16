---
title: "Implementation Plan: manual-testing-per-playbook discovery phase [template:level_1/plan.md]"
description: "Phase 003 defines the execution plan for three discovery manual tests in the Spec Kit Memory system. It sequences preconditions, read-only execution, evidence capture, and review-protocol verdicting for discovery-focused scenarios."
trigger_phrases:
  - "discovery execution plan"
  - "phase 003 manual tests"
  - "memory discovery verdict plan"
  - "hybrid rag discovery review"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook discovery phase

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
This plan converts the discovery scenarios in the manual testing playbook into an ordered execution workflow for Phase 003. The phase covers folder inventory first via `memory_list`, then system-level dashboard statistics via `memory_stats`, and finally health diagnostics and alias integrity via `memory_health`. All three scenarios are read-only and require no sandbox mutation or destructive setup.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact prompts, command sequences, and pass criteria were extracted from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md).
- [x] Feature mappings for all 3 discovery tests were confirmed against the cross-reference index and discovery feature files.
- [x] Verdict rules from [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) were loaded for PASS/PARTIAL/FAIL handling.
- [x] No destructive preconditions were identified for EX-011, EX-012, or EX-013.

### Definition of Done
- [ ] All 3 discovery scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [ ] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [ ] Coverage is reported as 3/3 scenarios for Phase 003 with no skipped test IDs.
- [ ] No unintended mutations were introduced during discovery-phase execution.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual discovery test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature catalog links, and MCP runtime access to an indexed memory corpus.
- **Execution layer**: Manual operator actions plus MCP calls to `memory_list`, `memory_stats`, and `memory_health`.
- **Evidence bundle**: Tool outputs, pagination totals, dashboard field presence, and health/alias diagnostics captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify source documents are open: playbook, review protocol, and linked discovery feature files.
- [ ] Confirm MCP runtime access for `memory_list`, `memory_stats`, and `memory_health`.
- [ ] Identify a representative spec folder path to use as the `specFolder` parameter for EX-011 pagination.
- [ ] Confirm the indexed corpus is stable and no concurrent mutations are in flight before discovery runs begin.

### Phase 2: Non-Destructive Tests
- [ ] Run EX-011 to browse a target spec folder with `memory_list(specFolder, limit, offset)` and verify paginated inventory including `total`, `count`, `limit`, `offset`, and resolved `sortBy` are present.
- [ ] Run EX-012 to capture the system dashboard with `memory_stats(folderRanking:composite, includeScores:true)` and verify counts, tiers, graph channel metrics, and folder ranking fields are populated.
- [ ] Run EX-013 in two passes: first `memory_health(reportMode:full)` to confirm system readiness diagnostics, then `memory_health(reportMode:divergent_aliases)` to confirm alias-conflict triage payload returns without error.

### Phase 3: Evidence Collection and Verdict
- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 3/3 scenarios with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| EX-011 | Folder inventory audit | `List memories in target spec folder` | MCP |
| EX-012 | System baseline snapshot | `Return stats with composite ranking` | MCP |
| EX-013 | Index/FTS integrity check | `Run full health and divergent_aliases` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/03--discovery/`](../../feature_catalog/03--discovery/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| MCP runtime for `memory_list`, `memory_stats`, and `memory_health` | Internal | Yellow | Discovery scenarios cannot be executed or compared |
| Indexed memory corpus (read-only) | Internal | Yellow | Pagination, dashboard, and health diagnostics cannot produce meaningful evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An accidental `autoRepair: true` with `confirmed: true` call during EX-013 alters alias or index state, or a corpus mutation is detected mid-run.
- **Procedure**: Halt remaining discovery runs immediately. Document the mutation in triage notes. Restore affected index state via a prior checkpoint if one exists. Re-verify corpus baseline before rerunning any impacted scenario.
<!-- /ANCHOR:rollback -->

---
