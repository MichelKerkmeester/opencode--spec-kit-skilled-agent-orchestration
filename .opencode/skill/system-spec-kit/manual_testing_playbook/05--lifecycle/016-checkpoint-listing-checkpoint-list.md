---
title: "EX-016 -- Checkpoint listing (checkpoint_list)"
description: "This scenario validates Checkpoint listing (checkpoint_list) for `EX-016`. It focuses on Recovery asset discovery."
---

# EX-016 -- Checkpoint listing (checkpoint_list)

## 1. OVERVIEW

This scenario validates Checkpoint listing (checkpoint_list) for `EX-016`. It focuses on Recovery asset discovery.

---

## 2. SCENARIO CONTRACT


- Objective: Recovery asset discovery.
- Real user request: `Please validate Checkpoint listing (checkpoint_list) against checkpoint_list(specFolder,limit) and tell me whether the expected signals are present: Available restore points displayed.`
- RCAF Prompt: `As a lifecycle validation operator, validate Checkpoint listing (checkpoint_list) against checkpoint_list(specFolder,limit). Verify available restore points displayed. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Available restore points displayed
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
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

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [05--lifecycle/02-checkpoint-listing-checkpointlist.md](../../feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: EX-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--lifecycle/016-checkpoint-listing-checkpoint-list.md`
- audited_post_018: true
