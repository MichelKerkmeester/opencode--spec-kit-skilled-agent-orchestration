---
title: "EX-009 -- Tier-based bulk deletion (memory_bulk_delete)"
description: "This scenario validates Tier-based bulk deletion (memory_bulk_delete) for `EX-009`. It focuses on Tier cleanup with safety."
---

# EX-009 -- Tier-based bulk deletion (memory_bulk_delete)

## 1. OVERVIEW

This scenario validates Tier-based bulk deletion (memory_bulk_delete) for `EX-009`. It focuses on Tier cleanup with safety.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-009` and confirm the expected signals without contradicting evidence.

- Objective: Tier cleanup with safety
- Prompt: `Delete temporary tier in scoped folder. Capture the evidence needed to prove Deletion count + checkpoint created. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Scoped deletion count + checkpoint created
- Pass/fail: PASS if scoped deletions in sandbox and checkpoint present

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-009 | Tier-based bulk deletion (memory_bulk_delete) | Tier cleanup with safety | `Delete temporary tier in scoped folder. Capture the evidence needed to prove Deletion count + checkpoint created. Return a concise user-facing pass/fail verdict with the main reason.` | `checkpoint_create(name:"pre-ex009-bulk-delete",specFolder:"<sandbox-spec>")` -> `memory_bulk_delete(tier:"temporary",specFolder:"<sandbox-spec>",confirm:true)` -> `checkpoint_list(specFolder:"<sandbox-spec>")` | Scoped deletion count + checkpoint created | Bulk delete output + checkpoint listing | PASS if scoped deletions in sandbox and checkpoint present | Re-run with explicit scope; restore `pre-ex009-bulk-delete` if needed |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md](../../feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: EX-009
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/009-tier-based-bulk-deletion-memory-bulk-delete.md`
