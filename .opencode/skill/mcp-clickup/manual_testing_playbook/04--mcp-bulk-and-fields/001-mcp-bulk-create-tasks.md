---
title: "CU-017 -- clickup_create_bulk_tasks bulk create 5 tasks"
description: "This scenario validates `clickup.clickup_create_bulk_tasks` for `CU-017`. It focuses on creating 5 throwaway tasks in a single MCP tool call and verifying each is fetchable."
---

# CU-017 -- clickup_create_bulk_tasks bulk create 5 tasks

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-017`.

---

## 1. OVERVIEW

This scenario validates `clickup.clickup_create_bulk_tasks` for `CU-017`. It focuses on the MCP-only bulk-create surface — creating 5 throwaway tasks in a single tool call routed via Code Mode `call_tool_chain`. Cross-references CM-011 (sequential chain) and CM-012 (Promise.all parallel) for the orchestration patterns this builds on when used in larger workflows.

### Why This Matters

Bulk operations are the primary reason operators reach for the MCP path over the CLI. Doing 5 individual `cu create` calls is slow and rate-limit prone; a single `clickup_create_bulk_tasks` call is one HTTP round-trip. This scenario verifies the bulk endpoint actually batches and that every returned id refers to a real, fetchable task — protecting against silent partial failures.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-017` and confirm the expected signals without contradictory evidence.

- Objective: Verify `clickup.clickup_create_bulk_tasks` (called via Code Mode) returns 5 task objects with `id`, each is fetchable via `clickup.clickup_get_task`, and all are deletable in a follow-up cleanup.
- Real user request: `"Create 5 throwaway test tasks in my test list."`
- Prompt: `As a manual-testing orchestrator, create 5 throwaway test tasks in a designated test list using clickup.clickup_create_bulk_tasks through Code Mode against the live ClickUp API. Verify the response contains 5 task ids and each can be re-fetched. Cross-reference: CM-011 (sequential chain) and CM-012 (Promise.all parallel) for the multi-tool workflow patterns this builds on. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: route through Code Mode `call_tool_chain`; supply `<listId>` from CU-006; verify each id with `clickup_get_task`; clean up.
- Expected signals: array of 5 task objects with ids; each id fetches successfully; cleanup deletes all 5.
- Desired user-visible outcome: A short report listing the 5 task ids, the fetch verdict per id, and the cleanup verdict.
- Pass/fail: PASS if all three signals hold; FAIL on partial creation, unfetchable id, or cleanup failure.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, create 5 throwaway test tasks in a designated test list using clickup.clickup_create_bulk_tasks through Code Mode against the live ClickUp API. Verify the response contains 5 task ids and each can be re-fetched. Cross-reference: CM-011 (sequential chain) and CM-012 (Promise.all parallel) for the multi-tool workflow patterns this builds on. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "const r = await clickup.clickup_create_bulk_tasks({ list_id: '<listId>', tasks: [{name:'CU-017 t1'},{name:'CU-017 t2'},{name:'CU-017 t3'},{name:'CU-017 t4'},{name:'CU-017 t5'}] }); return r;" })` — bulk create
2. Extract 5 task ids from the response
3. `call_tool_chain({ code: "return Promise.all(['id1','id2','id3','id4','id5'].map(id => clickup.clickup_get_task({ task_id: id })));" })` — verify each (substitute the captured ids; cross-reference CM-012 for `Promise.all` semantics)
4. Cleanup: `call_tool_chain({ code: "return Promise.all([...ids].map(id => clickup.clickup_delete_task({ task_id: id })));" })`

### Expected

- Step 1: returns an array of 5 task objects, each with `id`
- Step 2: 5 ids extracted cleanly
- Step 3: every fetch returns a task with matching id and name
- Step 4: every delete returns success

### Evidence

Capture the verbatim Code Mode `code` argument and tool-call response for each of the 4 chain calls. Pin the 5 created task ids (REDACTED if sensitive) and the cleanup verdict per id.

### Pass / Fail

- **Pass**: 5 tasks created, all 5 fetchable, all 5 deleted in cleanup.
- **Fail**: Bulk-create returns fewer than 5, any id unfetchable, or cleanup fails for any id.

### Failure Triage

1. If bulk-create returns fewer than 5 silently: this is a partial-failure smell — check the response shape for a `failed` or `errors` field; the MCP server should enumerate any skipped items, not silently truncate.
2. If a fetch fails with "tool not found" naming `clickup.clickup_create_bulk_tasks`: route to CM-005 (correct manual.tool form) — the underscore-form name may be wrong; verify with `list_tools()`.
3. If a fetch returns 401 or auth error: route to CU-027 (env-prefix mismatch) and CM-008 (prefixed env load) — the MCP server may not have received the prefixed `clickup_CLICKUP_API_KEY`.
4. If cleanup leaves orphan tasks: manually delete via `cu delete <id> --confirm` per CU-026 protocol, and document the failed cleanup in evidence.

### Optional Supplemental Checks

- Compare wall time of bulk-create (1 chain call) vs 5 individual creates routed via `Promise.all` per CM-012 — record the speedup as evidence of the bulk endpoint's value.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | MCP tool catalog (`clickup_create_bulk_tasks`) |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/04--multi-tool-workflows/001-sequential-chain.md` | CM-011 sequential chain pattern |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/04--multi-tool-workflows/002-promise-all-parallel.md` | CM-012 Promise.all parallel pattern |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (MCP tools, bulk) |

---

## 5. SOURCE METADATA

- Group: MCP BULK AND FIELDS
- Playbook ID: CU-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--mcp-bulk-and-fields/001-mcp-bulk-create-tasks.md`
