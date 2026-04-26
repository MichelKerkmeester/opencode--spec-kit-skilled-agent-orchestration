---
title: "CU-023 -- clickup_manage_time_entries time tracking CRUD (MCP-only)"
description: "This scenario validates `clickup.clickup_manage_time_entries` for `CU-023`. It focuses on creating/reading/deleting a time entry on a task — an MCP-only feature with no `cu` CLI equivalent."
---

# CU-023 -- clickup_manage_time_entries time tracking CRUD (MCP-only)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-023`.

---

## 1. OVERVIEW

This scenario validates `clickup.clickup_manage_time_entries` for `CU-023`. It focuses on creating, reading, and deleting a time entry on a task via Code Mode. Time tracking is an MCP-only surface — no `cu` CLI equivalent.

### Why This Matters

Time tracking is core to billing and capacity workflows. Operators logging hours from CI / from automation need the MCP path; manual time entry through the web UI is too slow at scale. A FAIL here blocks any "log my time" automation pattern — which is one of the highest-value MCP-only use cases.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-023` and confirm the expected signals without contradictory evidence.

- Objective: Verify `clickup.clickup_manage_time_entries` can create, read, and delete a throwaway time entry on a test task AND no `cu` CLI command offers an equivalent.
- Real user request: `"Log 30 minutes against this task."`
- Prompt: `As a manual-testing orchestrator, create then read then delete a throwaway time entry on a test task using clickup.clickup_manage_time_entries through Code Mode against the live ClickUp API. Verify all three operations succeed. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: take a `<taskId>` (e.g., from CU-011 or a fresh throwaway); route through Code Mode `call_tool_chain`; supply a duration; verify each operation; confirm CLI absence.
- Expected signals: create returns time-entry id referencing the task; read returns the same entry with supplied duration; delete returns success and entry no longer appears for that task; CLI has no `cu time` / `cu track` command.
- Desired user-visible outcome: A short report quoting the time-entry id, three-operation verdict, and CLI-absence verdict.
- Pass/fail: PASS if all signals hold; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, create then read then delete a throwaway time entry on a test task using clickup.clickup_manage_time_entries through Code Mode against the live ClickUp API. Verify all three operations succeed. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "return clickup.clickup_manage_time_entries({ action: 'create', task_id: '<taskId>', duration_ms: 1800000, description: 'CU-023 throwaway 30 min' });" })` — create (1.8e6 ms = 30 min)
2. Extract the time-entry id
3. `call_tool_chain({ code: "return clickup.clickup_manage_time_entries({ action: 'read', entry_id: '<entryId>' });" })` — read back
4. `call_tool_chain({ code: "return clickup.clickup_manage_time_entries({ action: 'delete', entry_id: '<entryId>' });" })` — delete
5. `call_tool_chain({ code: "return clickup.clickup_manage_time_entries({ action: 'list', task_id: '<taskId>' });" })` — verify absent
6. `bash: cu --help 2>&1 | grep -iE 'time|track'` — confirm no CLI time command

### Expected

- Step 1: returns time-entry `id` referencing `<taskId>`
- Step 2: id extraction succeeds
- Step 3: read returns entry with supplied duration
- Step 4: delete returns success
- Step 5: list does not contain the entry for that task
- Step 6: no `cu time` / `cu track` command surfaces

### Evidence

Capture the verbatim Code Mode `code` argument and tool-call response for each chain call. Pin the time-entry id, three-operation verdict, and CLI-absence verdict.

### Pass / Fail

- **Pass**: All three operations succeed, post-delete list omits entry, CLI has no equivalent.
- **Fail**: Any operation fails, entry remains after delete, OR CLI equivalent found.

### Failure Triage

1. If create fails with "feature not available" or 403: time tracking may be plan-gated on the workspace; document as SKIP with the plan limitation as evidence.
2. If "tool not found" naming `clickup.clickup_manage_time_entries`: route to CM-005 (correct manual.tool form); verify with `list_tools()`.
3. If duration field is rejected: check `tool_info({tool_name:'clickup.clickup_manage_time_entries'})` for the canonical name (`duration_ms` vs `duration` vs `start`/`end` ts pair).
4. If post-delete list still shows the entry: eventual-consistency — wait 2 seconds and re-list.
5. If a `cu time` command IS found: capture and update Phase-1 inventory.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | MCP tool catalog (`clickup_manage_time_entries`) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (CLI vs MCP parity: time tracking MCP-only) |

---

## 5. SOURCE METADATA

- Group: MCP ENTERPRISE
- Playbook ID: CU-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--mcp-enterprise/004-mcp-manage-time-entries.md`
