---
title: "091 -- Implemented: graph centrality and community detection (N2)"
description: "This scenario validates Implemented: graph centrality and community detection (N2) for `091`. It focuses on Confirm deferred->implemented status."
---

# 091 -- Implemented: graph centrality and community detection (N2)

## 1. OVERVIEW

This scenario validates Implemented: graph centrality and community detection (N2) for `091`. It focuses on Confirm deferred->implemented status.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `091` and confirm the expected signals without contradicting evidence.

- Objective: Confirm deferred->implemented status
- Prompt: `Verify N2 implemented and active. Capture the evidence needed to prove N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores
- Pass/fail: PASS if N2 tables are populated, flags are active, and graph queries include centrality/community scoring. NOTE: ANCHOR-as-node is PLANNED/DEFERRED (feature catalog `09-anchor-tags-as-graph-nodes.md`) and is excluded from pass criteria. This scenario passes based on the implemented N2 features (momentum, depth, community) alone.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 091 | Implemented: graph centrality and community detection (N2) | Confirm deferred->implemented status | `Verify N2 implemented and active. Capture the evidence needed to prove N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores. Return a concise user-facing pass/fail verdict with the main reason.` | 1) inspect tables/flags 2) run graph queries 3) verify N2 contributions | N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores | Table inspection + flag status + graph query output showing N2 score contributions | PASS if N2 tables are populated, flags are active, and graph queries include centrality/community scoring. ANCHOR-as-node is DEFERRED/SKIPPED — see feature catalog `09-anchor-tags-as-graph-nodes.md`. Test actively guards against edge creation; this aspect must NOT be tested as a current requirement. | Verify N2 migration completed; check feature flag state; inspect graph scoring pipeline for N2 channel integration |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/07-community-detection.md](../../feature_catalog/10--graph-signal-activation/07-community-detection.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 091
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/091-implemented-graph-centrality-and-community-detection-n2.md`
