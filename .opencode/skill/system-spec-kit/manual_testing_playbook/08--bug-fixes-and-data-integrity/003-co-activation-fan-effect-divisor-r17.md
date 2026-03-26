---
title: "003 -- Co-activation fan-effect divisor (R17)"
description: "This scenario validates Co-activation fan-effect divisor (R17) for `003`. It focuses on Confirm hub dampening."
---

# 003 -- Co-activation fan-effect divisor (R17)

## 1. OVERVIEW

This scenario validates Co-activation fan-effect divisor (R17) for `003`. It focuses on Confirm hub dampening.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `003` and confirm the expected signals without contradicting evidence.

- Objective: Confirm hub dampening
- Prompt: `Verify co-activation fan-effect divisor (R17). Capture the evidence needed to prove Hub node score dampened proportionally to fan-out degree; non-hub scores unaffected. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Hub node score dampened proportionally to fan-out degree; non-hub scores unaffected
- Pass/fail: PASS: Hub node contribution decreases as degree increases; no single hub dominates >50% of top-5; FAIL: Hub monopolizes results

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 003 | Co-activation fan-effect divisor (R17) | Confirm hub dampening | `Verify co-activation fan-effect divisor (R17). Capture the evidence needed to prove Hub node score dampened proportionally to fan-out degree; non-hub scores unaffected. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create high-degree hub 2) Run repeated queries 3) Compare dominance | Hub node score dampened proportionally to fan-out degree; non-hub scores unaffected | Query output showing hub vs non-hub score comparison across repeated queries | PASS: Hub node contribution decreases as degree increases; no single hub dominates >50% of top-5; FAIL: Hub monopolizes results | Check fan-effect divisor formula → Verify degree count accuracy → Inspect co-activation weight cap |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md](../../feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--bug-fixes-and-data-integrity/003-co-activation-fan-effect-divisor-r17.md`
