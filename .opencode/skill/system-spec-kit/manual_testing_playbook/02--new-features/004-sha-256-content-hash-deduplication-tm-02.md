---
title: "NEW-004 -- SHA-256 content-hash deduplication (TM-02)"
description: "This scenario validates SHA-256 content-hash deduplication (TM-02) for `NEW-004`. It focuses on Confirm identical re-save skips embedding."
---

# NEW-004 -- SHA-256 content-hash deduplication (TM-02)

## 1. OVERVIEW

This scenario validates SHA-256 content-hash deduplication (TM-02) for `NEW-004`. It focuses on Confirm identical re-save skips embedding.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-004` and confirm the expected signals without contradicting evidence.

- Objective: Confirm identical re-save skips embedding
- Prompt: `Check SHA-256 dedup (TM-02) on re-save.`
- Expected signals: Second save returns skip/no-op status; no new embedding row created; content hash matches
- Pass/fail: PASS: Re-save skips embedding and reports duplicate; FAIL: Duplicate embedding created or hash mismatch

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-004 | SHA-256 content-hash deduplication (TM-02) | Confirm identical re-save skips embedding | `Check SHA-256 dedup (TM-02) on re-save.` | 1) Save once 2) Save identical payload 3) Verify embedding skipped | Second save returns skip/no-op status; no new embedding row created; content hash matches | Save output for both calls + DB query showing single embedding row | PASS: Re-save skips embedding and reports duplicate; FAIL: Duplicate embedding created or hash mismatch | Verify SHA-256 hash computation → Check content normalization before hashing → Inspect dedup lookup query |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md](../../feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/004-sha-256-content-hash-deduplication-tm-02.md`
