---
title: "142 -- Session transition trace contract"
description: "This scenario validates Session transition trace contract for `142`. It focuses on Verify `memory_context` emits trace-only session transitions with no non-trace leakage."
---

# 142 -- Session transition trace contract

## 1. OVERVIEW

This scenario validates Session transition trace contract for `142`. It focuses on Verify `memory_context` emits trace-only session transitions with no non-trace leakage.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `142` and confirm the expected signals without contradicting evidence.

- Objective: Verify `memory_context` emits trace-only session transitions with no non-trace leakage
- Prompt: `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Trace-enabled responses include spec-shaped `sessionTransition`; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled
- Pass/fail: PASS if trace-only gating holds and the contract fields are present only in the traced call

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 142 | Session transition trace contract | Verify `memory_context` emits trace-only session transitions with no non-trace leakage | `Validate Markovian session transition tracing for memory_context. Capture the evidence needed to prove Trace-enabled responses include spec-shaped sessionTransition; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_context({ input: "resume previous work on rollout hardening", mode: "resume", sessionId: "markovian-142", includeTrace: true })` 2) Verify each result exposes `trace.sessionTransition.previousState`, `currentState`, `confidence`, and ordered `signalSources` 3) Repeat without `includeTrace` and verify `sessionTransition` is absent 4) Confirm the non-trace response does not expose transition data in top-level metadata | Trace-enabled responses include spec-shaped `sessionTransition`; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled | Two `memory_context` outputs with and without `includeTrace` + field-level comparison | PASS if trace-only gating holds and the contract fields are present only in the traced call | Inspect `handlers/memory-context.ts`, `handlers/memory-search.ts`, and `lib/search/session-transition.ts` if fields leak or ordering drifts |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/01-unified-context-retrieval-memorycontext.md](../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 142
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/142-session-transition-trace-contract.md`
