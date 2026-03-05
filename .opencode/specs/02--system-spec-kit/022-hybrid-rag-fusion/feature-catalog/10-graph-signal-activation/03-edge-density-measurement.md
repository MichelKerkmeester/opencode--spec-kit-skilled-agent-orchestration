# Edge density measurement

## Current Reality

The current density metric used by runtime guards is global edge density: `total_edges / total_memories` from the graph tables. If density is too low, graph-derived gains are naturally limited; if density is too high, entity-linking creation is gated by the configured density threshold. Earlier "edges-per-node" phrasing is still useful intuition, but runtime checks now use the global-density denominator for consistency.

## Source Metadata

- Group: Graph signal activation
- Source feature title: Edge density measurement
- Current reality source: feature_catalog.md
