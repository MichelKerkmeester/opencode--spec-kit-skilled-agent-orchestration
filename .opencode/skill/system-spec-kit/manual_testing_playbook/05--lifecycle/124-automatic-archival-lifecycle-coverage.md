---
title: "124 -- Automatic archival lifecycle coverage"
description: "This scenario validates Automatic archival lifecycle coverage for `124`. It focuses on Verify archive/unarchive keeps metadata rows while syncing BM25 and vec_memories behavior."
---

# 124 -- Automatic archival lifecycle coverage

## 1. OVERVIEW

This scenario validates Automatic archival lifecycle coverage for `124`. It focuses on Verify archive/unarchive keeps metadata rows while syncing BM25 and vec_memories behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `124` and confirm the expected signals without contradicting evidence.

- Objective: Verify archive/unarchive keeps metadata rows while syncing BM25 and vec_memories behavior
- Prompt: `Validate automatic archival subsystem vector/BM25 parity and protected tier behavior. Capture the evidence needed to prove Archived memory keeps metadata row with is_archived=1, BM25 artifacts are synchronized on archive/unarchive, vector rows are deleted on archive, and unarchive logs deferred vector re-embedding until next index scan; protected tiers are not auto-archived. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Archived memory keeps metadata row with `is_archived=1`, BM25 artifacts are synchronized on archive/unarchive, vector rows are deleted on archive, and unarchive logs deferred vector re-embedding until next index scan; protected tiers are not auto-archived
- Pass/fail: PASS if archive/unarchive parity holds for metadata/BM25, vector deletion occurs on archive, deferred vector rebuild behavior is explicit on unarchive, and protected-tier safeguards hold

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 124 | Automatic archival lifecycle coverage | Verify archive/unarchive keeps metadata rows while syncing BM25 and vec_memories behavior | `Validate automatic archival subsystem vector/BM25 parity and protected tier behavior. Capture the evidence needed to prove Archived memory keeps metadata row with is_archived=1, BM25 artifacts are synchronized on archive/unarchive, vector rows are deleted on archive, and unarchive logs deferred vector re-embedding until next index scan; protected tiers are not auto-archived. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Seed a normal-tier dormant memory and run archival scan 2) Verify `is_archived=1`, BM25 document removed, and vector row removed from `vec_memories` while `memory_index` row remains 3) Unarchive and verify BM25 is restored while vector re-embedding is deferred (no immediate vec row recreation) 4) Seed constitutional/critical memory and confirm archival scan skips protected tiers | Archived memory keeps metadata row with `is_archived=1`, BM25 artifacts are synchronized on archive/unarchive, vector rows are deleted on archive, and unarchive logs deferred vector re-embedding until next index scan; protected tiers are not auto-archived | Archival scan output + DB row checks (`memory_index`, `vec_memories`) + BM25 behavior evidence + unarchive deferred re-embedding log | PASS if archive/unarchive parity holds for metadata/BM25, vector deletion occurs on archive, deferred vector rebuild behavior is explicit on unarchive, and protected-tier safeguards hold | Inspect `archival-manager.ts` sync functions and protected-tier filtering logic |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [05--lifecycle/07-automatic-archival-subsystem.md](../../feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: 124
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--lifecycle/124-automatic-archival-lifecycle-coverage.md`
