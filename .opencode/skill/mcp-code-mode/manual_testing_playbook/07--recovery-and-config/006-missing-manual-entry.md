---
title: "CM-026 -- Missing manual entry"
description: "This scenario validates the 'manual not found' error path for `CM-026`. It focuses on confirming calling a tool whose manual is not in `.utcp_config.json` returns a deterministic error referencing the missing manual."
---

# CM-026 -- Missing manual entry

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-026`.

---

## 1. OVERVIEW

This scenario validates the missing-manual error for `CM-026`. It focuses on confirming that calling `nonexistent.nonexistent_anything()` (referring to a manual that's not in `.utcp_config.json`) returns a deterministic error message naming the missing manual — so operators can self-correct.

### Why This Matters

This is the second-most-common config-related failure (after the manual-namespace contract per CM-005..CM-007 and the env-var prefix per CM-008..CM-010). Operators may try a manual name from documentation that they haven't actually configured locally. A clear "manual not found" error short-circuits the debug path.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CM-026` and confirm the expected signals without contradictory evidence.

- Objective: Verify `call_tool_chain` calling `nonexistent.nonexistent_anything()` returns an error naming `nonexistent` as a missing manual.
- Real user request: `"Why does my call to a manual I haven't installed fail with a generic error?"` (debugging session)
- Prompt: `As a manual-testing orchestrator, call nonexistent.nonexistent_anything() through Code Mode against the current registry. Verify the error names the missing manual. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: single `call_tool_chain` deliberately referencing a non-configured manual; inspect the error.
- Expected signals: call returns error; error message contains "manual" or "not found" or "registry"; error message references `nonexistent`.
- Desired user-visible outcome: A short report quoting the error message and confirming it names the missing manual with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if call silently succeeds (no error), error is generic (doesn't name the missing manual), or the runtime crashes.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, call nonexistent.nonexistent_anything() through Code Mode against the current registry. Verify the error names the missing manual. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "try { return await nonexistent.nonexistent_anything({}); } catch (e) { return { error: e.message }; }" })`
2. Inspect the returned `error` field

### Expected

- Step 1: chain returns object with `error` key (call did not silently succeed)
- Step 2: error message contains "manual" or "not found" or "registry" or "unknown"
- Step 2: error message references `nonexistent`

### Evidence

Capture the verbatim error message.

### Pass / Fail

- **Pass**: Error returned and message names the missing manual.
- **Fail**: No error (call silently succeeded — registry is broken); generic error (operator can't self-correct).

### Failure Triage

1. If no error: check `list_tools()` (CM-001) for `nonexistent.*` — if present, registry contains stale entries; clear and restart.
2. If generic error like "undefined is not a function": runtime is treating the missing manual as a missing JavaScript identifier rather than as an MCP registry lookup; this is a Code Mode runtime bug.
3. If error doesn't reference "nonexistent": enhancement target — file an issue but the scenario can still PASS if the error otherwise points to manual not found.

### Optional Supplemental Checks

- Try calling a known-disabled manual (per CM-022); confirm the error message disambiguates "not found" from "disabled".

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Error-handling guidance |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND CONFIG
- Playbook ID: CM-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--recovery-and-config/006-missing-manual-entry.md`
