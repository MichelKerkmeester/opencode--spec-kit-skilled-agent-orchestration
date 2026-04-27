---
title: "EX-001 -- Unified context retrieval (memory_context)"
description: "This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull."
audited_post_018: true
phase_018_change: Re-centered the resume path on `/spec_kit:resume`, `handover.md`, `_memory.continuity`, and supporting spec docs instead of legacy CONTINUE_SESSION wording.
---

# EX-001 -- Unified context retrieval (memory_context)

## 1. OVERVIEW

This scenario validates Unified context retrieval (memory_context) for `EX-001`. It focuses on Intent-aware context pull.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `EX-001` and confirm the expected signals without contradicting evidence.

- Objective: Intent-aware context pull through the canonical `/spec_kit:resume` recovery surface, with `handover.md` first, then `_memory.continuity`, then supporting spec docs
- Prompt: `As a retrieval validation operator, validate Unified context retrieval (memory_context) against /spec_kit:resume specs/<target-spec>. Verify intent-aware context pull through the canonical /spec_kit:resume recovery surface, with handover.md first, then _memory.continuity, then supporting spec docs. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Relevant bounded context returned; no empty response
- Pass/fail: PASS if relevant context returned in both calls

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval validation operator, validate Intent-aware context pull against /spec_kit:resume specs/<target-spec>. Verify relevant bounded context returned; no empty response. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. /spec_kit:resume specs/<target-spec>
2. memory_context({ input: "fix flaky index scan retry logic", mode: "resume", specFolder: "specs/<target-spec>", includeContent: true })
3. memory_context({ input: "fix flaky index scan retry logic", mode: "focused", sessionId: "ex001" })

### Expected

Relevant bounded context returned; no empty response

### Evidence

Tool outputs + mode selection

### Pass / Fail

- **Pass**: relevant context returned in both calls
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check specFolder/intent mismatch, retry with explicit intent

---

### Prompt

```
As a retrieval validation operator, validate the token-budget envelope contract on memory_context against memory_context({ input:"...", maxTokens:N }) at three budgets. Verify the response includes preEnforcementTokens (int >= returnedTokens), returnedTokens (int <= maxTokens), and when ALL results are dropped, droppedAllResultsReason is one of the documented enum values. Return a concise pass/fail verdict.
```

### Commands

1. `memory_context({ input:"large query expected to overflow context budget with many anchored results", maxTokens:500 })` — assert `preEnforcementTokens > returnedTokens` and no `droppedAllResultsReason`
2. `memory_context({ input:"<intentionally-too-narrow-bogus-query-string-with-no-anchor>", maxTokens:50 })` — force ALL-dropped, assert `droppedAllResultsReason` ∈ documented enum
3. `memory_context({ input:"any reasonable spec query", maxTokens:99999 })` — under-budget, assert `preEnforcementTokens === returnedTokens`

### Expected

`preEnforcementTokens` and `returnedTokens` always present (int, non-negative). `droppedAllResultsReason` only present when zero results returned and is one of the documented enum values. No envelope drift across budgets.

### Evidence

memory_context responses for all three budgets with envelope fields highlighted

### Pass / Fail

- **Pass**: envelope fields present and consistent across under-budget, over-budget, and ALL-dropped scenarios
- **Fail**: any envelope field missing, integer invariants violated, or `droppedAllResultsReason` present when results were returned

### Failure Triage

Inspect `mcp_server/handlers/memory/context.ts` token-budget enforcement path and the envelope serializer; confirm packet 003 dist marker present

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/01-unified-context-retrieval-memorycontext.md](../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--retrieval/001-unified-context-retrieval-memory-context.md`
