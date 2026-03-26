---
title: "014 -- Full reporting and ablation study framework (R13-S3)"
description: "This scenario validates Full reporting and ablation study framework (R13-S3) for `014`. It focuses on Confirm ablation+report workflow."
---

# 014 -- Full reporting and ablation study framework (R13-S3)

## 1. OVERVIEW

This scenario validates Full reporting and ablation study framework (R13-S3) for `014`. It focuses on Confirm ablation+report workflow.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `014` and confirm the expected signals without contradicting evidence.

- Objective: Confirm ablation+report workflow
- Prompt: `Execute manual ablation run (R13-S3). Capture the evidence needed to prove Ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report
- Pass/fail: PASS: Ablation completes with per-channel deltas and dashboard generates valid text or JSON output; FAIL: Missing channel data or dashboard generation error

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 014 | Full reporting and ablation study framework (R13-S3) | Confirm ablation+report workflow | `Execute manual ablation run (R13-S3). Capture the evidence needed to prove Ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run ablation channel-off 2) Check snapshots 3) Validate dashboard | Ablation run produces per-channel delta snapshots; dashboard renders with trend data in supported runtime output formats; no channel leaves empty report | Ablation snapshot files + dashboard text or JSON output + per-channel metrics | PASS: Ablation completes with per-channel deltas and dashboard generates valid text or JSON output; FAIL: Missing channel data or dashboard generation error | Verify eval dataset exists → Check ablation channel-off logic → Inspect snapshot storage path → Validate dashboard template |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md](../../feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 014
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--evaluation-and-measurement/014-full-reporting-and-ablation-study-framework-r13-s3.md`
