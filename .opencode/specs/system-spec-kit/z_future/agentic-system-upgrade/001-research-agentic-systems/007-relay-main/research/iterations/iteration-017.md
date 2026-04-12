# Iteration 017 — Simplify the Operator Surface

Date: 2026-04-10

## Research question
Does Relay's top-level UX suggest that `system-spec-kit` exposes too many internal specialist concepts to operators, and should it compress the front-door mental model?

## Hypothesis
Relay's two-mode introduction is easier to teach than Public's many-role front door, even if the underlying implementation remains specialized.

## Method
Read Relay's introduction docs and compared the top-level user framing with Public's orchestrator and agent-routing documentation.

## Evidence
- Relay starts with two user-comprehensible modes: `Orchestrate` for spawning/managing agents and `Communicate` for putting an existing framework agent on the relay. [SOURCE: external/docs/introduction.md:2-6] [SOURCE: external/docs/introduction.md:15-49]
- Relay then uses three recognizable coordination verbs (`team`, `fan-out`, `pipeline`) to describe multi-agent behavior. [SOURCE: external/docs/introduction.md:67-89]
- Public's orchestrator documentation foregrounds a large roster of specialist agents, tiering, routing rules, depth constraints, and dispatch protocol details. [SOURCE: .opencode/agent/orchestrate.md:91-118] [SOURCE: .opencode/agent/orchestrate.md:152-183] [SOURCE: .opencode/agent/orchestrate.md:191-212]
- Public's top-level doctrine also names many workflow families and maintenance surfaces (`spec_kit:*`, `memory:*`, deep research/review, shared memory, constitutional memory, etc.), which is powerful but cognitively dense. [SOURCE: AGENTS.md:150-155] [SOURCE: AGENTS.md:233-252]

## Analysis
This is more of a UX layering issue than a core-architecture flaw. Public's specialist agents are probably justified internally. The operator problem is that the public-facing mental model is closer to the implementation topology than to the tasks users actually want done. Relay demonstrates the value of a simpler narrative layer over a richer engine.

## Conclusion
confidence: medium
finding: Public should simplify its external operator surface to a small number of top-level modes and let specialist agents stay mostly behind the curtain. This is a clarity win, not a demand to collapse the agent architecture itself.

## Adoption recommendation for system-spec-kit
- **Target file or module:** top-level docs and command surfaces that introduce orchestration, delegation, and packet workflows
- **Change type:** documentation simplification
- **Blast radius:** medium
- **Prerequisites:** decide the 2-4 operator-facing modes that best map onto current system behavior
- **Priority:** nice-to-have (adopt now)

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** The front door exposes many internal roles and workflow subsystems directly.
- **External repo's approach:** The front door compresses capability into a few memorable modes and verbs.
- **Why the external approach might be better:** It reduces onboarding cost and helps users choose a path without understanding the whole implementation.
- **Why system-spec-kit's approach might still be correct:** Power users and maintainers benefit from direct access to the underlying specialist model.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Reframe top-level docs around a few entry modes, while relegating specialist agent rosters and routing details to advanced reference material.
- **Blast radius of the change:** medium
- **Migration path:** First rewrite intros and command catalogs, then audit prompts and runbooks so they reference the simpler mental model consistently.

## Counter-evidence sought
Looked for Relay docs that required users to understand its full internal topology before first use; the reviewed intro instead optimized for immediate task framing.

## Follow-up questions for next iteration
- What are the best top-level modes for Public: implement/research/review, or something else?
- Which current docs are the noisiest first-run entry points?
- Can simplified operator modes coexist with advanced power-user docs cleanly?
