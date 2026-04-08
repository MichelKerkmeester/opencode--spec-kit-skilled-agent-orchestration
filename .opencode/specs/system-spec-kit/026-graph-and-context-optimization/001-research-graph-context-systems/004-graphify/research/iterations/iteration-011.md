# Iteration 11: Provenance and Confidence Payload Contracts in Public

## Focus
Wave 2 starts by answering Q13: where can Public carry graphify-style provenance tiers and numeric confidence without breaking existing callers? The key constraint is that Public already has confidence and provenance surfaces in multiple places, so the goal is not to bolt on a parallel graph-only schema. The work here is to identify the current payload contracts that can absorb EXTRACTED / INFERRED / AMBIGUOUS style labeling and richer graph evidence with additive changes rather than disruptive rewrites.

## Findings

### Finding 33
Public already documents a result-confidence contract that combines margin, channel agreement, reranker confidence, and anchor density into a numeric confidence score with driver reporting. That means a graphify-style numeric `confidence_score` should be normalized into the existing result-confidence surface, not introduced as a brand-new parallel contract. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/19-result-confidence.md:10-31]

### Finding 34
Public already has a provenance envelope shape for graph-aware evidence. The result-provenance feature catalog explicitly describes `graphEvidence` with contributing edges, community IDs, and boost factors, which is the exact place to carry graphify-style confidence tiers and graph-specific provenance rather than inventing a second transport. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/20-result-provenance.md:10-36]

### Finding 35
The code-graph context handler already emits anchor-level metadata that looks like a proto-graphify payload: every returned anchor can include `confidence`, `resolution`, `source`, and `metadata`. Public therefore does not need a new handler to start surfacing graphify-like trust signals; it needs a normalization pass across existing code-graph outputs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189]

### Finding 36
The session bootstrap and resume handlers already expose a `payloadContract` and provenance-aware response envelope. That means the safest compatibility path is additive enrichment inside existing bootstrap/resume payloads instead of attaching new top-level graph-only blobs that downstream consumers would have to special-case. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154-217; .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:155-213]

## Cross-Phase Overlap Handling
- This iteration stayed out of the external graphify codebase and focused only on Public's current payload surfaces.
- It avoided duplicating phase 003 contextador MCP-surface work by centering on current bootstrap, resume, and formatter contracts rather than generic "make an MCP richer" advice.

## Exhausted / Ruled-Out Directions
- I looked for a need to create a separate graph-only provenance payload and ruled it out. Public already has `result-confidence`, `result-provenance`, and `payloadContract` surfaces that can absorb the data additively. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/19-result-confidence.md:10-31; .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/20-result-provenance.md:10-36; .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154-217]

## Final Verdict on Q13
Public should carry graphify-style provenance tiers and numeric confidence through three existing contracts: result confidence, result provenance, and bootstrap/resume payload contracts. The migration path is additive: normalize tier labels into current confidence outputs, extend `graphEvidence` rather than creating a parallel schema, and keep bootstrap/resume as the stable transport that downstream clients already understand.

## Tools Used
- `sed -n`
- `rg -n`
- `nl -ba`

## Sources Queried
- `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/19-result-confidence.md:10-31`
- `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/20-result-provenance.md:10-36`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154-217`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:155-213`
