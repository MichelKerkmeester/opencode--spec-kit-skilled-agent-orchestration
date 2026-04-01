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
- [x] Accepts native CocoIndex MCP result objects in `seeds[]` (provider: 'cocoindex') — context handler maps provider-typed seeds
- [x] Accepts ManualSeed and GraphSeed types — seed-resolver updated
- [x] All seed types normalize to `ArtifactRef` via seed-resolver
- [x] Seed resolution chain: exact → near_exact → enclosing → file_anchor
- [x] `neighborhood` mode returns 1-hop structural expansion from resolved anchors
- [x] `outline` mode returns file/package structure without deep expansion
- [x] `impact` mode returns reverse dependencies (callers, importers)
- [x] Structured output matches handler shape: `status`, `data.queryMode`, `data.anchors`, `data.graphContext`, `data.textBrief`, `data.combinedSummary`, `data.nextActions`, `data.metadata`
- [x] Text fallback renders compact brief (not raw JSON dump) — formatTextBrief with never-drops
- [x] Budget enforcement stays within `budgetTokens` target

## P1
- [x] Seed deduplication removes overlapping seeds resolving to same node
- [x] Resolution confidence scores reflect match quality
- [x] Truncation order is deterministic and mode-aware
- [x] Never drops: top seed, root anchor, one boundary edge, one next action — priority rendering in formatTextBrief
- [x] `combinedSummary` provides readable one-line description of the graph package — buildCombinedSummary()
- [x] `nextActions` suggests relevant follow-up operations — suggestNextActions()
- [x] Freshness metadata indicates whether graph data is current — computeFreshness()

## P2
- [x] Reverse semantic augmentation: graph neighbors → scoped CocoIndex query — nextActions suggests CocoIndex
- [x] Latency guard: skip reverse augmentation if <400ms budget remains — expandAnchor checks performance.now() with remainingMs budget, breaks early if exceeded
- [x] `profile` parameter controls output density (quick/research/debug) — profile parameter in ContextArgs
- [x] Empty seeds with no subject falls back to outline mode gracefully — buildEmptyFallback()
- [x] `includeTrace` exists in `ContextArgs`, but MCP schema currently rejects it because `tool-schemas.ts` uses `additionalProperties: false` and omits that field
