# Plan: 015-rrf-hybrid-retrieval-evaluation

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts`

## Investigation Order
1. Baseline current Public hybrid retrieval and current RRF tests.
2. Define a Mnemosyne-shaped comparison contract using existing query fixtures.
3. Measure recall, latency, cold-start, and regression behavior under the comparison pack.
4. Decide whether any gap remains that justifies future wrapper or ergonomics work.

## Experiments
- Run retrieval-regression cases that compare current hybrid output, ablation deltas, and query classes that a thin wrapper would claim to help.
- Add compaction-continuity and cold-start measurements so retrieval quality is not judged in isolation.
- Record the difference between ranking quality gains and ergonomics-only gains.

## Decision Criteria
- Advance only if a measured gap remains after current RRF, reranking, and multi-channel behavior are accounted for.
- Reject if Mnemosyne's value is mostly a wrapper or operational story and not a retrieval-quality improvement for Public.

## Exit Condition
Decide whether current retrieval is sufficient, whether a narrower evaluation harness is needed, or whether Mnemosyne-inspired hybrid work should stop here.
