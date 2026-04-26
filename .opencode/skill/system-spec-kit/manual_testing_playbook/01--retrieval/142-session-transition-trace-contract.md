---
title: "142 -- Session transition trace contract"
description: "This scenario validates Session transition trace contract for `142`. It focuses on Verify `memory_context` emits trace-only session transitions with no non-trace leakage."
audited_post_018: true
---

# 142 -- Session transition trace contract

## 1. OVERVIEW

This scenario validates Session transition trace contract for `142`. It focuses on Verify `memory_context` emits trace-only session transitions with no non-trace leakage.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `142` and confirm the expected signals without contradicting evidence.

- Objective: Verify `memory_context` emits trace-only session transitions with no non-trace leakage
- Prompt: `As a retrieval validation operator, validate Session transition trace contract against memory_context({ input: "resume previous work on rollout hardening", mode: "resume", sessionId: "markovian-142", includeTrace: true }). Verify memory_context emits trace-only session transitions with no non-trace leakage. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Trace-enabled responses include spec-shaped `sessionTransition`; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled
- Pass/fail: PASS if trace-only gating holds and the contract fields are present only in the traced call

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval validation operator, verify memory_context emits trace-only session transitions with no non-trace leakage against memory_context({ input: "resume previous work on rollout hardening", mode: "resume", sessionId: "markovian-142", includeTrace: true }). Verify trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `memory_context({ input: "resume previous work on rollout hardening", mode: "resume", sessionId: "markovian-142", includeTrace: true })`
2. Verify each result exposes `trace.sessionTransition.previousState`, `currentState`, `confidence`, and ordered `signalSources`
3. Repeat without `includeTrace` and verify `sessionTransition` is absent
4. Confirm the non-trace response does not expose transition data in top-level metadata

### Expected

Trace-enabled responses include spec-shaped `sessionTransition`; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled

### Evidence

Two `memory_context` outputs with and without `includeTrace` + field-level comparison

### Pass / Fail

- **Pass**: trace-only gating holds and the contract fields are present only in the traced call
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `handlers/memory-context.ts`, `handlers/memory-search.ts`, and `lib/search/session-transition.ts` if fields leak or ordering drifts

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/01-unified-context-retrieval-memorycontext.md](../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 142
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/142-session-transition-trace-contract.md`
