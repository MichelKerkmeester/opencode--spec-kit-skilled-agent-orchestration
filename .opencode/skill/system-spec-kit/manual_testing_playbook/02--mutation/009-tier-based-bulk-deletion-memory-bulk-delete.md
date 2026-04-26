---
title: "EX-009 -- Tier-based bulk deletion (memory_bulk_delete)"
description: "This scenario validates Tier-based bulk deletion (memory_bulk_delete) for `EX-009`. It focuses on Tier cleanup with safety."
audited_post_018: true
phase_018_change: "Tier bulk delete scenario remains live with post-018 audit coverage"
---

# EX-009 -- Tier-based bulk deletion (memory_bulk_delete)

## 1. OVERVIEW

This scenario validates Tier-based bulk deletion (memory_bulk_delete) for `EX-009`. It focuses on Tier cleanup with safety.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-009` and confirm the expected signals without contradicting evidence.

- Objective: Tier cleanup with safety
- Prompt: `As a mutation validation operator, validate Tier-based bulk deletion (memory_bulk_delete) against checkpoint_create(name:"pre-ex009-bulk-delete",specFolder:"<sandbox-spec>"). Verify scoped deletion count + checkpoint created. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Scoped deletion count + checkpoint created
- Pass/fail: PASS if scoped deletions in sandbox and checkpoint present

---

## 3. TEST EXECUTION

### Prompt

```
As a mutation validation operator, validate Tier cleanup with safety against checkpoint_create(name:"pre-ex009-bulk-delete",specFolder:"<sandbox-spec>"). Verify scoped deletion count + checkpoint created. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. checkpoint_create(name:"pre-ex009-bulk-delete",specFolder:"<sandbox-spec>")
2. memory_bulk_delete(tier:"temporary",specFolder:"<sandbox-spec>",confirm:true)
3. checkpoint_list(specFolder:"<sandbox-spec>")

### Expected

Scoped deletion count + checkpoint created

### Evidence

Bulk delete output + checkpoint listing

### Pass / Fail

- **Pass**: scoped deletions in sandbox and checkpoint present
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Re-run with explicit scope; restore `pre-ex009-bulk-delete` if needed

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md](../../feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: EX-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mutation/009-tier-based-bulk-deletion-memory-bulk-delete.md`
