---
title: "219 -- Embeddings and Retry API"
description: "This scenario validates Embeddings and Retry API for `219`. It focuses on verifying the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers."
---

# 219 -- Embeddings and Retry API

## 1. OVERVIEW

This scenario validates Embeddings and Retry API for `219`. It focuses on verifying the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `219` and confirm the expected signals without contradicting evidence.

- Objective: Verify the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers
- Prompt: `Validate the embeddings and retry API. Capture the evidence needed to prove \`mcp_server/api/providers\` exposes \`generateEmbedding\`, \`generateQueryEmbedding\`, \`getEmbeddingProfile\`, and the \`retryManager\` namespace as the stable public contract, while \`shared/embeddings.ts\` supplies weighted text, caching, lazy initialization, batching, and retry-aware embedding helpers and \`mcp_server/lib/providers/retry-manager.ts\` handles queued recovery, backoff, circuit breaking, and vector refresh. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `mcp_server/api/providers.ts` is a pure public re-export surface; `shared/embeddings.ts` contains the documented weighted text, cache, batching, and profile helpers; `retry-manager.ts` encodes pending/retry/failed/success recovery, retry delays, circuit breaker behavior, and successful refresh of vector/index state
- Pass/fail: PASS if the stable API surface, shared embedding substrate, and retry orchestration layers align with the documented contract; FAIL if public exports are incomplete, shared embedding lifecycle helpers are missing, or retry recovery behavior is not present

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 219 | Embeddings and Retry API | Verify the public provider API stays stable while embedding generation, caching, batching, retry backoff, and recovery behavior remain wired through the documented layers | `Validate the embeddings and retry API. Capture the evidence needed to prove \`mcp_server/api/providers\` exposes \`generateEmbedding\`, \`generateQueryEmbedding\`, \`getEmbeddingProfile\`, and the \`retryManager\` namespace as the stable public contract, while \`shared/embeddings.ts\` supplies weighted text, caching, lazy initialization, batching, and retry-aware embedding helpers and \`mcp_server/lib/providers/retry-manager.ts\` handles queued recovery, backoff, circuit breaking, and vector refresh. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Inspect `mcp_server/api/providers.ts` and capture the exported public symbols 2) Inspect `shared/embeddings.ts` and confirm the documented weighted text construction, cache policy, lazy provider setup, batch behavior, and profile helpers are present 3) Inspect `mcp_server/lib/providers/retry-manager.ts` and confirm queue states, retry delays, circuit breaker rules, sanitized provider errors, and success-path refresh logic 4) Run an import smoke test or equivalent script check that consumes the public symbols from `mcp_server/api/providers` only 5) Correlate the public API with the shared and retry layers to confirm the documented responsibilities line up end to end | `mcp_server/api/providers.ts` is a pure public re-export surface; `shared/embeddings.ts` contains the documented weighted text, cache, batching, and profile helpers; `retry-manager.ts` encodes pending/retry/failed/success recovery, retry delays, circuit breaker behavior, and successful refresh of vector/index state | Public export capture + annotated snippets or notes from `shared/embeddings.ts` + retry-manager evidence showing queue/backoff/circuit-breaker behavior + import smoke-test transcript or equivalent script proof | PASS if the stable API surface, shared embedding substrate, and retry orchestration layers align with the documented contract; FAIL if public exports are incomplete, shared embedding lifecycle helpers are missing, or retry recovery behavior is not present | Check `mcp_server/api/providers.ts` for missing or renamed re-exports -> inspect `shared/embeddings.ts` for drift in cache, batching, or profile helpers -> verify retry delay, max retry, and circuit breaker logic in `retry-manager.ts` -> confirm public callers are not forced to import private provider modules directly |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/23-embeddings-and-retry-api.md](../../feature_catalog/14--pipeline-architecture/23-embeddings-and-retry-api.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 219
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/219-embeddings-and-retry-api.md`
