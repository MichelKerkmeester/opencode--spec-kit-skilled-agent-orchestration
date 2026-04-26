---
title: "EX-007 -- Memory metadata update (memory_update)"
description: "This scenario validates Memory metadata update (memory_update) for `EX-007`. It focuses on Metadata + re-embed update."
audited_post_018: true
phase_018_change: "Metadata update scenario remains live under the post-018 save pipeline"
---

# EX-007 -- Memory metadata update (memory_update)

## 1. OVERVIEW

This scenario validates Memory metadata update (memory_update) for `EX-007`. It focuses on Metadata + re-embed update.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-007` and confirm the expected signals without contradicting evidence.

- Objective: Metadata + re-embed update
- Prompt: `As a mutation validation operator, validate Memory metadata update (memory_update) against memory_update(id,title,triggers). Verify updated metadata reflected in retrieval. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Updated metadata reflected in retrieval
- Pass/fail: PASS if updated title retrievable

---

## 3. TEST EXECUTION

### Prompt

```
As a mutation validation operator, validate Metadata + re-embed update against memory_update(id,title,triggers). Verify updated metadata reflected in retrieval. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_update(id,title,triggers)
2. memory_search(new title)

### Expected

Updated metadata reflected in retrieval

### Evidence

Update output + search

### Pass / Fail

- **Pass**: updated title retrievable
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Retry with allowPartialUpdate if embedding fails

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [02--mutation/02-memory-metadata-update-memoryupdate.md](../../feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: EX-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mutation/007-memory-metadata-update-memory-update.md`
