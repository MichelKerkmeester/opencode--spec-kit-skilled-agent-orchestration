---
title: "CM-005 -- Correct manual.tool form"
description: "This scenario validates the canonical manual.manual_tool naming form for `CM-005`. It focuses on confirming that calling a tool with the correct `manual.manual_tool` namespace (e.g., `clickup.clickup_get_teams`) succeeds and returns expected data."
---

# CM-005 -- Correct manual.tool form

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-005`.

---

## 1. OVERVIEW

This scenario validates the correct manual.tool form for `CM-005`. It focuses on confirming that the canonical `manual.manual_tool` naming pattern (manual prefix duplicated, joined by underscore to the tool action) is the form Code Mode accepts and returns useful results.

### Why This Matters

This is the foundational contract referenced by every other MCP scenario in this playbook and by BDG/CU MCP scenarios. The naming pattern is non-obvious — operators frequently call `clickup.create_task` (missing the duplicated manual prefix) and get a "tool not found" error. This scenario establishes the canonical form so other scenarios can cite it.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CM-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify `clickup.clickup_get_teams({})` returns workspace team data without error.
- Real user request: `"List my ClickUp workspaces."`
- Prompt: `As a manual-testing orchestrator, call the ClickUp get_teams tool using the canonical clickup.clickup_get_teams({}) form through Code Mode against the live ClickUp MCP server. Verify the call succeeds and returns workspace team data. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: invoke via `call_tool_chain` with a snippet calling the canonical form.
- Expected signals: tool returns without error; response contains team objects with `id` and `name`; at least one team present.
- Desired user-visible outcome: A short report listing the team names found and a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if call returns "tool not found" (likely a naming error), authentication error (likely an env-var error per CM-008), or empty teams (account has no workspaces).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, call the ClickUp get_teams tool using the canonical clickup.clickup_get_teams({}) form through Code Mode against the live ClickUp MCP server. Verify the call succeeds and returns workspace team data. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "return await clickup.clickup_get_teams({});" })`
2. Inspect the response for `teams` array

### Expected

- Step 1: chain returns successfully (no "tool not found" or compile error)
- Step 2: response contains team objects, each with `id` and `name` fields
- Step 2: array length >= 1 (assuming the operator has at least one workspace)

### Evidence

Capture the verbatim chain response (with sensitive workspace names REDACTED if needed) and the count of teams.

### Pass / Fail

- **Pass**: Tool call succeeded; teams array has >= 1 entry with `id` and `name`.
- **Fail**: "Tool not found" error (naming contract violated; should be impossible since we used the canonical form), auth error (cross-check CM-008), or unexpected schema.

### Failure Triage

1. If "tool not found": check `list_tools()` (CM-001) to confirm `clickup.clickup_get_teams` is in the registry; if absent, the ClickUp MCP server is not loaded — check `.utcp_config.json` for the `clickup` entry.
2. If auth error: check `echo $clickup_CLICKUP_API_KEY` shows a value; cross-reference CM-008 for env-var prefixing setup.
3. If teams array is empty: log into ClickUp web UI to confirm the account actually has workspaces; if it does, this is an MCP-server bug.

### Optional Supplemental Checks

- Compare against the wrong form (`clickup.get_teams` without prefix) — should fail per CM-006.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Manual-namespace contract (line 195-216) |
| `.opencode/skill/mcp-clickup/SKILL.md` | ClickUp MCP tool catalog |

---

## 5. SOURCE METADATA

- Group: MANUAL NAMESPACE CONTRACT
- Playbook ID: CM-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--manual-namespace-contract/001-correct-manual-tool-form.md`
