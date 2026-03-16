---
title: "Implementation Plan: manual-testing-per-playbook query-intelligence phase [template:level_1/plan.md]"
description: "Phase 012 defines the execution plan for six query-intelligence manual tests in the Spec Kit Memory system. It sequences preconditions, sandboxed execution, evidence capture, and review-protocol verdicting for query-complexity routing, RSF shadow mode, channel diversity, confidence truncation, token budgets, and query expansion scenarios."
trigger_phrases:
  - "query intelligence execution plan"
  - "phase 012 manual tests"
  - "memory query intelligence verdict plan"
  - "hybrid rag query intelligence review"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook query-intelligence phase

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
This plan converts the six query-intelligence scenarios in the manual testing playbook into an ordered execution workflow for Phase 012. The phase covers flag-gated routing and budget behavior first (NEW-033, NEW-037), then shadow-mode and diversity verification (NEW-034, NEW-035), then score-processing scenarios (NEW-036, NEW-038). All scenarios are non-destructive; none require corpus mutations or irreversible state changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact prompts, command sequences, and pass criteria were extracted from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md).
- [x] Feature mappings for all 6 query-intelligence tests were confirmed against the cross-reference index and query-intelligence feature files.
- [x] Verdict rules from [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) were loaded for PASS/PARTIAL/FAIL handling.
- [x] Feature flag baseline state (SPECKIT_COMPLEXITY_ROUTER, SPECKIT_CHANNEL_MIN_REP, SPECKIT_CONFIDENCE_TRUNCATION, SPECKIT_RSF_FUSION, SPECKIT_EMBEDDING_EXPANSION) identified for fallback comparison scenarios.

### Definition of Done
- [ ] All 6 query-intelligence scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [ ] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [ ] Coverage is reported as 6/6 scenarios for Phase 012 with no skipped test IDs.
- [ ] Any feature-flag changes are restored or explicitly documented before closeout.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual query-intelligence test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature catalog links, runtime baseline flag state, and channel/corpus setup.
- **Execution layer**: Manual operator actions plus MCP calls to `memory_search` with varied query complexity tiers.
- **Evidence bundle**: Channel selection traces, score distributions, truncation metadata, budget allocation logs, expansion variant counts, and dedup outputs captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify source documents are open: playbook, review protocol, and linked query-intelligence feature files.
- [ ] Confirm MCP runtime access for `memory_search` with `includeTrace: true`.
- [ ] Record baseline feature flag state for SPECKIT_COMPLEXITY_ROUTER, SPECKIT_CHANNEL_MIN_REP, SPECKIT_CONFIDENCE_TRUNCATION, SPECKIT_RSF_FUSION, and SPECKIT_EMBEDDING_EXPANSION before any flag-toggle testing.
- [ ] Prepare a varied-complexity sandbox corpus to drive simple, moderate, and complex query classification across all scenarios.

### Phase 2: Non-Destructive Tests
- [ ] Run NEW-033 to verify query complexity routing: confirm simple queries select 2 channels, moderate 3, complex 5; then disable SPECKIT_COMPLEXITY_ROUTER and confirm fallback to "complex" default routing.
- [ ] Run NEW-034 to confirm RSF shadow-mode status: inspect branch conditions in code path, run queries, and confirm RRF remains the sole live fusion method with no runtime RSF branch affecting returned results.
- [ ] Run NEW-035 to validate channel min-representation: execute a dominance query where one channel would monopolize top-k; confirm every active channel has at least one representative above the 0.005 quality floor.
- [ ] Run NEW-036 to verify confidence-based truncation: execute a long-tail query; confirm results are trimmed at the relevance cliff (first gap exceeding 2x median gap); confirm minimum 3 results are always returned; confirm cutoff metadata is visible in the trace.
- [ ] Run NEW-037 to verify dynamic token budget allocation: run queries at each complexity tier; confirm budgets of 1500/2500/4000 tokens respectively; then disable SPECKIT_EMBEDDING_EXPANSION (the token-budget flag) and confirm fallback to 4000-token default.
- [ ] Run NEW-038 to validate query expansion: run a complex query and confirm >=2 expansion variants produced; confirm baseline+expanded results are deduplicated with baseline-first ordering; run a simple query and confirm expansion is suppressed.

### Phase 3: Evidence Collection and Verdict
- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 6/6 scenarios with linked evidence references.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| NEW-033 | Query complexity router (R15) | `Verify query complexity router (R15).` | manual |
| NEW-034 | Relative score fusion in shadow mode (R14/N1) | `Check RSF shadow behavior post-cleanup.` | manual |
| NEW-035 | Channel min-representation (R2) | `Validate channel min-representation (R2).` | MCP |
| NEW-036 | Confidence-based result truncation (R15-ext) | `Verify confidence-based truncation (R15-ext).` | MCP |
| NEW-037 | Dynamic token budget allocation (FUT-7) | `Verify dynamic token budgets (FUT-7).` | manual |
| NEW-038 | Query expansion (R12) | `Validate query expansion (R12).` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/12--query-intelligence/`](../../feature_catalog/12--query-intelligence/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| MCP runtime for `memory_search` with trace enabled | Internal | Yellow | Query-intelligence scenarios cannot be executed or compared |
| Varied-complexity sandbox corpus for routing tier tests | Internal | Yellow | NEW-033, NEW-037, and NEW-038 cannot produce reliable tier-classification evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Feature flag changes for SPECKIT_COMPLEXITY_ROUTER, SPECKIT_CHANNEL_MIN_REP, SPECKIT_CONFIDENCE_TRUNCATION, or SPECKIT_EMBEDDING_EXPANSION leave the runtime in a non-default state that could taint later scenarios.
- **Procedure**: Restore all feature flags to their default-enabled state (set to `"true"` or unset), restart the MCP runtime, discard any evidence captured under the wrong flag state, and rerun only the affected scenarios after the baseline is clean again.
<!-- /ANCHOR:rollback -->

---
