---
title: "011 -- BM25-only baseline (G-NEW-1)"
description: "This scenario validates BM25-only baseline (G-NEW-1) for `011`. It focuses on Confirm baseline reproducibility."
---

# 011 -- BM25-only baseline (G-NEW-1)

## 1. OVERVIEW

This scenario validates BM25-only baseline (G-NEW-1) for `011`. It focuses on Confirm baseline reproducibility.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `011` and confirm the expected signals without contradicting evidence.

- Objective: Confirm baseline reproducibility
- Prompt: `Run BM25-only baseline measurement. Capture the evidence needed to prove BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace
- Pass/fail: PASS: MRR@5 is deterministic across 2 runs and only BM25 channel active; FAIL: Non-BM25 channels contribute or MRR varies

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 011 | BM25-only baseline (G-NEW-1) | Confirm baseline reproducibility | `Run BM25-only baseline measurement. Capture the evidence needed to prove BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Disable non-BM25 channels 2) Run corpus 3) Record MRR@5 | BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace | BM25 baseline output with MRR@5 value + channel trace showing BM25-only | PASS: MRR@5 is deterministic across 2 runs and only BM25 channel active; FAIL: Non-BM25 channels contribute or MRR varies | Verify all non-BM25 channels disabled → Check BM25 index health → Inspect channel activation flags |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/07-bm25-only-baseline.md](../../feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/011-bm25-only-baseline-g-new-1.md`
