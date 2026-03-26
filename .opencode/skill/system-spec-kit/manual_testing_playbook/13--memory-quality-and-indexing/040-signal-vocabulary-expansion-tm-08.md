---
title: "040 -- Signal vocabulary expansion (TM-08)"
description: "This scenario validates Signal vocabulary expansion (TM-08) for `040`. It focuses on Confirm signal category detection."
---

# 040 -- Signal vocabulary expansion (TM-08)

## 1. OVERVIEW

This scenario validates Signal vocabulary expansion (TM-08) for `040`. It focuses on Confirm signal category detection.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `040` and confirm the expected signals without contradicting evidence.

- Objective: Confirm signal category detection
- Prompt: `Validate signal vocabulary expansion (TM-08). Capture the evidence needed to prove Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary
- Pass/fail: PASS: >=3 signal categories correctly classified from varied prompts; FAIL: Categories missing or misclassified

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 040 | Signal vocabulary expansion (TM-08) | Confirm signal category detection | `Validate signal vocabulary expansion (TM-08). Capture the evidence needed to prove Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Use correction/preference prompts 2) Trigger matching 3) Verify categories | Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary | Trigger match output showing detected signal categories + prompt-to-category mapping | PASS: >=3 signal categories correctly classified from varied prompts; FAIL: Categories missing or misclassified | Verify signal vocabulary dictionary → Check category detection regex/rules → Inspect trigger matching integration |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md](../../feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 040
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/040-signal-vocabulary-expansion-tm-08.md`
