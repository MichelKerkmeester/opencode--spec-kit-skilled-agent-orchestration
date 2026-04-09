# Iteration 28 — Query-surface lane: routing facade versus pointer delivery

## Focus
Translate Contextador's routing ergonomics into graph-query recommendations without inheriting its pointer-oriented delivery model.

## Findings

### Finding 1 — A graph or semantic or memory routing facade is a valid prototype-later query upgrade
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/research/research.md:84-92]
What it does: `routeQuery()` gives one model-first facade that can decide whether a question should hit a deeper specific scope or fan out across several.
Why it matters for Public's Code Graph MCP: Public already has stronger underlying graph, semantic, and memory tools. A thin routing facade could improve ergonomics later, but it is a separate lane from graph detector/schema improvements.
Evidence type: source-confirmed
Recommendation: prototype later
Affected Public surface: higher-level query orchestration over graph/semantic/memory tools
Risk/cost: medium

### Finding 2 — Pointer serialization should stay rejected for graph responses
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/research/research.md:94-102]
What it does: Contextador's live path flattens rich authored context into narrow pointer-shaped text sections.
Why it matters for Public's Code Graph MCP: This is the wrong direction for graph retrieval, where Public already has typed structural and semantic surfaces that should stay richer than pointer summaries.
Evidence type: source-confirmed
Recommendation: reject
Affected Public surface: graph response contracts
Risk/cost: low

## Recommended Next Focus
Blend CodeSight's graph-local query improvements with Claudest's forced-degrade matrix to define the query-surface portion of the upgrade matrix.

## Metrics
- newInfoRatio: 0.64
- findingsCount: 2
- focus: "iteration 28: routing facade versus pointer delivery"
- status: insight
