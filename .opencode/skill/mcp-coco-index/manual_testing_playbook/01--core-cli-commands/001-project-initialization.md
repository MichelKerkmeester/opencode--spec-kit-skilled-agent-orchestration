---
title: "CCC-001 -- Project initialization"
description: "This scenario validates Project initialization for `CCC-001`. It focuses on Verify `ccc init` creates project config; second call reports already initialized; `--force` re-creates."
---

# CCC-001 -- Project initialization

## 1. OVERVIEW

This scenario validates Project initialization for `CCC-001`. It focuses on Verify `ccc init` creates project config; second call reports already initialized; `--force` re-creates.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CCC-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify `ccc init` creates project config; second call reports already initialized; `--force` re-creates
- Prompt: `As a manual-testing orchestrator, initialize a new CocoIndex Code project in the current directory against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 2: output contains "Initialized" or creates .cocoindex_code/; Step 3: file exists; Step 4: output contains "already" or exits without error; Step 5: succeeds without error; Step 6: file exists. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Step 2: output contains "Initialized" or creates `.cocoindex_code/`; Step 3: file exists; Step 4: output contains "already" or exits without error; Step 5: succeeds without error; Step 6: file exists
- Pass/fail: PASS if all 6 steps produce expected signals; FAIL if `settings.yml` missing after init or `--force` errors


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CCC-001 | Project initialization | Verify `ccc init` creates project config; second call reports already initialized; `--force` re-creates | `As a manual-testing orchestrator, initialize a new CocoIndex Code project in the current directory against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 2: output contains "Initialized" or creates .cocoindex_code/; Step 3: file exists; Step 4: output contains "already" or exits without error; Step 5: succeeds without error; Step 6: file exists. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: rm -rf .cocoindex_code/` -> 2. `bash: ccc init` -> 3. Verify `.cocoindex_code/settings.yml` exists: `bash: ls .cocoindex_code/settings.yml` -> 4. `bash: ccc init` (second call, expect "already initialized" or similar) -> 5. `bash: ccc init -f` (force re-create) -> 6. `bash: ls .cocoindex_code/settings.yml` | Step 2: output contains "Initialized" or creates `.cocoindex_code/`; Step 3: file exists; Step 4: output contains "already" or exits without error; Step 5: succeeds without error; Step 6: file exists | Terminal transcript of all 6 steps with timestamps | PASS if all 6 steps produce expected signals; FAIL if `settings.yml` missing after init or `--force` errors | Check `ccc` binary path; verify Python 3.11+; check write permissions on project root |


---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Core CLI Commands
- Playbook ID: CCC-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--core-cli-commands/001-project-initialization.md`
