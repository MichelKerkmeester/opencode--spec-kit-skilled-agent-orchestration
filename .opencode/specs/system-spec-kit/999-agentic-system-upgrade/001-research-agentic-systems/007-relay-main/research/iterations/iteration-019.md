# Iteration 019 — Keep Specialized Deep Loops

Date: 2026-04-10

## Research question
Should `system-spec-kit` replace its specialized deep-research and deep-review loops with a Relay-style general workflow DSL and swarm-pattern engine?

## Hypothesis
No. A shared kernel is useful, but a full pivot to Relay's general workflow abstraction would overshoot Public's needs and blur domain-specific governance.

## Method
Read Relay's workflow coordinator, state store, and workflow docs, then compared them with Public's deep-research and deep-review skill contracts.

## Evidence
- Relay's workflow layer supports many pattern heuristics and topology shapes (`dag`, `consensus`, `map-reduce`, `red-team`, `pipeline`, `fan-out`, and more). [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:47-64] [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:67-164]
- Relay also includes a generic workflow state store with optional consensus-gated writes, namespaces, TTLs, and run-scoped key/value persistence. [SOURCE: external/packages/sdk/src/workflows/state.ts:1-7] [SOURCE: external/packages/sdk/src/workflows/state.ts:42-54] [SOURCE: external/packages/sdk/src/workflows/state.ts:71-131]
- Public's deep-research skill is intentionally narrow: one focus per iteration, externalized state, quality guards, findings registry, and final reducer-owned synthesis. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:179-222] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:229-255]
- Public's deep-review skill is likewise narrow and domain-specific: review dimensions, P0/P1/P2 findings, lineage-aware reducer contract, and strict read-only review rules. [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:216-285] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:307-333]
- Relay's generality is a feature for many workflow types, but it also brings pattern-selection and state-system complexity that Public does not need on every research or review run. [SOURCE: external/packages/sdk/src/workflows/README.md:256-260] [SOURCE: external/packages/sdk/src/workflows/coordinator.ts:190-240]

## Analysis
Iteration 011 argued for a shared loop kernel. This iteration sets the boundary: the kernel should remain specialized to Public's iterative packet workflows, not become a generic swarm-workflow product. Relay's workflow engine is broader because it serves a broader runtime. Public's deep loops benefit from being opinionated about evidence, severity, reducer ownership, and packet artifacts.

## Conclusion
confidence: high
finding: Public should reject a pivot to Relay's full generic workflow DSL. Share loop machinery where duplication exists, but keep the specialized deep-loop abstractions and domain contracts.

## Adoption recommendation for system-spec-kit
- **Target file or module:** architectural boundary only
- **Change type:** rejected
- **Blast radius:** architectural if attempted, so avoid
- **Prerequisites:** none
- **Priority:** rejected

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Specialized iterative products for research and review, each with strong domain contracts.
- **External repo's approach:** One broader workflow DSL with many swarm patterns and a generic state subsystem.
- **Why the external approach might be better:** It is reusable across many workflow shapes and centralizes orchestration mechanics.
- **Why system-spec-kit's approach might still be correct:** Public's deep loops are governance-rich and domain-specific; genericizing too far would weaken clarity and raise operator complexity.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** N/A. Keep specialized deep loops; only extract shared mechanics behind them.
- **Blast radius of the change:** architectural if pursued, so do not pursue
- **Migration path:** No DSL pivot. Refactor internals only.

## Counter-evidence sought
Looked for strong evidence that Relay's generic workflow layer already models Public's review severities, packet artifacts, and governance-specific reducer ownership; the reviewed files did not show that depth of domain specialization.

## Follow-up questions for next iteration
- What is the minimum shared kernel that avoids duplication without introducing a general DSL?
- Which deep-loop behaviors are truly product-specific and should stay specialized?
- How should Public document this non-goal so future implementation packets do not overreach?
