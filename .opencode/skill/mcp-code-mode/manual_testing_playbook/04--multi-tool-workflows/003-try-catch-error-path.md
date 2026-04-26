---
title: "CM-013 -- try/catch error path"
description: "This scenario validates the try/catch error-recovery pattern for `CM-013`. It focuses on confirming that wrapping a failing call in try/catch lets the chain continue and return both the error and a fallback result."
---

# CM-013 -- try/catch error path

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-013`.

---

## 1. OVERVIEW

This scenario validates the try/catch error-recovery pattern for `CM-013`. It focuses on confirming that a chain can wrap a known-failing call in try/catch, capture the error, and continue with a fallback call — returning both pieces of information to the operator.

### Why This Matters

Without per-call error recovery, every chain is brittle: one rate-limit, one transient network blip, or one malformed argument terminates the whole workflow. CM-025 (partial-chain rollback) builds on this primitive; CU-024..CU-027 reference this pattern in the recovery category.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-013` and confirm the expected signals without contradictory evidence.

- Objective: Verify a chain where the first call deliberately fails (invalid id) and is caught, then a fallback `get_user` succeeds — chain returns both outcomes.
- Real user request: `"If my first call fails, fall back to a basic info call."`
- Prompt: `As a manual-testing orchestrator, run a chain where the first call deliberately fails (invalid id) and the second is a fallback get_user, with try/catch around the first against the live ClickUp API. Verify the chain returns both the caught error and the fallback success. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: single `call_tool_chain` with try/catch around the first call; second call runs unconditionally.
- Expected signals: chain returns object with `error` and `fallback` keys; error is structured (not a runtime exception that aborts the chain); fallback contains user data.
- Desired user-visible outcome: A short report quoting both the caught error message and the fallback user data with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if chain rejects (try/catch didn't catch), or fallback is missing (chain aborted after the catch).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, run a chain where the first call deliberately fails (invalid id) and the second is a fallback get_user, with try/catch around the first against the live ClickUp API. Verify the chain returns both the caught error and the fallback success. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "let error = null; try { await clickup.clickup_get_task({ task_id: 'INVALID_ID_DOES_NOT_EXIST' }); } catch (e) { error = e.message; } const fallback = await clickup.clickup_get_user({}); return { error, fallback };" })`
2. Inspect the returned object

### Expected

- Step 1: chain returns object with `error` and `fallback` keys
- Step 2: `error` is a non-null string (the caught error message)
- Step 2: `fallback` is an object containing user data (not null/undefined)

### Evidence

Capture the verbatim chain response with both error and fallback data.

### Pass / Fail

- **Pass**: Both `error` and `fallback` populated; error is descriptive; fallback has user info.
- **Fail**: Chain rejects entirely (try/catch failed to scope the error); `error` is null (the deliberately-failing call somehow succeeded — choose a stronger failure pattern); `fallback` is null (chain aborted after catch).

### Failure Triage

1. If chain rejects entirely: confirm the failing call is actually inside the try block; some MCP errors throw at await time, others at promise-resolution time — try `try/catch` around `await` directly.
2. If `error` is null: the first call may have silently succeeded (perhaps `INVALID_ID_DOES_NOT_EXIST` was treated as a valid id of zero — try a clearly malformed string with special characters).
3. If `fallback` is null: confirm the fallback call works in isolation via CM-005; if it works alone but not after a catch, the chain is mis-scoped.

### Optional Supplemental Checks

- Replace try/catch with `Promise.allSettled` and verify equivalent error-isolation behavior.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | call_tool_chain error-handling guidance |

---

## 5. SOURCE METADATA

- Group: MULTI-TOOL WORKFLOWS
- Playbook ID: CM-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--multi-tool-workflows/003-try-catch-error-path.md`
