---
title: "CU-021 -- clickup_manage_goals goal CRUD (MCP-only)"
description: "This scenario validates `clickup.clickup_manage_goals` for `CU-021`. It focuses on goal create/read/delete — an MCP-only feature with no `cu` CLI equivalent."
---

# CU-021 -- clickup_manage_goals goal CRUD (MCP-only)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-021`.

---

## 1. OVERVIEW

This scenario validates `clickup.clickup_manage_goals` for `CU-021`. It focuses on the create/read/delete lifecycle of a ClickUp Goal via Code Mode. Goals are an MCP-only surface — no `cu` CLI equivalent.

### Why This Matters

Goals are the OKR / milestone tracking surface in ClickUp. Operators driving quarterly reviews from the terminal need this MCP path. A FAIL here proves either the upstream MCP server lacks the goal tool or the workspace lacks Goals access (Goals require certain ClickUp plans), both of which need to be surfaced clearly.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-021` and confirm the expected signals without contradictory evidence.

- Objective: Verify `clickup.clickup_manage_goals` can create, read, and delete a throwaway goal AND no `cu` CLI command offers an equivalent.
- Real user request: `"Create a quarterly goal and then remove it again."`
- Prompt: `As a manual-testing orchestrator, create then read then delete a throwaway ClickUp goal using clickup.clickup_manage_goals through Code Mode against the live ClickUp API. Verify all three operations succeed. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: route through Code Mode `call_tool_chain`; supply throwaway name + target; verify each operation; confirm CLI absence.
- Expected signals: create returns goal id; read returns same goal with name + target; delete returns success; subsequent list omits the goal; CLI has no `cu goal` / `cu goals` command.
- Desired user-visible outcome: A short report quoting the goal id, three-operation verdict, and CLI-absence verdict.
- Pass/fail: PASS if all signals hold; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, create then read then delete a throwaway ClickUp goal using clickup.clickup_manage_goals through Code Mode against the live ClickUp API. Verify all three operations succeed. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "return clickup.clickup_manage_goals({ action: 'create', name: 'CU-021 throwaway', target: 100 /* and required workspace fields per tool_info */ });" })` — create
2. Extract the goal id
3. `call_tool_chain({ code: "return clickup.clickup_manage_goals({ action: 'read', goal_id: '<goalId>' });" })` — read back
4. `call_tool_chain({ code: "return clickup.clickup_manage_goals({ action: 'delete', goal_id: '<goalId>' });" })` — delete
5. `call_tool_chain({ code: "return clickup.clickup_manage_goals({ action: 'list' });" })` — verify absent
6. `bash: cu --help 2>&1 | grep -i 'goal'` — confirm no CLI goal command

### Expected

- Step 1: returns goal `id`
- Step 2: id extraction succeeds
- Step 3: read returns goal with supplied name + target
- Step 4: delete returns success
- Step 5: list omits the goal
- Step 6: no `cu goal` / `cu goals` command surfaces

### Evidence

Capture the verbatim Code Mode `code` argument and tool-call response for each chain call. Pin the goal id, three-operation verdict, and CLI-absence verdict.

### Pass / Fail

- **Pass**: All three operations succeed, post-delete list omits goal, CLI has no equivalent.
- **Fail**: Any operation fails, goal remains after delete, OR CLI equivalent found.

### Failure Triage

1. If create fails with "feature not available" or 403: the workspace's ClickUp plan may not include Goals (per Phase-1 inventory: enterprise features may be plan-gated); document as SKIP with the plan limitation as evidence.
2. If "tool not found" naming `clickup.clickup_manage_goals`: route to CM-005 (correct manual.tool form); verify with `list_tools()`.
3. If `action` parameter rejected: check `tool_info({tool_name:'clickup.clickup_manage_goals'})` — the API may use separate tools per action.
4. If post-delete list still shows the goal: this is an eventual-consistency issue or a critical bug — wait 2 seconds and re-list.
5. If a `cu goal` command IS found: capture and update Phase-1 inventory.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | MCP tool catalog (`clickup_manage_goals`) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (CLI vs MCP parity: goals MCP-only) |

---

## 5. SOURCE METADATA

- Group: MCP ENTERPRISE
- Playbook ID: CU-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--mcp-enterprise/002-mcp-manage-goals.md`
