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

Operators run the exact prompt and command sequence for `085` and confirm the expected signals without contradicting evidence.

- Objective: Confirm atomic wrapper behavior
- Prompt: `As a mutation validation operator, validate Transaction wrappers on mutation handlers against the documented validation surface. Verify mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist
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

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/06-transaction-wrappers-on-mutation-handlers.md](../../feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: 085
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/085-transaction-wrappers-on-mutation-handlers.md`
