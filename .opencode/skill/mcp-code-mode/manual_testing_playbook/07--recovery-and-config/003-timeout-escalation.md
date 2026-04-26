---
title: "CM-023 -- Timeout escalation"
description: "This scenario validates the call_tool_chain timeout argument for `CM-023`. It focuses on confirming a chain that exceeds the timeout aborts within the expected window with a deterministic timeout error."
---

# CM-023 -- Timeout escalation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-023`.

---

## 1. OVERVIEW

This scenario validates the `timeout` argument for `CM-023`. It focuses on confirming that `call_tool_chain({code, timeout: 5000})` aborts a chain that would otherwise exceed 5000ms, returning a deterministic timeout error within roughly the timeout window.

### Why This Matters

Without enforced timeouts, runaway chains can hang the operator's session indefinitely, especially when wrapping slow third-party APIs. The timeout contract is the safety valve; if it's not enforced, every long-running scenario risks blocking the next.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CM-023` and confirm the expected signals without contradictory evidence.

- Objective: Verify a deliberately slow chain (sleep 7 seconds) with `timeout: 5000` aborts in approximately 5 seconds with a timeout error.
- Real user request: `"Limit my next chain to 5 seconds to avoid hanging."`
- Prompt: `As a manual-testing orchestrator, run a deliberately slow chain (sleep 7 seconds) with timeout: 5000 through Code Mode against the local Code Mode runtime. Verify the chain returns a timeout error in approximately 5 seconds. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: single `call_tool_chain` invocation with explicit timeout; capture wall time.
- Expected signals: response includes timeout/abort error; wall-clock time approximately 5 seconds (within ±1s).
- Desired user-visible outcome: A short report quoting the timeout error and the actual wall time with a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL if chain runs to completion (timeout not enforced) or wall time is significantly off (>2s deviation).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, run a deliberately slow chain (sleep 7 seconds) with timeout: 5000 through Code Mode against the local Code Mode runtime. Verify the chain returns a timeout error in approximately 5 seconds. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "const t0 = Date.now(); await new Promise(r => setTimeout(r, 7000)); return { wall_ms: Date.now() - t0 };", timeout: 5000 })`
2. Inspect the response for timeout error and wall time

### Expected

- Step 1: chain returns an error (timeout / abort); does NOT return `{ wall_ms: 7000 }`
- Step 2: actual wall time approximately 5 seconds (between 4-6 seconds)

### Evidence

Capture the verbatim response (including the timeout error message text) and the elapsed wall time.

### Pass / Fail

- **Pass**: Chain aborted within 4-6s with a timeout error.
- **Fail**: Chain ran to 7s completion (timeout ignored); chain aborted but at a wildly different time (timeout enforced but inaccurate).

### Failure Triage

1. If chain completes at 7s: timeout argument may not be supported by current Code Mode version — `tool_info({tool_name: "call_tool_chain"})` to check schema.
2. If aborts much earlier than 5s: the timeout may be applied per-step, not per-chain — file documentation enhancement.
3. If aborts much later than 5s: the runtime may have a graceful-shutdown overhead; document the actual behavior in evidence.

### Optional Supplemental Checks

- Try `timeout: 1000` with a 2s sleep; confirms timeout scales linearly.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | timeout argument doc (line 689-693) |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND CONFIG
- Playbook ID: CM-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--recovery-and-config/003-timeout-escalation.md`
