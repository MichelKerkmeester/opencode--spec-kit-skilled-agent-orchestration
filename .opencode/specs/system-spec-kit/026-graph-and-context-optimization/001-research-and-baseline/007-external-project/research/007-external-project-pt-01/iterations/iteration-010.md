# Iteration 010: Follow-Up Implementation Packets and Convergence

## Focus

Close the 10-iteration run with implementation sequencing, unresolved risks, and convergence status.

## Actions Taken

- Reviewed all resolved questions and candidate decisions.
- Grouped recommendations into implementation packets by owner and validation strategy.
- Checked whether remaining uncertainty requires more research or implementation design.

## Findings

- First follow-up packet should be Code Graph "phase DAG and edge metadata": add phase timing/failure attribution and first-class confidence/reason/evidence metadata without changing storage engines. [SOURCE: external/src/core/ingestion/pipeline-phases/runner.ts:147]
- Second packet should be Code Graph "impact and detect changes": add graph-backed pre/post-change analysis with untracked-file fallback and explicit confidence. [SOURCE: external/src/mcp/tools.ts:221] [SOURCE: external/src/mcp/tools.ts:285]
- Third packet should be Code Graph "route/tool/API maps": implement route and tool entrypoint extraction with explicit `no_shape`, `no_consumers`, and `mismatch` status. [SOURCE: external/src/mcp/tools.ts:400] [SOURCE: external/src/mcp/tools.ts:423]
- Fourth packet should be Skill Graph "capability contracts": model skills, commands, hooks, and MCP tools as provider/consumer contracts and feed existing graph_causal scoring rather than adding a new lane. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:50]
- Fifth packet should be Memory "code-evidence causal links": store stable Code Graph evidence references in memory lineage without duplicating structural code edges. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18]

## Questions Answered

- What should be adopted, adapted, rejected, or deferred, and what follow-up implementation packets should be created?

## Questions Remaining

- Exact implementation packet numbering and whether to combine the first two Code Graph packets.
- Exact schema for Memory-to-CodeGraph evidence links.
- Exact source set for Skill Graph capability contracts.

## Ruled Out

- Continuing beyond 10 iterations now; novelty has dropped and the user requested a fixed 10-iteration run.

## Dead Ends

- Single shared graph for code, memory, and skills; the better architecture is shared evidence with separate ownership boundaries.

## Sources Consulted

- external/src/core/ingestion/pipeline-phases/runner.ts:147
- external/src/mcp/tools.ts:221
- external/src/mcp/tools.ts:285
- external/src/mcp/tools.ts:400
- external/src/mcp/tools.ts:423
- .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:50
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18

## Reflection

- What worked and why: The run now has enough evidence to plan scoped implementation work.
- What did not work and why: A single mega-packet would mix storage, MCP surface, memory lineage, and routing changes.
- What I would do differently: Run implementation planning as separate owner-scoped specs.

## Recommended Next Focus

Synthesize `research.md`, emit a resource map, update `spec.md` with the generated findings block, and save continuity.
