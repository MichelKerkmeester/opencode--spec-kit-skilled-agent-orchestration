---
title: "NEW-064 -- Feature flag sunset audit"
description: "This scenario validates Feature flag sunset audit for `NEW-064`. It focuses on Confirm sunset dispositions."
---

# NEW-064 -- Feature flag sunset audit

## 1. OVERVIEW

This scenario validates Feature flag sunset audit for `NEW-064`. It focuses on Confirm sunset dispositions.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-064` and confirm the expected signals without contradicting evidence.

- Objective: Confirm sunset dispositions
- Prompt: `Verify feature flag sunset audit outcomes.`
- Expected signals: Documented dispositions match code state; deprecated flags are no-ops; deltas between docs and code identified
- Pass/fail: PASS if all sunset dispositions match runtime behavior and deprecated flags have no side effects

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-064 | Feature flag sunset audit | Confirm sunset dispositions | `Verify feature flag sunset audit outcomes.` | 1) compare documented disposition vs code 2) verify deprecated/no-op states 3) record deltas | Documented dispositions match code state; deprecated flags are no-ops; deltas between docs and code identified | Disposition comparison report + deprecated flag verification + delta list | PASS if all sunset dispositions match runtime behavior and deprecated flags have no side effects | Verify disposition documentation is current; check deprecated flag code paths; inspect no-op enforcement |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [17--governance/02-feature-flag-sunset-audit.md](../../feature_catalog/17--governance/02-feature-flag-sunset-audit.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: NEW-064
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `17--governance/064-feature-flag-sunset-audit.md`
