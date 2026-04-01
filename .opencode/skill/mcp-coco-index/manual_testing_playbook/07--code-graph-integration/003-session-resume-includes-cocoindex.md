---
title: "INT-003 -- Session resume includes CocoIndex availability status"
description: "This scenario validates that the session_resume composite tool includes CocoIndex availability in its merged response."
---

# INT-003 -- Session resume includes CocoIndex availability status

## 1. OVERVIEW

This scenario validates that the session_resume MCP tool correctly probes CocoIndex availability and includes the result in its composite response alongside memory context and code graph status.

---

## 2. CURRENT REALITY

- Objective: Verify that session_resume includes a cocoIndex field with available (boolean) and binaryPath (string) in its response. When the CocoIndex daemon is running, available must be true. When the daemon is stopped, available must be false but the call must not fail. The binaryPath must point to the expected ccc binary location.
- Prompt: `Call session_resume and examine the CocoIndex status field. Capture the evidence needed to prove: (1) response contains cocoIndex field with available boolean, (2) binaryPath is a valid file path string, (3) when CocoIndex daemon is running, available=true, (4) the overall session_resume call succeeds even if CocoIndex is unavailable. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: cocoIndex.available is boolean matching daemon state, cocoIndex.binaryPath is non-empty string, session_resume completes without error regardless of CocoIndex state
- Pass/fail: PASS if cocoIndex field present with correct types and availability matches daemon state; FAIL if field missing, wrong type, or session_resume crashes when CocoIndex unavailable


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| INT-003a | Session resume CocoIndex status | CocoIndex available when daemon running | `Call session_resume with daemon running` | 1. `ccc status` (verify running) 2. `session_resume({})` via MCP | cocoIndex.available === true, binaryPath is non-empty string | session_resume response JSON cocoIndex field | PASS if available=true and binaryPath present; FAIL if available=false when daemon is running | Check ccc binary path in session-resume.ts; verify daemon with `ccc daemon status` |
| INT-003b | Session resume CocoIndex status | Session resume succeeds when CocoIndex unavailable | `Call session_resume after stopping daemon` | 1. `ccc daemon stop` 2. `session_resume({})` via MCP | cocoIndex.available === false, overall call succeeds (no exception), hints may include recovery guidance | session_resume response JSON showing graceful degradation | PASS if call succeeds with available=false; FAIL if call throws exception or cocoIndex field missing | Check error handling in session-resume.ts CocoIndex probe |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Code Graph Integration
- Playbook ID: INT-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--code-graph-integration/003-session-resume-includes-cocoindex.md`
