---
title: "EX-025 -- Learning history (memory_get_learning_history)"
description: "This scenario validates Learning history (memory_get_learning_history) for `EX-025`. It focuses on Trend review."
audited_post_018: true
---

# EX-025 -- Learning history (memory_get_learning_history)

## 1. OVERVIEW

This scenario validates Learning history (memory_get_learning_history) for `EX-025`. It focuses on Trend review.

---

## 2. SCENARIO CONTRACT


- Objective: Trend review.
- Real user request: `Please validate Learning history (memory_get_learning_history) against memory_get_learning_history(specFolder,onlyComplete:true) and tell me whether the expected signals are present: Historical entries returned.`
- RCAF Prompt: `As an analysis validation operator, validate Learning history (memory_get_learning_history) against memory_get_learning_history(specFolder,onlyComplete:true). Verify historical entries returned. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Historical entries returned
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if completed cycles listed

---

## 3. TEST EXECUTION

### Prompt

```
As an analysis validation operator, validate Trend review against memory_get_learning_history(specFolder,onlyComplete:true). Verify historical entries returned. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_get_learning_history(specFolder,onlyComplete:true)

### Expected

Historical entries returned

### Evidence

History output

### Pass / Fail

- **Pass**: completed cycles listed
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Remove filter if no results

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [06--analysis/07-learning-history-memorygetlearninghistory.md](../../feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md)

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: EX-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--analysis/025-learning-history-memory-get-learning-history.md`
