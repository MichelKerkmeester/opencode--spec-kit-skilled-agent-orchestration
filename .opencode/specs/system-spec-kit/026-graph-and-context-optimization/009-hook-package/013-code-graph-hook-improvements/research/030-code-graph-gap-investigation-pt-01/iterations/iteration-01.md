## Iteration 01

### Focus

Central repo surfaces that should have moved in lockstep with packet `013`: the MCP server README family, install guidance, handler READMEs, and the public tool-schema descriptions for `code_graph_status` and `code_graph_context`.

### Search Strategy

- Attempted semantic search via `mcp__cocoindex_code__.search({ query: "code graph startup payload graphQualitySummary partialOutput selectedCandidate blocked read hooks docs tests", languages: ["typescript", "markdown"], paths: [".opencode/skill/system-spec-kit/**"], limit: 8, refresh_index: true })` → runtime-side cancellation.
- Attempted CLI semantic search via `ccc search "code graph startup payload graphQualitySummary partialOutput selectedCandidate blocked read hooks docs tests" --path '.opencode/skill/system-spec-kit/**' --limit 12` → daemon log permission error under sandbox.
- Attempted structural probe via `code_graph_status()` → runtime-side cancellation.
- Fallback exact searches:
  - `rg -n "graphQualitySummary|selectedCandidate|partialOutput|graphAnswersOmitted|sharedPayload" .opencode -g '!**/dist/**'`
  - `rg -n "code_graph_status|code_graph_context|code_graph_scan|code_graph_query|structural-context|startup payload" .opencode/skill/system-spec-kit -g '!**/dist/**'`
  - Read numbered snippets from:
    - `.opencode/skill/system-spec-kit/mcp_server/README.md`
    - `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md`
    - `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
    - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

### Missed Files Found

| Path | Why It's Relevant | Category | Confidence High/Med/Low | Why It Was Missed | Needs Update Y/N/Maybe |
|------|-------------------|----------|--------------------------|-------------------|------------------------|
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | It is the primary operator/API reference for `code_graph_status` and `code_graph_context`, but it still documents `code_graph_status` as counts/parse-health only and `code_graph_context` as readiness-only, while packet 013 shipped `graphQualitySummary`, blocked full-scan payloads, and structured `partialOutput` metadata. | README | High | Packet 013 tracked the implementation files and `ENV_REFERENCE.md`, but not the central MCP server doc that summarizes those contracts. | Y |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md` | This subsystem README still describes readiness as `live / stale / missing`, `status.ts` as “totals, freshness, parseHealth,” and the context surfaces without the new graph-quality or blocked-read details. It is the nearest design doc for the packet’s code-graph changes. | README | High | Resource-map scope stayed close to runtime code, tests, and packet docs, so the subsystem README never entered the packet ledger. | Y |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | The install/troubleshooting guide now mentions stale/full-scan behavior, but it never picked up `graphQualitySummary` or the richer blocked-read/context metadata that operators will see after 013. | Install guide | High | The packet updated the operator env reference, but not the wider install/troubleshooting surface that end users consult first. | Y |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Public tool descriptions still say `code_graph_status` returns counts/freshness/parseHealth only and describe `code_graph_context` without `partialOutput`/blocked-read expectations, so generated tool docs and downstream consumers remain stale. | Config/schema | High | Packet 013 concentrated on handler output and runtime tests, not the shared schema-description layer. | Y |

### Already-Covered

Packet `013` already covered the actual handler/runtime implementation files and focused tests: `status.ts`, `context.ts`, `query.ts`, `startup-brief.ts`, runtime startup hooks, `ENV_REFERENCE.md`, `code-graph-context-handler.vitest.ts`, `code-graph-query-handler.vitest.ts`, `hook-session-start.vitest.ts`, and `codex-session-start-hook.vitest.ts`. Those are not re-flagged here.

### Status

High-confidence drift exists in the central README/install/schema family. The packet landed the runtime behavior, but the human-facing contract surfaces did not follow it.
