---
title: "132 -- description.json schema field validation"
description: "This scenario validates description.json schema field validation for `132`. It focuses on Confirm per-folder description metadata matches schema contract."
audited_post_018: true
---

# 132 -- description.json schema field validation

## 1. OVERVIEW

This scenario validates description.json schema field validation for `132`. It focuses on Confirm per-folder description metadata matches schema contract.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm per-folder description metadata matches schema contract.
- Real user request: `` Please validate description.json schema field validation against specId and tell me whether the expected signals are present: description.json generated on folder creation with all 9 required fields; field types match contract with strings for `specId`, `folderSlug`, `specFolder`, `description`, and `lastUpdated`, arrays of strings for `parentChain`, `memoryNameHistory`, and `keywords`, and number for `memorySequence`; `memorySequence` and `memoryNameHistory` update on save; corrupted fields repaired on regeneration. ``
- RCAF Prompt: `As a spec-doc record-quality validation operator, validate description.json schema field validation against specId. Verify description.json generated on folder creation with all 9 required fields; field types match contract with strings for specId, folderSlug, specFolder, description, and lastUpdated, arrays of strings for parentChain, memoryNameHistory, and keywords, and number for memorySequence; memorySequence and memoryNameHistory update on save; corrupted fields repaired on regeneration. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: description.json generated on folder creation with all 9 required fields; field types match contract with strings for `specId`, `folderSlug`, `specFolder`, `description`, and `lastUpdated`, arrays of strings for `parentChain`, `memoryNameHistory`, and `keywords`, and number for `memorySequence`; `memorySequence` and `memoryNameHistory` update on save; corrupted fields repaired on regeneration
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all 9 fields are present with the exact string / array-of-strings / number matrix, save updates sequence/history, and regeneration repairs corrupted fields

---

## 3. TEST EXECUTION

### Prompt

```
As a spec-doc record-quality validation operator, confirm per-folder description metadata matches schema contract against specId. Verify description.json generated on folder creation with all 9 required fields; field types match contract with strings for specId, folderSlug, specFolder, description, and lastUpdated, arrays of strings for parentChain, memoryNameHistory, and keywords, and number for memorySequence; memorySequence and memoryNameHistory update on save; corrupted fields repaired on regeneration. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Create sandbox spec folder via create.sh → verify description.json generated
2. Assert 9 required fields: specId, folderSlug, parentChain, memorySequence, memoryNameHistory, specFolder, description, keywords, lastUpdated
3. Verify the full 9-field type matrix: strings (`specId`, `folderSlug`, `specFolder`, `description`, `lastUpdated`), arrays of strings (`parentChain`, `memoryNameHistory`, `keywords`), number (`memorySequence`)
4. Save memory → verify `memorySequence` and `memoryNameHistory` update
5. Corrupt a field → verify regeneration repairs it

### Expected

description.json generated on folder creation with all 9 required fields; field types match contract with strings for `specId`, `folderSlug`, `specFolder`, `description`, and `lastUpdated`, arrays of strings for `parentChain`, `memoryNameHistory`, and `keywords`, and number for `memorySequence`; `memorySequence` and `memoryNameHistory` update on save; corrupted fields repaired on regeneration

### Evidence

description.json content showing all required fields + full 9-field type-matrix verification + post-save update evidence + regeneration repair evidence

### Pass / Fail

- **Pass**: all 9 fields are present with the exact string / array-of-strings / number matrix, save updates sequence/history, and regeneration repairs corrupted fields
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify create.sh generates description.json → Check 9-field schema validation, especially arrays-of-strings enforcement for `parentChain`, `memoryNameHistory`, and `keywords` → Inspect regeneration trigger and repair logic

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 132
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/132-description-json-schema-field-validation.md`
