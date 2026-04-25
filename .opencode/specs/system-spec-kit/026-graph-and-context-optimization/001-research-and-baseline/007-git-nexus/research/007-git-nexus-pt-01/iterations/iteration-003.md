# Iteration 003: Query, Context, and Impact Surfaces

## Focus

Assess whether GitNexus' `query`, `context`, and `impact` tools should influence Public Code Graph's MCP surface.

## Actions Taken

- Read GitNexus MCP tool definitions for query, context, and impact.
- Compared those with Public `code_graph_query` and `code_graph_context`.
- Integrated sidecar findings on LocalBackend query grouping and risk scoring.

## Findings

- GitNexus `query` is concept-oriented and returns process-grouped results, not just raw symbol or file matches. [SOURCE: external/gitnexus/src/mcp/tools.ts:49]
- GitNexus `context` is a 360-degree symbol view with callers, callees, references, and process participation, with disambiguation support. [SOURCE: external/gitnexus/src/mcp/tools.ts:172]
- GitNexus `impact` is explicitly framed as a pre-change blast-radius tool with depth groups, affected processes, modules, and risk levels. [SOURCE: external/gitnexus/src/mcp/tools.ts:285]
- Public `code_graph_query` is currently relationship-operation-oriented (`outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius`) rather than process-oriented. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:20]
- Public `code_graph_context` already accepts CocoIndex/manual/graph seeds and emits LLM-oriented neighborhoods, which is a good foundation for GitNexus-style richer context. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:166]
- The best Code Graph adaptation is not a wholesale tool rename; it is a higher-level `code_graph_impact` or expanded `code_graph_context(queryMode: impact)` that reports risk, direct dependents, process participation, and confidence.

## Questions Answered

- What GitNexus ingestion, graph schema, process-flow, and query/context patterns are portable to Public's Code Graph package?

## Questions Remaining

- Whether Public should expose route/tool/API impact as separate tools or as modes inside `code_graph_context`.

## Ruled Out

- Replacing `code_graph_query` with natural-language process search before Public has process nodes.

## Dead Ends

- Assuming process-grouped query can be added only at the handler layer; it requires process or workflow-derived nodes first.

## Sources Consulted

- external/gitnexus/src/mcp/tools.ts:49
- external/gitnexus/src/mcp/tools.ts:172
- external/gitnexus/src/mcp/tools.ts:285
- .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:20
- .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:166

## Reflection

- What worked and why: Comparing tool contracts showed which features are surface-level and which require schema work.
- What did not work and why: Query naming alone is not enough to import behavior.
- What I would do differently: Prototype an impact payload shape before changing storage.

## Recommended Next Focus

Evaluate GitNexus safety features: `detect_changes`, `impact`, and `rename`.
