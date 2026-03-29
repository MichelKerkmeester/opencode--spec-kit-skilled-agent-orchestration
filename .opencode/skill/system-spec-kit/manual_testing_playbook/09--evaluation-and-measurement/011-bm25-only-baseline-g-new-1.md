---
title: "011 -- BM25-only baseline (G-NEW-1)"
description: "This scenario validates BM25-only baseline (G-NEW-1) for `011`. It focuses on confirming baseline reproducibility with the opt-in BM25 flag enabled."
---

# 011 -- BM25-only baseline (G-NEW-1)

## 1. OVERVIEW

This scenario validates BM25-only baseline (G-NEW-1) for `011`. It focuses on confirming baseline reproducibility with the opt-in BM25 flag enabled.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `011` and confirm the expected signals without contradicting evidence.

- Objective: Confirm baseline reproducibility
- Prompt: `Run BM25-only baseline measurement. Capture the evidence needed to prove ENABLE_BM25=true is set for the in-memory BM25 path; the BM25-only run produces reproducible MRR@5; and no non-BM25 channel contributions appear in trace. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `ENABLE_BM25=true` is set; BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace
- Pass/fail: PASS: MRR@5 is deterministic across 2 runs with `ENABLE_BM25=true` and only the BM25 channel active; FAIL: BM25 flag is missing, non-BM25 channels contribute, or MRR varies

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 011 | BM25-only baseline (G-NEW-1) | Confirm baseline reproducibility | `Run BM25-only baseline measurement. Capture the evidence needed to prove ENABLE_BM25=true is set, the BM25-only run produces reproducible MRR@5, and no non-BM25 channel contributions appear in trace. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Set `ENABLE_BM25=true` and disable non-BM25 channels 2) Run the corpus twice 3) Record MRR@5 and trace output for both runs 4) Confirm the trace shows BM25-only and not the default FTS5 lexical path | `ENABLE_BM25=true` is present; BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace | BM25 baseline output with MRR@5 value + channel trace showing BM25-only + evidence that BM25 was explicitly enabled for the run | PASS: MRR@5 is deterministic across 2 runs with the BM25 flag enabled and only the BM25 channel active; FAIL: BM25 flag is missing, FTS5/default lexical path is still active, non-BM25 channels contribute, or MRR varies | Verify all non-BM25 channels are disabled, confirm `ENABLE_BM25=true`, check BM25 index health, and inspect channel activation flags before treating the run as a valid BM25-only baseline |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [09--evaluation-and-measurement/07-bm25-only-baseline.md](../../feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 011
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--evaluation-and-measurement/011-bm25-only-baseline-g-new-1.md`
