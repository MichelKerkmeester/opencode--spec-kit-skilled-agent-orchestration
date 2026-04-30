# Iteration 006: Causal Graph and Deep-Loop Affordances

## Focus

Identify whether causal graph signals can improve retrieval quality, trust trees, and convergence tracking.

## Sources

- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:33`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:45`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:159`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:203`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/research.md:74`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/research.md:84`
- `specs/system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/008-deep-research-review/research/research.md:92`
- `specs/system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/008-deep-research-review/research/research.md:421`

## Findings

- Causal edges encode `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, and `supports` relations (`causal-edges.ts:18`). Their traversal weights already express trust-like semantics: `supersedes` boosts, `contradicts` dampens (`causal-edges.ts:33`).
- Runtime bounds exist: max 20 edges per node, max auto strength 0.5, max strength increase per cycle 0.05, relation window cap 100 per 15 minutes (`causal-edges.ts:45`, `:203`).
- Causal edge mutations bump a generation counter and clear graph-signal caches so causal-boosted search can invalidate targeted cache keys (`causal-edges.ts:159`, `:182`).
- Prior root-cause research saw causal supersedes skew and recommended relation balance diagnostics (`002-mcp-runtime-improvement-research/research/research.md:74`, `:84`).
- The 006/008 deep-review packet used a newInfoRatio sequence and convergence audit pattern that this packet reuses for replayability (`008-deep-research-review/research/research.md:92`, `:421`).

## Insights

Causal graph has the right primitives for a RAG trust tree, but they appear underused at composed retrieval time. Phase D should test whether supersedes/supports/contradicts can become explicit answer-level evidence rather than hidden search boosts.

## Open Questions

- How often do current memory items have enough causal edges for relation-aware ranking to matter?
- Should contradiction damping be visible in citation policy, or only ranking?

## Next Focus

Analyze rerank layers and cost-of-correctness tradeoffs.

## Convergence

newInfoRatio: 0.48. The general idea of causal underuse was known; the exact source-level affordances were new.

