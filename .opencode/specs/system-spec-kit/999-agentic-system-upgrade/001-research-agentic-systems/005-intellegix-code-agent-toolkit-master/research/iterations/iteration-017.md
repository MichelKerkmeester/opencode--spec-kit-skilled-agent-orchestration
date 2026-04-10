# Iteration 017 — Operator Surface Consolidation

Date: 2026-04-10

## Research question
Does the external repo's operator-first command UX suggest that `system-spec-kit` exposes too much internal layering to users when they invoke deep research and related workflows?

## Hypothesis
Yes, at least partially. The local system is more capable, but it also exposes command docs, YAML assets, skills, and gate-routing expectations as separate conceptual layers. The external repo makes the operator surface feel flatter.

## Method
I compared the external repo's operator-facing orchestrator surfaces with the local deep-research command and gate-routing model. I looked for places where internal implementation layers leak into what the user has to understand.

## Evidence
- `[SOURCE: external/README.md:11-17]` The external README presents a compact operator-facing feature surface: loop driver, commands, orchestrator suite, council automation, browser bridge, and portfolio governance.
- `[SOURCE: external/commands/orchestrator.md:1-24]` The external orchestrator command reads as one user-facing workflow with role boundaries and one-loop rules embedded directly in the command.
- `[SOURCE: .opencode/command/spec_kit/deep-research.md:166-173]` The local deep-research command explicitly routes execution through separate YAML assets.
- `[SOURCE: .opencode/command/spec_kit/deep-research.md:216-224]` It then sends the operator to multiple skill references for protocol details.
- `[SOURCE: AGENTS.md:174-179]` Non-trivial tasks also require explicit skill routing via `skill_advisor.py`.

## Analysis
This is not a correctness problem; it is a UX layering problem. The local architecture is modular in a good way, but that modularity leaks into the operator experience. A user or maintainer often has to mentally combine command docs, YAML workflow behavior, skill references, and gate expectations to understand one end-to-end flow. The external repo does less, but it presents more of that flow in a single operator-facing surface.

The likely right move is not to reduce modularity internally. It is to generate or curate flatter operator views on top of the modular internals. `system-spec-kit` commands should feel like stable public interfaces, while YAML assets and supporting references stay implementation details unless someone is debugging or extending them.

## Conclusion
confidence: medium

finding: `system-spec-kit` should simplify its public operator surface by publishing more generated, single-surface workflow views for commands such as deep-research, while keeping the underlying modular internals.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`, command README surfaces, future generated operator docs
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** decide which command internals remain implementation details and which must stay public
- **Priority:** nice-to-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Users encounter commands, YAML assets, skills, and routing policy as distinct conceptual layers.
- **External repo's approach:** Operator workflows are flatter and more directly narrated at the command surface.
- **Why the external approach might be better:** It lowers onboarding friction and makes complex automation flows easier to use without studying internal plumbing.
- **Why system-spec-kit's approach might still be correct:** The modular layering is powerful for maintenance and reuse, especially across many runtimes and workflows.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Generate an operator-facing command card or README per major workflow that explains the public contract without requiring users to traverse YAML and skill internals.
- **Blast radius of the change:** medium
- **Migration path:** Start with deep-research and deep-review, then apply the same generated surface pattern to other high-ceremony commands.

## Counter-evidence sought
I looked for a single local operator surface that already flattened command plus skill plus asset behavior into one concise contract. I found pieces, but not one clear generated public view.

## Follow-up questions for next iteration
- Should this consolidation happen as docs only, or should command metadata become machine-readable enough to generate those operator views?
- Which parts of the current operator surface belong to phase `003` more than phase `005`?
- Would better runtime observability reduce the need for users to understand internal layers at all?
