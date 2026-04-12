---
title: "EX-025 -- Learning history (memory_get_learning_history)"
description: "This scenario validates Learning history (memory_get_learning_history) for `EX-025`. It focuses on Trend review."
audited_post_018: true
---

# EX-025 -- Learning history (memory_get_learning_history)

## 1. OVERVIEW

This scenario validates Learning history (memory_get_learning_history) for `EX-025`. It focuses on Trend review.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-025` and confirm the expected signals without contradicting evidence.

- Objective: Trend review
- Prompt: `As an analysis validation operator, validate Learning history (memory_get_learning_history) against memory_get_learning_history(specFolder,onlyComplete:true). Verify historical entries returned. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Historical entries returned
- Pass/fail: PASS if completed cycles listed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-025 | Learning history (memory_get_learning_history) | Trend review | `As an analysis validation operator, validate Trend review against memory_get_learning_history(specFolder,onlyComplete:true). Verify historical entries returned. Return a concise pass/fail verdict with the main reason and cited evidence.` | `memory_get_learning_history(specFolder,onlyComplete:true)` | Historical entries returned | History output | PASS if completed cycles listed | Remove filter if no results |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [06--analysis/07-learning-history-memorygetlearninghistory.md](../../feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-025
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--analysis/025-learning-history-memory-get-learning-history.md`
