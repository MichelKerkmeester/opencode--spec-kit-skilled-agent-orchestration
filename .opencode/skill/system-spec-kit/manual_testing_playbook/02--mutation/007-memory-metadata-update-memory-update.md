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


- Objective: Metadata + re-embed update.
- Real user request: `Please validate Memory metadata update (memory_update) against memory_update(id,title,triggers) and tell me whether the expected signals are present: Updated metadata reflected in retrieval.`
- RCAF Prompt: `As a mutation validation operator, validate Memory metadata update (memory_update) against memory_update(id,title,triggers). Verify updated metadata reflected in retrieval. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Updated metadata reflected in retrieval
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
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

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [02--mutation/02-memory-metadata-update-memoryupdate.md](../../feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: EX-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mutation/007-memory-metadata-update-memory-update.md`
