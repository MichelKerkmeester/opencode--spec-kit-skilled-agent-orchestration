---
title: "CU-019 -- clickup_manage_custom_fields custom field CRUD"
description: "This scenario validates `clickup.clickup_manage_custom_fields` for `CU-019`. It focuses on creating, reading, updating, and deleting a custom field on a designated test list."
---

# CU-019 -- clickup_manage_custom_fields custom field CRUD

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-019`.

---

## 1. OVERVIEW

This scenario validates `clickup.clickup_manage_custom_fields` for `CU-019`. It focuses on the full lifecycle of a custom field on a list — create, read, update, delete — routed through Code Mode `call_tool_chain`. Cross-references CM-011 (sequential chain) for the chained CRUD pattern.

### Why This Matters

Custom fields are essential for ClickUp power users — they capture domain-specific data (e.g., bug severity, sprint number) that statuses and tags cannot. The MCP surface offers richer custom-field control than the CLI (per Phase-1 inventory: "Custom fields: CLI basic, MCP full CRUD"). This scenario locks the contract that all four CRUD operations work end-to-end through the single `manage_custom_fields` tool.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-019` and confirm the expected signals without contradictory evidence.

- Objective: Verify `clickup.clickup_manage_custom_fields` can create, read, update, and delete a custom field on a designated test list, returning a deterministic outcome at each step.
- Real user request: `"Add a custom field for sprint number, then remove it again."`
- Prompt: `As a manual-testing orchestrator, create then update then delete a custom field on a designated test list using clickup.clickup_manage_custom_fields through Code Mode against the live ClickUp API. Verify all four operations succeed. Cross-reference: CM-011 (sequential chain) for the chained CRUD pattern. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: chain create → read → update → delete inside `call_tool_chain` (per CM-011 sequential pattern); each step depends on the previous step's output.
- Expected signals: create returns field id; read returns same field with supplied name+type; update reflects on subsequent read; delete returns success and field is no longer listed.
- Desired user-visible outcome: A short report quoting the field id, the four-step verdict, and a PASS verdict.
- Pass/fail: PASS if all four operations succeed; FAIL on any step.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, create then update then delete a custom field on a designated test list using clickup.clickup_manage_custom_fields through Code Mode against the live ClickUp API. Verify all four operations succeed. Cross-reference: CM-011 (sequential chain) for the chained CRUD pattern. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "const c = await clickup.clickup_manage_custom_fields({ action: 'create', list_id: '<listId>', name: 'CU-019 sprint num', type: 'number' }); const r = await clickup.clickup_manage_custom_fields({ action: 'read', list_id: '<listId>', field_id: c.id }); return { create: c, read: r };" })` — create + read
2. `call_tool_chain({ code: "return clickup.clickup_manage_custom_fields({ action: 'update', list_id: '<listId>', field_id: '<fieldId>', name: 'CU-019 sprint number' });" })` — update
3. `call_tool_chain({ code: "return clickup.clickup_manage_custom_fields({ action: 'read', list_id: '<listId>', field_id: '<fieldId>' });" })` — confirm update
4. `call_tool_chain({ code: "return clickup.clickup_manage_custom_fields({ action: 'delete', list_id: '<listId>', field_id: '<fieldId>' });" })` — delete
5. `call_tool_chain({ code: "return clickup.clickup_manage_custom_fields({ action: 'list', list_id: '<listId>' });" })` — verify field no longer listed

### Expected

- Step 1: create returns field `id`; read returns the same field with supplied name + type
- Step 2: update returns success
- Step 3: read returns the new name
- Step 4: delete returns success
- Step 5: list does not contain the deleted field

### Evidence

Capture the verbatim Code Mode `code` argument and tool-call response for each of the 5 chain calls. Pin the field id and the verdict for each operation.

### Pass / Fail

- **Pass**: All four CRUD operations succeed AND the post-delete list omits the field.
- **Fail**: Any step fails OR the field remains in the post-delete list.

### Failure Triage

1. If create returns "list not found": confirm `<listId>` from CU-006 is current and visible to the configured token; the bulk operations from CU-017 may have left it in an unexpected state.
2. If update / delete returns "field not found": the field id may have been mistyped — re-run step 1 to capture a fresh id.
3. If list still shows the deleted field: this is an eventual-consistency issue or a critical bug — wait 2 seconds and re-list; if still present, capture and escalate.
4. If "tool not found" naming `clickup.clickup_manage_custom_fields`: route to CM-005 (correct manual.tool form) and verify with `list_tools()`.
5. If `action` parameter is rejected: check the actual MCP tool signature via `tool_info({tool_name:'clickup.clickup_manage_custom_fields'})` — the API may use separate tools per action instead of an action discriminator.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | MCP tool catalog (`clickup_manage_custom_fields`) |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/04--multi-tool-workflows/001-sequential-chain.md` | CM-011 sequential chain pattern |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (MCP tools, custom fields) |

---

## 5. SOURCE METADATA

- Group: MCP BULK AND FIELDS
- Playbook ID: CU-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--mcp-bulk-and-fields/003-mcp-custom-fields-crud.md`
