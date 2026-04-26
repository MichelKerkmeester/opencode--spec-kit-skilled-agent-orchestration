---
title: "065 -- Database and schema safety"
description: "This scenario validates Database and schema safety for `065`. It focuses on Confirm Sprint 8 DB safety bundle."
audited_post_018: true
---

# 065 -- Database and schema safety

## 1. OVERVIEW

This scenario validates Database and schema safety for `065`. It focuses on Confirm Sprint 8 DB safety bundle.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `065` and confirm the expected signals without contradicting evidence.

- Objective: Confirm Sprint 8 DB safety bundle
- Prompt: `As a data-integrity validation operator, validate Database and schema safety against the documented validation surface. Verify mutations complete atomically; no partial SQL corruption; schema constraints enforced; rollback on failure. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Mutations complete atomically; no partial SQL corruption; schema constraints enforced; rollback on failure
- Pass/fail: PASS if all mutation paths complete atomically with no partial corruption and schema constraints hold

---

## 3. TEST EXECUTION

### Prompt

```
As a data-integrity validation operator, confirm Sprint 8 DB safety bundle against the documented validation surface. Verify mutations complete atomically; no partial SQL corruption; schema constraints enforced; rollback on failure. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. run affected mutation paths
2. inspect SQL outcomes
3. confirm no partial corruption

### Expected

Mutations complete atomically; no partial SQL corruption; schema constraints enforced; rollback on failure

### Evidence

Mutation output + SQL inspection results + schema constraint verification

### Pass / Fail

- **Pass**: all mutation paths complete atomically with no partial corruption and schema constraints hold
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect transaction wrappers; verify schema migration state; check for incomplete writes in DB

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md](../../feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 065
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--bug-fixes-and-data-integrity/065-database-and-schema-safety.md`
