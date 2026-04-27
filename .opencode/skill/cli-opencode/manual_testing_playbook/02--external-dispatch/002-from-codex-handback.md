---
title: "CO-007 -- External dispatch from Codex into OpenCode (use case 1)"
description: "This scenario validates use case 1 (external runtime to OpenCode) for `CO-007`. It focuses on confirming OpenAI Codex (a non-Anthropic runtime) can dispatch into OpenCode via cli-opencode for general full-runtime tasks distinct from the spec-kit handback (use case 3)."
---

# CO-007 -- External dispatch from Codex into OpenCode (use case 1)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-007`.

---

## 1. OVERVIEW

This scenario validates External dispatch from Codex into OpenCode (use case 1) for `CO-007`. It focuses on confirming OpenAI Codex (a non-Anthropic external runtime) can dispatch into a fresh OpenCode session through cli-opencode for general full-runtime tasks. This is distinct from the spec-kit-specific cross-AI handback (use case 3) tested in CO-021. Here we exercise the general use case 1 path from a non-Anthropic caller.

### Why This Matters

Use case 1 is documented as supporting all non-OpenCode runtimes. Claude Code, Codex, Copilot, Gemini, raw shell. Per `references/integration_patterns.md` §2. The smart router decision tree in §5 of integration_patterns.md routes non-Anthropic callers to use case 1 when no project-specific subsystem is named in the prompt. If this path silently regresses (e.g., the smart router incorrectly always picks use case 3 for non-Anthropic callers), the general "Codex needs the OpenCode runtime" workflow breaks. This test proves use case 1 selection works correctly when the caller is non-Anthropic AND the prompt does NOT name a spec-kit subsystem.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-007` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a Codex-originated cli-opencode dispatch routes to use case 1 (general full-runtime) when the prompt does not name a spec-kit subsystem and the dispatched OpenCode session loads the project plugin runtime.
- Real user request: `From Codex, use cli-opencode to dispatch a general question to OpenCode that uses the project plugin runtime but does NOT touch the spec-kit. Have OpenCode confirm it has access to the CocoIndex semantic search MCP.`
- Prompt: `You are Codex dispatching from a fresh shell into a new OpenCode session via cli-opencode use case 1. Goal: have OpenCode confirm CocoIndex semantic search MCP is loaded and reachable, then run a single small semantic search to validate. Context: this is use case 1 (general full-runtime), not use case 3 (spec-kit handback). Constraints: do not touch the spec-kit memory database; only verify CocoIndex availability. Success criteria: dispatched session emits a tool.call event for the CocoIndex search MCP tool, returns at least one search hit, and session.completed summarizes the result.`
- Expected execution process: External-AI orchestrator (Codex or any non-Anthropic runtime, including raw shell as a stand-in) confirms self-invocation guard does NOT trip, dispatches with the cli-opencode default shape and a prompt explicitly naming CocoIndex (NOT spec-kit/memory/code-graph) and verifies a `tool.call` for the CocoIndex search MCP appears in the JSON event stream.
- Expected signals: Dispatch exits 0. JSON event stream includes a `tool.call` event whose payload references the CocoIndex search MCP tool. Session.completed payload references the search result (file paths, snippets or similar). Runtime under 120 seconds.
- Desired user-visible outcome: Verdict naming the CocoIndex tool that was called and confirming use case 1 was selected (not use case 3).
- Pass/fail: PASS if exit 0 AND CocoIndex `tool.call` appears AND search result references actual files. FAIL if dispatch fails, CocoIndex tool is not called or the smart router incorrectly routed to use case 3.

> **Cross-AI dependency note:** Codex itself does NOT need to be installed for this scenario to PASS. The opencode dispatch is what is being validated. The originating runtime is irrelevant as long as the orchestrator confirms it is NOT OpenCode itself (Codex would normally be the caller, though a fresh shell suffices for the test).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Confirm the originating runtime is NOT OpenCode (Codex or fresh shell both work).
3. Dispatch with a prompt explicitly naming CocoIndex (NOT memory/spec-kit/code-graph) so use case 1 is selected.
4. Parse the JSON event stream for the CocoIndex `tool.call` event.
5. Verify session.completed references the search result.
6. Return a verdict naming the CocoIndex tool and the search snippet.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-007 | External dispatch from Codex into OpenCode (use case 1) | Confirm use case 1 dispatch from a non-Anthropic external runtime reaches OpenCode for general full-runtime tasks | `You are Codex dispatching from a fresh shell into a new OpenCode session via cli-opencode use case 1. Goal: have OpenCode confirm CocoIndex semantic search MCP is loaded and reachable, then run a single small semantic search to validate. Context: this is use case 1 (general full-runtime), not use case 3 (spec-kit handback). Constraints: do not touch the spec-kit memory database; only verify CocoIndex availability. Success criteria: dispatched session emits a tool.call event for the CocoIndex search MCP tool, returns at least one search hit, and session.completed summarizes the result.` | 1. `bash: env \| grep -q '^OPENCODE_' && echo "ABORT: in-OpenCode" \|\| echo "OK: external runtime"` -> 2. `bash: opencode run --model github-copilot/gpt-5.4 --agent general --variant high --format json --dir "$(pwd)" "Use the CocoIndex MCP semantic search tool. Search for 'self-invocation guard' across the .opencode/skill/cli-opencode/ folder and return the top 3 results in one short sentence." > /tmp/co-007-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "tool.call") \| .payload.name' /tmp/co-007-events.jsonl \| sort -u` -> 5. `bash: jq -r 'select(.type == "tool.call" and (.payload.name \| test("(coco\|search)";"i"))) \| .payload' /tmp/co-007-events.jsonl \| wc -l` -> 6. `bash: jq -r 'select(.type == "session.completed") \| .payload' /tmp/co-007-events.jsonl \| grep -ciE '(self-invocation\|guard\|cli-opencode)'` | Step 1: prints `OK: external runtime`; Step 2: events captured; Step 3: exit 0; Step 4: tool.call names include the CocoIndex search MCP slug (case-insensitive match for "coco" or "search"); Step 5: count of CocoIndex tool calls >= 1; Step 6: count of guard/self-invocation/cli-opencode mentions in session.completed >= 1 | `/tmp/co-007-events.jsonl`, terminal transcript with tool.call enumeration | PASS if exit 0 AND CocoIndex tool.call appears AND search result references actual cli-opencode content; FAIL if any check fails | 1. If CocoIndex tool.call is missing, the MCP may not be registered — check `opencode.json` for the cocoindex_code MCP entry; 2. If the search returns no hits, lower the case sensitivity or broaden the query; 3. If session.completed is missing, the session may have crashed mid-run — re-run with `--print-logs --log-level DEBUG` and inspect stderr; 4. If the smart router picked use case 3 instead, the prompt may have leaked a spec-kit keyword — re-prompt avoiding "memory", "spec-kit", "code-graph" |

### Optional Supplemental Checks

For routing verification, repeat the test with a prompt that intentionally names a spec-kit subsystem (e.g., "use spec-kit memory_search to find X"). Confirm the dispatch behavior shifts toward use case 3. The spec-kit handback path. If the same dispatch behavior appears for both prompts, the smart router may be ignoring the use case distinction.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` (§2 USE CASE 1 + §5 SMART-ROUTER DECISION TREE) | Use case 1 contract and routing logic |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 activation triggers (full plugin/skill/MCP runtime), §2 smart router pseudocode |
| `../../references/opencode_tools.md` (§2 Full Plugin, Skill and MCP Runtime) | The runtime contract this dispatch exercises |

---

## 5. SOURCE METADATA

- Group: External Dispatch
- Playbook ID: CO-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--external-dispatch/002-from-codex-handback.md`
