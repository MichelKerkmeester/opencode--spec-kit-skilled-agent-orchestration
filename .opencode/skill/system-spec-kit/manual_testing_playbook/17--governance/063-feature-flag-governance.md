---
title: "063 -- Feature flag governance"
description: "This scenario validates Feature flag governance for `063`. It focuses on Confirm governance policy conformance."
---

# 063 -- Feature flag governance

## 1. OVERVIEW

This scenario validates Feature flag governance for `063`. It focuses on Confirm governance policy conformance.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `063` and confirm the expected signals without contradicting evidence.

- Objective: Confirm governance policy conformance
- Prompt: `Audit feature flag governance conformance. Capture the evidence needed to prove All flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: All flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found
- Pass/fail: PASS if all flags have documented governance metadata and compliance gaps are identified

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 063 | Feature flag governance | Confirm governance policy conformance | `Audit feature flag governance conformance. Capture the evidence needed to prove All flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found. Return a concise user-facing pass/fail verdict with the main reason.` | 1) enumerate flags 2) verify age/limits/review cadence 3) record compliance gaps | All flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found | Flag inventory + compliance report + gap list | PASS if all flags have documented governance metadata and compliance gaps are identified | Verify flag enumeration covers all source files; check governance policy definitions; inspect review cadence tracking |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [17--governance/01-feature-flag-governance.md](../../feature_catalog/17--governance/01-feature-flag-governance.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 063
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `17--governance/063-feature-flag-governance.md`
