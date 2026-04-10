# Iteration 020 — Absence As Signal: What Should Stay Different?

Date: 2026-04-10

## Research question
What does Agent Lightning's absence of spec folders, constitutional memory, and conversational gates imply about which parts of `system-spec-kit` should stay fundamentally different?

## Hypothesis
The strongest Phase 2 insight will be a boundary-setting one: some of Public's complexity is justified by its mission, so the right move is selective simplification rather than wholesale imitation.

## Method
I synthesized the external repo's overall shape, docs model, CLI, optional groups, examples, and contributor guide, then compared that to Public's gates, spec-folder lifecycle, deep-loop architecture, and memory model.

## Evidence
- Agent Lightning presents itself as a code/runtime framework: one CLI entrypoint, audience-based docs, examples catalog, and standard contributor commands. [SOURCE: external/pyproject.toml:50-53] [SOURCE: external/docs/index.md:14-23] [SOURCE: external/examples/README.md:7-18] [SOURCE: external/AGENTS.md:11-16]
- The external repo's architecture is centered on training-time execution concerns such as runners, tracers, stores, and algorithms. [SOURCE: external/AGENTS.md:3-9] [SOURCE: external/agentlightning/store/base.py:104-124]
- `system-spec-kit` is centered on a different mission: spec folders, explicit gates, documentation levels, memory preservation, and deep-loop coordination. [SOURCE: AGENTS.md:159-186] [SOURCE: AGENTS.md:233-250] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-27]
- Public's deep-research and deep-review workflows are explicitly packet-oriented and artifact-oriented rather than runtime-service oriented. [SOURCE: .opencode/command/spec_kit/deep-research.md:147-173] [SOURCE: .opencode/agent/deep-research.md:46-60]

## Analysis
The external repo is valuable precisely because it highlights where imitation would be wrong. Agent Lightning does not need spec packets, constitutional memory, or conversational scope binding because it is not trying to preserve AI work context across sessions, enforce documentation contracts, or coordinate complex operator-driven workflows. `system-spec-kit` does need those things.

So the Phase 2 answer is not "delete the special machinery." It is "separate mission-essential machinery from ceremonial or overexposed machinery." Public should keep the parts that enforce scope, auditability, packet-locality, and durable context. It should simplify the parts that make users feel like they must understand the implementation before they can use the system.

## Conclusion
confidence: high

finding: Agent Lightning validates `system-spec-kit`'s core mission-specific architecture more than it invalidates it. Public should keep spec folders, file-first memory, and explicit scope binding, while simplifying operator-visible ceremony, command exposure, validator implementation shape, and agent-taxonomy sprawl.

## Adoption recommendation for system-spec-kit
- **Target file or module:** overall product direction
- **Change type:** boundary-setting synthesis
- **Blast radius:** architectural
- **Prerequisites:** none beyond agreeing on the distinction between mission-essential and ceremonial complexity
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** A specialized system for AI-assisted work coordination, context preservation, and scoped documentation.
- **External repo's approach:** A specialized system for runtime instrumentation, training, and developer-facing examples/docs.
- **Why the external approach might be better:** It is lighter, more direct, and better at hiding its internal complexity from casual users.
- **Why system-spec-kit's approach might still be correct:** Public solves a different class of problem that truly requires scope binding, packet-local artifacts, and durable context surfaces.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** n/a
- **Blast radius of the change:** n/a
- **Migration path:** n/a

## Counter-evidence sought
I looked for evidence that Public's core architecture is mostly ceremonial and that a code-framework-style UX would serve the same job, but the external repo does not solve Public's coordination problem. The stronger evidence points toward selective simplification at the edges, not architectural self-erasure.

## Follow-up questions for next iteration
- Which Phase 2 recommendations should become follow-on packets first?
- How can Public simplify operator experience without weakening scope or memory guarantees?
- Where should the boundary between internal governance and user-facing docs be codified?
