---
title: "NEW-008 -- Full-context ceiling evaluation (A2)"
description: "This scenario validates Full-context ceiling evaluation (A2) for `NEW-008`. It focuses on Confirm ceiling benchmark run."
---

# NEW-008 -- Full-context ceiling evaluation (A2)

## 1. OVERVIEW

This scenario validates Full-context ceiling evaluation (A2) for `NEW-008`. It focuses on Confirm ceiling benchmark run.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-008` and confirm the expected signals without contradicting evidence.

- Objective: Confirm ceiling benchmark run
- Prompt: `Run full-context ceiling evaluation (A2).`
- Expected signals: Ceiling benchmark produces ranked output; ceiling score >= hybrid and BM25 baselines
- Pass/fail: PASS: Ceiling evaluation completes with scores >= other baselines; FAIL: Ceiling score lower than hybrid or BM25

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-008 | Full-context ceiling evaluation (A2) | Confirm ceiling benchmark run | `Run full-context ceiling evaluation (A2).` | 1) Build title/summary corpus 2) Run ceiling ranking 3) Compare with hybrid/BM25 | Ceiling benchmark produces ranked output; ceiling score >= hybrid and BM25 baselines | Ceiling ranking output + comparison table against hybrid/BM25 scores | PASS: Ceiling evaluation completes with scores >= other baselines; FAIL: Ceiling score lower than hybrid or BM25 | Verify corpus includes title+summary fields → Check ceiling ranking algorithm → Inspect baseline measurement methodology |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md](../../feature_catalog/09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: NEW-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/008-full-context-ceiling-evaluation-a2.md`
