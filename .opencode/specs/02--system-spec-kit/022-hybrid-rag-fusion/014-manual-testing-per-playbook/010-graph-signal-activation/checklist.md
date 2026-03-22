---
title: "Verification Checklist: manual-testing-per-playbook graph-signal-activation phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 010 graph-signal-activation manual tests covering 016-022, 081, 091, 120, 156-158, 174, and 175."
trigger_phrases:
  - "graph signal activation checklist"
  - "phase 010 verification"
  - "graph testing checklist"
  - "016 175 verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook graph-signal-activation phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Scope is locked to 15 graph-signal-activation tests (016, 017, 018, 019, 020, 021, 022, 081, 091, 120, 156, 157, 158, 174, 175) with no out-of-group scenarios included
- [ ] CHK-002 [P0] Exact prompts, execution types, and pass criteria were extracted from the manual testing playbook for all 15 scenarios
- [ ] CHK-003 [P0] Feature catalog links for all 15 tests point to the correct `10--graph-signal-activation/` files
- [ ] CHK-004 [P1] Level 2 template anchors and metadata blocks are intact across all phase documents
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] 016 documents the typed-weighted degree channel check with fusion trace showing degree-channel weight, typed edge counts, and weighted score
- [ ] CHK-011 [P0] 017 documents the co-activation boost strength increase with boost magnitude and configured strength multiplier verification
- [ ] CHK-012 [P0] 018 documents the edge density measurement with `memory_causal_stats` output showing edge count, coverage percentage, and per-relation-type breakdown
- [ ] CHK-013 [P0] 019 documents the weight history audit tracking with timestamped audit entries showing old/new values after strength update
- [ ] CHK-014 [P0] 020 documents the graph momentum scoring with momentum score contribution for memories with recent causal activity
- [ ] CHK-015 [P0] 021 documents the causal depth signal with multi-hop chain traversal via `memory_drift_why` and depth signal in scoring
- [ ] CHK-016 [P0] 022 documents the community detection with cluster assignments grouping memories by shared causal edges
- [ ] CHK-017 [P0] 081 documents the graph and cognitive memory fixes review with fix-location inspection notes and corrected behavior verification
- [ ] CHK-018 [P0] 091 documents the graph centrality and ANCHOR-as-graph-node verification with ANCHOR tags visible in graph calculations
- [ ] CHK-019 [P0] 120 documents the unified graph rollback and explainability with edge removal confirmation, count before/after, and explainability trace
- [ ] CHK-020 [P0] 156 documents the graph refresh mode with SPECKIT_GRAPH_REFRESH_MODE configuration, refresh log, and updated graph state
- [ ] CHK-021 [P0] 157 documents the LLM graph backfill with SPECKIT_LLM_GRAPH_BACKFILL activation, new edges created, and backfill log
- [ ] CHK-022 [P0] 158 documents the graph calibration profile with different SPECKIT_GRAPH_CALIBRATION_PROFILE settings and measurably different graph weights
- [ ] CHK-023 [P0] 174 documents the graph concept routing with SPECKIT_GRAPH_CONCEPT_ROUTING activation and concept-routed results with graph attribution
- [ ] CHK-024 [P0] 175 documents the typed traversal with SPECKIT_TYPED_TRAVERSAL activation and `memory_drift_why` filtered to specific relation types only
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] 016 has been executed and fusion trace showing typed-weighted degree channel contribution is captured
- [ ] CHK-031 [P0] 017 has been executed and co-activation boost log showing strength multiplier and boosted scores is captured
- [ ] CHK-032 [P0] 018 has been executed and `memory_causal_stats` output with edge count, coverage, and relation breakdown is captured
- [ ] CHK-033 [P0] 019 has been executed and weight history audit trail with timestamped old/new values is captured
- [ ] CHK-034 [P0] 020 has been executed and search trace showing graph momentum score contribution is captured
- [ ] CHK-035 [P0] 021 has been executed and `memory_drift_why` output showing multi-hop traversal and depth signal is captured
- [ ] CHK-036 [P0] 022 has been executed and community detection output with cluster assignments is captured
- [ ] CHK-037 [P0] 081 has been executed and fix-location inspection notes with corrected behavior evidence are captured
- [ ] CHK-038 [P0] 091 has been executed and graph node listing showing ANCHOR-derived nodes in calculations is captured
- [ ] CHK-039 [P0] 120 has been executed and rollback confirmation with edge count before/after and explainability trace is captured
- [ ] CHK-040 [P0] 156 has been executed and graph refresh log with mode, affected edges, and post-refresh stats is captured
- [ ] CHK-041 [P0] 157 has been executed and backfill log showing memories processed, edges created, and LLM usage is captured
- [ ] CHK-042 [P0] 158 has been executed and search traces showing different graph weights per calibration profile are captured
- [ ] CHK-043 [P0] 174 has been executed and concept-routed search output with graph signal attribution is captured
- [ ] CHK-044 [P0] 175 has been executed and `memory_drift_why` output filtered to specified relation types with no cross-type leakage is captured
- [ ] CHK-045 [P0] Each of the 15 scenarios has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules
- [ ] CHK-046 [P1] Coverage summary reports 15/15 scenarios executed with no skipped test IDs
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] No secrets or credentials were added to graph-signal-activation phase documents
- [ ] CHK-051 [P1] Sandbox and DB isolation guidance does not instruct reviewers to log raw absolute DB paths or expose graph store internals
- [ ] CHK-052 [P2] Open questions about graph state baseline and feature flag availability are resolved before execution
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text
- [ ] CHK-061 [P0] All phase documents are synchronized: scenario names, prompts, and execution types are consistent across spec, plan, tasks, and checklist
- [ ] CHK-062 [P1] `implementation-summary.md` is created when execution and verification are complete
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] Only the phase documents were created in `010-graph-signal-activation/`
- [ ] CHK-071 [P1] No unrelated files were added outside the `010-graph-signal-activation/` folder as part of this phase packet creation
- [ ] CHK-072 [P2] Memory save was triggered after phase packet creation to make graph-signal-activation context available for future sessions
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 24 | 0/24 |
| P1 Items | 5 | 0/5 |
| P2 Items | 2 | 0/2 |

**Verification Date**: --
<!-- /ANCHOR:summary -->

---
