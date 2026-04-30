---
title: "EX-015 -- Checkpoint creation (checkpoint_create)"
description: "This scenario validates Checkpoint creation (checkpoint_create) for `EX-015`. It focuses on Pre-destructive backup."
---

# EX-015 -- Checkpoint creation (checkpoint_create)

## 1. OVERVIEW

This scenario validates Checkpoint creation (checkpoint_create) for `EX-015`. It focuses on Pre-destructive backup.

---

## 2. SCENARIO CONTRACT


- Objective: Pre-destructive backup.
- Real user request: `Please validate Checkpoint creation (checkpoint_create) against checkpoint_create(name,specFolder) and tell me whether the expected signals are present: New checkpoint listed.`
- RCAF Prompt: `As a lifecycle validation operator, validate Checkpoint creation (checkpoint_create) against checkpoint_create(name,specFolder). Verify new checkpoint listed. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: New checkpoint listed
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if checkpoint discoverable

---

## 3. TEST EXECUTION

### Prompt

```
As a lifecycle validation operator, validate Pre-destructive backup against checkpoint_create(name,specFolder). Verify new checkpoint listed. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. checkpoint_create(name,specFolder)
2. checkpoint_list()

### Expected

New checkpoint listed

### Evidence

Create/list outputs

### Pass / Fail

- **Pass**: checkpoint discoverable
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Validate folder and naming rules

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [05--lifecycle/01-checkpoint-creation-checkpointcreate.md](../../feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: EX-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--lifecycle/015-checkpoint-creation-checkpoint-create.md`
- audited_post_018: true
