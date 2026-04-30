---
title: "CLU-009 -- MCP comment lifecycle"
description: "This scenario validates ClickUp MCP comment create, read, update, and delete through Code Mode."
---

# CLU-009 -- MCP comment lifecycle

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-009`.

---

## 1. OVERVIEW

This scenario validates the richer MCP comment lifecycle through Code Mode using `clickup.clickup_manage_comments`.

### Why This Matters

The historical skill documents MCP as the path for full comment lifecycle behavior, beyond the CLI add/read workflow.

---

## 2. SCENARIO CONTRACT

- Objective: Create, read, update, and delete a ClickUp comment through Code Mode.
- Real user request: `Use the ClickUp MCP integration to test full comment lifecycle on a disposable task.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, use Code Mode to create a disposable task, create a comment with clickup_manage_comments, read it back, update it, delete it, then delete the task. Capture IDs and cleanup proof, and return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: Single Code Mode chain handles task setup, comment lifecycle, and cleanup.
- Expected signals: created comment ID exists; read/update responses reference the same comment; delete succeeds.
- Desired user-visible outcome: A short report confirming full comment lifecycle and cleanup.
- Pass/fail: PASS if all lifecycle steps and cleanup succeed; FAIL if any operation fails or cleanup is incomplete.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm Code Mode can discover ClickUp tools.
2. Use a disposable test list.
3. Run a single chain and inspect returned IDs.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-009 | MCP comment lifecycle | Confirm create/read/update/delete comments through MCP | `As a ClickUp manual-testing orchestrator, use Code Mode to create a disposable task, create a comment with clickup_manage_comments, read it back, update it, delete it, then delete the task. Capture IDs and cleanup proof, and return a concise user-facing pass/fail verdict with the main reason.` | 1. `Code Mode: search_tools({ task_description: "clickup manage comments", limit: 5 })` -> 2. `Code Mode: call_tool_chain({ code: "const name = 'CLU-009 comment ' + Date.now(); const task = await clickup.clickup_create_task({ listId: process.env.CLICKUP_PLAYBOOK_TEST_LIST_ID, name }); const created = await clickup.clickup_manage_comments({ action: 'create', task: task.id, comment_text: 'CLU-009 initial' }); const listed = await clickup.clickup_manage_comments({ action: 'get', task: task.id }); const updated = await clickup.clickup_manage_comments({ action: 'update', task: task.id, comment_id: created.id, comment_text: 'CLU-009 updated' }); const deleted = await clickup.clickup_manage_comments({ action: 'delete', task: task.id, comment_id: created.id }); await clickup.clickup_delete_task({ task: task.id }); return { task_id: task.id, comment_id: created.id, listed, updated, deleted };" })` | Discovery shows comment tool; chain returns task/comment IDs; update and delete are non-error; task cleanup is non-error | Code Mode transcript with IDs redacted if needed | PASS if lifecycle and cleanup succeed; FAIL if tool missing, auth fails, or cleanup incomplete | 1. Verify Code Mode ClickUp manual is configured; 2. Verify `CODEMODE_CLICKUP_API_KEY` and `CODEMODE_CLICKUP_TEAM_ID`; 3. If cleanup fails, delete the task in ClickUp UI |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Current Code Mode invocation and naming rules |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/references/tool_reference.md` | Historical MCP comment tool reference |

---

## 5. SOURCE METADATA

- Group: COMMENTS AND THREADS
- Playbook ID: CLU-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--comments-and-threads/002-mcp-comment-lifecycle.md`

