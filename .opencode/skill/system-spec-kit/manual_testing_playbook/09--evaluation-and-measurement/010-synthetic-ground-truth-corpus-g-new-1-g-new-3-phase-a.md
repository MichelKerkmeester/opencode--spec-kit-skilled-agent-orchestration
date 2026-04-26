---
title: "010 -- Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)"
description: "This scenario validates Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) for `010`. It focuses on Confirm corpus coverage and hard negatives."
---

# 010 -- Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)

## 1. OVERVIEW

This scenario validates Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) for `010`. It focuses on Confirm corpus coverage and hard negatives.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `010` and confirm the expected signals without contradicting evidence.

- Objective: Confirm corpus coverage and hard negatives
- Prompt: `As an evaluation validation operator, validate Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) against the documented validation surface. Verify corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced
- Pass/fail: PASS: >=3 intent categories covered, >=5 hard negatives, >=3 non-trigger prompts; FAIL: Missing category or zero hard negatives

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, confirm corpus coverage and hard negatives against the documented validation surface. Verify corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Open corpus
2. Count intents/tiers
3. Verify hard negatives/non-trigger prompts

### Expected

Corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced

### Evidence

Corpus audit report with intent counts, hard negative count, and tier histogram

### Pass / Fail

- **Pass**: >=3 intent categories covered, >=5 hard negatives, >=3 non-trigger prompts
- **Fail**: Missing category or zero hard negatives

### Failure Triage

Check corpus generation script → Verify intent taxonomy completeness → Inspect hard negative selection criteria

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md](../../feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 010
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--evaluation-and-measurement/010-synthetic-ground-truth-corpus-g-new-1-g-new-3-phase-a.md`
- audited_post_018: true
