# Iteration 005: Route, API, Shape, and Tool Maps

## Focus

Evaluate External Project route/API/tool affordances as candidates for Code Graph safety and Skill Graph entrypoint modeling.

## Actions Taken

- Read tool definitions for `route_map`, `tool_map`, `shape_check`, and `api_impact`.
- Folded sidecar findings about route shape coverage gaps and Tool nodes.
- Mapped these concepts to Public Code Graph and Skill Graph ownership.

## Findings

- External Project `route_map` maps API routes to handlers and consumers, which is directly useful for pre-change API work. [SOURCE: external/src/mcp/tools.ts:400]
- External Project `tool_map` shows MCP/RPC tool definitions, handler files, and descriptions. [SOURCE: external/src/mcp/tools.ts:423]
- External Project `shape_check` compares route response keys against consumer property accesses, but sidecar evidence warns that unknown coverage can disappear when routes lack both shape and consumer data. [SOURCE: external/src/mcp/tools.ts:439]
- External Project `api_impact` combines route map, shape check, and impact data into one route-handler pre-change report. [SOURCE: external/src/mcp/tools.ts:462]
- Tool nodes and `HANDLES_TOOL` edges are especially relevant to Skill Graph because they can model command/tool entrypoints as graph nodes instead of passive text metadata. [SOURCE: external/src/core/ingestion/pipeline-phases/tools.ts:77]

## Questions Answered

- Partially answered: Tool/resource affordances are portable to Skill Graph, while route/API affordances are Code Graph-owned.

## Questions Remaining

- Whether route and tool nodes should be derived by Public Code Graph or by a separate Skill/Command Graph scanner.

## Ruled Out

- Reporting shape-check results only when complete data exists; Public should surface `no_shape`, `no_consumers`, and `mismatch` as separate states.

## Dead Ends

- Treating route API impact as memory responsibility. It belongs in Code Graph, with Memory linking later decisions to graph evidence.

## Sources Consulted

- external/src/mcp/tools.ts:400
- external/src/mcp/tools.ts:423
- external/src/mcp/tools.ts:439
- external/src/mcp/tools.ts:462
- external/src/core/ingestion/pipeline-phases/tools.ts:77

## Reflection

- What worked and why: Separating route and tool ownership kept the research from blending Code Graph and Skill Graph responsibilities.
- What did not work and why: Shape checking is attractive but coverage-sensitive.
- What I would do differently: Prototype explicit unknown-coverage statuses before mismatch scoring.

## Recommended Next Focus

Evaluate group mode, Contract Registry, resources, and cross-repo impact.
