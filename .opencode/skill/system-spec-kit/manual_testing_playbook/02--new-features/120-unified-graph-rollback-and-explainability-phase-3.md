---
title: "NEW-120 -- Unified graph rollback and explainability (Phase 3)"
description: "This scenario validates Unified graph rollback and explainability (Phase 3) for `NEW-120`. It focuses on Confirm graph kill switch removes graph-side effects while traces still explain enabled runs."
---

# NEW-120 -- Unified graph rollback and explainability (Phase 3)

## 1. OVERVIEW

This scenario validates Unified graph rollback and explainability (Phase 3) for `NEW-120`. It focuses on Confirm graph kill switch removes graph-side effects while traces still explain enabled runs.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-120` and confirm the expected signals without contradicting evidence.

- Objective: Confirm graph kill switch removes graph-side effects while traces still explain enabled runs
- Prompt: `Validate Phase 3 graph rollback and explainability.`
- Expected signals: When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; when disabled, graph-side effects are absent and baseline ordering remains deterministic
- Pass/fail: PASS: Enabled trace shows graph contributions, disabled trace shows kill-switch baseline parity, repeated runs preserve exact ordering; FAIL: Graph effects remain after disable or repeated runs reorder ties

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-120 | Unified graph rollback and explainability (Phase 3) | Confirm graph kill switch removes graph-side effects while traces still explain enabled runs | `Validate Phase 3 graph rollback and explainability.` | 1) Run `memory_search({ query:"graph rollout check", includeTrace:true })` with graph rollout enabled 2) Verify trace contains `graphContribution` metadata and deterministic ordering across repeat runs 3) Set `SPECKIT_GRAPH_UNIFIED=false` 4) Repeat query 5) Verify graph contribution counters drop to zero and ordering stays stable | When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; when disabled, graph-side effects are absent and baseline ordering remains deterministic | Search output + trace payloads for enabled/disabled runs + repeated query ordering comparison | PASS: Enabled trace shows graph contributions, disabled trace shows kill-switch baseline parity, repeated runs preserve exact ordering; FAIL: Graph effects remain after disable or repeated runs reorder ties | Verify `SPECKIT_GRAPH_UNIFIED` propagation into Stage 2 → Inspect `graphContribution` trace metadata → Re-run identical query to confirm tie-break stability |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md](../../feature_catalog/10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-120
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/120-unified-graph-rollback-and-explainability-phase-3.md`
