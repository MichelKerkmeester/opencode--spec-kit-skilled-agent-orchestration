# Iteration 14 -- 003-contextador

## Metadata
- Run: 14 of 20
- Focus: question closure pass: MCP tool surface, payload shape, and routeQuery decision flow
- Agent: codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-08T07:15:12Z
- Tool calls used: 5

## Focus
Convert the earlier broad source sweep into explicit answers for Q1-Q3 by reading the authoritative MCP registrations and the live routing/pointer path side by side.

## Findings
- Q1 answer: the live MCP surface is 11 explicitly registered tools, and the flagship `context` workflow is cache check -> local routing -> pointer serialization -> optional broadcast, not "query plus typed object plus direct file snippets" (`external/src/mcp.ts:185-282`, `external/src/mcp.ts:344-671`). [SOURCE: external/src/mcp.ts:185-282] [SOURCE: external/src/mcp.ts:344-671]
- Q2 answer: the library defines a richer `ContextResponse` shape with `files`, `types`, `dependencies`, `apiSurface`, `tests`, and `contextChain`, but the MCP `context` tool never emits that structure; it extracts a narrower `Pointers` object from `CONTEXT.md` headings and returns plain text via `serializePointers(...)` and `text(...)` (`external/src/lib/core/types.ts:49-62`, `external/src/lib/core/pointers.ts:14-20`, `external/src/lib/core/pointers.ts:23-190`, `external/src/mcp.ts:243-282`). [SOURCE: external/src/lib/core/types.ts:49-62] [SOURCE: external/src/lib/core/pointers.ts:14-20] [SOURCE: external/src/lib/core/pointers.ts:23-190] [SOURCE: external/src/mcp.ts:243-282]
- Q3 answer: `routeQuery()` loads `.contextador/briefing.md` when present or builds a summary from every `CONTEXT.md`, asks `local-fast` for JSON `targetScopes`, validates/fuzzy-matches those scopes against real directories, and falls back to keyword scoring with path boosts, hit-log bonuses, and a 60% top-score threshold for fan-out when the model path fails (`external/src/lib/core/headmaster.ts:16-35`, `external/src/lib/core/headmaster.ts:61-126`, `external/src/lib/core/headmaster.ts:128-157`, `external/src/lib/core/headmaster.ts:199-242`). [SOURCE: external/src/lib/core/headmaster.ts:16-35] [SOURCE: external/src/lib/core/headmaster.ts:61-126] [SOURCE: external/src/lib/core/headmaster.ts:128-157] [SOURCE: external/src/lib/core/headmaster.ts:199-242]
- The agent-workflow promise in the `context` tool description is therefore partly ergonomic and partly marketing: the live contract strongly nudges agents away from direct file reads first, but it serves markdown-derived pointer text rather than a deeper semantic or structural substrate (`external/src/mcp.ts:185-189`, `external/src/lib/core/pointers.ts:151-190`). [SOURCE: external/src/mcp.ts:185-189] [SOURCE: external/src/lib/core/pointers.ts:151-190]

## Ruled Out
No new approaches were ruled out in this iteration.

## Dead Ends
No permanent dead ends were added in this iteration.

## Sources Consulted
- `external/src/mcp.ts:185-282`
- `external/src/mcp.ts:344-671`
- `external/src/lib/core/headmaster.ts:16-242`
- `external/src/lib/core/pointers.ts:14-190`
- `external/src/lib/core/types.ts:49-62`

## Assessment
- New information ratio: 0.19
- Questions addressed: Q1, Q2, Q3
- Questions answered: Q1, Q2, Q3

## Reflection
- What worked and why: reading the MCP entrypoint and the routing/pointer helpers together made it easy to separate the public tool promise from the actual returned payload.
- What did not work and why: relying on prior packet synthesis alone would have been weaker here because the open questions were about contract shape, not just recommendation posture.
- What I would do differently: if a future pass revisits agent ergonomics, compare the `context` tool description against real user transcripts or integration tests instead of source-only intent.

## Recommended Next Focus
Resolve Q4-Q5 directly from the feedback, janitor, and generator path so the self-healing claim is closed with source-backed boundaries rather than packet-level summary language.
