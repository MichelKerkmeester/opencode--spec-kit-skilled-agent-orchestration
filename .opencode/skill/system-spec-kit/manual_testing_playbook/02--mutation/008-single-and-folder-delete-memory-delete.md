---
title: "EX-008 -- Single and folder delete (memory_delete)"
description: "This scenario validates Single and folder delete (memory_delete) for `EX-008`. It focuses on Atomic single delete."
audited_post_018: true
phase_018_change: "Delete scenario remains live with post-018 audit coverage"
---

# EX-008 -- Single and folder delete (memory_delete)

## 1. OVERVIEW

This scenario validates Single and folder delete (memory_delete) for `EX-008`. It focuses on Atomic single delete.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-008` and confirm the expected signals without contradicting evidence.

- Objective: Atomic single delete
- Prompt: `As a mutation validation operator, validate Single and folder delete (memory_delete) against checkpoint_create(name:"pre-ex008-delete",specFolder:"<sandbox-spec>"). Verify deleted item absent from retrieval. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Deleted item absent from retrieval
- Pass/fail: PASS if deleted item not found and checkpoint exists

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-008 | Single and folder delete (memory_delete) | Atomic single delete | `As a mutation validation operator, validate Atomic single delete against checkpoint_create(name:"pre-ex008-delete",specFolder:"<sandbox-spec>"). Verify deleted item absent from retrieval. Return a concise pass/fail verdict with the main reason and cited evidence.` | `checkpoint_create(name:"pre-ex008-delete",specFolder:"<sandbox-spec>")` -> `memory_delete(id)` -> `memory_search(old title)` | Deleted item absent from retrieval | Delete output + search | PASS if deleted item not found and checkpoint exists | Restore `pre-ex008-delete`; verify sandbox folder |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/03-single-and-folder-delete-memorydelete.md](../../feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: EX-008
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/008-single-and-folder-delete-memory-delete.md`
