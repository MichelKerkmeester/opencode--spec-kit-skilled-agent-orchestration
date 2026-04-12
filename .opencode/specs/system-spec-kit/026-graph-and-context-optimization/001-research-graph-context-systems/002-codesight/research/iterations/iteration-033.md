# Iteration 33 — Packet proposal draft: scope and requirements

## Focus
Draft the first half of the packet-ready proposal: problem, purpose, scope, requirements, and success criteria for a new code-graph-upgrades child packet.

## Findings

### Finding 1 — The new packet should be framed as a post-R5/R6 side branch on the current Code Graph MCP owner
Source: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:9-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/z_archive/research-governance-contracts/011-graph-payload-validator-and-trust-preservation/spec.md:61-72] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/z_archive/research-governance-contracts/008-graph-first-routing-nudge/spec.md:58-67]
What it does: The parent DAG and the scoped packet specs make it clear that the new lane should depend on the regression and trust packets while staying distinct from `008`'s routing-surface work.
Why it matters for Public's Code Graph MCP: That placement gives the new packet a clean problem statement: improve detector fidelity, graph schema richness, and graph-local query behavior after the trust and test floors exist.
Evidence type: source-confirmed
Recommendation: draft the packet as `005-code-graph-upgrades` with P0 scope limited to graph-local detector, schema, and query work
Affected Public surface: 026 packet proposal placement
Risk/cost: low

## Recommended Next Focus
Complete the proposal with tasks, acceptance criteria, risks, and DAG notes so it can be lifted into a new packet folder later.

## Metrics
- newInfoRatio: 0.63
- findingsCount: 1
- focus: "iteration 33: packet proposal draft scope and requirements"
- status: thought
