---
title: "NEW-014 -- Full reporting and ablation study framework (R13-S3)"
description: "This scenario validates Full reporting and ablation study framework (R13-S3) for `NEW-014`. It focuses on Confirm ablation+report workflow."
---

# NEW-014 -- Full reporting and ablation study framework (R13-S3)

## 1. OVERVIEW

This scenario validates Full reporting and ablation study framework (R13-S3) for `NEW-014`. It focuses on Confirm ablation+report workflow.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-014` and confirm the expected signals without contradicting evidence.

- Objective: Confirm ablation+report workflow
- Prompt: `Execute manual ablation run (R13-S3).`
- Expected signals: Ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report
- Pass/fail: PASS: Ablation completes with per-channel deltas and dashboard generates valid text or JSON output; FAIL: Missing channel data or dashboard generation error

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-014 | Full reporting and ablation study framework (R13-S3) | Confirm ablation+report workflow | `Execute manual ablation run (R13-S3).` | 1) Run ablation channel-off 2) Check snapshots 3) Validate dashboard | Ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report | Ablation snapshot files + dashboard text or JSON output + per-channel metrics | PASS: Ablation completes with per-channel deltas and dashboard generates valid text or JSON output; FAIL: Missing channel data or dashboard generation error | Verify eval dataset exists → Check ablation channel-off logic → Inspect snapshot storage path → Validate dashboard template |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md](../../feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: NEW-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/014-full-reporting-and-ablation-study-framework-r13-s3.md`
