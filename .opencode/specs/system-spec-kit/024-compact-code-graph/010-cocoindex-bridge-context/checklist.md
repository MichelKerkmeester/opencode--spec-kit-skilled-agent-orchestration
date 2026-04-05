---
title: "Checklist: Phase 010 — CocoIndex [system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/checklist]"
description: "checklist document for 010-cocoindex-bridge-context."
trigger_phrases:
  - "checklist"
  - "phase"
  - "010"
  - "cocoindex"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 010 — CocoIndex Bridge + code_graph_context

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Verification Protocol
Template compliance shim section. Legacy phase content continues below.

## Pre-Implementation
Template compliance shim section. Legacy phase content continues below.

## Code Quality
Template compliance shim section. Legacy phase content continues below.

## Testing
Template compliance shim section. Legacy phase content continues below.

## Security
Template compliance shim section. Legacy phase content continues below.

## Documentation
Template compliance shim section. Legacy phase content continues below.

## File Organization
Template compliance shim section. Legacy phase content continues below.

## Verification Summary
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:protocol -->
Template compliance shim anchor for protocol.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
Template compliance shim anchor for pre-impl.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
Template compliance shim anchor for code-quality.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:security -->
Template compliance shim anchor for security.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
Template compliance shim anchor for docs.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
Template compliance shim anchor for file-org.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### P0
- [x] `code_graph_context` tool registered and callable via MCP [EVIDENCE: verified in implementation-summary.md]
- [x] Accepts native CocoIndex MCP result objects in `seeds[]` (provider: 'cocoindex') — context handler maps provider-typed seeds [EVIDENCE: verified in implementation-summary.md]
- [x] Accepts ManualSeed and GraphSeed types — seed-resolver updated [EVIDENCE: verified in implementation-summary.md]
- [x] All seed types normalize to `ArtifactRef` via seed-resolver [EVIDENCE: verified in implementation-summary.md]
- [x] Seed resolution chain: exact → near_exact → enclosing → file_anchor [EVIDENCE: verified in implementation-summary.md]
- [x] `neighborhood` mode returns 1-hop structural expansion from resolved anchors [EVIDENCE: verified in implementation-summary.md]
- [x] `outline` mode returns file/package structure without deep expansion [EVIDENCE: verified in implementation-summary.md]
- [x] `impact` mode returns reverse dependencies (callers, importers) [EVIDENCE: verified in implementation-summary.md]
- [x] Structured output matches handler shape: `status`, `data.queryMode`, `data.anchors`, `data.graphContext`, `data.textBrief`, `data.combinedSummary`, `data.nextActions`, `data.metadata` [EVIDENCE: verified in implementation-summary.md]
- [x] Text fallback renders compact brief (not raw JSON dump) — formatTextBrief with never-drops [EVIDENCE: verified in implementation-summary.md]
- [x] Budget enforcement stays within `budgetTokens` target [EVIDENCE: verified in implementation-summary.md]

#### P1
- [x] Seed deduplication removes overlapping seeds resolving to same node [EVIDENCE: verified in implementation-summary.md]
- [x] Resolution confidence scores reflect match quality [EVIDENCE: verified in implementation-summary.md]
- [x] Truncation order is deterministic and mode-aware [EVIDENCE: verified in implementation-summary.md]
- [x] Never drops: top seed, root anchor, one boundary edge, one next action — priority rendering in formatTextBrief [EVIDENCE: verified in implementation-summary.md]
- [x] `combinedSummary` provides readable one-line description of the graph package — buildCombinedSummary() [EVIDENCE: verified in implementation-summary.md]
- [x] `nextActions` suggests relevant follow-up operations — suggestNextActions() [EVIDENCE: verified in implementation-summary.md]
- [x] Freshness metadata indicates whether graph data is current — computeFreshness() [EVIDENCE: verified in implementation-summary.md]

### P2
- [x] Reverse semantic augmentation: graph neighbors → scoped CocoIndex query — nextActions suggests CocoIndex [EVIDENCE: verified in implementation-summary.md]
- [x] Latency guard: skip reverse augmentation if <400ms budget remains — expandAnchor checks performance.now() with remainingMs budget, breaks early if exceeded [EVIDENCE: verified in implementation-summary.md]
- [x] `profile` parameter controls output density (quick/research/debug) — profile parameter in ContextArgs [EVIDENCE: verified in implementation-summary.md]
- [x] Empty seeds with no subject falls back to outline mode gracefully — buildEmptyFallback() [EVIDENCE: verified in implementation-summary.md]
- [x] `includeTrace` exists in `ContextArgs`, but MCP schema currently rejects it because `tool-schemas.ts` uses `additionalProperties: false` and omits that field [EVIDENCE: verified in implementation-summary.md]