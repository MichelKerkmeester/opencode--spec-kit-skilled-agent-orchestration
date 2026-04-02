---
title: "261 -- MCP auto-priming delivers Prime Package on first tool call"
description: "This scenario validates MCP auto-priming for 261. It focuses on verifying the first MCP tool call returns a Prime Package in response hints."
---

# 261 -- MCP auto-priming delivers Prime Package on first tool call

## 1. OVERVIEW

This scenario validates MCP auto-priming.

---

## 2. CURRENT REALITY

- **Objective**: Verify that the memory-surface hook delivers a PrimePackage on the first MCP tool call of a session. The package must contain constitutional memories, code graph status snapshot, and any triggered memories from the current prompt. Subsequent tool calls must NOT re-deliver the prime package (one-shot behavior). The priming status must be reflected in session_health as 'primed' after the first call.
- **Prerequisites**:
  - MCP server running and accessible
  - At least one constitutional memory saved in the database
  - Code graph database initialized (even if empty)
- **Prompt**: `Validate 261 MCP auto-priming. Make a tool call (e.g., memory_stats) to the MCP server on a fresh session. Confirm: (1) response hints include a PrimePackage with constitutional memories, (2) code graph status is included in the package, (3) make a second tool call and confirm NO prime package in hints (one-shot), (4) call session_health and confirm primingStatus === 'primed'.`
- **Expected signals**:
  - First call: response hints contain primePackage with constitutional array and codeGraphStatus
  - Second call: response hints do NOT contain primePackage
  - session_health: primingStatus === 'primed'
- **Pass/fail criteria**:
  - PASS: First call delivers prime package, subsequent calls skip it, session_health confirms primed
  - FAIL: No prime package on first call, prime package repeated on second call, or primingStatus incorrect

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 261a | MCP auto-priming | First tool call delivers Prime Package | `Validate 261a first-call priming` | Call `memory_stats({})` via MCP | Response envelope hints include primePackage with constitutional memories | MCP response JSON showing primePackage field | PASS if primePackage present with non-empty constitutional array | Check isSessionPrimed() state and memory-surface hook wiring |
| 261b | MCP auto-priming | Second tool call skips Prime Package (one-shot) | `Validate 261b one-shot enforcement` | Call `memory_stats({})` again | Response envelope hints do NOT include primePackage | MCP response JSON showing no primePackage | PASS if primePackage absent on second call | Verify priming flag is set after first call in memory-surface.ts |
| 261c | MCP auto-priming | session_health confirms primed status | `Validate 261c priming status` | Call `session_health({})` via MCP | primingStatus === 'primed' in response | session_health response JSON | PASS if primingStatus is 'primed' after at least one tool call | Check getSessionTimestamps() and isSessionPrimed() |
| 261d | MCP auto-priming | Session-scoped priming isolation | `Validate 261d session-scoped priming isolation` | Call `memory_context({ input: "prime A", sessionId: "prime-session-a" })`; then in a fresh second MCP session call `memory_context({ input: "prime B", sessionId: "prime-session-b" })` | Each session receives its own first-call PrimePackage because priming is tracked per explicit session identity | Two MCP response envelopes showing independent primePackage delivery for session A and session B | PASS if the second session receives its own PrimePackage independently of the first session | Check `hooks/memory-surface.ts` session-scoped priming set and session identity propagation |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/16-mcp-auto-priming.md](../../feature_catalog/22--context-preservation-and-code-graph/16-mcp-auto-priming.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 261
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/261-mcp-auto-priming.md`
