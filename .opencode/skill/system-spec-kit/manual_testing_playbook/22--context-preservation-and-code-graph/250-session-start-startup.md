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

## 2. SCENARIO CONTRACT


- Objective: Verify that the SessionStart hook, when triggered with `source=startup` (fresh session), outputs the current startup contract: a `Session Context` startup surface, `Recovery Tools`, `Structural Context`, and `Startup Payload Contract` sections when the startup brief is available; Spec Kit Memory tools (`memory_context`, `memory_match_triggers`, `memory_search`); CocoIndex Code availability status; Code Graph tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`); graph-quality context sourced from `graphQualitySummary`; and resume instructions that point to `/spec_kit:resume` and the packet continuity chain; Output must stay within `SESSION_PRIME_TOKEN_BUDGET` (2000 tokens).
- Real user request: `` Please validate SessionStart primes fresh session against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts and tell me whether the expected signals are present: All vitest tests in `hook-session-start.vitest.ts` pass for startup source; Startup output contains `Session Context` and `Recovery Tools`; Recovery tools mention `memory_context`, `memory_match_triggers`, `memory_search`; Recovery tools mention `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`; CocoIndex status line shows either "available" or "missing" based on `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` existence; Startup output contains `Structural Context` when the startup brief is available; Startup output contains `Startup Payload Contract` when the startup brief is available; Startup payload transport identifies startup status, `"producer": "startup_brief"`, and `sectionKeys` containing `structural-context`; Startup brief fixture includes `graphQualitySummary`, and the startup formatter keeps graph-quality information on the structural-context path; Resume instruction: `/spec_kit:resume` with the `handover.md -> _memory.continuity -> spec docs` chain; Output length stays within 2000 tokens (8000 chars). ``
- RCAF Prompt: `As a context-and-code-graph validation operator, validate SessionStart primes fresh session against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify the SessionStart hook, when triggered with source=startup (fresh session), outputs the current startup contract: Session Context, Recovery Tools, Structural Context, and Startup Payload Contract sections when the startup brief is available; Spec Kit Memory tools (memory_context, memory_match_triggers, memory_search); CocoIndex availability status; Code Graph tools (code_graph_scan, code_graph_query, code_graph_context, code_graph_status); graph-quality context sourced from graphQualitySummary; and resume instructions that point to /spec_kit:resume and the packet continuity chain. Output must stay within SESSION_PRIME_TOKEN_BUDGET (2000 tokens). Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All vitest tests in `hook-session-start.vitest.ts` pass for startup source; Startup output contains `Session Context` and `Recovery Tools`; Recovery tools mention `memory_context`, `memory_match_triggers`, `memory_search`; Recovery tools mention `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`; CocoIndex status line shows either "available" or "missing" based on `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` existence; Startup output contains `Structural Context` when the startup brief is available; Startup output contains `Startup Payload Contract` when the startup brief is available; Startup payload transport identifies startup status, `"producer": "startup_brief"`, and `sectionKeys` containing `structural-context`; Startup brief fixture includes `graphQualitySummary`, and the startup formatter keeps graph-quality information on the structural-context path; Resume instruction: `/spec_kit:resume` with the `handover.md -> _memory.continuity -> spec docs` chain; Output length stays within 2000 tokens (8000 chars)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Startup sections, payload contract, tool references, graph-quality evidence, CocoIndex status, and token budget all match the live startup contract; FAIL: Missing startup sections, missing payload or graph-quality evidence, incorrect CocoIndex status, or output exceeds 2000 tokens

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate fresh startup recovery surfaces against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify the startup output includes Session Context and Recovery Tools, and that Recovery Tools list memory_context, memory_match_triggers, memory_search, and the code graph tools. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Startup output includes `Session Context` and `Recovery Tools`, and `Recovery Tools` lists `memory_context`, `memory_match_triggers`, `memory_search`, and the code graph tools

### Evidence

Test output showing the startup sections and recovery-tool names

### Pass / Fail

- **Pass**: startup sections exist and all 7+ tools are listed in the recovery surface
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `session-prime.ts` handleStartup() for expected tool names

---

### Prompt

```
As a context-and-code-graph validation operator, validate startup payload transport against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify startup output includes a Startup Payload Contract section when the startup brief is available, and that the payload transport shows startup status, producer=startup_brief, and sectionKeys including structural-context. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Startup output includes `Startup Payload Contract` with startup status, `"producer": "startup_brief"`, and `sectionKeys` containing `structural-context`

### Evidence

Test output showing the `Startup Payload Contract` section and payload fields

### Pass / Fail

- **Pass**: payload contract section appears and carries the expected startup payload fields
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `hooks/claude/session-prime.ts` payload-section wiring and `code-graph/lib/startup-brief.ts` shared payload transport formatting

---

### Prompt

```
As a context-and-code-graph validation operator, validate startup graph-quality context against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify the startup path preserves graph-quality evidence by exposing Structural Context when the startup brief is available, carrying graphQualitySummary in the startup brief fixture, and keeping graph-quality formatting on the structural-context path. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Startup path preserves graph-quality evidence through `Structural Context`, `graphQualitySummary`, and the structural-context formatter path

### Evidence

Test output and source evidence showing `Structural Context`, `graphQualitySummary`, and the structural-context formatter path

### Pass / Fail

- **Pass**: startup output keeps structural context present and the graph-quality path is evidenced by the test fixture plus formatter implementation
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `tests/hook-session-start.vitest.ts` startup fixture plus `code-graph/lib/startup-brief.ts` graph-quality formatting

---

### Prompt

```
As a context-and-code-graph validation operator, validate CocoIndex availability check returns correct status against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify the CocoIndex line shows "available" when the binary exists or "missing"/fallback state when the startup brief is unavailable. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

CocoIndex line reflects runtime availability or fallback startup behavior

### Evidence

Test output showing the CocoIndex status line

### Pass / Fail

- **Pass**: CocoIndex status matches the startup-brief or fallback path under test
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` path and `buildFallbackStartupSurface(...)`

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

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/03-session-start-priming.md](../../feature_catalog/22--context-preservation-and-code-graph/03-session-start-priming.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 250
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/250-session-start-startup.md`
