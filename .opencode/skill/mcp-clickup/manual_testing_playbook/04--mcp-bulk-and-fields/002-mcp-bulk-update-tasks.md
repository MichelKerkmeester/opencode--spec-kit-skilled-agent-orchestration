---
title: "CU-018 -- clickup_update_bulk_tasks bulk update"
description: "This scenario validates `clickup.clickup_update_bulk_tasks` for `CU-018`. It focuses on bulk-updating the status of 5 throwaway tasks (created by CU-017) in a single MCP tool call."
---

# CU-018 -- clickup_update_bulk_tasks bulk update

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-018`.

---

## 1. OVERVIEW

This scenario validates `clickup.clickup_update_bulk_tasks` for `CU-018`. It focuses on the MCP-only bulk-update surface — updating 5 throwaway tasks' statuses in a single tool call. Cross-references CM-011 (sequential chain) and CM-012 (Promise.all parallel) for the orchestration patterns this builds on.

### Why This Matters

Bulk update completes the bulk-write story alongside CU-017. Operators frequently need to mass-transition tasks between statuses (e.g., end-of-sprint cleanup, reorganization). A single `clickup_update_bulk_tasks` call instead of 5 individual `clickup_update_task` calls saves both wall time and API quota. The scenario also verifies that any partial failures are enumerated in the response — silent skips are a critical bug.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-018` and confirm the expected signals without contradictory evidence.

- Objective: Verify `clickup.clickup_update_bulk_tasks` (called via Code Mode) updates the status of 5 throwaway tasks AND any failures are enumerated, not silently dropped.
- Real user request: `"Mass-update these 5 tasks to in-progress."`
- Prompt: `As a manual-testing orchestrator, bulk-update the status of 5 throwaway tasks (created by CU-017) using clickup.clickup_update_bulk_tasks through Code Mode against the live ClickUp API. Verify each task's status reflects the new value. Cross-reference: CM-011 (sequential chain) and CM-012 (Promise.all parallel) for orchestration of multi-task updates. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: depend on CU-017 having created 5 tasks; route through Code Mode `call_tool_chain`; verify per-task status with `clickup_get_task`.
- Expected signals: bulk update returns success for all 5; each `clickup_get_task` shows the new status; any partial failures are listed in the response.
- Desired user-visible outcome: A short report quoting the per-task verdict and a PASS verdict.
- Pass/fail: PASS if all 5 succeed; FAIL on any silent skip, missing per-task verdict, or status-not-applied.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, bulk-update the status of 5 throwaway tasks (created by CU-017) using clickup.clickup_update_bulk_tasks through Code Mode against the live ClickUp API. Verify each task's status reflects the new value. Cross-reference: CM-011 (sequential chain) and CM-012 (Promise.all parallel) for orchestration of multi-task updates. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. CU-017 must have run successfully and the 5 task ids retained
2. `call_tool_chain({ code: "return clickup.clickup_update_bulk_tasks({ tasks: [{task_id:'id1', status:'<list-valid>'}, ...x5] });" })` — bulk update (substitute the 5 ids and a list-valid status)
3. `call_tool_chain({ code: "return Promise.all(['id1','id2','id3','id4','id5'].map(id => clickup.clickup_get_task({ task_id: id })));" })` — verify each status (cross-reference CM-012)
4. Inspect the bulk-update response for any `failed` / `errors` field

### Expected

- Step 1: 5 task ids carried over from CU-017
- Step 2: bulk update returns success for all 5 OR explicitly enumerates any failure
- Step 3: every fetched task shows the new status
- Step 4: no silent partial failure

### Evidence

Capture the verbatim Code Mode `code` argument and tool-call response for the bulk-update call AND the per-task verification chain. Pin the per-task status verdict for each of the 5 ids.

### Pass / Fail

- **Pass**: All 5 tasks updated, all 5 verifications match, no silent skips.
- **Fail**: Any task not updated, any verification mismatch, OR a silent skip (response does not enumerate the missing task).

### Failure Triage

1. If bulk-update returns success but a verification fails: check whether the bulk endpoint returned a `failed` array — if absent, this is a critical silent-skip bug; capture both response and failed verification and escalate.
2. If "invalid status" error: cross-reference CU-012 — list-valid statuses vary; pull a valid status name from the list before retrying.
3. If "tool not found" naming `clickup.clickup_update_bulk_tasks`: route to CM-005 (correct manual.tool form); the underscore-form may be wrong.
4. If auth error: route to CU-027 + CM-008 — env-var prefix may be wrong.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | MCP tool catalog (`clickup_update_bulk_tasks`) |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/04--multi-tool-workflows/001-sequential-chain.md` | CM-011 sequential chain pattern |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/04--multi-tool-workflows/002-promise-all-parallel.md` | CM-012 Promise.all parallel pattern |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (MCP tools, bulk) |

---

## 5. SOURCE METADATA

- Group: MCP BULK AND FIELDS
- Playbook ID: CU-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--mcp-bulk-and-fields/002-mcp-bulk-update-tasks.md`
