---
title: "CO-021 -- Cross-AI orchestration handback (use case 3, Codex calling)"
description: "This scenario validates the cross-AI orchestration handback (use case 3) for `CO-021`. It focuses on confirming Codex (or another non-Anthropic CLI) can dispatch into OpenCode for a spec-kit-specific workflow that the calling CLI cannot execute on its own."
---

# CO-021 -- Cross-AI orchestration handback (use case 3, Codex calling)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-021`.

---

## 1. OVERVIEW

This scenario validates Cross-AI orchestration handback (use case 3) for `CO-021`. It focuses on confirming the documented handback path in `references/integration_patterns.md` §4. Codex (a non-Anthropic CLI) dispatches into OpenCode through cli-opencode for a spec-kit-specific workflow (memory_search) that Codex cannot execute on its own because the project's spec-kit MCP runtime is OpenCode-local.

### Why This Matters

Use case 3 is the bridge that lets non-Anthropic external runtimes reach the project's spec-kit, memory, code-graph and advisor subsystems without leaving the calling runtime. The smart router selects use case 3 (over the more general use case 1) when the calling AI is non-Anthropic AND the prompt names a spec-kit subsystem. If this routing or the handback execution breaks, every "Codex needs spec-kit memory" workflow regresses. This test proves the handback path is operational.

> **Cross-AI dependency note:** Codex itself does NOT need to be installed for this scenario to PASS. The opencode dispatch is what is being validated. PASS condition is satisfied by opencode emitting the correct delegation event with the right model/agent/prompt and calling memory_search successfully. Companion CLI execution is out of scope for this scenario. The scenario notes this dependency in the Description field.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-021` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a Codex-originated cli-opencode dispatch routes to use case 3 (cross-AI handback) when the prompt names a spec-kit subsystem (memory_search) and the dispatched OpenCode session calls the named MCP tool successfully.
- Real user request: `From Codex, use cli-opencode to dispatch a spec-kit memory_search request to OpenCode. Have OpenCode call memory_search for "self-invocation guard" across the spec-kit memory database and return the top 3 results.`
- RCAF Prompt: `As Codex (or any non-Anthropic external runtime) dispatching from a fresh shell into OpenCode for a spec-kit-specific workflow via cli-opencode use case 3, dispatch a one-shot prompt against /tmp/co-021-events.jsonl asking the session to load the system-spec-kit skill and call memory_search for "self-invocation guard" filtered by importance_tier in [critical, important], returning the top 3 hits with packet pointers. Verify the JSON event stream contains a tool.call event for memory_search, the session.completed payload references the results (or an explicit no-results attestation), and the smart router selected use case 3 over use case 1. Return a one-line pass/fail verdict naming the search query and the result count (or explicit no-results).`
- Expected execution process: External-AI orchestrator (representing Codex) dispatches via the cli-opencode default invocation shape with a prompt that explicitly names spec-kit memory_search, validates the JSON event stream contains a `tool.call` event for memory_search and validates the response surfaces the search results.
- Expected signals: Dispatch exits 0. JSON event stream includes a `tool.call` event whose payload references `memory_search`. Session.completed payload references the search results (file paths, snippets, packet pointers, OR explicit "no results" attestation). Runtime under 120 seconds.
- Desired user-visible outcome: Verdict naming the search query and the result count.
- Pass/fail: PASS if exit 0 AND memory_search `tool.call` appears AND session.completed references results (or explicit no-results attestation). FAIL if dispatch fails or memory_search is not called.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Confirm the originating runtime is NOT OpenCode (Codex or fresh shell both work).
3. Dispatch with a prompt explicitly naming memory_search as the spec-kit subsystem.
4. Parse the JSON event stream for the memory_search `tool.call` event.
5. Verify session.completed references the search results.
6. Return a verdict naming the result count or no-results attestation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-021 | Cross-AI orchestration handback (use case 3) | Confirm use case 3 dispatch from a non-Anthropic external runtime reaches OpenCode for spec-kit memory_search | `As Codex (or any non-Anthropic external runtime) dispatching from a fresh shell into OpenCode for a spec-kit-specific workflow via cli-opencode use case 3, dispatch a one-shot prompt against /tmp/co-021-events.jsonl asking the session to load the system-spec-kit skill and call memory_search for "self-invocation guard" filtered by importance_tier in [critical, important], returning the top 3 hits with packet pointers. Verify the JSON event stream contains a tool.call event for memory_search, the session.completed payload references the results (or an explicit no-results attestation), and the smart router selected use case 3 over use case 1. Return a one-line pass/fail verdict naming the search query and the result count (or explicit no-results).` | 1. `bash: env \| grep -q '^OPENCODE_' && echo "ABORT: in-OpenCode" \|\| echo "OK: external runtime"` -> 2. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir "$(pwd)" "Use the spec-kit memory MCP. Call memory_search with the query 'self-invocation guard' and return the top 3 hits filtered by importance_tier in [critical, important]. Summarize each hit as a single sentence with the packet pointer." > /tmp/co-021-events.jsonl 2>&1` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "tool.call") \| .payload.name' /tmp/co-021-events.jsonl \| sort -u` -> 5. `bash: jq -r 'select(.type == "tool.call" and (.payload.name \| test("memory_search"))) \| .payload' /tmp/co-021-events.jsonl \| wc -l` -> 6. `bash: jq -r 'select(.type == "session.completed") \| .payload' /tmp/co-021-events.jsonl \| grep -ciE '(self-invocation\|guard\|cli-opencode\|no results\|empty)'` | Step 1: prints `OK: external runtime`; Step 2: events captured; Step 3: exit 0; Step 4: tool.call names include `memory_search`; Step 5: count of memory_search calls >= 1; Step 6: session.completed references results OR explicit no-results attestation (count >= 1) | `/tmp/co-021-events.jsonl`, terminal histogram | PASS if exit 0 AND memory_search tool.call appears AND session.completed references results (or no-results attestation); FAIL if any check fails | 1. If memory_search tool.call is missing, the system-spec-kit skill may not have loaded — verify via `opencode debug skill system-spec-kit`; 2. If session.completed has neither results nor a no-results attestation, the search may have errored silently — re-run with `--print-logs --log-level DEBUG` and inspect; 3. If the smart router selected use case 1 instead of use case 3, the prompt may not have named the subsystem strongly enough — strengthen with "use the spec-kit memory MCP" wording; 4. If the spec-kit MCP server is not registered in `opencode.json`, the entire handback path is broken |

### Optional Supplemental Checks

For Memory Epilogue validation, append the Template 13 Memory Epilogue from `assets/prompt_templates.md` to the prompt and confirm the dispatched session emits a properly-delimited MEMORY_HANDBACK block. Then extract it via the regex documented in SKILL.md §4 and validate it parses as JSON. This proves the handback can feed `generate-context.js` for context preservation.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` (§4 USE CASE 3: CROSS-AI ORCHESTRATION HANDBACK + §5 SMART-ROUTER DECISION TREE) | Use case 3 contract and routing logic |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 activation triggers (cross-AI handback), §3 default invocation, ALWAYS rule 10 |
| `../../assets/prompt_templates.md` (TEMPLATE 3: Cross-AI orchestration handback) | Canonical use case 3 prompt shape |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CO-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--integration-patterns/001-cross-ai-handback-codex.md`
