---
title: "115 -- Transaction atomicity on rename failure (P0-5)"
description: "This scenario validates Transaction atomicity on rename failure (P0-5) for `115`. It focuses on Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup."
---

# 115 -- Transaction atomicity on rename failure (P0-5)

## 1. OVERVIEW

This scenario validates Transaction atomicity on rename failure (P0-5) for `115`. It focuses on Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `115` and confirm the expected signals without contradicting evidence.

- Objective: Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup
- Prompt: `"Simulate rename failure after DB commit and verify pending file survives". Capture the evidence needed to prove Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file
- Pass/fail: PASS if pending file survives rename failure and recovery function can find and process it

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 115 | Transaction atomicity on rename failure (P0-5) | Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup | `"Simulate rename failure after DB commit and verify pending file survives". Capture the evidence needed to prove Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** Read transaction-manager.ts to understand pendingPath logic. 1) Trigger `executeAtomicSave()` with a path that will cause rename to fail (e.g., read-only target directory) 2) Verify the function returns `{ success: false, dbCommitted: true }` 3) Verify the pending file still exists on disk (not deleted) 4) Verify `recoverAllPendingFiles()` can find and recover the pending file | Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file | Function return value + pending file existence check + recovery function output | PASS if pending file survives rename failure and recovery function can find and process it | Inspect executeAtomicSave error handling for rename failures; verify pending file cleanup is skipped when dbCommitted=true; check recoverAllPendingFiles scan logic |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/21-atomic-pending-file-recovery.md](../../feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 115
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/115-transaction-atomicity-on-rename-failure-p0-5.md`
