## Iteration 06
### Focus
Context-surface provenance drift after CF-010.

### Findings
- `query.ts` now routes graph metadata and structural trust through `buildQueryTrustMetadata()`, which can omit placeholder metadata and preserve provenance source labels from the shared readiness contract [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:206-230; .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts:129-176].
- `handleCodeGraphContext()` does not use that shared helper; it appends a handler-local `graphMetadata` object with only `detectorProvenance`, defaulting to `'unknown'` instead of omitting the field when provenance is absent [.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:178-215].
- The context-handler tests lock that reduced shape in place by asserting `graphMetadata === { detectorProvenance: 'structured' }`, which makes provenance-source parity harder to restore without dedicated follow-up edits [.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:56-82].

### New Questions
- Should `code_graph_context` attach full structural-trust fields the same way `code_graph_query` does?
- Should context payloads include `detectorProvenanceSource: 'last-persisted-scan'` for parity with query responses?
- Would downstream consumers tolerate omitting `graphMetadata` entirely when no provenance is known, or do they expect a placeholder object?
- Is there any reason for `context.ts` to keep a separate graph-metadata assembly path now that `readiness-contract.ts` exists?

### Status
converging
