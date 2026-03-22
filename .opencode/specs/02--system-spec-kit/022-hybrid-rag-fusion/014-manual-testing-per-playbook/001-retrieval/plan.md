---
title: "Implementation Plan: manual-testing-per-playbook retrieval phase [template:level_2/plan.md]"
description: "Execution plan for 11 retrieval playbook scenarios: preconditions, non-destructive tests, destructive/stateful tests, and evidence-plus-verdict collection."
trigger_phrases:
  - "retrieval execution plan"
  - "phase 001 manual tests"
  - "memory retrieval verdict plan"
  - "hybrid rag retrieval review"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: manual-testing-per-playbook retrieval phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L2 |
| **Storage** | Filesystem spec folder + linked evidence artifacts |
| **Testing** | manual + MCP |

### Overview

This plan converts the 11 retrieval scenarios in the manual testing playbook into an ordered execution workflow for phase 001-retrieval. The phase covers baseline retrieval behavior first (EX-001 through EX-005), then targeted workflow scenarios (M-001, M-002), then fallback and trace behavior (086, 109, 142), and finally sandboxed stateful scenarios that require runtime flag changes (143).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Playbook files for 01--retrieval are accessible at `../../manual_testing_playbook/01--retrieval/`
- [ ] Feature catalog files for 01--retrieval are accessible at `../../feature_catalog/01--retrieval/`
- [ ] Review protocol is loaded from `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] MCP runtime is healthy and `memory_context`, `memory_search`, `memory_match_triggers` respond
- [ ] Sandbox data and checkpoint strategy identified for stateful scenarios 086 and 143

### Definition of Done

- [ ] All 11 retrieval scenarios have execution evidence tied to the exact documented prompt and command sequence
- [ ] Every scenario has a verdict (PASS, PARTIAL, or FAIL) with rationale using the review protocol acceptance rules
- [ ] Coverage is reported as 11/11 scenarios with no skipped test IDs
- [ ] Any sandbox mutations or rollout-flag changes are restored or explicitly documented before closeout
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

- [ ] Verify source documents are open: playbook, review protocol, and linked retrieval feature files
- [ ] Confirm MCP runtime access for `memory_context`, `memory_search`, and `memory_match_triggers`
- [ ] Record baseline environment flags before any fallback or rollout-state testing
- [ ] Prepare disposable sandbox data for trigger edits (086) and a graph-connected sandbox corpus for rollout diagnostics (143)

### Phase 2: Baseline Retrieval Tests (EX-001 through EX-005, M-001, M-002)

- [ ] Run EX-001 (unified context retrieval) — dual `memory_context` call, auto then focused mode
- [ ] Run M-001 (context recovery and continuation) — session resume scenario
- [ ] Run EX-002 (semantic and lexical search) — dual `memory_search`, default then `bypassCache:true`
- [ ] Run M-002 (targeted memory lookup) — targeted search scenario
- [ ] Run EX-003 (trigger phrase matching) — `memory_match_triggers` with `include_cognitive:true`
- [ ] Run EX-004 (hybrid search pipeline) — channel contribution and non-empty tail inspection
- [ ] Run EX-005 (4-stage pipeline architecture) — `memory_search` with `intent:understand`, stage invariant check

### Phase 3: Fallback and Trace Tests (086, 109, 142)

- [ ] Run 086 only against disposable sandbox memories — checkpoint trigger phrases before editing, capture re-index evidence after mutation
- [ ] Run 109 — inspect tiered degradation behavior and fallback-disabled comparison
- [ ] Run 142 — compare trace-enabled versus non-trace `memory_context` responses, confirm no session-transition leakage

### Phase 4: Stateful Rollout Test (143)

- [ ] Run 143 in an isolated runtime with the same sandbox corpus across `trace_only`, `bounded_runtime`, and `off` states
- [ ] Restart between rollout states and restore default flags after comparison capture
- [ ] If sandbox isolation fails, stop and mark scenario blocked

### Phase 5: Evidence Collection and Verdict

- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes
- [ ] Apply the review protocol acceptance checks (preconditions satisfied, prompt/commands as written, expected signals present, evidence readable, outcome rationale explicit)
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 11/11 with linked evidence references
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Scenario ID | Scenario Name | Execution Type |
|-------------|---------------|----------------|
| EX-001 | Unified context retrieval (memory_context) | MCP |
| M-001 | Context Recovery and Continuation | MCP |
| EX-002 | Semantic and lexical search (memory_search) | MCP |
| M-002 | Targeted Memory Lookup | MCP |
| EX-003 | Trigger phrase matching (memory_match_triggers) | MCP |
| EX-004 | Hybrid search pipeline | MCP |
| EX-005 | 4-stage pipeline architecture | MCP |
| 086 | BM25 trigger phrase re-index gate | manual (sandbox required) |
| 109 | Quality-aware 3-tier search fallback | manual |
| 142 | Session transition trace contract | MCP |
| 143 | Bounded graph-walk rollout and diagnostics | manual (runtime restart required) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Playbook `../../manual_testing_playbook/01--retrieval/` | Internal | Unknown | Scenario steps unavailable |
| Review protocol `../../manual_testing_playbook/manual_testing_playbook.md` | Internal | Unknown | Verdicts cannot be applied consistently |
| Feature catalog `../../feature_catalog/01--retrieval/` | Internal | Unknown | Cross-reference cannot be verified |
| MCP runtime (`memory_context`, `memory_search`, `memory_match_triggers`) | Internal | Unknown | Retrieval scenarios cannot be executed |
| Disposable sandbox corpus and rollback checkpoint | Internal | Unknown | Stateful tests 086 and 143 cannot run safely |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Trigger-phrase edits (086), runtime-flag changes (143), or sandbox outputs leave the retrieval environment in a state that could taint later scenarios.
- **Procedure**: Restore the sandbox checkpoint, revert trigger-phrase edits, restart the runtime with default flag values, discard compromised evidence, and rerun only the affected scenarios after the baseline is clean again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preconditions) ──► Phase 2 (Baseline) ──► Phase 3 (Fallback/Trace) ──► Phase 4 (Rollout) ──► Phase 5 (Verdict)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preconditions | None | All |
| Baseline (EX-001 to EX-005, M-001, M-002) | Preconditions | Fallback/Trace |
| Fallback/Trace (086, 109, 142) | Baseline | Rollout |
| Rollout (143) | Preconditions | Verdict |
| Evidence + Verdict | All execution phases | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preconditions | Low | 15-30 min |
| Baseline tests (7 scenarios) | Medium | 45-90 min |
| Fallback and trace tests (3 scenarios) | Medium | 30-60 min |
| Rollout test (1 scenario) | High | 30-60 min |
| Evidence collection and verdict | Low | 20-30 min |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Execution Checklist

- [ ] Sandbox checkpoint created before trigger-phrase edits (086)
- [ ] Baseline environment flags recorded before rollout-state changes (143)
- [ ] No shared production memory records targeted by any test

### Rollback Procedure

1. Stop execution of current scenario
2. Restore sandbox checkpoint if trigger edits were made
3. Restart MCP runtime with default flag values if env was changed
4. Verify clean state with `memory_health()`
5. Re-run affected scenario from scratch

### Data Reversal

- **Has data mutations?** Yes — scenario 086 edits trigger phrases
- **Reversal procedure**: Restore named checkpoint created immediately before trigger-phrase edit
<!-- /ANCHOR:enhanced-rollback -->
