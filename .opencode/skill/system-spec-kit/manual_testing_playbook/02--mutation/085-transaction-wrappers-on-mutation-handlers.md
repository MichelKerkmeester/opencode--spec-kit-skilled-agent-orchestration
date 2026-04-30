---
title: "085 -- Transaction wrappers on mutation handlers"
description: "This scenario validates Transaction wrappers on mutation handlers for `085`. It focuses on Confirm atomic wrapper behavior."
audited_post_018: true
phase_018_change: "Transaction wrapper scenario remains live with the post-018 atomic save commit path"
---

# 085 -- Transaction wrappers on mutation handlers

## 1. OVERVIEW

This scenario validates Transaction wrappers on mutation handlers for `085`. It focuses on Confirm atomic wrapper behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm atomic wrapper behavior.
- Real user request: `Please validate Transaction wrappers on mutation handlers against the documented validation surface and tell me whether the expected signals are present: Mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist.`
- RCAF Prompt: `As a mutation validation operator, validate Transaction wrappers on mutation handlers against the documented validation surface. Verify mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if injected faults trigger complete rollback and DB state is fully consistent after recovery

---

## 3. TEST EXECUTION

### Prompt

```
As a mutation validation operator, confirm atomic wrapper behavior against the documented validation surface. Verify mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. inject mid-step fault
2. verify rollback
3. confirm consistent state

### Expected

Mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist

### Evidence

Fault injection output + rollback trace + post-rollback DB state verification

### Pass / Fail

- **Pass**: injected faults trigger complete rollback and DB state is fully consistent after recovery
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect transaction wrapper implementation; verify rollback cleans up all partial writes; check for nested transaction handling

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [02--mutation/06-transaction-wrappers-on-mutation-handlers.md](../../feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: 085
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mutation/085-transaction-wrappers-on-mutation-handlers.md`
