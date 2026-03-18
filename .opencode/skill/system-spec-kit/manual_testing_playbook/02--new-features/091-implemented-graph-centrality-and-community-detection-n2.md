---
title: "NEW-091 -- Implemented: graph centrality and community detection (N2)"
description: "This scenario validates Implemented: graph centrality and community detection (N2) for `NEW-091`. It focuses on Confirm deferred->implemented status."
---

# NEW-091 -- Implemented: graph centrality and community detection (N2)

## 1. OVERVIEW

This scenario validates Implemented: graph centrality and community detection (N2) for `NEW-091`. It focuses on Confirm deferred->implemented status.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-091` and confirm the expected signals without contradicting evidence.

- Objective: Confirm deferred->implemented status
- Prompt: `Verify N2 implemented and active.`
- Expected signals: N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores
- Pass/fail: PASS if N2 tables are populated, flags are active, and graph queries include centrality/community scoring

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-091 | Implemented: graph centrality and community detection (N2) | Confirm deferred->implemented status | `Verify N2 implemented and active.` | 1) inspect tables/flags 2) run graph queries 3) verify N2 contributions | N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores | Table inspection + flag status + graph query output showing N2 score contributions | PASS if N2 tables are populated, flags are active, and graph queries include centrality/community scoring | Verify N2 migration completed; check feature flag state; inspect graph scoring pipeline for N2 channel integration |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/07-community-detection.md](../../feature_catalog/10--graph-signal-activation/07-community-detection.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-091
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/091-implemented-graph-centrality-and-community-detection-n2.md`
