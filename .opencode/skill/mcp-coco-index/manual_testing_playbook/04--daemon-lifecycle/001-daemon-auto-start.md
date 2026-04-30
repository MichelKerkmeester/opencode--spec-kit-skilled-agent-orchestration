---
title: "DMN-001 -- Daemon auto-start"
description: "This scenario validates Daemon auto-start for `DMN-001`. It focuses on Verify daemon starts automatically when a CLI command is issued after it has been stopped."
---

# DMN-001 -- Daemon auto-start

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SCENARIO CONTRACT](#2--scenario-contract)
- [3. TEST EXECUTION](#3--test-execution)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates Daemon auto-start for `DMN-001`. It focuses on Verify daemon starts automatically when a CLI command is issued after it has been stopped.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DMN-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify daemon starts automatically when a CLI command is issued after it has been stopped
- Real user request: `Please verify daemon starts automatically when a CLI command is issued after it has been stopped.`
- RCAF Prompt: `As a manual-testing orchestrator, stop the CocoIndex daemon, run a search command, and inspect daemon status against the current CocoIndex CLI and daemon surfaces in this repository. Verify Step 1 reports the daemon stopped or already stopped, Step 3 returns at least one search result, and Step 5 reports the daemon running. Return a concise user-visible pass/fail verdict with the main reason.`
- Expected execution process: Run the TEST EXECUTION command sequence for `DMN-001`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running
- Desired user-visible outcome: A concise user-visible PASS/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if search succeeds after daemon stop (auto-restart) AND daemon status confirms running; FAIL if search fails or daemon remains stopped


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DMN-001 | Daemon auto-start | Verify daemon starts automatically when a CLI command is issued after it has been stopped | `As a manual-testing orchestrator, stop the CocoIndex daemon, run a search command, and inspect daemon status against the current CocoIndex CLI and daemon surfaces in this repository. Verify Step 1 reports the daemon stopped or already stopped, Step 3 returns at least one search result, and Step 5 reports the daemon running. Return a concise user-visible pass/fail verdict with the main reason.` | 1. Confirm no other playbook scenario is running against the same daemon -> 2. `bash: ccc daemon stop` -> 3. `bash: sleep 2` -> 4. `bash: ccc search "test" --limit 1` -> 5. Verify search returns results (daemon restarted) -> 6. `bash: ccc daemon status` (confirm running) | Step 2: daemon stops or reports already stopped; Step 4: search returns at least 1 result; Step 6: daemon reports running | Transcript of all 6 steps; daemon status output | PASS if search succeeds after daemon stop (auto-restart) AND daemon status confirms running; FAIL if search fails or daemon remains stopped | Check `~/.cocoindex_code/daemon.pid` for stale PID; check `daemon.log` for startup errors; verify port/socket availability |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Daemon Lifecycle
- Playbook ID: DMN-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--daemon-lifecycle/001-daemon-auto-start.md`
