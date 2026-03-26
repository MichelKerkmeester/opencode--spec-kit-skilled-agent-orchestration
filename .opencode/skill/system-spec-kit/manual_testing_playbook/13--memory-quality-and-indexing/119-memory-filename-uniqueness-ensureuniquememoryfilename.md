---
title: "119 -- Memory filename uniqueness (ensureUniqueMemoryFilename)"
description: "This scenario validates Memory filename uniqueness (ensureUniqueMemoryFilename) for `119`. It focuses on Confirm collision resolution."
---

# 119 -- Memory filename uniqueness (ensureUniqueMemoryFilename)

## 1. OVERVIEW

This scenario validates Memory filename uniqueness (ensureUniqueMemoryFilename) for `119`. It focuses on Confirm collision resolution.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `119` and confirm the expected signals without contradicting evidence.

- Objective: Confirm collision resolution
- Prompt: `Validate memory filename collision prevention. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: 
- Pass/fail: Second save produces filename with -1 suffix; both files exist with distinct names; exhausting `-1` through `-100` collisions triggers a random 12-hex fallback suffix from `crypto.randomBytes(6).toString('hex')`, not SHA1; repeated fallback saves still reserve distinct filenames; `memorySequence` increments through the hardened `Number(existing.memorySequence)

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 119 | Memory filename uniqueness (ensureUniqueMemoryFilename) | Confirm collision resolution | `Validate memory filename collision prevention. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Save memory to a folder 2) Save again with same slug within same minute 3) Verify two distinct filenames (second has -1 suffix) 4) Exhaust `-1` through `-100` collisions and save again 5) Persist the first random fallback filename, repeat the save, and verify a second distinct random fallback is reserved 6) Verify fallback filename uses `crypto.randomBytes(6).toString('hex')` suffix shape, not SHA1 7) Verify `description.json` increments `memorySequence` via `Number(existing.memorySequence) |  | 0` before incrementing 8) Verify `memoryNameHistory` updated | Second save produces filename with -1 suffix; both files exist with distinct names; exhausting `-1` through `-100` collisions triggers a random 12-hex fallback suffix from `crypto.randomBytes(6).toString('hex')`, not SHA1; repeated fallback saves still reserve distinct filenames; `memorySequence` increments through the hardened `Number(existing.memorySequence) |  |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/04-spec-folder-description-discovery.md](../../feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 119
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/119-memory-filename-uniqueness-ensureuniquememoryfilename.md`
