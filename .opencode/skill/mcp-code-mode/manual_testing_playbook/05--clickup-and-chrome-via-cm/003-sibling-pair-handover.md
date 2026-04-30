---
title: "CM-016 -- Sibling-pair handover"
description: "This scenario validates the cross-MCP handover pattern for `CM-016`. It focuses on confirming a chain can capture a Chrome screenshot then create a ClickUp task referencing the screenshot — both MCPs in one execution."
---

# CM-016 -- Sibling-pair handover

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-016`.

---

## 1. OVERVIEW

This scenario validates the sibling-pair handover pattern for `CM-016`. It focuses on confirming a single `call_tool_chain` execution can coordinate two distinct external MCP servers — Chrome (screenshot) and ClickUp (task creation) — and produce a coupled artifact: a ClickUp task whose description references the screenshot.

### Why This Matters

This is the headline value proposition of Code Mode: cross-tool workflows in a single execution. BDG-015..BDG-018 reference variants of this pattern. If sibling handover breaks (e.g., one MCP server stalls and blocks the other), every multi-tool workflow becomes unreliable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-016` and confirm the expected signals without contradictory evidence.

- Objective: Verify a chain navigates Chrome to a target URL, captures a screenshot reference, then creates a ClickUp task in a designated test list with the reference embedded — and cleans up after.
- Real user request: `"Capture a screenshot of our staging site and file a ClickUp bug with the screenshot."`
- Prompt: `As a manual-testing orchestrator, navigate Chrome to a target URL, capture a screenshot, then create a ClickUp task in the test list whose description includes a reference to the screenshot through Code Mode against the live ClickUp + Chrome MCP servers. Verify the chain executes both tools and the task contains the screenshot reference. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: single `call_tool_chain` invocation orchestrating both MCPs; cleanup at the end.
- Expected signals: chain returns object with both `screenshot_id` (or screenshot length) and `task_id`; created task description contains the screenshot reference; cleanup deletes the task.
- Desired user-visible outcome: A short report quoting both ids and confirming cleanup with a PASS verdict.
- Pass/fail: PASS if all three signals hold AND cleanup succeeds; FAIL if either MCP errors mid-chain (sibling failure) or task description is missing the screenshot reference.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, navigate Chrome to a target URL, capture a screenshot, then create a ClickUp task in the test list whose description includes a reference to the screenshot through Code Mode against the live ClickUp + Chrome MCP servers. Verify the chain executes both tools and the task contains the screenshot reference. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Confirm `TEST_LIST_ID` is set
2. `call_tool_chain({ code: "await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' }); const shot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({}); const ref = 'screenshot_bytes_' + (shot.data || shot).length; const task = await clickup.clickup_create_task({ list_id: '${TEST_LIST_ID}', name: 'CM-016 sibling test', description: 'Screenshot reference: ' + ref }); const fetched = await clickup.clickup_get_task({ task_id: task.id }); await clickup.clickup_delete_task({ task_id: task.id }); return { task_id: task.id, screenshot_ref: ref, description_has_ref: fetched.description?.includes(ref) || false };" })`
3. Inspect the returned object

### Expected

- Step 2: chain returns object with `task_id`, `screenshot_ref`, `description_has_ref`
- Step 3: `task_id` is non-empty
- Step 3: `screenshot_ref` matches the pattern `screenshot_bytes_<number>`
- Step 3: `description_has_ref` === true

### Evidence

Capture the chain response with both ids and the description-contains check.

### Pass / Fail

- **Pass**: Both MCPs executed, task created with screenshot reference, cleanup succeeded.
- **Fail**: Chain rejects mid-execution (sibling failure — investigate which MCP errored); task description doesn't contain reference (string interpolation broken); cleanup failed (orphan task — delete manually).

### Failure Triage

1. If chain errors with "tool not found" for either MCP: cross-check both via `list_tools()` (CM-001); confirm both are in `.utcp_config.json`.
2. If chain runs but `description_has_ref` is false: log the actual `fetched.description` — the ClickUp MCP may strip or reformat description text.
3. If cleanup orphan: delete via web UI; for repeated runs, add `try/catch` around the create call to capture id even on partial failure (cross-reference CM-013, CM-025).

### Optional Supplemental Checks

- Replace ClickUp with Notion (creating a page instead of a task); confirms the pattern generalizes across third-party MCPs.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | Chrome MCP catalog |

---

## 5. SOURCE METADATA

- Group: CLICKUP AND CHROME VIA CM
- Playbook ID: CM-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--clickup-and-chrome-via-cm/003-sibling-pair-handover.md`
