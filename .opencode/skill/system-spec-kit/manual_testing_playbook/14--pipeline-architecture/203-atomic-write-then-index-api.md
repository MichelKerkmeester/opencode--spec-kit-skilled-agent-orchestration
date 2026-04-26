---
title: "203 -- Atomic write-then-index API"
description: "This scenario validates Atomic write-then-index API for `203`. It focuses on verifying that the handler writes to a pending path, indexes before promotion, retries transient indexing once, and only renames into place after success."
audited_post_018: true
---

# 203 -- Atomic write-then-index API

## 1. OVERVIEW

This scenario validates Atomic write-then-index API for `203`. It focuses on verifying that the handler writes to a pending path, indexes before promotion, retries transient indexing once, and only renames into place after success.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `203` and confirm the expected signals without contradicting evidence.

- Objective: Verify the save flow enforces pending write -> index attempt(s) -> final rename ordering with rollback before promotion on failure
- Prompt: `As a pipeline validation operator, validate Atomic write-then-index API against the documented validation surface. Verify the save flow enforces pending write -> index attempt(s) -> final rename ordering with rollback before promotion on failure. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Unique pending path is created before promotion; indexing runs before final rename; transient indexing failure gets one retry; successful flow ends with pending-file rename into place; validation/index failure cleans up the pending file and leaves the original target untouched
- Pass/fail: PASS if the handler enforces write/index/rename ordering with cleanup on failure; FAIL if files are promoted before indexing, retries do not occur as documented, or failed saves leave promoted/partial artifacts behind

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline validation operator, verify the save flow enforces pending write -> index attempt(s) -> final rename ordering with rollback before promotion on failure against the documented validation surface. Verify unique pending path is created before promotion; indexing runs before final rename; transient indexing failure gets one retry; successful flow ends with pending-file rename into place; validation/index failure cleans up the pending file and leaves the original target untouched. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Trigger a normal save and capture the pending-file path creation before the final file exists
2. Observe that indexing is attempted against the target path before promotion
3. Induce one transient indexing failure and confirm a single retry occurs before success
4. Verify the file is renamed into place only after the successful indexing attempt
5. Run a failing validation or permanent indexing failure case and confirm the pending file is cleaned up with no promoted final artifact

### Expected

Unique pending path is created before promotion; indexing runs before final rename; transient indexing failure gets one retry; successful flow ends with pending-file rename into place; validation/index failure cleans up the pending file and leaves the original target untouched

### Evidence

Save transcript + pending-file path evidence + retry evidence + before/after filesystem state for success and failure cases

### Pass / Fail

- **Pass**: the handler enforces write/index/rename ordering with cleanup on failure
- **Fail**: files are promoted before indexing, retries do not occur as documented, or failed saves leave promoted/partial artifacts behind

### Failure Triage

Inspect `memory-save.ts` ordering and retry path; verify pending-path generation/cleanup helpers in `transaction-manager.ts`; confirm tool schema and save handler inputs do not bypass the guarded flow

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/18-atomic-write-then-index-api.md](../../feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 203
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/203-atomic-write-then-index-api.md`
