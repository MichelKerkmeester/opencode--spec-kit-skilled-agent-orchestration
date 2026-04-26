---
title: "040 -- Signal vocabulary expansion (TM-08)"
description: "This scenario validates Signal vocabulary expansion (TM-08) for `040`. It focuses on Confirm signal category detection."
audited_post_018: true
---

# 040 -- Signal vocabulary expansion (TM-08)

## 1. OVERVIEW

This scenario validates Signal vocabulary expansion (TM-08) for `040`. It focuses on Confirm signal category detection.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `040` and confirm the expected signals without contradicting evidence.

- Objective: Confirm signal category detection
- Prompt: `As a spec-doc record-quality validation operator, validate Signal vocabulary expansion (TM-08) against the documented validation surface. Verify signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary
- Pass/fail: PASS: >=3 signal categories correctly classified from varied prompts; FAIL: Categories missing or misclassified

---

## 3. TEST EXECUTION

### Prompt

```
As a spec-doc record-quality validation operator, confirm signal category detection against the documented validation surface. Verify signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Use correction/preference prompts
2. Trigger matching
3. Verify categories

### Expected

Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary

### Evidence

Trigger match output showing detected signal categories + prompt-to-category mapping

### Pass / Fail

- **Pass**: >=3 signal categories correctly classified from varied prompts
- **Fail**: Categories missing or misclassified

### Failure Triage

Verify signal vocabulary dictionary → Check category detection regex/rules → Inspect trigger matching integration

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md](../../feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 040
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/040-signal-vocabulary-expansion-tm-08.md`
