# Iteration 20 -- 003-contextador

## Metadata
- Run: 20 of 20
- Focus: final closure pass: novelty-vs-duplication boundary against CocoIndex, Code Graph, and session bootstrap
- Agent: codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-08T07:49:58Z
- Tool calls used: 6

## Focus
Close Q12 by comparing Contextador's surviving value to the current Public retrieval stack, using direct source references on both sides instead of packet-level summaries.

## Findings
- Q12 answer, what is genuinely new: Contextador's clearest additive ideas remain runtime ergonomics layered over retrieval artifacts, not a stronger retrieval substrate. The genuinely distinctive parts are the single natural-language `context` facade, query-triggered repair, Mainframe-style answer-cache reuse, and low-friction project scaffolding (`external/src/mcp.ts:185-340`, `external/src/mcp.ts:415-671`). [SOURCE: external/src/mcp.ts:185-340] [SOURCE: external/src/mcp.ts:415-671]
- Q12 answer, what only duplicates or weakens Public: Contextador's live payload is still markdown-derived pointer text, whereas Public already has semantic search via CocoIndex, structural traversal via `code_graph_query`, and merged recovery via `session_bootstrap` / `memory_context`. On those axes, Contextador duplicates or underperforms existing Public surfaces rather than extending them (`external/src/lib/core/pointers.ts:14-190`, `.opencode/skill/mcp-coco-index/README.md:42-86`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-44`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217`). [SOURCE: external/src/lib/core/pointers.ts:14-190] [SOURCE: .opencode/skill/mcp-coco-index/README.md:42-86] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-44] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217]
- The right synthesis boundary is therefore stable after 20 iterations: keep studying the routing facade, repair loop, bounded collaboration cache, and onboarding flow; reject Contextador as a semantic-search, graph-query, or session-recovery replacement for `Code_Environment/Public`. [INFERENCE: based on external/src/mcp.ts:185-340, external/src/lib/core/pointers.ts:14-190, .opencode/skill/mcp-coco-index/README.md:42-86, .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238, and .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217]
- Closing quality note: this pass answered the last unresolved packet question without discovering a new top-level subsystem, which is a strong sign that the extension reached diminishing returns for this repo snapshot. [INFERENCE: based on the 20-iteration state log plus direct comparison sources above]

## Ruled Out
No new approaches were ruled out in this iteration.

## Dead Ends
No permanent dead ends were added in this iteration.

## Sources Consulted
- `external/src/mcp.ts:185-340`
- `external/src/mcp.ts:415-671`
- `external/src/lib/core/pointers.ts:14-190`
- `.opencode/skill/mcp-coco-index/README.md:42-86`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-44`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217`

## Assessment
- New information ratio: 0.12
- Questions addressed: Q12
- Questions answered: Q12

## Reflection
- What worked and why: doing the final comparison directly against Public source surfaces kept the recommendation boundary honest and prevented cargo-cult adoption of Contextador's weaker layers.
- What did not work and why: packet-level summaries alone were too coarse for the final keep-versus-reject decision because Q12 is fundamentally comparative.
- What I would do differently: if the repo later prototypes any of these ideas, separate ergonomic wrappers from retrieval backends in the packet structure from day one.

## Recommended Next Focus
[All tracked questions are resolved. Proceed to synthesis.]
