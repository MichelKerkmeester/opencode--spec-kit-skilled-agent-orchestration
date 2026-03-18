---
title: "EX-015 -- Checkpoint creation (checkpoint_create)"
description: "This scenario validates Checkpoint creation (checkpoint_create) for `EX-015`. It focuses on Pre-destructive backup."
---

# EX-015 -- Checkpoint creation (checkpoint_create)

## 1. OVERVIEW

This scenario validates Checkpoint creation (checkpoint_create) for `EX-015`. It focuses on Pre-destructive backup.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-015` and confirm the expected signals without contradicting evidence.

- Objective: Pre-destructive backup
- Prompt: `Create checkpoint pre-bulk-delete`
- Expected signals: New checkpoint listed
- Pass/fail: PASS if checkpoint discoverable

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-015 | Checkpoint creation (checkpoint_create) | Pre-destructive backup | `Create checkpoint pre-bulk-delete` | `checkpoint_create(name,specFolder)` -> `checkpoint_list()` | New checkpoint listed | Create/list outputs | PASS if checkpoint discoverable | Validate folder and naming rules |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [05--lifecycle/01-checkpoint-creation-checkpointcreate.md](../../feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md)

---

## 5. SOURCE METADATA

- Group: Existing Features
- Playbook ID: EX-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--existing-features/015-checkpoint-creation-checkpoint-create.md`
