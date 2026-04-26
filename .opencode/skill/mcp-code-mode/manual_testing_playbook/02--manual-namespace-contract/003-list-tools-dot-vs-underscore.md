---
title: "CM-007 -- list_tools dot vs underscore"
description: "This scenario validates the dot-vs-underscore translation for `CM-007`. It focuses on confirming that `list_tools()` returns names in `a.b.c` dot form but the calling syntax requires the dot-to-underscore translation `a.b_c`."
---

# CM-007 -- list_tools dot vs underscore

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-007`.

---

## 1. OVERVIEW

This scenario validates the dot-vs-underscore translation for `CM-007`. It focuses on confirming that `list_tools()` returns tool names in dot-segmented form (e.g., `clickup.clickup.create_task`) while the calling syntax replaces internal dots with underscores (e.g., `clickup.clickup_create_task`).

### Why This Matters

This is the second major naming pitfall after the missing-prefix mistake (CM-006). Operators see a name in `list_tools()` output and try to call it verbatim — only the first dot survives as the namespace separator. Without this scenario, operators would mistakenly assume `list_tools()` names are call-ready.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-007` and confirm the expected signals without contradictory evidence.

- Objective: Verify (a) at least one `list_tools()` entry contains 2+ dots; (b) calling that entry verbatim (dot form) fails; (c) translating to underscore form succeeds.
- Real user request: `"I copied a tool name from list_tools and it doesn't work — what's wrong?"`
- Prompt: `As a manual-testing orchestrator, enumerate ClickUp tools then translate one entry from list-form to call-form and verify the call works through Code Mode against the live registry. Verify the dot-to-underscore translation is required. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: call `list_tools()`, pick one entry with 2+ dots, attempt the dot form (expect failure), then attempt the underscore form (expect success).
- Expected signals: at least one list entry has 2+ dots; dot-form call fails with "tool not found"; underscore-form call succeeds.
- Desired user-visible outcome: A short report demonstrating the translation contract (dot in list, underscore in call) with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if list entries don't use 2+ dots (different version) or both forms succeed (contract broken) or both forms fail (something else is wrong).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, enumerate ClickUp tools then translate one entry from list-form to call-form and verify the call works through Code Mode against the live registry. Verify the dot-to-underscore translation is required. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `list_tools()` — capture all entries
2. Pick the first entry with 2+ dots (e.g., `clickup.clickup.create_task` — note: this exact name depends on the MCP server output format)
3. `call_tool_chain({ code: "try { return await ${entry_dot_form}({}); } catch (e) { return { error: e.message }; }" })` — substitute the literal dot form
4. `call_tool_chain({ code: "try { return await ${entry_underscore_form}({}); } catch (e) { return { error: e.message }; }" })` — substitute the underscore-translated form

### Expected

- Step 1: returns array
- Step 2: at least one entry has 2+ dots
- Step 3: returns object with `error` key (dot form is not callable)
- Step 4: returns successful response or auth error (auth error still counts as PASS — the call form was accepted)

### Evidence

Capture the chosen entry literal, the dot-form error, and the underscore-form result.

### Pass / Fail

- **Pass**: Dot form errors AND underscore form is at minimum recognized (succeeds OR returns a non-naming error like auth).
- **Fail**: All `list_tools()` entries have only 1 dot (the contract may have changed in this Code Mode version — check skill docs); dot form succeeds (translation rule has changed); both forms fail (different problem — investigate).

### Failure Triage

1. If no entries have 2+ dots: read `.opencode/skill/mcp-code-mode/SKILL.md` line 232-233 for the current dot/underscore rule — the contract may have been simplified.
2. If dot form succeeds: the runtime is auto-translating — file an enhancement to clarify documentation, but treat as a PASS for tooling purposes.
3. If underscore form fails with "tool not found": cross-check via `tool_info({tool_name: <underscore_form>})` (CM-003) — confirm the canonical name.

### Optional Supplemental Checks

- Test multiple manuals (e.g., `figma`, `webflow`) to confirm the rule is uniform across servers.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Tool name translation rule (line 232-233) |

---

## 5. SOURCE METADATA

- Group: MANUAL NAMESPACE CONTRACT
- Playbook ID: CM-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--manual-namespace-contract/003-list-tools-dot-vs-underscore.md`
