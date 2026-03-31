---
title: "Plan: Phase 011 — Compaction Working-Set [02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/plan]"
description: "1. Implement working-set-tracker.ts"
trigger_phrases:
  - "plan"
  - "phase"
  - "011"
  - "compaction"
  - "working"
importance_tier: "important"
contextType: "planning"
---
# Plan: Phase 011 — Compaction Working-Set Integration

## Steps

1. **Implement `working-set-tracker.ts`:**
   - Track file reads/edits with access count and timestamp
   - Track symbol references from transcript analysis
   - Implement recency-weighted `getTopRoots(n)` method
   - Store working set in hook state (Phase 001 `hook-state.ts`)
2. **Implement `budget-allocator.ts`:**
   - Accept total budget (4000) + per-source payload sizes
   - Apply floor allocations (constitutional 700, graph 1200, CocoIndex 900, triggered 400)
   - Compute overflow pool from empty/under-used sources
   - Redistribute overflow by priority order
   - Enforce total budget cap with deterministic trim order
   - Return `AllocationResult` with granted budgets + metadata
3. **Implement `compact-merger.ts`:**
   - Accept shaped results from Memory, Code Graph, CocoIndex
   - Deduplicate at file level (same file from multiple sources → keep highest-priority version)
   - Render compact brief with section headers:
     - Constitutional Rules
     - Active Files & Structural Context
     - Semantic Neighbors
     - Session State / Next Steps
     - Triggered Memories
   - Include freshness metadata per source
4. **Integrate into `autoSurfaceAtCompaction`:**
   - Replace current Memory-only retrieval
   - Get working-set roots → parallel retrieval from 3 sources
   - Pass through budget allocator → compact merger
   - Cache merged result for SessionStart(source=compact) injection
   - Preserve existing fallback behavior if all sources fail
5. **Test budget allocation scenarios:**
   - All sources present → verify floor distribution
   - CocoIndex empty → verify overflow redistribution
   - All sources empty except constitutional → verify constitutional always included
   - Over-budget → verify trim order is correct
6. **Test end-to-end compaction flow:**
   - Simulate session with file reads → verify working set populated
   - Trigger PreCompact → verify 3-source retrieval + merge
   - Verify cached compact brief has all sections
   - Verify total token count ≤ 4000

<!-- ANCHOR:dependencies -->
## Dependencies

- Phase 001 hook-state for session state storage
- Phase 008-010 for code graph structural context
- CocoIndex Code MCP for semantic search
- Existing `autoSurfaceAtCompaction` in memory-surface.ts
<!-- /ANCHOR:dependencies -->

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Mixed freshness (one source stale, another fresh) | Per-source freshness metadata in output, let consumer decide |
| Working-set explosion (too many files touched) | Cap at top-20 by recency + frequency |
| Budget overflow after dedup | Dedup first, then allocate — saves tokens |
| Neighborhood explosion from graph | Default 1-hop, require proof before expanding |
| Performance of 3-source parallel retrieval | 2s hard cap from Phase 001 latency budget |
