---
title: "250 -- SessionStart primes fresh session"
description: "This scenario validates SessionStart priming (startup) for 250. It focuses on SessionStart outputs Spec Kit Memory overview on fresh startup."
---

# 250 -- SessionStart primes fresh session

## 1. OVERVIEW

This scenario validates SessionStart priming (startup).

---

## 2. CURRENT REALITY

- **Objective**: Verify that the SessionStart hook, when triggered with `source=startup` (fresh session), outputs a "Session Priming" section to stdout listing available Spec Kit Memory tools (`memory_context`, `memory_match_triggers`, `memory_search`), CocoIndex Code availability status, Code Graph tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`), and resume instructions. Output must stay within SESSION_PRIME_TOKEN_BUDGET (2000 tokens).
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - No prior session state required (fresh startup scenario)
- **Prompt**: `Validate 250 SessionStart priming (startup) behavior. Run the vitest suite for hook-session-start and confirm: (1) source=startup routes to handleStartup(), (2) stdout contains "Session Priming" section, (3) memory tools listed (memory_context, memory_match_triggers, memory_search), (4) CocoIndex availability checked via checkCocoIndexAvailable(), (5) Code Graph tools listed, (6) resume instructions present, (7) output within SESSION_PRIME_TOKEN_BUDGET (2000 tokens).`
- **Expected signals**:
  - All vitest tests in `hook-session-start.vitest.ts` pass for startup source
  - Stdout contains `## Session Priming` header
  - Body mentions `memory_context`, `memory_match_triggers`, `memory_search`
  - Body mentions `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`
  - CocoIndex status line shows either "available" or "not installed" based on `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` existence
  - Resume instruction: `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
  - Output length stays within 2000 tokens (8000 chars)
- **Pass/fail criteria**:
  - PASS: All tool references present in stdout, CocoIndex status accurate, output within budget
  - FAIL: Missing tool references, incorrect CocoIndex status, or output exceeds 2000 tokens

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 250a | SessionStart priming (startup) | Fresh startup outputs Spec Kit Memory tool overview | `Validate 250a startup tool listing` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Stdout "Session Priming" section lists `memory_context`, `memory_match_triggers`, `memory_search`, code graph tools | Test output showing tool names in stdout | PASS if all 7+ tools listed in session priming output | Check `session-prime.ts` handleStartup() for expected tool names |
| 250b | SessionStart priming (startup) | CocoIndex availability check returns correct status | `Validate 250b CocoIndex status` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | CocoIndex line shows "available" when binary exists or "not installed" when missing | Test output showing CocoIndex status line | PASS if CocoIndex status matches filesystem reality | Verify `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` path |
| 250c | SessionStart priming (startup) | Startup output within SESSION_PRIME_TOKEN_BUDGET | `Validate 250c startup budget` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Output length <= 8000 chars (2000 tokens x 4 chars/token) | Test output showing char count | PASS if output within 2000-token budget | Check `shared.ts` SESSION_PRIME_TOKEN_BUDGET constant |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/03-session-start-priming.md](../../feature_catalog/22--context-preservation-and-code-graph/03-session-start-priming.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 250
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/250-session-start-startup.md`
