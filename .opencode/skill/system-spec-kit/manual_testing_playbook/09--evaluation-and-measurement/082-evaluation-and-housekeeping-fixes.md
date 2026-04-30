---
title: "082 -- Evaluation and housekeeping fixes"
description: "This scenario validates Evaluation and housekeeping fixes for `082`. It focuses on Confirm eval/housekeeping reliability."
---

# 082 -- Evaluation and housekeeping fixes

## 1. OVERVIEW

This scenario validates Evaluation and housekeeping fixes for `082`. It focuses on Confirm eval/housekeeping reliability.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm eval/housekeeping reliability.
- Real user request: `Please validate Evaluation and housekeeping fixes against the documented validation surface and tell me whether the expected signals are present: Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly.`
- RCAF Prompt: `As an evaluation validation operator, validate Evaluation and housekeeping fixes against the documented validation surface. Verify run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if run-IDs are unique, upserts produce consistent state, and boundary guards reject invalid values

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, confirm eval/housekeeping reliability against the documented validation surface. Verify run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. restart+eval runs
2. verify run-id and upsert behavior
3. inspect boundary guards

### Expected

Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly

### Evidence

Eval run output with run-ID + upsert verification + boundary guard test evidence

### Pass / Fail

- **Pass**: run-IDs are unique, upserts produce consistent state, and boundary guards reject invalid values
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect run-ID generation logic; verify upsert idempotency; check boundary guard threshold values

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md](../../feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 082
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md`
- audited_post_018: true
