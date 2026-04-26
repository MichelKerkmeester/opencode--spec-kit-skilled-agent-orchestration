---
title: "CU-022 -- clickup_manage_webhooks webhook CRUD (MCP-only)"
description: "This scenario validates `clickup.clickup_manage_webhooks` for `CU-022`. It focuses on webhook register/read/delete — an MCP-only feature with no `cu` CLI equivalent."
---

# CU-022 -- clickup_manage_webhooks webhook CRUD (MCP-only)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-022`.

---

## 1. OVERVIEW

This scenario validates `clickup.clickup_manage_webhooks` for `CU-022`. It focuses on registering, reading, and deleting a webhook via Code Mode. Webhooks are an MCP-only surface — no `cu` CLI equivalent.

### Why This Matters

Webhooks let ClickUp push task / comment events to external systems. The MCP path is the only programmatic registration channel, making it foundational for any event-driven integration. A FAIL here blocks a major workflow class — automation triggered by ClickUp activity.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-022` and confirm the expected signals without contradictory evidence.

- Objective: Verify `clickup.clickup_manage_webhooks` can register, read, and delete a throwaway webhook AND no `cu` CLI command offers an equivalent.
- Real user request: `"Register a webhook for task updates, then remove it."`
- Prompt: `As a manual-testing orchestrator, register then read then delete a throwaway webhook using clickup.clickup_manage_webhooks through Code Mode against the live ClickUp API. Verify all three operations succeed. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: route through Code Mode `call_tool_chain`; supply a throwaway endpoint URL (use a public test sink like `https://webhook.site/<unique-id>`); verify each operation; confirm CLI absence.
- Expected signals: register returns webhook id + endpoint; read returns same webhook; delete returns success and webhook is no longer listed; CLI has no `cu webhook` / `cu webhooks` command.
- Desired user-visible outcome: A short report quoting webhook id, three-operation verdict, and CLI-absence verdict.
- Pass/fail: PASS if all signals hold; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, register then read then delete a throwaway webhook using clickup.clickup_manage_webhooks through Code Mode against the live ClickUp API. Verify all three operations succeed. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "return clickup.clickup_manage_webhooks({ action: 'create', endpoint: 'https://webhook.site/<unique-test-id>', events: ['taskUpdated'] /* and workspace fields per tool_info */ });" })` — register
2. Extract the webhook id
3. `call_tool_chain({ code: "return clickup.clickup_manage_webhooks({ action: 'read', webhook_id: '<webhookId>' });" })` — read back
4. `call_tool_chain({ code: "return clickup.clickup_manage_webhooks({ action: 'delete', webhook_id: '<webhookId>' });" })` — delete
5. `call_tool_chain({ code: "return clickup.clickup_manage_webhooks({ action: 'list' });" })` — verify absent
6. `bash: cu --help 2>&1 | grep -i 'webhook'` — confirm no CLI webhook command

### Expected

- Step 1: returns webhook `id` and `endpoint`
- Step 2: id extraction succeeds
- Step 3: read returns webhook with supplied endpoint + events
- Step 4: delete returns success
- Step 5: list omits the webhook
- Step 6: no `cu webhook` / `cu webhooks` command surfaces

### Evidence

Capture the verbatim Code Mode `code` argument and tool-call response for each chain call. Pin the webhook id (REDACTED if endpoint is sensitive), three-operation verdict, and CLI-absence verdict.

### Pass / Fail

- **Pass**: All three operations succeed, post-delete list omits webhook, CLI has no equivalent.
- **Fail**: Any operation fails, webhook remains after delete, OR CLI equivalent found.

### Failure Triage

1. If register fails with "endpoint unreachable" or HTTPS error: ClickUp validates the endpoint at register time; ensure the URL is HTTPS and reachable from the public internet — `https://webhook.site/<id>` is a reliable throwaway sink.
2. If "tool not found" naming `clickup.clickup_manage_webhooks`: route to CM-005 (correct manual.tool form); verify with `list_tools()`.
3. If 403 on register: webhooks may require workspace owner / admin permissions — confirm the configured token's role.
4. If post-delete list still shows the webhook: eventual-consistency issue — wait 2 seconds and re-list.
5. If a `cu webhook` command IS found: capture and update Phase-1 inventory.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | MCP tool catalog (`clickup_manage_webhooks`) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (CLI vs MCP parity: webhooks MCP-only) |

---

## 5. SOURCE METADATA

- Group: MCP ENTERPRISE
- Playbook ID: CU-022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--mcp-enterprise/003-mcp-manage-webhooks.md`
