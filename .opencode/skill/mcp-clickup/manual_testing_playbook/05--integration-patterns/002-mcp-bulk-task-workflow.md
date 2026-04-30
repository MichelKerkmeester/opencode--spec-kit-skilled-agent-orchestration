---
title: "CLU-011 -- MCP bulk task workflow"
description: "This scenario validates ClickUp MCP bulk create/read/delete behavior through Code Mode."
---

# CLU-011 -- MCP bulk task workflow

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-011`.

---

## 1. OVERVIEW

This scenario validates the MCP bulk task path documented for Code Mode. It creates two throwaway tasks, verifies both, and cleans them up.

### Why This Matters

Bulk task operations are one of the reasons the ClickUp skill routes to MCP instead of the CLI.

---

## 2. SCENARIO CONTRACT

- Objective: Bulk-create two disposable tasks, read them, and delete them.
- Real user request: `Create two ClickUp test tasks at once through MCP, verify them, then clean them up.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, use Code Mode to bulk-create two uniquely named disposable ClickUp tasks in the configured test list, fetch both tasks back, delete both tasks, and return a concise user-facing pass/fail verdict with IDs and cleanup status.`
- Expected execution process: Single Code Mode chain with bulk create, reads, and cleanup.
- Expected signals: two task IDs returned; both read backs match names; both deletes are non-error.
- Desired user-visible outcome: A short report with count and cleanup proof.
- Pass/fail: PASS if two tasks are created, verified, and deleted; FAIL if count, readback, or cleanup is wrong.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm test list ID is set.
2. Run the Code Mode chain.
3. Verify returned count and cleanup signals.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-011 | MCP bulk task workflow | Confirm bulk create/read/delete through MCP | `As a ClickUp manual-testing orchestrator, use Code Mode to bulk-create two uniquely named disposable ClickUp tasks in the configured test list, fetch both tasks back, delete both tasks, and return a concise user-facing pass/fail verdict with IDs and cleanup status.` | 1. `Code Mode: search_tools({ task_description: "clickup bulk create update delete tasks", limit: 10 })` -> 2. `Code Mode: call_tool_chain({ code: "const stamp = Date.now(); const created = await clickup.clickup_create_bulk_tasks({ listId: process.env.CLICKUP_PLAYBOOK_TEST_LIST_ID, tasks: [{ name: 'CLU-011 bulk A ' + stamp }, { name: 'CLU-011 bulk B ' + stamp }] }); const ids = created.tasks ? created.tasks.map(t => t.id) : created.map(t => t.id); const fetched = []; for (const id of ids) fetched.push(await clickup.clickup_get_task({ task: id })); const deleted = []; for (const id of ids) deleted.push(await clickup.clickup_delete_task({ task: id })); return { ids, fetched_count: fetched.length, deleted_count: deleted.length };" })` | Discovery returns bulk tools; chain returns exactly two IDs; fetched_count is 2; deleted_count is 2 | Code Mode transcript, task IDs, cleanup proof | PASS if two tasks round trip and cleanup succeeds; FAIL otherwise | 1. Verify tool parameters use `listId` or switch to documented `listName`; 2. If bulk create partially succeeds, manually delete created tasks; 3. Check rate limits if one task fails |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Current Code Mode chain behavior |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/references/tool_reference.md` | Historical bulk task tool reference |

---

## 5. SOURCE METADATA

- Group: INTEGRATION PATTERNS
- Playbook ID: CLU-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--integration-patterns/002-mcp-bulk-task-workflow.md`

