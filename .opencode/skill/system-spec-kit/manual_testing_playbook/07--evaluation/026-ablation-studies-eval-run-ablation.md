---
title: "EX-026 -- Ablation studies (eval_run_ablation)"
description: "This scenario validates Ablation studies (eval_run_ablation) for `EX-026`. It focuses on Channel impact experiment."
---

# EX-026 -- Ablation studies (eval_run_ablation)

## 1. OVERVIEW

This scenario validates Ablation studies (eval_run_ablation) for `EX-026`. It focuses on Channel impact experiment.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-026` and confirm the expected signals without contradicting evidence.

- Objective: Channel impact experiment
- Prompt: `Run ablation on retrieval channels`
- Expected signals: Per-channel deltas reported
- Pass/fail: PASS if run produces metrics/verdict

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-026 | Ablation studies (eval_run_ablation) | Channel impact experiment | `Run ablation on retrieval channels` | `eval_run_ablation({ dataset:"retrieval-channels-smoke", channels:["semantic","keyword","graph"], storeResults:true })` -> `eval_reporting_dashboard({ format:"json", limit:10 })` | Per-channel deltas reported | Ablation + dashboard outputs | PASS if run produces metrics/verdict | Validate eval dataset setup |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [07--evaluation/01-ablation-studies-evalrunablation.md](../../feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md)

---

## 5. SOURCE METADATA

- Group: Evaluation
- Playbook ID: EX-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--evaluation/026-ablation-studies-eval-run-ablation.md`
