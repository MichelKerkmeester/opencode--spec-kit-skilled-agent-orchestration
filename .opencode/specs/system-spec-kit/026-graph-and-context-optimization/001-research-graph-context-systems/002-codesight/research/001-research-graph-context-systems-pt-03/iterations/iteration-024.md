# Iteration 24 — Detector upgrade lane: cross-language extraction depth

## Focus
Translate the strongest cross-language extraction lessons from CodeSight and Graphify into Public-scoped graph-upgrade candidates.

## Findings

### Finding 1 — Python AST subprocess and SQLAlchemy extraction are good templates, but they are prototype-later work
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/iterations/iteration-007.md:48-55] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/iterations/iteration-010.md:89-92]
What it does: CodeSight showed two specific detector-depth patterns worth preserving: Python's subprocess-driven AST parsing and SQLAlchemy's richer schema extraction with index and foreign-key detail.
Why it matters for Public's Code Graph MCP: These patterns can widen Public's graph fidelity beyond TS-first paths, but they are materially larger than a simple provenance-taxonomy change and therefore belong in a second-stage detector-upgrade lane.
Evidence type: source-confirmed
Recommendation: prototype later
Affected Public surface: non-TS graph detectors and schema extraction
Risk/cost: medium

### Finding 2 — The Drizzle index gap is a roadmap item, not an adopt-now claim
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/research.md:729-734]
What it does: The 18.3 matrix kept Drizzle index extraction in the reject bucket because it is not implemented in the source under study.
Why it matters for Public's Code Graph MCP: The roadmap can include Drizzle completeness as a future detector-depth target, but it cannot be described as borrowed, proven functionality.
Evidence type: source-confirmed
Recommendation: prototype later with explicit "net-new implementation" labeling
Affected Public surface: ORM detector completeness
Risk/cost: medium

## Recommended Next Focus
Assess the extractor inventory and plugin contract lessons to decide whether the new packet should include extensibility or stop at first-party detector improvements.

## Metrics
- newInfoRatio: 0.66
- findingsCount: 2
- focus: "iteration 24: cross-language extraction depth"
- status: insight
