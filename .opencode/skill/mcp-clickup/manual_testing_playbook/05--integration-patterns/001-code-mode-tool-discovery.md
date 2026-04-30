---
title: "CLU-010 -- Code Mode tool discovery"
description: "This scenario validates ClickUp MCP tool discovery and the `clickup.clickup_<tool_name>` naming pattern through Code Mode."
---

# CLU-010 -- Code Mode tool discovery

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-010`.

---

## 1. OVERVIEW

This scenario validates the Code Mode discovery path for ClickUp MCP tools and confirms the canonical call naming convention.

### Why This Matters

The most common MCP failure mode is calling the wrong function name, such as `clickup.create_task` instead of `clickup.clickup_create_task`.

---

## 2. SCENARIO CONTRACT

- Objective: Discover ClickUp tools and confirm callable syntax.
- Real user request: `Show me which ClickUp MCP task tools are available and how to call one correctly.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, use Code Mode discovery to find ClickUp task tools, inspect the create-task tool information, and verify the callable syntax uses clickup.clickup_create_task. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: Run `search_tools` and `tool_info` through Code Mode.
- Expected signals: discovery returns ClickUp task tools; tool info confirms manual-prefixed callable syntax.
- Desired user-visible outcome: A short report with a correct example call.
- Pass/fail: PASS if discovery and tool info agree on `clickup.clickup_create_task`; FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Use Code Mode discovery, not direct tool calls.
2. Inspect tool info for the create-task path.
3. Return a correct invocation example.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-010 | Code Mode tool discovery | Confirm ClickUp MCP discovery and naming | `As a ClickUp manual-testing orchestrator, use Code Mode discovery to find ClickUp task tools, inspect the create-task tool information, and verify the callable syntax uses clickup.clickup_create_task. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `Code Mode: search_tools({ task_description: "clickup create task search tasks manage comments", limit: 10 })` -> 2. `Code Mode: tool_info({ tool_name: "clickup.clickup_create_task" })` -> 3. `Code Mode: call_tool_chain({ code: "return { example: 'await clickup.clickup_create_task({ listId, name })' };" })` | Step 1 returns ClickUp task tools; Step 2 returns create task metadata; Step 3 returns the correct example syntax | Discovery output and tool info output | PASS if `clickup.clickup_create_task` is discoverable and documented; FAIL if no ClickUp manual or wrong naming appears | 1. Verify `.utcp_config.json` includes ClickUp; 2. Verify Code Mode server is running; 3. Use `list_tools()` to inspect manual names |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Current Code Mode discovery and naming rules |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/SKILL.md` | Historical ClickUp MCP routing rules |

---

## 5. SOURCE METADATA

- Group: INTEGRATION PATTERNS
- Playbook ID: CLU-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--integration-patterns/001-code-mode-tool-discovery.md`

