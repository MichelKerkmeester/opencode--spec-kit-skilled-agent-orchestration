---
title: "EX-006 -- Memory indexing (memory_save)"
description: "This scenario validates Memory indexing (memory_save) for `EX-006`. It focuses on New spec-doc record ingestion."
audited_post_018: true
phase_018_replaces: "legacy memory-file ingestion scenario with spec-doc anchored continuity save validation"
---

# EX-006 -- Memory indexing (memory_save)

## 1. OVERVIEW

This scenario validates Memory indexing (memory_save) for `EX-006`. It focuses on the live 8-category canonical save router and spec-doc anchored continuity writes.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-006` and confirm the expected signals without contradicting evidence. The scenario now expects the live canonical router to pick the right merge target, keep drop content out of packet docs, still produce searchable output for merged saves, and refresh packet metadata on every successful canonical save.

- Objective: 8-category canonical save routing with safe merge or refusal plus metadata refresh on every successful save
- Prompt: `As a mutation validation operator, validate Memory indexing (memory_save) against memory_save(filePath). Verify the 8-category content router chooses the correct target or safe refusal; spec-doc continuity updates when the route merges; description.json and graph-metadata.json refresh on every successful canonical save; searchable result appears for merged saves; and no template-contract or insufficiency rejection appears. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Save action reported; correct route category or safe refusal reported; spec-doc continuity updated for merged saves; description.json and graph-metadata.json refreshed; searchable result appears; no template-contract or insufficiency rejection
- Pass/fail: PASS if the document is indexed and retrievable when merged, or safely refused when it should drop, packet metadata refreshes on the successful save path, and the save does not report `INSUFFICIENT_CONTEXT_ABORT` or template-contract failure

---

## 3. TEST EXECUTION

### Prompt

```
As a mutation validation operator, validate the live 8-category canonical save router against memory_save(filePath). Verify the route category and target are correct or safely refused; spec-doc continuity updates when the route merges; description.json and graph-metadata.json refresh on every successful canonical save; searchable result appears for merged saves; and no template-contract or insufficiency rejection appears. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_save(filePath)
2. Inspect the returned route category and target
3. Read `description.json` and `graph-metadata.json` for the target packet
4. memory_stats()
5. memory_search(title)

### Expected

Save action reported; correct route category or safe refusal reported; spec-doc continuity updated for merged saves; description.json and graph-metadata.json refreshed; searchable result appears; no template-contract or insufficiency rejection

### Evidence

Save output including route category plus packet metadata timestamps and follow-up search

### Pass / Fail

- **Pass**: the document is indexed and retrievable when merged, or safely refused when it should drop, packet metadata refreshes on the successful save path, and the save does not report `INSUFFICIENT_CONTEXT_ABORT` or template-contract failure
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Validate file path/type, rendered anchor/frontmatter shape, and content quality

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/01-memory-indexing-memorysave.md](../../feature_catalog/02--mutation/01-memory-indexing-memorysave.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: EX-006
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/006-memory-indexing-memory-save.md`
