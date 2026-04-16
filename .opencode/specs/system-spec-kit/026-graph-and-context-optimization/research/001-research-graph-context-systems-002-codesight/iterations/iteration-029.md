# Iteration 29 — Query-surface lane: fallback tiering and blast-radius hardening

## Focus
Score the graph-local query improvements that are most likely to fit Public quickly: blast-radius fixes plus capability-cascade fallback patterns.

## Findings

### Finding 1 — Reverse-BFS blast-radius plus explicit multi-file union should be in the first packet
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/iterations/iteration-003.md:34-59]
What it does: CodeSight proved three graph-local behaviors that are directly useful: reverse dependency traversal, a concrete depth-cap failure mode to avoid, and an explicit multi-file union mode for review-time impact summaries.
Why it matters for Public's Code Graph MCP: This is precisely the kind of code-graph-local upgrade that improves usefulness without touching shared routing surfaces or trust-validator ownership.
Evidence type: source-confirmed
Recommendation: adopt now
Affected Public surface: code_graph_query blast-radius mode and review-oriented outputs
Risk/cost: low

### Finding 2 — Capability-cascade fallback and forced-degrade verification are portable, but the first lane should stay narrow
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/research.md:107-129] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-011.md:19-25] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/iterations/iteration-012.md:9-11]
What it does: Claudest's research and follow-on iterations narrow the safe first implementation to a capability probe, explicit backend metadata, and truthful forced-degrade tests, with broader tiering added only if the substrate exists.
Why it matters for Public's Code Graph MCP: If Public adds graph-local lexical fallback or graph-index degradation paths, the packet should copy that honesty discipline and keep the first version narrow.
Evidence type: source-confirmed
Recommendation: adopt now for the verification pattern; prototype later for any broader tier expansion
Affected Public surface: graph lexical fallback helpers and diagnostics
Risk/cost: low

## Recommended Next Focus
Resolve whether the graph-first hook pattern belongs in the new packet or must be deferred to `008`, then separate that from code-graph-local breadcrumbs.

## Metrics
- newInfoRatio: 0.78
- findingsCount: 2
- focus: "iteration 29: fallback tiering and blast-radius hardening"
- status: insight
