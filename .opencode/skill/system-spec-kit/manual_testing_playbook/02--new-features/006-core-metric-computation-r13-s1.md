---
title: "NEW-006 -- Core metric computation (R13-S1)"
description: "This scenario validates Core metric computation (R13-S1) for `NEW-006`. It focuses on Confirm metric battery outputs."
---

# NEW-006 -- Core metric computation (R13-S1)

## 1. OVERVIEW

This scenario validates Core metric computation (R13-S1) for `NEW-006`. It focuses on Confirm metric battery outputs.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-006` and confirm the expected signals without contradicting evidence.

- Objective: Confirm metric battery outputs
- Prompt: `Validate core metric computation (R13-S1).`
- Expected signals: Metric battery returns precision, recall, MRR, NDCG values; all within valid ranges
- Pass/fail: PASS: All core metrics computed with values in [0,1] range; FAIL: Missing metrics or out-of-range values

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-006 | Core metric computation (R13-S1) | Confirm metric battery outputs | `Validate core metric computation (R13-S1).` | 1) Seed ground truth 2) Run eval metrics 3) Verify metric set | Metric battery returns precision, recall, MRR, NDCG values; all within valid ranges | Eval metric output with ground truth comparison + per-metric values | PASS: All core metrics computed with values in [0,1] range; FAIL: Missing metrics or out-of-range values | Verify ground truth corpus is seeded → Check metric computation functions → Inspect edge cases (empty results, single result) |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/02-core-metric-computation.md](../../feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/006-core-metric-computation-r13-s1.md`
