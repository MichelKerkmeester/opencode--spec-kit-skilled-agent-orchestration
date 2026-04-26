---
title: "CO-013 -- General agent default route"
description: "This scenario validates the general agent default route for `CO-013`. It focuses on confirming `--agent general` is the documented default and produces the expected implementation-style behavior."
---

# CO-013 -- General agent default route

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-013`.

---

## 1. OVERVIEW

This scenario validates the General agent default route for `CO-013`. It focuses on confirming `--agent general` is the cli-opencode default agent (per SKILL.md §3) and that dispatching with this slug loads the general agent's frontmatter and produces routine implementation-style behavior with full read/write/dispatch tool permissions.

### Why This Matters

`general` is the catch-all default. Every cli-opencode dispatch that does not specify a more specialized slug routes here (per `references/agent_delegation.md` §4 routing matrix). If `--agent general` silently fails to load the agent definition or substitutes a different agent, the entire default-routing contract collapses. This test proves the default agent route is intact and operational.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-013` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--agent general` loads the project's general agent definition from `.opencode/agent/general.md` and the dispatched session demonstrates implementation-style behavior (file reads, optional writes, multi-step reasoning).
- Real user request: `Use opencode run with the default --agent general and have it perform a simple multi-step task: read a small project file and write a one-paragraph summary back to the user.`
- Prompt: `As an external-AI conductor verifying the general-agent default route, dispatch --agent general with a prompt that requires a Read tool call against a small project file (e.g. .opencode/skill/cli-opencode/SKILL.md) and a multi-step reasoning summary. Verify the JSON event stream shows a tool.call for Read, the response references content from the file, and the agent slug general is identified in the session metadata. Return a concise pass/fail verdict naming the file read and the summary's first sentence.`
- Expected execution process: External-AI orchestrator dispatches with `--agent general`, captures the JSON event stream, validates a `tool.call` for the Read tool appears, validates the session metadata or session.completed payload references the agent slug and validates the response references content from the read file.
- Expected signals: Dispatch exits 0. JSON event stream includes a `tool.call` event whose payload references the Read tool. Session.completed or session metadata references `general` as the agent slug. Response references content from `.opencode/skill/cli-opencode/SKILL.md`. Runtime under 90 seconds.
- Desired user-visible outcome: Verdict naming the file read, the agent slug and the summary's first sentence.
- Pass/fail: PASS if exit 0 AND Read `tool.call` appears AND session metadata references `general` AND response references SKILL.md content. FAIL if any check fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch with `--agent general` and a prompt that requires a Read.
3. Parse the JSON event stream for the Read tool.call event.
4. Validate the session metadata or session.completed references the `general` agent slug.
5. Validate the response references SKILL.md content.
6. Return a verdict naming the read file, agent slug and summary first sentence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-013 | General agent default route | Confirm `--agent general` loads the default agent definition and produces implementation-style behavior | `As an external-AI conductor verifying the general-agent default route, dispatch --agent general with a prompt that requires a Read tool call against a small project file (e.g. .opencode/skill/cli-opencode/SKILL.md) and a multi-step reasoning summary. Verify the JSON event stream shows a tool.call for Read, the response references content from the file, and the agent slug general is identified in the session metadata. Return a concise pass/fail verdict naming the file read and the summary's first sentence.` | 1. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir "$(pwd)" "Use the Read tool to read .opencode/skill/cli-opencode/SKILL.md and summarize what the cli-opencode skill does in one short paragraph. Mention the three documented use cases by number." > /tmp/co-013-events.jsonl 2>&1` -> 2. `bash: echo "Exit: $?"` -> 3. `bash: jq -r 'select(.type == "tool.call") \| .payload.name' /tmp/co-013-events.jsonl \| sort -u` -> 4. `bash: jq -r 'select(.type == "tool.call" and (.payload.name \| test("Read";"i"))) \| .payload' /tmp/co-013-events.jsonl \| wc -l` -> 5. `bash: jq -r 'select(.type == "session.started" or .type == "session.completed") \| .payload' /tmp/co-013-events.jsonl \| grep -ciE 'general'` -> 6. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-013-events.jsonl \| grep -ciE '(use case 1\|use case 2\|use case 3\|external runtime\|parallel detached\|cross-AI handback)'` | Step 1: events captured non-empty; Step 2: exit 0; Step 3: tool.call names include `Read` (case-insensitive); Step 4: count of Read tool calls >= 1; Step 5: agent slug `general` referenced in session metadata >= 1; Step 6: response references at least 2 of the three use cases (count >= 2) | `/tmp/co-013-events.jsonl`, terminal histogram of tool.call names | PASS if exit 0 AND Read tool.call appears AND `general` referenced in metadata AND >= 2 use cases mentioned; FAIL if any check fails | 1. If `Read` tool.call is missing, the agent may have answered from cache without reading — re-prompt with stronger "use the Read tool" wording; 2. If `general` is not referenced in session metadata, run `opencode debug agent general` to confirm the agent is registered; 3. If response is generic, the agent may have been silently substituted — verify with `opencode agent list`; 4. If exit code is non-zero, parse stderr for agent-loading errors |

### Optional Supplemental Checks

For agent-frontmatter introspection, run `opencode debug agent general` separately and confirm the resolved frontmatter matches `.opencode/agent/general.md` (model + tool permissions + system prompt). This catches user-level agent fallbacks that might silently shadow the project agent.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/agent_delegation.md` (§3 AGENT ROSTER + §4 routing matrix) | Documents the general agent role and default route |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 default invocation (`--agent general`) and user override table |
| `../../references/agent_delegation.md` | §4 routing matrix (default / unspecified -> general) |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CO-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/001-general-agent-default.md`
