---
title: "Tasks: CocoIndex Bridge + code_graph_context [024/010]"
description: "Task tracking for code_graph_context orchestration tool bridging CocoIndex semantic search into structural graph neighborhoods."
---
# Tasks: Phase 010 — CocoIndex Bridge + code_graph_context

## Completed

- [x] Implement `seed-resolver.ts` — `lib/code-graph/seed-resolver.ts`; accepts CodeGraphSeed[] from any provider (CocoIndex, Manual, Graph)
- [x] Normalize all seed types to ArtifactRef (filePath, startLine, endLine, symbolId, fqName, kind, confidence, resolution) — seed-resolver.ts
- [x] Implement seed resolution chain: exact symbol -> near_exact symbol -> enclosing symbol -> file_anchor — seed-resolver.ts
- [x] Implement seed deduplication for overlapping seeds resolving to same node — seed-resolver.ts
- [x] Implement confidence scoring per resolution — seed-resolver.ts
- [x] Implement `code-graph-context.ts` main orchestration handler — `lib/code-graph/code-graph-context.ts`
- [x] Parse MCP tool input (input, queryMode, subject, seeds, budget params) — code-graph-context.ts
- [x] Implement `neighborhood` mode: 1-hop CALLS + IMPORTS + CONTAINS expansion from resolved anchors — code-graph-context.ts
- [x] Implement `outline` mode: file/package CONTAINS + EXPORTS structure — code-graph-context.ts
- [x] Implement `impact` mode: reverse CALLS + reverse IMPORTS — code-graph-context.ts
- [x] Implement latency guard: skip reverse augmentation if <400ms budget remains — expandAnchor checks performance.now()
- [x] Build structured response with `queryMode`, `resolvedAnchors`, `graphContext`, `textBrief`, `combinedSummary`, `nextActions`, `metadata` — code-graph-context.ts
- [x] Implement `combinedSummary` via buildCombinedSummary() — code-graph-context.ts
- [x] Implement `nextActions` via suggestNextActions() — code-graph-context.ts
- [x] Implement freshness metadata via computeFreshness() — code-graph-context.ts
- [x] Keep formatter helpers inline in `code-graph-context.ts` — compact text brief via `formatTextBrief()` plus summary/next-action helpers
- [x] Implement budget-aware deterministic truncation order: 2nd-hop neighbors -> siblings -> analogs -> tests -> import details — code-graph-context.ts
- [x] Implement never-drop priority rendering: top seed, root anchor, one boundary edge, one next action — formatTextBrief
- [x] Implement empty seeds fallback to outline mode via buildEmptyFallback() — code-graph-context.ts
- [x] Implement `profile` parameter for output density control (quick/research/debug) — ContextArgs
- [x] Preserve `includeTrace` in `ContextArgs`, while documenting that MCP schema currently rejects it because it is not declared in `tool-schemas.ts`
- [x] Add `code_graph_context` schema to `tool-schemas.ts` — strict JSON schema, additionalProperties: false
- [x] Register handler in `context-server.ts` — `handlers/code-graph/context.ts` wired at startup

## Deferred

None. All planned items completed.
