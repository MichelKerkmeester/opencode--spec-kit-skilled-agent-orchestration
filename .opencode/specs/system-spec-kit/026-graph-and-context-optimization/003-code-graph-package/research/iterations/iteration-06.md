## Iteration 06
### Focus
Parser-contract correctness on the query trust surface.

### Findings
- `buildQueryStructuralTrust()` hardcodes `parserProvenance: 'ast'` for both fresh and stale graphs, regardless of the detector provenance that was actually persisted. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:198-212`.
- The same handler separately exposes persisted detector provenance through `graphMetadata.detectorProvenance`, so a regex-backed graph can simultaneously say `graphMetadata.detectorProvenance: 'structured'` and `parserProvenance: 'ast'`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts:119-135`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:230-255`.
- The shared payload contract already defines the correct bridge from detector provenance to parser provenance, mapping `'structured'` to parser provenance `'regex'`; the query handler bypasses that bridge entirely. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:612-620`.
- Packet `001-code-graph-upgrades` explicitly required non-AST paths not to masquerade as AST, so the current query trust payload violates a documented packet contract. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/spec.md:116`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:198-212`.
- Query-handler tests default persisted provenance to `'structured'` but do not assert the emitted `parserProvenance`, leaving the mismatch unguarded. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts:77-88`.

### New Questions
- Should `buildQueryStructuralTrust()` derive parser provenance from `getLastDetectorProvenance()` through `detectorProvenanceToParserProvenance()`?
- If detector provenance is unavailable on a stale graph, should the query payload emit `unknown` instead of optimistic `ast`?
- Do other non-query code-graph payloads make the same AST-by-default assumption?

### Status
converging
