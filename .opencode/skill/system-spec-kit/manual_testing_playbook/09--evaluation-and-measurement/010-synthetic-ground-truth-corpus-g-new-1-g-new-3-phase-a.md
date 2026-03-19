---
title: "NEW-010 -- Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)"
description: "This scenario validates Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) for `NEW-010`. It focuses on Confirm corpus coverage and hard negatives."
---

# NEW-010 -- Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)

## 1. OVERVIEW

This scenario validates Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) for `NEW-010`. It focuses on Confirm corpus coverage and hard negatives.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-010` and confirm the expected signals without contradicting evidence.

- Objective: Confirm corpus coverage and hard negatives
- Prompt: `Audit synthetic ground-truth corpus coverage. Capture the evidence needed to prove Corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced
- Pass/fail: PASS: >=3 intent categories covered, >=5 hard negatives, >=3 non-trigger prompts; FAIL: Missing category or zero hard negatives

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-010 | Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) | Confirm corpus coverage and hard negatives | `Audit synthetic ground-truth corpus coverage. Capture the evidence needed to prove Corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Open corpus 2) Count intents/tiers 3) Verify hard negatives/non-trigger prompts | Corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced | Corpus audit report with intent counts, hard negative count, and tier histogram | PASS: >=3 intent categories covered, >=5 hard negatives, >=3 non-trigger prompts; FAIL: Missing category or zero hard negatives | Check corpus generation script → Verify intent taxonomy completeness → Inspect hard negative selection criteria |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md](../../feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: NEW-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/010-synthetic-ground-truth-corpus-g-new-1-g-new-3-phase-a.md`
