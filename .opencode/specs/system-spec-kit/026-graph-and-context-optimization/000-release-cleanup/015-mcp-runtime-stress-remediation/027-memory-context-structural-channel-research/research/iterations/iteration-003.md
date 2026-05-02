# Iteration 003 - Merged Response Shape Evaluation

## Focus

Evaluate flatten, discriminated union, and split-payload response shapes against existing consumers of `memory_context`, `memory_search`, and `code_graph_query`. This follows the strategy's iteration 3 focus for RQ2.

## Sources Read

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:27-37`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:426-456`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787-828`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1079-1120`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1145-1182`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1185-1379`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1382-1497`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-result-adapter.ts:6-55`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-result-adapter.ts:209-247`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:738-820`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:893-990`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:1072-1106`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:162-182`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:370-389`
- `.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:80-139`
- `.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:16-35`
- `.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:10-17`
- `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:60-107`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1010-1014`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1115-1160`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:38-53`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:137-179`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:229-245`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:91-116`

## Findings

### P1 - Flattening structural output into `results` is lossy and brittle

`formatSearchResults()` expects document-like rows with fields such as `id`, `spec_folder`, `file_path`, `title`, `similarity`, `importance_tier`, and chunk metadata (`search-results.ts:738-820`). Its include-content path reads file content from row file paths or precomputed content (`search-results.ts:893-990`). `code_graph_query` returns operation-specific shapes: outline nodes, relationship edges, blast-radius groups, blocked payloads, and readiness/error payloads (`query.ts:787-828`, `query.ts:1079-1120`, `query.ts:1145-1497`). Coercing those graph answers into pseudo-documents would either drop structure or invent file/document fields the formatter treats as meaningful.

### P1 - A discriminated union is expressive but pushes complexity into existing consumers

The generic MCP envelope supports arbitrary `data` under `summary`, `hints`, and `meta` (`envelope.ts:16-35`), but current tests around search responses expect `data.count` and `data.results` (`mcp-response-envelope.vitest.ts:80-139`). `memory_context` tests mock memory-search style responses and assert route behavior into memory search (`handler-memory-context.vitest.ts:38-53`, `handler-memory-context.vitest.ts:137-179`, `handler-memory-context.vitest.ts:229-245`). A union inside `results` would force every caller that currently treats results as documents to branch on `kind`.

### P1 - Split-payload preserves the existing document contract while adding structural data cleanly

The formatter already merges safe `extraData` without allowing it to override canonical `results` and `count` keys (`search-results.ts:1072-1106`). That means `memory_context` can keep document `results` stable and add a separate structural payload under a new key such as `structural` or `structuralResults`. This shape matches the existing envelope flexibility (`envelope.ts:16-35`) and avoids confusing graph edges/nodes with memory documents.

### P2 - Split-payload needs token-budget handling for structural arrays

The server truncation path in `context-server.ts` operates on top-level `data.results` (`context-server.ts:1115-1160`). A split structural payload with `data.structural.edges` or `data.structural.nodes` would not be truncated by that generic path. This is a manageable implementation detail, but it should be part of the acceptance criteria for the implementation phase.

## New Info Ratio

0.44. The iteration converted the response-shape question from preference to contract evidence: flattening conflicts with formatter assumptions, while split-payload fits the envelope.

## Open Questions Surfaced

- Should the split key be singular `structural` or plural `structuralResults`?
- Should hybrid mode return both document `results` and structural payload by default, or only structural payload plus semantic fallback hints?
- Should structural payloads include a normalized lightweight projection in addition to raw `code_graph_query` data?

## Convergence Signal

Approaching. RQ2 has a clear leading answer; envelope mapping remains.

