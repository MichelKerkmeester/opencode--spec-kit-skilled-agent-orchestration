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
- Prompt: `Delete deprecated tier in scoped folder`
- Expected signals: Deletion count + checkpoint created
- Pass/fail: PASS if scoped deletions in sandbox and checkpoint present

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-009 | Tier-based bulk deletion (memory_bulk_delete) | Tier cleanup with safety | `Delete deprecated tier in scoped folder` | `checkpoint_create(name:"pre-ex009-bulk-delete",specFolder:"<sandbox-spec>")` -> `memory_bulk_delete(tier,specFolder:"<sandbox-spec>")` -> `checkpoint_list(specFolder:"<sandbox-spec>")` | Deletion count + checkpoint created | Bulk delete output | PASS if scoped deletions in sandbox and checkpoint present | Re-run with explicit scope; restore `pre-ex009-bulk-delete` if needed |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md](../../feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md)

---

## 5. SOURCE METADATA

- Group: Existing Features
- Playbook ID: EX-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--existing-features/009-tier-based-bulk-deletion-memory-bulk-delete.md`
