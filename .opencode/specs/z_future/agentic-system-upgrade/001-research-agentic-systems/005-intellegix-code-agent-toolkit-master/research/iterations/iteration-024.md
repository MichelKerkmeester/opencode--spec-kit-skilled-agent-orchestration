# Iteration 024 — Merge The Default Agent Roster Down To A Smaller Core

Date: 2026-04-10

## Research question
Is the current 10+ agent roster the right default granularity for `system-spec-kit`, or should parts of it be merged to reduce operator and maintainer overhead?

## Hypothesis
It should be merged. The local system has valuable specialization, but too many roles are close enough to feel like implementation of the same concern rather than genuinely distinct operator concepts.

## Method
I compared the local orchestrator's routing table and related specialist agents with the external repo's flatter agent partitioning. I focused on whether each local role buys a distinct user-facing benefit.

## Evidence
- `[SOURCE: .opencode/agent/orchestrate.md:24-36]` The local orchestrator claims full authority over decomposition, delegation, evaluation, conflict resolution, and synthesis, while forbidding direct implementation.
- `[SOURCE: .opencode/agent/orchestrate.md:93-106]` The orchestrator routes among a large priority table including `@context-prime`, `@context`, `@deep-research`, `@ultra-think`, `@speckit`, `@review`, `@write`, `@general`, `@debug`, and `@handover`.
- `[SOURCE: .opencode/agent/context.md:25-32]` `@context` is the exclusive entry point for all exploration and retrieval tasks.
- `[SOURCE: .opencode/agent/context-prime.md:22-40]` `@context-prime` exists as a lightweight bootstrap specialist for first-turn and `/clear` recovery.
- `[SOURCE: .opencode/agent/handover.md:22-32]` `@handover` exists as a separate continuation-document specialist.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/agents/orchestrator.md:15-23]` The external repo's primary orchestrator role is narrower and avoids a similarly large public roster.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/agents/research.md:15-22]` The external repo treats research as one focused specialist rather than splitting bootstrap, context, and handoff into multiple related surfaces.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/agents/orchestrator-multi.md:15-25]` Even the external multi-agent mode stays centered on a smaller set of responsibilities: split, launch, monitor, merge, report.

## Analysis
The local roster has two types of specialization mixed together. Some roles are truly distinct: review, writing, debugging, and deep-research/deep-review have clearly different outputs. Other roles are specializations of session context handling: bootstrap, retrieval, handover, and some of the orchestration preamble. Those are legitimate internal modules, but they are not strong enough to justify all being first-class agent identities forever.

The external repo is not a perfect target because it is narrower and less governed. Still, it proves that a flatter role map is easier to reason about. The local system should preserve the special roles that materially change outputs, while merging session-context roles into a smaller default agent core.

## Conclusion
confidence: high

finding: `system-spec-kit` should merge its default agent roster down to a smaller core by collapsing closely related session-context roles while retaining truly distinct specialist agents.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`, `.opencode/agent/context.md`, `.opencode/agent/context-prime.md`, `.opencode/agent/handover.md`
- **Change type:** should-have
- **Blast radius:** agent-system
- **Prerequisites:** define which roles remain first-class and which become internal behaviors
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** The agent roster exposes many adjacent roles, especially around context loading, bootstrapping, and continuation.
- **External repo's equivalent surface:** The external repo keeps a flatter role map, with fewer public identities and clearer differences between them.
- **Friction comparison:** The local system is more expressive, but harder to remember and maintain. The external repo is less nuanced, but simpler to route mentally.
- **What system-spec-kit could DELETE to improve UX:** Delete separate default public identities for overlapping session-context concerns.
- **What system-spec-kit should ADD for better UX:** Add a clear "core roster" concept with a smaller default set and an advanced specialist layer behind it.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for evidence that operators benefit from distinguishing bootstrap, retrieval, and continuation as separate named agents in normal workflows. I did not find a strong external parallel.

## Follow-up questions for next iteration
- Which agent identities change outputs enough to stay first-class?
- Can bootstrap and continuation become command or hook behaviors instead of separate agent names?
- How much of the roster only exists because prompts, not runtime modules, own too much policy?
