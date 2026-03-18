---
title: "NEW-030 -- RRF K-value sensitivity analysis (FUT-5)"
description: "This scenario validates RRF K-value sensitivity analysis (FUT-5) for `NEW-030`. It focuses on Confirm K sensitivity measurements."
---

# NEW-030 -- RRF K-value sensitivity analysis (FUT-5)

## 1. OVERVIEW

This scenario validates RRF K-value sensitivity analysis (FUT-5) for `NEW-030`. It focuses on Confirm K sensitivity measurements.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-030` and confirm the expected signals without contradicting evidence.

- Objective: Confirm K sensitivity measurements
- Prompt: `Run RRF K sensitivity analysis.`
- Expected signals: K-value grid produces per-K metric comparisons; optimal K identified with rationale; sensitivity curve shows diminishing returns
- Pass/fail: PASS: Multiple K values tested with per-K metrics; optimal K documented with evidence; FAIL: Single K tested or no comparative analysis

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-030 | RRF K-value sensitivity analysis (FUT-5) | Confirm K sensitivity measurements | `Run RRF K sensitivity analysis.` | 1) Run K grid 2) Compare metrics 3) Select best K rationale | K-value grid produces per-K metric comparisons; optimal K identified with rationale; sensitivity curve shows diminishing returns | K-grid metric output + sensitivity comparison table + optimal K selection rationale | PASS: Multiple K values tested with per-K metrics; optimal K documented with evidence; FAIL: Single K tested or no comparative analysis | Verify K-grid configuration → Check metric computation per K → Inspect sensitivity analysis methodology |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md](../../feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: NEW-030
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/030-rrf-k-value-sensitivity-analysis-fut-5.md`
