---
title: "Implementation Plan: graph-signal-activation [template:level_2/plan.md]"
description: "Phase 010 execution plan for manual testing coverage of graph-signal-activation scenarios. Organizes the preconditions, run sequence, evidence collection, and verdict process for the 15 mapped graph signal tests."
trigger_phrases:
  - "graph signal activation implementation plan"
  - "phase 010 graph plan"
  - "manual testing graph workflow"
  - "graph playbook execution plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: graph-signal-activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | spec-kit L2 |
| **Storage** | Spec folder markdown files |
| **Testing** | manual + MCP |

### Overview
Phase 010 documents manual testing coverage for the 15 scenarios assigned to `10--graph-signal-activation`. The plan follows the playbook prompts and feature catalog summaries so each run can move from setup through execution, evidence capture, and verdict assignment without losing graph-specific context such as typed degree scoring, co-activation boost, causal depth signals, community detection, graph rollback/explainability, and feature-flag-driven graph lifecycle features.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Parent phase map confirms Phase 010 is `Graph signal tests` with 15 scenarios.
- [ ] Each test ID is mapped to one `10--graph-signal-activation` feature catalog entry.
- [ ] Exact prompts and acceptance criteria are captured from the manual testing playbook.
- [ ] Runtime prerequisites for MCP graph tools are available in the target sandbox.

### Definition of Done
- [ ] All 15 scenarios have documented prompts, commands or inspection steps, evidence expectations, and verdict notes.
- [ ] Evidence is sufficient to issue PASS, PARTIAL, or FAIL for every scenario.
- [ ] No mapped feature in Phase 010 ends with verdict FAIL for release-readiness review.
- [ ] Coverage remains 15/15 against the parent phase map.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual test execution pipeline

### Key Components
- **Preconditions**: Confirm graph state baseline, feature flags, MCP graph tool availability, and DB access before any scenario begins.
- **Execute**: Run the exact prompt-driven workflow as a manual inspection or MCP-backed command sequence.
- **Evidence**: Capture transcripts, graph traces, causal stats output, community detection results, or code-inspection notes that match the playbook row.
- **Verdict**: Compare evidence to the scenario acceptance criteria and assign PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute -> evidence -> verdict`

The pipeline stays consistent across all graph signal scenarios: establish the graph state baseline first, run the scenario with the exact prompt, collect proof artifacts, then decide the verdict using the playbook acceptance checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Confirm the Phase 010 mapping against the parent packet and the 15 feature catalog entries.
- [ ] Verify MCP graph tools are available: `memory_causal_link`, `memory_drift_why`, `memory_causal_stats`, `memory_causal_unlink`.
- [ ] Take a graph state checkpoint or note current edge counts for reproducibility.
- [ ] Identify which feature flags (156, 157, 158, 174, 175) are implemented in the current build.

### Phase 2: Core Graph Signal Tests
- [ ] Run typed-weighted degree channel test (016): search with graph channel, inspect fusion trace.
- [ ] Run co-activation boost test (017): trigger co-activation pair, verify boost magnitude.
- [ ] Run edge density measurement (018): `memory_causal_stats` and verify all fields.
- [ ] Run weight history audit (019): create link, update strength, inspect audit trail.
- [ ] Run graph momentum scoring (020): search with graph channel, verify momentum contribution.
- [ ] Run causal depth signal (021): create multi-hop chain, run `memory_drift_why`, verify depth signal.
- [ ] Run community detection (022): trigger detection, inspect cluster assignments.

### Phase 3: Fix Verification and Advanced Tests
- [ ] Run graph and cognitive memory fixes review (081): inspect fix locations, verify corrected behavior.
- [ ] Run graph centrality and community detection (N2) verification (091): confirm N2 tables populated, flags active, centrality/community scoring in graph queries.
- [ ] Run unified graph rollback and explainability (120): create links, rollback, verify trace.

### Phase 4: Feature Flag Tests
- [ ] Run graph refresh mode test (156): set SPECKIT_GRAPH_REFRESH_MODE, trigger refresh, inspect log.
- [ ] Run LLM graph backfill test (157): enable SPECKIT_LLM_GRAPH_BACKFILL, trigger backfill, verify new edges.
- [ ] Run graph calibration profile test (158): set different profiles, compare graph weights.
- [ ] Run graph concept routing test (174): enable SPECKIT_GRAPH_CONCEPT_ROUTING, run concept query.
- [ ] Run typed traversal test (175): enable SPECKIT_TYPED_TRAVERSAL, run filtered `memory_drift_why`.

### Phase 5: Evidence Collection and Verdict
- [ ] Capture command transcripts, graph traces, causal stats, community output, and inspection notes for every scenario.
- [ ] Compare evidence against the exact PASS/FAIL criteria from the playbook row.
- [ ] Record PASS, PARTIAL, or FAIL with concise rationale and note any retry or escalation follow-up.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| 016 | Typed-weighted degree channel (R4) | `Verify typed-weighted degree channel scoring (R4).` | MCP |
| 017 | Co-activation boost strength increase (A7) | `Validate co-activation boost strength multiplier (A7).` | MCP |
| 018 | Edge density measurement | `Run memory_causal_stats and verify edge density fields.` | MCP |
| 019 | Weight history audit tracking | `Create and update causal link, verify weight history audit.` | MCP |
| 020 | Graph momentum scoring (N2a) | `Verify graph momentum scoring contribution (N2a).` | MCP |
| 021 | Causal depth signal (N2b) | `Create multi-hop chain and verify causal depth signal (N2b).` | MCP |
| 022 | Community detection (N2c) | `Run community detection and verify cluster assignments (N2c).` | MCP |
| 081 | Graph and cognitive memory fixes | `Inspect graph and cognitive memory fix locations.` | manual |
| 091 | Graph centrality and community detection (N2) | `Verify ANCHOR tags as graph nodes in centrality calculations.` | MCP |
| 120 | Unified graph rollback and explainability (Phase 3) | `Create links, rollback, and verify explainability trace.` | MCP |
| 156 | Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE) | `Set SPECKIT_GRAPH_REFRESH_MODE, trigger refresh, inspect log.` | MCP |
| 157 | LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) | `Enable SPECKIT_LLM_GRAPH_BACKFILL and trigger backfill run.` | MCP |
| 158 | Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) | `Set calibration profiles and compare graph weights.` | MCP |
| 174 | Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) | `Enable SPECKIT_GRAPH_CONCEPT_ROUTING and run concept query.` | MCP |
| 175 | Typed traversal (SPECKIT_TYPED_TRAVERSAL) | `Enable SPECKIT_TYPED_TRAVERSAL and run filtered drift_why.` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Manual testing playbook source | Internal | Green | Exact prompts, evidence rules, and acceptance criteria for Phase 010 cannot be reconstructed accurately |
| Graph-signal-activation feature catalog | Internal | Green | Scenario context and feature-level grounding for degree channel, co-activation, community detection, graph lifecycle, and typed traversal are lost |
| MCP runtime with graph tools | Internal | Yellow | MCP-backed scenarios for `memory_causal_link`, `memory_drift_why`, `memory_causal_stats`, and graph-enabled search cannot be executed |
| Feature flags for 156, 157, 158, 174, 175 | Internal | Yellow | Flag-dependent scenarios may need to be deferred if flags are not implemented |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scenario mapping is found to be wrong, execution guidance conflicts with the playbook, or graph state instructions are unsafe for repeated runs.
- **Procedure**: Revert `spec.md` and `plan.md` for Phase 010 to the last correct version or remove the packet files and regenerate them from the Level 2 templates using the verified playbook and feature catalog inputs. For runtime test fallout, restore the checkpoint or use a fresh graph state before re-running the affected scenario.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preconditions) ──► Phase 2 (Core Graph) ──► Phase 5 (Verdict)
                         ──► Phase 3 (Advanced)   ──┘
                         ──► Phase 4 (Flag Tests)  ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preconditions | None | Core Graph, Advanced, Flag Tests |
| Core Graph | Preconditions | Verdict |
| Advanced | Preconditions | Verdict |
| Flag Tests | Preconditions | Verdict |
| Verdict | Core Graph, Advanced, Flag Tests | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preconditions | Low | 15-30 minutes |
| Core Graph Tests | Medium | 2-3 hours |
| Fix Verification and Advanced | Medium | 1-2 hours |
| Feature Flag Tests | Medium | 1-2 hours |
| Evidence and Verdict | Low | 30-60 minutes |
| **Total** | | **5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Graph state checkpoint created before test execution
- [ ] Feature flag defaults noted for restoration
- [ ] Current edge counts and community assignments recorded

### Rollback Procedure
1. Restore graph state checkpoint to undo any causal links created during testing
2. Reset feature flags to their pre-test defaults
3. Verify edge counts match the pre-test baseline
4. Re-run `memory_causal_stats` to confirm clean state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Checkpoint restore covers all graph state changes
<!-- /ANCHOR:enhanced-rollback -->

---
