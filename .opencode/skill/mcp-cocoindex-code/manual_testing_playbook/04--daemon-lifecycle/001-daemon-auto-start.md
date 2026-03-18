---
title: "DMN-001 -- Daemon auto-start"
description: "This scenario validates Daemon auto-start for `DMN-001`. It focuses on Verify daemon starts automatically when a CLI command is issued after it has been stopped."
---

# DMN-001 -- Daemon auto-start

## 1. OVERVIEW

This scenario validates Daemon auto-start for `DMN-001`. It focuses on Verify daemon starts automatically when a CLI command is issued after it has been stopped.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `DMN-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify daemon starts automatically when a CLI command is issued after it has been stopped
- Prompt: `Stop the daemon, then search -- verify auto-start`
- Expected signals: Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running
- Pass/fail: PASS if search succeeds after daemon stop (auto-restart) AND daemon status confirms running; FAIL if search fails or daemon remains stopped


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DMN-001 | Daemon auto-start | Verify daemon starts automatically when a CLI command is issued after it has been stopped | `Stop the daemon, then search -- verify auto-start` | 1. `bash: ccc daemon stop` -> 2. `bash: sleep 2` -> 3. `bash: ccc search "test" --limit 1` -> 4. Verify search returns results (daemon restarted) -> 5. `bash: ccc daemon status` (confirm running) | Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running | Transcript of all 5 steps; daemon status output | PASS if search succeeds after daemon stop (auto-restart) AND daemon status confirms running; FAIL if search fails or daemon remains stopped | Check `~/.cocoindex_code/daemon.pid` for stale PID; check `daemon.log` for startup errors; verify port/socket availability |


---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Daemon Lifecycle
- Playbook ID: DMN-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--daemon-lifecycle/001-daemon-auto-start.md`
