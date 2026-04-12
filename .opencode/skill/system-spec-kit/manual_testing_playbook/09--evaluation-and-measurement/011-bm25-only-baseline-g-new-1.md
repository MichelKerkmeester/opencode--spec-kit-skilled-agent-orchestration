---
title: "011 -- BM25-only baseline (G-NEW-1)"
description: "This scenario validates BM25/FTS5-only baseline (G-NEW-1) for `011`. It focuses on confirming baseline reproducibility with the BM25 path active."
---

# 011 -- BM25-only baseline (G-NEW-1)

## 1. OVERVIEW

This scenario validates BM25/FTS5-only baseline (G-NEW-1) for `011`. It focuses on confirming baseline reproducibility with the BM25 path active.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `011` and confirm the expected signals without contradicting evidence.

- Objective: Confirm baseline reproducibility
- Prompt: `As an evaluation validation operator, validate BM25-only baseline (G-NEW-1) against ENABLE_BM25=true. Verify bM25 path is active; BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: BM25 path is active; BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace
- Pass/fail: PASS: MRR@5 is deterministic across 2 runs with the BM25 path active and only the BM25 channel active; FAIL: BM25 path is missing, non-BM25 channels contribute, or MRR varies

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, confirm baseline reproducibility against ENABLE_BM25=true. Verify bM25 path is active; BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Set `ENABLE_BM25=true` and disable non-BM25 channels
2. Run the corpus twice
3. Record MRR@5 and trace output for both runs
4. Confirm the trace shows BM25-only and no vector/graph/trigger contribution

### Expected

BM25 path is active; BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace

### Evidence

BM25 baseline output with MRR@5 value + channel trace showing BM25-only + evidence that BM25 was explicitly active for the run

### Pass / Fail

- **Pass**: MRR@5 is deterministic across 2 runs with the BM25 path active and only the BM25 channel active
- **Fail**: BM25 path is missing, non-BM25 channels contribute, or MRR varies

### Failure Triage

Verify all non-BM25 channels are disabled, confirm BM25 path activation, check BM25 index health, and inspect channel activation flags before treating the run as a valid BM25-only baseline

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [09--evaluation-and-measurement/07-bm25-only-baseline.md](../../feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 011
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--evaluation-and-measurement/011-bm25-only-baseline-g-new-1.md`
- audited_post_018: true
- phase_018_change: aligned the scenario wording with the live BM25/FTS5-only runner and default-enabled BM25 path
