---
title: "EX-016 -- Checkpoint listing (checkpoint_list)"
description: "This scenario validates Checkpoint listing (checkpoint_list) for `EX-016`. It focuses on Recovery asset discovery."
---

# EX-016 -- Checkpoint listing (checkpoint_list)

## 1. OVERVIEW

This scenario validates Checkpoint listing (checkpoint_list) for `EX-016`. It focuses on Recovery asset discovery.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-016` and confirm the expected signals without contradicting evidence.

- Objective: Recovery asset discovery
- Prompt: `As a lifecycle validation operator, validate Checkpoint listing (checkpoint_list) against checkpoint_list(specFolder,limit). Verify available restore points displayed. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Available restore points displayed
- Pass/fail: PASS if checkpoints returned

---

## 3. TEST EXECUTION

### Prompt

```
As a lifecycle validation operator, validate Recovery asset discovery against checkpoint_list(specFolder,limit). Verify available restore points displayed. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. checkpoint_list(specFolder,limit)

### Expected

Available restore points displayed

### Evidence

List output

### Pass / Fail

- **Pass**: checkpoints returned
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Remove spec filter if empty

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [05--lifecycle/02-checkpoint-listing-checkpointlist.md](../../feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: EX-016
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--lifecycle/016-checkpoint-listing-checkpoint-list.md`
- audited_post_018: true
