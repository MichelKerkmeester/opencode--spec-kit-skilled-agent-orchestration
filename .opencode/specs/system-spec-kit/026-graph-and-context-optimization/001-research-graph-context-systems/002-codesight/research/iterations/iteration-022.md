# Iteration 22 — Candidate classification and owner separation

## Focus
Classify the surviving code-graph-shaped ideas from sibling packets into detector, structure, query-surface, and hook-routing buckets, and mark which are already owned elsewhere.

## Findings

### Finding 1 — Detector and graph-structure upgrades are the cleanest unowned lane
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/iterations/iteration-007.md:57-64] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/research.md:74-90]
What it does: `002-codesight` contributes detector provenance discipline and cross-language extraction lessons, while `004-graphify` contributes edge evidence vocabularies, numeric confidence, and additive clustering ideas.
Why it matters for Public's Code Graph MCP: These upgrades touch the graph itself and its first-party query outputs, which are not currently assigned to `008` or `011`.
Evidence type: source-confirmed
Recommendation: prioritize detector and graph-structure candidates as the core of the new packet
Affected Public surface: extractor contracts, graph schema, code-graph payloads
Risk/cost: medium

### Finding 2 — Routing-surface nudges and pointer-style delivery must be separated from graph-local upgrades
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/research/research.md:84-102] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-graph-first-routing-nudge/spec.md:58-67]
What it does: `003-contextador` keeps the ergonomic appeal of a routing facade, but its pointer-first delivery is explicitly weaker than Public's typed graph/semantic/memory surfaces. `008` already owns the advisory routing-hint lane on shared startup/resume/response surfaces.
Why it matters for Public's Code Graph MCP: A new code-graph upgrade packet should not adopt pointer-shaped delivery and should avoid any startup-surface hint that belongs in `008`.
Evidence type: source-confirmed
Recommendation: keep routing-facade work as prototype-later and reject pointer serialization as a graph response model
Affected Public surface: graph query UX boundaries
Risk/cost: medium

## Recommended Next Focus
Move into the detector lane and score the concrete patterns that can improve graph fidelity without requiring a new graph owner.

## Metrics
- newInfoRatio: 0.69
- findingsCount: 2
- focus: "iteration 22: candidate classification and owner separation"
- status: insight
