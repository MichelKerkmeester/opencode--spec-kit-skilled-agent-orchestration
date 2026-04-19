# Iteration 14: Telemetry Exposure Strategy and Phase-002 Guardrails

## Focus
Decide how far phase `002-add-reranker-telemetry` should go beyond `cross-encoder.ts`, given that the repo already has a broader retrieval-telemetry system.

## Findings
1. The current retrieval-telemetry contract already models rerank latency (`rerankLatencyMs`) and fallback state, but it does not yet have a dedicated reranker-status or cache snapshot field. That makes it a good mirror surface, not the canonical source of cache counters. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:57] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:236] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:264]
2. Phase `002` can stay within its current packet scope if it does only two things:
   - add counters to `cross-encoder.ts` module state and `getRerankerStatus()`
   - update the existing `cross-encoder` test suites to assert the new `cache` block and reset behavior.
   Anything beyond that is optional follow-on exposure work. [INFERENCE: no production consumer currently requires immediate handler changes]
3. If the team wants the counters visible during normal search runs, the lowest-friction follow-on is to inject a snapshot of `getRerankerStatus()` into retrieval telemetry at request end when extended telemetry is enabled. That reuses an existing observability contract rather than proliferating new endpoints. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:98] [INFERENCE: retrieval telemetry is already the place where rerank timing is serialized]
4. Reset semantics matter: `resetSession()` already clears cache, latency, and circuit breakers, so phase `002` should fold the new counters into the same reset path or the existing tests will become misleading. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:525]

## Ruled Out
- Coupling phase `002` to TTL retuning or dashboard work; the packet sub-phase spec is right to keep that out of scope.

## Dead Ends
- Treating `getRerankerStatus()` as already operator-visible; the repo evidence does not support that.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts`
- `017-research-search-fusion-tuning/002-add-reranker-telemetry/spec.md`

## Assessment
- New information ratio: 0.59
- Questions addressed: `RQ-7`
- Questions answered: `RQ-7`

## Reflection
- What worked and why: Comparing the packet sub-phase scope against the existing telemetry contracts prevented phase creep.
- What did not work and why: The phrase "existing status surface" sounds broader than the current implementation really is.
- What I would do differently: Separate "status source of truth" from "operator-visible exposure" explicitly in future specs.

## Recommended Next Focus
Map the continuity-profile insertion seam and decide whether phase `003` can stay adaptive-fusion-only or must widen into the intent-classifier stack.
