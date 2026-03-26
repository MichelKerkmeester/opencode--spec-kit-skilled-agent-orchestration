---
title: "Causal depth signal"
description: "Describes the SCC-condensed longest-path depth signal that normalizes each memory's structural distance from root components to a [0,1] score, applied as a capped +0.05 additive bonus in Stage 2."
---

# Causal depth signal

## 1. OVERVIEW

Describes the SCC-condensed longest-path depth signal that normalizes each memory's structural distance from root components to a [0,1] score, applied as a capped +0.05 additive bonus in Stage 2.

Not all knowledge sits at the same level. A big decision that led to five smaller tasks is a "root" while those tasks are "leaves." This feature measures how deep each memory sits in that tree of cause-and-effect relationships. It gives a small search boost based on that depth, acting as a tiebreaker when two results are otherwise equally relevant.

---

## 2. CURRENT REALITY

Not all memories sit at the same level of abstraction. A root decision that caused five downstream implementation memories occupies a different position in the knowledge graph than a leaf node.

Causal depth measures each memory's longest structural distance from a root strongly connected component. The causal graph is first condensed into SCCs, then longest-path depth is computed across the resulting DAG so shortcut edges do not suppress deeper chains and cycle members share one bounded depth layer. The raw component depth is normalized by the deepest reachable component chain to produce a [0,1] score. A memory in a component at depth 3 within a graph whose deepest reachable component chain is 6 scores 0.5.

Like momentum, the depth signal applies as an additive bonus in Stage 2, capped at +0.05. Batch computation via `computeCausalDepthScores()` shares the same session cache infrastructure as momentum. Both signals are applied together by `applyGraphSignals()`, which iterates over pipeline rows and adds the combined bonus. A single-node variant of `computeCausalDepth` was removed during Sprint 8 remediation as dead code (the batch version `computeCausalDepthScores` is the only caller).

The combined N2a+N2b adjustment is modest by design: up to +0.10 total. This keeps graph signals as a tiebreaker rather than a dominant ranking factor. Runs behind the `SPECKIT_GRAPH_SIGNALS` flag (default ON, shared with N2a).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/graph/graph-signals.ts` | Lib | Graph momentum and depth signals |
| `mcp_server/lib/search/causal-boost.ts` | Lib | Causal neighbor boosting |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/causal-boost.vitest.ts` | Causal boost tests |
| `mcp_server/tests/feature-eval-graph-signals.vitest.ts` | Graph signal evaluation |
| `mcp_server/tests/graph-signals.vitest.ts` | Graph signal computation |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Causal depth signal
- Current reality source: FEATURE_CATALOG.md
