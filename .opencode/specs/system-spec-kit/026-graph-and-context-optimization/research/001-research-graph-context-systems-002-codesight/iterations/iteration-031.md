# Iteration 31 — Query-surface lane: hot-file breadcrumbs and low-authority hints

## Focus
Recover the non-overlapping user-facing breadcrumb ideas that can live on code-graph-owned surfaces even though the startup-surface nudge belongs in `008`.

## Findings

### Finding 1 — Honest degree-based hot-file breadcrumbs are the safe user-facing graph upgrade
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/research.md:718-719] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/iterations/iteration-010.md:82-85]
What it does: CodeSight retained hot-file ranking as a depended-on count rather than pretending it was true graph centrality.
Why it matters for Public's Code Graph MCP: Public can surface the same kind of "change carefully" breadcrumb directly on graph-owned outputs without duplicating `008`'s startup/resume hint surface.
Evidence type: source-confirmed
Recommendation: adopt now
Affected Public surface: `code_graph_query` or `code_graph_context` metadata and UI-facing hints
Risk/cost: low

### Finding 2 — Low-authority breadcrumb layers should be named as such
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/iterations/iteration-020.md:38-45]
What it does: CodeSight's late synthesis reframed its shallow detectors as useful breadcrumbs only when their authority is explicitly bounded.
Why it matters for Public's Code Graph MCP: The new packet can safely add graph breadcrumbs if it preserves that honesty discipline and keeps high-authority claims tied to stronger graph facts.
Evidence type: source-confirmed
Recommendation: adopt now
Affected Public surface: graph query phrasing and payload labeling
Risk/cost: low

## Recommended Next Focus
Consolidate the detector, structure, query-surface, and overlap decisions into the final code-graph upgrade matrix.

## Metrics
- newInfoRatio: 0.57
- findingsCount: 2
- focus: "iteration 31: hot-file breadcrumbs and low-authority hints"
- status: insight
