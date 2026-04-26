---
title: "CM-014 -- ClickUp create-read-delete"
description: "This scenario validates the ClickUp create-then-read-then-delete round trip via Code Mode for `CM-014`. It focuses on confirming the round-trip values match and cleanup succeeds in a single chain."
---

# CM-014 -- ClickUp create-read-delete

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-014`.

---

## 1. OVERVIEW

This scenario validates the ClickUp create-then-read-then-delete round trip via Code Mode for `CM-014`. It focuses on confirming a chain can create a task, fetch it back to verify the write succeeded, then delete it for cleanup — all in a single `call_tool_chain` execution against the live ClickUp API.

### Why This Matters

This is the canonical write-path test for the ClickUp-via-Code-Mode integration. CU-017..CU-019 reference this pattern for bulk operations. The cleanup step is critical: without it, every test run leaves orphaned tasks in the operator's workspace.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-014` and confirm the expected signals without contradictory evidence.

- Objective: Verify `clickup_create_task` followed by `clickup_get_task` returns the created task; `clickup_delete_task` removes it.
- Real user request: `"Create a test task, confirm it exists, then clean it up."`
- Prompt: `As a manual-testing orchestrator, create a throwaway test task in a designated test list, then read it back, then delete it through Code Mode against the live ClickUp API. Verify the round-trip values match (name, list_id) and cleanup succeeds. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: single `call_tool_chain` invocation; require an existing test list id (the operator must provide one — production lists are unsafe).
- Expected signals: create returns task with `id`; get returns task with same `id` and matching `name`; delete returns success.
- Desired user-visible outcome: A short report quoting the test task id and confirming round-trip + cleanup with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if create fails (auth/permission), get returns wrong task or empty (write didn't propagate), or delete fails (orphaned task — manual cleanup required).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, create a throwaway test task in a designated test list, then read it back, then delete it through Code Mode against the live ClickUp API. Verify the round-trip values match (name, list_id) and cleanup succeeds. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Confirm a test list id is available (operator-provided; e.g., `TEST_LIST_ID=901234567890`)
2. `call_tool_chain({ code: "const created = await clickup.clickup_create_task({ list_id: '${TEST_LIST_ID}', name: 'CM-014 smoke test' }); const fetched = await clickup.clickup_get_task({ task_id: created.id }); const deleted = await clickup.clickup_delete_task({ task_id: created.id }); return { created_id: created.id, fetched_name: fetched.name, deleted: deleted.success || true };" })`
3. Inspect the returned object

### Expected

- Step 2: chain returns object with `created_id`, `fetched_name`, `deleted`
- Step 3: `created_id` is non-empty
- Step 3: `fetched_name` === `"CM-014 smoke test"`
- Step 3: `deleted` is true (or non-error)

### Evidence

Capture the chain response, the test list id used (REDACTED if needed), the created task id, and the cleanup confirmation.

### Pass / Fail

- **Pass**: All three round-trip values match AND delete succeeded.
- **Fail**: Create fails (check token has create-task permission per CM-008); get returns wrong task (id mismatch is a serious bug); delete fails (orphaned task — manually delete via web UI before re-running).

### Failure Triage

1. If create fails with "list not found": confirm `TEST_LIST_ID` is a real list the token has access to; cross-check via `clickup_get_lists` first.
2. If get returns wrong name: this is an MCP-server bug — escalate with the chain transcript.
3. If delete fails: manually delete the created task via ClickUp web UI to prevent orphans; then check token has delete-task permission (some workspaces restrict delete to owners).

### Optional Supplemental Checks

- Add a comment then delete the task with comments; verifies cascade-delete behavior.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | ClickUp tool catalog (create_task, get_task, delete_task) |

---

## 5. SOURCE METADATA

- Group: CLICKUP AND CHROME VIA CM
- Playbook ID: CM-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--clickup-and-chrome-via-cm/001-clickup-create-read-delete.md`
