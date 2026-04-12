---
title: "DMN-002 -- Daemon status inspection"
description: "This scenario validates Daemon status inspection for `DMN-002`. It focuses on Verify `ccc daemon status` shows version and uptime; PID and socket files exist."
---

# DMN-002 -- Daemon status inspection

## 1. OVERVIEW

This scenario validates Daemon status inspection for `DMN-002`. It focuses on Verify `ccc daemon status` shows version and uptime; PID and socket files exist.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `DMN-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify `ccc daemon status` shows version and uptime; PID and socket files exist
- Prompt: `As a manual-testing orchestrator, check daemon status and against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify runtime files against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 1: output includes version or uptime information; Step 2: both daemon.pid and daemon.sock files exist. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Step 1: output includes version or uptime information; Step 2: both `daemon.pid` and `daemon.sock` files exist
- Pass/fail: PASS if daemon status reports running AND both PID/socket files exist; PARTIAL if status reports running but one file missing; FAIL if daemon not running or both files missing


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DMN-002 | Daemon status inspection | Verify `ccc daemon status` shows version and uptime; PID and socket files exist | `As a manual-testing orchestrator, check daemon status and against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify runtime files against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 1: output includes version or uptime information; Step 2: both daemon.pid and daemon.sock files exist. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: ccc daemon status` -> 2. `bash: ls ~/.cocoindex_code/daemon.pid ~/.cocoindex_code/daemon.sock` | Step 1: output includes version or uptime information; Step 2: both `daemon.pid` and `daemon.sock` files exist | Daemon status output; file listing | PASS if daemon status reports running AND both PID/socket files exist; PARTIAL if status reports running but one file missing; FAIL if daemon not running or both files missing | Run `ccc search "test" --limit 1` or `ccc index` to trigger daemon auto-start, then re-check status; inspect `daemon.log` for errors; verify `~/.cocoindex_code/` permissions |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Daemon Lifecycle
- Playbook ID: DMN-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--daemon-lifecycle/002-daemon-status-inspection.md`
