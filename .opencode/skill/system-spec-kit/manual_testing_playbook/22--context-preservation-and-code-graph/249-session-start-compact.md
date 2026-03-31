---
title: "249 -- SessionStart injects post-compact context"
description: "This scenario validates SessionStart priming (compact) for 249. It focuses on SessionStart reads cached payload and injects via stdout."
---

# 249 -- SessionStart injects post-compact context

## 1. OVERVIEW

This scenario validates SessionStart priming (compact).

---

## 2. CURRENT REALITY

- **Objective**: Verify that the SessionStart hook, when triggered with `source=compact`, reads the cached PreCompact payload from hook state, injects it to stdout with "Recovered Context (Post-Compaction)" and "Recovery Instructions" sections, includes the last spec folder if known, clears the `pendingCompactPrime` from state after injection, and stays within the 4000-token budget (COMPACTION_TOKEN_BUDGET).
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - Hook state directory exists with a valid session state file containing `pendingCompactPrime`
- **Prompt**: `Validate 249 SessionStart priming (compact) behavior. Run the vitest suite for hook-session-start and confirm: (1) source=compact routes to handleCompact(), (2) cached payload from pendingCompactPrime is read from hook state, (3) stdout contains "Recovered Context (Post-Compaction)" section with the payload, (4) "Recovery Instructions" section mentions 3-source merge, (5) pendingCompactPrime is cleared after injection, (6) lastSpecFolder appears if set in state, (7) output stays within COMPACTION_TOKEN_BUDGET.`
- **Expected signals**:
  - All vitest tests in `hook-session-start.vitest.ts` pass for compact source
  - `loadState(sessionId)` returns object with `pendingCompactPrime.payload` and `pendingCompactPrime.cachedAt`
  - Stdout contains `## Recovered Context (Post-Compaction)` followed by the cached payload text
  - Stdout contains `## Recovery Instructions` mentioning "3-source merge (Memory + Code Graph + CocoIndex)"
  - After injection, `updateState()` sets `pendingCompactPrime: null`
  - When `state.lastSpecFolder` is set, stdout includes `## Active Spec Folder` with the path
  - When no cached payload exists, fallback output instructs calling `memory_context({ mode: "resume" })`
- **Pass/fail criteria**:
  - PASS: Cached payload injected to stdout, sections correctly formatted, state cleared after injection, budget respected
  - FAIL: Payload not found in stdout, pendingCompactPrime not cleared, or output exceeds 4000 tokens

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 249a | SessionStart priming (compact) | Cached payload read from hook state and injected to stdout | `Validate 249a compact payload injection` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Stdout includes "Recovered Context (Post-Compaction)" with payload text, "Recovery Instructions" mentioning 3-source merge | Test output showing stdout sections | PASS if cached payload appears in stdout with correct headers | Verify hook state fixture has valid `pendingCompactPrime` object |
| 249b | SessionStart priming (compact) | pendingCompactPrime cleared from state after injection | `Validate 249b state cleanup after injection` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | `updateState()` called with `pendingCompactPrime: null` after successful injection | Test output confirming state cleared | PASS if state no longer contains pendingCompactPrime after injection | Check `hook-state.ts` updateState logic |
| 249c | SessionStart priming (compact) | Fallback when no cached payload exists | `Validate 249c compact fallback` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Stdout contains "Context Recovery" section instructing `memory_context({ mode: "resume" })` | Test output showing fallback message | PASS if fallback message appears when pendingCompactPrime is null | Verify test fixture simulates missing cache state |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/03-session-start-priming.md](../../feature_catalog/22--context-preservation-and-code-graph/03-session-start-priming.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 249
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/249-session-start-compact.md`
