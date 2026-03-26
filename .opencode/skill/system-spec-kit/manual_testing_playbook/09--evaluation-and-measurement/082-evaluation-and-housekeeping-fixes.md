---
title: "082 -- Evaluation and housekeeping fixes"
description: "This scenario validates Evaluation and housekeeping fixes for `082`. It focuses on Confirm eval/housekeeping reliability."
---

# 082 -- Evaluation and housekeeping fixes

## 1. OVERVIEW

This scenario validates Evaluation and housekeeping fixes for `082`. It focuses on Confirm eval/housekeeping reliability.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `082` and confirm the expected signals without contradicting evidence.

- Objective: Confirm eval/housekeeping reliability
- Prompt: `Validate evaluation and housekeeping fixes. Capture the evidence needed to prove Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly
- Pass/fail: PASS if run-IDs are unique, upserts produce consistent state, and boundary guards reject invalid values

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 082 | Evaluation and housekeeping fixes | Confirm eval/housekeeping reliability | `Validate evaluation and housekeeping fixes. Capture the evidence needed to prove Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly. Return a concise user-facing pass/fail verdict with the main reason.` | 1) restart+eval runs 2) verify run-id and upsert behavior 3) inspect boundary guards | Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly | Eval run output with run-ID + upsert verification + boundary guard test evidence | PASS if run-IDs are unique, upserts produce consistent state, and boundary guards reject invalid values | Inspect run-ID generation logic; verify upsert idempotency; check boundary guard threshold values |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md](../../feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 082
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md`
