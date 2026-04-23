## Iteration 03
### Focus
`code_graph_context` seed-schema parity and seed provenance loss.

### Findings
- `handleCodeGraphContext()` accepts richer seed objects than the schema allows, including `source`, `kind`, `nodeId`, and `snippet`, and later uses `source` to label resolved anchors. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:16-30`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:48-87`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:122-164`.
- The nested `codeGraphSeedSchema` only permits `filePath`, `startLine`, `endLine`, `query`, `provider`, `file`, `range`, `score`, `symbolName`, and `symbolId`; the richer fields are not part of the validated contract. Evidence: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462-476`.
- Because the handler’s `resolveSeedSource()` depends on `seed.source`, validated calls can silently lose caller-supplied provenance labels even though the runtime is coded to surface them. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:48-87`, `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462-476`.
- Test coverage only verifies minimal manual seeds and never checks source/provenance round-tripping, graph `nodeId`, or snippet-bearing cocoindex seeds. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:56-82`, `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:521-539`.

### New Questions
- Should `codeGraphSeedSchema` grow to match the handler interface, or should the handler interface shrink to the validated subset?
- Is `nodeId` intentionally redundant with `symbolId`, or do graph-seed callers rely on it today?
- Should `source` become mandatory for cocoindex/manual seed provenance instead of best-effort?

### Status
new-territory
