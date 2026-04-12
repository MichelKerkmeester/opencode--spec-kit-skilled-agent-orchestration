---
title: "002 -- Chunk collapse deduplication (G3)"
description: "This scenario validates Chunk collapse deduplication (G3) for `002`. It focuses on Confirm dedup in default mode."
audited_post_018: true
---

# 002 -- Chunk collapse deduplication (G3)

## 1. OVERVIEW

This scenario validates Chunk collapse deduplication (G3) for `002`. It focuses on Confirm dedup in default mode.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `002` and confirm the expected signals without contradicting evidence.

- Objective: Confirm dedup in default mode
- Prompt: `As a data-integrity validation operator, validate Chunk collapse deduplication (G3) against memory_search(includeContent:false). Verify no duplicate memory IDs in results; collapsed chunks yield unique parents only. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: No duplicate memory IDs in results; collapsed chunks yield unique parents only
- Pass/fail: PASS: Zero duplicate parent IDs in collapsed results; FAIL: Same parent ID appears >1 time in output

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 002 | Chunk collapse deduplication (G3) | Confirm dedup in default mode | `As a data-integrity validation operator, confirm dedup in default mode against memory_search(includeContent:false). Verify no duplicate memory IDs in results; collapsed chunks yield unique parents only. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) Save multi-chunk overlap 2) `memory_search(includeContent:false)` 3) Verify no duplicates | No duplicate memory IDs in results; collapsed chunks yield unique parents only | Search output with result IDs + dedup count before/after collapse | PASS: Zero duplicate parent IDs in collapsed results; FAIL: Same parent ID appears >1 time in output | Check chunk parentId linkage → Verify dedup runs after collapse stage → Inspect includeContent flag behavior |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md](../../feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--bug-fixes-and-data-integrity/002-chunk-collapse-deduplication-g3.md`
