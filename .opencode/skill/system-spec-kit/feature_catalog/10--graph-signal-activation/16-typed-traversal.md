---
title: "Typed traversal"
description: "Typed traversal is partially wired for sparse-first graph policy and intent-aware edge traversal in `causal-boost.ts`, behind the `SPECKIT_TYPED_TRAVERSAL` flag, with some runtime/export coverage still planned."
---

# Typed traversal

## 1. OVERVIEW

Typed traversal introduces sparse-first graph policy and intent-aware edge traversal helpers in `causal-boost.ts`, gated by the `SPECKIT_TYPED_TRAVERSAL` flag, but the runtime wiring is still only partially complete.

When the graph has few edges relative to the number of memories, deep multi-hop traversal is unreliable and expensive. This feature detects sparse graphs (density below 0.5) and automatically constrains the causal boost walk to a single typed hop. For all graphs, it introduces intent-aware traversal that maps query intents (fix_bug, add_feature, find_decision, etc.) to prioritized edge types, so the graph walk follows the most relevant relationships first.

---

## 2. CURRENT REALITY

The flag surface is enabled by default (graduated). Set `SPECKIT_TYPED_TRAVERSAL=false` to disable.

`search-flags.ts` exports `isTypedTraversalEnabled()`, and `causal-boost.ts` contains helper logic for the D3 Phase A sparse-first and intent-aware traversal behavior. However, the dedicated `sparse-first-graph.vitest.ts` file is entirely `describe.skip(...)` and marked "spec-ahead-of-implementation", so this should be treated as partial/planned runtime wiring rather than fully validated live behavior.

When the flag is on, the current helper logic covers two D3 Phase A requirements:

**D3-001 Sparse-first policy**: When graph density (`edgeCount / totalMemories`) falls below `SPARSE_DENSITY_THRESHOLD = 0.5`, community detection is disabled and traversal is constrained to `SPARSE_MAX_HOPS = 1` typed expansion. This prevents noisy results from sparse graphs.

**D3-002 Intent-aware edge traversal**: Maps classified query intents to edge-type priority orderings via `INTENT_EDGE_PRIORITY`. The traversal score is computed as `score = seedScore * edgePrior * hopDecay * freshness`. Edge prior scores are tiered: first-listed relation = 1.0, second = 0.75, remaining = 0.5. Supported intents include `fix_bug`, `add_feature`, `find_decision`, `understand`, `find_spec`, `refactor`, and `security_audit`.

Key constants: `MAX_HOPS = 2` (normal mode), `SPARSE_MAX_HOPS = 1`, `SPARSE_DENSITY_THRESHOLD = 0.5`, `MAX_BOOST_PER_HOP = 0.05`, `MAX_COMBINED_BOOST = 0.20`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/causal-boost.ts` | Lib | `isTypedTraversalEnabled()`, sparse-first policy, intent-aware edge traversal, CTE walk scoring |
| `mcp_server/lib/search/search-flags.ts` | Lib | Central flag registry reference |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/causal-boost.vitest.ts` | Causal boost with typed traversal, sparse-first gating, intent-aware scoring |
| `mcp_server/tests/sparse-first-graph.vitest.ts` | Skipped spec-ahead-of-implementation coverage documenting planned sparse-first export/runtime wiring |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Typed traversal
- Current reality source: mcp_server/lib/search/causal-boost.ts module header and `isTypedTraversalEnabled()` implementation
