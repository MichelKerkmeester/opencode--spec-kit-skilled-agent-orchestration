# 143: Bounded graph-walk rollout and diagnostics

## Preconditions
- MCP server running with default flags
- SPECKIT_GRAPH_WALK_ROLLOUT not explicitly set
- resolveGraphWalkRolloutState() defaults to "bounded_runtime" (via SPECKIT_GRAPH_SIGNALS=true)
- Code reference: search-flags.ts:156-169

## Commands Executed

1. `memory_search({ query:"graph rollout trace check", includeTrace:true, limit:10 })`

## Raw Output Summary

### Bounded Runtime State (default)
- searchType: hybrid
- Results: 10
- Top result: memoryId 24993, fusion=13.16, rerank=0.5
- Channels: r12-embedding-expansion + bm25

### Graph Contribution (per-result trace)
- rolloutState: **"bounded_runtime"** (confirmed)
- appliedBonus: **0** (no graph-connected data boosted for this query)
- capApplied: **false** (bonus did not saturate)
- raw: 0, normalized: 0
- injected: false
- killSwitchActive: false

### Pipeline-Level Graph Contribution
- graphSignalsApplied: **true**
- causalBoosted: 0, coActivationBoosted: 0, communityInjected: 0, graphSignalsBoosted: 0
- totalGraphInjected: 0

### Ordering Stability (adaptiveShadow)
- mode: "shadow", bounded: true, maxDeltaApplied: 0.08
- All 10 rows: scoreDelta=0, productionRank matches shadowRank
- promotedIds: [], demotedIds: []
- Ordering is deterministic and stable

### Code Analysis (search-flags.ts:156-169)
```typescript
// Default resolution path:
// SPECKIT_GRAPH_WALK_ROLLOUT not set →
// isFeatureEnabled('SPECKIT_GRAPH_SIGNALS') → true →
// returns 'bounded_runtime'
```

### Limitations
- Only tested 1 of 3 rollout states (bounded_runtime)
- Cannot test trace_only state (requires SPECKIT_GRAPH_WALK_ROLLOUT=trace_only env var at MCP server level)
- Cannot test off state (requires SPECKIT_GRAPH_WALK_ROLLOUT=off)
- Cannot verify appliedBonus > 0 or capApplied=true (requires graph-connected corpus with active causal edges)
- MCP server env vars cannot be changed from tool context — requires server restart

## Signal Checklist
- [x] rolloutState correctly reports "bounded_runtime"
- [x] graphSignalsApplied: true
- [x] Ordering stability confirmed (all scoreDelta=0)
- [x] appliedBonus bounded (0, within <=0.03 cap)
- [ ] trace_only state verification (requires env var change)
- [ ] off state verification (requires env var change)
- [ ] capApplied=true verification (requires saturated bonus scenario)

## Verdict: **PARTIAL**
The current bounded_runtime state is correctly reported in all trace data. Graph signals are applied, ordering is deterministic, and the bounded bonus (0) is within the <=0.03 cap. However, only 1 of 3 rollout states could be tested — trace_only and off states require MCP server environment variable changes not accessible from the tool context.
