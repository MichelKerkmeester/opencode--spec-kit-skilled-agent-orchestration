---
title: "022 -- Community detection (N2c)"
description: "This scenario validates Community detection (N2c) for `022`. It focuses on Confirm community boost injection."
---

# 022 -- Community detection (N2c)

## 1. OVERVIEW

This scenario validates Community detection (N2c) for `022`. It focuses on Confirm community boost injection.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `022` and confirm the expected signals without contradicting evidence.

- Objective: Confirm community boost injection
- Prompt: `Validate community detection (N2c). Capture the evidence needed to prove Community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum
- Pass/fail: PASS: Cluster IDs assigned; co-members receive boost within cap; non-members get zero boost; FAIL: Missing cluster IDs or boost exceeds cap

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 022 | Community detection (N2c) | Confirm community boost injection | `Validate community detection (N2c). Capture the evidence needed to prove Community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create communities 2) Recompute 3) Verify co-member injection/caps | Community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum | Community assignment output + co-member boost values + cap verification | PASS: Cluster IDs assigned; co-members receive boost within cap; non-members get zero boost; FAIL: Missing cluster IDs or boost exceeds cap | Verify community detection algorithm → Check boost injection point in pipeline → Inspect cap enforcement |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/07-community-detection.md](../../feature_catalog/10--graph-signal-activation/07-community-detection.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 022
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/022-community-detection-n2c.md`
