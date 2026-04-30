---
title: "CM-002 -- search_tools relevance"
description: "This scenario validates search_tools relevance for `CM-002`. It focuses on confirming that `search_tools` returns tools relevant to a task description, bounded by `limit`."
---

# CM-002 -- search_tools relevance

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-002`.

---

## 1. OVERVIEW

This scenario validates `search_tools` relevance for `CM-002`. It focuses on confirming that the progressive-discovery tool returns relevant tool names for a natural-language task description and respects the `limit` argument.

### Why This Matters

`search_tools` is the workflow operators use when they don't know exact tool names. If results are irrelevant or unbounded, the operator wastes context tokens loading unrelated tools, defeating the Code Mode token-efficiency value proposition (98.7% context reduction vs traditional MCP exposure).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify `search_tools({task_description: "task management", limit: 5})` returns ClickUp-related tool names within the `limit` cap.
- Real user request: `"What tools do I have for managing project tasks?"`
- RCAF Prompt: `As a manual-testing orchestrator, search for tools that handle task management through Code Mode against the registered ClickUp manual. Verify the search returns ClickUp-related tool names within the limit cap. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: call `search_tools` natively; do not delegate.
- Expected signals: result is an array; length <= 5 (the limit); at least one entry's name contains `clickup`.
- Desired user-visible outcome: A short report naming the matched tools and a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if no ClickUp-related tools returned (indicates relevance failure) or array exceeds `limit`.

---

## 3. TEST EXECUTION

### Prompt

- RCAF Prompt: `As a manual-testing orchestrator, search for tools that handle task management through Code Mode against the registered ClickUp manual. Verify the search returns ClickUp-related tool names within the limit cap. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `search_tools({ task_description: "task management", limit: 5 })`
2. Inspect the response: count entries, check for `clickup` in any name

### Expected

- Step 1: returns an array of objects or strings (depending on Code Mode version)
- Step 1: array length is between 1 and 5 inclusive
- Step 2: at least one entry name or path contains the substring `clickup`

### Evidence

Capture the verbatim response, including any score/relevance metadata if present.

### Pass / Fail

- **Pass**: array bounded by `limit` AND at least one ClickUp-related entry returned.
- **Fail**: array is empty (relevance failure); array exceeds `limit` (contract broken); no ClickUp-related entry despite ClickUp being configured.

### Failure Triage

1. If result is empty: verify ClickUp is configured with `cat .utcp_config.json | jq '.manual_call_templates[] | select(.name == "clickup")'`; if missing, ClickUp server is not registered.
2. If result exceeds `limit`: this is a Code Mode contract bug — capture the response and escalate.
3. If result has no ClickUp tools: try a more specific query like `task_description: "create clickup task"`; if still no match, ClickUp tools may not have indexed metadata.

### Optional Supplemental Checks

- Try `task_description: "browser automation"` and verify Chrome DevTools tools appear; cross-checks search behavior across multiple manuals.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | search_tools API spec |
| `.utcp_config.json` | Manual registry source |

---

## 5. SOURCE METADATA

- Group: CORE TOOLS
- Playbook ID: CM-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--core-tools/002-search-tools-relevance.md`
