---
title: "261 -- MCP auto-priming delivers Prime Package on first tool call"
description: "This scenario validates MCP auto-priming for 261. It focuses on verifying the first MCP tool call returns a Prime Package in response hints."
audited_post_018: true
---

# 261 -- MCP auto-priming delivers Prime Package on first tool call

## 1. OVERVIEW

This scenario validates MCP auto-priming.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that the spec-doc record-surface hook delivers a PrimePackage on the first MCP tool call of a session; The package must contain constitutional memories, code graph status snapshot, and any triggered memories from the current prompt; Subsequent tool calls must NOT re-deliver the prime package (one-shot behavior); The priming status must be reflected in session_health as 'primed' after the first call.
- Real user request: `Please validate MCP auto-priming delivers Prime Package on first tool call against memory_stats({}) and tell me whether the expected signals are present: First call: response hints contain primePackage with constitutional array and codeGraphStatus; Second call: response hints do NOT contain primePackage; session_health: primingStatus === 'primed'.`
- RCAF Prompt: `As a context-and-code-graph validation operator, validate MCP auto-priming delivers Prime Package on first tool call against memory_stats({}). Verify the spec-doc record-surface hook delivers a PrimePackage on the first MCP tool call of a session. The package must contain constitutional memories, code graph status snapshot, and any triggered memories from the current prompt. Subsequent tool calls must NOT re-deliver the prime package (one-shot behavior). The priming status must be reflected in session_health as 'primed' after the first call. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: First call: response hints contain primePackage with constitutional array and codeGraphStatus; Second call: response hints do NOT contain primePackage; session_health: primingStatus === 'primed'
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: First call delivers prime package, subsequent calls skip it, session_health confirms primed; FAIL: No prime package on first call, prime package repeated on second call, or primingStatus incorrect

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate First tool call delivers Prime Package against memory_stats({}). Verify response envelope hints include primePackage with constitutional memories. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `memory_stats({})` via MCP

### Expected

Response envelope hints include primePackage with constitutional memories

### Evidence

MCP response JSON showing primePackage field

### Pass / Fail

- **Pass**: primePackage present with non-empty constitutional array
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check isSessionPrimed() state and memory-surface hook wiring

---

### Prompt

```
As a context-and-code-graph validation operator, validate Second tool call skips Prime Package (one-shot) against memory_stats({}). Verify response envelope hints do NOT include primePackage. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `memory_stats({})` again

### Expected

Response envelope hints do NOT include primePackage

### Evidence

MCP response JSON showing no primePackage

### Pass / Fail

- **Pass**: primePackage absent on second call
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify priming flag is set after first call in memory-surface.ts

---

### Prompt

```
As a context-and-code-graph validation operator, validate session_health confirms primed status against session_health({}). Verify primingStatus === 'primed' in response. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_health({})` via MCP

### Expected

primingStatus === 'primed' in response

### Evidence

session_health response JSON

### Pass / Fail

- **Pass**: primingStatus is 'primed' after at least one tool call
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check getSessionTimestamps() and isSessionPrimed()

---

### Prompt

```
As a context-and-code-graph validation operator, validate Session-scoped priming isolation against memory_context({ input: "prime A", sessionId: "prime-session-a" }). Verify each session receives its own first-call PrimePackage because priming is tracked per explicit session identity. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `memory_context({ input: "prime A", sessionId: "prime-session-a" })`; then in a fresh second MCP session call `memory_context({ input: "prime B", sessionId: "prime-session-b" })`

### Expected

Each session receives its own first-call PrimePackage because priming is tracked per explicit session identity

### Evidence

Two MCP response envelopes showing independent primePackage delivery for session A and session B

### Pass / Fail

- **Pass**: the second session receives its own PrimePackage independently of the first session
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `hooks/memory-surface.ts` session-scoped priming set and session identity propagation

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/16-mcp-auto-priming.md](../../feature_catalog/22--context-preservation-and-code-graph/16-mcp-auto-priming.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 261
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/261-mcp-auto-priming.md`
