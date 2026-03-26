---
title: "044 -- Reconsolidation-on-save (TM-06)"
description: "This scenario validates Reconsolidation-on-save (TM-06) for `044`. It focuses on Confirm merge/deprecate thresholds."
---

# 044 -- Reconsolidation-on-save (TM-06)

## 1. OVERVIEW

This scenario validates Reconsolidation-on-save (TM-06) for `044`. It focuses on Confirm merge/deprecate thresholds.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `044` and confirm the expected signals without contradicting evidence.

- Objective: Confirm merge/deprecate thresholds
- Prompt: `Validate reconsolidation-on-save (TM-06). Capture the evidence needed to prove Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; thresholds documented in output. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; thresholds documented in output
- Pass/fail: PASS: Merge at >=0.88, supersede at 0.75-0.88, independent below 0.75; FAIL: Wrong action for similarity range or threshold miscalibrated

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 044 | Reconsolidation-on-save (TM-06) | Confirm merge/deprecate thresholds | `Validate reconsolidation-on-save (TM-06). Capture the evidence needed to prove Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; thresholds documented in output. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Save near neighbors 2) verify >=0.88 merge 3) verify 0.75-0.88 supersede | Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; thresholds documented in output | Save output with similarity scores + merge/supersede/independent action taken | PASS: Merge at >=0.88, supersede at 0.75-0.88, independent below 0.75; FAIL: Wrong action for similarity range or threshold miscalibrated | Verify similarity computation → Check threshold configuration → Inspect merge vs supersede logic |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/06-reconsolidation-on-save.md](../../feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 044
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/044-reconsolidation-on-save-tm-06.md`
