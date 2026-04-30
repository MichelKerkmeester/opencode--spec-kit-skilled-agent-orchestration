---
title: "CM-006 -- Wrong-form error"
description: "This scenario validates the wrong-form error for `CM-006`. It focuses on confirming that calling without the manual prefix returns a deterministic 'tool not found' error referencing the wrong-form name."
---

# CM-006 -- Wrong-form error

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-006`.

---

## 1. OVERVIEW

This scenario validates the wrong-form error for `CM-006`. It focuses on confirming that omitting the duplicated manual prefix (e.g., `clickup.get_teams` instead of `clickup.clickup_get_teams`) returns a deterministic, named "tool not found" error so the operator can self-correct.

### Why This Matters

This is the negative test for the namespace contract. Operators routinely make this mistake; a clear, named error message is the difference between a 30-second fix (rename) and a 30-minute debug session checking auth, server config, and network. This scenario also defines the failure-triage anchor referenced by CM-005, BDG-014..BDG-018, and CU-017..CU-019.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-006` and confirm the expected signals without contradictory evidence.

- Objective: Verify `clickup.get_teams({})` (wrong form, missing duplicated `clickup_` prefix) returns a "tool not found" error containing the wrong name.
- Real user request: `"Why does my ClickUp tool call fail?"` (debugging session)
- RCAF Prompt: `As a manual-testing orchestrator, call ClickUp get_teams using the wrong form clickup.get_teams through Code Mode against the live registry. Verify the call returns a tool not found error containing the wrong name. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: invoke via `call_tool_chain` deliberately using the wrong form, then inspect the error.
- Expected signals: chain throws or returns an error; error message contains "tool" and "not found" (or equivalent); error references the wrong-form name `clickup.get_teams`.
- Desired user-visible outcome: A short report quoting the error message and confirming it names the wrong call as well as suggests the correct form, with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if the call silently returns a falsy result (no error) or throws a generic exception that doesn't reference the wrong tool name.

---

## 3. TEST EXECUTION

### Prompt

- RCAF Prompt: `As a manual-testing orchestrator, call ClickUp get_teams using the wrong form clickup.get_teams through Code Mode against the live registry. Verify the call returns a tool not found error containing the wrong name. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "try { return await clickup.get_teams({}); } catch (e) { return { error: e.message }; }" })`
2. Inspect the returned `error` field

### Expected

- Step 1: chain returns an object with an `error` key (the wrong call did not succeed)
- Step 2: error message contains the substring "tool" or "not found" or "unknown"
- Step 2: error message contains the substring `clickup.get_teams` (names the offending call) or otherwise points to the missing manual prefix

### Evidence

Capture the verbatim error message returned by the chain.

### Pass / Fail

- **Pass**: Error returned and message names the wrong tool form.
- **Fail**: No error (call somehow succeeded — naming contract is broken); error returned but message is generic and doesn't help operator self-correct.

### Failure Triage

1. If no error returned: check `list_tools()` (CM-001) for `clickup.get_teams` literal — if it exists, the manual-namespace contract isn't being enforced.
2. If error is generic ("undefined is not a function" or similar): the runtime is treating the wrong form as a missing JavaScript identifier rather than as an MCP tool lookup; this is a Code Mode runtime bug — file with the error trace.
3. If error doesn't name the offending call: the error-message text needs improvement; file an enhancement, but the scenario can still PASS if error is otherwise informative.

### Optional Supplemental Checks

- Try other wrong forms: camelCase (`clickupGetTeams`), no manual at all (`get_teams`); document which forms produce which errors.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Manual-namespace contract; #1-error guidance (line 195-216) |

---

## 5. SOURCE METADATA

- Group: MANUAL NAMESPACE CONTRACT
- Playbook ID: CM-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--manual-namespace-contract/002-wrong-form-error.md`
