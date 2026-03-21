---
title: "Implementation Plan: manual-testing-per-playbook retrieval-enhancements phase [template:level_1/plan.md]"
description: "Phase 015 defines the execution plan for nine retrieval-enhancements manual tests in the Spec Kit Memory system. It sequences preconditions, sandboxed execution, evidence capture, and review-protocol verdicting for retrieval-enhancements-focused scenarios."
trigger_phrases:
  - "retrieval enhancements execution plan"
  - "phase 015 manual tests"
  - "memory retrieval enhancements verdict plan"
  - "hybrid rag retrieval enhancements review"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook retrieval-enhancements phase

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
This plan converts the retrieval-enhancements scenarios in the manual testing playbook into an ordered execution workflow for Phase 015. The phase covers non-stateful read-only scenarios first (hierarchy retrieval, constitutional injection, summary channel, provenance envelopes, context headers, and tier-2 fallback), then stateful or flag-dependent scenarios that require corpus setup, cycle triggers, env var changes, or runtime restarts before verdict review.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact prompts, command sequences, and pass criteria were extracted from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md).
- [x] Feature mappings for all 9 retrieval-enhancements tests were confirmed against the cross-reference index and retrieval-enhancements feature files.
- [x] Verdict rules from [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) were loaded for PASS/PARTIAL/FAIL handling.
- [x] Sandbox expectations were identified for stateful scenarios 058 (consolidation cycle) and 060 (entity linking).

### Definition of Done
- [ ] All 9 retrieval-enhancements scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [ ] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [ ] Coverage is reported as 9/9 scenarios for Phase 015 with no skipped test IDs.
- [ ] Any sandbox mutations, consolidation cycles, or env var changes are restored or explicitly documented before closeout.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual retrieval-enhancements test execution pipeline with review-gated evidence collection.

### Key Components
- **Preconditions pack**: Playbook, review protocol, feature catalog links, runtime baseline, corpus size metrics, env var snapshot, and sandbox/checkpoint setup.
- **Execution layer**: Manual operator actions plus MCP calls to `memory_search`, `memory_context`, consolidation cycle triggers, and the entity linker.
- **Evidence bundle**: Tool outputs, runtime logs, flag snapshots, corpus size counts, edge density metrics, and header comparison outputs captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Verify source documents are open: playbook, review protocol, and linked retrieval-enhancements feature files.
- [ ] Confirm MCP runtime access for `memory_search` and `memory_context`.
- [ ] Record baseline environment flags (`SPECKIT_RESPONSE_TRACE`, `SPECKIT_CONTEXT_HEADERS`, `SPECKIT_CONSOLIDATION`, `SPECKIT_ENTITY_LINKING`, `SPECKIT_MEMORY_SUMMARIES`) before any scenario execution.
- [ ] Capture corpus size count to determine whether the summary channel (059) threshold is satisfied.
- [ ] Prepare disposable sandbox data for consolidation (058) and a corpus with shared cross-document entities for entity linking (060).

### Phase 2: Non-Stateful Tests
- [ ] Run 056 to verify constitutional directive metadata appears in retrieval results with correct tier classification.
- [ ] Run 057 to verify hierarchy-aware retrieval scores self > parent > sibling for nested spec folder structures.
- [ ] Run 077 to verify tier-2 fallback sets `forceAllChannels=true` and results contain multi-channel contributions.
- [ ] Run 096 to compare `includeTrace` on/off responses and confirm all 7 score sub-fields appear only when trace is requested.
- [ ] Run 145 to compare header-injected and header-suppressed search results under `SPECKIT_CONTEXT_HEADERS` toggle.

### Phase 3: Stateful and Flag-Dependent Tests
- [ ] Run 055 by invoking a non-memory-aware tool path and then triggering compaction; confirm auto-surface hook fires and surfaces context-relevant memories at both lifecycle points.
- [ ] Run 058 only against disposable sandbox memories; checkpoint original edge weights before triggering the N3-lite cycle and capture contradiction/Hebbian/staleness sub-outputs immediately after.
- [ ] Run 059 against a corpus verified to exceed the 5,000-memory threshold; confirm summary channel appears in Stage 1 and confirm the channel is skipped below the threshold.
- [ ] Run 060 by verifying shared entities exist across distinct spec folders, running the entity linker, and confirming supports-edges are created within density guard limits.
- [ ] If sandbox isolation fails or shared data would be mutated unexpectedly, stop execution and mark the scenario blocked instead of proceeding.

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
| 055 | Dual-scope memory auto-surface | `Validate dual-scope auto-surface (TM-05).` | manual |
| 056 | Constitutional memory as expert knowledge injection | `Verify constitutional memory directive injection (PI-A4).` | MCP |
| 057 | Spec folder hierarchy as retrieval structure | `Validate spec-folder hierarchy retrieval (S4).` | MCP |
| 058 | Lightweight consolidation | `Run lightweight consolidation cycle (N3-lite).` | manual |
| 059 | Memory summary search channel | `Verify memory summary search channel (R8).` | MCP |
| 060 | Cross-document entity linking | `Validate cross-document entity linking (S5).` | manual |
| 077 | Tier-2 fallback channel forcing | `Validate tier-2 fallback channel forcing.` | MCP |
| 096 | Provenance-rich response envelopes | `Validate SPECKIT_RESPONSE_TRACE includeTrace behavior.` | MCP |
| 145 | Contextual tree injection | `Validate contextual tree injection header format and flag toggle.` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/15--retrieval-enhancements/`](../../feature_catalog/15--retrieval-enhancements/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| MCP runtime for `memory_search` and `memory_context` | Internal | Yellow | Retrieval and provenance scenarios cannot be executed or compared |
| Disposable sandbox corpus and rollback checkpoint for 058 and 060 | Internal | Yellow | Stateful consolidation and entity-linking tests cannot run safely |
| Corpus exceeding 5,000 indexed memories for 059 | Internal | Yellow | Summary channel threshold cannot be crossed; scale-gate behavior cannot be verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Consolidation cycle edge mutations, entity linker edge creation, or env var changes leave the retrieval environment in a state that could taint later scenarios.
- **Procedure**: Restore the sandbox checkpoint, revert any edge-weight mutations using the pre-cycle backup, restart the runtime with default flag values (`SPECKIT_RESPONSE_TRACE` unset, `SPECKIT_CONTEXT_HEADERS=true`, `SPECKIT_CONSOLIDATION=true`, `SPECKIT_ENTITY_LINKING=true`), discard compromised evidence, and rerun only the affected scenarios after the baseline is clean again.
<!-- /ANCHOR:rollback -->

---
