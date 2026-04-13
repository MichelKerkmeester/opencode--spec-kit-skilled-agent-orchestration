# Iteration 11: Length Penalty Call Graph and Compatibility Surface

## Focus
Trace every code path that still depends on the cross-encoder length-penalty feature so phase `001-remove-length-penalty` can remove scoring logic without accidentally breaking public search contracts.

## Findings
1. The actual penalty logic is fully localized inside `cross-encoder.ts`: `LENGTH_PENALTY`, `calculateLengthPenalty()`, `applyLengthPenalty()`, and the conditional branch inside `rerankResults()` are the only production scoring sites. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:212] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:218] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:389]
2. The blast radius is wider than one file because `applyLengthPenalty` is a public search argument: it is accepted by the tool schemas, typed in tool args, defaulted in `memory-search.ts`, included in the cache key, and forwarded into the pipeline config. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:160] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:137] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/types.ts:69] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:643] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:50] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:144]
3. A safe first implementation for phase `001` is therefore "remove scoring effect, keep compatibility flag as a no-op" rather than "delete the flag everywhere in the same pass". That keeps the MCP/tool surface stable while honoring the user decision to remove the penalty entirely. [INFERENCE: production scoring is localized, but request-contract plumbing is broad]
4. The shadow replay path hardcodes `applyLengthPenalty: true`, so removing the scoring code without cleaning up the replay config is safe, but deleting the flag entirely would create avoidable churn in unrelated evaluation code. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:223]

## Ruled Out
- Treating phase `001` as a one-line constant deletion with no compatibility work.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts`

## Assessment
- New information ratio: 0.74
- Questions addressed: `RQ-6`
- Questions answered: none fully; this pass mapped the removal surface.

## Reflection
- What worked and why: Following the parameter from tool schema to pipeline config made the compatibility risk obvious very quickly.
- What did not work and why: Looking only at `cross-encoder.ts` would have understated the operator-facing blast radius.
- What I would do differently: Start every "remove a ranking knob" pass with a schema-to-runtime trace before touching the scoring file.

## Recommended Next Focus
Inspect the dedicated test suites and source-analysis assertions that currently lock the old penalty behavior in place.
