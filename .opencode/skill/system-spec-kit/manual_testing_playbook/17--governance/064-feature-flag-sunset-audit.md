---
title: "064 -- Feature flag sunset audit"
description: "This scenario validates Feature flag sunset audit for `064`. It focuses on Confirm sunset dispositions."
---

# 064 -- Feature flag sunset audit

## 1. OVERVIEW

This scenario validates Feature flag sunset audit for `064`. It focuses on Confirm sunset dispositions.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `064` and confirm the expected signals without contradicting evidence.

- Objective: Confirm sunset dispositions for active, inert, and retired surfaces
- Prompt: `Verify feature flag sunset audit outcomes. Capture the evidence needed to prove documented dispositions match code state; inert compatibility flags such as SPECKIT_RSF_FUSION and SPECKIT_SHADOW_SCORING stay no-op; retired topics such as full-context ceiling eval, index refresh, context budget, PageRank, and entity scope are not treated as live runtime checks. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Documented dispositions match code state; inert compatibility flags remain no-op; retired topics are not treated as live runtime checks
- Pass/fail: PASS if the sunset dispositions match current behavior and retired topics stay off the live validation surface

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 064 | Feature flag sunset audit | Confirm sunset dispositions for active, inert, and retired surfaces | `Verify feature flag sunset audit outcomes. Capture the evidence needed to prove documented dispositions match code state; inert compatibility flags such as SPECKIT_RSF_FUSION and SPECKIT_SHADOW_SCORING stay no-op; retired topics such as full-context ceiling eval, index refresh, context budget, PageRank, and entity scope are not treated as live runtime checks. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Compare documented dispositions vs code and feature-catalog notes 2) Verify inert compatibility flags stay no-op 3) Verify retired topics do not appear as active runtime checks or playbook obligations 4) Record deltas | Documented dispositions match code state; inert compatibility flags remain no-op; retired topics are not treated as live runtime checks | Disposition comparison report + inert-flag verification + retired-topic checklist | PASS if the sunset dispositions match current behavior and retired topics stay off the live validation surface; FAIL if an inert flag still changes runtime behavior or a retired topic is treated as active | Verify disposition documentation is current; check inert-flag code paths; remove any active-playbook wording that still advertises retired topics |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [17--governance/02-feature-flag-sunset-audit.md](../../feature_catalog/17--governance/02-feature-flag-sunset-audit.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 064
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `17--governance/064-feature-flag-sunset-audit.md`
