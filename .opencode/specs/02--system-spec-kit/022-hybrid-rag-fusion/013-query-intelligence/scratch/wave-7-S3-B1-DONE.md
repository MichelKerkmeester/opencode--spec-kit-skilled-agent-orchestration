# Wave 7 — Sprint 3 Batch 1 (T001b + T001c) DONE

## Summary

Created the **query router** module that maps classifier tiers to channel subsets, and a comprehensive test suite validating the routing logic and pipeline integration readiness.

## Files Created

### 1. `mcp_server/lib/search/query-router.ts` (T001b)

New module implementing tier-to-channel-subset routing:

- **`ChannelName`** type: `'vector' | 'fts' | 'bm25' | 'graph' | 'degree'` (matches SOURCE_TYPES in rrf-fusion.ts)
- **`ChannelRoutingConfig`** interface: maps each tier to a channel array
- **`DEFAULT_ROUTING_CONFIG`**: simple=[vector,fts], moderate=[vector,fts,bm25], complex=[all 5]
- **`getChannelSubset(tier, config?)`**: resolves tier to channels with minimum 2-channel invariant enforcement
- **`routeQuery(query, triggerPhrases?)`**: convenience function that classifies + routes in one call
- **`enforceMinimumChannels(channels)`**: pads channel arrays below MIN_CHANNELS (2) with vector/fts fallbacks
- **`ALL_CHANNELS`**: frozen constant of all 5 channel names
- Feature flag integration: when `SPECKIT_COMPLEXITY_ROUTER` is disabled, `routeQuery` returns all 5 channels

### 2. `mcp_server/tests/t026-query-router.vitest.ts` (T001c)

33 tests across 6 describe blocks:

| Block | Tests | Coverage |
|-------|-------|----------|
| T026-01: Default Routing Config | 6 | Config constants, channel counts per tier |
| T026-02: getChannelSubset | 5 | Per-tier resolution, custom config override, copy semantics |
| T026-03: Minimum 2-Channel Invariant | 6 | Empty config, single-channel, dedup, enforcement helper |
| T026-04: routeQuery Convenience | 5 | Simple/moderate/complex routing, trigger phrases, classification details |
| T026-05: Feature Flag Disabled | 4 | All-channels fallback when flag off, various flag values |
| T026-06: Edge Cases | 7 | Empty query, monotonic channel growth, subset relationships, invariants |

## Design Decisions

1. **Moderate tier = 3 channels** (vector + fts + bm25): Chose 3 over 4 since graph adds latency and the spec allowed "3-4 channels". The config is overridable if 4 channels is preferred.

2. **No modification to hybrid-search.ts**: As specified, the routing module is standalone. `hybrid-search.ts` will import `routeQuery` or `getChannelSubset` when the pipeline wiring task executes.

3. **Minimum invariant uses vector + fts as fallbacks**: These are the fastest and most reliable channels, ensuring a usable baseline even with misconfigured routing tables.

4. **`getChannelSubset` returns a copy**: Prevents callers from mutating the config arrays.

## Test Results

```
 33 tests passed (33)
 Duration: 131ms
```

## Integration Point (Future)

`hybrid-search.ts > hybridSearchEnhanced()` will call `routeQuery(query)` to get the channel subset, then conditionally skip channels not in the subset. This keeps the routing decision decoupled from channel execution.
