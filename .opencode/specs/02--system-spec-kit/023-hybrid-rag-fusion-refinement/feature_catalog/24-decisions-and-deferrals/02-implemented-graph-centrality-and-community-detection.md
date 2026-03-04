# Implemented: graph centrality and community detection

## Current Reality

Originally deferred at Sprint 6b pending a feasibility spike. Three graph capabilities were planned: graph momentum (N2a), causal depth signal (N2b) and community detection (N2c).

**Now implemented.** N2a and N2b share a single flag (`SPECKIT_GRAPH_SIGNALS`, default ON) providing additive score adjustments up to +0.05 each in Stage 2. N2c runs behind `SPECKIT_COMMUNITY_DETECTION` (default ON) with BFS connected components escalating to a pure-TypeScript Louvain implementation when the largest component exceeds 50% of nodes. Schema migrations v19 added `degree_snapshots` and `community_assignments` tables. See [Graph momentum scoring](#graph-momentum-scoring), [Causal depth signal](#causal-depth-signal) and [Community detection](#community-detection) for full descriptions.

## Source Metadata

- Group: Decisions and deferrals
- Source feature title: Implemented: graph centrality and community detection
- Summary match found: Yes
- Summary source feature title: Implemented: graph centrality and community detection
- Current reality source: feature_catalog.md
