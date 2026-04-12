# Iteration 21 — Gap analysis against the current 026 DAG

## Focus
Map the current 026 parent DAG and the scoped `008` / `011` packets against the surviving cross-phase graph findings to determine which code-graph-shaped recommendations are still unowned.

## Findings

### Finding 1 — The current DAG hardens trust and routing, but it does not yet own detector or graph-structure upgrades
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:9-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md:58-67] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/z_archive/research-governance-contracts/011-graph-payload-validator-and-trust-preservation/spec.md:61-72]
What it does: The parent DAG currently assigns graph-adjacent work to `011` for fail-closed trust validation and to `008` for readiness-gated advisory routing hints on existing surfaces.
Why it matters for Public's Code Graph MCP: That leaves a clean gap for graph-local detector, schema, blast-radius, clustering, and export upgrades as long as they do not recreate either packet's owner seam.
Evidence type: source-confirmed
Recommendation: proceed with a graph-upgrade lane that starts from detector and graph-local query work, not routing-surface or validator work
Affected Public surface: 026 roadmap placement for a new code-graph child packet
Risk/cost: low

### Finding 2 — The parent synthesis already narrowed the remaining value to bounded graph-quality improvements rather than subsystem replacement
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/research.md:30-35]
What it does: The master synthesis says the surviving near-term moves are topology-preserving: structural nudges, validator-backed payloads, detector rigor, and bounded hardening on current owners.
Why it matters for Public's Code Graph MCP: The new charter should be framed as additive graph-quality work on the current substrate, not a proposal for a second graph platform.
Evidence type: source-confirmed
Recommendation: keep the roadmap explicitly additive and current-owner-preserving
Affected Public surface: code-graph upgrade charter framing
Risk/cost: low

## Recommended Next Focus
Classify every surviving cross-phase candidate into detector, structure, query-surface, or hook-routing lanes, then explicitly mark which ones are blocked by `008` or `011`.

## Metrics
- newInfoRatio: 0.74
- findingsCount: 2
- focus: "iteration 21: gap analysis against current DAG"
- status: insight
