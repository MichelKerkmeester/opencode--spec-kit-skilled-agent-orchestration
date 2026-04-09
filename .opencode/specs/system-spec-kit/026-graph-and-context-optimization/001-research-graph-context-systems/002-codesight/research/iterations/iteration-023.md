# Iteration 23 — Detector upgrade lane: provenance taxonomy

## Focus
Evaluate the detector-provenance and fallback-discipline recommendations that emerged from CodeSight's AST-first/regex-fallback analysis.

## Findings

### Finding 1 — Detector provenance taxonomy is the highest-leverage adopt-now detector upgrade
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/iterations/iteration-007.md:57-64] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/research.md:715-725]
What it does: CodeSight's later iterations showed that a binary `ast|regex` label is too weak and actively misleading when structured-regex or heuristic paths emit `"ast"` or omit provenance entirely.
Why it matters for Public's Code Graph MCP: Public can improve graph trustworthiness quickly by carrying explicit detector provenance states such as `ast`, `structured`, `regex`, and `heuristic` through graph entities and query payloads.
Evidence type: source-confirmed
Recommendation: adopt now
Affected Public surface: detector contracts, code-graph payload metadata, ranking labels
Risk/cost: low

### Finding 2 — Regression fixtures remain the floor, not the whole quality story
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/recommendations.md:55-63]
What it does: The parent recommendation R6 frames detector fixtures as a non-regression floor instead of proof of user-visible structural quality.
Why it matters for Public's Code Graph MCP: Any provenance-taxonomy work should depend on the existing detector-regression lane instead of pretending the taxonomy alone guarantees better query outcomes.
Evidence type: synthesis-derived
Recommendation: adopt now, but gate on the existing regression-floor packet rather than bundling a new test philosophy here
Affected Public surface: detector rollout sequencing
Risk/cost: low

## Recommended Next Focus
Score the cross-language extraction patterns from Python/SQLAlchemy and the known Drizzle gap to decide which detector-depth upgrades belong in the proposed packet.

## Metrics
- newInfoRatio: 0.72
- findingsCount: 2
- focus: "iteration 23: detector provenance taxonomy"
- status: insight
