---
title: "EX-025 -- Learning history (memory_get_learning_history)"
description: "This scenario validates Learning history (memory_get_learning_history) for `EX-025`. It focuses on Trend review."
---

# EX-025 -- Learning history (memory_get_learning_history)

## 1. OVERVIEW

This scenario validates Learning history (memory_get_learning_history) for `EX-025`. It focuses on Trend review.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-025` and confirm the expected signals without contradicting evidence.

- Objective: Trend review
- Prompt: `Show completed learning history. Capture the evidence needed to prove Historical entries returned. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Historical entries returned
- Pass/fail: PASS if completed cycles listed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-025 | Learning history (memory_get_learning_history) | Trend review | `Show completed learning history. Capture the evidence needed to prove Historical entries returned. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_get_learning_history(specFolder,onlyComplete:true)` | Historical entries returned | History output | PASS if completed cycles listed | Remove filter if no results |

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
