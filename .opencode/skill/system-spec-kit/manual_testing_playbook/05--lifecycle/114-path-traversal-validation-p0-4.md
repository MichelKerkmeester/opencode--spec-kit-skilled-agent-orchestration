---
title: "114 -- Path traversal validation (P0-4)"
description: "This scenario validates Path traversal validation (P0-4) for `114`. It focuses on Verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments."
---

# 114 -- Path traversal validation (P0-4)

## 1. OVERVIEW

This scenario validates Path traversal validation (P0-4) for `114`. It focuses on Verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `114` and confirm the expected signals without contradicting evidence.

- Objective: Verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments
- Prompt: `"Ingest a file using a path with ../ segments and verify rejection". Capture the evidence needed to prove Traversal paths (../) rejected with E_VALIDATION error; absolute paths outside allowed base rejected; valid paths within allowed directories accepted and job created. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Traversal paths (../) rejected with E_VALIDATION error; absolute paths outside allowed base rejected; valid paths within allowed directories accepted and job created
- Pass/fail: PASS if traversal and out-of-base paths are rejected with E_VALIDATION and valid paths create jobs successfully

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 114 | Path traversal validation (P0-4) | Verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments | `"Ingest a file using a path with ../ segments and verify rejection". Capture the evidence needed to prove Traversal paths (../) rejected with E_VALIDATION error; absolute paths outside allowed base rejected; valid paths within allowed directories accepted and job created. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** sandbox spec folder with test files. 1) Call `memory_ingest_start({ paths: ["../../etc/passwd"] })` 2) Expect E_VALIDATION error with clear rejection message 3) Call `memory_ingest_start({ paths: ["/tmp/outside-base/file.md"] })` 4) Expect E_VALIDATION error for path outside allowed base 5) Call `memory_ingest_start({ paths: ["specs/test-sandbox/valid.md"] })` 6) Expect success (job created) | Traversal paths (../) rejected with E_VALIDATION error; absolute paths outside allowed base rejected; valid paths within allowed directories accepted and job created | Rejection error messages for invalid paths + successful job creation for valid path | PASS if traversal and out-of-base paths are rejected with E_VALIDATION and valid paths create jobs successfully | Inspect path validation logic in ingest handler; verify allowed base directory configuration; check for bypass via URL-encoded or symlinked paths |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [05--lifecycle/05-async-ingestion-job-lifecycle.md](../../feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: 114
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--lifecycle/114-path-traversal-validation-p0-4.md`
