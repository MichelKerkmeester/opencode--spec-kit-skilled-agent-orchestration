---
title: "Implementation Plan: Manual Testing — Retrieval Enhancements (Phase 015)"
description: "Execution plan for 11 retrieval enhancement scenarios. Sequences preconditions, non-stateful execution, stateful and flag-dependent execution, and evidence collection for PASS/FAIL/SKIP verdicts."
trigger_phrases:
  - "retrieval enhancements execution plan"
  - "phase 015 plan"
  - "manual testing retrieval plan"
  - "retrieval test execution"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Manual Testing — Retrieval Enhancements (Phase 015)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | MCP (Spec Kit Memory tools), shell |
| **Framework** | spec-kit Level 2 |
| **Storage** | Evidence artifacts in scratch/; results recorded in checklist.md |
| **Testing** | Manual execution following playbook scenario steps |

### Overview
This plan sequences the execution of all 11 retrieval enhancement scenarios assigned to Phase 015. It separates non-stateful read scenarios from stateful or flag-dependent scenarios requiring corpus setup, env var changes, or runtime restarts, and defines evidence collection and verdict assignment for each.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Playbook scenario files for IDs 055, 056, 057, 058, 059, 060, 077, 093, 094, 096, and 145 are accessible
- [ ] Feature catalog entries in `../../feature_catalog/15--retrieval-enhancements/` are accessible
- [ ] Review protocol loaded: `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] MCP runtime available for MCP-tagged scenarios
- [ ] Baseline env var state recorded (SPECKIT_RESPONSE_TRACE, SPECKIT_CONTEXT_HEADERS, SPECKIT_CONSOLIDATION, SPECKIT_ENTITY_LINKING, SPECKIT_MEMORY_SUMMARIES)
- [ ] Corpus size count captured to determine whether 059 summary channel threshold is satisfied
- [ ] Disposable sandbox prepared for stateful scenarios 058 and 060

### Definition of Done
- [ ] All 11 scenarios executed and verdicted (PASS / FAIL / SKIP)
- [ ] Evidence captured per scenario (transcript, output snippet, or explicit skip reason)
- [ ] All FAIL verdicts have defect notes
- [ ] checklist.md P0 items marked with evidence
- [ ] Env var state restored to baseline after scenarios 096 and 145
- [ ] implementation-summary.md updated with final results
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual test execution pipeline with evidence-gated verdict assignment.

### Key Components
- **Preconditions pack**: Playbook rows, review protocol, feature catalog links, runtime baseline, corpus size metrics, env var snapshot, and sandbox setup
- **Execution layer**: Manual operator actions plus MCP calls to `memory_search`, `memory_context`, consolidation cycle triggers, and the entity linker
- **Evidence bundle**: Tool outputs, runtime logs, flag snapshots, corpus size counts, edge density metrics, and header comparison outputs captured per scenario
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, FAIL, or SKIP

### Data Flow
Preconditions confirmed → execute exact scenario prompt and commands → collect evidence → compare observed vs expected → assign PASS/FAIL/SKIP verdict → roll up to phase summary
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Load playbook rows for all 11 retrieval enhancement scenario IDs
- [ ] Load review protocol verdict rules
- [ ] Confirm feature catalog links for all 11 scenarios
- [ ] Verify MCP runtime access for MCP-tagged scenarios (056, 057, 059, 077, 093, 094, 096, 145)
- [ ] Record baseline env var state before any scenario execution
- [ ] Capture corpus size count to determine whether 059 threshold is satisfied
- [ ] Prepare disposable sandbox data for consolidation (058) and cross-document entity corpus for entity linking (060)

### Phase 2: Non-Stateful Tests
- [ ] Execute 056 — constitutional directive metadata appears in retrieval results with correct tier classification
- [ ] Execute 057 — hierarchy-aware retrieval scores self > parent > sibling for nested spec folder structures
- [ ] Execute 077 — tier-2 fallback sets forceAllChannels=true and results contain multi-channel contributions
- [ ] Execute 093 — memory summary generation confirms summaries persist for long memories and scale gate controls activation
- [ ] Execute 094 — cross-document entity linking confirms correctly typed supports edges and density guard enforcement
- [ ] Execute 096 — compare includeTrace on/off responses; confirm all 7 score sub-fields appear only when trace is requested
- [ ] Execute 145 — compare header-injected and header-suppressed search results under SPECKIT_CONTEXT_HEADERS toggle

### Phase 3: Stateful and Flag-Dependent Tests
- [ ] Execute 055 — invoke non-memory-aware tool path; trigger compaction; confirm auto-surface hook fires at both lifecycle points
- [ ] Execute 058 — only against disposable sandbox memories; checkpoint original edge weights before triggering N3-lite cycle; capture contradiction/Hebbian/staleness outputs immediately after
- [ ] Execute 059 — against corpus verified to exceed 5,000-memory threshold; confirm summary channel appears in Stage 1; confirm channel is skipped below threshold
- [ ] Execute 060 — verify shared entities exist across distinct spec folders; run entity linker; confirm supports-edges created within density guard limits
- [ ] If sandbox isolation fails or shared data would be mutated unexpectedly: stop and mark scenario blocked rather than proceeding

### Phase 4: Evidence Collection and Verdict
- [ ] Attach prompt, command transcript, key output snippets, and artefact references for every scenario
- [ ] Restore env var state to baseline after scenarios 096 and 145
- [ ] Apply PASS/FAIL/SKIP at the scenario level using playbook acceptance criteria
- [ ] Confirm 11/11 scenarios are verdicted with no "Not Started" remaining
- [ ] Mark all P0 checklist items in checklist.md with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type |
|---------|---------------|--------------|----------------|
| 055 | Dual-scope memory auto-surface | `Validate dual-scope auto-surface (TM-05).` | manual |
| 056 | Constitutional memory as expert knowledge injection | `Verify constitutional memory directive injection (PI-A4).` | MCP |
| 057 | Spec folder hierarchy as retrieval structure | `Validate spec-folder hierarchy retrieval (S4).` | MCP |
| 058 | Lightweight consolidation | `Run lightweight consolidation cycle (N3-lite).` | manual (sandbox) |
| 059 | Memory summary search channel | `Verify memory summary search channel (R8).` | MCP |
| 060 | Cross-document entity linking | `Validate cross-document entity linking (S5).` | manual (sandbox) |
| 077 | Tier-2 fallback channel forcing | `Validate tier-2 fallback channel forcing.` | MCP |
| 093 | Implemented: memory summary generation (R8) | `Verify R8 implemented and gated.` | MCP |
| 094 | Implemented: cross-document entity linking (S5) | `Verify S5 implemented and guarded.` | MCP |
| 096 | Provenance-rich response envelopes | `Validate SPECKIT_RESPONSE_TRACE includeTrace behavior.` | MCP |
| 145 | Contextual tree injection | `Validate contextual tree injection header format and flag toggle.` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../../manual_testing_playbook/manual_testing_playbook.md` | Internal | Unknown | Exact prompts and pass criteria cannot be verified |
| `../../manual_testing_playbook/manual_testing_playbook.md` | Internal | Unknown | Verdict rules cannot be applied consistently |
| `../../feature_catalog/15--retrieval-enhancements/` | Internal | Unknown | Feature context and review triage lose canonical reference |
| MCP runtime for `memory_search` and `memory_context` | Runtime | Unknown | Retrieval and provenance scenarios cannot be executed |
| Disposable sandbox corpus and rollback checkpoint for 058 and 060 | Operational | Unknown | Stateful consolidation and entity linking tests cannot run safely |
| Corpus exceeding 5,000 indexed memories for 059 | Operational | Unknown | Summary channel threshold cannot be crossed; scale-gate behaviour cannot be verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Consolidation cycle edge mutations, entity linker edge creation, or env var changes leave the retrieval environment in a state that could taint later scenarios
- **Procedure**: Restore the sandbox checkpoint; revert edge-weight mutations using the pre-cycle backup; restart runtime with default flag values (SPECKIT_RESPONSE_TRACE unset, SPECKIT_CONTEXT_HEADERS=true, SPECKIT_CONSOLIDATION=true, SPECKIT_ENTITY_LINKING=true); discard compromised evidence; rerun only the affected scenarios after baseline is clean
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preconditions) ──────┐
                              ├──► Phase 2 (Non-Stateful) ──► Phase 4 (Verdict)
Phase 1 (Preconditions) ──────┤
                              └──► Phase 3 (Stateful) ───────► Phase 4 (Verdict)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preconditions | None | All execution phases |
| Non-Stateful | Preconditions | Verdict |
| Stateful | Preconditions + sandbox ready | Verdict |
| Verdict | Non-Stateful + Stateful | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preconditions | Low | 30 minutes |
| Non-Stateful Scenarios (7) | Medium | 2-3 hours |
| Stateful Scenarios (4) | High | 2-3 hours |
| Verdict and Evidence | Low | 1 hour |
| **Total** | | **5-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Scenario Checklist (Stateful)
- [ ] Sandbox confirmed disposable or checkpoint created for 058 and 060
- [ ] Baseline edge state recorded before triggering consolidation cycle (058)
- [ ] Env var baseline snapshot taken before executing 096 and 145

### Rollback Procedure
1. Stop execution on unexpected state change
2. Restore checkpoint or dispose of sandbox
3. Reset env vars to baseline values
4. Verify clean baseline before retrying
5. If baseline cannot be restored: mark scenario as SKIP with reason "sandbox isolation failure"

### Data Reversal
- **Has data mutations?** Yes (scenarios 058, 060)
- **Reversal procedure**: Restore pre-scenario checkpoint; discard disposable sandbox; restart runtime with default flags
<!-- /ANCHOR:enhanced-rollback -->
