# Iteration 2: Stage 1, Stage 2, and search-weights Inventory

## Focus
Document the remaining hardcoded values across candidate generation, post-fusion recency scoring, and the `search-weights.json` file named by the packet.

## Findings
1. Stage 1 hardcodes several retrieval thresholds and caps: deep-mode variants `3`, deep-expansion timeout `5000ms`, multi-concept minimum similarity `0.5`, constitutional inject limit `5`, and expansion candidate limit `5`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:69]
2. Stage 2 adds its own bounded freshness layer with `SPECKIT_RECENCY_FUSION_WEIGHT=0.07` and `SPECKIT_RECENCY_FUSION_CAP=0.10`, plus validation multipliers clamped to `0.8-1.2`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:125]
3. `search-weights.json` only carries `smartRanking` values `relevance=0.5`, `recency=0.3`, and `access=0.2`; it no longer carries live RRF or cross-encoder config. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:21] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/README.md:40]

## Ruled Out
- None this iteration.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:69`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:125`
- `.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:21`
- `.opencode/skill/system-spec-kit/mcp_server/configs/README.md:40`

## Assessment
- New information ratio: 0.78
- Questions addressed: `RQ-1`, `RQ-4`
- Questions answered: none

## Reflection
- What worked and why: Reading the config README alongside the JSON prevented over-attributing behavior to a stale config surface.
- What did not work and why: The packet name suggests a single config file governs ranking, but the code clearly splits vector and hybrid responsibilities.
- What I would do differently: Verify the canonical decay math next so the fusion-vs-decay boundary is explicit.

## Recommended Next Focus
Trace FSRS decay and verify which files are actually canonical for continuity-related ranking behavior.
