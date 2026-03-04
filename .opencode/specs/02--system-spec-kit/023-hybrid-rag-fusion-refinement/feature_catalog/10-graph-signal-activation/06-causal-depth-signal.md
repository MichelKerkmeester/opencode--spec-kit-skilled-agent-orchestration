# Causal depth signal

## Current Reality

Not all memories sit at the same level of abstraction. A root decision that caused five downstream implementation memories occupies a different position in the knowledge graph than a leaf node.

Causal depth measures each memory's maximum distance from root nodes (those with in-degree zero) via BFS traversal. The raw depth is normalized by graph diameter to produce a [0,1] score. A memory at depth 3 in a graph with diameter 6 scores 0.5.

Like momentum, the depth signal applies as an additive bonus in Stage 2, capped at +0.05. Batch computation via `computeCausalDepthScores()` shares the same session cache infrastructure as momentum. Both signals are applied together by `applyGraphSignals()`, which iterates over pipeline rows and adds the combined bonus. A single-node variant of `computeCausalDepth` was removed during Sprint 8 remediation as dead code (the batch version `computeCausalDepthScores` is the only caller).

The combined N2a+N2b adjustment is modest by design: up to +0.10 total. This keeps graph signals as a tiebreaker rather than a dominant ranking factor. Runs behind the `SPECKIT_GRAPH_SIGNALS` flag (default ON, shared with N2a).

## Source Metadata

- Group: Graph signal activation
- Source feature title: Causal depth signal
- Summary match found: Yes
- Summary source feature title: Causal depth signal
- Current reality source: feature_catalog.md
