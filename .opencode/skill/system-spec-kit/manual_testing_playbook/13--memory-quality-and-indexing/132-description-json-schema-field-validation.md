---
title: "132 -- description.json schema field validation"
description: "This scenario validates description.json schema field validation for `132`. It focuses on Confirm per-folder description metadata matches schema contract."
---

# 132 -- description.json schema field validation

## 1. OVERVIEW

This scenario validates description.json schema field validation for `132`. It focuses on Confirm per-folder description metadata matches schema contract.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `132` and confirm the expected signals without contradicting evidence.

- Objective: Confirm per-folder description metadata matches schema contract
- Prompt: `Validate description.json required fields and types. Capture the evidence needed to prove description.json generated on folder creation with all 9 required fields; field types match contract with strings for specId, folderSlug, specFolder, description, and lastUpdated, arrays of strings for parentChain, memoryNameHistory, and keywords, and number for memorySequence; memorySequence and memoryNameHistory update on save; corrupted fields repaired on regeneration. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: description.json generated on folder creation with all 9 required fields; field types match contract with strings for `specId`, `folderSlug`, `specFolder`, `description`, and `lastUpdated`, arrays of strings for `parentChain`, `memoryNameHistory`, and `keywords`, and number for `memorySequence`; `memorySequence` and `memoryNameHistory` update on save; corrupted fields repaired on regeneration
- Pass/fail: PASS if all 9 fields are present with the exact string / array-of-strings / number matrix, save updates sequence/history, and regeneration repairs corrupted fields

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 132 | description.json schema field validation | Confirm per-folder description metadata matches schema contract | `Validate description.json required fields and types. Capture the evidence needed to prove description.json generated on folder creation with all 9 required fields; field types match contract with strings for specId, folderSlug, specFolder, description, and lastUpdated, arrays of strings for parentChain, memoryNameHistory, and keywords, and number for memorySequence; memorySequence and memoryNameHistory update on save; corrupted fields repaired on regeneration. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create sandbox spec folder via create.sh → verify description.json generated 2) Assert 9 required fields: specId, folderSlug, parentChain, memorySequence, memoryNameHistory, specFolder, description, keywords, lastUpdated 3) Verify the full 9-field type matrix: strings (`specId`, `folderSlug`, `specFolder`, `description`, `lastUpdated`), arrays of strings (`parentChain`, `memoryNameHistory`, `keywords`), number (`memorySequence`) 4) Save memory → verify `memorySequence` and `memoryNameHistory` update 5) Corrupt a field → verify regeneration repairs it | description.json generated on folder creation with all 9 required fields; field types match contract with strings for `specId`, `folderSlug`, `specFolder`, `description`, and `lastUpdated`, arrays of strings for `parentChain`, `memoryNameHistory`, and `keywords`, and number for `memorySequence`; `memorySequence` and `memoryNameHistory` update on save; corrupted fields repaired on regeneration | description.json content showing all required fields + full 9-field type-matrix verification + post-save update evidence + regeneration repair evidence | PASS if all 9 fields are present with the exact string / array-of-strings / number matrix, save updates sequence/history, and regeneration repairs corrupted fields | Verify create.sh generates description.json → Check 9-field schema validation, especially arrays-of-strings enforcement for `parentChain`, `memoryNameHistory`, and `keywords` → Inspect regeneration trigger and repair logic |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 132
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/132-description-json-schema-field-validation.md`
