---
title: "CCC-003 -- Incremental index"
description: "This scenario validates Incremental index for `CCC-003`. It focuses on Verify incremental indexing picks up new content and drops deleted content."
---

# CCC-003 -- Incremental index

## 1. OVERVIEW

This scenario validates Incremental index for `CCC-003`. It focuses on Verify incremental indexing picks up new content and drops deleted content.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CCC-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify incremental indexing picks up new content and drops deleted content
- Prompt: `As a manual-testing orchestrator, create a temp file, reindex, search for it, delete it, reindex again against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 3: search returns at least 1 result referencing ccc_test_incremental.py; Step 6: search returns 0 results for that file. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Step 3: search returns at least 1 result referencing `ccc_test_incremental.py`; Step 6: search returns 0 results for that file
- Pass/fail: PASS if step 3 finds the temp file AND step 6 does not; PARTIAL if step 3 finds it but step 6 still returns stale results; FAIL if step 3 does not find the temp file


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CCC-003 | Incremental index | Verify incremental indexing picks up new content and drops deleted content | `As a manual-testing orchestrator, create a temp file, reindex, search for it, delete it, reindex again against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 3: search returns at least 1 result referencing ccc_test_incremental.py; Step 6: search returns 0 results for that file. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: echo '# Temporary test: xyzzy_incremental_test_marker' > /tmp/ccc_test_incremental.py && cp /tmp/ccc_test_incremental.py ./ccc_test_incremental.py` -> 2. `bash: ccc index` -> 3. `bash: ccc search "xyzzy_incremental_test_marker" --limit 3` -> 4. `bash: rm ./ccc_test_incremental.py` -> 5. `bash: ccc index` -> 6. `bash: ccc search "xyzzy_incremental_test_marker" --limit 3` | Step 3: search returns at least 1 result referencing `ccc_test_incremental.py`; Step 6: search returns 0 results for that file | Transcript of all 6 steps; search output from steps 3 and 6 | PASS if step 3 finds the temp file AND step 6 does not; PARTIAL if step 3 finds it but step 6 still returns stale results; FAIL if step 3 does not find the temp file | Re-run `ccc index`; check if daemon cached stale data; verify `.gitignore` is not excluding the temp file |


---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Core CLI Commands
- Playbook ID: CCC-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--core-cli-commands/003-incremental-index.md`
