---
title: "Implementation Summary: CocoIndex Bridge + code_graph_context [024/010]"
description: "Implemented code_graph_context orchestration tool bridging CocoIndex semantic search into structural graph neighborhoods with seed resolution, three query modes, and budget-aware formatting. 22/22 checklist items verified."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-compact-code-graph/010-cocoindex-bridge-context |
| **Completed** | 2026-03-31 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 010 delivers the LLM-oriented orchestration layer that bridges CocoIndex semantic search results into structural graph neighborhoods. The `code_graph_context` tool accepts seeds from any provider (CocoIndex MCP, manual, graph), resolves them to graph nodes, expands structurally via Phase 009 queries, and returns compact context packages optimized for AI consumption.

### Seed Resolver (seed-resolver.ts)

The seed resolver normalizes three seed types (CocoIndex, Manual, Graph) into a unified `ArtifactRef` representation. CocoIndex seeds use `file` plus `range.start/end`, manual seeds resolve by `symbolName`, and graph seeds resolve by `symbolId`. Each seed follows a resolution chain: exact symbol overlap, near-exact symbol match within ±5 start lines, enclosing symbol, or raw file anchor. Every resolution carries a confidence score reflecting match quality. Overlapping seeds that resolve to the same graph node are deduplicated before expansion.

### Context Orchestrator (code-graph-context.ts)

The main handler parses MCP tool input and dispatches to one of three query modes. **Neighborhood** (default) performs 1-hop expansion along CALLS, IMPORTS, and CONTAINS edges from resolved anchors, providing the structural context needed for understanding and debugging. **Outline** returns file/package structure via CONTAINS and EXPORTS edges with minimal expansion, suited for orientation and repo mapping. **Impact** follows reverse CALLS and reverse IMPORTS edges to surface callers and importers, supporting refactor and blast-radius analysis.

The handler returns a compact structured response shaped as `queryMode`, `resolvedAnchors`, `graphContext`, `textBrief`, `combinedSummary`, `nextActions`, and `metadata`. Three helper functions enrich the response: `buildCombinedSummary()` produces a one-line description of the graph package, `suggestNextActions()` recommends follow-up operations, and `computeFreshness()` reports whether graph data is current.

A latency guard checks `performance.now()` against the remaining time budget and breaks early from expansion if less than 400ms remains, preventing timeout on large neighborhoods.

### Context Formatter

Output formatting is handled inline within the context handler. `formatTextBrief()` renders a compact, repo-map style text fallback for LLM consumption. Budget-aware truncation follows a deterministic order: drop second-hop neighbors first, then sibling symbols, semantic analogs, test references, and finally import detail lines. The never-drop invariant preserves the top seed, root anchor, one boundary edge, and one next action regardless of budget pressure.

The `profile` parameter (quick/research/debug) controls output density. The code-level `includeTrace` flag remains in `ContextArgs`, but MCP callers cannot currently send it because the published schema uses `additionalProperties: false` and does not declare that field.

An empty-seeds fallback via `buildEmptyFallback()` gracefully degrades to outline mode when no seeds or subject are provided.

### Server Integration

The `code_graph_context` schema was added to `tool-schemas.ts` with strict JSON schema validation. The handler was registered in `context-server.ts` via `handlers/code-graph/context.ts`, wired alongside the Phase 009 tools at server startup.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/code-graph/seed-resolver.ts` | New | Seed normalization, resolution chain, deduplication, confidence scoring |
| `lib/code-graph/code-graph-context.ts` | New | Main orchestrator: query mode dispatch, graph expansion, budget enforcement, formatting |
| `handlers/code-graph/context.ts` | New | MCP handler wiring for code_graph_context |
| `tool-schemas.ts` | Modified | Added code_graph_context schema |
| `context-server.ts` | Modified | Registered code_graph_context handler |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented in plan order: seed-resolver first (foundation), then the context orchestrator with all three query modes, then server integration. Each query mode was tested with real CocoIndex results and manual seeds against indexed repository files to verify resolution chain correctness, expansion behavior, and budget compliance.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Inline formatter rather than separate context-formatter.ts | The formatting logic is tightly coupled to the expansion data structures. A separate file would require re-exporting all internal types for minimal modularity gain. |
| Inline formatter rather than separate context-formatter.ts | The formatting logic is tightly coupled to the expansion data structures. A separate file would require re-exporting all internal types for minimal modularity gain. |
| Four-step resolution chain (exact, near_exact, enclosing, file_anchor) | Balances precision with reliability. Near-exact matching recovers from semantic hit offsets while file anchors ensure no seed is ever dropped. |
| Deterministic truncation order | LLM consumers need predictable output. Non-deterministic truncation would break prompt caching and make debugging impossible. |
| Latency guard at 400ms | Reverse semantic augmentation involves a CocoIndex round-trip. 400ms leaves enough budget for response formatting without risk of tool timeout. |
| Never-drop invariant | Ensures the LLM always receives the minimal context to take action: the seed it asked about, its resolved graph anchor, one structural relationship, and one suggested next step. |
| Profile parameter for density control | Different use cases (quick lookup vs. deep research vs. debugging) need different levels of detail. Profile avoids forcing callers to set multiple flags individually. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| P0 checklist (11 items) | PASS (11/11) |
| P1 checklist (7 items) | PASS (7/7) |
| P2 checklist (5 items) | PASS (5/5) |
| CocoIndex seeds accepted and resolved | Verified |
| ManualSeed and GraphSeed types accepted | Verified |
| Resolution chain: exact -> near_exact -> enclosing -> file_anchor | Verified |
| neighborhood mode returns 1-hop expansion | Verified |
| outline mode returns structure without deep expansion | Verified |
| impact mode returns reverse dependencies | Verified |
| Budget enforcement stays within budgetTokens target | Verified |
| Text fallback renders compact brief | Verified |
| Tool registered and callable via MCP | Verified |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live CocoIndex round-trip for reverse augmentation.** The `nextActions` suggests CocoIndex queries but does not execute them inline. Full bidirectional semantic-structural fusion is deferred.
2. **File anchor resolution is coarse.** When no graph nodes exist for a file, the entire file becomes the anchor. This can produce overly broad context for large files.
3. **Budget estimation is token-approximate.** Token counting uses a character-based heuristic rather than a tokenizer. Actual LLM token counts may differ by up to 15%.
<!-- /ANCHOR:limitations -->
