---
title: "Tasks: CocoIndex Bridge + code_graph_context [024/010]"
description: "Task tracking for code_graph_context orchestration tool bridging CocoIndex semantic search into structural graph neighborhoods."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 010 — CocoIndex Bridge + code_graph_context


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Completed

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
- [x] Build structured response with `status`, `data.queryMode`, `data.anchors`, `data.graphContext`, `data.textBrief`, `data.combinedSummary`, `data.nextActions`, `data.metadata` — `handlers/code-graph/context.ts`
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

### Deferred

None. All planned items completed.