# Iteration 3: Canonical Decay and Source-of-Truth Paths

## Focus
Confirm the canonical FSRS constant and correct the packet's file-path assumptions so later tuning work references the real runtime surfaces.

## Findings
1. The packet spec lists stale Stage 1 and Stage 2 paths; the real runtime files live under `lib/search/pipeline/`, while hybrid fusion list assembly also happens in `lib/search/hybrid-search.ts`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221]
2. The `0.2346` factor is not an arbitrary search constant. It is the canonical FSRS v4 `19/81` factor established in the scheduler and repeated in cognitive documentation and search-time decay comments. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:10] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:121] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:7]
3. `search-weights.json` explicitly records that `rrfFusion` and `crossEncoder` sections were removed as dead config, reinforcing that fusion and rerank tuning now live in TypeScript code rather than JSON. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:28] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/README.md:44]

## Ruled Out
- Treating the packet's shorter Stage 1 and Stage 2 file paths as authoritative.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:10`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:121`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:7`
- `.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:28`

## Assessment
- New information ratio: 0.72
- Questions addressed: `RQ-1`, `RQ-2`
- Questions answered: `RQ-2`

## Reflection
- What worked and why: Cross-checking code comments, docs, and config notes quickly separated canonical invariants from packet-local knobs.
- What did not work and why: The packet's file list would have hidden the fact that the hybrid path is split across shared algorithms and `hybrid-search.ts`.
- What I would do differently: Move next into the shared adaptive/RRF algorithms so the real precision levers are explicit.

## Recommended Next Focus
Analyze adaptive fusion weight profiles and how hybrid-search applies them before RRF.
