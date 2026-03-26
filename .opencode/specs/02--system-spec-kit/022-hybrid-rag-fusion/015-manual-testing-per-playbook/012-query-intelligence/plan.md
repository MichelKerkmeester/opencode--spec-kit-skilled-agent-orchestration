---
title: "Implementation Plan: query-intelligence manual testing [template:level_2/plan.md]"
description: "Execution plan for Phase 012 manual testing of 10 query-intelligence scenarios. Covers preconditions, execution sequencing for non-destructive and feature-flag paths, evidence capture, and verdict assignment per the review protocol."
trigger_phrases:
  - "phase 012 execution plan"
  - "query intelligence manual test plan"
  - "query intelligence execution"
  - "phase 012 plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: query-intelligence manual testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Runtime** | MCP server (`spec_kit_memory`) |
| **Tools** | `memory_search`, `memory_save` (for 163 surrogate test) |
| **Sandbox** | Disposable test memory record for 163; standard live index for all others |
| **Review Protocol** | `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` |

### Overview
Phase 012 executes 10 query-intelligence manual test scenarios drawn from the Spec Kit Memory playbook. Core scenarios (033–038) are all non-destructive and run directly against the live index using `includeTrace: true`. Feature-flag scenarios (161, 162, 163, 173) require explicit flag ON and flag OFF passes. Scenario 163 (Query Surrogates) is the only scenario that writes to the index and requires a disposable test record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Manual testing playbook loaded and Phase 012 scenario rows (033–038, 161, 162, 163, 173) identified with exact prompts and command sequences
- [ ] Review protocol loaded and verdict criteria confirmed for all 10 scenarios
- [ ] MCP runtime available and `memory_search` tool confirmed working with `includeTrace: true`
- [ ] Feature flag support confirmed for 161, 162, 163, 173
- [ ] Baseline feature flag state recorded for 033, 037 fallback tests

### Definition of Done
- [ ] All 10 scenarios executed with evidence captured in `scratch/`
- [ ] Every scenario has a PASS, PARTIAL, or FAIL verdict with review-protocol rationale
- [ ] Feature flags restored to default (OFF) after each flag-toggle test pass
- [ ] `checklist.md` fully verified with evidence references
- [ ] `implementation-summary.md` completed with verdict summary table
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual test execution using MCP tools plus source code inspection for gated behaviors.

### Key Components
- **Core scenario execution**: Direct MCP `memory_search` with `includeTrace: true` for scenarios 033–038.
- **Feature-flag execution**: Set flag ON, run scenario, capture trace; set flag OFF, run scenario, confirm no gated output.
- **Index write for 163**: MCP `memory_save` with a disposable test record; inspect generated surrogates in the index.
- **Source code inspection**: Supplement MCP traces with direct code review for behaviors not yet emitting trace metadata.

### Data Flow
Playbook prompts → MCP tool invocation → trace capture → evidence documentation → review protocol verdict → checklist update
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Load playbook and identify all 10 Phase 012 scenario rows with exact prompts and command sequences
- [ ] Confirm runtime has `memory_search` available with `includeTrace: true`
- [ ] Record baseline feature flag state for 033 (complexity router) and 037 (token budget) fallback tests
- [ ] Confirm feature flag support for 161, 162, 163, 173

### Phase 2: Core Execution (6 scenarios — non-destructive)
Execute the following scenarios directly against the live index using `includeTrace: true`:

| Test ID | Scenario | Exact Prompt | Execution Type |
|---------|----------|--------------|----------------|
| 033 | Query complexity router (R15) | `Verify query complexity router (R15).` | manual + flag toggle |
| 034 | Relative score fusion in shadow mode (R14/N1) | `Check RSF shadow behavior post-cleanup.` | manual |
| 035 | Channel min-representation (R2) | `Validate channel min-representation (R2).` | MCP |
| 036 | Confidence-based result truncation (R15-ext) | `Verify confidence-based truncation (R15-ext).` | MCP |
| 037 | Dynamic token budget allocation (FUT-7) | `Verify dynamic token budgets (FUT-7).` | manual + flag toggle |
| 038 | Query expansion (R12) | `Validate query expansion (R12).` | MCP |

- [ ] 033 executed (simple/moderate/complex query passes + flag-disabled fallback); evidence captured
- [ ] 034 executed (branch inspection + RRF live ranking confirmation); evidence captured
- [ ] 035 executed (dominance query + channel representation check); evidence captured
- [ ] 036 executed (long-tail query + truncation metadata check); evidence captured
- [ ] 037 executed (per-tier budget queries + flag-disabled fallback); evidence captured
- [ ] 038 executed (complex-query expansion + simple-query bypass); evidence captured

### Phase 3: Feature-Flag Execution (4 scenarios)
For each scenario: run with flag ON, capture trace; run with flag OFF, confirm no gated output:

| Test ID | Scenario | Feature Flag | Exact Prompt |
|---------|----------|--------------|--------------|
| 161 | LLM Reformulation | `SPECKIT_LLM_REFORMULATION` | `Verify LLM reformulation in deep mode (SPECKIT_LLM_REFORMULATION).` |
| 162 | HyDE Shadow | `SPECKIT_HYDE` | `Verify HyDE hypothetical document generation (SPECKIT_HYDE).` |
| 163 | Query Surrogates | `SPECKIT_QUERY_SURROGATES` | `Verify index-time query surrogate generation (SPECKIT_QUERY_SURROGATES).` |
| 173 | Query Decomposition | `SPECKIT_QUERY_DECOMPOSITION` | `Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries using rule-based heuristics in deep mode.` |

- [ ] 161 executed (flag ON deep-mode pass + flag OFF pass); evidence captured
- [ ] 162 executed (flag ON shadow-only pass + flag OFF pass); evidence captured
- [ ] 163 executed (flag ON save+surrogate+retrieve pass + flag OFF pass); disposable test record cleaned up; evidence captured
- [ ] 173 executed (flag ON decomposition pass + flag OFF pass); evidence captured

### Phase 4: Verdict and Verification
- [ ] Assign PASS/PARTIAL/FAIL verdict to all 10 scenarios using review protocol acceptance criteria
- [ ] Complete all checklist items in `checklist.md` with evidence references
- [ ] Write `implementation-summary.md` with verdict summary table and known limitations
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Non-destructive MCP | 033, 034, 035, 036, 037, 038 | `memory_search` with `includeTrace: true` |
| Feature-flag | 161, 162, 173 | Flag toggle + `memory_search` + trace inspection |
| Feature-flag + index write | 163 | Flag toggle + `memory_save` + `memory_search` |
| Source code inspection | 034, 036, 037 (supplement) | Direct code review when trace metadata is absent |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Internal | Confirm before start | Cannot execute without exact playbook prompts |
| `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Internal | Confirm before start | Cannot assign verdicts without protocol rules |
| `../../feature_catalog/12--query-intelligence/` | Internal | Confirm before start | Traceability links break if files are missing or renamed |
| MCP runtime + `memory_search` | Runtime | Confirm | All scenarios blocked if MCP is unavailable |
| `SPECKIT_LLM_REFORMULATION` | Feature flag | Confirm | 161 blocked if flag absent from runtime |
| `SPECKIT_HYDE` | Feature flag | Confirm | 162 blocked if flag absent from runtime |
| `SPECKIT_QUERY_SURROGATES` | Feature flag | Confirm | 163 blocked if flag absent from runtime |
| `SPECKIT_QUERY_DECOMPOSITION` | Feature flag | Confirm | 173 blocked if flag absent from runtime |
| LLM service (for 161) | External | Confirm | 161 blocked if LLM service unavailable or rate-limited |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Feature flag changes leave runtime in a non-default state that taints subsequent scenarios, or 163 index write cannot be cleaned up.
- **Procedure**: Restore all feature flags to default state (OFF). Delete the disposable test memory record created during 163. Discard evidence captured under incorrect flag state and rerun affected scenarios.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ─────────────┐
                              ├──► Phase 2 (Core Non-Destructive) ──┐
                              └──► Phase 3 (Feature-Flag) ──────────┴──► Phase 4 (Verdict)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | All execution phases |
| Core Non-Destructive | Setup | Verdict |
| Feature-Flag | Setup | Verdict |
| Verdict | Core, Feature-Flag | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Execution (6 scenarios) | Medium | 2-3 hours |
| Feature-Flag Execution (4 scenarios) | Medium | 1-2 hours |
| Verdict and Verification | Medium | 1 hour |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Execution Checklist
- [ ] Baseline feature flag state recorded for 033 and 037
- [ ] Feature flags confirmed at default (OFF) before flag-toggle tests for 161, 162, 163, 173
- [ ] Disposable test memory record plan confirmed for 163

### Rollback Procedure
1. Set all test-modified feature flags back to OFF
2. Delete the disposable memory record created during 163 (if applicable)
3. Discard any evidence captured under incorrect flag state
4. Rerun only the affected scenarios after baseline is confirmed clean

### Data Reversal
- **Has data mutations?** Yes — scenario 163 writes a memory record to the index
- **Reversal procedure**: Delete the disposable test memory record via `memory_delete`; confirm deletion with `memory_list`
<!-- /ANCHOR:enhanced-rollback -->

---
