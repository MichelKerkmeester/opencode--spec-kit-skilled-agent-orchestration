---
title: "035 -- Channel min-representation (R2)"
description: "This scenario validates Channel min-representation (R2) for `035`. It focuses on Confirm top-k channel diversity rule."
---

# 035 -- Channel min-representation (R2)

## 1. OVERVIEW

This scenario validates Channel min-representation (R2) for `035`. It focuses on Confirm top-k channel diversity rule.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `035` and confirm the expected signals without contradicting evidence.

- Objective: Confirm top-k channel diversity rule
- Prompt: `Validate channel min-representation (R2). Capture the evidence needed to prove Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection
- Pass/fail: PASS: All active channels have >=1 representative in top-k; quality floor prevents sub-threshold entries; FAIL: Channel missing from top-k or sub-threshold results injected

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 035 | Channel min-representation (R2) | Confirm top-k channel diversity rule | `Validate channel min-representation (R2). Capture the evidence needed to prove Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run dominance query 2) Inspect pre/post representation 3) Verify quality floor | Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection | Pre/post representation counts per channel + quality floor threshold verification | PASS: All active channels have >=1 representative in top-k; quality floor prevents sub-threshold entries; FAIL: Channel missing from top-k or sub-threshold results injected | Verify min-representation algorithm → Check quality floor threshold → Inspect channel priority ordering |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/03-channel-min-representation.md](../../feature_catalog/12--query-intelligence/03-channel-min-representation.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 035
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/035-channel-min-representation-r2.md`
