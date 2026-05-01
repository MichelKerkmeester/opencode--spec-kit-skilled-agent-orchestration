# Iteration 017 — Agent Role Taxonomy Versus Capability Layers

Date: 2026-04-10

## Research question
Does Agent Lightning's runner/tracer/adapter/algorithm/store split suggest that `system-spec-kit`'s agent architecture is too role-specific and should be simplified around capabilities?

## Hypothesis
The external repo likely separates system concerns by capability boundary rather than by a large family of named operator roles. If so, Public may be over-indexing on named agents where a smaller capability model would be cleaner.

## Method
I compared the external repo's architecture and module structure with `system-spec-kit`'s orchestrator routing table and deep-research loop contract.

## Evidence
- Agent Lightning's architecture overview is capability-layered: runners and tracers emit spans, the store keeps them synchronized, and algorithms consume traces to improve behavior. [SOURCE: external/AGENTS.md:3-9]
- The external project structure groups modules by function: adapters, execution stack, training loop, tracer, reward logic, CLI, docs, examples, dashboard, scripts, and tests. [SOURCE: external/AGENTS.md:6-9]
- `system-spec-kit`'s orchestrator frames work around a sizable named-agent taxonomy: `@context-prime`, `@context`, `@deep-research`, `@ultra-think`, `@speckit`, `@review`, `@write`, `@general`, `@debug`, and `@handover`. [SOURCE: .opencode/agent/orchestrate.md:93-118]
- The orchestrator also carries depth rules, agent-definition loading rules, and structured delegation metadata so those role boundaries can be maintained. [SOURCE: .opencode/agent/orchestrate.md:108-167] [SOURCE: .opencode/agent/orchestrate.md:191-227]
- The deep-research agent is itself a specialized role with read/write permissions, reducer-owned boundary rules, and loop-specific state semantics. [SOURCE: .opencode/agent/deep-research.md:22-32] [SOURCE: .opencode/agent/deep-research.md:46-60]

## Analysis
Public's named agents solve real workflow problems, especially around spec authoring and review isolation. But the comparison to Agent Lightning shows that capability boundaries can stay strong without proliferating many user-visible or architecture-visible role names. The external repo does not need a distinct named subsystem for every workflow nuance; it composes a smaller set of capabilities.

That suggests a simplification opportunity. Public can preserve specialized prompt overlays where they matter, while reducing the conceptual architecture to a smaller set of core capabilities: retrieve, plan, write, execute, review. Many existing named agents then become policy modes or presets layered on top of those primitives rather than permanent first-class architecture categories.

## Conclusion
confidence: medium

finding: `system-spec-kit` should simplify its agent architecture around capability layers rather than letting the named-role taxonomy keep expanding. The current role split is workable, but the architecture is starting to encode workflow history as permanent topology.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md` and agent taxonomy
- **Change type:** architecture simplification
- **Blast radius:** large
- **Prerequisites:** identify capability-equivalent agents, define which roles remain truly exclusive, and preserve prompt specializations as overlays
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Many named agents encode task kinds, workflow stages, and exclusivity rules.
- **External repo's approach:** Functional boundaries are capability-oriented and module-oriented rather than role-taxonomy-oriented.
- **Why the external approach might be better:** It reduces conceptual sprawl, makes architecture easier to reason about, and discourages role multiplication as new workflows appear.
- **Why system-spec-kit's approach might still be correct:** Some Public roles really do need hard isolation and special permissions, especially spec authoring and deep-review/deep-research packet writes.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Collapse the mental model to a few core capability classes and treat many current named agents as policy presets or overlays rather than separate architectural species.
- **Blast radius of the change:** large
- **Migration path:** Start with documentation and routing tables: define canonical capability groups, map current agents to them, then consolidate only where prompts and permissions truly overlap.

## Counter-evidence sought
I looked for evidence that the current named-agent taxonomy is already stable and minimal, but the orchestrator contract has grown into a substantial routing and dispatch framework. I also looked for evidence that Agent Lightning's simpler capability grouping would obviously fail under Public's governance constraints, and the strongest counterexamples are the genuinely exclusive roles rather than the broader taxonomy as a whole.

## Follow-up questions for next iteration
- If Public simplifies agent categories, should tool exposure also be grouped into capability profiles?
- Which current agents are truly irreplaceable as separate identities?
- Can packet-local exclusivity survive even if the higher-level taxonomy shrinks?
