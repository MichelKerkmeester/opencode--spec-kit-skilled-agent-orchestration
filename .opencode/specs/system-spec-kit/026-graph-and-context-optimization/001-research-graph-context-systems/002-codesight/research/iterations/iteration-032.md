# Iteration 32 — Upgrade decision matrix consolidation

## Focus
Assemble the cross-phase detector, structure, query-surface, and hook-routing candidates into one ranked code-graph upgrade matrix.

## Findings

### Finding 1 — The matrix naturally separates into five adopt-now, several prototype-later, and a small explicit reject/defer set
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/research/research.md:711-734] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/research/research.md:74-90] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/research/research.md:84-112] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/research.md:107-129]
What it does: The cross-phase evidence converges on a stable prioritization: detector provenance, blast-radius hardening, hot-file breadcrumbs, and evidence-tagged edges are near-term; clustering, routing facades, graph feedback loops, and export contracts are later; pointer delivery and packet-008 overlap items are rejects or deferrals.
Why it matters for Public's Code Graph MCP: This gives the packet proposal a concrete and bounded scope rather than a grab bag of loosely related ideas.
Evidence type: synthesis-derived
Recommendation: use the matrix as the governing artifact for the proposal
Affected Public surface: proposed packet scope and priority tiers
Risk/cost: low

## Recommended Next Focus
Translate the matrix into a packet-ready `spec.md` skeleton with tasks, acceptance criteria, and risk controls.

## Metrics
- newInfoRatio: 0.71
- findingsCount: 1
- focus: "iteration 32: upgrade decision matrix consolidation"
- status: thought
