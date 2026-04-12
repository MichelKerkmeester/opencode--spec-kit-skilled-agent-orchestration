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
- Prompt: `As a lifecycle validation operator, validate Checkpoint deletion (checkpoint_delete) against checkpoint_list(specFolder:"<sandbox-spec>"). Verify removed checkpoint absent from list. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Removed checkpoint absent from list
- Pass/fail: PASS if checkpoint removed from sandbox list

---

## 3. TEST EXECUTION

### Prompt

```
As a lifecycle validation operator, validate Old snapshot cleanup against checkpoint_list(specFolder:"<sandbox-spec>"). Verify removed checkpoint absent from list. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. checkpoint_list(specFolder:"<sandbox-spec>")
2. checkpoint_delete(name:"<checkpoint-name>",confirmName:"<checkpoint-name>")
3. checkpoint_list(specFolder:"<sandbox-spec>")

### Expected

Removed checkpoint absent from list

### Evidence

Before/after list outputs

### Pass / Fail

- **Pass**: checkpoint removed from sandbox list
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Validate name, `confirmName`, and sandbox scope; retry

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [05--lifecycle/04-checkpoint-deletion-checkpointdelete.md](../../feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: EX-018
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--lifecycle/018-checkpoint-deletion-checkpoint-delete.md`
- audited_post_018: true
