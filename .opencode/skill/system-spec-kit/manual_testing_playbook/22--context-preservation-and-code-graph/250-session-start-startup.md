---
title: "250 -- SessionStart primes fresh session"
description: "This scenario validates SessionStart priming (startup) for 250. It focuses on SessionStart outputs Spec Kit Memory overview on fresh startup."
audited_post_018: true
phase_018_change: "Updated startup recovery wording so the resume instruction points at /spec_kit:resume and the canonical packet continuity chain."
---

# 250 -- SessionStart primes fresh session

## 1. OVERVIEW

This scenario validates SessionStart priming (startup).

---

## 2. CURRENT REALITY

- **Objective**: Verify that the SessionStart hook, when triggered with `source=startup` (fresh session), outputs a "Session Priming" section to stdout listing available Spec Kit Memory tools (`memory_context`, `memory_match_triggers`, `memory_search`), CocoIndex Code availability status, Code Graph tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`), and resume instructions that point to `/spec_kit:resume` and the packet continuity chain. Output must stay within SESSION_PRIME_TOKEN_BUDGET (2000 tokens).
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - No prior session state required (fresh startup scenario)
- **Prompt**: `As a context-and-code-graph validation operator, validate SessionStart primes fresh session against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify the SessionStart hook, when triggered with source=startup (fresh session), outputs a "Session Priming" section to stdout listing available Spec Kit Memory tools (memory_context, memory_match_triggers, memory_search), CocoIndex Code availability status, Code Graph tools (code_graph_scan, code_graph_query, code_graph_context, code_graph_status), and resume instructions that point to /spec_kit:resume and the packet continuity chain. Output must stay within SESSION_PRIME_TOKEN_BUDGET (2000 tokens). Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - All vitest tests in `hook-session-start.vitest.ts` pass for startup source
  - Stdout contains `## Session Priming` header
  - Body mentions `memory_context`, `memory_match_triggers`, `memory_search`
  - Body mentions `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`
  - CocoIndex status line shows either "available" or "not installed" based on `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` existence
  - Resume instruction: `/spec_kit:resume` with the `handover.md -> _memory.continuity -> spec docs` chain
  - Output length stays within 2000 tokens (8000 chars)
- **Pass/fail criteria**:
  - PASS: All tool references present in stdout, CocoIndex status accurate, output within budget
  - FAIL: Missing tool references, incorrect CocoIndex status, or output exceeds 2000 tokens

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Fresh startup outputs Spec Kit Memory tool overview against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify stdout "Session Priming" section lists memory_context, memory_match_triggers, memory_search, code graph tools. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Stdout "Session Priming" section lists `memory_context`, `memory_match_triggers`, `memory_search`, code graph tools

### Evidence

Test output showing tool names in stdout

### Pass / Fail

- **Pass**: all 7+ tools listed in session priming output
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `session-prime.ts` handleStartup() for expected tool names

---

### Prompt

```
As a context-and-code-graph validation operator, validate CocoIndex availability check returns correct status against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify cocoIndex line shows "available" when binary exists or "not installed" when missing. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

CocoIndex line shows "available" when binary exists or "not installed" when missing

### Evidence

Test output showing CocoIndex status line

### Pass / Fail

- **Pass**: CocoIndex status matches filesystem reality
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` path

---

### Prompt

```
As a context-and-code-graph validation operator, validate Startup output within SESSION_PRIME_TOKEN_BUDGET against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify output length <= 8000 chars (2000 tokens x 4 chars/token). Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Output length <= 8000 chars (2000 tokens x 4 chars/token)

### Evidence

Test output showing char count

### Pass / Fail

- **Pass**: output within 2000-token budget
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `shared.ts` SESSION_PRIME_TOKEN_BUDGET constant

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/03-session-start-priming.md](../../feature_catalog/22--context-preservation-and-code-graph/03-session-start-priming.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 250
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/250-session-start-startup.md`
