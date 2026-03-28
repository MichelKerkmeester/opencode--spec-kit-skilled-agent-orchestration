# Iteration 003: Causal Graph Correctness

## Findings

### [P1] Global visited set drops valid edges in diamond-shaped traversals
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`

**Issue**
`getCausalChain()` uses a single `visited` set keyed only by node ID for the entire traversal. That prevents infinite loops, but it also suppresses legitimate alternate paths to the same memory. In a graph like `A -> B -> D` and `A -> C -> D`, whichever branch reaches `D` first wins and the other edge is silently omitted.

**Evidence**
At `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:418-430`, traversal initializes one `visited` set for the whole walk and skips any edge whose next node ID was seen earlier:
`const visited = new Set<string>();`
`if (visited.has(nextId)) continue;`

That means edge-level uniqueness is never tracked, only node-level uniqueness. The existing "complex diamond cycle" test at `.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:719-729` only asserts the final node set, so it would not catch the missing `C -> D` edge.

**Fix**
Track the active recursion path for cycle prevention instead of a global node set, or track visited edges `(source,target,relation)` separately. That preserves alternate inbound/outbound edges while still preventing infinite recursion on cycles.

### [P1] `memory_drift_why` conflates incoming and outgoing semantics in its response shape
**File**
`.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts`

**Issue**
The handler always returns relation buckets named `causedBy`, `enabledBy`, etc., even when the caller requests `direction: "outgoing"` or `direction: "both"`. For `outgoing`, those buckets actually contain effects caused by the root memory, not causes of it. For `both`, incoming and outgoing edges are merged into the same relation buckets, so consumers cannot tell whether an edge explains the decision or is a consequence of it.

**Evidence**
At `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:304-319`, `direction` is mapped to forward/backward/both and forward traversal is used for `outgoing`.
At `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:395-412`, the response always serializes:
`causedBy: chain.by_cause, enabledBy: chain.by_enabled, ...`

For `both`, the handler explicitly merges forward and backward traversals at `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:307-316`, but still exposes only relation-based buckets, not direction-aware buckets.

**Fix**
Return direction-aware fields, for example `incoming.caused`, `outgoing.caused`, or neutral names such as `caused`, `enabled`, plus a per-edge `direction` field. For `both`, keep forward and backward buckets separate instead of flattening them into a single "causedBy" view.

### [P1] Traversal strength math does not propagate along the path and clamps away most relation-weight differences
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`

**Issue**
Traversal strength is recomputed from each edge in isolation as `min(1, edge.strength * relationWeight)`. It never multiplies by the parent node's strength, so deeper paths do not decay or accumulate as a chain. On top of that, any edge with strength `1.0` and weight above `1.0` immediately saturates to `1.0`, which collapses the distinction between `enabled`, `caused`, and `supersedes` at the first hop.

**Evidence**
At `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:434-443`, the child strength is computed only from the current edge:
`const weightedStrength = Math.min(1, edge.strength * weight);`

The parent node's `strength` is ignored entirely.

The intended cumulative behavior is also implied by the weight test at `.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:811-816`, which compares multi-hop scores using repeated multiplication:
`const supersededScore = 1.0 * w.supersedes * w.supersedes;`

The current implementation cannot produce that behavior in `getCausalChain()`.

**Fix**
Propagate strength cumulatively, for example `childStrength = clamp(node.strength * edge.strength * weight)`, and decide whether API-facing strength should be clamped only at serialization time. If preserving relative ordering matters, avoid saturating every >1 multiplier to `1.0` at the first hop.

### [P2] Traversal reads are not snapshot-consistent, so concurrent link/unlink operations can produce mixed-state results
**File**
`.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts`

**Issue**
`handleMemoryDriftWhy()` performs multiple independent reads with no read transaction or snapshot boundary: forward traversal, backward traversal, relation filtering, source-memory lookup, and per-related-memory lookups. If another process mutates `causal_edges` between those steps, the final response can combine edges and memory details from different committed states.

**Evidence**
At `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:307-316`, forward and backward traversals are executed separately.
At `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:328-357`, additional `memory_index` lookups happen afterward in a separate phase.

Within storage, `getCausalChain()` itself issues per-node queries recursively (`getEdgesFrom()` / `getEdgesTo()`) at `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:421-448`, so even one traversal is assembled from many discrete reads rather than a single consistent snapshot.

**Fix**
Wrap `memory_drift_why` reads in a single read transaction/snapshot, or materialize the relevant edge set once before traversal. That keeps forward/backward traversal and memory-detail hydration aligned to the same graph state.

### [P2] Traversal silently truncates high-degree nodes after 100 edges
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`

**Issue**
`getCausalChain()` calls `getEdgesFrom()` / `getEdgesTo()` without a caller-controlled limit, and both helpers default to `MAX_EDGES_LIMIT = 100`. Any node with more than 100 incoming or outgoing edges is silently truncated, which makes `memory_drift_why` incomplete without signaling that data was dropped.

**Evidence**
`.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:39-40` defines `MAX_EDGES_LIMIT = 100`.
`.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:337-369` applies that limit in `getEdgesFrom()` / `getEdgesTo()`.
`.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:424-426` calls those helpers with no explicit override from traversal.

Unlike `maxDepthReached`, there is no equivalent `maxEdgesReached` signal in the handler response.

**Fix**
Either remove the implicit cap for traversal, make it an explicit API parameter, or return a truncation flag/hint when the per-node edge cap is hit so callers know the lineage is incomplete.

## Summary
P0: 0, P1: 3, P2: 2
