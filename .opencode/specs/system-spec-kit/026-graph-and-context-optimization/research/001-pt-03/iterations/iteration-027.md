# Iteration 27 — Graph-structure upgrade lane: clustering and exports

## Focus
Evaluate clustering, rationale-node, and export-contract patterns as possible later-stage graph-structure upgrades.

## Findings

### Finding 1 — Leiden clustering should be a later additive metadata lane, not part of the first packet
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/research.md:82-90] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/research.md:750-755]
What it does: Graphify's Leiden pass is valuable as community metadata, but its own translation for Public already narrowed the safe fit to additive labels on the current graph substrate.
Why it matters for Public's Code Graph MCP: Clustering still looks useful, but it adds storage, tuning, and evaluation complexity that is not necessary to unlock the first high-value graph upgrade lane.
Evidence type: source-confirmed
Recommendation: prototype later
Affected Public surface: cluster tables, community labels, ranking/context overlays
Risk/cost: medium

### Finding 2 — GraphML/Cypher export and rationale-node support are real but non-blocking extras
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/research.md:98-112] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/iterations/iteration-002.md:16-20]
What it does: Graphify proves both optional export contracts and rationale-style graph nodes, but neither is required to make detector provenance, blast-radius, or edge evidence more honest in Public.
Why it matters for Public's Code Graph MCP: These are sensible follow-on hooks once the core graph payload and query semantics are stable, not core-scope requirements for the new packet proposal.
Evidence type: source-confirmed
Recommendation: prototype later
Affected Public surface: offline graph analysis and optional provenance-rich context
Risk/cost: medium

## Recommended Next Focus
Switch to the query-surface lane and resolve which reuse, routing, and fallback ideas improve graph usage without recreating `008`.

## Metrics
- newInfoRatio: 0.59
- findingsCount: 2
- focus: "iteration 27: clustering and export contracts"
- status: insight
