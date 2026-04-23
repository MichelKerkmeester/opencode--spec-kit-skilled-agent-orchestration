## Iteration 02

### Focus
Adaptive fusion calibration in the live hybrid path: whether document-type and recency weights described by the adaptive fusion module are actually applied during normal retrieval.

### Findings
- The adaptive fusion module defines per-intent profiles, including `continuity`, and explicitly supports document-type adjustments plus a post-fusion recency boost. Evidence: `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60-68`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:138-187`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:193-249`
- The live hybrid search path calls `getAdaptiveWeights(intent)` without a `documentType`, then drops `recencyWeight` from the destructured values and goes straight to `fuseResultsMulti(...)`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221-1253`
- Stage 2 then applies a fixed global recency bonus (`0.07` weight, `0.10` cap) after fusion, which is a different mechanism from the intent-aware recency boost described in `adaptive-fusion.ts`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:125-131`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:998-1023`
- Stage 2 also avoids reapplying intent weights on hybrid results to prevent double-counting, so the hybrid path has no later chance to recover the omitted document-type and adaptive recency behavior. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1209-1226`

### New Questions
- Was bypassing `adaptiveFuse()` intentional for performance, or is it now stale relative to the documented fusion design?
- Which retrieval callers can supply document type today, and where is that information lost before hybrid fusion?
- Would wiring `adaptiveFuse()` into the hybrid path change ranking behavior for continuity and decision-heavy queries?
- Are existing regression tests only validating the helper module, not the live hybrid execution path?

### Status
new-territory
