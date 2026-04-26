---
title: "CM-011 -- Sequential chain"
description: "This scenario validates a sequential tool chain for `CM-011`. It focuses on confirming that `call_tool_chain` can execute two tools in order with the second consuming the first's output."
---

# CM-011 -- Sequential chain

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-011`.

---

## 1. OVERVIEW

This scenario validates a sequential chain for `CM-011`. It focuses on confirming that `call_tool_chain` can run two tools in order — passing the first call's output as input to the second — within a single Code Mode execution.

### Why This Matters

Sequential chains are the basic primitive for any non-trivial workflow (e.g., "list teams, then list spaces in the first team"). If sequencing breaks, every multi-step playbook scenario in BDG, CU, and external workflows is unverifiable. CU-017..CU-019 cross-reference this contract for bulk operations.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-011` and confirm the expected signals without contradictory evidence.

- Objective: Verify a chain calling `clickup_get_teams` then `clickup_get_spaces({team_id})` (using the first team's id) returns both results.
- Real user request: `"List the spaces in my first ClickUp workspace."`
- Prompt: `As a manual-testing orchestrator, call clickup_get_teams then use the first team's id to call clickup_get_spaces({team_id}) in a single call_tool_chain execution against the live ClickUp API. Verify both calls succeed and the second returns spaces for the first team. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: single `call_tool_chain` invocation containing both calls in sequence with await.
- Expected signals: chain returns object with both call results; spaces array is non-empty (assuming the first team has at least one space); spaces reference the first team's id.
- Desired user-visible outcome: A short report listing the team id and number of spaces and a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if chain returns only the first call's result (sequencing broke), or the second call uses a wrong team id (output threading broke).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, call clickup_get_teams then use the first team's id to call clickup_get_spaces({team_id}) in a single call_tool_chain execution against the live ClickUp API. Verify both calls succeed and the second returns spaces for the first team. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "const teams = await clickup.clickup_get_teams({}); const team_id = teams.teams[0].id; const spaces = await clickup.clickup_get_spaces({ team_id }); return { team_id, spaces };" })`
2. Inspect the returned object

### Expected

- Step 1: chain returns object with `team_id` and `spaces` keys
- Step 2: `team_id` is a non-empty string
- Step 2: `spaces` is an object with a non-empty `spaces` array (or `members` / response shape per current API; verify with `tool_info` per CM-003 if needed)

### Evidence

Capture the verbatim chain return value, including the team id used and the space count.

### Pass / Fail

- **Pass**: Both calls executed; second call references the first team's id; non-empty space response.
- **Fail**: Chain returns only the first call (await/sequencing broken); spaces returned for a different team id (output threading broken); spaces array is empty (account has no spaces — verify via ClickUp web UI before claiming FAIL).

### Failure Triage

1. If chain returns only first call: check that the snippet uses `await` for both calls; the second `await` may be silently dropped. Try rewriting without const intermediates.
2. If spaces array is empty: log into ClickUp web UI to confirm the first team has spaces; if it does, this is an MCP-server bug.
3. If `team_id` is undefined: the response shape from `clickup_get_teams` may have changed; call `tool_info({tool_name: "clickup.clickup_get_teams"})` (CM-003) to inspect the schema.

### Optional Supplemental Checks

- Add a third call to the chain (e.g., `clickup_get_lists({space_id})`) to confirm three-step sequencing works.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | call_tool_chain spec |
| `.opencode/skill/mcp-clickup/SKILL.md` | ClickUp tool catalog (get_teams, get_spaces) |

---

## 5. SOURCE METADATA

- Group: MULTI-TOOL WORKFLOWS
- Playbook ID: CM-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--multi-tool-workflows/001-sequential-chain.md`
