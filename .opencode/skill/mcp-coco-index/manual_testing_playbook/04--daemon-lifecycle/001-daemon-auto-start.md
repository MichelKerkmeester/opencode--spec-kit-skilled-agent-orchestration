---
title: "DMN-001 -- Daemon auto-start"
description: "This scenario validates Daemon auto-start for `DMN-001`. It focuses on Verify daemon starts automatically when a CLI command is issued after it has been stopped."
---

# DMN-001 -- Daemon auto-start

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates Daemon auto-start for `DMN-001`. It focuses on Verify daemon starts automatically when a CLI command is issued after it has been stopped.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `DMN-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify daemon starts automatically when a CLI command is issued after it has been stopped
- Prompt: `As a manual-testing orchestrator, stop the daemon, then search -- against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify auto-start against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running
- Isolation note: Run this scenario serially. It intentionally stops the shared daemon and can invalidate concurrent CLI or MCP checks.
- Pass/fail: PASS if search succeeds after daemon stop (auto-restart) AND daemon status confirms running; FAIL if search fails or daemon remains stopped


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DMN-001 | Daemon auto-start | Verify daemon starts automatically when a CLI command is issued after it has been stopped | `As a manual-testing orchestrator, stop the daemon, then search -- against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify auto-start against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running. Return a concise user-facing pass/fail verdict with the main reason.` | 1. Confirm no other playbook scenario is running against the same daemon -> 2. `bash: ccc daemon stop` -> 3. `bash: sleep 2` -> 4. `bash: ccc search "test" --limit 1` -> 5. Verify search returns results (daemon restarted) -> 6. `bash: ccc daemon status` (confirm running) | Step 2: daemon stops or reports already stopped; Step 4: search returns at least 1 result; Step 6: daemon reports running | Transcript of all 6 steps; daemon status output | PASS if search succeeds after daemon stop (auto-restart) AND daemon status confirms running; FAIL if search fails or daemon remains stopped | Check `~/.cocoindex_code/daemon.pid` for stale PID; check `daemon.log` for startup errors; verify port/socket availability |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Daemon Lifecycle
- Playbook ID: DMN-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--daemon-lifecycle/001-daemon-auto-start.md`
