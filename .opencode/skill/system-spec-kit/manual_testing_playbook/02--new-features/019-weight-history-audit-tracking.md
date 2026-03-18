---
title: "NEW-019 -- Weight history audit tracking"
description: "This scenario validates Weight history audit tracking for `NEW-019`. It focuses on Confirm edge change logging + rollback."
---

# NEW-019 -- Weight history audit tracking

## 1. OVERVIEW

This scenario validates Weight history audit tracking for `NEW-019`. It focuses on Confirm edge change logging + rollback.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-019` and confirm the expected signals without contradicting evidence.

- Objective: Confirm edge change logging + rollback
- Prompt: `Validate weight history audit tracking.`
- Expected signals: Audit rows logged for each edge strength mutation; rollback restores previous weights; audit history is append-only
- Pass/fail: PASS: Each mutation produces audit row with old/new values; rollback restores prior weights; FAIL: Missing audit rows or rollback data loss

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-019 | Weight history audit tracking | Confirm edge change logging + rollback | `Validate weight history audit tracking.` | 1) Mutate edge strengths 2) Inspect audit rows 3) Run rollback | Audit rows logged for each edge strength mutation; rollback restores previous weights; audit history is append-only | Audit table rows showing before/after values + rollback verification + row count after rollback | PASS: Each mutation produces audit row with old/new values; rollback restores prior weights; FAIL: Missing audit rows or rollback data loss | Check audit table schema → Verify trigger/hook on edge mutation → Inspect rollback query logic |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/04-weight-history-audit-tracking.md](../../feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/019-weight-history-audit-tracking.md`
