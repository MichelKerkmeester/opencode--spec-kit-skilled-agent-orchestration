---
title: "Implementation Plan: manual-testing-per-playbook memory quality and indexing phase [template:level_2/plan.md]"
description: "Execution plan for 34 exact IDs across 27 scenario files in the memory quality and indexing category, organized into six execution groups with sub-scenario tracking."
trigger_phrases:
  - "memory quality execution plan"
  - "phase 013 manual tests"
  - "indexing verdict plan"
  - "hybrid rag memory quality review"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: manual-testing-per-playbook memory quality and indexing phase

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

This plan converts the 27 memory-quality-and-indexing scenario files (34 exact IDs) in the manual testing playbook into an ordered execution workflow for phase 013-memory-quality-and-indexing. The phase is the largest in the playbook suite. Scenarios are organized into six groups: core pipeline scenarios with sub-scenario expansions (M-003, M-005 family, M-006 family), quality loop and signal scenarios (039-048), consolidation and persistence scenarios (069-119), validation and preflight scenarios (131-133), post-save review scenarios (155, 155-F), and advanced quality features behind feature flags (164-178). Sub-scenarios M-005a/b/c, M-006a/b/c, and 155-F are tracked as independent exact IDs with individual verdicts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Playbook files for 13--memory-quality-and-indexing are accessible at `../../manual_testing_playbook/13--memory-quality-and-indexing/`
- [ ] Feature catalog files for 13--memory-quality-and-indexing are accessible at `../../feature_catalog/13--memory-quality-and-indexing/`
- [ ] Review protocol is loaded from `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] MCP runtime is healthy and `memory_save`, `memory_index_scan`, quality gate pipeline respond
- [ ] Sandbox data and checkpoint strategy identified for destructive scenarios (M-005, M-006, 044)
- [ ] Feature flags documented for scenarios 164, 165, 176, 177, 178

### Definition of Done

- [ ] All 34 exact scenario IDs have execution evidence tied to the exact documented prompt and command sequence
- [ ] Every scenario has a verdict (PASS, PARTIAL, or FAIL) with rationale using the review protocol acceptance rules
- [ ] Sub-scenarios M-005a/b/c, M-006a/b/c, and 155-F each have independent verdicts
- [ ] Coverage is reported as 34/34 exact IDs with no skipped test IDs
- [ ] Any sandbox mutations or feature flag changes are restored or explicitly documented before closeout
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Manual memory quality test execution pipeline with review-gated evidence collection.

### Key Components

- **Preconditions pack**: Playbook, review protocol, feature catalog links, runtime baseline, sandbox/checkpoint setup, and feature flag documentation.
- **Execution layer**: Manual operator actions plus MCP calls to `memory_save`, `memory_index_scan`, `memory_search`, and quality gate pipeline functions.
- **Evidence bundle**: Tool outputs, runtime logs, flag snapshots, quality scores, and entity extraction results captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario (including sub-scenarios) as PASS, PARTIAL, or FAIL.

### Data Flow

`preconditions -> execute exact prompt/commands -> capture evidence -> apply verdict rules per exact ID`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions

- [ ] Verify source documents are open: playbook, review protocol, and linked memory quality feature files
- [ ] Confirm MCP runtime access for `memory_save`, `memory_index_scan`, and quality gate pipeline
- [ ] Record baseline environment flags (SPECKIT_SAVE_QUALITY_GATE, SPECKIT_RECONSOLIDATION, SPECKIT_BATCH_LEARNED_FEEDBACK, SPECKIT_ASSISTIVE_RECONSOLIDATION, SPECKIT_IMPLICIT_FEEDBACK_LOG, SPECKIT_HYBRID_DECAY_POLICY, SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS)
- [ ] Prepare disposable sandbox data for destructive scenarios (M-005 agent capture, M-006 git state manipulation, 044 reconsolidation)
- [ ] Create named checkpoint before any mutation or merge operations

### Phase 2: Core Pipeline + Sub-Scenario Tests (M-003, M-005 family, M-006 family -- 9 exact IDs)

- [ ] Run M-003 (context save + index update) -- verify save-then-index round-trip
- [ ] Run M-005 (outsourced agent memory capture round-trip) -- parent scenario
- [ ] Run M-005a (JSON-mode hard-fail) -- verify rejection on invalid JSON
- [ ] Run M-005b (nextSteps persistence) -- verify nextSteps field survives round-trip
- [ ] Run M-005c (verification freshness) -- verify freshness check on capture
- [ ] Run M-006 (session enrichment and alignment guardrails) -- parent scenario
- [ ] Run M-006a (unborn-HEAD and dirty snapshot fallback) -- test fallback in unborn-HEAD state
- [ ] Run M-006b (detached-HEAD snapshot preservation) -- test snapshot in detached-HEAD state
- [ ] Run M-006c (similar-folder boundary protection) -- test boundary detection for similar folder names

### Phase 3: Quality Loop and Signal Tests (039-048 -- 10 exact IDs)

- [ ] Run 039 (verify-fix-verify memory quality loop) -- three-pass quality improvement cycle
- [ ] Run 040 (signal vocabulary expansion) -- new signal types recognized
- [ ] Run 041 (pre-flight token budget validation) -- budget check before save
- [ ] Run 042 (spec folder description discovery) -- description.json auto-detection
- [ ] Run 043 (pre-storage quality gate) -- rejection of low-quality saves
- [ ] Run 044 (reconsolidation-on-save) -- sandbox merge operation with checkpoint
- [ ] Run 045 (smarter memory content generation) -- improved content output
- [ ] Run 046 (anchor-aware chunk thinning) -- chunk reduction with anchor preservation
- [ ] Run 047 (encoding-intent capture at index time) -- intent metadata capture
- [ ] Run 048 (auto entity extraction) -- entity detection on save

### Phase 4: Consolidation, Persistence, Validation, and Preflight Tests (069-133 -- 8 exact IDs)

- [ ] Run 069 (entity normalization consolidation) -- entity name normalization
- [ ] Run 073 (quality gate timer persistence) -- timer survives restart
- [ ] Run 092 (implemented: auto entity extraction) -- verify extraction feature live
- [ ] Run 111 (deferred lexical-only indexing) -- lexical index without embedding
- [ ] Run 119 (memory filename uniqueness) -- unique filename generation
- [ ] Run 131 (description.json batch backfill validation) -- batch processing
- [ ] Run 132 (description.json schema field validation) -- schema enforcement
- [ ] Run 133 (dry-run preflight for memory_save) -- preflight without side effects

### Phase 5: Post-Save Review and Advanced Feature-Flag Tests (155-178 -- 7 exact IDs)

- [ ] Run 155 (post-save quality review) -- review output after save
- [ ] Run 155-F (score penalty advisory logging) -- sub-scenario penalty logging
- [ ] Run 164 (batch learned feedback) -- enable SPECKIT_BATCH_LEARNED_FEEDBACK, test batch aggregation
- [ ] Run 165 (assistive reconsolidation) -- enable SPECKIT_ASSISTIVE_RECONSOLIDATION, test threshold tiers
- [ ] Run 176 (implicit feedback log) -- enable SPECKIT_IMPLICIT_FEEDBACK_LOG, test logging
- [ ] Run 177 (hybrid decay policy) -- enable SPECKIT_HYBRID_DECAY_POLICY, test decay behavior
- [ ] Run 178 (save quality gate exceptions) -- enable SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS, test exception handling

### Phase 6: Evidence Collection and Verdict

- [ ] For each of the 34 exact IDs, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes
- [ ] Apply the review protocol acceptance checks (preconditions satisfied, prompt/commands as written, expected signals present, evidence readable, outcome rationale explicit)
- [ ] Assign PASS, PARTIAL, or FAIL per exact ID and summarize phase coverage as 34/34 with linked evidence references
- [ ] Restore all feature flags to baseline values
- [ ] Restore sandbox checkpoint if mutation scenarios altered shared state
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Scenario ID | Scenario Name | Execution Type |
|-------------|---------------|----------------|
| M-003 | Context Save + Index Update | MCP |
| M-005 | Outsourced Agent Memory Capture Round-Trip | MCP (sandbox) |
| M-005a | JSON-mode hard-fail | MCP (sandbox) |
| M-005b | nextSteps persistence | MCP (sandbox) |
| M-005c | Verification freshness | MCP (sandbox) |
| M-006 | Session Enrichment and Alignment Guardrails | manual (git state) |
| M-006a | Unborn-HEAD and dirty snapshot fallback | manual (git state) |
| M-006b | Detached-HEAD snapshot preservation | manual (git state) |
| M-006c | Similar-folder boundary protection | manual |
| 039 | Verify-fix-verify memory quality loop | MCP |
| 040 | Signal vocabulary expansion | MCP |
| 041 | Pre-flight token budget validation | MCP |
| 042 | Spec folder description discovery | MCP |
| 043 | Pre-storage quality gate | MCP |
| 044 | Reconsolidation-on-save | MCP (sandbox, checkpoint required) |
| 045 | Smarter memory content generation | MCP |
| 046 | Anchor-aware chunk thinning | MCP |
| 047 | Encoding-intent capture at index time | MCP |
| 048 | Auto entity extraction | MCP |
| 069 | Entity normalization consolidation | MCP |
| 073 | Quality gate timer persistence | MCP (restart required) |
| 092 | Implemented: auto entity extraction | MCP |
| 111 | Deferred lexical-only indexing | MCP |
| 119 | Memory filename uniqueness | MCP |
| 131 | Description.json batch backfill validation | MCP |
| 132 | description.json schema field validation | MCP |
| 133 | Dry-run preflight for memory_save | MCP |
| 155 | Post-save quality review | MCP |
| 155-F | Score penalty advisory logging | MCP |
| 164 | Batch learned feedback | MCP (feature flag required) |
| 165 | Assistive reconsolidation | MCP (feature flag required) |
| 176 | Implicit feedback log | MCP (feature flag required) |
| 177 | Hybrid decay policy | MCP (feature flag required) |
| 178 | Save quality gate exceptions | MCP (feature flag required) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Playbook `../../manual_testing_playbook/13--memory-quality-and-indexing/` | Internal | Unknown | Scenario steps unavailable |
| Review protocol `../../manual_testing_playbook/manual_testing_playbook.md` | Internal | Unknown | Verdicts cannot be applied consistently |
| Feature catalog `../../feature_catalog/13--memory-quality-and-indexing/` | Internal | Unknown | Cross-reference cannot be verified |
| MCP runtime (`memory_save`, `memory_index_scan`, quality gate) | Internal | Unknown | Memory quality scenarios cannot be executed |
| Disposable sandbox corpus and rollback checkpoint | Internal | Unknown | Destructive tests M-005, M-006, 044 cannot run safely |
| Feature flags for 164, 165, 176, 177, 178 | Internal | Unknown | Advanced scenarios cannot be tested without flag activation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Reconsolidation merges (044), outsourced agent writes (M-005), git state manipulation (M-006), or feature flag changes (164, 165, 176, 177, 178) leave the environment in a state that could taint later scenarios.
- **Procedure**: Restore the named checkpoint, revert git state, restart the runtime with default flag values, discard compromised evidence, and rerun only the affected scenarios after the baseline is clean again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preconditions) --> Phase 2 (Core Pipeline) --> Phase 3 (Quality Loop) --> Phase 4 (Consolidation) --> Phase 5 (Advanced) --> Phase 6 (Verdict)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preconditions | None | All |
| Core Pipeline (M-003, M-005 family, M-006 family) | Preconditions | Quality Loop |
| Quality Loop (039-048) | Preconditions | Consolidation |
| Consolidation (069-133) | Preconditions | Advanced |
| Advanced (155-178) | Preconditions | Verdict |
| Evidence + Verdict | All execution phases | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preconditions | Low | 20-30 min |
| Core pipeline tests (9 exact IDs) | High | 60-90 min |
| Quality loop tests (10 exact IDs) | Medium | 45-75 min |
| Consolidation tests (8 exact IDs) | Medium | 30-60 min |
| Advanced tests (7 exact IDs) | High | 45-75 min |
| Evidence collection and verdict | Low | 30-45 min |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Execution Checklist

- [ ] Named checkpoint created before any destructive scenario
- [ ] Baseline feature flags recorded before any flag changes
- [ ] Temporary git repos prepared for M-006 git state scenarios
- [ ] No shared production memory records targeted by any test

### Rollback Procedure

1. Stop execution of current scenario
2. Restore named checkpoint if reconsolidation or save mutations were made
3. Delete temporary git repos created for M-006 scenarios
4. Restart MCP runtime with default flag values if env was changed
5. Verify clean state with `memory_health()`
6. Re-run affected scenario from scratch

### Data Reversal

- **Has data mutations?** Yes -- scenarios 044 (reconsolidation merge), M-005 (agent capture write), M-006 (git state)
- **Reversal procedure**: Restore named checkpoint created immediately before mutation scenarios
<!-- /ANCHOR:enhanced-rollback -->
