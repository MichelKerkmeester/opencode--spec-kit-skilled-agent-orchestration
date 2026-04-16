# Iteration 23: Edge Cases and Risk Register

## Focus
Identify edge cases and rollout risks that could surprise implementation work even if the headline phase recommendations remain correct.

## Findings
1. Raising `MIN_RESULTS_FOR_RERANK` to `4` affects the local GGUF reranker path as well as the cross-encoder path, because the minimum-results guard runs before the local reranker branch. Any change here should be described as a Stage 3 policy change, not as a cloud-reranker-only change. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:334]
2. Keeping `applyLengthPenalty` as a no-op preserves compatibility, but it also means the cache can still split identical result sets across `lp` and non-`lp` keys until the compatibility flag is removed. That is acceptable for one release cycle, but it is a real short-term inefficiency. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:241] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:425] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:468]
3. Cache-counter telemetry needs explicit reset and scope semantics. `resetSession()` already clears cache, latency, and circuit breakers, so new counters must clear there too. Also note that the cache map is process-wide while status reports a single active provider, so the packet should define whether counters are global or provider-specific. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:195] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:525]
4. Broad public continuity intent remains the riskiest partial-rollout candidate because it has to move classifier enums, auto-profile routing, MMR lambda mapping, BM25-preserving query routing, artifact fallback logic, tool schemas, and ground-truth/test datasets together. A half-implemented public intent would drift immediately. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:613] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:113] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:208] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:45]

## Ruled Out
- Treating local reranker behavior as independent from the Stage 3 minimum-results gate.

## Dead Ends
- Trying to keep a broad public continuity intent "optional" while leaving the current validator and test enums untouched.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts`

## Assessment
- New information ratio: 0.15
- Questions addressed: `RQ-6`, `RQ-7`, `RQ-8`, `RQ-9`
- Questions answered: none newly answered; this was a risk-enumeration pass

## Reflection
- What worked and why: Looking for "what breaks if we only partially ship this?" uncovered sharper risks than replaying the recommended end state.
- What did not work and why: The current status surface does not tell us whether cache counters should be per-provider or process-wide, so the packet must define that explicitly during implementation.
- What I would do differently: Add an "edge cases" subsection to each follow-on phase packet before coding starts.

## Recommended Next Focus
Confirm the safest continuity-specific K-sweep extension path and keep it additive so the supporting benchmark work does not destabilize existing evaluation tests.
