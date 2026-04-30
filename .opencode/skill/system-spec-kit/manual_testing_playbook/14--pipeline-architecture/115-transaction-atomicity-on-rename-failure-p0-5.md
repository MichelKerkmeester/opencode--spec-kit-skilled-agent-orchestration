---
title: "115 -- Transaction atomicity on rename failure (P0-5)"
description: "This scenario validates Transaction atomicity on rename failure (P0-5) for `115`. It focuses on Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup."
audited_post_018: true
---

# 115 -- Transaction atomicity on rename failure (P0-5)

## 1. OVERVIEW

This scenario validates Transaction atomicity on rename failure (P0-5) for `115`. It focuses on Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup.
- Real user request: `Please validate Transaction atomicity on rename failure (P0-5) against executeAtomicSave() and tell me whether the expected signals are present: Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file.`
- RCAF Prompt: `As a pipeline validation operator, validate Transaction atomicity on rename failure (P0-5) against executeAtomicSave(). Verify pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if pending file survives rename failure and recovery function can find and process it

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline validation operator, verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup against executeAtomicSave(). Verify rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. **Precondition:** Read transaction-manager.ts to understand pendingPath logic.
2. Trigger `executeAtomicSave()` with a path that will cause rename to fail (e.g., read-only target directory)
3. Verify the function returns `{ success: false, dbCommitted: true }`
4. Verify the pending file still exists on disk (not deleted)
5. Verify `recoverAllPendingFiles()` can find and recover the pending file

### Expected

Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file

### Evidence

Function return value + pending file existence check + recovery function output

### Pass / Fail

- **Pass**: pending file survives rename failure and recovery function can find and process it
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect executeAtomicSave error handling for rename failures; verify pending file cleanup is skipped when dbCommitted=true; check recoverAllPendingFiles scan logic

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/21-atomic-pending-file-recovery.md](../../feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 115
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/115-transaction-atomicity-on-rename-failure-p0-5.md`
