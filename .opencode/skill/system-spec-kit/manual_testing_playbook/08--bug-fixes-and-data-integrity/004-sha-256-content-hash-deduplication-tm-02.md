---
title: "004 -- SHA-256 content-hash deduplication (TM-02)"
description: "This scenario validates SHA-256 content-hash deduplication (TM-02) for `004`. It focuses on Confirm identical re-save skips embedding."
---

# 004 -- SHA-256 content-hash deduplication (TM-02)

## 1. OVERVIEW

This scenario validates SHA-256 content-hash deduplication (TM-02) for `004`. It focuses on Confirm identical re-save skips embedding.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `004` and confirm the expected signals without contradicting evidence.

- Objective: Confirm identical re-save skips embedding and the save-path SQL stays on exact-match predicates
- Prompt: `Check SHA-256 dedup (TM-02) on re-save. Capture the evidence needed to prove Second save returns skip/no-op status; no new embedding row created; content hash matches; and the save-path/content-hash queries use exact-match scope clauses rather than nullable OR predicates. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Second save returns skip/no-op status; no new embedding row created; content hash matches; SQL shape contains direct `canonical_file_path = ?` / `file_path = ?` probes and exact scope clauses such as `tenant_id = ?` or `user_id IS NULL`
- Pass/fail: PASS: Re-save skips embedding, reports duplicate, and emits exact-match SQL without nullable OR scope predicates; FAIL: Duplicate embedding created, hash mismatch, or SQL still depends on nullable OR predicates

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 004 | SHA-256 content-hash deduplication (TM-02) | Confirm identical re-save skips embedding | `Check SHA-256 dedup (TM-02) on re-save. Capture the evidence needed to prove Second save returns skip/no-op status; no new embedding row created; content hash matches; and the save-path/content-hash queries use exact-match scope clauses rather than nullable OR predicates. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Save once 2) Save identical payload 3) Verify embedding skipped 4) Capture SQL-shape evidence for the unchanged-save and content-hash probes | Second save returns skip/no-op status; no new embedding row created; content hash matches; SQL shape contains direct `canonical_file_path = ?` / `file_path = ?` probes and exact scope clauses such as `tenant_id = ?` or `user_id IS NULL` | Save output for both calls + DB query showing single embedding row + SQL/test evidence showing no `(canonical_file_path = ? OR file_path = ?)` and no `? IS NULL` predicates | PASS: Re-save skips embedding, reports duplicate, and emits exact-match SQL without nullable OR scope predicates; FAIL: Duplicate embedding created, hash mismatch, or SQL still depends on nullable OR predicates | Verify SHA-256 hash computation → Check content normalization before hashing → Inspect dedup lookup query shape (`T320-1`, `T320-2`) |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md](../../feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 004
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--bug-fixes-and-data-integrity/004-sha-256-content-hash-deduplication-tm-02.md`
