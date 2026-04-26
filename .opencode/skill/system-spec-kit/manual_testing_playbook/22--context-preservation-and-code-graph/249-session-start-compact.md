---
title: "249 -- SessionStart injects post-compact context"
description: "This scenario validates SessionStart priming (compact) for 249. It focuses on SessionStart reads cached payload and injects via stdout."
audited_post_018: true
phase_018_change: "Updated the fallback recovery instruction to point at /spec_kit:resume and the canonical packet continuity chain."
---

# 249 -- SessionStart injects post-compact context

## 1. OVERVIEW

This scenario validates SessionStart priming (compact).

---

## 2. SCENARIO CONTRACT

- **Objective**: Verify that the SessionStart hook, when triggered with `source=compact`, reads the cached PreCompact payload from hook state, injects it to stdout with "Recovered Context (Post-Compaction)" and "Recovery Instructions" sections, includes the last spec folder if known, clears the `pendingCompactPrime` from state after injection, points recovery back to `/spec_kit:resume` when the cache is missing, and stays within the 4000-token budget (COMPACTION_TOKEN_BUDGET).
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - Hook state directory exists with a valid session state file containing `pendingCompactPrime`
- **Prompt**: `As a context-and-code-graph validation operator, validate SessionStart injects post-compact context against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify the SessionStart hook, when triggered with source=compact, reads the cached PreCompact payload from hook state, injects it to stdout with "Recovered Context (Post-Compaction)" and "Recovery Instructions" sections, includes the last spec folder if known, clears the pendingCompactPrime from state after injection, points recovery back to /spec_kit:resume when the cache is missing, and stays within the 4000-token budget (COMPACTION_TOKEN_BUDGET). Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - All vitest tests in `hook-session-start.vitest.ts` pass for compact source
  - `loadState(sessionId)` returns object with `pendingCompactPrime.payload` and `pendingCompactPrime.cachedAt`
  - Stdout contains `## Recovered Context (Post-Compaction)` followed by the cached payload text
  - Stdout contains `## Recovery Instructions` mentioning "3-source merge (Memory + Code Graph + CocoIndex)" and `/spec_kit:resume`
  - After injection, `updateState()` sets `pendingCompactPrime: null`
  - When `state.lastSpecFolder` is set, stdout includes `## Active Spec Folder` with the path
  - When no cached payload exists, fallback output instructs calling `/spec_kit:resume`
- **Pass/fail criteria**:
  - PASS: Cached payload injected to stdout, sections correctly formatted, state cleared after injection, budget respected
  - FAIL: Payload not found in stdout, pendingCompactPrime not cleared, or output exceeds 4000 tokens

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Cached payload read from hook state and injected to stdout against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify stdout includes "Recovered Context (Post-Compaction)" with payload text, "Recovery Instructions" mentioning 3-source merge. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Stdout includes "Recovered Context (Post-Compaction)" with payload text, "Recovery Instructions" mentioning 3-source merge

### Evidence

Test output showing stdout sections

### Pass / Fail

- **Pass**: cached payload appears in stdout with correct headers
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify hook state fixture has valid `pendingCompactPrime` object

---

### Prompt

```
As a context-and-code-graph validation operator, validate pendingCompactPrime cleared from state after injection against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify updateState() called with pendingCompactPrime: null after successful injection. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

`updateState()` called with `pendingCompactPrime: null` after successful injection

### Evidence

Test output confirming state cleared

### Pass / Fail

- **Pass**: state no longer contains pendingCompactPrime after injection
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `hook-state.ts` updateState logic

---

### Prompt

```
As a context-and-code-graph validation operator, validate Fallback when no cached payload exists against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts. Verify stdout contains "Context Recovery" section instructing /spec_kit:resume. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts

### Expected

Stdout contains "Context Recovery" section instructing `/spec_kit:resume`

### Evidence

Test output showing fallback message

### Pass / Fail

- **Pass**: fallback message appears when pendingCompactPrime is null
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify test fixture simulates missing cache state

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/03-session-start-priming.md](../../feature_catalog/22--context-preservation-and-code-graph/03-session-start-priming.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 249
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/249-session-start-compact.md`
