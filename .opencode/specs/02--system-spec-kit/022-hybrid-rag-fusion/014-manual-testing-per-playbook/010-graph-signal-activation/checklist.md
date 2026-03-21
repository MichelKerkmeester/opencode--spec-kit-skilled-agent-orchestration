---
title: "Verification Checklist: manual-testing-per-playbook graph-signal-activation phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 010 graph-signal-activation manual tests covering 016 through 022, 081, and 120."
trigger_phrases:
  - "graph signal activation checklist"
  - "phase 010 verification"
  - "016 017 018 019 020 checklist"
  - "021 022 081 120 verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook graph-signal-activation phase

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] CHK-001 [P0] Scope is locked to nine graph-signal-activation tests (016 through 022, 081, 120) with no out-of-scope scenarios (e.g. F-10, F-11) included [EVIDENCE: scope table in `spec.md` lists exactly nine rows]
- [x] CHK-002 [P0] Exact prompts, command sequences, and pass criteria were extracted verbatim from `../../manual_testing_playbook/manual_testing_playbook.md` [EVIDENCE: scope table in `spec.md` and testing strategy table in `plan.md` match playbook rows for all nine tests]
- [x] CHK-003 [P0] Feature catalog links for all nine tests point to the correct `10--graph-signal-activation/` files [EVIDENCE: spec.md scope table links files 01 through 08 and 12 in `feature_catalog/10--graph-signal-activation/`]
- [x] CHK-004 [P0] Stateful scenarios (019, 081, 120) are explicitly identified and isolated in `plan.md` Phase 3 with sandbox or checkpoint handling described [EVIDENCE: plan.md Phase 3 tasks list all three tests with sandbox instructions]
- [ ] CHK-005 [P1] Level 1 template anchors and metadata blocks are intact across all four phase documents [EVIDENCE: `SPECKIT_LEVEL` and anchor sections verified in spec.md, plan.md, tasks.md, checklist.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] 016 documents the typed-weighted degree channel scenario with bounded boost expectations: boosts within `[0, cap]`, fallback when no typed edges exist, and distinct scores for varied edge types [EVIDENCE: spec.md REQ-016 acceptance criteria]
- [x] CHK-011 [P0] 017 documents the co-activation strength comparison scenario with baseline delta expectations: positive contribution delta scales with multiplier change [EVIDENCE: spec.md REQ-017 acceptance criteria]
- [x] CHK-012 [P0] 018 documents the edge density measurement scenario with gate-threshold expectations: ratio equals `edges/nodes` and threshold gate flips correctly at the boundary [EVIDENCE: spec.md REQ-018 acceptance criteria]
- [x] CHK-013 [P0] 019 documents the weight history audit tracking scenario with rollback expectations: every mutation creates an audit row with old and new values, rollback restores prior weights, history is append-only [EVIDENCE: spec.md REQ-019 acceptance criteria]
- [x] CHK-014 [P0] 020 documents the graph momentum scoring scenario with seven-day delta bonus expectations: bonus equals capped `current - 7d_ago` delta, nodes without history stay at zero, cap is enforced [EVIDENCE: spec.md REQ-020 acceptance criteria]
- [x] CHK-015 [P0] 021 documents the causal depth signal scenario with normalized depth expectations: all scores in `[0,1]` and deeper nodes score greater than or equal to shallower nodes on the same chain [EVIDENCE: spec.md REQ-021 acceptance criteria]
- [x] CHK-016 [P0] 022 documents the community detection scenario with cluster-boost expectations: cluster IDs assigned, co-members receive a boost within the configured cap, non-members receive zero boost [EVIDENCE: spec.md REQ-022 acceptance criteria]
- [x] CHK-017 [P0] 081 documents the graph and cognitive memory fix bundle with guardrail expectations: self-loops blocked, depth clamped, cache invalidated correctly after mutation [EVIDENCE: spec.md REQ-081 acceptance criteria]
- [x] CHK-018 [P0] 120 documents the unified graph rollback and explainability scenario with kill-switch expectations: enabled runs show graph contribution trace, disabled runs remove graph side-effects while preserving deterministic baseline order, repeated runs preserve exact ordering [EVIDENCE: spec.md REQ-120 acceptance criteria]
- [ ] CHK-019 [P1] Open questions from spec.md are resolved or deferred with documented rationale before sandbox-sensitive scenarios (019, 120) are executed [EVIDENCE: open questions section updated or deferred note present]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] 016 has been executed and evidence captures: boost values, at least one typed-edge variant, one no-edge fallback result, and confirmation that no value exceeds the cap [EVIDENCE: execution transcript attached]
- [ ] CHK-021 [P0] 017 has been executed and evidence captures: baseline contribution value at default strength, contribution value at increased strength, and the positive delta between them [EVIDENCE: execution transcript attached]
- [ ] CHK-022 [P0] 018 has been executed and evidence captures: computed ratio, manual `edges/nodes` calculation for verification, and gate state on both sides of the threshold boundary [EVIDENCE: execution transcript attached]
- [ ] CHK-023 [P0] 019 has been executed in a disposable sandbox and evidence captures: audit rows before and after mutation, old and new values, rollback confirmation, and append-only history proof [EVIDENCE: execution transcript and sandbox reset proof attached]
- [ ] CHK-024 [P0] 020 has been executed and evidence captures: momentum bonus value, the seven-day ago reference, the cap enforcement check, and a node-without-history zero-bonus result [EVIDENCE: execution transcript attached]
- [ ] CHK-025 [P0] 021 has been executed and evidence captures: depth scores for at least two nodes on the same chain, confirmation all values are in `[0,1]`, and depth ordering correctness [EVIDENCE: execution transcript attached]
- [ ] CHK-026 [P0] 022 has been executed and evidence captures: cluster ID assignments, co-member boost value within cap, and zero-boost confirmation for a non-member node [EVIDENCE: execution transcript attached]
- [ ] CHK-027 [P0] 081 has been executed in a disposable sandbox and evidence captures: self-loop rejection, clamped depth output, and cache invalidation trigger after a graph mutation [EVIDENCE: execution transcript and sandbox reset proof attached]
- [ ] CHK-028 [P0] 120 has been executed in an isolated runtime with `SPECKIT_GRAPH_UNIFIED` toggled and evidence captures: enabled-run graph contribution trace, disabled-run absence of graph side-effects, deterministic baseline ordering, and identical ordering across repeated enabled runs [EVIDENCE: execution transcript with both flag states attached]
- [ ] CHK-029 [P0] Each of the nine scenarios has an explicit verdict (PASS, PARTIAL, or FAIL) with rationale referencing the review protocol acceptance rules [EVIDENCE: verdict table or inline verdict notes]
- [ ] CHK-030 [P1] Coverage summary reports 9/9 scenarios executed with no skipped test IDs [EVIDENCE: phase closeout note or implementation-summary.md]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets or credentials were added to graph-signal-activation phase documents [EVIDENCE: doc-only content, no secret literals in any of the four files]
- [x] CHK-041 [P0] Stateful scenarios (019, 081, 120) use a disposable sandbox or isolated runtime and do not instruct operators to modify shared production graph state [EVIDENCE: plan.md Phase 3 confirms sandbox isolation for all three tests]
- [ ] CHK-042 [P1] Evidence capture guidance for 120 does not instruct reviewers to log raw flag configuration values or internal rollout state from production systems [EVIDENCE: plan.md Phase 4 evidence guidance reviewed]
- [ ] CHK-043 [P2] Open sandbox questions for 019 and 120 are resolved before execution in a shared environment to prevent unintended graph state contamination [EVIDENCE: open questions in spec.md addressed or deferred]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content is derived from playbook rows for 016 through 022, 081, and 120 and feature catalog entries]
- [ ] CHK-051 [P0] All four phase documents are synchronized: scenario names, prompts, and command sequences are consistent across spec, plan, tasks, and checklist [EVIDENCE: cross-file consistency pass completed]
- [ ] CHK-052 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: file present in `010-graph-signal-activation/`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only the four phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) were created in `010-graph-signal-activation/` [EVIDENCE: directory listing confirms four files]
- [ ] CHK-061 [P1] No unrelated files were added outside the `010-graph-signal-activation/` folder as part of this phase packet creation [EVIDENCE: git status confirms scope]
- [ ] CHK-062 [P2] Memory save was triggered after phase packet creation to make graph-signal-activation context available for future sessions [EVIDENCE: `/memory:save` run or deferred with documented reason]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 0/20 |
| P1 Items | 7 | 0/7 |
| P2 Items | 2 | 0/2 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
