---
title: "CO-006 -- External dispatch from Claude Code into OpenCode"
description: "This scenario validates use case 1 (external runtime to OpenCode) for `CO-006`. It focuses on confirming Claude Code can dispatch into a fresh OpenCode session via cli-opencode and load the project's full plugin / skill / MCP / Spec Kit Memory runtime."
---

# CO-006 -- External dispatch from Claude Code into OpenCode

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-006`.

---

## 1. OVERVIEW

This scenario validates External dispatch from Claude Code into OpenCode for `CO-006`. It focuses on confirming the canonical use case 1 path documented in `references/integration_patterns.md` §2: an external Anthropic runtime (Claude Code) dispatches into a fresh OpenCode session that loads the full plugin / skill / MCP / Spec Kit Memory runtime in a single one-shot invocation.

### Why This Matters

Use case 1 is the most common cli-opencode dispatch path. It is the bridge that lets Claude Code (and other external runtimes) reach the project's spec-kit memory, code graph and CocoIndex semantic index without forcing the operator to leave their host session. If this path breaks (binary missing, self-invocation guard misfires, plugin runtime fails to load inside the dispatched session), every external-AI workflow that depends on the project runtime regresses. This test proves the canonical use case 1 dispatch shape from Claude Code actually works end-to-end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-006` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a Claude Code-led dispatch via cli-opencode reaches a fresh OpenCode session that loads the project's full plugin / skill / MCP runtime, with the dispatched session demonstrating access to a project-specific MCP tool (memory_health) it could not call without the runtime.
- Real user request: `From Claude Code, use cli-opencode to dispatch a question to OpenCode that requires the spec-kit memory MCP. Have OpenCode call memory_health and report the database status.`
- Prompt: `You are Claude Code dispatching from a fresh shell into a new OpenCode session via cli-opencode use case 1. Goal: have OpenCode call the memory_health MCP tool and return the database status. Context: spec folder /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/ (pre-approved, skip Gate 3); plugin runtime required (Spec Kit Memory MCP). Constraints: must load system-spec-kit skill; must call memory_health and return its result. Success criteria: dispatched session emits a tool.call event for memory_health, returns the database status, and the session.completed event includes the status summary. Memory Epilogue is NOT required for this test.`
- Expected execution process: Claude Code (external runtime) confirms self-invocation guard does NOT trip, dispatches via the cli-opencode default invocation shape with a prompt that explicitly calls memory_health, captures the JSON event stream and verifies a `tool.call` event for memory_health is present in the stream.
- Expected signals: Dispatch exits 0. JSON event stream contains a `tool.call` event whose payload references `memory_health`. The session.completed event's summary or a message.delta references the database health status. Runtime under 120 seconds.
- Desired user-visible outcome: Verdict naming the database health status returned by memory_health and confirming the use case 1 path is healthy.
- Pass/fail: PASS if exit 0 AND `tool.call` for memory_health appears AND session.completed references the database status. FAIL if dispatch fails, memory_health is not called or the response does not surface the status.

> **Cross-AI dependency note:** This scenario assumes the operator runs from inside Claude Code OR from a fresh shell. The dispatched OpenCode session is what we are validating. Claude Code itself is just the originator. PASS condition is satisfied by opencode emitting the correct delegation event and tool.call regardless of which external runtime initiated the dispatch.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Confirm the originating runtime is NOT OpenCode (no `OPENCODE_*` env var). Claude Code or a fresh shell both work.
3. Dispatch via the cli-opencode default invocation shape with the explicit memory_health request.
4. Parse the JSON event stream and look for the memory_health `tool.call` event.
5. Inspect the session.completed event for the database status.
6. Return a verdict naming the status and confirming use case 1 path is healthy.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-006 | External dispatch from Claude Code into OpenCode | Confirm use case 1 dispatch from an external Anthropic runtime reaches a fresh OpenCode session with full MCP runtime | `You are Claude Code dispatching from a fresh shell into a new OpenCode session via cli-opencode use case 1. Goal: have OpenCode call the memory_health MCP tool and return the database status. Context: spec folder /Users/.../048-cli-testing-playbooks/ (pre-approved, skip Gate 3); plugin runtime required (Spec Kit Memory MCP). Constraints: must load system-spec-kit skill; must call memory_health and return its result. Success criteria: dispatched session emits a tool.call event for memory_health, returns the database status, and the session.completed event includes the status summary.` | 1. `bash: env \| grep -q '^OPENCODE_' && echo "ABORT: in-OpenCode" \|\| echo "OK: external runtime"` -> 2. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public "Use the spec-kit memory MCP. Call memory_health and tell me the database status in one short sentence." > /tmp/co-006-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "tool.call") \| .payload.name' /tmp/co-006-events.jsonl \| sort -u` -> 5. `bash: jq -r 'select(.type == "tool.call" and (.payload.name \| test("memory_health"))) \| .payload' /tmp/co-006-events.jsonl \| wc -l` -> 6. `bash: jq -r 'select(.type == "session.completed") \| .payload' /tmp/co-006-events.jsonl` | Step 1: prints `OK: external runtime`; Step 2: events captured; Step 3: exit 0; Step 4: tool.call names include `memory_health` (or the equivalent MCP tool slug); Step 5: count of memory_health calls >= 1; Step 6: session.completed payload references database health (e.g. `OK`, `healthy`, row counts) | `/tmp/co-006-events.jsonl`, terminal transcript with parent-runtime detection | PASS if exit 0 AND memory_health `tool.call` appears AND session.completed references the database status; FAIL if dispatch fails or memory_health is not called | 1. If the dispatch is refused with self-invocation message, the originating runtime IS OpenCode — switch to a fresh shell or use a sibling cli-* skill instead; 2. If `tool.call` events are missing, parse the entire stream and look for `error` events; 3. If memory_health is never called, the session may have skipped the MCP — re-prompt with explicit "use the memory_health MCP tool" wording; 4. Confirm the spec_kit_memory MCP server is registered in `opencode.json` |

### Optional Supplemental Checks

For multi-MCP validation, repeat the test with a prompt that asks the session to call BOTH memory_health and `code_graph_status`. Confirm both `tool.call` events appear in the JSON event stream. This proves the entire MCP runtime loads correctly inside the dispatched session, not just one tool.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` (§2 USE CASE 1: EXTERNAL RUNTIME TO OPENCODE) | The canonical use case 1 contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 activation triggers (full plugin/skill/MCP runtime), §3 default invocation, ALWAYS rule 10 (classify use case before dispatch) |
| `../../references/opencode_tools.md` (§2 Full Plugin, Skill and MCP Runtime) | Documents the unique value prop this test validates |

---

## 5. SOURCE METADATA

- Group: External Dispatch
- Playbook ID: CO-006
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--external-dispatch/001-from-claude-code.md`
