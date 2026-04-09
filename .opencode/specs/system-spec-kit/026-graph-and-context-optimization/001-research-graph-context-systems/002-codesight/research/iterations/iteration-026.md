# Iteration 26 — Graph-structure upgrade lane: evidence-tagged edges

## Focus
Score Graphify's evidence-tagged edge model against Public's existing graph payload contracts and `011` trust-validation scope.

## Findings

### Finding 1 — Evidence-tagged edges plus numeric confidence are adopt-now graph upgrades, but only after `011`
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/research.md:74-90] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/research.md:742-746] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-graph-payload-validator-and-trust-preservation/spec.md:61-72]
What it does: Graphify shows that edge evidence class and numeric confidence can be transport-level fields rather than UI hints, while its later translation notes that Public already has owner payloads where those fields could land additively.
Why it matters for Public's Code Graph MCP: This is the most concrete graph-structure improvement that raises graph fidelity without requiring a new graph platform. The only hard rule is sequencing: the validator packet must land first.
Evidence type: source-confirmed
Recommendation: adopt now
Affected Public surface: graph edge schema, code-graph query/context payloads
Risk/cost: medium

### Finding 2 — Numeric confidence needs a single source of truth
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/research.md:128-129]
What it does: Graphify's research notes that AST and semantic edges can derive numeric confidence from different rules if the exporter backfills missing values.
Why it matters for Public's Code Graph MCP: If Public adopts numeric confidence on graph edges, the packet must define whether numbers come from detectors, from serialization defaults, or from a single normalization layer, and fixture-test that choice.
Evidence type: source-confirmed
Recommendation: adopt now, but only with one normalized scoring owner
Affected Public surface: graph confidence serialization and ranking
Risk/cost: medium

## Recommended Next Focus
Examine additive clustering, rationale or provenance-support nodes, and export contracts to determine which graph-structure upgrades remain prototype-later.

## Metrics
- newInfoRatio: 0.77
- findingsCount: 2
- focus: "iteration 26: evidence-tagged edges"
- status: insight
