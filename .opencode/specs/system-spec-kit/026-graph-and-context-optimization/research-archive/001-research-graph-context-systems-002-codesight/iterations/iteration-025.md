# Iteration 25 — Detector upgrade lane: inventory and extensibility

## Focus
Use Graphify's extractor inventory and CodeSight's plugin-contract findings to decide how much extensibility belongs in the proposed packet.

## Findings

### Finding 1 — Graphify's extractor inventory is useful as a roadmap benchmark, not as an immediate packet scope
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/iterations/iteration-002.md:8-20] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/research.md:98-112]
What it does: Graphify proves broad extractor coverage and a two-pass structural pipeline, but its Python path is much richer than the others and its broader inventory is still uneven.
Why it matters for Public's Code Graph MCP: The right use is as a benchmark for where Public might want to grow later, not as justification to turn this packet into a multi-language extractor program.
Evidence type: source-confirmed
Recommendation: prototype later
Affected Public surface: long-range detector coverage roadmap
Risk/cost: high

### Finding 2 — Plugin hooks should not enter the first packet unless they ship with fixtures
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/iterations/iteration-009.md:64-71]
What it does: CodeSight's plugin contract is real in types but lightly proven in use, and its own conclusion is that untested plugin hooks are not a credible extension story.
Why it matters for Public's Code Graph MCP: The first code-graph upgrade packet should improve first-party graph behavior. Extensibility can wait for a later packet with at least one in-tree fixture and contract test.
Evidence type: source-confirmed
Recommendation: prototype later
Affected Public surface: detector extensibility roadmap
Risk/cost: medium

## Recommended Next Focus
Shift from detector work to graph-structure upgrades: edge evidence classes, numeric confidence, cluster metadata, and export contracts.

## Metrics
- newInfoRatio: 0.61
- findingsCount: 2
- focus: "iteration 25: extractor inventory and extensibility"
- status: insight
