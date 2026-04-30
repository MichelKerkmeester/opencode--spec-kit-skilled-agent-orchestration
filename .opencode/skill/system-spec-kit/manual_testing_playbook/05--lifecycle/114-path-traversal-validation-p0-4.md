---
title: "114 -- Path traversal validation (P0-4)"
description: "This scenario validates Path traversal validation (P0-4) for `114`. It focuses on Verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments."
---

# 114 -- Path traversal validation (P0-4)

## 1. OVERVIEW

This scenario validates Path traversal validation (P0-4) for `114`. It focuses on Verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments.

---

## 2. SCENARIO CONTRACT


- Objective: Verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments.
- Real user request: `Please validate Path traversal validation (P0-4) against memory_ingest_start({ paths: ["../../etc/passwd"] }) and tell me whether the expected signals are present: Traversal paths (../) rejected with E_VALIDATION error; absolute paths outside allowed base rejected; valid paths within allowed directories accepted and job created.`
- RCAF Prompt: `As a lifecycle validation operator, validate Path traversal validation (P0-4) against memory_ingest_start({ paths: ["../../etc/passwd"] }). Verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Traversal paths (../) rejected with E_VALIDATION error; absolute paths outside allowed base rejected; valid paths within allowed directories accepted and job created
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if traversal and out-of-base paths are rejected with E_VALIDATION and valid paths create jobs successfully

---

## 3. TEST EXECUTION

### Prompt

```
As a lifecycle validation operator, verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments against memory_ingest_start({ paths: ["../../etc/passwd"] }). Verify traversal paths (../) rejected with E_VALIDATION error; absolute paths outside allowed base rejected; valid paths within allowed directories accepted and job created. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. **Precondition:** sandbox spec folder with test files.
2. Call `memory_ingest_start({ paths: ["../../etc/passwd"] })`
3. Expect E_VALIDATION error with clear rejection message
4. Call `memory_ingest_start({ paths: ["/tmp/outside-base/file.md"] })`
5. Expect E_VALIDATION error for path outside allowed base
6. Call `memory_ingest_start({ paths: ["specs/test-sandbox/valid.md"] })`
7. Expect success (job created)

### Expected

Traversal paths (../) rejected with E_VALIDATION error; absolute paths outside allowed base rejected; valid paths within allowed directories accepted and job created

### Evidence

Rejection error messages for invalid paths + successful job creation for valid path

### Pass / Fail

- **Pass**: traversal and out-of-base paths are rejected with E_VALIDATION and valid paths create jobs successfully
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect path validation logic in ingest handler; verify allowed base directory configuration; check for bypass via URL-encoded or symlinked paths

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [05--lifecycle/05-async-ingestion-job-lifecycle.md](../../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: 114
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--lifecycle/114-path-traversal-validation-p0-4.md`
- audited_post_018: true
