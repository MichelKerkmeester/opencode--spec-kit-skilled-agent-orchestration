---
title: "CCC-005 -- Index reset **(DESTRUCTIVE)**"
description: "This scenario validates Index reset **(DESTRUCTIVE)** for `CCC-005`. It focuses on Verify `ccc reset --all` clears index; status shows empty; rebuild succeeds."
---

# CCC-005 -- Index reset **(DESTRUCTIVE)**

## 1. OVERVIEW

This scenario validates Index reset **(DESTRUCTIVE)** for `CCC-005`. It focuses on Verify `ccc reset --all` clears index; status shows empty; rebuild succeeds.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CCC-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify `ccc reset --all` clears index; status shows empty; rebuild succeeds
- Prompt: `Reset the CocoIndex Code index completely and rebuild. Capture the evidence needed to prove Step 1: exits without error; Step 2: shows zero files or "not initialized"; Step 4: rebuilds with non-zero counts; Step 5: shows non-zero file and chunk counts. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Step 1: exits without error; Step 2: shows zero files or "not initialized"; Step 4: rebuilds with non-zero counts; Step 5: shows non-zero file and chunk counts
- Pass/fail: PASS if reset clears index AND rebuild restores non-zero counts; FAIL if reset errors or rebuild produces zero counts


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CCC-005 | Index reset **(DESTRUCTIVE)** | Verify `ccc reset --all` clears index; status shows empty; rebuild succeeds | `Reset the CocoIndex Code index completely and rebuild. Capture the evidence needed to prove Step 1: exits without error; Step 2: shows zero files or "not initialized"; Step 4: rebuilds with non-zero counts; Step 5: shows non-zero file and chunk counts. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: ccc reset --all -f` -> 2. `bash: ccc status` (expect zero/empty counts) -> 3. `bash: ccc init` -> 4. `bash: ccc index` -> 5. `bash: ccc status` (expect non-zero counts) | Step 1: exits without error; Step 2: shows zero files or "not initialized"; Step 4: rebuilds with non-zero counts; Step 5: shows non-zero file and chunk counts | Full transcript of all 5 steps; before/after status output | PASS if reset clears index AND rebuild restores non-zero counts; FAIL if reset errors or rebuild produces zero counts | Check `ccc reset` flags; verify `-f` bypasses confirmation; check disk space for rebuild |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Core CLI Commands
- Playbook ID: CCC-005
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--core-cli-commands/005-index-reset-destructive.md`
