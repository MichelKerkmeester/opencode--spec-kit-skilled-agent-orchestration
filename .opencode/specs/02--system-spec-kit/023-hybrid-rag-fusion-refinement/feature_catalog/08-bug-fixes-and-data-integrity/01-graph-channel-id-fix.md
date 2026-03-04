# Graph channel ID fix

## Current Reality

The graph search channel had a 0% hit rate in production. Zero. The system was designed as a 4-channel retrieval engine, but the graph channel contributed nothing because `graph-search-fn.ts` compared string-formatted IDs (`mem:${edgeId}`) against numeric memory IDs at two separate locations.

Both comparison points now extract numeric IDs, and the graph channel returns results for queries where causal edge relationships exist. This was the single highest-impact bug in the system because it meant an entire retrieval signal was dead on arrival.

## Source Metadata

- Group: Bug fixes and data integrity
- Source feature title: Graph channel ID fix
- Current reality source: feature_catalog.md
