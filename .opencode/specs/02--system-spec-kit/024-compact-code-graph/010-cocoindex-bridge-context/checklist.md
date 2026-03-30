# Checklist: Phase 010 — CocoIndex Bridge + code_graph_context

## P0
- [ ] `code_graph_context` tool registered and callable via MCP
- [ ] Accepts native CocoIndex MCP result objects in `seeds[]` (provider: 'cocoindex')
- [ ] Accepts ManualSeed and GraphSeed types
- [ ] All seed types normalize to `ArtifactRef` via seed-resolver
- [ ] Seed resolution chain: exact → enclosing → file outline → file anchor
- [ ] `neighborhood` mode returns 1-hop structural expansion from resolved anchors
- [ ] `outline` mode returns file/package structure without deep expansion
- [ ] `impact` mode returns reverse dependencies (callers, importers)
- [ ] Structured JSON output separates semanticSeeds, resolvedAnchors, graphContext
- [ ] Text fallback renders compact brief (not raw JSON dump)
- [ ] Budget enforcement stays within `budgetTokens` target

## P1
- [ ] Seed deduplication removes overlapping seeds resolving to same node
- [ ] Resolution confidence scores reflect match quality
- [ ] Truncation order is deterministic and mode-aware
- [ ] Never drops: top seed, root anchor, one boundary edge, one next action
- [ ] `combinedSummary` provides readable one-line description of the graph package
- [ ] `nextActions` suggests relevant follow-up operations
- [ ] Freshness metadata indicates whether graph data is current

## P2
- [ ] Reverse semantic augmentation: graph neighbors → scoped CocoIndex query
- [ ] Latency guard: skip reverse augmentation if <400ms budget remains
- [ ] `profile` parameter controls output density (quick/research/debug)
- [ ] Empty seeds with no subject falls back to outline mode gracefully
- [ ] Trace metadata included when `includeTrace: true`
