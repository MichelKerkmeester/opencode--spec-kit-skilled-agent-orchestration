---
title: "010 -- Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)"
description: "This scenario validates Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) for `010`. It focuses on Confirm corpus coverage and hard negatives."
---

# 010 -- Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)

## 1. OVERVIEW

This scenario validates Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) for `010`. It focuses on Confirm corpus coverage and hard negatives.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm corpus coverage and hard negatives.
- Real user request: `Please validate Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) against the documented validation surface and tell me whether the expected signals are present: Corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced.`
- RCAF Prompt: `As an evaluation validation operator, validate Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) against the documented validation surface. Verify corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
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

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md](../../feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/010-synthetic-ground-truth-corpus-g-new-1-g-new-3-phase-a.md`
- audited_post_018: true
