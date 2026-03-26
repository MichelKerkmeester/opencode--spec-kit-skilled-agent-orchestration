---
title: "CFG-003 -- Status verification"
description: "This scenario validates Status verification for `CFG-003`. It focuses on Verify `ccc status` shows indexed file count and chunk count."
---

# CFG-003 -- Status verification

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates Status verification for `CFG-003`. It focuses on Verify `ccc status` shows indexed file count and chunk count.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CFG-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `ccc status` shows indexed file count and chunk count
- Prompt: `Check the CocoIndex Code status for this initialized project. Capture the evidence needed to prove Output shows numeric file count > 0 and numeric chunk count > 0. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Output shows numeric file count > 0 and numeric chunk count > 0
- Pass/fail: PASS if both counts are present and non-zero; PARTIAL if only one count is visible but status still succeeds; FAIL if status command errors or shows zero counts


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CFG-003 | Status verification | Verify `ccc status` shows indexed file count and chunk count | `Check the CocoIndex Code status for this initialized project. Capture the evidence needed to prove Output shows numeric file count > 0 and numeric chunk count > 0. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: ccc status` -> 2. Verify output contains file count and chunk count | Output shows numeric file count > 0 and numeric chunk count > 0 | Full `ccc status` output | PASS if both counts are present and non-zero; PARTIAL if only one count is visible but status still succeeds; FAIL if status command errors or shows zero counts | Run `ccc index` to populate index; check daemon connectivity; verify `.cocoindex_code/` exists |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Configuration
- Playbook ID: CFG-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--configuration/003-status-verification.md`
