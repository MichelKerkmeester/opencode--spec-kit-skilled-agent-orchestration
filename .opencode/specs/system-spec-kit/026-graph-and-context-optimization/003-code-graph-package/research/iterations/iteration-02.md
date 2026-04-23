## Iteration 02
### Focus
`code_graph_query` contract reachability for blast-radius multi-file union mode.

### Findings
- The runtime query handler supports `subjects[]` plus `unionMode: 'multi'` for `blast_radius`, and the behavior is covered by the handler test suite. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:689-729`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:466-525`.
- The validated Zod input schema for `code_graph_query` omits `unionMode`, so schema-validated callers cannot reach the multi-file union branch even though the runtime supports it. Evidence: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:452-460`.
- The exported allowed-parameter list also omits `unionMode`, confirming the omission is not limited to one schema surface. Evidence: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:663-665`.
- The MCP tool definition in `tool-schemas.ts` documents `subjects[]` but never exposes `unionMode`, so discoverability and runtime capability are out of sync. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570-585`.
- Tool-schema coverage exercises `subjects[]` but never includes `unionMode`, which explains why this drift escaped tests. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:490-540`.

### New Questions
- Are there production callers currently attempting `unionMode` and receiving strict-schema rejections?
- Should `unionMode` be optional only for `blast_radius`, or should the handler reject it for other operations explicitly?
- Do the generated MCP docs need an example showing `subject + subjects + unionMode: "multi"` together?

### Status
new-territory
