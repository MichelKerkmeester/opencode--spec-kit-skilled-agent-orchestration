# Plan: Phase 010 — CocoIndex Bridge + code_graph_context

## Steps

1. **Implement `seed-resolver.ts`:**
   - Accept `CodeGraphSeed[]` from any provider
   - Normalize each seed to `ArtifactRef` (filePath, startLine, endLine, symbolId, fqName)
   - Resolution chain: exact symbol → enclosing symbol → file outline → file anchor
   - Deduplicate overlapping seeds
   - Score each resolution with confidence value
2. **Implement `code-graph-context.ts`:**
   - Parse MCP tool input (input, queryMode, intent, subject, seeds)
   - Call seed-resolver for all seeds
   - Select expansion behavior based on queryMode:
     - `neighborhood`: 1-hop CALLS + IMPORTS + CONTAINS from resolved anchors
     - `outline`: file/package CONTAINS + EXPORTS
     - `impact`: reverse CALLS + reverse IMPORTS + TESTED_BY
   - Execute graph queries via Phase 009 `code_graph_query`
   - Optional reverse semantic augmentation: expanded graph neighbors → CocoIndex search
   - Collect results into structured response envelope
3. **Implement `context-formatter.ts`:**
   - Structured JSON: separate semanticSeeds, resolvedAnchors, graphContext sections
   - Compact text brief: path-first, symbol-rich, repo-map style
   - Budget-aware truncation with deterministic order
   - Never drop: top seed, root anchor, one edge, one next action
4. **Register tool in MCP server:**
   - Add `code_graph_context` schema to `tool-schemas.ts`
   - Wire handler in `context-server.ts`
5. **Test with real CocoIndex results:**
   - Run CocoIndex search → feed results as seeds to code_graph_context
   - Verify resolution chain produces correct graph anchors
   - Check that expanded neighborhood includes relevant structural neighbors
   - Verify text fallback is readable and within budget
6. **Test edge cases:**
   - Seeds with no graph node match → file anchor fallback
   - Empty seeds array → outline mode fallback
   - Budget of 0 → minimal response (root + one edge)
   - Multiple seeds resolving to same node → deduplicated

## Dependencies

- Phase 008 indexer (for node data in graph)
- Phase 009 storage + query tools (for graph queries)
- CocoIndex Code MCP (for semantic seeds — already deployed)
- Existing profile-formatters.ts patterns (for output style)

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Seed-to-node ambiguity | Confidence scoring + fallback chain, never fail |
| CocoIndex unavailable | Proceed without seeds, use subject or outline fallback |
| Budget overflow from large neighborhoods | Deterministic truncation, 1-hop default |
| Reverse semantic augmentation too slow | Skip if <400ms budget remains (latency guard) |
