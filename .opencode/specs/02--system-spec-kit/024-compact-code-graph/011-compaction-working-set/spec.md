---
title: "Phase 011: Compaction Working-Set [02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/spec]"
description: "Wire the code graph and CocoIndex into the compaction pipeline via a session working-set tracker and a 3-source merge allocator. Replace the current Memory-only compaction with ..."
trigger_phrases:
  - "phase"
  - "011"
  - "compaction"
  - "working"
  - "set"
  - "spec"
importance_tier: "important"
contextType: "implementation"
---
# Phase 011: Compaction Working-Set Integration

## Summary

Wire the code graph and CocoIndex into the compaction pipeline via a session working-set tracker and a 3-source merge allocator. Replace the current Memory-only compaction with a budget-aware merge of constitutional memory, structural code graph context, CocoIndex semantic neighbors, and triggered memories.

## What Exists

- `autoSurfaceAtCompaction()` in `hooks/memory-surface.ts` gives full 4000-token budget to Memory only
- `COMPACTION_TOKEN_BUDGET = 4000` hard-coded constant
- `dynamic-token-budget.ts` selects outer budget (1500/2500/4000) by query complexity — advisory, not used in compaction
- Phase 008-010 provide structural indexer, graph storage/query, and `code_graph_context` bridge
- CocoIndex Code MCP provides semantic search
- No multi-source allocator or working-set tracker exists today

## Design Decisions

- **Floors + overflow pool**: Each source gets a guaranteed minimum; unused floors flow to shared pool
- **Late fusion**: Keep sources separate until merge; do not interleave during retrieval
- **Constitutional priority**: Constitutional memory always protected, trimmed last
- **Working-set drives graph expansion**: Files/symbols touched during session seed structural expansion
- **Degrade, don't fail**: If any source is unavailable or empty, reallocate budget to remaining sources

## Token Budget Allocation

Total compaction envelope: **4000 tokens**

| Source | Floor | % | Trim Order | Priority |
|--------|------:|---:|----------:|----------|
| Constitutional Memory | 700 | 17.5% | Last (6th) | Highest |
| Code Graph (structural) | 1200 | 30% | 4th | High |
| CocoIndex (semantic) | 900 | 22.5% | 3rd | Medium |
| Triggered Memory | 400 | 10% | 2nd | Lower |
| Overflow Pool | 800 | 20% | — | Redistributed |

### Overflow Rules

- If CocoIndex returns no results → its 900 floor flows to overflow pool
- If Code Graph has no anchored roots → its 1200 floor flows to overflow pool
- If no triggered memories → its 400 flows to overflow pool
- After deduplication across sources, saved tokens flow to overflow pool
- Overflow distributed to highest-priority sources that can use more

### Trim Order (first dropped → last dropped)

1. Weak semantic tail (low-score CocoIndex hits)
2. Two-hop graph leaves
3. Low-value triggered memories
4. Direct structural neighbors
5. State / next steps / blockers
6. Constitutional memory (never dropped in practice)

## Session Working-Set Tracker

Track files and symbols actively used during the current session:

```typescript
interface WorkingSet {
  touchedFiles: Map<string, { accessCount: number; lastAccess: number }>;
  touchedSymbols: Map<string, { accessCount: number; lastAccess: number }>;
  sessionStartTime: number;
}
```

Working-set sources:
- Files read/edited via tool calls during session
- Symbols referenced in user prompts or assistant responses
- Files mentioned in error messages or test output

Working-set usage at compaction:
1. Extract top-N touched files/symbols by recency + frequency
2. Use as roots for Phase 010 `code_graph_context(queryMode: 'neighborhood')`
3. Use as query terms for CocoIndex semantic search
4. Include in compact brief as "Active Files" section

## 3-Source Merge Pipeline

```
PreCompact fires:
  ┌──────────────────────────────────────────────────┐
  │ Stage A: Parallel retrieval                       │
  │  1. Memory: constitutional + triggered memories   │
  │  2. CocoIndex: semantic neighbors of working set  │
  │  3. Code Graph: structural neighbors of working   │
  │     set via code_graph_context                    │
  └──────────────┬───────────────────────────────────┘
                 │
  ┌──────────────v───────────────────────────────────┐
  │ Stage B: Late fusion merge                        │
  │  1. Deduplicate across sources (file-level)       │
  │  2. Apply floor allocations                       │
  │  3. Fill from overflow pool by priority            │
  │  4. Apply trim order if over budget                │
  └──────────────┬───────────────────────────────────┘
                 │
  ┌──────────────v───────────────────────────────────┐
  │ Stage C: Render compact brief                     │
  │  Sections:                                        │
  │    [Constitutional Rules]                         │
  │    [Active Files & Structural Context]            │
  │    [Semantic Neighbors]                           │
  │    [Session State / Next Steps]                   │
  │    [Triggered Memories]                           │
  └──────────────────────────────────────────────────┘
```

## What to Build

### 1. `working-set-tracker.ts`

Session working-set tracker:
- Track file reads/edits from hook state
- Track symbol references from transcript analysis
- Expose `getTopRoots(n)` for compaction seeding
- Decay older entries (recency weighting)

### 2. `budget-allocator.ts`

Token budget allocation:
- Accept total budget + per-source results
- Apply floors, compute overflow pool
- Redistribute overflow by priority
- Apply trim order when over budget
- Return per-source granted budgets + metadata

```typescript
interface AllocationResult {
  memory: { constitutional: number; triggered: number };
  codeGraph: number;
  cocoIndex: number;
  overflow: number;
  totalGranted: number;
  droppedItems: Array<{ source: string; reason: string; count: number }>;
}
```

### 3. `compact-merger.ts`

3-source merge logic:
- Receive shaped results from all 3 sources
- Deduplicate at file level
- Merge into structured compact brief with section headers
- Apply final budget enforcement
- Include freshness metadata per source

### 4. Integration into `autoSurfaceAtCompaction`

Replace current Memory-only path:
- Call working-set tracker for session roots
- Retrieve from all 3 sources in parallel
- Pass through budget allocator
- Merge and render via compact-merger
- Cache result for SessionStart injection

## Allocator Observability

Every compaction produces metadata:

```typescript
interface CompactionMetadata {
  perSource: Array<{
    source: string;
    requestedTokens: number;
    grantedTokens: number;
    droppedItems: number;
    redistributionReceived: number;
  }>;
  totalBudget: number;
  totalUsed: number;
  overflow: number;
  mergeTimeMs: number;
}
```

## Acceptance Criteria

- [ ] Working-set tracker records files/symbols accessed during session
- [ ] Budget allocator enforces floors + overflow pool model
- [ ] Empty source releases its floor to overflow pool
- [ ] 3-source merge produces deduplicated compact brief
- [ ] Constitutional memory always included (never trimmed)
- [ ] Trim order is deterministic: semantic tail → graph leaves → triggered → neighbors → state → constitutional
- [ ] Total output stays within 4000-token budget
- [ ] Compact brief has visible sections (Constitutional, Structural, Semantic, Session, Triggered)
- [ ] Allocator metadata included in output for observability
- [ ] Graceful degradation when any source is unavailable

## Files Modified

- NEW: `mcp_server/lib/code-graph/working-set-tracker.ts`
- NEW: `mcp_server/lib/code-graph/budget-allocator.ts`
- NEW: `mcp_server/lib/code-graph/compact-merger.ts`
- EDIT: `mcp_server/hooks/memory-surface.ts` (replace Memory-only path with 3-source merge)
- EDIT: `mcp_server/hooks/memory-surface.ts` (update `autoSurfaceAtCompaction`)

## LOC Estimate

200-300 lines (working-set tracker + budget allocator + compact merger + integration)
