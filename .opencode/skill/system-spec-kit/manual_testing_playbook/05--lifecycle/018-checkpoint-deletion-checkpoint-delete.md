---
title: "EX-018 -- Checkpoint deletion (checkpoint_delete)"
description: "This scenario validates Checkpoint deletion (checkpoint_delete) for `EX-018`. It focuses on Old snapshot cleanup."
---

# EX-018 -- Checkpoint deletion (checkpoint_delete)

## 1. OVERVIEW

This scenario validates Checkpoint deletion (checkpoint_delete) for `EX-018`. It focuses on Old snapshot cleanup.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-018` and confirm the expected signals without contradicting evidence.

- Objective: Old snapshot cleanup
- Prompt: `Delete stale checkpoint by name. Capture the evidence needed to prove Removed checkpoint absent from list. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Removed checkpoint absent from list
- Pass/fail: PASS if checkpoint removed from sandbox list

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-018 | Checkpoint deletion (checkpoint_delete) | Old snapshot cleanup | `Delete stale checkpoint by name. Capture the evidence needed to prove Removed checkpoint absent from list. Return a concise user-facing pass/fail verdict with the main reason.` | `checkpoint_list(specFolder:"<sandbox-spec>")` -> `checkpoint_delete(name:"<checkpoint-name>",confirmName:"<checkpoint-name>")` -> `checkpoint_list(specFolder:"<sandbox-spec>")` | Removed checkpoint absent from list | Before/after list outputs | PASS if checkpoint removed from sandbox list | Validate name, `confirmName`, and sandbox scope; retry |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [05--lifecycle/04-checkpoint-deletion-checkpointdelete.md](../../feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: EX-018
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--lifecycle/018-checkpoint-deletion-checkpoint-delete.md`
