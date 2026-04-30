---
title: "219 -- Embeddings and Retry API"
description: "This scenario validates Embeddings and Retry API for `219`. It focuses on verifying the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers."
audited_post_018: true
---

# 219 -- Embeddings and Retry API

## 1. OVERVIEW

This scenario validates Embeddings and Retry API for `219`. It focuses on verifying the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers.
- Real user request: `` Please validate Embeddings and Retry API against mcp_server/api/providers.ts and tell me whether the expected signals are present: `mcp_server/api/providers.ts` is a pure public re-export surface; `shared/embeddings.ts` contains the documented weighted text, cache, batching, and profile helpers; `retry-manager.ts` encodes pending/retry/failed/success recovery, retry delays, circuit breaker behavior, and successful refresh of vector/index state. ``
- RCAF Prompt: `As a pipeline validation operator, validate Embeddings and Retry API against mcp_server/api/providers.ts. Verify the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `mcp_server/api/providers.ts` is a pure public re-export surface; `shared/embeddings.ts` contains the documented weighted text, cache, batching, and profile helpers; `retry-manager.ts` encodes pending/retry/failed/success recovery, retry delays, circuit breaker behavior, and successful refresh of vector/index state
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the stable API surface, shared embedding substrate, and retry orchestration layers align with the documented contract; FAIL if public exports are incomplete, shared embedding lifecycle helpers are missing, or retry recovery behavior is not present

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline validation operator, verify the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers against mcp_server/api/providers.ts. Verify mcp_server/api/providers.ts is a pure public re-export surface; shared/embeddings.ts contains the documented weighted text, cache, batching, and profile helpers; retry-manager.ts encodes pending/retry/failed/success recovery, retry delays, circuit breaker behavior, and successful refresh of vector/index state. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Inspect `mcp_server/api/providers.ts` and capture the exported public symbols
2. Inspect `shared/embeddings.ts` and confirm the documented weighted text construction, cache policy, lazy provider setup, batch behavior, and profile helpers are present
3. Inspect `mcp_server/lib/providers/retry-manager.ts` and confirm queue states, retry delays, circuit breaker rules, sanitized provider errors, and success-path refresh logic
4. Run an import smoke test or equivalent script check that consumes the public symbols from `mcp_server/api/providers` only
5. Correlate the public API with the shared and retry layers to confirm the documented responsibilities line up end to end

### Expected

`mcp_server/api/providers.ts` is a pure public re-export surface; `shared/embeddings.ts` contains the documented weighted text, cache, batching, and profile helpers; `retry-manager.ts` encodes pending/retry/failed/success recovery, retry delays, circuit breaker behavior, and successful refresh of vector/index state

### Evidence

Public export capture + annotated snippets or notes from `shared/embeddings.ts` + retry-manager evidence showing queue/backoff/circuit-breaker behavior + import smoke-test transcript or equivalent script proof

### Pass / Fail

- **Pass**: the stable API surface, shared embedding substrate, and retry orchestration layers align with the documented contract
- **Fail**: public exports are incomplete, shared embedding lifecycle helpers are missing, or retry recovery behavior is not present

### Failure Triage

Check `mcp_server/api/providers.ts` for missing or renamed re-exports -> inspect `shared/embeddings.ts` for drift in cache, batching, or profile helpers -> verify retry delay, max retry, and circuit breaker logic in `retry-manager.ts` -> confirm public callers are not forced to import private provider modules directly

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/23-embeddings-and-retry-api.md](../../feature_catalog/14--pipeline-architecture/23-embeddings-and-retry-api.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 219
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/219-embeddings-and-retry-api.md`
