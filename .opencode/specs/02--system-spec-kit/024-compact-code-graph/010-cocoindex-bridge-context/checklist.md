---
title: "Checklist: Phase 010 — CocoIndex [02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/checklist]"
description: "checklist document for 010-cocoindex-bridge-context."
trigger_phrases:
  - "checklist"
  - "phase"
  - "010"
  - "cocoindex"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 010 — CocoIndex Bridge + code_graph_context

## P0
- [x] `code_graph_context` tool registered and callable via MCP
- [ ] Accepts native CocoIndex MCP result objects in `seeds[]` (provider: 'cocoindex')
- [ ] Accepts ManualSeed and GraphSeed types
- [x] All seed types normalize to `ArtifactRef` via seed-resolver
- [x] Seed resolution chain: exact → enclosing → file anchor
- [x] `neighborhood` mode returns 1-hop structural expansion from resolved anchors
- [x] `outline` mode returns file/package structure without deep expansion
- [x] `impact` mode returns reverse dependencies (callers, importers)
- [ ] Structured JSON output separates semanticSeeds, resolvedAnchors, graphContext
- [ ] Text fallback renders compact brief (not raw JSON dump)
- [x] Budget enforcement stays within `budgetTokens` target

## P1
- [x] Seed deduplication removes overlapping seeds resolving to same node
- [x] Resolution confidence scores reflect match quality
- [x] Truncation order is deterministic and mode-aware
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
