---
title: "CM-003 -- tool_info schema"
description: "This scenario validates tool_info schema for `CM-003`. It focuses on confirming that `tool_info` returns parameter schema, description, and required fields for a known tool."
---

# CM-003 -- tool_info schema

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-003`.

---

## 1. OVERVIEW

This scenario validates `tool_info` schema retrieval for `CM-003`. It focuses on confirming that requesting metadata for a specific tool name returns its parameter schema, description, and which fields are required, so the operator can construct correct calls.

### Why This Matters

Without `tool_info`, operators have to guess at tool parameter names and required fields, which leads to malformed `call_tool_chain` calls. `tool_info` is the canonical schema-discovery surface; if it returns incomplete or wrong schemas, every Code Mode-driven workflow risks runtime errors.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `tool_info({tool_name: "clickup.clickup_create_task"})` returns parameter schema, description, and required-field flags.
- Real user request: `"What parameters does the ClickUp create-task tool need?"`
- Prompt: `As a manual-testing orchestrator, fetch the parameter schema for clickup.clickup_create_task through Code Mode against the live ClickUp MCP server. Verify the response includes parameter names, types, and required-field flags. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: call `tool_info` natively; do not delegate.
- Expected signals: response is a non-empty object; contains a parameter or schema field; lists at least one required field (e.g., `list_id`, `name`).
- Desired user-visible outcome: A short report enumerating the parameter names + required flags and a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if response is empty, lacks parameter info, or lists no required fields for a tool that's known to require some.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, fetch the parameter schema for clickup.clickup_create_task through Code Mode against the live ClickUp MCP server. Verify the response includes parameter names, types, and required-field flags. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `tool_info({ tool_name: "clickup.clickup_create_task" })`
2. Inspect the response for parameter schema, description, and required-field markers

### Expected

- Step 1: returns a non-empty object
- Step 1: response contains a `parameters` or equivalent schema-defining field
- Step 1: at least one parameter is marked required (e.g., `list_id` is required to create a ClickUp task)

### Evidence

Capture the verbatim response object including parameter schema.

### Pass / Fail

- **Pass**: All three signals hold; required fields are clearly identifiable.
- **Fail**: Empty response, no parameter schema, or no required-field markers despite the tool needing them.

### Failure Triage

1. If response is empty: verify the tool name is correct via `list_tools() | grep clickup_create_task` (per CM-005); if name is wrong, fix and retry.
2. If schema field is missing: this is an MCP server schema-publishing bug; check ClickUp MCP server version `npx @taazkareem/clickup-mcp-server@latest --version`.
3. If required fields are absent but the tool clearly needs them: try invoking with no args via CM-004 and confirm the error names the missing required field, then file an MCP-server schema bug.

### Optional Supplemental Checks

- Try `tool_info({ tool_name: "nonexistent.nonexistent_anything" })` and confirm a deterministic "tool not found" error (cross-check with CM-026).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | tool_info API spec |
| `.opencode/skill/mcp-clickup/SKILL.md` | ClickUp tool catalog (manual reference) |

---

## 5. SOURCE METADATA

- Group: CORE TOOLS
- Playbook ID: CM-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--core-tools/003-tool-info-schema.md`
